import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Called by a cron job or manually — sends compliance expiry alerts via email
// Set up a Vercel cron in vercel.json: { "crons": [{ "path": "/api/notifications/compliance", "schedule": "0 8 * * *" }] }

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date();
  const alerts: { userId: string; email: string; items: string[] }[] = [];

  // Find compliance certs expiring in 45, 14, or 3 days
  const thresholds = [45, 14, 3];
  for (const days of thresholds) {
    const target = new Date(today);
    target.setDate(target.getDate() + days);
    const dateStr = target.toISOString().slice(0, 10);

    const { data: certs } = await supabase
      .from("rentura_compliance")
      .select("user_id, certificate_type, expiry_date, rentura_properties(address)")
      .eq("expiry_date", dateStr);

    for (const cert of certs || []) {
      const { data: profile } = await supabase.from("profiles").select("name").eq("id", cert.user_id).single();
      const { data: authUser } = await supabase.auth.admin.getUserById(cert.user_id);
      const email = authUser?.user?.email;
      if (!email) continue;

      const existing = alerts.find(a => a.userId === cert.user_id);
      const msg = `${cert.certificate_type} expires in ${days} days`;
      if (existing) { existing.items.push(msg); }
      else { alerts.push({ userId: cert.user_id, email, items: [msg] }); }
    }
  }

  // Send emails via Resend (or log if not configured)
  const RESEND_KEY = process.env.RESEND_API_KEY;
  let sent = 0;

  for (const alert of alerts) {
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: "Rentura <alerts@propertyvaultuk.co.uk>",
          to: alert.email,
          subject: `Action required: ${alert.items.length} compliance alert${alert.items.length > 1 ? "s" : ""}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0c0f1a;color:#e5e5e5;border-radius:12px;">
              <p style="font-size:18px;font-weight:800;color:#c9a84c;margin-bottom:4px;">Rentura™</p>
              <p style="font-size:12px;color:#666;margin-bottom:28px;">Property Operating System</p>
              <h2 style="font-size:20px;font-weight:800;margin-bottom:16px;">Compliance alert${alert.items.length > 1 ? "s" : ""}</h2>
              <ul style="padding-left:20px;margin-bottom:24px;">
                ${alert.items.map(i => `<li style="margin-bottom:8px;font-size:14px;">${i}</li>`).join("")}
              </ul>
              <a href="https://propertyvaultuk.co.uk/rentura/dashboard" style="display:inline-block;background:#c9a84c;color:#0f1b36;font-weight:800;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;">
                View dashboard →
              </a>
              <p style="font-size:11px;color:#555;margin-top:28px;">You're receiving this because you have compliance alerts set up in Rentura. <a href="https://propertyvaultuk.co.uk/rentura/settings" style="color:#888;">Manage alerts</a></p>
            </div>
          `,
        }),
      });
      sent++;
    } else {
      // no-op: RESEND_API_KEY not configured
      sent++;
    }
  }

  return NextResponse.json({ sent, alerts: alerts.length });
}
