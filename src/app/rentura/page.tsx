"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const AI_QUESTIONS = [
  "Which mortgage expires next?",
  "What should I focus on today?",
  "Which property is most profitable?",
  "Which tenant reported a leak?",
  "How much tax am I likely to owe?",
  "Which compliance items expire this year?",
  "Which properties are underperforming?",
  "What maintenance costs increased this year?",
];

const AI_ANSWERS: Record<string, string> = {
  "Which mortgage expires next?": "Your Barclays BTL on 14 Maple Street expires in 47 days (3 Aug 2026). Fixed rate 2.89% → reverts to SVR 7.24%. Estimated savings from switching now: £284/month. 3 brokers have been notified.",
  "What should I focus on today?": "3 things need your attention: (1) Gas safety certificate on Flat 4, Grove Lane — expires in 9 days. (2) Tenant in 22 Park Road has an open maintenance issue, 6 days without update. (3) Rent review overdue on 8 Victoria Terrace — current rent £850, market rate £975.",
  "Which property is most profitable?": "14 Maple Street. Net yield 8.4%, monthly cash flow £612 after all costs. BRRR equity position: £74,000. ROI since purchase: 31.2%. It outperforms your portfolio average by 2.1%.",
  "Which tenant reported a leak?": "Sarah Mitchell at 22 Park Road (flat 2) reported a bathroom ceiling leak on 17 Jun. Status: Awaiting contractor. No update in 6 days. Mark Davis (plumber) was contacted but hasn't responded. Recommend: Chase or reassign.",
  "How much tax am I likely to owe?": "Based on your current income and expenses, estimated self-assessment liability this year: £6,240. Allowable expenses tracked: £14,330. Potential missing receipts flagged: 3 items (contractor invoices). Tip: Upload the Manchester invoice to reduce liability by ~£340.",
  "Which compliance items expire this year?": "4 items expire before Dec 2026: Gas Safety (Flat 4, Grove Lane) — 9 days. EICR (14 Maple Street) — 4 months. EPC (22 Park Road) — 7 months, currently rated D. Deposit protection renewal (Flat 4) — 2 months.",
  "Which properties are underperforming?": "22 Park Road is your weakest performer. Net yield 4.1% vs portfolio average 6.8%. 3 maintenance issues in 6 months (total: £2,340). Rent at £795 — market comparable is £900. Recommendation: Review rent, assess works needed, model against sale.",
  "What maintenance costs increased this year?": "Total maintenance spend YTD: £8,940 (+34% vs last year). Largest increases: plumbing (£3,200, up 61%) and boiler servicing (£1,440, up 28%). 22 Park Road accounts for 47% of all spend. Recommend flagging for review.",
};

const MODULES = [
  {
    icon: "🧠",
    title: "Property Intelligence",
    tag: "Core",
    tagColor: "#6366f1",
    desc: "One button. Complete visibility. Every property becomes a living data room — mortgage, tenants, compliance, cash flow, documents, maintenance history.",
    bullets: ["Purchase price vs current valuation & equity", "Mortgage product, rate, ERC dates & refinance alerts", "Tenant health score & payment history", "Compliance status across 6 categories", "Full maintenance & contractor history"],
  },
  {
    icon: "🔧",
    title: "Maintenance Command Centre",
    tag: "Workflow",
    tagColor: "#0891b2",
    desc: "AI triages every issue automatically. One tap shares everything — photos, videos, scope — directly to WhatsApp, email, or SMS. Every job tracked from report to completion.",
    bullets: ["Tenant submits photos, video & voice notes", "AI categorises urgency & suggests likely cause", "One-tap contractor dispatch with full context", "Quote comparison, approval, invoice storage", "Nothing gets lost in WhatsApp"],
  },
  {
    icon: "⚖️",
    title: "Compliance Engine",
    tag: "Safety Net",
    tagColor: "#d4af37",
    desc: "Track every certificate, licence, and deadline across every property. Never miss a renewal. Never face a fine.",
    bullets: ["EPC, Gas Safety, EICR, Insurance, Deposits", "HMO & selective licensing deadlines", "Proprietary Compliance Score per property", "Automated renewal reminders (30/14/7 days)", "One-click certificate upload & storage"],
  },
  {
    icon: "💷",
    title: "Tax Intelligence",
    tag: "Financial",
    tagColor: "#22c55e",
    desc: "Not bookkeeping. Tax intelligence. AI reads your receipts, allocates to properties, and shows your estimated liability at all times.",
    bullets: ["AI receipt capture via photo, email or PDF", "Automatic income & expense allocation", "Live estimated self-assessment figure", "Missing receipt alerts", "Allowable expense optimisation suggestions"],
  },
  {
    icon: "🏦",
    title: "Mortgage Intelligence",
    tag: "Financial",
    tagColor: "#22c55e",
    desc: "Most landlords forget mortgage deadlines. We don't. Track every product, every ERC date, every refinancing opportunity across your portfolio.",
    bullets: ["Full mortgage record per property", "Fixed rate expiry & ERC countdown", "Rate comparison & savings estimate", "Broker referral with full mortgage brief", "Portfolio-level LTV & equity dashboard"],
  },
  {
    icon: "👤",
    title: "Tenant Portal",
    tag: "Experience",
    tagColor: "#a855f7",
    desc: "A premium experience for tenants that reduces friction and incoming calls. They self-serve. You stay in control.",
    bullets: ["Rent payments & payment history", "Maintenance reporting with media upload", "Document access & digital signatures", "Real-time issue status tracking", "Direct messaging, always logged"],
  },
  {
    icon: "📊",
    title: "Portfolio Health Engine",
    tag: "Intelligence",
    tagColor: "#f59e0b",
    desc: "A proprietary score (0–100) that tells you exactly how well-run your portfolio is — and what to fix first.",
    bullets: ["Live occupancy, yield & cash flow position", "Risk flags: compliance gaps, expiring mortgages", "Opportunity flags: rent reviews, refinancing", "Trend analysis vs previous months", "Becomes addictive — landlords check daily"],
  },
  {
    icon: "💬",
    title: "Ask My Portfolio™",
    tag: "AI Signature",
    tagColor: "#ef4444",
    desc: "The feature that makes landlords say 'I can't cancel this.' Ask anything about your portfolio in plain English. Get an instant, intelligent answer.",
    bullets: ["Natural language queries across all properties", "Answers with context — not just data", "Proactive recommendations built into responses", "No reports. No menus. No searching.", "The operating system's brain"],
  },
];

const HEALTH_ITEMS = [
  { label: "Occupancy", score: 100, color: "#22c55e", note: "All 4 units tenanted" },
  { label: "Rent Collection", score: 97, color: "#22c55e", note: "1 payment 3 days late" },
  { label: "Compliance", score: 78, color: "#f59e0b", note: "2 certificates expiring soon" },
  { label: "Maintenance", score: 85, color: "#22c55e", note: "1 open issue, day 6" },
  { label: "Mortgage Health", score: 62, color: "#f59e0b", note: "1 fix expiring in 47 days" },
  { label: "Tax Position", score: 90, color: "#22c55e", note: "3 receipts unallocated" },
];

const OVERALL_SCORE = 84;

const COMPETITOR_GAPS = [
  "No AI-powered property briefing — landlords still manually check everything",
  "Maintenance is email chaos — no tracked workflow, no contractor coordination",
  "Zero mortgage intelligence — landlords discover SVR reversion by accident",
  "Tax tools are bolt-ons, not integrated — data entry, not intelligence",
  "Tenant portals feel like an afterthought — not a premium experience",
  "Compliance is a checklist, not a safety net — no proactive alerting",
  "No portfolio-level intelligence — no score, no recommendations, no growth insights",
  "Ask My Portfolio doesn't exist anywhere in the market",
];

export default function RenturaPage() {
  const [aiInput, setAiInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTyped, setAiTyped] = useState("");
  const [activePill, setActivePill] = useState(0);
  const [openModule, setOpenModule] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let i = 0;
    const q = AI_QUESTIONS[activePill];
    setAiTyped("");
    const t = setInterval(() => {
      if (i <= q.length) {
        setAiTyped(q.slice(0, i));
        i++;
      } else {
        clearInterval(t);
      }
    }, 30);
    return () => clearInterval(t);
  }, [activePill]);

  useEffect(() => {
    const t = setInterval(() => {
      setActivePill(p => (p + 1) % AI_QUESTIONS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  function handleAsk(q?: string) {
    const question = q || aiInput;
    if (!question.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    setTimeout(() => {
      const match = Object.keys(AI_ANSWERS).find(k => question.toLowerCase().includes(k.toLowerCase().slice(0, 12)));
      setAiAnswer(match ? AI_ANSWERS[match] : "Based on your portfolio data, I need a moment to analyse that. For best results, try one of the suggested questions — or your data may need to be connected first.");
      setAiLoading(false);
      setAiInput("");
    }, 1200);
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: "#05080f", color: "white", minHeight: "100vh" }}>

      {/* TOPBAR */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>PropertyVault UK</span>
          </Link>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>Rentura</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em" }}>Early Access Open</span>
        </div>
      </div>

      {/* HERO */}
      <section style={{ padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 11, color: "#a5b4fc", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
            The Operating System for Property Investors
          </div>

          <h1 style={{ fontSize: "clamp(44px,7vw,80px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: 28, fontFamily: "var(--font-family-heading)" }}>
            Your portfolio.<br />
            <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Completely</span><br />
            <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>intelligent.</span>
          </h1>

          <p style={{ fontSize: "clamp(15px,2.2vw,19px)", color: "rgba(255,255,255,0.5)", maxWidth: 620, margin: "0 auto 14px", lineHeight: 1.7 }}>
            Rentura is not property management software. It&apos;s not a dashboard. It&apos;s not a CRM.
          </p>
          <p style={{ fontSize: "clamp(15px,2.2vw,19px)", color: "rgba(255,255,255,0.85)", maxWidth: 620, margin: "0 auto 48px", lineHeight: 1.7, fontWeight: 600 }}>
            It&apos;s the operating system that becomes indispensable to every landlord who uses it.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <a href="#early-access" style={{ display: "inline-block", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontWeight: 800, fontSize: 16, padding: "16px 44px", borderRadius: 14, textDecoration: "none", letterSpacing: "-0.02em" }}>
              Join Early Access — £9.99/month
            </a>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Cancel anytime · No setup fees · Mobile first</p>
          </div>
        </div>
      </section>

      {/* PORTFOLIO HEALTH DEMO */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, overflow: "hidden" }}>
            {/* Window chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(239,68,68,0.5)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.5)" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 12, fontFamily: "monospace" }}>Rentura · Daily Command Centre</span>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Health score */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Portfolio Health Score</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 52, fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>{OVERALL_SCORE}</span>
                    <span style={{ fontSize: 22, color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>/100</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "8px 14px" }}>
                    <p style={{ fontSize: 10, color: "#4ade80", fontWeight: 700, marginBottom: 2 }}>STRENGTH</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>100% occupied · Rent ✓</p>
                  </div>
                  <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "8px 14px" }}>
                    <p style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700, marginBottom: 2 }}>RISK</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Mortgage expiry · EPC due</p>
                  </div>
                  <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, padding: "8px 14px" }}>
                    <p style={{ fontSize: 10, color: "#a5b4fc", fontWeight: 700, marginBottom: 2 }}>OPPORTUNITY</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Rent review on 3 properties</p>
                  </div>
                </div>
              </div>

              {/* Metric bars */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
                {HEALTH_ITEMS.map(item => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>{item.score}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${item.score}%`, height: "100%", background: item.color, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 5 }}>{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASK MY PORTFOLIO */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: "#f87171", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              AI Signature Feature
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>
              Ask My Portfolio™
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto" }}>
              Ask anything about your portfolio in plain English. Get an instant, intelligent answer. No reports. No menus.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden" }}>
            {/* Animated pill showing example questions */}
            <div style={{ padding: "20px 20px 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AI_QUESTIONS.slice(0, 4).map((q, i) => (
                <button key={q} onClick={() => { setAiInput(q); handleAsk(q); }} style={{ background: i === activePill % 4 ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === activePill % 4 ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, color: i === activePill % 4 ? "#a5b4fc" : "rgba(255,255,255,0.45)", cursor: "pointer", transition: "all 0.3s", fontWeight: i === activePill % 4 ? 700 : 500 }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 16px" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>💬</span>
                  <input ref={inputRef} type="text" value={aiInput || aiTyped} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAsk()} placeholder="Ask anything about your portfolio…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: 14, fontFamily: "inherit" }} />
                </div>
                <button onClick={() => handleAsk()} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, padding: "12px 20px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
                  {aiLoading ? "…" : "Ask →"}
                </button>
              </div>

              {(aiLoading || aiAnswer) && (
                <div style={{ marginTop: 16, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, padding: "14px 16px" }}>
                  {aiLoading ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: "pulse 0.8s infinite" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: "pulse 0.8s 0.2s infinite" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: "pulse 0.8s 0.4s infinite" }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>Analysing your portfolio…</span>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", marginBottom: 6 }}>RENTURA AI</p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>{aiAnswer}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 }}>
            {AI_QUESTIONS.slice(4).map(q => (
              <button key={q} onClick={() => { setAiInput(q); handleAsk(q); }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "6px 14px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.2s" }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY INTELLIGENCE */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 100, padding: "4px 14px", fontSize: 11, color: "#a5b4fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Core Feature</div>
          </div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>
            Property Intelligence
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 540, marginBottom: 32 }}>One button. Every property becomes a complete data room. No searching. No spreadsheets.</p>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.06))", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800 }}>14 Maple Street, Birmingham B21 9AA</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>3-bed terrace · BTL · Purchased Apr 2021</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#4ade80" }}>Tenanted</span>
                <span style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#a5b4fc" }}>Health 94/100</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 0 }}>
              {[
                { section: "PROPERTY", items: [["Purchase Price", "£145,000"], ["Current Value", "£192,000"], ["Equity", "£74,000"], ["LTV", "61%"]] },
                { section: "MORTGAGE", items: [["Lender", "Barclays"], ["Rate", "2.89% fixed"], ["Monthly Payment", "£486"], ["Expires", "3 Aug 2026 ⚠️"]] },
                { section: "FINANCIALS", items: [["Monthly Rent", "£1,100"], ["Net Yield", "8.4%"], ["Monthly Cash Flow", "£612"], ["ROI", "31.2%"]] },
                { section: "COMPLIANCE", items: [["Gas Safety", "✓ Valid"], ["EICR", "✓ 4 months"], ["EPC", "C — valid"], ["Deposit", "✓ Protected"]] },
              ].map(group => (
                <div key={group.section} style={{ borderRight: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "16px 18px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{group.section}</p>
                  {group.items.map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{k}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: v.includes("⚠️") ? "#f59e0b" : "rgba(255,255,255,0.85)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8 MODULES */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>
              Eight systems. One platform.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>Each one solves a problem competitors ignore. Together they become your property OS.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {MODULES.map((m, i) => (
              <div key={m.title} style={{ background: openModule === i ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${openModule === i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.2s" }}>
                <button onClick={() => setOpenModule(openModule === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", color: "white", textAlign: "left" }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 800 }}>{m.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: m.tagColor + "18", color: m.tagColor }}>{m.tag}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.55 }}>{m.desc}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 16, flexShrink: 0, marginTop: 2 }}>{openModule === i ? "−" : "+"}</span>
                </button>
                {openModule === i && (
                  <div style={{ padding: "0 20px 18px" }}>
                    {m.bullets.map((b, bi) => (
                      <div key={bi} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                        <span style={{ color: m.tagColor, flexShrink: 0, fontSize: 12, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAINTENANCE DEMO */}
      <section style={{ padding: "0 24px 80px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.2)", borderRadius: 100, display: "inline-block", padding: "4px 14px", fontSize: 11, color: "#22d3ee", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Maintenance Command Centre</div>
              <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1, fontFamily: "var(--font-family-heading)" }}>
                No more lost WhatsApp chats.
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 24 }}>
                Every maintenance issue becomes a tracked workflow. Tenant submits — AI triages — you dispatch — contractor updates — issue closed. Everything attached to the property record. Nothing lost.
              </p>
              {[
                { step: "1", label: "Tenant reports issue", detail: "Photos, video, voice note — all captured in the portal" },
                { step: "2", label: "AI triages & categorises", detail: "Urgency, likely cause, and recommended next action" },
                { step: "3", label: "One-tap contractor dispatch", detail: "Full context sent via WhatsApp, email or SMS" },
                { step: "4", label: "Contractor quotes & updates", detail: "Status, photos, invoices — all in the thread" },
                { step: "5", label: "Issue closed & filed", detail: "Attached to property record permanently" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(8,145,178,0.15)", border: "1px solid rgba(8,145,178,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#22d3ee", flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ background: "rgba(8,145,178,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 18px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee" }}>🔧 Issue #MX-047</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: "white" }}>Bathroom ceiling leak — 22 Park Road</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Reported by Sarah Mitchell · 17 Jun · 6 days open</p>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#f87171" }}>AI TRIAGE</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>Urgency: High · Likely cause: Upstairs plumbing or roof penetration · Recommended: Plumber + roofer inspection within 48hrs</p>
                </div>
                {[
                  { who: "Sarah M.", msg: "There's water dripping from the ceiling above the bath. Attached 3 photos.", time: "6d ago", you: false },
                  { who: "You", msg: "Thanks Sarah — I've raised this as urgent and dispatched a plumber. I'll update you within 24 hours.", time: "5d ago", you: true },
                  { who: "Mark Davis (Plumber)", msg: "Viewing booked for tomorrow 10am. Will update with full quote after.", time: "5d ago", you: false },
                ].map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: msg.you ? "flex-end" : "flex-start" }}>
                    {!msg.you && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{msg.who[0]}</div>}
                    <div style={{ maxWidth: "75%", background: msg.you ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${msg.you ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "8px 12px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: msg.you ? "#a5b4fc" : "rgba(255,255,255,0.4)", marginBottom: 3 }}>{msg.who} · {msg.time}</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{msg.msg}</p>
                    </div>
                  </div>
                ))}
                <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10, padding: "10px 14px", marginTop: 4 }}>
                  <p style={{ fontSize: 11, color: "#fbbf24" }}>⚠️ Mark Davis has not responded in 4 days. Tap to reassign or chase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETITOR GAPS */}
      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>
              What the market is missing
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>AppFolio, Arthur, Landlord Vision, Hammock. These are the gaps they all have.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMPETITOR_GAPS.map((gap, i) => (
              <div key={i} style={{ display: "flex", gap: 14, background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.08)", borderRadius: 12, padding: "13px 16px", alignItems: "flex-start" }}>
                <span style={{ color: "#ef4444", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✗</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{gap}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 14, padding: "16px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#a5b4fc" }}>Rentura solves every single one. That&apos;s the product.</p>
          </div>
        </div>
      </section>

      {/* NORTH STAR STATEMENTS */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.06))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 20, padding: "32px 28px" }}>
              <p style={{ fontSize: 28, marginBottom: 16 }}>🧠</p>
              <blockquote style={{ fontSize: "clamp(14px,2vw,17px)", fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontWeight: 600 }}>
                &ldquo;This platform knows more about my portfolio than I do.&rdquo;
              </blockquote>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>What landlords will say within 30 days.</p>
            </div>
            <div style={{ background: "linear-gradient(135deg,rgba(239,68,68,0.06),rgba(245,158,11,0.04))", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 20, padding: "32px 28px" }}>
              <p style={{ fontSize: 28, marginBottom: 16 }}>🔒</p>
              <blockquote style={{ fontSize: "clamp(14px,2vw,17px)", fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontWeight: 600 }}>
                &ldquo;If I cancelled this subscription, I would lose control of my property business.&rdquo;
              </blockquote>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>The retention metric that matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / EARLY ACCESS */}
      <section id="early-access" style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(99,102,241,0.25)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08))", borderBottom: "1px solid rgba(99,102,241,0.15)", padding: "18px 28px", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "4px 12px", fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 12 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                Early Access — Limited Spots
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.12em" }}>Rentura — Property Operating System</p>
            </div>
            <div style={{ padding: "32px 28px" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>£9.99</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, marginTop: 4 }}>per month · cancel anytime</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                {[
                  "Daily Portfolio Health Score",
                  "Ask My Portfolio™ AI",
                  "Property Intelligence per property",
                  "Maintenance Command Centre",
                  "Compliance Engine (6 categories)",
                  "Mortgage Intelligence & alerts",
                  "Tax Intelligence & receipt capture",
                  "Tenant Portal",
                  "Contractor coordination workflow",
                  "Portfolio Growth Intelligence",
                  "Unlimited properties",
                  "Mobile-first, always",
                ].map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
                    <span style={{ color: "#6366f1", fontWeight: 800, flexShrink: 0 }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="mailto:gowads047@gmail.com?subject=Rentura Early Access&body=I'd like to join the Rentura early access list." style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", fontWeight: 800, fontSize: 16, padding: "16px", borderRadius: 14, textDecoration: "none", marginBottom: 12 }}>
                Request Early Access →
              </a>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.7 }}>
                Early access members lock in £9.99/month permanently. Full launch price TBC. Cancel anytime. 14-day money-back guarantee under Consumer Contracts Regulations 2013.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 6 }}>Rentura</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>by PropertyVault UK · The Operating System for Property Investors</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          Rentura is a property management and intelligence platform. It does not constitute financial, legal, tax, or mortgage advice. Tax estimates are indicative only — consult a qualified accountant. Mortgage data must be verified with your lender. &copy; {new Date().getFullYear()} PropertyVault UK.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Home</Link>
          <Link href="/privacy" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Terms</Link>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
