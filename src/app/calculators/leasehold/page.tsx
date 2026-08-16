"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { PrintButton } from "@/components/calculators/PrintButton";
import { ShareResults } from "@/components/calculators/ShareResults";
import { EmailResults } from "@/components/calculators/EmailResults";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { pvAnnuity, pvLumpSum, discountFactor } from "@/lib/finance";

const leaseholdFaqs = [
  { q: "What happens when a lease drops below 80 years?", a: "Below 80 years, 'marriage value' kicks in — the freeholder is entitled to 50% of the value created by the extension. This significantly increases the premium. As a rule of thumb, extend before the lease drops below 85 years to avoid this cost." },
  { q: "How much does a lease extension cost?", a: "The cost has two parts: the statutory premium (calculated by a surveyor using the Leasehold Reform Act 1993 formula) plus professional fees. For a 75-year lease on a £280,000 flat, expect a total cost of £8,000–£20,000 including legal fees, the freeholder's costs, and surveyor fees. This calculator provides an estimate — always get a formal RICS valuation." },
  { q: "Can I get a mortgage on a short lease?", a: "Most high-street lenders require at least 85 years remaining (to ensure the lease will still have 70+ years at end of a 25-year mortgage term). Between 70–85 years, some specialist lenders may still lend. Below 70 years, very few lenders will consider it — the property becomes very hard to sell." },
  { q: "What is marriage value in leasehold?", a: "Marriage value is the increase in property value created by extending the lease. When a lease drops below 80 years, the freeholder becomes entitled to 50% of this marriage value as part of the extension premium. This is why extending before 80 years is critical — it can save tens of thousands of pounds." },
  { q: "How long does a lease extension take?", a: "A statutory lease extension under the Leasehold Reform Act 1993 typically takes 6–12 months from serving the initial notice (Section 42 notice) to completion. The process involves serving notice, the freeholder counter-proposing, negotiation, and eventual completion. You must have owned the property for at least 2 years before you can apply." },
  { q: "What is the difference between statutory and voluntary lease extension?", a: "A statutory extension (under the 1993 Act) adds exactly 90 years to your current term and reduces ground rent to peppercorn (£0). A voluntary extension is negotiated directly with the freeholder — terms vary but you can extend for more years or get other benefits. Statutory is usually better value; voluntary avoids the formal legal process but the freeholder can set higher terms." },
];

// Savills/Gerald Eve simplified relativity table
function getRelativity(years: number): number {
  if (years >= 100) return 1.000;
  if (years >= 95)  return 0.998;
  if (years >= 90)  return 0.994;
  if (years >= 85)  return 0.988;
  if (years >= 80)  return 0.980;
  if (years >= 75)  return 0.968;
  if (years >= 70)  return 0.950;
  if (years >= 65)  return 0.925;
  if (years >= 60)  return 0.890;
  if (years >= 55)  return 0.843;
  if (years >= 50)  return 0.780;
  if (years >= 45)  return 0.700;
  if (years >= 40)  return 0.605;
  if (years >= 35)  return 0.500;
  if (years >= 30)  return 0.390;
  if (years >= 25)  return 0.285;
  if (years >= 20)  return 0.190;
  if (years >= 15)  return 0.115;
  if (years >= 10)  return 0.063;
  return 0.030;
}

// Estimate statutory lease extension premium (simplified Leasehold Reform Act 1993)
function calcExtensionPremium(
  freeholdValue: number,
  yearsLeft: number,
  groundRentAnnual: number,
  groundRentDoubling: number, // years between doublings
  capRate: number // deferment rate (typically 5%)
): number {
  const n = yearsLeft;
  // PV of the ground rent income stream. With a doubling clause this is a run of
  // deferred annuities: each period's rent valued as an annuity, then discounted
  // back to today by the years until that period starts.
  const grPV = groundRentAnnual > 0 && groundRentDoubling > 0
    ? (() => {
        let pv = 0;
        let rent = groundRentAnnual;
        let t = 0;
        while (t < n) {
          const period = Math.min(groundRentDoubling, n - t);
          pv += pvAnnuity(rent, capRate, period) * discountFactor(capRate, t);
          rent *= 2;
          t += groundRentDoubling;
        }
        return pv;
      })()
    : pvAnnuity(groundRentAnnual, capRate, n);

  // Reversion value (PV of getting freehold back at lease end)
  const reversion = pvLumpSum(freeholdValue, capRate, n);

  // Marriage value (only if < 80 years)
  const relBefore = getRelativity(n);
  const relAfter  = getRelativity(n + 90); // adding 90 years
  const marriageValue = n < 80
    ? Math.max(0, freeholdValue * (relAfter - relBefore)) * 0.5
    : 0;

  return Math.round(grPV + reversion + marriageValue);
}

const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;

type Tab = "overview" | "extension" | "groundrent" | "verdict";

const RISK_THRESHOLDS = [
  { min: 90, label: "Safe", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", desc: "Excellent — lease is long enough to mortgage and sell without issue." },
  { min: 80, label: "Good", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", desc: "Good lease length. Extend soon to stay above 80 years and avoid marriage value." },
  { min: 70, label: "Caution", color: "#d97706", bg: "#fffbeb", border: "#fde68a", desc: "Some lenders will refuse. Plan your extension now — every year below 80 adds cost." },
  { min: 60, label: "Risk", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", desc: "High risk. Many lenders won't touch this. Extension required before selling." },
  { min: 0,  label: "Danger", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", desc: "Unmortgageable for most buyers. Extension is critical — value is severely impaired." },
];

function getRisk(years: number) {
  return RISK_THRESHOLDS.find(r => years >= r.min) ?? RISK_THRESHOLDS[RISK_THRESHOLDS.length - 1];
}

export default function LeaseholdCalculatorPage() {
  const [propertyValue,     setPropertyValue]     = useState(280000);
  const [yearsLeft,         setYearsLeft]         = useState(75);
  const [groundRentAnnual,  setGroundRentAnnual]  = useState(250);
  const [groundRentDoubles, setGroundRentDoubles] = useState(25); // years
  const [serviceCharge,     setServiceCharge]     = useState(200); // £/mo
  const [capRate,           setCapRate]           = useState(5);
  const [activeTab,         setActiveTab]         = useState<Tab>("overview");

  const calc = useMemo(() => {
    const relativity        = getRelativity(yearsLeft);
    const relAfterExtension = getRelativity(Math.min(yearsLeft + 90, 999));
    const freeholdValue     = propertyValue / relativity;
    const valueWithLease    = freeholdValue * relativity;
    const valueAfterExt     = freeholdValue * relAfterExtension;
    const instantEquity     = valueAfterExt - valueWithLease;
    const discountFromFH    = (1 - relativity) * 100;

    const extensionPremium  = calcExtensionPremium(freeholdValue, yearsLeft, groundRentAnnual, groundRentDoubles, capRate);
    const netGain           = instantEquity - extensionPremium;
    const extensionROI      = extensionPremium > 0 ? (netGain / extensionPremium) * 100 : 0;

    // Annual value depreciation (difference in relativity for 1 year less)
    const relNextYear       = getRelativity(yearsLeft - 1);
    const annualDepreciation= freeholdValue * (relativity - relNextYear);

    // Ground rent projections over 25 years
    const grProjection = Array.from({ length: 5 }, (_, i) => {
      const yr = (i + 1) * 5;
      const doublings = Math.floor(yr / groundRentDoubles);
      const rent = groundRentAnnual * Math.pow(2, doublings);
      return { yr, rent };
    });

    // Total ground rent cost over remaining lease (undiscounted)
    let totalGR = 0;
    let rent = groundRentAnnual;
    let t = 0;
    while (t < yearsLeft) {
      const period = Math.min(groundRentDoubles, yearsLeft - t);
      totalGR += rent * period;
      rent *= 2;
      t += groundRentDoubles;
    }

    const annualServiceCharge = serviceCharge * 12;
    const totalHoldingCosts25yr = totalGR + annualServiceCharge * 25;

    // Mortgage eligibility
    const mortgageable = yearsLeft >= 70;
    const majorLenders  = yearsLeft >= 85;

    const risk = getRisk(yearsLeft);

    return {
      relativity, relAfterExtension, freeholdValue, valueWithLease, valueAfterExt,
      instantEquity, discountFromFH, extensionPremium, netGain, extensionROI,
      annualDepreciation, grProjection, totalGR, annualServiceCharge, totalHoldingCosts25yr,
      mortgageable, majorLenders, risk,
    };
  }, [propertyValue, yearsLeft, groundRentAnnual, groundRentDoubles, serviceCharge, capRate]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview",   label: "Overview" },
    { id: "extension",  label: "Extension Cost" },
    { id: "groundrent", label: "Ground Rent" },
    { id: "verdict",    label: "Buy or Not?" },
  ];

  const risk = calc.risk;

  return (
    <>
      {/* Header */}
      <section style={{ background: "#0f1b36", position: "relative", overflow: "hidden", padding: "56px 0 48px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div className="container-max px-4" style={{ position: "relative", zIndex: 1 }}>
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Leasehold Calculator" }]} />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📜</div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.08em" }}>Property Tools</p>
                  <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "white", lineHeight: 1 }}>Leasehold Calculator</h1>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 520 }}>Extension premium, lease depreciation, ground rent analysis, mortgage eligibility, and a plain-English verdict on whether to buy.</p>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}><PrintButton /></div>
            </div>
            {/* Risk badge */}
            <div style={{ padding: "20px 28px", borderRadius: 20, background: risk.bg, border: `2px solid ${risk.border}`, textAlign: "center", minWidth: 160 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Lease Risk</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: risk.color, lineHeight: 1 }}>{yearsLeft}<span style={{ fontSize: 14, fontWeight: 600 }}>yrs</span></p>
              <p style={{ fontSize: 14, fontWeight: 800, color: risk.color, marginTop: 4 }}>{risk.label}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8f9fc", paddingBottom: 64 }}>
        <div className="container-max px-4" style={{ paddingTop: 24 }}>
          <div className="grid lg:grid-cols-5 gap-6">

            {/* ── INPUTS ─────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Property */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">🏠 Property Details</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Property Value (current, with lease)</span>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                      <input type="number" value={propertyValue} onChange={e => setPropertyValue(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </label>
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Years remaining on lease: <strong>{yearsLeft} years</strong></span>
                    <input type="range" min={10} max={999} step={1} value={yearsLeft} onChange={e => setYearsLeft(+e.target.value)} style={{ width: "100%", accentColor: "#c9a84c" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                      <span>10 yrs</span><span>80 yrs</span><span>120+ yrs</span><span>999 yrs</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ground Rent */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">💰 Ground Rent</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Annual ground rent</span>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                      <input type="number" value={groundRentAnnual} onChange={e => setGroundRentAnnual(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    <p className="text-xs text-navy-400 mt-1">Enter 0 for a peppercorn (£0) ground rent</p>
                  </label>
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Ground rent doubles every (years)</span>
                    <select value={groundRentDoubles} onChange={e => setGroundRentDoubles(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                      <option value={10}>Every 10 years</option>
                      <option value={15}>Every 15 years</option>
                      <option value={20}>Every 20 years</option>
                      <option value={25}>Every 25 years (typical)</option>
                      <option value={33}>Every 33 years</option>
                      <option value={50}>Fixed / never doubles</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Service Charge & Settings */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4">⚙️ Costs & Settings</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Service charge £/month</span>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                      <input type="number" value={serviceCharge} onChange={e => setServiceCharge(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </label>
                  <label className="block">
                    <span className="block text-xs text-navy-500 mb-1">Deferment / cap rate: {capRate}%</span>
                    <input type="range" min={3} max={8} step={0.25} value={capRate} onChange={e => setCapRate(+e.target.value)} style={{ width: "100%", accentColor: "#c9a84c" }} />
                    <p className="text-xs text-navy-400 mt-1">Industry standard is 4.75–5.5%. Higher = lower premium.</p>
                  </label>
                </div>
              </div>

              {/* Mortgage eligibility quick check */}
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-3">🏦 Mortgage Eligibility</h3>
                <div className="space-y-2">
                  {[
                    { label: "Most high-street lenders (85+ yrs)",   pass: calc.majorLenders },
                    { label: "Standard mortgageable (70+ yrs)",      pass: calc.mortgageable },
                    { label: "BTL lenders (usually 70+ yrs)",        pass: calc.mortgageable },
                    { label: "Unmortgageable risk (<60 yrs)",        pass: yearsLeft >= 60, invert: true },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: r.invert ? (r.pass ? "#f0fdf4" : "#fef2f2") : (r.pass ? "#f0fdf4" : "#fef2f2") }}>
                      <span style={{ fontSize: 12, color: "#374151" }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: r.pass ? "#16a34a" : "#dc2626" }}>
                        {r.invert ? (r.pass ? "✓ Safe" : "✗ Risk") : (r.pass ? "✓ Yes" : "✗ No")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RESULTS ────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">

              {/* 4 key metrics */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Freehold Equivalent Value", value: fmt(calc.freeholdValue), sub: "What it'd be worth at 999 yrs", cls: "text-navy-800" },
                  { label: "Lease Discount", value: pct(calc.discountFromFH), sub: `${yearsLeft}-yr lease vs freehold`, cls: calc.discountFromFH > 5 ? "text-red-600" : calc.discountFromFH > 1 ? "text-amber-600" : "text-green-600" },
                  { label: "Extension Premium", value: fmt(calc.extensionPremium), sub: "+90 yrs statutory estimate", cls: "text-navy-800" },
                  { label: "Value Gain After Extension", value: fmt(calc.instantEquity), sub: "Equity created by extending", cls: calc.instantEquity > calc.extensionPremium ? "text-green-600" : "text-amber-600" },
                ].map(m => (
                  <div key={m.label} className="bg-white rounded-2xl border border-navy-100 p-5">
                    <p className="text-xs text-navy-400 font-semibold mb-1">{m.label}</p>
                    <p className={`text-2xl font-extrabold ${m.cls}`}>{m.value}</p>
                    <p className="text-xs text-navy-400 mt-1">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Tab navigation */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: activeTab === tab.id ? "none" : "1.5px solid #e2e8f0", background: activeTab === tab.id ? "#0f1b36" : "white", color: activeTab === tab.id ? "white" : "#64748b", whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Risk banner */}
                  <div style={{ padding: "16px 20px", borderRadius: 14, background: risk.bg, border: `1.5px solid ${risk.border}` }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: risk.color, marginBottom: 4 }}>{risk.label} Lease — {yearsLeft} years remaining</p>
                    <p style={{ fontSize: 13, color: "#374151" }}>{risk.desc}</p>
                  </div>

                  {/* Value comparison */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-4">📊 Value Analysis</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Current value (with lease)", value: calc.valueWithLease, bar: 100, color: "#0f1b36" },
                        { label: `After extension (+90 yrs = ${Math.min(yearsLeft + 90, 999)} yrs)`, value: calc.valueAfterExt, bar: (calc.valueAfterExt / calc.freeholdValue) * 100, color: "#16a34a" },
                        { label: "Freehold equivalent (999 yrs)", value: calc.freeholdValue, bar: 100, color: "#c9a84c" },
                      ].map(r => (
                        <div key={r.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: "#64748b" }}>{r.label}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36" }}>{fmt(r.value)}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 4, background: "#f1f5f9", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${r.bar}%`, background: r.color, borderRadius: 4 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Annual depreciation warning */}
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca" }}>
                    <p className="text-sm font-bold text-red-700 mb-1">⏱️ Annual lease depreciation</p>
                    <p className="text-2xl font-extrabold text-red-600">{fmt(calc.annualDepreciation)}<span className="text-sm font-normal text-red-400">/year</span></p>
                    <p className="text-xs text-red-500 mt-1">This is roughly how much value the lease loses each year as it runs down — assuming no extension.</p>
                  </div>

                  {/* Annual cost summary */}
                  <div className="bg-navy-800 rounded-2xl p-5 text-white">
                    <h4 className="font-bold text-sm text-white/50 mb-3">Annual Leasehold Costs</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-white/60">Ground rent</span><span className="font-semibold text-amber-400">{fmt(groundRentAnnual)}/yr</span></div>
                      <div className="flex justify-between"><span className="text-white/60">Service charge</span><span className="font-semibold">{fmt(calc.annualServiceCharge)}/yr</span></div>
                      <div className="flex justify-between border-t border-white/10 pt-2">
                        <span className="font-bold">Total annual charges</span>
                        <span className="font-bold text-lg text-amber-400">{fmt(groundRentAnnual + calc.annualServiceCharge)}/yr</span>
                      </div>
                    </div>
                  </div>

                  <EmailResults />
                  <ShareResults title="Leasehold Calculator" summary={`${yearsLeft}-year lease — ${fmt(calc.extensionPremium)} extension premium, ${pct(calc.discountFromFH)} lease discount, ${fmt(calc.instantEquity)} equity gain`} />
                </div>
              )}

              {/* ── EXTENSION COST TAB ── */}
              {activeTab === "extension" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-1">Statutory Lease Extension Estimate</h4>
                    <p className="text-xs text-navy-400 mb-4">Based on Leasehold Reform, Housing and Urban Development Act 1993. Adds 90 years to your current lease.</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: "Ground Rent (PV)", value: fmt(Math.max(0, calc.extensionPremium - pvLumpSum(calc.freeholdValue, capRate, yearsLeft) - (yearsLeft < 80 ? Math.max(0, calc.freeholdValue * (calc.relAfterExtension - calc.relativity)) * 0.5 : 0))), note: "PV of freeholder's income" },
                        { label: "Reversion Value", value: fmt(pvLumpSum(calc.freeholdValue, capRate, yearsLeft)), note: "PV of freehold reversion" },
                        { label: "Marriage Value", value: yearsLeft < 80 ? fmt(Math.max(0, calc.freeholdValue * (calc.relAfterExtension - calc.relativity)) * 0.5) : "£0 (n/a)", note: yearsLeft < 80 ? "50% of value created (statutory)" : "Only applies below 80 years" },
                        { label: "Total Premium", value: fmt(calc.extensionPremium), note: "Estimated cost to extend", highlight: true },
                      ].map(s => (
                        <div key={s.label} style={{ padding: "14px 12px", borderRadius: 12, background: s.highlight ? "#f0fdf4" : "#f8f9fc", border: `1.5px solid ${s.highlight ? "#bbf7d0" : "#e2e8f0"}` }}>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{s.label}</p>
                          <p style={{ fontSize: 17, fontWeight: 800, color: s.highlight ? "#16a34a" : "#0f1b36" }}>{s.value}</p>
                          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{s.note}</p>
                        </div>
                      ))}
                    </div>

                    {/* Extension ROI */}
                    <div style={{ padding: "14px", borderRadius: 12, background: "#0f1b36", color: "white" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Net gain after extension cost</p>
                          <p style={{ fontSize: 26, fontWeight: 800, color: calc.netGain > 0 ? "#4ade80" : "#f87171" }}>{fmt(calc.netGain)}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>ROI on extension</p>
                          <p style={{ fontSize: 22, fontWeight: 700, color: calc.extensionROI > 0 ? "#4ade80" : "#f87171" }}>{pct(calc.extensionROI)}</p>
                        </div>
                      </div>
                    </div>

                    {yearsLeft < 80 && (
                      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <p style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>⚠️ Marriage Value applies — lease is below 80 years. Extending now adds ~{fmt(calc.extensionPremium * 0.3)} to the premium. Extend immediately before dropping further.</p>
                      </div>
                    )}
                  </div>

                  {/* Extension costs breakdown */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3">Total Costs to Extend</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        ["Statutory premium (estimated)", fmt(calc.extensionPremium)],
                        ["Freeholder's legal fees (typical)", "£1,500 – £3,000"],
                        ["Your legal fees (solicitor)", "£2,000 – £4,000"],
                        ["Valuation / surveyor", "£500 – £1,500"],
                        ["Land Registry fee", "£50 – £500"],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-navy-500">{l}</span>
                          <span className="font-semibold text-navy-800">{v}</span>
                        </div>
                      ))}
                      <div className="border-t border-navy-100 pt-2 flex justify-between font-bold">
                        <span>Total all-in (estimated)</span>
                        <span className="text-navy-800">{fmt(calc.extensionPremium + 7500)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-navy-400 mt-3">Always get a RICS-accredited surveyor to provide a formal valuation. This tool is an estimate only.</p>
                  </div>
                </div>
              )}

              {/* ── GROUND RENT TAB ── */}
              {activeTab === "groundrent" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-1">Ground Rent Escalation</h4>
                    <p className="text-xs text-navy-400 mb-4">How your ground rent grows if it doubles every {groundRentDoubles} years.</p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            {["Year", "Annual Ground Rent", "Monthly Cost", "Mortgage Risk"].map(h => (
                              <th key={h} style={{ textAlign: "right", padding: "6px 8px", borderBottom: "2px solid #e2e8f0", color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {calc.grProjection.map((row, i) => {
                            const moriskRisk = row.rent > 1000;
                            return (
                              <tr key={row.yr} style={{ background: i % 2 === 0 ? "#f8f9fc" : "white" }}>
                                <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", fontWeight: 700, color: "#0f1b36", textAlign: "right" }}>Yr {row.yr}</td>
                                <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 700, color: moriskRisk ? "#dc2626" : "#0f1b36" }}>{fmt(row.rent)}</td>
                                <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#64748b" }}>{fmt(row.rent / 12)}</td>
                                <td style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: moriskRisk ? "#fef2f2" : "#f0fdf4", color: moriskRisk ? "#dc2626" : "#16a34a" }}>
                                    {moriskRisk ? "⚠️ High" : "✓ OK"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "#f8f9fc", border: "1px solid #e2e8f0" }}>
                      <p className="text-xs font-bold text-navy-800 mb-1">Total ground rent over remaining {yearsLeft} years</p>
                      <p className="text-2xl font-extrabold text-red-600">{fmt(calc.totalGR)}</p>
                      <p className="text-xs text-navy-400">Undiscounted total. This comes out of your pocket over the life of the lease.</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3">Ground Rent Risk Rules (2022 Act)</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: "Leasehold Reform Act 2022", val: "New leases: ground rent capped at £0 (peppercorn)", good: true },
                        { label: "Existing leases", val: "Not covered — historic ground rent still applies", good: false },
                        { label: "Ground rent > 0.1% of value", val: "Some lenders refuse to lend", good: false },
                        { label: "Doubling ground rent clauses", val: "Listed on RICS warning register", good: false },
                        { label: "Ground rent > £250 (or £1k London)", val: "Can trigger assured tenancy — eviction risk", good: false },
                      ].map(r => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 10px", borderRadius: 8, background: r.good ? "#f0fdf4" : "#fef2f2" }}>
                          <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{r.label}</span>
                          <span style={{ fontSize: 11, color: r.good ? "#16a34a" : "#dc2626", fontWeight: 600, marginLeft: 12, flexShrink: 0 }}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── VERDICT TAB ── */}
              {activeTab === "verdict" && (
                <div className="space-y-4">
                  {/* Main verdict */}
                  <div style={{ padding: "20px", borderRadius: 16, background: risk.bg, border: `2px solid ${risk.border}` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: risk.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>PropertyVault Verdict</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: risk.color, marginBottom: 12 }}>
                      {yearsLeft >= 90 ? "✅ Buy with confidence" : yearsLeft >= 80 ? "✅ Fine — extend soon" : yearsLeft >= 70 ? "⚠️ Proceed with caution" : yearsLeft >= 60 ? "❌ High risk — negotiate hard" : "❌ Avoid or heavily discount"}
                    </p>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{risk.desc}</p>
                  </div>

                  {/* Checklist */}
                  <div className="bg-white rounded-2xl border border-navy-100 p-5">
                    <h4 className="font-bold text-navy-800 text-sm mb-3">Due Diligence Checklist</h4>
                    <div className="space-y-2">
                      {[
                        { label: "Get a formal RICS lease extension valuation", done: false },
                        { label: `Check lease is above 80 years${yearsLeft >= 80 ? " — ✓ yours is" : " — ✗ yours is not (marriage value applies)"}`, done: yearsLeft >= 80 },
                        { label: "Confirm ground rent amount and doubling clause", done: groundRentAnnual === 0 },
                        { label: "Check ground rent is under £250/yr (£1,000 in London)", done: groundRentAnnual <= 250 },
                        { label: `Mortgage eligibility confirmed${calc.mortgageable ? " — ✓" : " — ✗ may be refused"}`, done: calc.mortgageable },
                        { label: "Review service charge history and management accounts", done: false },
                        { label: "Check for any major works planned (Section 20 notice)", done: false },
                        { label: "Confirm right to extend lease (2 years ownership required)", done: false },
                        { label: "Budget for extension premium + legal fees in your offer", done: false },
                      ].map(c => (
                        <div key={c.label} style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: c.done ? "#f0fdf4" : "#f8f9fc" }}>
                          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{c.done ? "✅" : "☐"}</span>
                          <p style={{ fontSize: 12, color: "#374151" }}>{c.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negotiation tip */}
                  {yearsLeft < 85 && (
                    <div style={{ padding: "16px", borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 6 }}>💡 Negotiation Tip</p>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                        With a {yearsLeft}-year lease, negotiate the purchase price down by at least <strong>{fmt(calc.extensionPremium + 5000)}</strong> to cover the full cost of extending (premium + legal fees). Then serve a Section 42 notice within 2 years of completion to lock in today&apos;s valuation.
                      </p>
                    </div>
                  )}

                  {/* PropertyVault CTA */}
                  <div style={{ padding: "20px", borderRadius: 16, background: "#0f1b36", textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Buying a leasehold property?</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 12 }}>Talk to a PropertyVault adviser — free, no obligation.</p>
                    <a href="/contact" style={{ display: "inline-block", background: "#c9a84c", color: "#0f1b36", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 12, textDecoration: "none" }}>Get Free Advice →</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-4xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Related tools</h2>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { href: "/calculators/stamp-duty", label: "Stamp Duty" },
              { href: "/calculators/mortgage", label: "Mortgage" },
              { href: "/calculators/moving-costs", label: "Moving Costs" },
              { href: "/blog/leasehold-explained", label: "Leasehold Guide →" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="block bg-navy-50 rounded-2xl p-4 card-hover text-center">
                <p className="font-semibold text-navy-800 text-sm">{l.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={leaseholdFaqs} />
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max max-w-3xl px-4">
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
