import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { createClient } from "@supabase/supabase-js";
import { REPLY_TO, siteOrigin } from "@/lib/site";

/**
 * Vercel runs a cron as a GET. This route only answered POST, so the Monday
 * job in vercel.json got a 405 every week since it was scheduled and no
 * cancellation reminder was ever sent by it. GET is the cron's entry point;
 * POST stays for calling it by hand. crons.test.ts now checks every cron
 * route exports GET.
 */
export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return sendReminders();
}

export async function POST(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return sendReminders();
}

async function sendReminders() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();

  // Find all Rentura members who are cancelled but still in grace period.
  //
  // No `email` in the select: rentura_subscriptions has no such column, and
  // asking for one made the whole query fail — quietly, since the error was
  // never read, so this reported "sent: 0" and did nothing. The address is
  // on auth.users, which the service role can look up by id.
  const { data: rows, error } = await supabase
    .from("rentura_subscriptions")
    .select("user_id, name, access_until, cancelled_at")
    .eq("status", "cancelled")
    .gt("access_until", now.toISOString());
  if (error) {
    console.error("cancel-reminders: could not read subscriptions:", error.message);
    return NextResponse.json({ error: "Could not read subscriptions." }, { status: 502 });
  }
  if (!rows || rows.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const cancelledMembers: { user_id: string; name: string | null; access_until: string; cancelled_at: string | null; email: string }[] = [];
  for (const r of rows) {
    const { data: u } = await supabase.auth.admin.getUserById(r.user_id);
    if (u?.user?.email) cancelledMembers.push({ ...r, email: u.user.email });
    else console.error(`cancel-reminders: no email for user ${r.user_id}`);
  }
  if (cancelledMembers.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    // no-op: RESEND_API_KEY not configured
    return NextResponse.json(
      { sent: 0, error: "RESEND_API_KEY not configured — reminders were NOT sent" },
      { status: 500 }
    );
  }

  for (const member of cancelledMembers) {
    const accessUntil = new Date(member.access_until);
    const daysLeft = Math.ceil((accessUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const firstName = member.name?.split(" ")[0] || "there";

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0f1b2d;">
        <div style="background:#0f1b2d;padding:24px 32px;border-radius:12px 12px 0 0;">
          <span style="color:#f4d35e;font-weight:900;font-size:20px;">Rentura</span>
        </div>
        <div style="background:#f5f3ef;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e4dd;">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 12px;">Hi ${firstName} — your access expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}</h2>
          <p style="font-size:14px;color:rgba(15,27,45,0.6);line-height:1.7;margin:0 0 20px;">
            Your Rentura membership was cancelled. You still have <strong>${daysLeft} day${daysLeft === 1 ? "" : "s"}</strong> of free access remaining.
            After that, your dashboard and all data will be removed.
          </p>
          <p style="font-size:14px;color:rgba(15,27,45,0.6);line-height:1.7;margin:0 0 24px;">
            Before your access ends, make sure to:
          </p>
          <ul style="font-size:14px;color:rgba(15,27,45,0.6);line-height:2;padding-left:20px;margin:0 0 28px;">
            <li>Export your financial reports</li>
            <li>Download your documents and property passports</li>
            <li>Save any tenant contact details</li>
          </ul>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a href="${siteOrigin()}/rentura/subscribe" style="background:#0f1b2d;color:white;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">
              Resubscribe — £9.99/mo →
            </a>
            <a href="${siteOrigin()}/rentura/dashboard" style="background:#f5f3ef;color:#0f1b2d;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #e8e4dd;display:inline-block;">
              Download my data
            </a>
          </div>
          <p style="font-size:11px;color:rgba(15,27,45,0.3);margin-top:28px;">Access expires on ${accessUntil.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. This is an automated reminder — you will receive this weekly until your access ends.</p>
        </div>
      </div>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Rentura <info@propertyvaultuk.co.uk>",
        replyTo: REPLY_TO,
        to: member.email,
        subject: `⚠️ Your Rentura access expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — download your data`,
        html: emailHtml,
      }),
    });
    sent++;
  }

  return NextResponse.json({ sent });
}
