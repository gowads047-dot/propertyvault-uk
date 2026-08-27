import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { REPLY_TO } from "@/lib/site";

const BASE_SYSTEM = `You are Rentura — a warm, concise AI assistant for UK residential tenants. You help tenants communicate with their landlord and report maintenance issues through natural conversation.

## WHAT YOU CAN DO
1. Guide the tenant through reporting a maintenance issue (step-by-step)
2. Give updates on their existing open issues
3. Pass messages to the landlord
4. Answer basic UK tenant questions (rights, what landlords must fix, etc.)

## ISSUE REPORTING FLOW — collect in order, one question at a time
Step 1 — Let them describe the problem naturally
Step 2 — If vague, ask ONE clarifying question (e.g. "Is there any water coming through?" or "When did this start?")
Step 3 — URGENCY: Ask "Is this something that needs urgent attention — like it's affecting your safety or leaving you without heating or hot water?"
  • urgent: gas leak, flooding, no heating in winter, no hot water, structural danger, electrical fault
  • normal: boiler fault, persistent drip, damaged window, broken lock, faulty appliance
  • low: cosmetic damage, minor inconvenience, non-essential
Step 4 — PHONE: "Just so the contractor has your details — what's the best number to reach you on?"
  (Skip this step if the tenant's phone is already on file)
Step 5 — CONFIRM: Say "Here's what I'll send to [landlord name]:" then show a clear summary (title, category, priority, description). End with "Shall I send this?"
Step 6 — SUBMIT: Only when the tenant confirms (yes / looks good / send it / correct / ok / yep / go ahead)

## IMPORTANT RULES
- One question per reply, always — never stack multiple questions
- Generate a clear 5-10 word issue title from what they described (e.g. "Boiler not producing hot water" not "boiler problem")
- Category mapping: plumbing | electrical | heating | structural | damp | pest | appliance | general
- Priority mapping: "urgent" (unsafe/no heating or water) | "normal" (affects daily life) | "low" (minor)
- Never ask for photos — they can send those via WhatsApp/email
- After submitting: tell them their landlord has been notified and will respond. Reassure them the issue is logged and won't be missed
- UK English, friendly, empathetic, no corporate speak, no hollow affirmations ("Great!", "Absolutely!")

## RESPONSE FORMAT — return ONLY valid JSON, no markdown, no code fences:
{
  "reply": "your message to the tenant",
  "gathered": { "title": null, "category": null, "description": null, "priority": null },
  "pendingField": "description | urgency | phone | confirmation | null",
  "action": null,
  "issueData": null,
  "phone": null,
  "followUp": null
}

Set action: "create_issue" ONLY when ALL of these are true:
1. title + description + category + priority are all gathered
2. Phone has been asked and received (or tenant declined to give it)
3. Tenant has explicitly confirmed they want to submit

When action is "create_issue":
• Set issueData: { title, description, category, priority }
• Set phone to the number they gave (or null)
• Set followUp to a natural next message suggestion`;

type OpenIssue = { title: string; status: string; category: string; priority: string };
type TenantCtx = { tenantName: string; propertyAddress: string; landlordName: string; tenantPhone: string | null; openIssues: OpenIssue[] };

function buildSystem(ctx: TenantCtx): string {
  const issueList = ctx.openIssues.length > 0
    ? ctx.openIssues.map(i => `- [${i.status.toUpperCase()}] ${i.title} (${i.category}, ${i.priority} priority)`).join("\n")
    : "None currently open.";

  return `${BASE_SYSTEM}

## THIS TENANT SESSION
Tenant name: ${ctx.tenantName}
Property: ${ctx.propertyAddress}
Landlord: ${ctx.landlordName}
${ctx.tenantPhone ? `Tenant phone on file: ${ctx.tenantPhone} — skip asking for it unless they want to update it` : "Tenant phone: not on file — collect it during issue reporting (Step 4)"}

## OPEN ISSUES
${issueList}`;
}

export async function POST(req: Request) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { token, history, userInput } = await req.json();

    if (!token || !userInput) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { data: invite } = await supabase
      .from("tenant_invites")
      .select("id, property_id, landlord_user_id, email, tenant_name, tenant_auth_id, phone")
      .eq("token", token)
      .maybeSingle();

    if (!invite) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const [propRes, landlordRes, issuesRes] = await Promise.all([
      supabase.from("rentura_properties").select("address").eq("id", invite.property_id).maybeSingle(),
      supabase.from("rentura_subscriptions").select("name").eq("user_id", invite.landlord_user_id).maybeSingle(),
      supabase.from("tenant_issues")
        .select("title, status, category, priority")
        .eq("tenant_email", invite.email)
        .neq("status", "resolved")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const ctx: TenantCtx = {
      tenantName: invite.tenant_name || invite.email?.split("@")[0] || "there",
      propertyAddress: propRes.data?.address || "your property",
      landlordName: landlordRes.data?.name || "your landlord",
      tenantPhone: invite.phone || null,
      openIssues: (issuesRes.data || []) as OpenIssue[],
    };

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const messages = [
      ...(history || []),
      { role: "user" as const, content: userInput },
    ];

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system: buildSystem(ctx),
      messages,
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";
    let parsed: Record<string, unknown>;
    try {
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = { reply: raw || "Sorry, I had trouble with that. Could you try again?", action: null, issueData: null, phone: null };
    }

    // Create issue when bot signals action
    if (parsed.action === "create_issue" && parsed.issueData) {
      const d = parsed.issueData as { title: string; description: string; category: string; priority: string };

      const { data: newIssue } = await supabase.from("tenant_issues").insert({
        property_id: invite.property_id,
        landlord_user_id: invite.landlord_user_id,
        tenant_auth_id: invite.tenant_auth_id || null,
        tenant_email: invite.email,
        tenant_name: invite.tenant_name || null,
        title: d.title,
        description: d.description || null,
        category: d.category || "general",
        priority: d.priority || "normal",
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select("id").single();

      if (newIssue) {
        parsed.issueId = (newIssue as { id: string }).id;

        await supabase.from("tenant_issue_updates").insert({
          issue_id: (newIssue as { id: string }).id,
          author_type: "tenant",
          author_name: ctx.tenantName,
          message: d.description || d.title,
          attachments: [],
          created_at: new Date().toISOString(),
        });

        if (parsed.phone) {
          await supabase.from("tenant_invites").update({ phone: String(parsed.phone) }).eq("token", token);
        }

        // Email landlord
        if (process.env.RESEND_API_KEY) {
          const shortAddr = ctx.propertyAddress.split(",")[0];
          const isUrgent = d.priority === "urgent";
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.propertyvaultuk.co.uk";
          const landlordUrl = `${baseUrl}/rentura/properties/${invite.property_id}?tab=maintenance`;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "PropertyVault UK <info@propertyvaultuk.co.uk>",
              replyTo: REPLY_TO,
              to: "info@propertyvaultuk.co.uk",
              subject: `${isUrgent ? "🚨 URGENT" : "🔧 New issue"}: "${d.title}" — ${shortAddr}`,
              html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a2942;">
                <div style="background:#1a2942;padding:20px 28px;border-radius:12px 12px 0 0;">
                  <span style="color:var(--gold-ink);font-weight:900;font-size:18px;">PropertyVault UK</span>
                </div>
                <div style="background:#f8f7f5;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e8e4dd;border-top:none;">
                  <h2 style="font-size:18px;font-weight:800;margin:0 0 6px;">${isUrgent ? "⚠️ Urgent:" : "New"} maintenance issue at ${shortAddr}</h2>
                  <p style="font-size:13px;color:rgba(26,41,66,0.55);margin:0 0 20px;">Reported by ${ctx.tenantName} via their tenant portal</p>
                  <div style="background:white;border:1px solid #e8e4dd;border-left:4px solid ${isUrgent ? "#dc2626" : "#ca8a04"};border-radius:4px 10px 10px 4px;padding:16px 20px;margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                      <p style="font-size:16px;font-weight:800;margin:0;">${d.title}</p>
                      <span style="font-size:11px;font-weight:700;color:${isUrgent ? "#dc2626" : "#ca8a04"};background:${isUrgent ? "rgba(220,38,38,0.08)" : "rgba(234,179,8,0.08)"};padding:3px 9px;border-radius:6px;flex-shrink:0;margin-left:12px;">${isUrgent ? "Urgent" : "Normal"}</span>
                    </div>
                    ${d.description ? `<p style="font-size:13px;color:rgba(26,41,66,0.6);line-height:1.6;margin:0 0 10px;">${d.description}</p>` : ""}
                    <p style="font-size:12px;color:rgba(26,41,66,0.4);margin:0;">Category: ${d.category}</p>
                  </div>
                  <p style="font-size:12px;color:rgba(26,41,66,0.5);margin:0 0 16px;">⚡ This issue is highlighted in Rentura until you respond. The tenant has been told you'll be in touch.</p>
                  <a href="${landlordUrl}" style="display:block;background:#1a2942;color:white;font-weight:800;font-size:14px;padding:14px;border-radius:10px;text-decoration:none;text-align:center;">Respond in Rentura →</a>
                </div>
              </div>`,
            }),
          });
        }
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Tenant chat error:", err);
    return NextResponse.json({ error: "Chat unavailable", reply: "Sorry, I'm having trouble right now. Please try again in a moment." }, { status: 500 });
  }
}
