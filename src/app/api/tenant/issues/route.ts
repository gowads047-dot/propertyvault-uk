import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST — create a new issue
export async function POST(req: Request) {
  const supabase = sb();
  const { token, title, description, category, priority, attachments } = await req.json();
  if (!token || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data: invite } = await supabase.from("tenant_invites").select("*").eq("token", token).maybeSingle();
  if (!invite) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  const { data: issue } = await supabase.from("tenant_issues").insert({
    property_id: invite.property_id,
    landlord_user_id: invite.landlord_user_id,
    tenant_auth_id: invite.tenant_auth_id,
    tenant_email: invite.email,
    tenant_name: invite.tenant_name,
    title: title.trim(),
    description: description?.trim() || null,
    category: category || "general",
    priority: priority || "normal",
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).select().single();

  if (!issue) return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });

  // Add initial message as first update
  if (description) {
    await supabase.from("tenant_issue_updates").insert({
      issue_id: issue.id,
      author_type: "tenant",
      author_name: invite.tenant_name || "Tenant",
      message: description.trim(),
      attachments: attachments || [],
      created_at: new Date().toISOString(),
    });
  }

  // Notify landlord via email
  if (process.env.RESEND_API_KEY) {
    const { data: landlordUser } = await supabase.auth.admin.getUserById(invite.landlord_user_id);
    const landlordEmail = landlordUser?.user?.email;
    if (landlordEmail) {
      const dashUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/rentura/properties/${invite.property_id}?tab=maintenance`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Rentura <noreply@propertyvaultuk.co.uk>",
          to: landlordEmail,
          subject: `🔧 New issue reported by ${invite.tenant_name || "your tenant"} — ${title}`,
          html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;"><div style="background:#0f1b2d;padding:20px 28px;border-radius:12px 12px 0 0;"><span style="color:#c9a84c;font-weight:900;">Rentura</span></div><div style="background:#f5f3ef;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e8e4dd;"><h3 style="margin:0 0 8px;font-size:18px;">New maintenance issue reported</h3><p style="font-size:14px;color:rgba(15,27,45,0.6);margin:0 0 16px;"><strong>${invite.tenant_name || "Your tenant"}</strong> reported: <strong>${title}</strong></p>${description ? `<p style="font-size:13px;color:rgba(15,27,45,0.5);background:white;padding:12px;border-radius:8px;border:1px solid #e8e4dd;">${description}</p>` : ""}<a href="${dashUrl}" style="display:inline-block;margin-top:16px;background:#0f1b2d;color:white;padding:12px 22px;border-radius:9px;text-decoration:none;font-weight:700;font-size:14px;">View & respond →</a></div></div>`,
        }),
      });
    }
  }

  return NextResponse.json({ issue });
}

// GET — list issues for a tenant (by token)
export async function GET(req: Request) {
  const supabase = sb();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const landlordId = searchParams.get("landlordId");
  const propertyId = searchParams.get("propertyId");

  if (token) {
    const { data: invite } = await supabase.from("tenant_invites").select("*").eq("token", token).maybeSingle();
    if (!invite) return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    const { data: issues } = await supabase.from("tenant_issues").select("*").eq("property_id", invite.property_id).eq("tenant_email", invite.email).order("created_at", { ascending: false });
    return NextResponse.json({ issues: issues ?? [], property_id: invite.property_id, property_address: invite.property_address });
  }

  if (landlordId && propertyId) {
    const { data: issues } = await supabase
      .from("tenant_issues")
      .select("*, landlord_first_response_at")
      .eq("landlord_user_id", landlordId)
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    // Sort: urgent unresponded first, then normal unresponded, then responded/resolved
    const sorted = (issues ?? []).sort((a, b) => {
      const aWaiting = !a.landlord_first_response_at && a.status !== "resolved";
      const bWaiting = !b.landlord_first_response_at && b.status !== "resolved";
      if (aWaiting && !bWaiting) return -1;
      if (!aWaiting && bWaiting) return 1;
      if (aWaiting && bWaiting) {
        if (a.priority === "urgent" && b.priority !== "urgent") return -1;
        if (a.priority !== "urgent" && b.priority === "urgent") return 1;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json({ issues: sorted });
  }

  return NextResponse.json({ error: "Missing params" }, { status: 400 });
}
