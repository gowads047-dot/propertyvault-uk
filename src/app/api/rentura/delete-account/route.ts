import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getVerifiedUser } from "@/lib/server-auth";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { CONTACT_EMAIL, MAIL_FROM, REPLY_TO } from "@/lib/site";

/**
 * A Rentura member asks for their account and data to be deleted.
 *
 * Settings used to post this through /api/contact/ as if it were a contact
 * form, with the user id typed into the message. Two things wrong with
 * that: anyone could file a deletion request for any user id (nothing
 * checked who was asking), and the contact route now requires a Turnstile
 * token, which Settings never sent — so once the keys go live the request
 * would be refused while the page still said "Deletion request sent".
 *
 * Here the session is verified, the request is recorded in
 * contact_messages under its own source (the system of record, like every
 * enquiry), and the owner is emailed. The deletion itself is the owner's:
 * it needs the Stripe subscription cancelled and the auth user removed,
 * within the 30 days the page promises.
 */
export async function POST(request: Request) {
  const limited = await rateGuard(request, RULES.emailPerCaller, RULES.emailGlobal);
  if (limited) return NextResponse.json({ error: limited.error }, { status: limited.status });

  const user = await getVerifiedUser(request);
  if (!user) return NextResponse.json({ error: "Please sign in again and retry." }, { status: 401 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const requestedAt = new Date().toISOString();
  const { data: saved, error } = await supabase
    .from("contact_messages")
    .insert({
      name: "Rentura member",
      email: user.email ?? "",
      subject: "Account deletion request — Rentura",
      message: `Verified deletion request from user ${user.id} (${user.email ?? "no email"}) at ${requestedAt}. Cancel the Stripe subscription, delete the auth user, and confirm by email within 30 days.`,
      source: "account-deletion",
      details: { user_id: user.id, requested_at: requestedAt },
    })
    .select("id")
    .single();
  if (error || !saved) {
    console.error("delete-account: could not record the request:", error?.message);
    return NextResponse.json({ error: `Could not record the request. Please email ${CONTACT_EMAIL}.` }, { status: 500 });
  }

  let emailed = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: sendError } = await resend.emails.send({
        from: MAIL_FROM,
        to: CONTACT_EMAIL,
        replyTo: user.email ?? REPLY_TO,
        subject: `Account deletion request — Rentura (${user.email ?? user.id})`,
        text: `A verified Rentura member has asked for their account and data to be deleted.\n\nUser id: ${user.id}\nEmail: ${user.email ?? "none"}\nRequested: ${requestedAt}\nRecord: contact_messages ${saved.id}\n\nTo do within 30 days: cancel their Stripe subscription, delete the auth user (which removes their Rentura rows), and confirm to them by email.`,
      });
      emailed = !sendError;
      if (sendError) console.error("delete-account: notification email failed:", sendError.message);
    } catch (e) {
      console.error("delete-account: notification email failed:", e instanceof Error ? e.message : e);
    }
  }
  if (emailed) await supabase.from("contact_messages").update({ emailed: true }).eq("id", saved.id);

  return NextResponse.json({ ok: true, emailed });
}
