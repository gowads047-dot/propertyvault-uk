"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ShareResults } from "./ShareResults";
import {
  grossYield as calcGrossYield,
  netYield as calcNetYield,
  cashOnCash as calcCashOnCash,
} from "@/lib/finance";

export function CashFlowCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(950);
  const [mortgagePayment, setMortgagePayment] = useState(600);
  const [managementFee, setManagementFee] = useState(10);
  const [maintenancePct, setMaintenancePct] = useState(5);
  const [insurance, setInsurance] = useState(30);
  const [councilTax, setCouncilTax] = useState(0);
  const [utilities, setUtilities] = useState(0);
  const [voidWeeksPerYear, setVoidWeeksPerYear] = useState(3);
  const [groundRent, setGroundRent] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [depositPct, setDepositPct] = useState(25);

  const results = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const voidLoss = (voidWeeksPerYear / 52) * annualRent;
    const effectiveAnnualRent = annualRent - voidLoss;
    const effectiveMonthlyRent = effectiveAnnualRent / 12;

    const managementCost = (managementFee / 100) * effectiveMonthlyRent;
    const maintenanceCost = (maintenancePct / 100) * effectiveMonthlyRent;
    const monthlyExpenses = mortgagePayment + managementCost + maintenanceCost + insurance + councilTax + utilities + (groundRent / 12);
    const monthlyCashFlow = effectiveMonthlyRent - monthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    const deposit = purchasePrice * (depositPct / 100);
    const grossYield = calcGrossYield(annualRent, purchasePrice);
    const netYield = calcNetYield(annualCashFlow, 0, purchasePrice);
    const cashOnCash = calcCashOnCash(annualCashFlow, deposit);

    const breakEven = monthlyExpenses;
    const coverageRatio = effectiveMonthlyRent > 0 ? (effectiveMonthlyRent / monthlyExpenses) * 100 : 0;

    return { monthlyCashFlow, annualCashFlow, grossYield, netYield, cashOnCash, deposit, breakEven, coverageRatio, effectiveMonthlyRent, managementCost, maintenanceCost };
  }, [monthlyRent, mortgagePayment, managementFee, maintenancePct, insurance, councilTax, utilities, voidWeeksPerYear, groundRent, purchasePrice, depositPct]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmtPct = (n: number) => n.toFixed(1) + "%";
  const positive = results.monthlyCashFlow >= 0;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Income</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Gross Monthly Rent</label>
          <input type="range" min={400} max={5000} step={25} value={monthlyRent} onChange={e => setMonthlyRent(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(monthlyRent)}/month</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Void weeks per year</label>
          <input type="range" min={0} max={12} step={1} value={voidWeeksPerYear} onChange={e => setVoidWeeksPerYear(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{voidWeeksPerYear} week{voidWeeksPerYear !== 1 ? "s" : ""}</p>
        </div>

        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-2">Monthly Costs</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Mortgage / Finance Payment</label>
          <input type="range" min={0} max={3000} step={25} value={mortgagePayment} onChange={e => setMortgagePayment(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(mortgagePayment)}/month</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Letting Agent Fee</label>
          <input type="range" min={0} max={20} step={1} value={managementFee} onChange={e => setManagementFee(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{managementFee}% = {fmt(results.managementCost)}/month</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Maintenance Reserve</label>
          <input type="range" min={0} max={15} step={1} value={maintenancePct} onChange={e => setMaintenancePct(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{maintenancePct}% = {fmt(results.maintenanceCost)}/month</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Insurance</label>
            <input type="range" min={0} max={200} step={5} value={insurance} onChange={e => setInsurance(+e.target.value)} className="w-full accent-gold-500" />
            <p className="text-center text-sm font-bold text-navy-800">{fmt(insurance)}/mo</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Council Tax (landlord)</label>
            <input type="range" min={0} max={300} step={10} value={councilTax} onChange={e => setCouncilTax(+e.target.value)} className="w-full accent-gold-500" />
            <p className="text-center text-sm font-bold text-navy-800">{fmt(councilTax)}/mo</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Utilities (landlord-paid)</label>
            <input type="range" min={0} max={400} step={10} value={utilities} onChange={e => setUtilities(+e.target.value)} className="w-full accent-gold-500" />
            <p className="text-center text-sm font-bold text-navy-800">{fmt(utilities)}/mo</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">Ground Rent / Service Charge</label>
            <input type="range" min={0} max={4000} step={50} value={groundRent} onChange={e => setGroundRent(+e.target.value)} className="w-full accent-gold-500" />
            <p className="text-center text-sm font-bold text-navy-800">{fmt(groundRent)}/yr</p>
          </div>
        </div>

        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-2">Investment Details</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Purchase Price</label>
          <input type="range" min={50000} max={1000000} step={5000} value={purchasePrice} onChange={e => setPurchasePrice(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(purchasePrice)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Deposit Percentage</label>
          <input type="range" min={15} max={100} step={5} value={depositPct} onChange={e => setDepositPct(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{depositPct}% = {fmt(results.deposit)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-6 text-white ${positive ? "bg-gradient-to-br from-green-600 to-green-800" : "bg-gradient-to-br from-red-700 to-red-900"}`}>
          <p className="text-sm opacity-80 mb-1">Monthly cash flow</p>
          <p className="text-5xl font-bold">{positive ? "+" : ""}{fmt(results.monthlyCashFlow)}</p>
          <p className="text-sm opacity-70 mt-1">{positive ? "Positive" : "Negative"} — {fmt(Math.abs(results.annualCashFlow))}/year {positive ? "profit" : "shortfall"}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Gross yield</p>
            <p className="text-2xl font-bold text-navy-800">{fmtPct(results.grossYield)}</p>
            <p className="text-xs text-navy-400 mt-0.5">Before costs</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Net yield</p>
            <p className={`text-2xl font-bold ${results.netYield > 0 ? "text-green-700" : "text-red-700"}`}>{fmtPct(results.netYield)}</p>
            <p className="text-xs text-navy-400 mt-0.5">After all costs</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Cash-on-cash return</p>
            <p className={`text-2xl font-bold ${results.cashOnCash > 0 ? "text-green-700" : "text-red-700"}`}>{fmtPct(results.cashOnCash)}</p>
            <p className="text-xs text-navy-400 mt-0.5">Return on deposit</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Coverage ratio</p>
            <p className={`text-2xl font-bold ${results.coverageRatio >= 125 ? "text-green-700" : "text-amber-600"}`}>{fmtPct(results.coverageRatio)}</p>
            <p className="text-xs text-navy-400 mt-0.5">125%+ basic / 145%+ higher-rate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 p-5 space-y-2 text-sm">
          <p className="font-bold text-navy-800 mb-3 text-sm">Monthly breakdown</p>
          <div className="flex justify-between"><span className="text-navy-600">Effective rent (after voids)</span><span className="font-semibold">{fmt(results.effectiveMonthlyRent)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">Mortgage</span><span className="font-semibold text-red-600">−{fmt(mortgagePayment)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">Agent fee</span><span className="font-semibold text-red-600">−{fmt(results.managementCost)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">Maintenance reserve</span><span className="font-semibold text-red-600">−{fmt(results.maintenanceCost)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">Insurance + council tax</span><span className="font-semibold text-red-600">−{fmt(insurance + councilTax)}</span></div>
          {utilities > 0 && (
            <div className="flex justify-between"><span className="text-navy-600">Utilities</span><span className="font-semibold text-red-600">−{fmt(utilities)}</span></div>
          )}
          {groundRent > 0 && (
            <div className="flex justify-between"><span className="text-navy-600">Ground rent / service charge</span><span className="font-semibold text-red-600">−{fmt(groundRent / 12)}</span></div>
          )}
          <div className="flex justify-between border-t border-navy-100 pt-2 font-bold"><span>Monthly cash flow</span><span className={positive ? "text-green-700" : "text-red-700"}>{positive ? "+" : ""}{fmt(results.monthlyCashFlow)}</span></div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/calculators/deal-analyser" className="btn-primary text-sm !py-2.5 !px-5">Full Deal Analysis →</Link>
          <Link href="/calculators/btl-mortgage" className="btn-outline text-sm !py-2.5 !px-5">Stress Test →</Link>
        </div>
        <ShareResults
          title="BTL Monthly Cash Flow Calculator"
          summary={`BTL cash flow: ${results.monthlyCashFlow >= 0 ? "+" : ""}£${Math.round(results.monthlyCashFlow).toLocaleString("en-GB")}/mo on a £${purchasePrice.toLocaleString("en-GB")} property at £${monthlyRent}/mo rent`}
        />
      </div>
    </div>
  );
}
