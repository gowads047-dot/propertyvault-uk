"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Conversation engine ──────────────────────────────────────────────────────

type Action = { type: string; label: string; value: string; color: string };
type Message = { role: "user" | "ai"; text: string; actions?: Action[]; ts?: string };

function parseMessage(input: string): { reply: string; actions: Action[] } {
  const i = input.toLowerCase();

  if (i.includes("paid") && (i.includes("£") || i.match(/\d{3,4}/))) {
    const amount = input.match(/£[\d,]+/)?.[0] || input.match(/[\d,]{3,4}/)?.[0] || "amount";
    return {
      reply: `Got it. Payment of ${amount} recorded against your rent ledger. Arrears cleared if any were outstanding. Tenant record updated. Receipt available under Financials.`,
      actions: [
        { type: "record", label: "Payment logged", value: amount, color: "#16a34a" },
        { type: "update", label: "Ledger updated", value: "Rent account", color: "#2563eb" },
        { type: "clear", label: "Arrears cleared", value: "£0 outstanding", color: "#16a34a" },
      ],
    };
  }

  if (i.includes("bought") || i.includes("purchased") || (i.includes("new property") && i.match(/£[\d,k]+/i))) {
    const address = input.match(/at\s+([^,for]+)/i)?.[1]?.trim() || "new address";
    const price = input.match(/£[\d,]+k?/i)?.[0] || "purchase price";
    return {
      reply: `New property added. I've created the property record, mortgage placeholder, and timeline for ${address}. Add your mortgage details and I'll track the expiry, LTV, and refinancing windows automatically.`,
      actions: [
        { type: "create", label: "Property created", value: address, color: "#2563eb" },
        { type: "create", label: "Timeline started", value: "Purchase recorded", color: "#7c3aed" },
        { type: "pending", label: "Mortgage needed", value: price + " purchase", color: "#d97706" },
      ],
    };
  }

  if (i.includes("boiler") || i.includes("replaced") || (i.includes("cost") && i.match(/£\d+/))) {
    const cost = input.match(/£[\d,]+/)?.[0] || "cost";
    const property = input.match(/(?:at|flat|house|property)\s+([^\.\,]+)/i)?.[1]?.trim();
    return {
      reply: `Maintenance job logged and filed. ${cost} expense categorised as repairs — tax allowable. ${property ? `Attached to ${property}.` : ""} I've updated the maintenance history and flagged it for your self-assessment summary.`,
      actions: [
        { type: "record", label: "Expense logged", value: cost + " — repairs", color: "#16a34a" },
        { type: "tax", label: "Tax allowable", value: "Added to SA summary", color: "#b8962e" },
        { type: "history", label: "Property history updated", value: property || "property", color: "#2563eb" },
      ],
    };
  }

  if (i.includes("leak") || i.includes("damp") || i.includes("broken") || i.includes("reported") || i.includes("tap") || i.includes("radiator") || i.includes("crack")) {
    const issue = i.includes("leak") ? "leak" : i.includes("damp") ? "damp" : i.includes("radiator") ? "radiator fault" : "maintenance issue";
    return {
      reply: `Maintenance issue created and flagged as urgent. I've categorised this as a ${issue}, assessed urgency as Medium-High, and prepared a contractor brief. Tenant will receive an auto-acknowledgement. Ready to share with your contractor via WhatsApp or email?`,
      actions: [
        { type: "create", label: "Issue created", value: issue.charAt(0).toUpperCase() + issue.slice(1), color: "#dc2626" },
        { type: "alert", label: "Urgency assessed", value: "Medium-High", color: "#d97706" },
        { type: "notify", label: "Tenant acknowledged", value: "Auto-sent", color: "#2563eb" },
        { type: "action", label: "Contractor brief ready", value: "Tap to share", color: "#16a34a" },
      ],
    };
  }

  if (i.includes("mortgage") && (i.includes("expir") || i.includes("this year") || i.includes("upcoming") || i.includes("renew"))) {
    return {
      reply: `You have 2 mortgages expiring in the next 12 months:\n\n• 14 Maple Street — Barclays 2.89% fixed, expires 3 Aug 2026 (41 days). SVR reversion would cost £284/month extra.\n• 22 Park Road — NatWest 3.2% fixed, expires 14 Nov 2026 (5 months). £196/month difference.\n\nWant me to prepare a broker brief for both?`,
      actions: [
        { type: "alert", label: "Maple Street", value: "41 days · urgent", color: "#dc2626" },
        { type: "alert", label: "Park Road", value: "5 months", color: "#d97706" },
        { type: "action", label: "Broker brief", value: "Ready to generate", color: "#2563eb" },
      ],
    };
  }

  if (i.includes("focus") || i.includes("today") || i.includes("priority") || i.includes("important")) {
    return {
      reply: `3 things need your attention today:\n\n1. Gas Safety on Flat 4, Grove Lane — expires in 9 days. Book it now.\n2. Tenant at 22 Park Road has had an open maintenance issue for 6 days. Chase the contractor.\n3. Mortgage at 14 Maple Street expires in 41 days — rate reversion will cost £3,408/year extra.\n\nEverything else can wait.`,
      actions: [
        { type: "urgent", label: "Gas Safety due", value: "9 days", color: "#dc2626" },
        { type: "chase", label: "Maintenance stalled", value: "6 days open", color: "#d97706" },
        { type: "alert", label: "Mortgage expiry", value: "41 days", color: "#d97706" },
      ],
    };
  }

  if (i.includes("profitable") || i.includes("best property") || i.includes("performing")) {
    return {
      reply: `Your best performer is 14 Maple Street. Net yield 8.4%, monthly cash flow £612, ROI since purchase 31.2%. It generates 43% of your total portfolio income on 28% of your total capital. Your weakest is 22 Park Road — yield 4.1%, high maintenance spend, rent below market rate.`,
      actions: [
        { type: "top", label: "14 Maple Street", value: "8.4% yield · £612/mo CF", color: "#16a34a" },
        { type: "low", label: "22 Park Road", value: "4.1% yield · review needed", color: "#dc2626" },
      ],
    };
  }

  if (i.includes("tax") || i.includes("owe") || i.includes("self assessment") || i.includes("hmrc")) {
    return {
      reply: `Based on rent received and expenses logged so far, your estimated self-assessment liability this year is £6,240. Allowable expenses tracked: £14,330. I've flagged 3 potential missing receipts that could reduce your bill by ~£680. Tip: the boiler replacement at Flat 3 may qualify for capital allowances — worth checking with your accountant.`,
      actions: [
        { type: "tax", label: "Estimated liability", value: "£6,240", color: "#b8962e" },
        { type: "saving", label: "Missing receipts", value: "~£680 saving possible", color: "#16a34a" },
        { type: "tip", label: "Capital allowance flag", value: "Boiler — Flat 3", color: "#2563eb" },
      ],
    };
  }

  if (i.includes("tenant") && (i.includes("moved") || i.includes("vacated") || i.includes("left") || i.includes("ended"))) {
    return {
      reply: `Tenancy marked as ended. I've triggered the deposit return checklist, flagged the property as vacant, and created a void period record for your tax summary. When you're ready to re-let, I'll pull the current market rent for that area.`,
      actions: [
        { type: "update", label: "Tenancy ended", value: "Archived", color: "#2563eb" },
        { type: "checklist", label: "Deposit checklist", value: "Triggered", color: "#d97706" },
        { type: "record", label: "Void period", value: "Tax noted", color: "#16a34a" },
      ],
    };
  }

  const recognized = [
    "rent", "tenant", "property", "maintenance", "certificate", "inspection",
    "compliance", "income", "expense", "deposit", "contract", "agency",
    "landlord", "letting", "portfolio", "invoice", "receipt",
  ].some(kw => i.includes(kw));

  if (!recognized || input.trim().length < 5) {
    return {
      reply: `I didn't quite catch that. Try something like:\n\n• "Tenant paid £1,250 today for Maple Street"\n• "Boiler replaced at Flat 3, cost £650"\n• "What should I focus on today?"\n• "Show mortgages expiring this year"\n\nThe more detail you give me, the more I can do.`,
      actions: [
        { type: "help", label: "Tip", value: "More detail = better response", color: "#2563eb" },
      ],
    };
  }

  return {
    reply: `Got it — I've noted that. In the live platform, Rentura would parse your message, update the right records, set any reminders, and flag anything that needs your attention. No forms. No menus. Just this.`,
    actions: [
      { type: "ai", label: "Intent recognised", value: "Processing", color: "#2563eb" },
      { type: "action", label: "Records would update", value: "Automatically", color: "#16a34a" },
    ],
  };
}

const DEMO_PROMPTS = [
  { label: "Log a payment", text: "Tenant paid £1,250 today for 14 Maple Street." },
  { label: "Add a property", text: "Bought 22 Oak Avenue Manchester for £195,000." },
  { label: "Log maintenance", text: "Boiler replaced at Flat 3. Dave charged £650." },
  { label: "Report an issue", text: "Tenant at Park Road reported a leaking tap." },
  { label: "Check mortgages", text: "Show mortgages expiring this year." },
  { label: "Today's priorities", text: "What should I focus on today?" },
  { label: "Tax position", text: "How much tax am I likely to owe this year?" },
  { label: "Best property", text: "Which property is my most profitable?" },
];

const COMPARISONS = [
  { task: "Add a new property", old: "Navigate to Properties → Add New → Fill 12-field form → Add mortgage separately → Add tenant separately → Link records manually", rentura: '"Bought 14 High Street Manchester for £220k. Barclays mortgage, 4.8% fixed. Tenant John pays £1,250/mo." → Done.' },
  { task: "Log a maintenance cost", old: "Go to Maintenance → New Issue → Choose property from dropdown → Select category → Fill description → Set priority → Save → Go to Financials → Add expense → Link to property", rentura: '"Boiler replaced at Flat 3. Cost £650." → Job logged. Expense categorised. Tax summary updated. Property history filed.' },
  { task: "Record a rent payment", old: "Open rent ledger → Find tenant → Click Record Payment → Enter amount → Enter date → Select payment method → Save → Check arrears separately", rentura: '"Tenant paid £1,100 today." → Logged. Ledger updated. Arrears cleared. Receipt created.' },
  { task: "Log compliance certificate", old: "Settings → Compliance → Select property → Select certificate type → Enter expiry date → Upload PDF → Set reminder manually", rentura: "Forward the certificate email to Rentura → Everything extracted, stored, dated and reminder set automatically." },
];

const PROACTIVE_ALERTS = [
  { icon: "⚠️", type: "Mortgage", msg: "14 Maple Street — Barclays fixed rate expires in 41 days. SVR reversion costs £284/month extra. Want me to prepare a broker brief?", urgency: "Urgent" },
  { icon: "📋", type: "Compliance", msg: "Gas Safety at Flat 4, Grove Lane expires in 9 days. Last engineer was Dave Morris — shall I contact him to rebook?", urgency: "Action needed" },
  { icon: "💷", type: "Rent Review", msg: "You haven't reviewed rent on 22 Park Road for 18 months. Market rate has increased to £950. Current rent: £795. Potential extra income: £1,860/year.", urgency: "Opportunity" },
  { icon: "🔧", type: "Maintenance Trend", msg: "22 Park Road has had 4 plumbing issues in 12 months. Total spend: £2,340. This may indicate a systemic issue — worth a full plumbing survey.", urgency: "Advisory" },
  { icon: "🧾", type: "Tax", msg: "3 contractor invoices have been received but not allocated to a property. This may affect your self-assessment. Upload or forward them to link automatically.", urgency: "Review" },
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

// ─── Design helpers ───────────────────────────────────────────────────────────

function WatermarkBg() {
  const items = [
    { l: "7%",  t: "8%",  r: -3, txt: "yield = (annual_rent ÷ property_value) × 100" },
    { l: "54%", t: "5%",  r:  5, txt: "LTV = outstanding_loan ÷ current_value" },
    { l: "1%",  t: "28%", r: -2, txt: "ROI = (profit ÷ total_investment) × 100" },
    { l: "61%", t: "24%", r:  4, txt: "NOI = gross_income − operating_expenses" },
    { l: "3%",  t: "50%", r: -1, txt: "cash_flow = rent − mortgage − maintenance" },
    { l: "40%", t: "46%", r:  3, txt: "GY = annual_rent ÷ purchase_price" },
    { l: "67%", t: "65%", r: -4, txt: "service_charge = annual_est ÷ 12" },
    { l: "6%",  t: "73%", r:  2, txt: "rental_growth = (new_rent − old_rent) ÷ old_rent" },
    { l: "36%", t: "85%", r: -3, txt: "BRRR = refinance_value − total_costs" },
    { l: "71%", t: "41%", r:  6, txt: "arrears = rent_due − payments_received" },
    { l: "18%", t: "60%", r: -5, txt: "stamp_duty = (purchase_price − threshold) × rate" },
    { l: "53%", t: "80%", r:  2, txt: "portfolio_yield = total_annual_rent ÷ total_value" },
    { l: "78%", t: "17%", r: -6, txt: "void_cost = mortgage + bills × void_weeks" },
    { l: "25%", t: "18%", r:  3, txt: "net_yield = (rent − expenses) ÷ value" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {items.map((it, idx) => (
        <span key={idx} style={{ position: "absolute", left: it.l, top: it.t, transform: `rotate(${it.r}deg)`, fontSize: 10.5, color: "rgba(0,0,0,0.042)", fontFamily: "Georgia, 'Times New Roman', serif", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
          {it.txt}
        </span>
      ))}
    </div>
  );
}

function SectionBadge({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(17,17,17,0.16)", borderRadius: 100, padding: "5px 16px", fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.42)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 26 }}>
      <span style={{ color: "rgba(17,17,17,0.24)" }}>§{n}</span>
      <span style={{ width: 1, height: 9, background: "rgba(17,17,17,0.12)", display: "inline-block" }} />
      {label}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RenturaPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi. Tell me what happened — or ask me anything about your portfolio. I'll handle the rest.", ts: "now" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCompare, setOpenCompare] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = useCallback((text: string) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, { role: "user", text: text.trim(), ts: "just now" }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const { reply, actions } = parseMessage(text);
      setMessages(m => [...m, { role: "ai", text: reply, actions, ts: "just now" }]);
      setLoading(false);
    }, 900 + Math.random() * 400);
  }, [loading]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const BG  = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const INK3 = "rgba(17,17,17,0.30)";
  const BORDER = "rgba(17,17,17,0.09)";
  const BORDER_MED = "rgba(17,17,17,0.14)";
  const CARD_BG = "rgba(255,255,255,0.52)";
  const CTA = "#0f1728";
  const CHAT_BG = "#0c0f1a";

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", position: "relative" }}>
      <WatermarkBg />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{ position: "relative", zIndex: 10, borderBottom: `1px solid ${BORDER}`, padding: "13px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <Link href="/" style={{ color: INK3, textDecoration: "none", fontWeight: 500 }}>PropertyVault UK</Link>
          <span style={{ color: INK3 }}>›</span>
          <span style={{ color: INK, fontWeight: 800, letterSpacing: "-0.02em" }}>Rentura</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: INK3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          Early Access · Beta
        </div>
      </nav>

      {/* ── §01 HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "88px 32px 80px", maxWidth: 1020, margin: "0 auto" }}>
        <SectionBadge n="01" label="The Idea" />

        <h1 style={{ fontSize: "clamp(52px, 8vw, 102px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", marginBottom: 30, fontFamily: "var(--font-family-heading)", color: INK, maxWidth: 800 }}>
          Tell Rentura<br />
          what happened.
        </h1>
        <p style={{ fontSize: "clamp(20px, 2.4vw, 26px)", color: INK2, maxWidth: 600, lineHeight: 1.55, marginBottom: 44, fontWeight: 400 }}>
          No forms. No menus. No dashboards.<br />
          Just say what happened — Rentura handles the rest.
        </p>

        {/* Metadata row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 48px", marginBottom: 52, borderTop: `1px solid ${BORDER}`, paddingTop: 24 }}>
          {[
            ["Type", "Conversational Property OS"],
            ["Built for", "UK Landlords"],
            ["Input", "Natural language · voice · email · WhatsApp"],
            ["Price", "£9.99 / month · Early Access"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{k}</p>
              <p style={{ fontSize: 14, color: INK2, fontWeight: 500 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#ask" style={{ display: "inline-block", background: CTA, color: "white", fontWeight: 700, fontSize: 14, padding: "13px 32px", borderRadius: 10, textDecoration: "none", letterSpacing: "-0.01em" }}>
            Try the demo →
          </a>
          <a href="#compare" style={{ display: "inline-block", background: "transparent", border: `1px solid ${BORDER_MED}`, color: INK2, fontWeight: 600, fontSize: 14, padding: "13px 32px", borderRadius: 10, textDecoration: "none" }}>
            See how it compares
          </a>
        </div>
      </section>

      {/* ── §02 DEMO ─────────────────────────────────────────────────────────── */}
      <section id="ask" style={{ position: "relative", zIndex: 1, padding: "0 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 72, marginBottom: 0 }}>
          <SectionBadge n="02" label="The Demo" />
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 14, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1 }}>
            Ask Rentura™
          </h2>
          <p style={{ fontSize: 16, color: INK2, marginBottom: 32, maxWidth: 480 }}>
            Type what happened — or use a prompt below. This is a live demo; a real portfolio would power every response.
          </p>

          {/* Quick prompts */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
            {DEMO_PROMPTS.map(p => (
              <button key={p.label} onClick={() => send(p.text)} style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${BORDER_MED}`, borderRadius: 100, padding: "7px 16px", fontSize: 12, color: INK2, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Chat window — stays dark: it's the product */}
          <div style={{ background: CHAT_BG, borderRadius: 18, overflow: "hidden", border: `1px solid rgba(255,255,255,0.06)`, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            {/* Chrome bar */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["rgba(239,68,68,0.45)", "rgba(245,158,11,0.45)", "rgba(34,197,94,0.45)"].map((c, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontFamily: "monospace", marginLeft: 10 }}>Rentura · Conversational OS · Live Demo</span>
            </div>

            {/* Messages */}
            <div style={{ height: 420, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                  <div style={{ maxWidth: "82%", background: msg.role === "user" ? "rgba(15,23,40,0.8)" : "rgba(255,255,255,0.05)", border: `1px solid ${msg.role === "user" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`, borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "12px 16px" }}>
                    {msg.role === "ai" && <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Rentura</p>}
                    <p style={{ fontSize: 13, color: msg.role === "user" ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {idx === messages.length - 1 && msg.role === "ai" ? <TypewriterText text={msg.text} /> : msg.text}
                    </p>
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "82%" }}>
                      {msg.actions.map((a, ai) => (
                        <div key={ai} style={{ background: a.color + "14", border: `1px solid ${a.color}30`, borderRadius: 8, padding: "4px 11px", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: a.color }}>{a.label}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>·</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.44)" }}>{a.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px", padding: "12px 16px" }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>Rentura</p>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0, 1, 2].map(d => (
                        <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.35)", animation: `bounce 0.8s ${d * 0.15}s infinite` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send(input)}
                  placeholder="Tell me what happened, or ask anything…"
                  style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "11px 16px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
                <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ background: input.trim() ? CTA : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "11px 20px", color: input.trim() ? "white" : "rgba(255,255,255,0.18)", fontWeight: 700, fontSize: 13, cursor: input.trim() ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0, fontFamily: "inherit" }}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §03 DIFFERENCE ───────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <SectionBadge n="03" label="The Difference" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16, fontFamily: "var(--font-family-heading)", color: INK }}>
              One sentence.<br />Everything done.
            </h2>
            <p style={{ fontSize: 16, color: INK2, lineHeight: 1.7, marginBottom: 28 }}>
              Every other property platform asks you to navigate menus and fill forms. Rentura asks you what happened — and silently handles the rest.
            </p>
            <div style={{ borderLeft: `2px solid ${BORDER_MED}`, paddingLeft: 18 }}>
              {["7 steps replaced by 1 sentence", "Records updated automatically", "Tax, compliance and alerts — included", "No training required"].map(txt => (
                <p key={txt} style={{ fontSize: 14, color: INK2, marginBottom: 10, lineHeight: 1.55 }}>— {txt}</p>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Old */}
            <div style={{ background: "rgba(220,38,38,0.04)", border: `1px solid rgba(220,38,38,0.12)`, borderRadius: 16, padding: "20px 22px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(220,38,38,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Traditional software</p>
              {["Navigate to a menu", "Find the right form", "Fill multiple fields", "Link to the right property", "Save and confirm", "Repeat for each record"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "rgba(220,38,38,0.5)", background: "rgba(220,38,38,0.08)", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>{s}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid rgba(220,38,38,0.1)` }}>
                <p style={{ fontSize: 12, color: "rgba(220,38,38,0.7)", fontWeight: 600 }}>7 steps. 4 minutes. Landlord gives up.</p>
              </div>
            </div>

            {/* Rentura */}
            <div style={{ background: "rgba(255,255,255,0.65)", border: `1px solid ${BORDER_MED}`, borderRadius: 16, padding: "20px 22px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Rentura</p>
              <p style={{ fontSize: 15, color: INK, fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.6, marginBottom: 14 }}>
                &ldquo;Tenant paid £1,100 today.&rdquo;
              </p>
              {["Payment logged", "Rent ledger updated", "Arrears cleared", "Receipt created", "Tax record updated"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "center" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: INK2 }}>{item}</span>
                  <span style={{ fontSize: 10, color: INK3, marginLeft: "auto", fontWeight: 600 }}>Auto</span>
                </div>
              ))}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>1 sentence. 8 seconds. Everything done.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §04 WORKFLOWS ────────────────────────────────────────────────────── */}
      <section id="compare" style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <SectionBadge n="04" label="Every Workflow" />
        <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1.02 }}>
          Every task. Simplified.
        </h2>
        <p style={{ fontSize: 16, color: INK2, marginBottom: 40, maxWidth: 480 }}>Tap any workflow to see the comparison.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {COMPARISONS.map((c, i) => (
            <div key={i} style={{ background: openCompare === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.38)", border: `1px solid ${openCompare === i ? BORDER_MED : BORDER}`, borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}>
              <button onClick={() => setOpenCompare(openCompare === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: INK, textAlign: "left", gap: 16, fontFamily: "inherit" }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{c.task}</span>
                <span style={{ fontSize: 18, color: INK3, fontWeight: 300 }}>{openCompare === i ? "−" : "+"}</span>
              </button>
              {openCompare === i && (
                <div style={{ padding: "0 22px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.1)", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(220,38,38,0.55)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Traditional</p>
                    <p style={{ fontSize: 13, color: INK2, lineHeight: 1.7 }}>{c.old}</p>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.65)", border: `1px solid ${BORDER_MED}`, borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Rentura</p>
                    <p style={{ fontSize: 13, color: INK, lineHeight: 1.7, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{c.rentura}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── §05 INPUT CHANNELS ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <SectionBadge n="05" label="How You Speak To It" />
        <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1.02 }}>
          Any way you want.
        </h2>
        <p style={{ fontSize: 16, color: INK2, marginBottom: 44, maxWidth: 480 }}>
          Type. Talk. Forward an email. Upload a document. WhatsApp. Rentura reads it all.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
          {[
            { icon: "💬", title: "Type it", eg: '"Boiler replaced at Flat 3. Cost £650."', result: "Job logged · Expense filed · Tax noted" },
            { icon: "🎤", title: "Say it", eg: '"Tenant at B11TU reported a leaking radiator. Dave visiting Friday, estimated £200."', result: "Issue created · Contractor task added · Cost estimated" },
            { icon: "📧", title: "Forward an email", eg: "Forward your gas certificate renewal email to Rentura", result: "Document read · Record updated · Reminder set" },
            { icon: "📄", title: "Upload a document", eg: "Upload a mortgage statement, invoice, or tenancy agreement", result: "AI extracts all data · No manual entry required" },
            { icon: "📱", title: "WhatsApp", eg: "Forward a contractor quote, tenant message, or invoice", result: "Filed to property · Workflow triggered" },
            { icon: "📸", title: "Photo or video", eg: "Tenant photos of damage, receipts, certificates", result: "AI reads image · Data extracted · Record updated" },
          ].map(ch => (
            <div key={ch.title} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{ch.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: INK }}>{ch.title}</h3>
              <div style={{ background: "rgba(17,17,17,0.04)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: INK3, lineHeight: 1.6, fontFamily: "Georgia, serif", fontStyle: "italic" }}>&ldquo;{ch.eg}&rdquo;</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {ch.result.split(" · ").map(r => (
                  <span key={r} style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 6, background: "rgba(17,17,17,0.06)", color: INK2 }}>{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── §06 CO-PILOT ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <SectionBadge n="06" label="The Co-Pilot" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16, fontFamily: "var(--font-family-heading)", color: INK }}>
              It tells you first.
            </h2>
            <p style={{ fontSize: 16, color: INK2, lineHeight: 1.7 }}>
              You don&apos;t need to ask. Rentura watches your portfolio constantly and surfaces issues before they become problems. Missed deadlines, rent gaps, mortgage crunches — it flags them before you notice.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROACTIVE_ALERTS.map((alert, i) => (
              <div key={i} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{alert.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: INK, background: "rgba(17,17,17,0.07)", padding: "2px 9px", borderRadius: 20 }}>{alert.type}</span>
                    <span style={{ fontSize: 10, color: INK3, fontWeight: 600 }}>{alert.urgency}</span>
                  </div>
                  <p style={{ fontSize: 13, color: INK2, lineHeight: 1.65 }}>{alert.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §07 PROPERTY MEMORY ──────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <SectionBadge n="07" label="Property Memory" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16, fontFamily: "var(--font-family-heading)", color: INK }}>
              Every property<br />remembers everything.
            </h2>
            <p style={{ fontSize: 16, color: INK2, lineHeight: 1.7, marginBottom: 20 }}>
              Every conversation, every contractor visit, every payment, every inspection — permanently attached to the property record. When you view a property, you see its complete story.
            </p>
            <p style={{ fontSize: 14, color: INK3, lineHeight: 1.7 }}>
              Sell the property? History exports with it. Switch letting agents? Your data stays with you. Cancel? Full data export — no lock-in.
            </p>
          </div>
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER_MED}`, borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: INK }}>22 Oak Avenue, Manchester</p>
                <p style={{ fontSize: 11, color: INK3 }}>Property Timeline</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>Live</span>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { date: "Jun 2026", event: "Rent reviewed — increased £900 → £975", color: "#16a34a" },
                { date: "May 2026", event: "EICR certificate uploaded and filed", color: "#b8962e" },
                { date: "Mar 2026", event: "Tenant reported damp — resolved in 6 days", color: "#2563eb" },
                { date: "Jan 2026", event: "Mortgage reviewed — retained Barclays 4.2%", color: "#7c3aed" },
                { date: "Nov 2025", event: "New tenant moved in — AST signed digitally", color: "#0891b2" },
                { date: "Jul 2025", event: "Property purchased — £195,000", color: "#b8962e" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    {i < 5 && <div style={{ width: 1, height: 22, background: BORDER_MED, marginTop: 3 }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: INK3, marginBottom: 2, fontWeight: 600 }}>{item.date}</p>
                    <p style={{ fontSize: 13, color: INK2 }}>{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── §08 EARLY ACCESS ─────────────────────────────────────────────────── */}
      <section id="early-access" style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 640, margin: "0 auto" }}>
        <SectionBadge n="08" label="Early Access" />
        <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1.02 }}>
          £9.99 / month.<br />Cancel anytime.
        </h2>
        <p style={{ fontSize: 16, color: INK2, marginBottom: 40, maxWidth: 440 }}>
          Early access members lock in this price permanently. No contract. No setup fee.
        </p>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER_MED}`, borderRadius: 20, padding: "32px 30px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {[
              ["Ask Rentura™", "Natural language — the only interface you need"],
              ["Voice notes", "Talk to Rentura on the move"],
              ["Email forwarding", "Forward certificates, invoices, statements"],
              ["Document AI", "Upload anything — AI extracts everything"],
              ["Property Memory", "Complete history for every property, forever"],
              ["AI Co-Pilot", "Proactive alerts before you notice a problem"],
              ["Maintenance workflow", "AI triage, contractor dispatch, full tracking"],
              ["Tax Intelligence", "Live liability estimate, receipt capture, expense tagging"],
              ["Mortgage Intelligence", "Expiry alerts, rate comparisons, broker brief generation"],
              ["Compliance Engine", "Never miss a certificate, licence, or deadline"],
              ["Tenant Portal", "Premium self-service portal for your tenants"],
              ["WhatsApp integration", "Forward anything, get updates anywhere"],
            ].map(([feature, desc]) => (
              <div key={feature} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#16a34a", fontWeight: 800, flexShrink: 0, fontSize: 13, marginTop: 1 }}>✓</span>
                <div>
                  <span style={{ fontSize: 14, color: INK, fontWeight: 600 }}>{feature}</span>
                  <span style={{ fontSize: 13, color: INK3, marginLeft: 6 }}>— {desc}</span>
                </div>
              </div>
            ))}
          </div>
          <a href="mailto:gowads047@gmail.com?subject=Rentura Early Access Request&body=Hi Nass, I'd like early access to Rentura. My portfolio: " style={{ display: "block", textAlign: "center", background: CTA, color: "white", fontWeight: 700, fontSize: 15, padding: "16px", borderRadius: 12, textDecoration: "none", marginBottom: 14, letterSpacing: "-0.01em" }}>
            Request Early Access →
          </a>
          <p style={{ fontSize: 11, color: INK3, textAlign: "center", lineHeight: 1.7 }}>
            Early access price locked in permanently · 14-day money-back guarantee<br />Consumer Contracts Regulations 2013 · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "32px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.03em", color: INK, marginBottom: 3 }}>Rentura</p>
          <p style={{ fontSize: 11, color: INK3 }}>by PropertyVault UK · Conversational OS for Landlords</p>
        </div>
        <p style={{ fontSize: 11, color: INK3, maxWidth: 460, lineHeight: 1.65, textAlign: "right" }}>
          Nothing on this page constitutes financial, legal, tax, or mortgage advice. AI-generated insights are indicative only. © {new Date().getFullYear()} PropertyVault UK.
        </p>
        <div style={{ width: "100%", display: "flex", gap: 24, paddingTop: 8 }}>
          {[["Home", "/"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Academy", "/academy"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontSize: 12, color: INK3, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
