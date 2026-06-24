import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    tenantEmail, tenantName, tenantPhone,
    propertyId, propertyAddress, landlordUserId,
    issueTitle, issueDescription, issueCategory, issuePriority,
  } = await req.json();

  if (!tenantEmail || !landlordUserId || !issueTitle) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://propertyvaultuk.co.uk";

  // Find or create invite token for this tenant
  let { data: invite } = await supabase
    .from("tenant_invites")
    .select("token, accepted_at")
    .eq("email", tenantEmail)
    .eq("landlord_user_id", landlordUserId)
    .maybeSingle();

  if (!invite) {
    const token = randomUUID();
    const { data: newInvite } = await supabase.from("tenant_invites").insert({
      token,
      property_id: propertyId,
      landlord_user_id: landlordUserId,
      email: tenantEmail,
      tenant_name: tenantName || null,
      invite_sent_at: new Date().toISOString(),
    }).select("token, accepted_at").single();
    invite = newInvite;
  }

  const token = invite?.token;
  const alreadySignedUp = !!invite?.accepted_at;
  const portalUrl = `${baseUrl}/tenant${alreadySignedUp ? `/dashboard?token=${token}` : `?token=${token}`}`;

  // Create a tenant_issues entry so the tenant can track it from day one
  await supabase.from("tenant_issues").insert({
    property_id: propertyId,
    landlord_user_id: landlordUserId,
    tenant_email: tenantEmail,
    tenant_name: tenantName || null,
    title: issueTitle,
    description: issueDescription || null,
    category: issueCategory || "general",
    priority: issuePriority || "normal",
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const firstName = tenantName?.split(" ")[0] || "there";
  const shortAddress = propertyAddress?.split(",")[0] || "your property";
  const priorityColour = issuePriority === "urgent" ? "#dc2626" : issuePriority === "low" ? "#6b7280" : "#ca8a04";
  const priorityLabel = issuePriority === "urgent" ? "🚨 Urgent" : issuePriority === "low" ? "Low priority" : "Normal priority";

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a2942;">
      <div style="background:#1a2942;padding:24px 32px;border-radius:12px 12px 0 0;">
        <span style="color:#c9a84c;font-weight:900;font-size:20px;">PropertyVault UK</span>
      </div>
      <div style="background:#f8f7f5;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid #e8e4dd;border-top:none;">
        <h2 style="font-size:20px;font-weight:800;margin:0 0 8px;">Hi ${firstName} — a maintenance issue has been logged for you</h2>
        <p style="font-size:14px;color:rgba(26,41,66,0.6);line-height:1.7;margin:0 0 24px;">
          Your landlord has logged the following issue at <strong>${shortAddress}</strong> on your behalf and is working on getting it resolved.
        </p>

        <div style="background:white;border:1px solid #e8e4dd;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
            <p style="font-size:16px;font-weight:800;color:#1a2942;margin:0;">${issueTitle}</p>
            <span style="font-size:11px;font-weight:700;color:${priorityColour};background:${priorityColour}14;padding:3px 9px;border-radius:6px;flex-shrink:0;margin-left:12px;">${priorityLabel}</span>
          </div>
          ${issueDescription ? `<p style="font-size:13px;color:rgba(26,41,66,0.6);line-height:1.65;margin:0 0 10px;">${issueDescription}</p>` : ""}
          <p style="font-size:12px;color:rgba(26,41,66,0.4);margin:0;">Category: ${issueCategory || "General"} &nbsp;·&nbsp; Status: <strong style="color:#ca8a04;">Open</strong></p>
        </div>

        <p style="font-size:14px;color:rgba(26,41,66,0.6);line-height:1.7;margin:0 0 20px;">
          ${alreadySignedUp
            ? "Log in to your tenant portal to track progress, add more details, or message your landlord directly."
            : "Set up your free tenant portal account to track this repair, add photos, and communicate directly with your landlord."}
        </p>

        <a href="${portalUrl}" style="display:block;background:#1a2942;color:white;font-weight:800;font-size:16px;padding:16px 0;border-radius:12px;text-decoration:none;text-align:center;margin-bottom:16px;">
          ${alreadySignedUp ? "Track this issue →" : "Set up my portal & track this →"}
        </a>

        <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px 18px;">
          <p style="font-size:12px;font-weight:700;color:#c9a84c;margin:0 0 6px;">From your portal you can:</p>
          <ul style="font-size:12px;color:rgba(26,41,66,0.6);padding-left:18px;margin:0;line-height:2;">
            <li>See the status of this repair in real time</li>
            <li>Message your landlord directly on this issue</li>
            <li>Add photos or videos to help explain the problem</li>
            <li>Get notified the moment there&apos;s an update</li>
          </ul>
        </div>

        <p style="font-size:11px;color:rgba(26,41,66,0.3);margin-top:24px;text-align:center;">
          ${shortAddress} · PropertyVault UK Tenant Portal<br/>
          If you didn&apos;t expect this email, please ignore it.
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
        subject: `🔧 Maintenance update: "${issueTitle}" has been logged — ${shortAddress}`,
        html,
      }),
    });
  }

  // WhatsApp message for landlord to send manually
  const waText = encodeURIComponent(
    `Hi ${firstName}! I've logged a maintenance issue for ${shortAddress}:\n\n` +
    `🔧 *${issueTitle}*\n` +
    (issueDescription ? `${issueDescription}\n\n` : "\n") +
    `You can track the progress, add photos, and message me directly from your tenant portal:\n${portalUrl}\n\n` +
    (alreadySignedUp ? "Log in with your existing account." : "It only takes a minute to set up — just create a password.")
  );

  const waUrl = tenantPhone
    ? `https://wa.me/${tenantPhone.replace(/\D/g, "")}?text=${waText}`
    : `https://wa.me/?text=${waText}`;

  return NextResponse.json({ ok: true, portalUrl, whatsappUrl: waUrl, alreadySignedUp });
}
