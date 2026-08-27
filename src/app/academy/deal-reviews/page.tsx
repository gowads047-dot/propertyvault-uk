"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

const DEALS = [
  {
    id: 1,
    week: "Week 24, 2026",
    date: "20 Jun 2026",
    tag: "BRRR",
    tagColor: "#6366f1",
    title: "3-bed terrace, West Midlands",
    verdict: "Strong deal",
    verdictColor: "#22c55e",
    summary: "A classic BRRR opportunity in a high-demand rental area. Vendor needs quick sale due to probate situation — classic motivated seller. Numbers work even at asking price but there's room to negotiate £5–8k off.",
    numbers: [
      { label: "Asking Price", value: "£145,000" },
      { label: "Refurb Estimate", value: "£22,000" },
      { label: "GDV (After Works)", value: "£185,000" },
      { label: "Equity Created", value: "£18,000" },
      { label: "Monthly Rent (est.)", value: "£850" },
      { label: "Gross Yield", value: "7.0%" },
      { label: "Refinance @ 75%", value: "£138,750" },
      { label: "Cash Left In", value: "~£12,000" },
    ],
    strengths: [
      "Motivated seller — probate means they want speed over price",
      "Consistent rental demand in this postcode (RM3 indicator: High)",
      "Refurb is cosmetic — kitchen, bathroom, décor only. Low risk.",
      "GDV is conservative — comparable sold at £192k in March 2026",
    ],
    risks: [
      "Boiler is 14 years old — budget for replacement (£2,500)",
      "Roof tiles need inspection — flagged in agent notes",
      "Cash left in after refinance (£12k) means it's not a true money-out deal",
    ],
    lesson: "This deal teaches you to always verify the GDV against recent comps within 0.25 miles. The agent's estimate was £195k — I used £185k to be conservative. Build in a 5–10% buffer on GDV when presenting to investors.",
  },
  {
    id: 2,
    week: "Week 22, 2026",
    date: "6 Jun 2026",
    tag: "Deal Packaging",
    tagColor: "#d4af37",
    title: "2-bed flat, Nottingham city centre",
    verdict: "Passed — yield too low",
    verdictColor: "#ef4444",
    summary: "This looked attractive on the surface — below asking price, city centre location, good condition. But once the numbers were run, the yield came in at 5.8% net, which doesn't meet the 7% minimum most BRRR investors require.",
    numbers: [
      { label: "Asking Price", value: "£128,000" },
      { label: "Offered At", value: "£118,000" },
      { label: "Refurb Estimate", value: "£6,000" },
      { label: "Monthly Rent (est.)", value: "£650" },
      { label: "Gross Yield", value: "6.6%" },
      { label: "Net Yield (est.)", value: "5.3%" },
      { label: "Service Charge p/a", value: "£1,800" },
      { label: "Ground Rent p/a", value: "£250" },
    ],
    strengths: [
      "Good condition — minimal work needed",
      "Strong tenant demand in city centre",
      "Below asking price negotiation achieved",
    ],
    risks: [
      "Service charge and ground rent significantly erode yield",
      "Leasehold with 87 years remaining — mortgage-ability risk below 70 years",
      "City centre flats have lower capital growth than houses in this area",
      "Net yield of 5.3% doesn't meet most BTL investor criteria",
    ],
    lesson: "Always factor in service charges and ground rent on leasehold properties. They're invisible in the headline numbers but can wipe 1–2% off your net yield. Also check lease length early — sub-80 year leases are a red flag for mortgage lenders.",
  },
  {
    id: 3,
    week: "Week 20, 2026",
    date: "23 May 2026",
    tag: "HMO",
    tagColor: "#0891b2",
    title: "5-bed detached, Derby",
    verdict: "Excellent — went to investor",
    verdictColor: "#22c55e",
    summary: "Found via an estate agent relationship. Vendor had been trying to sell for 4 months with no success. Property is ideal for HMO conversion — 5 bedrooms, 2 bathrooms, large kitchen. Dealt packaged and introduced to investor within 6 days. Fee: £5,500.",
    numbers: [
      { label: "Purchase Price", value: "£195,000" },
      { label: "Refurb (HMO conversion)", value: "£38,000" },
      { label: "GDV", value: "£280,000" },
      { label: "Monthly Rent (5 rooms)", value: "£2,750" },
      { label: "Gross Yield", value: "16.9%" },
      { label: "Equity Created", value: "£47,000" },
      { label: "Sourcing Fee Charged", value: "£5,500" },
    ],
    strengths: [
      "Outstanding yield for a licensed HMO",
      "Existing layout suited conversion with minimal structural work",
      "Derby has strong student and professional HMO demand",
      "£47k equity from day one — well above the sourcing fee",
      "Investor very happy — has since referred two other investors",
    ],
    risks: [
      "HMO licence required (Article 4 direction in place in this area — check!)",
      "Refurb timeline 10–12 weeks before income starts",
      "Management-intensive strategy — investor needs experienced HMO manager",
    ],
    lesson: "HMO deals take longer to present and package — but the fees reflect this. A clean HMO deal with strong numbers is one of the easiest things to sell to an experienced investor. Building relationships with agents who know your criteria is what unlocks deals like this. This agent called me because I'd been consistent with my outreach for 6 weeks.",
  },
];

export default function AcademyDealReviewsPage() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only · Weekly</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Live Deal Reviews</h1>
        <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, marginBottom: 8 }}>
          Real deals analysed every week — addresses blurred. See exactly how Nass runs the numbers, what he looks for, and why he passes or proceeds.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 32 }}>
          New review posted every Monday. {DEALS.length} reviews published so far.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {DEALS.map(deal => (
            <div key={deal.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${expanded === deal.id ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 18, overflow: "hidden" }}>
              {/* Header */}
              <button onClick={() => setExpanded(expanded === deal.id ? null : deal.id)} style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: "white", textAlign: "left", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: deal.tagColor + "22", color: deal.tagColor }}>{deal.tag}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: deal.verdictColor + "22", color: deal.verdictColor }}>{deal.verdict}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.62)" }}>{deal.week} · {deal.date}</span>
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 800 }}>{deal.title}</h2>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginTop: 4, lineHeight: 1.5 }}>{deal.summary}</p>
                </div>
                <span style={{ fontSize: 20, color: "rgba(255,255,255,0.62)", flexShrink: 0 }}>{expanded === deal.id ? "−" : "+"}</span>
              </button>

              {expanded === deal.id && (
                <div style={{ padding: "0 24px 24px" }}>
                  {/* Numbers */}
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: "#d4af37" }}>📊 The Numbers</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
                      {deal.numbers.map(n => (
                        <div key={n.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", marginBottom: 3 }}>{n.label}</p>
                          <p style={{ fontSize: 15, fontWeight: 800, color: "#d4af37" }}>{n.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths + Risks */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: 16 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: "#4ade80", marginBottom: 12 }}>✓ Strengths</h3>
                      {deal.strengths.map((s, i) => <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 6 }}>· {s}</p>)}
                    </div>
                    <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: 16 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: "#f87171", marginBottom: 12 }}>⚠ Risks</h3>
                      {deal.risks.map((r, i) => <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 6 }}>· {r}</p>)}
                    </div>
                  </div>

                  {/* Key lesson */}
                  <div style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#d4af37", marginBottom: 8 }}>💡 Key Lesson</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{deal.lesson}</p>
                  </div>

                  <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                    <Link href="/academy/calculator" style={{ fontSize: 12, fontWeight: 700, color: "#d4af37", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "7px 14px", textDecoration: "none" }}>
                      Run these numbers →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 20, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>New deal review every Monday.</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Got a deal you want analysed? Submit it via the Q&A board.</p>
        </div>
      </div>
    </div>
  );
}
