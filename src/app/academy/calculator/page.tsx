"use client";

import { useState } from "react";
import Link from "next/link";

function fmt(n: number) {
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function pct(n: number) {
  return n.toFixed(2) + "%";
}

// Defined at module scope so React keeps the same component type across renders.
// Nested inside the page they were re-created every render, remounting their
// subtree — which for a range input means losing focus mid-drag.
function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</span>
        {note && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>{note}</span>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#d4af37" }}>{value}</span>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1000, onChange, prefix = "£", suffix = "" }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#d4af37" }}>{prefix}{value.toLocaleString("en-GB")}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#d4af37" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
        <span>{prefix}{min.toLocaleString()}</span><span>{prefix}{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function AcademyCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(180000);
  const [refurbCost, setRefurbCost] = useState(25000);
  const [gdv, setGdv] = useState(240000);
  const [monthlyRent, setMonthlyRent] = useState(950);
  const [packagingFee, setPackagingFee] = useState(5000);
  const [financeRate, setFinanceRate] = useState(9);
  const [financeTerm, setFinanceTerm] = useState(6);
  const [jvSplit, setJvSplit] = useState(50);
  const [stampDuty, setStampDuty] = useState(6000);
  const [legalFees, setLegalFees] = useState(2500);
  const [dealType, setDealType] = useState<"bmc" | "jv" | "packaging">("bmc");

  // Core calcs
  const totalIn = purchasePrice + refurbCost + stampDuty + legalFees;
  const equity = gdv - totalIn;
  const equityPct = (equity / gdv) * 100;
  const annualRent = monthlyRent * 12;
  const grossYield = (annualRent / purchasePrice) * 100;
  const netYield = (annualRent * 0.8 / purchasePrice) * 100;
  const financeCost = (purchasePrice * (financeRate / 100) / 12) * financeTerm;
  const totalWithFinance = totalIn + financeCost;
  const refinanceAmt = gdv * 0.75;
  const cashLeft = totalWithFinance - refinanceAmt;
  const roi = cashLeft > 0 ? (annualRent * 0.8 / cashLeft) * 100 : Infinity;
  const yourJvShare = (equity * (jvSplit / 100));
  const investorJvShare = (equity * ((100 - jvSplit) / 100));
  const dealProfit = packagingFee;

  const scoreItems = [
    { label: "Equity Created", ok: equity > 20000, val: fmt(equity) },
    { label: "Gross Yield", ok: grossYield >= 7, val: pct(grossYield) },
    { label: "Equity %", ok: equityPct >= 15, val: pct(equityPct) },
    { label: "Cash Left In (BRRR)", ok: cashLeft < 20000, val: cashLeft < 0 ? "None left in! 🎯" : fmt(cashLeft) },
  ];
  const score = scoreItems.filter(s => s.ok).length;

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {[["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]].map(([l,h]) => (
          <Link key={h} href={h} style={{ color: l === "Calculator" ? "#d4af37" : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only Tool</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Advanced Deal Calculator</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Model BRRR, JV splits, packaging fees and bridging finance in one place.</p>
        </div>

        {/* Deal type tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {([["bmc","BRRR / BMC"],["jv","JV Split"],["packaging","Deal Packaging"]] as const).map(([t,l]) => (
            <button key={t} onClick={() => setDealType(t)} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: dealType === t ? "#d4af37" : "rgba(255,255,255,0.07)", color: dealType === t ? "#0a0f1e" : "rgba(255,255,255,0.6)" }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Inputs */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>📊 Deal Inputs</h2>
            <Slider label="Purchase Price" value={purchasePrice} min={50000} max={500000} onChange={setPurchasePrice} />
            <Slider label="Refurb Cost" value={refurbCost} min={0} max={150000} onChange={setRefurbCost} />
            <Slider label="GDV (After Refurb Value)" value={gdv} min={50000} max={800000} onChange={setGdv} />
            <Slider label="Monthly Rent" value={monthlyRent} min={300} max={3000} step={50} onChange={setMonthlyRent} />
            <Slider label="Stamp Duty" value={stampDuty} min={0} max={30000} onChange={setStampDuty} />
            <Slider label="Legal / Survey Fees" value={legalFees} min={500} max={10000} step={500} onChange={setLegalFees} />

            {(dealType === "bmc") && (
              <>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>BRIDGING FINANCE</p>
                  <Slider label="Finance Rate (% p.a.)" value={financeRate} min={5} max={18} step={0.5} onChange={setFinanceRate} prefix="" suffix="%" />
                  <Slider label="Finance Term (months)" value={financeTerm} min={3} max={18} step={1} onChange={setFinanceTerm} prefix="" suffix=" mo" />
                </div>
              </>
            )}

            {dealType === "jv" && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>JV SPLIT</p>
                <Slider label="Your Share %" value={jvSplit} min={10} max={90} step={5} onChange={setJvSplit} prefix="" suffix="%" />
              </div>
            )}

            {dealType === "packaging" && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>PACKAGING FEE</p>
                <Slider label="Sourcing / Packaging Fee" value={packagingFee} min={1000} max={20000} step={500} onChange={setPackagingFee} />
              </div>
            )}
          </div>

          {/* Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Deal Score */}
            <div style={{ background: score >= 3 ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${score >= 3 ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800 }}>Deal Score</h2>
                <span style={{ fontSize: 28, fontWeight: 800, color: score >= 3 ? "#d4af37" : score >= 2 ? "#f59e0b" : "#ef4444" }}>{score}/4</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {scoreItems.map(s => (
                  <div key={s.label} style={{ background: s.ok ? "rgba(212,175,55,0.07)" : "rgba(255,0,0,0.05)", border: `1px solid ${s.ok ? "rgba(212,175,55,0.2)" : "rgba(255,0,0,0.15)"}`, borderRadius: 8, padding: "8px 10px" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{s.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: s.ok ? "#d4af37" : "#f87171" }}>{s.val}</p>
                    <p style={{ fontSize: 10, color: s.ok ? "#4ade80" : "#f87171" }}>{s.ok ? "✓ Pass" : "✗ Weak"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core metrics */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Core Metrics</h2>
              <Row label="Total Money In" value={fmt(totalIn)} />
              <Row label="Equity Created" value={fmt(equity)} />
              <Row label="Equity %" value={pct(equityPct)} />
              <Row label="Gross Yield" value={pct(grossYield)} />
              <Row label="Net Yield (est.)" value={pct(netYield)} note="80% rule" />

              {dealType === "bmc" && <>
                <Row label="Finance Cost" value={fmt(financeCost)} />
                <Row label="Total In (with finance)" value={fmt(totalWithFinance)} />
                <Row label="Refinance @ 75% LTV" value={fmt(refinanceAmt)} />
                <Row label="Cash Left In" value={cashLeft < 0 ? "£0 (money back!)" : fmt(cashLeft)} />
                <Row label="ROI on cash left" value={cashLeft > 0 ? pct(roi) : "∞"} />
              </>}

              {dealType === "jv" && <>
                <Row label="Your JV Share" value={fmt(yourJvShare)} note={`${jvSplit}%`} />
                <Row label="Investor Share" value={fmt(investorJvShare)} note={`${100 - jvSplit}%`} />
              </>}

              {dealType === "packaging" && <>
                <Row label="Your Packaging Fee" value={fmt(dealProfit)} />
                <Row label="Investor Equity" value={fmt(equity)} />
                <Row label="Fee as % of deal" value={pct((packagingFee / purchasePrice) * 100)} />
              </>}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
              ⚠️ For educational modelling only. Always verify figures with your solicitor, mortgage broker, and surveyor before committing to any deal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
