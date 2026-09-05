import { NextResponse } from "next/server";
import { isValidClaimToken } from "@/lib/property";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { getVerifiedUser } from "@/lib/server-auth";
import { isStorable, NEXT_STEP, STORABLE_STAGES } from "@/lib/lifecycle";

/**
 * One property, with everything known about it.
 *
 * The list endpoint next door returns every property behind a claim token,
 * which is what the vault list needs and nothing else can use: there was no
 * way to ask for a single property, so there could be no page for one. A
 * property could be analysed, scored and saved, and then only ever seen again
 * as a row in a list.
 *
 * ── Two kinds of owner ─────────────────────────────────────────────────────
 *
 * A property belongs either to a signed-in user or to an anonymous claim
 * token, never both — pv_property_has_one_owner enforces it. So this accepts
 * either credential and matches on the corresponding column.
 *
 * The match is the authorisation. The row is fetched with the service role,
 * which bypasses RLS, so the filter has to carry the whole weight: never
 * fetch by id and then compare owners in JavaScript, because a mistake there
 * reads as a working page while serving somebody else's property.
 *
 * ── Why a missing property and a forbidden one look identical ──────────────
 *
 * Both return 404. Distinguishing them would let anyone with an id learn
 * whether it exists, and these ids are handed to browsers.
 *
 * ── A note for anyone developing this locally ──────────────────────────────
 *
 * `next dev` cannot resolve /api/vault/property/ while this dynamic child
 * exists: trailingSlash is on, and the dev server reads the trailing slash as
 * an empty [id] rather than as the collection, so listing and saving both 404.
 *
 * `next build` resolves it correctly, which was verified by running the
 * production build locally and getting 400 "Expected a vault token." from the
 * collection. /api/tenant/issues has had the same shape in production for
 * some time and works. So this is a dev-server quirk to know about, not a
 * reason to move the route somewhere less obvious.
 */

export const maxDuration = 15;

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

/** A uuid, checked before it reaches a query string. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SELECT =
  "id,address,postcode,property_type,bedrooms,asking_price,stage,source,source_ref," +
  "created_at,updated_at," +
  "pv_evidence(field,state,value_num,value_text,value_low,value_high,source,source_url,method,checked_at)," +
  "pv_analysis(score,band,components_scored,computed,created_at)";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const e = env();
  if (!e) return NextResponse.json({ error: "The vault is temporarily unavailable." }, { status: 503 });

  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const limited = await rateGuard(request, RULES.vaultReadPerCaller, RULES.vaultReadGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  const ownerFilter = await ownerFilterFor(request);
  if (!ownerFilter) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const res = await fetch(
      `${e.url}/rest/v1/pv_property?id=eq.${id}&${ownerFilter}` +
      `&select=${encodeURIComponent(SELECT)}&limit=1`,
      {
        headers: {
          apikey: e.key,
          Authorization: `Bearer ${e.key}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) throw new Error(`read ${res.status}`);

    const rows = (await res.json()) as Record<string, unknown>[];
    const property = rows[0];
    if (!property) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    // Newest analysis first, so the page does not have to sort a nested array
    // to find the current score.
    const runs = property.pv_analysis as { created_at: string }[] | undefined;
    if (Array.isArray(runs)) {
      runs.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return NextResponse.json({ property });
  } catch (err) {
    // Upstream messages carry connection strings and row contents.
    console.error("property read failed:", err);
    return NextResponse.json({ error: "Could not load that property." }, { status: 502 });
  }
}

/**
 * The PostgREST filter that limits a query to rows the caller owns, or null
 * when no usable credential was offered.
 *
 * Shared by GET and PATCH deliberately. This filter *is* the authorisation —
 * the row is fetched with the service role, which bypasses RLS — so two
 * handlers each building their own version is precisely how one of them ends
 * up subtly weaker than the other. That is the shape of nearly every access
 * bug already found in this codebase.
 *
 * A signed-in user takes precedence: if someone presents both credentials the
 * account is the stronger claim, and the token is ignored rather than used as
 * a fallback.
 */
async function ownerFilterFor(request: Request): Promise<string | null> {
  const user = await getVerifiedUser(request);
  if (user) return `user_id=eq.${encodeURIComponent(user.id)}`;

  const token = request.headers.get("x-vault-token");
  if (!isValidClaimToken(token)) return null;
  return `claim_token=eq.${encodeURIComponent(token!)}`;
}

/**
 * Moving a property along its lifecycle.
 *
 * Until now pv_property.stage was written once, at insert, and never again —
 * every vaulted property sat on 'screening' for ever while the record page
 * drew a lifecycle bar around it. A progress indicator nobody can advance is
 * worse than none: it implies the platform is tracking something it is not.
 *
 * No transition graph. Someone may vault a property they already own, or pull
 * out at any point, and a rule saying they cannot go from 'screening' to
 * 'purchased' would be an invented constraint enforcing a tidiness that real
 * purchases do not have. The only rule is that the stage has to be one the
 * database will accept.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const e = env();
  if (!e) return NextResponse.json({ error: "The vault is temporarily unavailable." }, { status: 503 });

  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // A write, so it is metered against the save budget rather than the read one.
  const limited = await rateGuard(request, RULES.vaultSavePerCaller, RULES.vaultSaveGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const stage = (body as { stage?: unknown } | null)?.stage;
  if (typeof stage !== "string") {
    return NextResponse.json({ error: "Expected a stage." }, { status: 400 });
  }

  if (!isStorable(stage)) {
    // Told apart deliberately. A stage the model knows but cannot store yet is
    // a migration that has not run, and saying so beats "invalid stage" —
    // which would send someone hunting for a typo that is not there.
    const known = stage in NEXT_STEP;
    return NextResponse.json(
      {
        error: known
          ? "That stage is not available yet."
          : "That is not a stage.",
        stages: STORABLE_STAGES,
      },
      { status: 400 },
    );
  }

  const owner = await ownerFilterFor(request);
  if (!owner) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const res = await fetch(
      `${e.url}/rest/v1/pv_property?id=eq.${id}&${owner}`,
      {
        method: "PATCH",
        headers: {
          apikey: e.key,
          Authorization: `Bearer ${e.key}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ stage, updated_at: new Date().toISOString() }),
      },
    );
    if (!res.ok) throw new Error(`patch ${res.status}`);

    const rows = (await res.json()) as { id: string; stage: string }[];
    // No row came back, so the filter matched nothing: either the property does
    // not exist or it is not theirs. Same answer for both, as with GET.
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ id: rows[0].id, stage: rows[0].stage });
  } catch (err) {
    console.error("stage change failed:", err);
    return NextResponse.json({ error: "Could not update that property." }, { status: 502 });
  }
}
