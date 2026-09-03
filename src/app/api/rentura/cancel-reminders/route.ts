import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { createClient } from "@supabase/supabase-js";
import { REPLY_TO } from "@/lib/site";

export async function POST(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();

  // Find all Rentura members who are cancelled but still in grace period
  const { data: cancelledMembers } = await supabase
    .from("rentura_subscriptions")
    .select("user_id, email, name, access_until, cancelled_at")
    .eq("status", "cancelled")
    .gt("access_until", now.toISOString());

  if (!cancelledMembers || cancelledMembers.length === 0) {
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
          <span style="color:var(--gold-ink);font-weight:900;font-size:20px;">Rentura</span>
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
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/rentura/subscribe" style="background:#0f1b2d;color:white;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">
              Resubscribe — £9.99/mo →
            </a>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/rentura/dashboard" style="background:#f5f3ef;color:#0f1b2d;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #e8e4dd;display:inline-block;">
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
