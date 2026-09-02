import { NextResponse } from "next/server";
import { lookupArea } from "@/lib/agent/tools";
import { fetchArea } from "@/lib/agent/area";
import { RULES, callerKey, consumeAll, supabaseStore, type RateLimitRule } from "@/lib/rate-limit";

/**
 * Sold prices for a postcode, for the Vault workspace.
 *
 * A browser cannot call HM Land Registry directly, so this proxies it. It
 * costs us nothing but an outbound request, hence a looser limit than the AI
 * routes — but a limit all the same, because an unmetered proxy to a public
 * API is still a way to get this origin blocked by that API.
 */
const PER_CALLER: RateLimitRule = { name: "vault-area", limit: 60, windowSeconds: 3600 };

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const { allowed } = await consumeAll(supabaseStore(url, key), [
      { rule: PER_CALLER, caller: callerKey(request.headers) },
      { rule: RULES.aiVerdictGlobal, caller: "all-area" },
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

  // lookupArea reports "missing" rather than throwing when nothing is found,
  // so an unknown postcode is a 200 with an honest empty result.
  return NextResponse.json(await lookupArea({ postcode }, fetchArea));
}
