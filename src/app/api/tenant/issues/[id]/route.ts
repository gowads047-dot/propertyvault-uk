import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET — fetch a single issue with its thread
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = sb();
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const landlordId = searchParams.get("landlordId");

  const { data: issue } = await supabase.from("tenant_issues").select("*").eq("id", id).maybeSingle();
  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auth check: must be tenant with valid token OR landlord who owns the property
  if (token) {
    const { data: invite } = await supabase.from("tenant_invites").select("email,property_id").eq("token", token).maybeSingle();
    if (!invite || invite.property_id !== issue.property_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else if (landlordId) {
    if (issue.landlord_user_id !== landlordId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: updates } = await supabase.from("tenant_issue_updates").select("*").eq("issue_id", id).order("created_at", { ascending: true });
  return NextResponse.json({ issue, updates: updates ?? [] });
}

// POST — add update/message to issue thread
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = sb();
  const { id } = await params;
  const { token, landlordId, message, statusChange, attachments, authorName } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const { data: issue } = await supabase.from("tenant_issues").select("*").eq("id", id).maybeSingle();
  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let authorType: "tenant" | "landlord";
  let name: string;

  if (token) {
    const { data: invite } = await supabase.from("tenant_invites").select("*").eq("token", token).maybeSingle();
    if (!invite || invite.property_id !== issue.property_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    authorType = "tenant";
    name = invite.tenant_name || "Tenant";
  } else if (landlordId && issue.landlord_user_id === landlordId) {
    authorType = "landlord";
    name = authorName || "Landlord";
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: update } = await supabase.from("tenant_issue_updates").insert({
    issue_id: id,
    author_type: authorType,
    author_name: name,
    message: message.trim(),
    status_change: statusChange || null,
    attachments: attachments || [],
    created_at: new Date().toISOString(),
  }).select().single();

  const issueUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (statusChange) {
    issueUpdate.status = statusChange;
    if (statusChange === "resolved") issueUpdate.resolved_at = new Date().toISOString();
  }
  // Mark landlord's first response time (used to highlight unresponded issues)
  if (authorType === "landlord" && !issue.landlord_first_response_at) {
    issueUpdate.landlord_first_response_at = new Date().toISOString();
  }
  await supabase.from("tenant_issues").update(issueUpdate).eq("id", id);

  // Cross-notify: tenant update → email landlord; landlord update → email tenant
  if (process.env.RESEND_API_KEY) {
    if (authorType === "tenant") {
      const { data: landlordUser } = await supabase.auth.admin.getUserById(issue.landlord_user_id);
      const toEmail = landlordUser?.user?.email;
      if (toEmail) {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL}/rentura/properties/${issue.property_id}?tab=maintenance`;
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Rentura <noreply@propertyvaultuk.co.uk>",
            to: toEmail,
            subject: `💬 ${name} replied on "${issue.title}"`,
            html: `<div style="font-family:sans-serif;max-width:520px;"><div style="background:#0f1b2d;padding:18px 24px;border-radius:10px 10px 0 0;"><span style="color:#c9a84c;font-weight:900;">Rentura</span></div><div style="background:#f5f3ef;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e8e4dd;"><p style="font-size:14px;font-weight:700;margin:0 0 10px;">${name} replied on: ${issue.title}</p><p style="font-size:13px;background:white;padding:12px;border-radius:8px;border:1px solid #e8e4dd;color:rgba(15,27,45,0.7);">${message}</p><a href="${url}" style="display:inline-block;margin-top:14px;background:#0f1b2d;color:white;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">View thread →</a></div></div>`,
          }),
        });
      }
    } else if (issue.tenant_email) {
      const { data: invite } = await supabase.from("tenant_invites").select("token").eq("email", issue.tenant_email).eq("property_id", issue.property_id).maybeSingle();
      const tenantUrl = invite ? `${process.env.NEXT_PUBLIC_SITE_URL}/tenant/issues/${id}?token=${invite.token}` : `${process.env.NEXT_PUBLIC_SITE_URL}/tenant`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PropertyVault UK <noreply@propertyvaultuk.co.uk>",
          to: issue.tenant_email,
          subject: `Your landlord replied on "${issue.title}"`,
          html: `<div style="font-family:sans-serif;max-width:520px;"><div style="background:#1a2942;padding:18px 24px;border-radius:10px 10px 0 0;"><span style="color:#c9a84c;font-weight:900;">PropertyVault UK</span></div><div style="background:#f8f7f5;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e8e4dd;"><p style="font-size:14px;font-weight:700;margin:0 0 10px;">Update on: ${issue.title}${statusChange ? ` — status changed to ${statusChange.replace(/_/g, " ")}` : ""}</p><p style="font-size:13px;background:white;padding:12px;border-radius:8px;border:1px solid #e8e4dd;color:rgba(26,41,66,0.7);">${message}</p><a href="${tenantUrl}" style="display:inline-block;margin-top:14px;background:#1a2942;color:white;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">View full thread →</a></div></div>`,
        }),
      });
    }
  }

  return NextResponse.json({ update });
}
