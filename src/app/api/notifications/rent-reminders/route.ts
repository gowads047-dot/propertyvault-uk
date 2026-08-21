import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { REPLY_TO } from "@/lib/site";

// Daily cron — sends rent due reminders to landlords
// vercel.json: { "crons": [{ "path": "/api/notifications/rent-reminders", "schedule": "0 9 * * *" }] }

// Mirrors the explicit column list in the select below.
type TenantRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  monthly_rent: number | null;
  email: string | null;
  tenancy_start: string | null;
};

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
  const todayDay = today.getDate();
  let sent = 0;

  // Find tenants whose monthly_rent is due today (rent_day field, default 1)
  // We use the day of month from tenancy_start if no explicit rent_day column
  const { data: tenants } = await supabase
    .from("rentura_tenants")
    .select("user_id, first_name, last_name, monthly_rent, email, tenancy_start")
    .eq("status", "active")
    .not("monthly_rent", "is", null);

  const due = ((tenants ?? []) as TenantRow[]).filter(t => {
    if (!t.tenancy_start) return todayDay === 1;
    const rentDay = new Date(t.tenancy_start).getDate();
    return todayDay === rentDay;
  });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const byUser: Record<string, { email: string; tenants: TenantRow[] }> = {};

  for (const tenant of due) {
    if (!byUser[tenant.user_id]) {
      const { data: authUser } = await supabase.auth.admin.getUserById(tenant.user_id);
      const email = authUser?.user?.email;
      if (!email) continue;
      byUser[tenant.user_id] = { email, tenants: [] };
    }
    byUser[tenant.user_id].tenants.push(tenant);
  }

  for (const [, data] of Object.entries(byUser)) {
    const totalDue = data.tenants.reduce((s, t) => s + (t.monthly_rent || 0), 0);
    const lines = data.tenants.map(t =>
      `${t.first_name} ${t.last_name} — £${(t.monthly_rent || 0).toFixed(2)}`
    ).join("<br>");

    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: "Rentura <alerts@propertyvaultuk.co.uk>",
          replyTo: REPLY_TO,
          to: data.email,
          subject: `Rent due today — £${totalDue.toFixed(2)}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0c0f1a;color:#e5e5e5;border-radius:12px;">
              <p style="font-size:18px;font-weight:800;color:#c9a84c;margin-bottom:4px;">Rentura™</p>
              <p style="font-size:12px;color:#666;margin-bottom:28px;">Property Operating System</p>
              <h2 style="font-size:20px;font-weight:800;margin-bottom:8px;">Rent due today</h2>
              <p style="font-size:14px;color:#999;margin-bottom:20px;">The following tenants have rent due today:</p>
              <p style="font-size:14px;line-height:2;margin-bottom:20px;">${lines}</p>
              <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:14px 18px;margin-bottom:24px;">
                <p style="font-size:18px;font-weight:800;color:#c9a84c;margin:0;">Total: £${totalDue.toFixed(2)}</p>
              </div>
              <a href="https://www.propertyvaultuk.co.uk/rentura/financials" style="display:inline-block;background:#c9a84c;color:#0f1b36;font-weight:800;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;">
                Log income →
              </a>
            </div>
          `,
        }),
      });
    } else {
      // no-op: RESEND_API_KEY not configured
    }
    sent++;
  }

  return NextResponse.json({ sent });
}
