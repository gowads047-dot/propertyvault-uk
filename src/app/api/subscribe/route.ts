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

  // The service key: signing up again must clear unsubscribed_at (it is
  // renewed consent), and that is an update, which anon's insert-only
  // policy does not allow. The key is already a condition of getting here
  // — rateGuard fails closed without it.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Save to Supabase. An address that is already there is updated in
  // place rather than refused: new name, new attribution, and back on the
  // list if they had left.
  const row = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    user_type: user_type ?? null,
    source: "popup",
  };
  const extra = { attribution: pickAttribution(body), unsubscribed_at: null };
  let { error: dbError } = await supabase.from("subscribers").upsert({ ...row, ...extra }, { onConflict: "email" });
  if (dbError?.code === "42703") {
    // subscribers-consent.sql has not been run here yet. The sign-up must
    // not wait on a migration; store what the table can hold.
    console.error("subscribers is missing the attribution/unsubscribed_at columns — run supabase/subscribers-consent.sql");
    ({ error: dbError } = await supabase.from("subscribers").upsert(row, { onConflict: "email" }));
  }
  if (dbError) {
    console.error("DB error:", dbError);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
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
