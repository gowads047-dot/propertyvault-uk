import { NextResponse } from "next/server";
import { isValidClaimToken } from "@/lib/property";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { getVerifiedUser } from "@/lib/server-auth";

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

  // The owner filter, built from whichever credential was offered. A signed-in
  // user takes precedence: if someone presents both, the account is the
  // stronger claim and the token is ignored rather than used as a fallback.
  const user = await getVerifiedUser(request);
  let ownerFilter: string;

  if (user) {
    ownerFilter = `user_id=eq.${encodeURIComponent(user.id)}`;
  } else {
    const token = request.headers.get("x-vault-token");
    if (!isValidClaimToken(token)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    ownerFilter = `claim_token=eq.${encodeURIComponent(token!)}`;
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
