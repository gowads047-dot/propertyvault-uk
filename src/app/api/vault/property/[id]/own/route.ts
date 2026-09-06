import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { getVerifiedUser } from "@/lib/server-auth";
import { userFilter } from "@/lib/vault-owner";

/**
 * The moment a property you were researching becomes a property you own.
 *
 * This is the join the platform was missing. pv_property tracked something you
 * were considering; rentura_properties represented something you already had;
 * nothing said the two might be the same house eighteen months apart. So the
 * evidence, the scores and the maximum-offer working built up while deciding
 * were stranded on the wrong side of the purchase, and the product read as two
 * tools rather than one place.
 *
 * Creating the managed property from the researched one carries what is known
 * across and sets pv_property.rentura_property_id, so the record you built
 * before buying stays attached to the thing you bought.
 *
 * ── Why this needs an account, and says so ─────────────────────────────────
 *
 * pv_property_link_needs_owner refuses a link on an anonymous row: a claim
 * that two records are the same house may only be made by somebody who owns
 * both sides of it. Rather than let Postgres reject that with a constraint
 * violation, the case is caught here and answered with what to do about it.
 *
 * ── Idempotent ─────────────────────────────────────────────────────────────
 *
 * Pressing the button twice is a person pressing a button twice, not an
 * attempt to own the house twice. An already-linked property returns its
 * existing link. The unique index catches the race between two concurrent
 * requests, and that 409 is turned into the same answer.
 */

export const maxDuration = 15;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

type Researched = {
  id: string;
  address: string | null;
  postcode: string | null;
  property_type: string | null;
  bedrooms: number | null;
  asking_price: number | null;
  rentura_property_id: string | null;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const e = env();
  if (!e) return NextResponse.json({ error: "This is temporarily unavailable." }, { status: 503 });

  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const limited = await rateGuard(request, RULES.vaultSavePerCaller, RULES.vaultSaveGlobal);
  if (limited) return NextResponse.json({ error: limited.error }, { status: limited.status });

  // An account specifically, not either credential. The row being created
  // belongs to a user, and the link constraint refuses an anonymous owner.
  const user = await getVerifiedUser(request);
  if (!user) {
    return NextResponse.json(
      {
        error: "Sign in first, and this property comes with you.",
        reason: "needs-account",
      },
      { status: 401 },
    );
  }

  const base = `${e.url}/rest/v1`;
  const owner = userFilter(user.id);

  try {
    // The filter is the authorisation: these queries run with the service
    // role, which bypasses RLS, so a property that is not theirs must not come
    // back at all rather than come back and be checked afterwards.
    const found = await fetch(
      `${base}/pv_property?id=eq.${id}&${owner}` +
      `&select=id,address,postcode,property_type,bedrooms,asking_price,rentura_property_id&limit=1`,
      { headers: headers(e.key) },
    );
    if (!found.ok) throw new Error(`read ${found.status}`);

    const property = ((await found.json()) as Researched[])[0];
    if (!property) return NextResponse.json({ error: "Not found." }, { status: 404 });

    if (property.rentura_property_id) {
      return NextResponse.json({ renturaPropertyId: property.rentura_property_id, created: false });
    }

    // address is NOT NULL on rentura_properties, and a vaulted property often
    // has only a postcode — somebody researching from a listing rarely types
    // the full address. The postcode is a truthful stand-in and the person can
    // correct it in Rentura; refusing the whole operation over it would be
    // worse than an imprecise label.
    const address = property.address ?? property.postcode;
    if (!address) {
      return NextResponse.json(
        { error: "This property has no address or postcode to carry across." },
        { status: 422 },
      );
    }

    const created = await fetch(`${base}/rentura_properties`, {
      method: "POST",
      headers: headers(e.key, { Prefer: "return=representation" }),
      body: JSON.stringify([{
        user_id: user.id,
        address,
        postcode: property.postcode,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        // What they were prepared to pay, not what they paid. Rentura shows it
        // as the purchase price and they can correct it at completion.
        purchase_price: property.asking_price,
      }]),
    });
    if (!created.ok) throw new Error(`create ${created.status}: ${(await created.text()).slice(0, 200)}`);

    const renturaPropertyId = ((await created.json()) as { id: string }[])[0]?.id;
    if (!renturaPropertyId) throw new Error("rentura property created but returned no id");

    const linked = await fetch(`${base}/pv_property?id=eq.${id}&${owner}`, {
      method: "PATCH",
      headers: headers(e.key, { Prefer: "return=representation" }),
      body: JSON.stringify({ rentura_property_id: renturaPropertyId, updated_at: new Date().toISOString() }),
    });

    if (linked.status === 409) {
      // Two requests raced and the unique index rejected the second. The other
      // one won, so read its answer rather than reporting a failure for what
      // is a double-click.
      const again = await fetch(
        `${base}/pv_property?id=eq.${id}&${owner}&select=rentura_property_id&limit=1`,
        { headers: headers(e.key) },
      );
      const existing = ((await again.json()) as { rentura_property_id: string | null }[])[0];
      if (existing?.rentura_property_id) {
        return NextResponse.json({ renturaPropertyId: existing.rentura_property_id, created: false });
      }
    }
    if (!linked.ok) throw new Error(`link ${linked.status}`);

    return NextResponse.json({ renturaPropertyId, created: true });
  } catch (err) {
    // Upstream messages carry connection strings and row contents.
    console.error("property own failed:", err);
    return NextResponse.json({ error: "Could not add that to your portfolio." }, { status: 502 });
  }
}
