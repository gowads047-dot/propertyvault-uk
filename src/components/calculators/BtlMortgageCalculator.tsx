"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ShareResults } from "./ShareResults";

export function BtlMortgageCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [actualRate, setActualRate] = useState(4.5);
  const [stressRate, setStressRate] = useState(5.5);
  const [icr, setIcr] = useState(145);
  const [propertyValue, setPropertyValue] = useState(200000);
  const [ltv, setLtv] = useState(75);

  const results = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const maxLoanActual = (annualRent / (icr / 100)) / (actualRate / 100);
    const maxLoanStress = (annualRent / (icr / 100)) / (stressRate / 100);
    const maxLoan = Math.min(maxLoanActual, maxLoanStress);
    const desiredLoan = propertyValue * (ltv / 100);
    const monthlyPaymentIO = (desiredLoan * (actualRate / 100)) / 12;
    const icrActual = ((monthlyRent * 12) / (monthlyPaymentIO * 12)) * 100;
    const icrStress = ((monthlyRent * 12) / (desiredLoan * (stressRate / 100))) * 100;
    const passes = icrActual >= icr && icrStress >= icr;
    const passesActual = icrActual >= icr;
    const passesStress = icrStress >= icr;
    const rentNeededActual = (desiredLoan * (actualRate / 100) * (icr / 100)) / 12;
    const rentNeededStress = (desiredLoan * (stressRate / 100) * (icr / 100)) / 12;
    const rentNeeded = Math.max(rentNeededActual, rentNeededStress);
    const deposit = propertyValue - desiredLoan;
    const grossYield = (annualRent / propertyValue) * 100;
    return { maxLoan, desiredLoan, monthlyPaymentIO, icrActual, icrStress, passes, passesActual, passesStress, rentNeeded, deposit, grossYield, annualRent };
  }, [monthlyRent, actualRate, stressRate, icr, propertyValue, ltv]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmtPct = (n: number) => n.toFixed(1) + "%";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Property & Rental Income</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Property Value</label>
          <input type="range" min={50000} max={1000000} step={5000} value={propertyValue} onChange={e => setPropertyValue(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(propertyValue)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Loan-to-Value (LTV)</label>
          <input type="range" min={50} max={85} step={5} value={ltv} onChange={e => setLtv(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{ltv}% — Deposit: {fmt(results.deposit)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rental Income</label>
          <input type="range" min={400} max={5000} step={50} value={monthlyRent} onChange={e => setMonthlyRent(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(monthlyRent)}/month · {fmt(results.annualRent)}/year</p>
        </div>
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Lender Stress Test Criteria</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Actual Mortgage Rate</label>
          <input type="range" min={2} max={9} step={0.25} value={actualRate} onChange={e => setActualRate(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmtPct(actualRate)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Stress Test Rate (lenders typically use 5.0–5.5%)</label>
          <input type="range" min={4} max={9} step={0.25} value={stressRate} onChange={e => setStressRate(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmtPct(stressRate)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">ICR — 125% basic rate / 145% higher rate</label>
          <input type="range" min={100} max={170} step={5} value={icr} onChange={e => setIcr(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{icr}%</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded-2xl p-6 border-2 ${results.passes ? "bg-green-50 border-green-400" : "bg-red-50 border-red-400"}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${results.passes ? "bg-green-500" : "bg-red-500"}`}>
              {results.passes ? "✓" : "✗"}
            </div>
            <div>
              <p className={`text-xl font-bold ${results.passes ? "text-green-800" : "text-red-800"}`}>
                {results.passes ? "PASSES stress test" : "FAILS stress test"}
              </p>
              <p className={`text-sm ${results.passes ? "text-green-600" : "text-red-600"}`}>
                {results.passes ? "Your rent covers the mortgage at the stress rate" : `Rent short by ${fmt(results.rentNeeded - monthlyRent)}/month`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-4 border ${results.passesActual ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-xs font-bold text-navy-600 mb-1">ICR at actual rate ({fmtPct(actualRate)})</p>
            <p className={`text-2xl font-bold ${results.passesActual ? "text-green-700" : "text-red-700"}`}>{fmtPct(results.icrActual)}</p>
            <p className="text-xs mt-1 text-navy-500">Need: {icr}%</p>
          </div>
          <div className={`rounded-xl p-4 border ${results.passesStress ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-xs font-bold text-navy-600 mb-1">ICR at stress rate ({fmtPct(stressRate)})</p>
            <p className={`text-2xl font-bold ${results.passesStress ? "text-green-700" : "text-red-700"}`}>{fmtPct(results.icrStress)}</p>
            <p className="text-xs mt-1 text-navy-500">Need: {icr}%</p>
          </div>
        </div>

        <div className="bg-navy-800 rounded-2xl p-5 text-white">
          <p className="text-xs text-white/60 mb-3 uppercase tracking-wider font-semibold">Maximum Borrowing</p>
          <p className="text-4xl font-bold mb-1">{fmt(results.maxLoan)}</p>
          <p className="text-sm text-white/60">Based on {fmt(monthlyRent)}/month at {icr}% ICR & {fmtPct(stressRate)} stress rate</p>
          <div className="mt-4 pt-4 border-t border-white/10 text-sm">
            <div className="flex justify-between mb-1"><span className="text-white/60">Your desired loan</span><span className="font-semibold">{fmt(results.desiredLoan)}</span></div>
            <div className="flex justify-between mb-1"><span className="text-white/60">Monthly IO payment</span><span className="font-semibold">{fmt(results.monthlyPaymentIO)}/mo</span></div>
            <div className="flex justify-between"><span className="text-white/60">Gross yield</span><span className="font-semibold">{fmtPct(results.grossYield)}</span></div>
          </div>
        </div>

        {!results.passes && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-bold mb-1">To pass the stress test you need either:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Rent of at least <strong>{fmt(results.rentNeeded)}/month</strong></li>
              <li>A lower LTV (larger deposit) to reduce the loan</li>
              <li>A lender using 125% ICR (basic rate payers only)</li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/calculators/mortgage" className="btn-primary text-sm !py-2.5 !px-5">Mortgage Calculator →</Link>
          <Link href="/calculators/rental-yield" className="btn-outline text-sm !py-2.5 !px-5">Rental Yield →</Link>
        </div>
        <ShareResults
          title="BTL Mortgage Stress Test"
          summary={`BTL stress test: ${results.passes ? "PASSES" : "FAILS"} — ICR ${results.icrStress.toFixed(0)}% vs ${icr}% required, rent £${monthlyRent}/mo on £${propertyValue.toLocaleString("en-GB")} at ${ltv}% LTV`}
        />
      </div>
    </div>
  );
}
