"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

const PHASES = [
  {
    phase: "Phase 1 — Setup & Compliance",
    color: "#6366f1",
    items: [
      { id: "c1", text: "Register with a Property Redress Scheme (PRS or TPOS)", link: "/academy/legal" },
      { id: "c2", text: "Register with HMRC for Anti-Money Laundering (AML) supervision", link: "/academy/legal" },
      { id: "c3", text: "Set up a limited company or confirm sole trader status with an accountant", link: null },
      { id: "c4", text: "Get a professional indemnity insurance quote", link: null },
      { id: "c5", text: "Create your GDPR-compliant privacy policy and data register", link: "/academy/legal" },
      { id: "c6", text: "Draft your Sourcer-Investor contract (terms of engagement)", link: "/templates" },
      { id: "c7", text: "Set up a business bank account", link: null },
    ],
  },
  {
    phase: "Phase 2 — Define Your Strategy",
    color: "#0891b2",
    items: [
      { id: "c8", text: "Choose your target strategy (BTL, BRRR, HMO, Deal Packaging)", link: "/academy/courses" },
      { id: "c9", text: "Define your target area (max 1–2 areas to start)", link: "/academy/area-research" },
      { id: "c10", text: "Research average prices, yields and rental demand in your area", link: "/calculators/deal-analyser" },
      { id: "c11", text: "Define your ideal deal criteria (price, yield, deal type)", link: null },
      { id: "c12", text: "Build a simple investor avatar — who is your ideal buyer?", link: "/academy/playbooks" },
    ],
  },
  {
    phase: "Phase 3 — Build Your Investor List",
    color: "#d4af37",
    items: [
      { id: "c13", text: "Attend 2 local property networking events (PIN, Progressive etc.)", link: null },
      { id: "c14", text: "Create a LinkedIn profile positioned as a property sourcer", link: null },
      { id: "c15", text: "Send 10 cold outreach messages to potential investors this week", link: "/academy/emails" },
      { id: "c16", text: "Create a simple investor questionnaire (strategy, budget, area, timeline)", link: null },
      { id: "c17", text: "Add first 5 investors to your CRM", link: "/academy/crm" },
      { id: "c18", text: "Qualify each investor — can they actually buy? Proof of funds?", link: "/academy/scripts" },
    ],
  },
  {
    phase: "Phase 4 — Source Your First Deal",
    color: "#10b981",
    items: [
      { id: "c19", text: "Register with all estate agents in your target area", link: "/academy/emails" },
      { id: "c20", text: "Set up Rightmove/Zoopla email alerts for your criteria", link: null },
      { id: "c21", text: "View minimum 10 properties (to calibrate your valuation eye)", link: null },
      { id: "c22", text: "Run every potential deal through the Deal Calculator", link: "/academy/calculator" },
      { id: "c23", text: "Identify your first BMV / motivated seller opportunity", link: null },
      { id: "c24", text: "Get a refurb estimate from a local builder", link: null },
      { id: "c25", text: "Pull comparable sold prices (Land Registry / Rightmove)", link: "/sold-prices" },
    ],
  },
  {
    phase: "Phase 5 — Package & Present",
    color: "#f59e0b",
    items: [
      { id: "c26", text: "Prepare full deal pack (comparables, rental data, photos, floor plan)", link: "/academy/downloads" },
      { id: "c27", text: "Run the deal through the advanced calculator — BRRR or packaging", link: "/academy/calculator" },
      { id: "c28", text: "Present deal to your top 3 matching investors using the script", link: "/academy/scripts" },
      { id: "c29", text: "Negotiate heads of terms with the seller / agent", link: "/academy/playbooks" },
      { id: "c30", text: "Issue your sourcing agreement to the investor before introducing the deal", link: "/templates" },
    ],
  },
  {
    phase: "Phase 6 — Exchange & Get Paid",
    color: "#ec4899",
    items: [
      { id: "c31", text: "Introduce investor to your recommended solicitor", link: null },
      { id: "c32", text: "Confirm investor's mortgage broker / cash position", link: null },
      { id: "c33", text: "Monitor conveyancing — stay in regular contact with all parties", link: null },
      { id: "c34", text: "Collect sourcing fee on exchange (never before!)", link: null },
      { id: "c35", text: "Get a testimonial from your investor", link: null },
      { id: "c36", text: "Update your CRM and analyse what worked", link: "/academy/crm" },
      { id: "c37", text: "Repeat — scale your pipeline to 2–3 deals per month", link: "/academy/courses" },
    ],
  },
];

export default function AcademyChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const totalItems = PHASES.reduce((a, p) => a + p.items.length, 0);
  const totalDone = checked.size;
  const overallPct = Math.round((totalDone / totalItems) * 100);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Deal Sourcing Checklist</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 24 }}>
          Every step from setup to your first fee. Tick each item as you complete it.
        </p>

        {/* Overall progress */}
        <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Overall Progress</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#d4af37" }}>{overallPct}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
            <div style={{ height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg, #d4af37, #f0d060)", borderRadius: 8, transition: "width 0.4s" }} />
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>{totalDone} of {totalItems} steps completed</p>
        </div>

        {/* Phases */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {PHASES.map(phase => {
            const phaseDone = phase.items.filter(i => checked.has(i.id)).length;
            const phasePct = Math.round((phaseDone / phase.items.length) * 100);
            return (
              <div key={phase.phase} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 20, borderRadius: 2, background: phase.color, flexShrink: 0 }} />
                    <h2 style={{ fontSize: 15, fontWeight: 800 }}>{phase.phase}</h2>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{phaseDone}/{phase.items.length}</span>
                    <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${phasePct}%`, background: phase.color, borderRadius: 4 }} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {phase.items.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <button onClick={() => toggle(item.id)} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked.has(item.id) ? phase.color : "rgba(255,255,255,0.2)"}`, background: checked.has(item.id) ? phase.color : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                        {checked.has(item.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0f1e" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, lineHeight: 1.5, color: checked.has(item.id) ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.8)", textDecoration: checked.has(item.id) ? "line-through" : "none" }}>
                          {item.text}
                        </span>
                        {item.link && !checked.has(item.id) && (
                          <Link href={item.link} style={{ display: "inline-block", marginLeft: 8, fontSize: 11, color: "#d4af37", textDecoration: "none", fontWeight: 600 }}>→ Go</Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button onClick={() => setChecked(new Set())} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Reset all progress</button>
        </div>
      </div>
    </div>
  );
}
