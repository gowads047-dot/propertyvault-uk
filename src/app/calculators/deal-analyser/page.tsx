"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";

const faqs = [
  { q: "What is a property deal analyser?", a: "A deal analyser evaluates a potential property investment from multiple perspectives — gross yield, net yield, monthly cash flow, and cash-on-cash return. This gives you a complete picture of whether a deal is worth pursuing, rather than relying on a single metric like gross yield which can be misleading." },
  { q: "What is a good rental yield in the UK?", a: "A gross yield of 6-8% is considered good for most UK buy-to-let investments. However, gross yield alone doesn't tell the full story. Net yield (after all costs) of 4-5%+ and positive monthly cash flow are better indicators of a strong deal. Always analyse all four metrics together." },
  { q: "What is cash-on-cash return?", a: "Cash-on-cash return measures the annual pre-tax cash flow as a percentage of the total cash you invested (deposit + purchase costs + refurb). It tells you how hard your actual cash is working. A cash-on-cash return of 10%+ is considered strong for UK property." },
  { q: "Should I use gross or net yield?", a: "Always use net yield for decision-making. Gross yield ignores all costs (mortgage, management, maintenance, voids, insurance) and dramatically overstates your actual return. A property with 8% gross yield might only deliver 3-4% net yield after all expenses." },
];

export default function DealAnalyserPage() {
  const [purchasePrice, setPurchasePrice] = useState(180000);
  const [refurbCost, setRefurbCost] = useState(15000);
  const [afterRefurbValue, setAfterRefurbValue] = useState(220000);
  const [monthlyRent, setMonthlyRent] = useState(950);
  const [depositPct, setDepositPct] = useState(25);
  const [mortgageRate, setMortgageRate] = useState(5.5);
  const [mortgageTerm, setMortgageTerm] = useState(25);
  const [mortgageType, setMortgageType] = useState<"interest" | "repayment">("interest");
  const [purchaseCosts, setPurchaseCosts] = useState(5000);
  const [managementPct, setManagementPct] = useState(10);
  const [maintenancePct, setMaintenancePct] = useState(10);
  const [insuranceMonthly, setInsuranceMonthly] = useState(30);
  const [voidWeeks, setVoidWeeks] = useState(2);

  const r = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const grossYield = (annualRent / purchasePrice) * 100;

    const depositAmount = purchasePrice * (depositPct / 100);
    const loanAmount = purchasePrice - depositAmount;
    const monthlyRate = mortgageRate / 100 / 12;

    let monthlyMortgage: number;
    if (mortgageType === "interest") {
      monthlyMortgage = loanAmount * monthlyRate;
    } else {
      monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, mortgageTerm * 12)) / (Math.pow(1 + monthlyRate, mortgageTerm * 12) - 1);
    }

    const annualMortgage = monthlyMortgage * 12;
    const management = annualRent * (managementPct / 100);
    const maintenance = annualRent * (maintenancePct / 100);
    const insurance = insuranceMonthly * 12;
    const voidCost = (annualRent / 52) * voidWeeks;
    const totalExpenses = annualMortgage + management + maintenance + insurance + voidCost;

    const netIncome = annualRent - totalExpenses;
    const netYield = (netIncome / purchasePrice) * 100;
    const monthlyCashFlow = netIncome / 12;

    const totalCashInvested = depositAmount + purchaseCosts + refurbCost;
    const cashOnCash = totalCashInvested > 0 ? (netIncome / totalCashInvested) * 100 : 0;

    const equityGain = afterRefurbValue - purchasePrice - refurbCost;
    const totalReturn = netIncome + equityGain;
    const roi = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0;

    let verdict: { label: string; color: string; bg: string };
    if (monthlyCashFlow >= 200 && cashOnCash >= 8 && netYield >= 4) {
      verdict = { label: "Strong Deal", color: "text-green-700", bg: "bg-green-50 border-green-200" };
    } else if (monthlyCashFlow >= 100 && cashOnCash >= 5 && netYield >= 2) {
      verdict = { label: "Decent Deal", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
    } else if (monthlyCashFlow >= 0) {
      verdict = { label: "Marginal Deal", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
    } else {
      verdict = { label: "Negative Cash Flow", color: "text-red-700", bg: "bg-red-50 border-red-200" };
    }

    return {
      grossYield, netYield, monthlyCashFlow, cashOnCash, roi,
      annualRent, totalExpenses, netIncome,
      annualMortgage, management, maintenance, insurance, voidCost,
      depositAmount, loanAmount, monthlyMortgage, totalCashInvested,
      equityGain, totalReturn, verdict,
    };
  }, [purchasePrice, refurbCost, afterRefurbValue, monthlyRent, depositPct, mortgageRate, mortgageTerm, mortgageType, purchaseCosts, managementPct, maintenancePct, insuranceMonthly, voidWeeks]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmt2 = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(n);

  const expenseTotal = r.annualMortgage + r.management + r.maintenance + r.insurance + r.voidCost;
  const expenseItems = [
    { label: "Mortgage", value: r.annualMortgage, color: "#0f1b36" },
    { label: "Management", value: r.management, color: "#c9a84c" },
    { label: "Maintenance", value: r.maintenance, color: "#6b7280" },
    { label: "Insurance", value: r.insurance, color: "#3b82f6" },
    { label: "Voids", value: r.voidCost, color: "#ef4444" },
  ];

  return (
    <>
      <section className="bg-white py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#c9a84c"/><path d="M6 20V14" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest">Flagship tool</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Deal Analyser</h1>
              </div>
            </div>
            <p className="text-navy-500">Analyse any UK property deal from 4 perspectives — gross yield, net yield, monthly cash flow, and cash-on-cash return. One tool, complete picture.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          {/* Verdict Banner */}
          <div className={`rounded-2xl border p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${r.verdict.bg}`}>
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-extrabold ${r.verdict.color}`}>{r.verdict.label}</div>
              <span className="text-sm text-navy-500">Based on cash flow, yield, and cash-on-cash return</span>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="font-semibold">{fmt(r.monthlyCashFlow)}<span className="text-navy-400 font-normal">/mo</span></span>
              <span className="font-semibold">{r.netYield.toFixed(1)}%<span className="text-navy-400 font-normal"> net</span></span>
              <span className="font-semibold">{r.cashOnCash.toFixed(1)}%<span className="text-navy-400 font-normal"> CoC</span></span>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Inputs — 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                  Property
                </h3>
                <div className="space-y-3">
                  <div><label className="block text-xs text-navy-500 mb-1">Purchase Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={purchasePrice} onChange={e => setPurchasePrice(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs text-navy-500 mb-1">Refurb Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={refurbCost} onChange={e => setRefurbCost(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                    <div><label className="block text-xs text-navy-500 mb-1">After Refurb Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={afterRefurbValue} onChange={e => setAfterRefurbValue(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                  </div>
                  <div><label className="block text-xs text-navy-500 mb-1">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={monthlyRent} onChange={e => setMonthlyRent(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                  <div><label className="block text-xs text-navy-500 mb-1">Purchase Costs (SDLT, legal, survey)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={purchaseCosts} onChange={e => setPurchaseCosts(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" /></svg>
                  Mortgage
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs text-navy-500 mb-1">Deposit %</label><input type="number" value={depositPct} onChange={e => setDepositPct(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    <div><label className="block text-xs text-navy-500 mb-1">Rate %</label><input type="number" step="0.1" value={mortgageRate} onChange={e => setMortgageRate(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs text-navy-500 mb-1">Term (years)</label><input type="number" value={mortgageTerm} onChange={e => setMortgageTerm(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    <div>
                      <label className="block text-xs text-navy-500 mb-1">Type</label>
                      <select value={mortgageType} onChange={e => setMortgageType(e.target.value as "interest" | "repayment")} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                        <option value="interest">Interest only</option>
                        <option value="repayment">Repayment</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-navy-100 p-5">
                <h3 className="font-bold text-navy-800 text-sm mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                  Running Costs
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs text-navy-500 mb-1">Management %</label><input type="number" value={managementPct} onChange={e => setManagementPct(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    <div><label className="block text-xs text-navy-500 mb-1">Maintenance %</label><input type="number" value={maintenancePct} onChange={e => setMaintenancePct(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs text-navy-500 mb-1">Insurance £/mo</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={insuranceMonthly} onChange={e => setInsuranceMonthly(+e.target.value)} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                    <div><label className="block text-xs text-navy-500 mb-1">Void weeks/yr</label><input type="number" value={voidWeeks} onChange={e => setVoidWeeks(+e.target.value)} className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results — 3 cols */}
            <div className="lg:col-span-3 space-y-4">
              {/* 4 Perspective Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#0f1b36" strokeWidth="2"/><text x="8" y="11" textAnchor="middle" fill="#0f1b36" fontSize="7" fontWeight="bold">G</text></svg></div>
                    <span className="text-xs text-navy-400 font-semibold">Gross Yield</span>
                  </div>
                  <p className="text-3xl font-extrabold text-navy-800">{r.grossYield.toFixed(1)}%</p>
                  <p className="text-xs text-navy-400 mt-1">Rent / purchase price</p>
                </div>
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#0f1b36"/><text x="8" y="11" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">N</text></svg></div>
                    <span className="text-xs text-navy-400 font-semibold">Net Yield</span>
                  </div>
                  <p className={`text-3xl font-extrabold ${r.netYield >= 4 ? "text-green-600" : r.netYield >= 2 ? "text-amber-600" : "text-red-600"}`}>{r.netYield.toFixed(1)}%</p>
                  <p className="text-xs text-navy-400 mt-1">After all expenses</p>
                </div>
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="9" rx="2" fill="#c9a84c"/><text x="8" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">£</text></svg></div>
                    <span className="text-xs text-navy-400 font-semibold">Monthly Cash Flow</span>
                  </div>
                  <p className={`text-3xl font-extrabold ${r.monthlyCashFlow >= 200 ? "text-green-600" : r.monthlyCashFlow >= 0 ? "text-amber-600" : "text-red-600"}`}>{fmt(r.monthlyCashFlow)}</p>
                  <p className="text-xs text-navy-400 mt-1">Net income per month</p>
                </div>
                <div className="bg-white rounded-2xl border border-navy-100 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M2 12l4-4 3 3 5-7" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                    <span className="text-xs text-navy-400 font-semibold">Cash-on-Cash</span>
                  </div>
                  <p className={`text-3xl font-extrabold ${r.cashOnCash >= 8 ? "text-green-600" : r.cashOnCash >= 5 ? "text-amber-600" : "text-red-600"}`}>{r.cashOnCash.toFixed(1)}%</p>
                  <p className="text-xs text-navy-400 mt-1">Return on cash invested</p>
                </div>
              </div>

              {/* Expense Breakdown with visual bar */}
              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <h4 className="font-bold text-navy-800 text-sm mb-4">Annual Expense Breakdown</h4>
                <div className="h-6 rounded-full overflow-hidden flex mb-4">
                  {expenseItems.map(item => (
                    <div key={item.label} style={{ width: `${expenseTotal > 0 ? (item.value / expenseTotal * 100) : 0}%`, backgroundColor: item.color }} className="h-full transition-all" title={`${item.label}: ${fmt(item.value)}`} />
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {expenseItems.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-xs text-navy-400">{item.label}</p>
                        <p className="text-sm font-semibold text-navy-800">{fmt(item.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-navy-100 mt-4 pt-3 flex justify-between text-sm">
                  <span className="font-semibold text-navy-800">Total annual expenses</span>
                  <span className="font-bold text-red-600">{fmt(expenseTotal)}</span>
                </div>
              </div>

              {/* P&L Summary */}
              <div className="bg-navy-800 rounded-2xl p-6 text-white">
                <h4 className="font-bold text-sm text-white/50 mb-4">Profit & Loss Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">Annual rental income</span><span className="font-semibold text-green-400">{fmt(r.annualRent)}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Total expenses</span><span className="font-semibold text-red-400">-{fmt(r.totalExpenses)}</span></div>
                  <div className="flex justify-between border-t border-white/10 pt-2"><span className="font-bold">Net annual income</span><span className={`font-bold text-lg ${r.netIncome >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(r.netIncome)}</span></div>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <h4 className="font-bold text-navy-800 text-sm mb-4">Investment Summary</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div className="flex justify-between"><span className="text-navy-500">Deposit ({depositPct}%)</span><span className="font-semibold">{fmt(r.depositAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Purchase costs</span><span className="font-semibold">{fmt(purchaseCosts)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Refurb cost</span><span className="font-semibold">{fmt(refurbCost)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Loan amount</span><span className="font-semibold">{fmt(r.loanAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Monthly mortgage</span><span className="font-semibold">{fmt2(r.monthlyMortgage)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-500">Equity created</span><span className={`font-semibold ${r.equityGain >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(r.equityGain)}</span></div>
                </div>
                <div className="border-t border-navy-100 mt-4 pt-3 flex justify-between">
                  <span className="font-bold text-navy-800">Total cash invested</span>
                  <span className="font-extrabold text-lg text-navy-800">{fmt(r.totalCashInvested)}</span>
                </div>
              </div>

              {/* ROI */}
              <div className="bg-navy-50 rounded-2xl border border-navy-100 p-5 text-center">
                <p className="text-xs text-navy-400 mb-1">Total ROI (income + equity)</p>
                <p className={`text-4xl font-extrabold ${r.roi >= 15 ? "text-green-600" : r.roi >= 0 ? "text-navy-800" : "text-red-600"}`}>{r.roi.toFixed(1)}%</p>
                <p className="text-xs text-navy-400 mt-1">({fmt(r.totalReturn)} return on {fmt(r.totalCashInvested)} invested)</p>
              </div>

              <EmailResults />
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-4xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Go deeper</h2>
          <div className="grid sm:grid-cols-4 gap-3">
            <Link href="/calculators/rental-yield" className="block bg-navy-50 rounded-2xl p-4 card-hover text-center"><p className="font-semibold text-navy-800 text-sm">Rental Yield</p></Link>
            <Link href="/calculators/brrr" className="block bg-navy-50 rounded-2xl p-4 card-hover text-center"><p className="font-semibold text-navy-800 text-sm">BRRR Calculator</p></Link>
            <Link href="/calculators/capital-gains-tax" className="block bg-navy-50 rounded-2xl p-4 card-hover text-center"><p className="font-semibold text-navy-800 text-sm">CGT Calculator</p></Link>
            <Link href="/calculators/section-24" className="block bg-navy-50 rounded-2xl p-4 card-hover text-center"><p className="font-semibold text-navy-800 text-sm">Section 24</p></Link>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
