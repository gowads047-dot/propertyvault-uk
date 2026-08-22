import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import StarterPackEmail from "@/emails/StarterPackEmail";
import { REPLY_TO } from "@/lib/site";

export async function POST(req: Request) {
  const { name, email, user_type } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Save to Supabase
  const { error: dbError } = await supabase.from("subscribers").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    user_type: user_type ?? null,
    source: "popup",
  });

  if (dbError) {
    // Duplicate email — already subscribed, still send the pack
    if (dbError.code !== "23505") {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
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
      to: email.trim().toLowerCase(),
      subject: "Your Free Property Starter Pack 🏠",
      react: StarterPackEmail({ name: name.trim(), userType: user_type ?? null }),
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
