"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Conversation engine ────────────────────────────────────────────────────

type Action = { type: string; label: string; value: string; color: string };
type Message = { role: "user" | "ai"; text: string; actions?: Action[]; ts?: string };

function parseMessage(input: string): { reply: string; actions: Action[] } {
  const i = input.toLowerCase();

  if (i.includes("paid") && (i.includes("£") || i.match(/\d{3,4}/))) {
    const amount = input.match(/£[\d,]+/)?.[0] || input.match(/[\d,]{3,4}/)?.[0] || "amount";
    return {
      reply: `Got it. Payment of ${amount} recorded against your rent ledger. Arrears cleared if any were outstanding. Tenant record updated. Receipt available under Financials.`,
      actions: [
        { type: "record", label: "Payment logged", value: amount, color: "#22c55e" },
        { type: "update", label: "Ledger updated", value: "Rent account", color: "#6366f1" },
        { type: "clear", label: "Arrears cleared", value: "£0 outstanding", color: "#22c55e" },
      ],
    };
  }

  if (i.includes("bought") || i.includes("purchased") || (i.includes("new property") && i.match(/£[\d,k]+/i))) {
    const address = input.match(/at\s+([^,for]+)/i)?.[1]?.trim() || "new address";
    const price = input.match(/£[\d,]+k?/i)?.[0] || "purchase price";
    return {
      reply: `New property added. I've created the property record, mortgage placeholder, and timeline for ${address}. Add your mortgage details and I'll track the expiry, LTV, and refinancing windows automatically.`,
      actions: [
        { type: "create", label: "Property created", value: address, color: "#6366f1" },
        { type: "create", label: "Timeline started", value: "Purchase recorded", color: "#a855f7" },
        { type: "pending", label: "Mortgage needed", value: price + " purchase", color: "#f59e0b" },
      ],
    };
  }

  if (i.includes("boiler") || i.includes("replaced") || (i.includes("cost") && i.match(/£\d+/))) {
    const cost = input.match(/£[\d,]+/)?.[0] || "cost";
    const property = input.match(/(?:at|flat|house|property)\s+([^\.\,]+)/i)?.[1]?.trim();
    return {
      reply: `Maintenance job logged and filed. ${cost} expense categorised as repairs — tax allowable. ${property ? `Attached to ${property}.` : ""} I've updated the maintenance history and flagged it for your self-assessment summary.`,
      actions: [
        { type: "record", label: "Expense logged", value: cost + " — repairs", color: "#22c55e" },
        { type: "tax", label: "Tax allowable", value: "Added to SA summary", color: "#d4af37" },
        { type: "history", label: "Property history updated", value: property || "property", color: "#6366f1" },
      ],
    };
  }

  if (i.includes("leak") || i.includes("damp") || i.includes("broken") || i.includes("reported") || i.includes("tap") || i.includes("radiator") || i.includes("crack")) {
    const issue = i.includes("leak") ? "leak" : i.includes("damp") ? "damp" : i.includes("radiator") ? "radiator fault" : "maintenance issue";
    return {
      reply: `Maintenance issue created and flagged as urgent. I've categorised this as a ${issue}, assessed urgency as Medium-High, and prepared a contractor brief. Tenant will receive an auto-acknowledgement. Ready to share with your contractor via WhatsApp or email?`,
      actions: [
        { type: "create", label: "Issue created", value: issue.charAt(0).toUpperCase() + issue.slice(1), color: "#ef4444" },
        { type: "alert", label: "Urgency assessed", value: "Medium-High", color: "#f59e0b" },
        { type: "notify", label: "Tenant acknowledged", value: "Auto-sent", color: "#6366f1" },
        { type: "action", label: "Contractor brief ready", value: "Tap to share", color: "#22c55e" },
      ],
    };
  }

  if (i.includes("mortgage") && (i.includes("expir") || i.includes("this year") || i.includes("upcoming") || i.includes("renew"))) {
    return {
      reply: `You have 2 mortgages expiring in the next 12 months:\n\n• 14 Maple Street — Barclays 2.89% fixed, expires 3 Aug 2026 (41 days). SVR reversion would cost £284/month extra.\n• 22 Park Road — NatWest 3.2% fixed, expires 14 Nov 2026 (5 months). £196/month difference.\n\nWant me to prepare a broker brief for both?`,
      actions: [
        { type: "alert", label: "Maple Street", value: "41 days · urgent", color: "#ef4444" },
        { type: "alert", label: "Park Road", value: "5 months", color: "#f59e0b" },
        { type: "action", label: "Broker brief", value: "Ready to generate", color: "#6366f1" },
      ],
    };
  }

  if (i.includes("focus") || i.includes("today") || i.includes("priority") || i.includes("important")) {
    return {
      reply: `3 things need your attention today:\n\n1. Gas Safety on Flat 4, Grove Lane — expires in 9 days. Book it now.\n2. Tenant at 22 Park Road has had an open maintenance issue for 6 days. Chase the contractor.\n3. Mortgage at 14 Maple Street expires in 41 days — rate reversion will cost £3,408/year extra.\n\nEverything else can wait.`,
      actions: [
        { type: "urgent", label: "Gas Safety due", value: "9 days", color: "#ef4444" },
        { type: "chase", label: "Maintenance stalled", value: "6 days open", color: "#f59e0b" },
        { type: "alert", label: "Mortgage expiry", value: "41 days", color: "#f59e0b" },
      ],
    };
  }

  if (i.includes("profitable") || i.includes("best property") || i.includes("performing")) {
    return {
      reply: `Your best performer is 14 Maple Street. Net yield 8.4%, monthly cash flow £612, ROI since purchase 31.2%. It generates 43% of your total portfolio income on 28% of your total capital. Your weakest is 22 Park Road — yield 4.1%, high maintenance spend, rent below market rate.`,
      actions: [
        { type: "top", label: "14 Maple Street", value: "8.4% yield · £612/mo CF", color: "#22c55e" },
        { type: "low", label: "22 Park Road", value: "4.1% yield · review needed", color: "#ef4444" },
      ],
    };
  }

  if (i.includes("tax") || i.includes("owe") || i.includes("self assessment") || i.includes("hmrc")) {
    return {
      reply: `Based on rent received and expenses logged so far, your estimated self-assessment liability this year is £6,240. Allowable expenses tracked: £14,330. I've flagged 3 potential missing receipts that could reduce your bill by ~£680. Tip: the boiler replacement at Flat 3 may qualify for capital allowances — worth checking with your accountant.`,
      actions: [
        { type: "tax", label: "Estimated liability", value: "£6,240", color: "#d4af37" },
        { type: "saving", label: "Missing receipts", value: "~£680 saving possible", color: "#22c55e" },
        { type: "tip", label: "Capital allowance flag", value: "Boiler — Flat 3", color: "#6366f1" },
      ],
    };
  }

  if (i.includes("tenant") && (i.includes("moved") || i.includes("vacated") || i.includes("left") || i.includes("ended"))) {
    return {
      reply: `Tenancy marked as ended. I've triggered the deposit return checklist, flagged the property as vacant, and created a void period record for your tax summary. When you're ready to re-let, I'll pull the current market rent for that area.`,
      actions: [
        { type: "update", label: "Tenancy ended", value: "Archived", color: "#6366f1" },
        { type: "checklist", label: "Deposit checklist", value: "Triggered", color: "#f59e0b" },
        { type: "record", label: "Void period", value: "Tax noted", color: "#22c55e" },
      ],
    };
  }

  return {
    reply: `I understood that. Let me pull the relevant data from your portfolio and prepare the right response. In the live platform, this would update your records, create alerts, and surface relevant intelligence automatically — with no forms.`,
    actions: [
      { type: "ai", label: "Intent recognised", value: "Processing", color: "#6366f1" },
      { type: "action", label: "Records would update", value: "Automatically", color: "#22c55e" },
    ],
  };
}

const DEMO_PROMPTS = [
  { label: "Log a payment", text: "Tenant paid £1,250 today for 14 Maple Street." },
  { label: "Add a property", text: "Bought 22 Oak Avenue Manchester for £195,000 in March 2024." },
  { label: "Log maintenance", text: "Boiler replaced at Flat 3. Dave charged £650." },
  { label: "Report an issue", text: "Tenant at Park Road reported a leaking tap in the kitchen." },
  { label: "Check mortgages", text: "Show mortgages expiring this year." },
  { label: "Today's priorities", text: "What should I focus on today?" },
  { label: "Tax position", text: "How much tax am I likely to owe this year?" },
  { label: "Best property", text: "Which property is my most profitable?" },
];

const COMPARISONS = [
  { task: "Add a new property", old: "Navigate to Properties → Add New → Fill 12-field form → Add mortgage separately → Add tenant separately → Link records manually", rentura: '"Bought 14 High Street Manchester for £220k. Barclays mortgage, 4.8% fixed. Tenant John pays £1,250/mo." → Done.' },
  { task: "Log a maintenance cost", old: "Go to Maintenance → New Issue → Choose property from dropdown → Select category → Fill description → Set priority → Save → Go to Financials → Add expense → Link to property", rentura: '"Boiler replaced at Flat 3. Cost £650." → Job logged. Expense categorised. Tax summary updated. Property history filed.' },
  { task: "Record a rent payment", old: "Open rent ledger → Find tenant → Click Record Payment → Enter amount → Enter date → Select payment method → Save → Check arrears separately", rentura: '"Tenant paid £1,100 today." → Logged. Ledger updated. Arrears cleared. Receipt created.' },
  { task: "Log compliance certificate", old: "Settings → Compliance → Select property → Select certificate type → Enter expiry date → Upload PDF → Set reminder manually", rentura: 'Forward the certificate email to rentura@yourplatform.com → Everything extracted, stored, dated and reminder set automatically.' },
];

const PROACTIVE_ALERTS = [
  { icon: "⚠️", type: "Mortgage", msg: "14 Maple Street — Barclays fixed rate expires in 41 days. SVR reversion costs £284/month extra. Want me to prepare a broker brief?", color: "#ef4444" },
  { icon: "📋", type: "Compliance", msg: "Gas Safety at Flat 4, Grove Lane expires in 9 days. Last engineer was Dave Morris — shall I contact him to rebook?", color: "#f59e0b" },
  { icon: "💷", type: "Rent Review", msg: "You haven't reviewed rent on 22 Park Road for 18 months. Market rate has increased to £950. Current rent: £795. Potential extra income: £1,860/year.", color: "#22c55e" },
  { icon: "🔧", type: "Maintenance Trend", msg: "22 Park Road has had 4 plumbing issues in 12 months. Total spend: £2,340. This may indicate a systemic issue — worth a full plumbing survey.", color: "#6366f1" },
  { icon: "🧾", type: "Tax", msg: "3 contractor invoices have been received but not allocated to a property. This may affect your self-assessment. Upload or forward them to link automatically.", color: "#d4af37" },
];

function TypewriterText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const t = setInterval(() => {
      if (i <= text.length) { setDisplayed(text.slice(0, i)); i++; }
      else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <>{displayed}</>;
}

export default function RenturaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi. Tell me what happened — or ask me anything about your portfolio. I'll handle the rest.",
      ts: "now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCompare, setOpenCompare] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = useCallback((text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text: text.trim(), ts: "just now" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const { reply, actions } = parseMessage(text);
      setMessages(m => [...m, { role: "ai", text: reply, actions, ts: "just now" }]);
      setLoading(false);
    }, 900 + Math.random() * 400);
  }, [loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: "#06080f", color: "white", minHeight: "100vh" }}>

      {/* TOPBAR */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>PropertyVault UK</Link>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>›</span>
          <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "-0.03em" }}>Rentura</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em" }}>Early Access</span>
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: "96px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(99,102,241,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 100, padding: "6px 18px", fontSize: 11, color: "#a5b4fc", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 30 }}>
            Conversational Property OS · £9.99/month
          </div>

          <h1 style={{ fontSize: "clamp(40px,6.5vw,76px)", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-0.04em", marginBottom: 28, fontFamily: "var(--font-family-heading)" }}>
            Tell Rentura<br />
            <span style={{ background: "linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>what happened.</span><br />
            <span style={{ fontSize: "0.8em", color: "rgba(255,255,255,0.55)", WebkitTextFillColor: "rgba(255,255,255,0.55)" }}>It handles the rest.</span>
          </h1>

          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(255,255,255,0.45)", maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.75 }}>
            No forms. No menus. No dashboards. No data entry.<br />
            Just tell Rentura what happened — and watch it organise your entire property business.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#ask" style={{ display: "inline-block", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontWeight: 800, fontSize: 15, padding: "14px 36px", borderRadius: 14, textDecoration: "none" }}>
              Try it now →
            </a>
            <a href="#compare" style={{ display: "inline-block", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 15, padding: "14px 36px", borderRadius: 14, textDecoration: "none" }}>
              See the difference
            </a>
          </div>
        </div>
      </section>

      {/* ASK RENTURA — LIVE DEMO */}
      <section id="ask" style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>
              Ask Rentura™
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>The only interface you need. Type what happened — or ask anything.</p>
          </div>

          {/* Quick prompts */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 20 }}>
            {DEMO_PROMPTS.map(p => (
              <button key={p.label} onClick={() => send(p.text)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 22, overflow: "hidden" }}>
            {/* Chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(239,68,68,0.4)" }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(245,158,11,0.4)" }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(34,197,94,0.4)" }} />
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginLeft: 8 }}>Rentura · Conversational OS · Live Demo</span>
            </div>

            {/* Messages */}
            <div style={{ height: 440, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                  {/* Bubble */}
                  <div style={{ maxWidth: "82%", background: msg.role === "user" ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)", border: `1px solid ${msg.role === "user" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "13px 16px" }}>
                    {msg.role === "ai" && <p style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Rentura</p>}
                    <p style={{ fontSize: 13, color: msg.role === "user" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.75)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {i === messages.length - 1 && msg.role === "ai" ? <TypewriterText text={msg.text} /> : msg.text}
                    </p>
                  </div>
                  {/* Action chips */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "82%" }}>
                      {msg.actions.map((a, ai) => (
                        <div key={ai} style={{ background: a.color + "12", border: `1px solid ${a.color}28`, borderRadius: 10, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: a.color }}>{a.label}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>·</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{a.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px 18px 18px 4px", padding: "13px 16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Rentura</p>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {[0, 1, 2].map(d => (
                        <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: `bounce 0.8s ${d * 0.15}s infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send(input)}
                  placeholder="Tell me what happened, or ask anything…"
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "11px 16px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
                <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ background: input.trim() ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "11px 18px", color: input.trim() ? "white" : "rgba(255,255,255,0.2)", fontWeight: 800, fontSize: 13, cursor: input.trim() ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0 }}>
                  Send
                </button>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 8, textAlign: "center" }}>This is a live demo — try typing anything. In the real platform, your portfolio data would power every response.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY — no forms */}
      <section style={{ padding: "0 24px 80px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "64px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12, fontFamily: "var(--font-family-heading)" }}>
              The end of property admin.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto" }}>
              Every competitor asks you to fill forms. Rentura asks you what happened. One approach creates friction. One eliminates it.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            {/* Old way */}
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#ef4444" }}>✗</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Traditional software</span>
              </div>
              {["Navigate to a menu", "Find the right form", "Fill multiple fields", "Link to the right property", "Save and confirm", "Do it again for each record", "Hope nothing gets lost"].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center", opacity: 0.55 }}>
                  <span style={{ fontSize: 11, color: "#ef4444", background: "rgba(239,68,68,0.08)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{step}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ fontSize: 12, color: "#f87171" }}>Result: 7 steps. 4 minutes. Landlord gives up.</p>
              </div>
            </div>

            {/* Rentura way */}
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#a5b4fc" }}>✓</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em" }}>Rentura</span>
              </div>
              <div style={{ background: "rgba(99,102,241,0.06)", border: "1.5px solid rgba(99,102,241,0.18)", borderRadius: 14, padding: "16px" }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, fontFamily: "monospace" }}>
                  &ldquo;Tenant paid £1,100 today.&rdquo;
                </p>
              </div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Payment logged", color: "#22c55e" },
                  { label: "Rent ledger updated", color: "#22c55e" },
                  { label: "Arrears cleared", color: "#22c55e" },
                  { label: "Receipt created", color: "#22c55e" },
                  { label: "Tax record updated", color: "#d4af37" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>Auto</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: "12px 16px" }}>
                <p style={{ fontSize: 12, color: "#4ade80" }}>Result: 1 sentence. 8 seconds. Everything done.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIDE-BY-SIDE COMPARISONS */}
      <section id="compare" style={{ padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>
              Every workflow. Simplified.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Tap any task to see the difference.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COMPARISONS.map((c, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${openCompare === i ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: 16, overflow: "hidden" }}>
                <button onClick={() => setOpenCompare(openCompare === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: "white", textAlign: "left", gap: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{c.task}</span>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.25)" }}>{openCompare === i ? "−" : "+"}</span>
                </button>
                {openCompare === i && (
                  <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Traditional Software</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{c.old}</p>
                    </div>
                    <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Rentura</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontFamily: "monospace" }}>{c.rentura}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INPUT CHANNELS */}
      <section style={{ padding: "0 24px 80px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "64px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>
              Tell Rentura any way you want.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Type. Talk. Forward an email. Upload a document. WhatsApp. Rentura reads it all.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
            {[
              {
                icon: "💬", title: "Type it", color: "#6366f1",
                eg: '"Boiler replaced at Flat 3. Cost £650."',
                result: "Job logged · Expense filed · Tax noted",
              },
              {
                icon: "🎤", title: "Say it", color: "#a855f7",
                eg: '"Tenant at B11TU reported a leaking radiator. Dave visiting Friday, estimated £200."',
                result: "Issue created · Contractor task added · Cost estimated",
              },
              {
                icon: "📧", title: "Forward an email", color: "#0891b2",
                eg: "Forward your gas certificate renewal email to Rentura",
                result: "Document read · Record updated · Reminder set",
              },
              {
                icon: "📄", title: "Upload a document", color: "#d4af37",
                eg: "Upload a mortgage statement, invoice, or tenancy agreement",
                result: "AI extracts all data · No manual entry required",
              },
              {
                icon: "📱", title: "WhatsApp", color: "#25D366",
                eg: "Forward a contractor quote, tenant message, or invoice",
                result: "Filed to property · Workflow triggered",
              },
              {
                icon: "📸", title: "Photo or video", color: "#ec4899",
                eg: "Tenant photos of damage, receipts, certificates",
                result: "AI reads image · Data extracted · Record updated",
              },
            ].map(ch => (
              <div key={ch.title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 18px" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{ch.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10, color: ch.color }}>{ch.title}</h3>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.55, fontFamily: "monospace", fontStyle: "italic" }}>&ldquo;{ch.eg}&rdquo;</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ch.result.split(" · ").map(r => (
                    <span key={r} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: ch.color + "15", color: ch.color }}>{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROACTIVE AI CO-PILOT */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>
              The AI Co-Pilot that tells you first.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 460, margin: "0 auto" }}>
              You don&apos;t ask — Rentura already knows. It watches your portfolio and surfaces issues before they become problems.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROACTIVE_ALERTS.map((alert, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${alert.color}18`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{alert.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: alert.color + "15", color: alert.color }}>{alert.type}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>Proactive Alert</span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>{alert.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY MEMORY */}
      <section style={{ padding: "0 24px 80px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "64px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-block", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 100, padding: "4px 14px", fontSize: 11, color: "#c084fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Property Memory</div>
              <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16, fontFamily: "var(--font-family-heading)" }}>
                Every property<br />remembers everything.
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 20 }}>
                Every conversation, every contractor visit, every payment, every inspection, every document — permanently attached to the property record. When you view a property, you see its complete story.
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                Sell the property? The history exports with it. Switch letting agents? Your data stays with you. Cancel the subscription? Full data export, no lock-in.
              </p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800 }}>22 Oak Avenue, Manchester</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Property Timeline</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>Live</span>
              </div>
              <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { date: "Jun 2026", event: "Rent reviewed — increased £900 → £975", type: "financial", color: "#22c55e" },
                  { date: "May 2026", event: "EICR certificate uploaded and filed", type: "compliance", color: "#d4af37" },
                  { date: "Mar 2026", event: "Tenant reported damp — resolved in 6 days", type: "maintenance", color: "#6366f1" },
                  { date: "Jan 2026", event: "Mortgage reviewed — retained Barclays 4.2%", type: "mortgage", color: "#a855f7" },
                  { date: "Nov 2025", event: "New tenant moved in — AST signed digitally", type: "tenancy", color: "#0891b2" },
                  { date: "Jul 2025", event: "Property purchased — £195,000", type: "purchase", color: "#d4af37" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      {i < 5 && <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.07)", marginTop: 3 }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < 5 ? 4 : 0 }}>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2, fontWeight: 600 }}>{item.date}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="early-access" style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(99,102,241,0.22)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.07))", borderBottom: "1px solid rgba(99,102,241,0.12)", padding: "22px 28px", textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 4 }}>Rentura</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>The Conversational Property OS</p>
            </div>
            <div style={{ padding: "28px 28px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 54, fontWeight: 900, lineHeight: 1 }}>£9.99</span>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>/month</span>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Cancel anytime · 14-day money-back</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {[
                  ["Ask Rentura™", "Natural language command bar — the only interface you need"],
                  ["Voice notes", "Talk to Rentura on the move"],
                  ["Email forwarding", "Forward certificates, invoices, statements"],
                  ["Document AI", "Upload anything — AI extracts everything"],
                  ["Property Memory", "Complete history for every property, forever"],
                  ["AI Co-Pilot", "Proactive alerts — issues flagged before you notice"],
                  ["Maintenance workflow", "AI triage, contractor dispatch, full tracking"],
                  ["Tax Intelligence", "Live liability estimate, receipt capture, expense tagging"],
                  ["Mortgage Intelligence", "Expiry alerts, rate comparisons, broker brief generation"],
                  ["Compliance Engine", "Never miss a certificate, licence, or deadline"],
                  ["Tenant Portal", "Premium self-service portal for your tenants"],
                  ["WhatsApp integration", "Forward anything, get updates anywhere"],
                ].map(([feature, desc]) => (
                  <div key={feature} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#6366f1", fontWeight: 800, flexShrink: 0, fontSize: 13 }}>✓</span>
                    <div>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{feature}</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>— {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a href="mailto:gowads047@gmail.com?subject=Rentura Early Access Request&body=Hi Nass, I'd like early access to Rentura. My portfolio: " style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontWeight: 800, fontSize: 16, padding: "16px", borderRadius: 14, textDecoration: "none", marginBottom: 12 }}>
                Request Early Access →
              </a>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.7 }}>
                Early access members lock in £9.99/month permanently. 14-day money-back guarantee under Consumer Contracts Regulations 2013. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 4 }}>Rentura</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>by PropertyVault UK · The Conversational Operating System for Landlords</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 16px" }}>
          Rentura is a property intelligence and management platform. Nothing on this page constitutes financial, legal, tax, or mortgage advice. AI-generated insights are indicative only and should not replace qualified professional advice. &copy; {new Date().getFullYear()} PropertyVault UK. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Home</Link>
          <Link href="/privacy" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Terms</Link>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
