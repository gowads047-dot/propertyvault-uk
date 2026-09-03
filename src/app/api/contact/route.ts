import { createClient } from "@supabase/supabase-js";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { REPLY_TO } from "@/lib/site";

/**
 * Contact enquiries.
 *
 * Replaces a form that posted directly to formsubmit.co. That returned
 * "The form was submitted successfully" and delivered nothing — the destination
 * address had never completed FormSubmit's activation handshake, so every
 * enquiry was accepted and dropped. A lead-generation site cannot depend on a
 * third party's activation state for its only contact route.
 *
 * The enquiry is written to Supabase first and emailed second. The database is
 * the system of record; the email is a notification. If Resend is unavailable
 * or its key is unset, the enquiry is still safe and the sender still gets an
 * honest confirmation.
 */

const MAX = { name: 100, email: 200, subject: 100, message: 5000 };

/** The forms allowed to post here. Anything else is recorded as "contact". */
const SOURCES = ["contact", "guaranteed-rent", "list-property", "makan-wanted"] as const;
type Source = (typeof SOURCES)[number];

/** Fields that are handled explicitly; everything else becomes `details`. */
const KNOWN = new Set(["name", "email", "subject", "message", "source", "_honey"]);

const SOURCE_LABEL: Record<Source, string> = {
  "contact": "enquiry",
  "guaranteed-rent": "GUARANTEED RENT enquiry",
  "list-property": "property listing",
  "makan-wanted": "Makan wanted-property enquiry",
};

export async function POST(req: Request) {
  const limited = await rateGuard(req, RULES.emailPerCaller, RULES.emailGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const subject = String(body.subject ?? "General Enquiry").trim();
  const message = String(body.message ?? "").trim();

  const raw = String(body.source ?? "contact");
  const source: Source = (SOURCES as readonly string[]).includes(raw) ? (raw as Source) : "contact";

  // Everything the specific form sent that this route does not name itself —
  // phone, postcode, bedrooms, property details. Kept structured so an enquiry
  // is never reduced to prose.
  const details = Object.fromEntries(
    Object.entries(body)
      .filter(([k, v]) => !KNOWN.has(k) && v != null && String(v).trim() !== "")
      .map(([k, v]) => [k, String(v).slice(0, 500)])
  );
  // Honeypot. A real person never sees this field, so anything in it is a bot.
  // Answer 200 rather than an error, so the bot has nothing to tune against.
  const honey = String(body._honey ?? "").trim();

  if (honey) return NextResponse.json({ ok: true });

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Only the contact form is a message in its own right. The others carry their
  // substance in `details` — a guaranteed-rent enquiry is complete with a
  // postcode and a bedroom count and no prose at all.
  if (source === "contact" && !message) {
    return NextResponse.json({ error: "Please include a message." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Please check your email address." }, { status: 400 });
  }

  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return NextResponse.json({ error: "That message is too long to send." }, { status: 400 });
  }

  // 1. Record the enquiry. This is the part that must not fail.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: dbError } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject.slice(0, MAX.subject),
    message,
    source,
    details: Object.keys(details).length ? details : null,
  });

  if (dbError) {
    console.error("Contact insert failed:", dbError);
    return NextResponse.json(
      { error: "Something went wrong. Please email info@propertyvaultuk.co.uk instead." },
      { status: 500 }
    );
  }

  // 2. Notify. Constructed last and wrapped, because new Resend() throws on an
  // unset key — doing this any earlier would lose the enquiry to a missing
  // environment variable, which is exactly how /api/subscribe used to fail.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: "PropertyVault Enquiries <info@propertyvaultuk.co.uk>",
      to: REPLY_TO,
      replyTo: email,
      subject: `New ${SOURCE_LABEL[source]}: ${name}`,
      text: [
        `From:    ${name} <${email}>`,
        `Form:    ${source}`,
        `Subject: ${subject}`,
        ...Object.entries(details).map(([k, v]) => `${(k + ":").padEnd(9)}${v}`),
        "",
        message || "(no message)",
        "",
        "—",
        "Sent from propertyvaultuk.co.uk.",
        "Reply directly to this email to answer the sender.",
      ].join("\n"),
    });
    if (emailError) console.error("Contact email failed:", emailError);
  } catch (err) {
    console.error("Resend unavailable for contact enquiry:", err);
    // The enquiry is saved. It can be picked up from contact_messages.
  }

  return NextResponse.json({ ok: true });
}
