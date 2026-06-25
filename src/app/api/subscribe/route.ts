import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import StarterPackEmail from "@/emails/StarterPackEmail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, user_type } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

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

  // 2. Send starter pack email via Resend
  const { error: emailError } = await resend.emails.send({
    from: "Nass at PropertyVault <nass@propertyvaultuk.co.uk>",
    to: email.trim().toLowerCase(),
    subject: "Your Free Property Starter Pack 🏠",
    react: StarterPackEmail({ name: name.trim(), userType: user_type ?? null }),
  });

  if (emailError) {
    console.error("Email error:", emailError);
    // Still return ok — subscriber is saved even if email fails
  }

  return NextResponse.json({ ok: true });
}
