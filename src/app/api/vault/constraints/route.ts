import { NextResponse } from "next/server";
import { lookupConstraints } from "@/lib/agent/tools";
import { RULES, callerKey, consumeAll, supabaseStore, type RateLimitRule } from "@/lib/rate-limit";

/**
 * Planning constraints for a postcode, for the Vault workspace.
 *
 * Proxies planning.data.gov.uk, which a browser could call directly but which
 * would then need six cross-origin requests from the client. Doing it here is
 * one round trip and keeps the coverage caveat attached to the result.
 */
const PER_CALLER: RateLimitRule = { name: "vault-constraints", limit: 60, windowSeconds: 3600 };

export const maxDuration = 30;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const { allowed } = await consumeAll(supabaseStore(url, key), [
      { rule: PER_CALLER, caller: callerKey(request.headers) },
      { rule: RULES.aiVerdictGlobal, caller: "all-constraints" },
    ]);
    if (!allowed) {
      return NextResponse.json({ error: "Too many lookups. Try again later." }, { status: 429 });
    }
  }

  let postcode: unknown;
  try {
    postcode = (await request.json())?.postcode;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof postcode !== "string" || postcode.length > 12) {
    return NextResponse.json({ error: "Expected a UK postcode." }, { status: 400 });
  }

  // An unresolvable postcode is a 200 with found:false — the lookup ran and
  // found nothing, which is a different thing from the request being wrong.
  return NextResponse.json(await lookupConstraints({ postcode }));
}
