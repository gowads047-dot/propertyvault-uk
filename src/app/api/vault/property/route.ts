import { NextResponse } from "next/server";
import { buildSave, type EvidenceRow } from "@/lib/vault-save";
import { isValidClaimToken } from "@/lib/property";
import { callerKey, consumeAll, supabaseStore, type RateLimitRule } from "@/lib/rate-limit";

/**
 * Saving a property to the vault, and reading it back.
 *
 * pv_property, pv_evidence and pv_analysis have been live since the schema
 * migration, with their constraints and RLS proven in production. Nothing
 * wrote to them: "Vault it" ran a full analysis and threw it away on refresh,
 * which made the page's name a promise it did not keep. This is that half.
 *
 * ── Why the token travels in a header ──────────────────────────────────────
 *
 * The claim token is a bearer credential — whoever holds it owns the
 * properties. A query string is the wrong place for one: it reaches access
 * logs, browser history and the Referer header on any outbound link. It goes
 * in X-Vault-Token instead, which none of those capture.
 *
 * ── Why this reads before it writes ────────────────────────────────────────
 *
 * The dedupe indexes are partial (`where claim_token is not null`), and
 * Postgres can only infer a partial index for ON CONFLICT when the statement
 * repeats its predicate — which PostgREST cannot express. So a save selects,
 * then updates or inserts. The race that leaves is a concurrent insert of the
 * same property, which the unique index rejects; that 409 is caught and turned
 * into an update rather than an error, because two saves of one property are a
 * user pressing a button twice, not a failure.
 */

const SAVE_LIMIT: RateLimitRule = { name: "vault-save", limit: 60, windowSeconds: 3600 };
const READ_LIMIT: RateLimitRule = { name: "vault-read", limit: 240, windowSeconds: 3600 };

export const maxDuration = 30;

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function limited(request: Request, url: string, key: string, rule: RateLimitRule) {
  const { allowed } = await consumeAll(supabaseStore(url, key), [
    { rule, caller: callerKey(request.headers) },
  ]);
  return !allowed;
}

export async function POST(request: Request) {
  const e = env();
  if (!e) return NextResponse.json({ error: "The vault is temporarily unavailable." }, { status: 503 });

  if (await limited(request, e.url, e.key, SAVE_LIMIT)) {
    return NextResponse.json({ error: "Too many saves. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const built = buildSave(body);
  if (!built.ok) return NextResponse.json({ error: built.error }, { status: 400 });
  const { claimToken, claimTokenIsNew, property, evidence, analysis } = built.value;

  const base = `${e.url}/rest/v1`;
  const match =
    `claim_token=eq.${encodeURIComponent(claimToken)}` +
    `&dedupe_key=eq.${encodeURIComponent(property.dedupe_key)}`;

  try {
    let id = await findProperty(base, e.key, match);

    if (id) {
      await patch(base, e.key, `pv_property?id=eq.${id}`, property);
    } else {
      const created = await insert(base, e.key, "pv_property", [property]);
      if (created === "conflict") {
        // Someone saved the same property between the select and the insert.
        id = await findProperty(base, e.key, match);
        if (!id) throw new Error("property conflicted but could not be found");
        await patch(base, e.key, `pv_property?id=eq.${id}`, property);
      } else {
        id = created;
      }
    }

    if (evidence.length > 0) {
      await insert(
        base, e.key,
        "pv_evidence?on_conflict=property_id,field",
        evidence.map((row: EvidenceRow) => ({ ...row, property_id: id, checked_at: new Date().toISOString() })),
        { Prefer: "resolution=merge-duplicates" },
      );
    }

    if (analysis) {
      await insert(base, e.key, "pv_analysis", [{ ...analysis, property_id: id }]);
    }

    return NextResponse.json({
      id,
      claimToken,
      // The client only needs to write the token down when it is new.
      claimTokenIsNew,
      evidenceSaved: evidence.length,
      analysisSaved: analysis != null,
    });
  } catch (err) {
    // Upstream messages carry connection strings and row contents.
    console.error("vault save failed:", err);
    return NextResponse.json({ error: "Could not save that property. Please try again." }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const e = env();
  if (!e) return NextResponse.json({ error: "The vault is temporarily unavailable." }, { status: 503 });

  const token = request.headers.get("x-vault-token");
  if (!isValidClaimToken(token)) {
    return NextResponse.json({ error: "Expected a vault token." }, { status: 400 });
  }

  if (await limited(request, e.url, e.key, READ_LIMIT)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const select =
    "id,address,postcode,property_type,bedrooms,asking_price,stage,updated_at," +
    "pv_evidence(field,state,value_num,value_text,source,method)," +
    "pv_analysis(score,band,components_scored,created_at)";

  try {
    const res = await fetch(
      `${e.url}/rest/v1/pv_property?claim_token=eq.${encodeURIComponent(token!)}` +
      `&select=${encodeURIComponent(select)}&order=updated_at.desc&limit=100`,
      { headers: headers(e.key) },
    );
    if (!res.ok) throw new Error(`list ${res.status}`);
    const rows = (await res.json()) as Record<string, unknown>[];

    // Newest analysis first, so the caller does not have to sort a nested array.
    for (const r of rows) {
      const runs = r.pv_analysis as { created_at: string }[] | undefined;
      if (Array.isArray(runs)) {
        runs.sort((a, b) => b.created_at.localeCompare(a.created_at));
      }
    }

    return NextResponse.json({ properties: rows });
  } catch (err) {
    console.error("vault list failed:", err);
    return NextResponse.json({ error: "Could not read your vault. Please try again." }, { status: 502 });
  }
}

// ── PostgREST helpers ──────────────────────────────────────────────────────

async function findProperty(base: string, key: string, match: string): Promise<string | null> {
  const res = await fetch(`${base}/pv_property?${match}&select=id&limit=1`, { headers: headers(key) });
  if (!res.ok) throw new Error(`find ${res.status}`);
  const rows = (await res.json()) as { id: string }[];
  return rows[0]?.id ?? null;
}

/** Returns the new id, or the string "conflict" when a unique index rejected it. */
async function insert(
  base: string, key: string, path: string, rows: unknown[], extra: Record<string, string> = {},
): Promise<string | "conflict"> {
  const res = await fetch(`${base}/${path}`, {
    method: "POST",
    headers: headers(key, { Prefer: `return=representation,${extra.Prefer ?? ""}`.replace(/,$/, "") }),
    body: JSON.stringify(rows),
  });
  if (res.status === 409) return "conflict";
  if (!res.ok) throw new Error(`insert ${path} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const out = (await res.json()) as { id?: string }[];
  return out[0]?.id ?? "";
}

async function patch(base: string, key: string, path: string, row: unknown): Promise<void> {
  const res = await fetch(`${base}/${path}`, {
    method: "PATCH",
    headers: headers(key),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`patch ${path} ${res.status}`);
}
