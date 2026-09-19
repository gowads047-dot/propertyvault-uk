import { createClient } from "@supabase/supabase-js";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { validRecipient } from "@/lib/email-input";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import StarterPackEmail from "@/emails/StarterPackEmail";
import { REPLY_TO } from "@/lib/site";
import { pickAttribution } from "@/lib/attribution";
import { unsubscribeHeaders, unsubscribeUrl } from "@/lib/unsubscribe";
import { verifyTurnstile, callerIp, TURNSTILE_FIELD } from "@/lib/turnstile";

export async function POST(req: Request) {
  const limited = await rateGuard(req, RULES.emailPerCaller, RULES.emailGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const { name, email, user_type } = body as { name?: string; email?: string; user_type?: string | null };

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // One well-formed address. The previous check excluded whitespace but not a
  // comma, and a comma is how one recipient becomes a list.
  const recipient = validRecipient(email);
  if (!recipient) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const human = await verifyTurnstile(body[TURNSTILE_FIELD], callerIp(req));
  if (!human.ok) {
    return NextResponse.json({ error: "Please complete the verification and try again." }, { status: 400 });
  }

  // The service key: an address that is already there gets an update,
  // which anon's insert-only policy does not allow. The key is already a
  // condition of getting here — rateGuard fails closed without it.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Save to Supabase.
  //
  // Read first, then insert or update — not an upsert. Two reasons. The
  // unique index is on lower(email), an expression, and ON CONFLICT (email)
  // cannot match it: Postgres answers 42P10 and for ninety minutes every
  // sign-up on the live site was a 500. And an anonymous form post is not
  // proof of who is asking: it must not rewrite what an existing subscriber
  // gave us, and it must not clear an unsubscribe — opting out is a signed
  // link, opting back in has to be the owner's act too. So an existing row
  // only gains the latest attribution; an unsubscribed one is left as it is
  // and is not emailed. The response is the same either way, so nobody
  // can learn whether an address is on the list.
  const address = email.trim().toLowerCase();
  const { data: existing, error: readError } = await supabase
    .from("subscribers")
    .select("id, unsubscribed_at")
    .eq("email", address)
    .maybeSingle();
  if (readError && readError.code !== "42703") {
    console.error("DB error:", readError);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  const migrated = readError?.code !== "42703";
  if (!migrated) {
    console.error("subscribers is missing the attribution/unsubscribed_at columns — run supabase/subscribers-consent.sql");
  }

  const attribution = pickAttribution(body);
  let dbError: { code?: string; message: string } | null = null;
  let unsubscribed = false;
  if (existing) {
    unsubscribed = Boolean(existing.unsubscribed_at);
    if (migrated && attribution) {
      ({ error: dbError } = await supabase.from("subscribers").update({ attribution }).eq("id", existing.id));
    }
  } else {
    const row: Record<string, unknown> = { name: name.trim(), email: address, user_type: user_type ?? null, source: "popup" };
    if (migrated) row.attribution = attribution;
    ({ error: dbError } = await supabase.from("subscribers").insert(row));
    // Two submissions at once: the second sees the first's row as a duplicate.
    if (dbError?.code === "23505") dbError = null;
  }
  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  if (unsubscribed) {
    // Same answer as a fresh sign-up. They asked not to be emailed, and a
    // form somebody else can fill in does not change that.
    return NextResponse.json({ ok: true, emailed: true });
  }

  // 2. Send starter pack email via Resend.
  //
  // Constructed here rather than at the top of the handler: new Resend() throws
  // when RESEND_API_KEY is unset, and doing that before the insert above turned
  // a missing key into an opaque 500 that lost the subscriber entirely — the
  // exact outcome the "still return ok" below was written to prevent. Wrapped
  // too, so a Resend outage costs us the email and never the lead.
  let emailed = false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: "Nass at PropertyVault <info@propertyvaultuk.co.uk>",
      replyTo: REPLY_TO,
      to: recipient,
      subject: "Your Free Property Starter Pack 🏠",
      // RFC 8058: the Unsubscribe button Gmail and Apple Mail show at the top.
      headers: unsubscribeHeaders(recipient),
      react: StarterPackEmail({ name: name.trim(), userType: user_type ?? null, unsubscribeUrl: unsubscribeUrl(recipient) }),
    });
    if (emailError) console.error("Email error:", emailError);
    else emailed = true;
  } catch (err) {
    console.error("Resend unavailable:", err);
    // Still return ok — subscriber is saved even if email fails
  }

  // `emailed` so the caller can tell the truth. Saying "check your inbox" when
  // nothing was sent is the kind of promise this site is trying not to make.
  return NextResponse.json({ ok: true, emailed });
}
