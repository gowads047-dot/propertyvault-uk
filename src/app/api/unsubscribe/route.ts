import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import { RULES, rateGuard } from "@/lib/rate-limit";

/**
 * Unsubscribe from the newsletter, in one click.
 *
 * POST is what a mail client sends when the reader presses its own
 * Unsubscribe button (RFC 8058, List-Unsubscribe-Post). GET is the link in
 * the email footer. Both take the address and its token from the query
 * string, both are idempotent, and neither needs a sign-in — the token is
 * the proof. A bad token is a 400 that says nothing about whether the
 * address exists.
 */
type Outcome = { ok: true } | { error: string; status: number };

async function unsubscribe(req: Request): Promise<Outcome> {
  const url = new URL(req.url);
  const email = (url.searchParams.get("e") ?? "").trim().toLowerCase();
  const token = url.searchParams.get("t") ?? "";
  if (!email || !verifyUnsubscribeToken(email, token)) {
    return { error: "This unsubscribe link is not valid.", status: 400 };
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) return { error: "Temporarily unavailable.", status: 503 };

  // eq, not ilike: both sides are stored and compared lower-cased already,
  // and ilike treats "_" and "%" in the address as wildcards — so a token
  // for jane_doe@example.com would also unsubscribe jane.doe@example.com.
  const { error } = await createClient(supabaseUrl, key)
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email);
  if (error) {
    console.error("Unsubscribe update failed:", error);
    return { error: "Temporarily unavailable.", status: 503 };
  }
  return { ok: true };
}

export async function POST(req: Request) {
  const limited = await rateGuard(req, RULES.unsubscribePerCaller, RULES.unsubscribeGlobal);
  if (limited) return NextResponse.json({ error: limited.error }, { status: limited.status });
  const result = await unsubscribe(req);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
}

const page = (ok: boolean) => {
  const title = ok ? "You're unsubscribed." : "That link isn't valid.";
  const body = ok
    ? "You won't get any more emails from PropertyVault UK. If you enquire about a service later, we will still reply to that."
    : 'It may have been altered on the way. Email <a href="mailto:info@propertyvaultuk.co.uk">info@propertyvaultuk.co.uk</a> and we will remove you by hand.';
  return [
    '<!doctype html><html lang="en-GB"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">',
    `<title>${ok ? "Unsubscribed" : "Link not valid"} — PropertyVault UK</title>`,
    "<style>body{margin:0;font-family:system-ui,sans-serif;background:#0f1b36;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}",
    "main{max-width:440px;text-align:center}h1{font-size:24px;margin:0 0 12px}p{color:rgba(255,255,255,.75);line-height:1.6;margin:0 0 20px}a{color:#f4d35e}</style></head>",
    `<body><main><h1>${title}</h1><p>${body}</p><p><a href="https://www.propertyvaultuk.co.uk/">Back to the site</a></p></main></body></html>`,
  ].join("");
};

export async function GET(req: Request) {
  const limited = await rateGuard(req, RULES.unsubscribePerCaller, RULES.unsubscribeGlobal);
  if (limited) return NextResponse.json({ error: limited.error }, { status: limited.status });
  const result = await unsubscribe(req);
  const ok = !("error" in result);
  return new Response(page(ok), {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}
