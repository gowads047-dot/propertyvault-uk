import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { tenantId, tenantEmail, tenantName, tenantPhone, propertyId, propertyAddress, landlordUserId } = await req.json();
  if (!tenantEmail || !landlordUserId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const token = randomUUID();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://propertyvaultuk.co.uk";
  const portalUrl = `${baseUrl}/tenant?token=${token}`;

  await supabase.from("tenant_invites").upsert({
    token,
    property_id: propertyId,
    landlord_user_id: landlordUserId,
    tenant_id: tenantId || null,
    email: tenantEmail,
    tenant_name: tenantName || null,
    invite_sent_at: new Date().toISOString(),
  }, { onConflict: "email" });

  const firstName = tenantName?.split(" ")[0] || "there";
  const shortAddress = propertyAddress?.split(",")[0] || "your property";

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a2942;">
      <div style="background:#1a2942;padding:24px 32px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:12px;">
        <span style="color:#c9a84c;font-weight:900;font-size:20px;">PropertyVault UK</span>
      </div>
      <div style="background:#f8f7f5;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid #e8e4dd;border-top:none;">
        <h2 style="font-size:22px;font-weight:800;margin:0 0 12px;">Hi ${firstName} — welcome to your tenant portal 👋</h2>
        <p style="font-size:14px;color:rgba(26,41,66,0.6);line-height:1.75;margin:0 0 20px;">
          Your landlord has added you to <strong>${shortAddress}</strong> on PropertyVault UK. Your tenant portal gives you a direct line to report maintenance issues, track repairs, and stay connected.
        </p>
        <div style="background:white;border:1px solid #e8e4dd;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
          <p style="font-size:13px;font-weight:700;color:rgba(26,41,66,0.45);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">What you can do in the portal</p>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${[
              ["🔧", "Report maintenance issues with photos or videos"],
              ["📊", "Track the progress of every repair in real time"],
              ["💬", "Message your landlord directly on each issue"],
              ["🏠", "Get home styling tips and decoration advice"],
            ].map(([icon, text]) => `
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:16px;flex-shrink:0;">${icon}</span>
                <span style="font-size:13px;color:rgba(26,41,66,0.65);line-height:1.5;">${text}</span>
              </div>
            `).join("")}
          </div>
        </div>
        <a href="${portalUrl}" style="display:block;background:#1a2942;color:white;font-weight:800;font-size:16px;padding:16px 0;border-radius:12px;text-decoration:none;text-align:center;">
          Access my tenant portal →
        </a>
        <p style="font-size:11px;color:rgba(26,41,66,0.3);margin-top:20px;text-align:center;">
          This link is personal to you. Don&apos;t share it with others.<br/>
          If you didn&apos;t expect this email, you can ignore it safely.
        </p>
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PropertyVault UK <noreply@propertyvaultuk.co.uk>",
        to: tenantEmail,
        subject: `${firstName}, your tenant portal is ready — ${shortAddress}`,
        html,
      }),
    });
  }

  // Build WhatsApp URL for landlord to share manually (opens WA with pre-filled message)
  const waText = encodeURIComponent(
    `Hi ${firstName}! I've added you to your tenant portal for ${shortAddress}.\n\nYou can report issues, track maintenance, and message me directly here:\n${portalUrl}\n\nIt only takes a minute to set up. Let me know if you have any questions! 🏠`
  );
  const waUrl = tenantPhone
    ? `https://wa.me/${tenantPhone.replace(/\D/g, "")}?text=${waText}`
    : `https://wa.me/?text=${waText}`;

  return NextResponse.json({ ok: true, portalUrl, whatsappUrl: waUrl });
}
