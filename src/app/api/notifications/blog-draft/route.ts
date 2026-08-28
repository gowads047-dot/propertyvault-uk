import { NextResponse } from "next/server";
import { REPLY_TO } from "@/lib/site";
import { briefPrompt, buildPlan } from "@/lib/blog-planner";

/**
 * The weekly blog brief.
 *
 * Deliberately NOT an auto-publisher. It picks the biggest unwritten gap, asks
 * Claude for an outline under strict no-invented-facts rules, and emails it to
 * be written by a person. Nothing reaches the site without someone deciding it
 * should.
 *
 * Runs Mondays at 07:00 — before the day starts, so the brief is waiting.
 */
export const maxDuration = 60;

const TO = "info@propertyvaultuk.co.uk";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const RESEND_KEY = process.env.RESEND_API_KEY;

  const plan = buildPlan(new Date(), 3);

  // Nothing left in the backlog is a real outcome, not an error — but it should
  // say so rather than send an empty email.
  if (plan.topics.length === 0) {
    return NextResponse.json({ sent: false, reason: "backlog empty", plan });
  }

  const topic = plan.topics[0];
  let outline = "";

  if (ANTHROPIC_KEY) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: briefPrompt(topic) }],
      }),
    });
    if (r.ok) {
      const data = await r.json();
      outline = data?.content?.[0]?.text ?? "";
    } else {
      outline = `Could not generate an outline: ${r.status} ${await r.text()}`.slice(0, 400);
    }
  }

  // Say plainly when a key is missing rather than returning a success that
  // means nothing — the pattern in the other cron routes reports sent:1 with no
  // key configured, which is indistinguishable from having actually sent.
  if (!RESEND_KEY) {
    return NextResponse.json({
      sent: false,
      reason: "RESEND_API_KEY not configured",
      topic: topic.title,
      outlineGenerated: Boolean(outline),
    }, { status: 500 });
  }

  const stale = plan.daysSinceLastPost;
  const staleLine = stale === null
    ? "No post dates could be read."
    : `Last post was ${stale} day${stale === 1 ? "" : "s"} ago.`;

  const others = plan.topics.slice(1);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({
      from: "PropertyVault <info@propertyvaultuk.co.uk>",
      replyTo: REPLY_TO,
      to: TO,
      subject: `This week's post: ${topic.title}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;color:#0f1b36;">
          <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7d631d;margin:0 0 6px;">Weekly blog brief</p>
          <h1 style="font-size:22px;font-weight:800;margin:0 0 8px;">${escapeHtml(topic.title)}</h1>
          <p style="font-size:14px;color:#475569;margin:0 0 4px;">${escapeHtml(topic.why)}</p>
          <p style="font-size:12px;color:#64748b;margin:0 0 24px;">
            ${plan.postCount} posts published. ${staleLine} Suggested category: ${escapeHtml(topic.category)}.
          </p>

          <div style="background:#f8f9fc;border:1px solid #e8eaf0;border-radius:12px;padding:20px;margin-bottom:24px;">
            <pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;margin:0;color:#0f1b36;">${escapeHtml(outline || "No outline generated — ANTHROPIC_API_KEY is not configured.")}</pre>
          </div>

          <p style="font-size:13px;color:#475569;margin:0 0 6px;"><strong>Before publishing:</strong> every [CHECK: …] in the outline is a number or rule that was deliberately not invented. Look each one up and cite it, or cut the sentence.</p>

          ${others.length ? `
            <p style="font-size:12px;color:#64748b;margin:20px 0 6px;">Next in the backlog:</p>
            <ul style="font-size:12px;color:#64748b;padding-left:18px;margin:0;">
              ${others.map(t => `<li>${escapeHtml(t.title)}</li>`).join("")}
            </ul>` : ""}

          <p style="font-size:11px;color:#94a3b8;margin-top:28px;">
            Nothing has been published. This is a brief, not a post.
          </p>
        </div>
      `,
    }),
  });

  return NextResponse.json({
    sent: res.ok,
    status: res.status,
    topic: topic.title,
    daysSinceLastPost: stale,
    remainingInBacklog: plan.topics.length,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
