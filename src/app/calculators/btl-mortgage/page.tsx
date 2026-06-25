"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function BtlMortgagePage() {
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
    const icrStress = ((monthlyRent * 12) / ((desiredLoan * (stressRate / 100)))) * 100;

    const passes = icrActual >= icr && icrStress >= icr;
    const passesActual = icrActual >= icr;
    const passesStress = icrStress >= icr;

    const rentNeededActual = (desiredLoan * (actualRate / 100) * (icr / 100)) / 12;
    const rentNeededStress = (desiredLoan * (stressRate / 100) * (icr / 100)) / 12;
    const rentNeeded = Math.max(rentNeededActual, rentNeededStress);

    const deposit = propertyValue - desiredLoan;
    const grossYield = (annualRent / propertyValue) * 100;

    return { maxLoan, maxLoanActual, maxLoanStress, desiredLoan, monthlyPaymentIO, icrActual, icrStress, passes, passesActual, passesStress, rentNeeded, deposit, grossYield, annualRent };
  }, [monthlyRent, actualRate, stressRate, icr, propertyValue, ltv]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmtPct = (n: number) => n.toFixed(1) + "%";

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">BTL Mortgage Stress Test Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Check whether your rental income passes the lender&apos;s stress test — and find out exactly how much you can borrow on a buy-to-let mortgage.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
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
                <label className="block text-sm font-semibold text-navy-700 mb-1">Interest Coverage Ratio (ICR) — typically 125% basic rate, 145% higher rate</label>
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
                <p className="text-sm text-white/60">Based on {fmt(monthlyRent)}/month rent at {icr}% ICR & {fmtPct(stressRate)} stress rate</p>
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
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 space-y-4 max-w-3xl text-sm text-navy-600">
            <h2 className="text-xl font-bold text-navy-800">How Does the BTL Mortgage Stress Test Work?</h2>
            <p>Buy-to-let lenders do not use the same affordability test as residential mortgages. Instead of looking at your income, they focus on whether the rental income covers the mortgage interest by a set multiple — the Interest Coverage Ratio (ICR).</p>
            <p><strong>Standard ICR rules:</strong> Most lenders require rent to cover mortgage interest by 125% if you&apos;re a basic rate taxpayer, or 145% if you&apos;re a higher rate taxpayer. They calculate this at a stressed rate (typically 5.0–5.5%) rather than the actual product rate.</p>
            <p><strong>Example:</strong> A £150,000 loan at a 5.5% stress rate costs £8,250/year in interest. At 145% ICR, you need annual rent of £11,963 (£997/month) to pass. If your actual rent is lower, the lender will reduce the maximum loan until the test passes.</p>
            <p><strong>Limited company loans:</strong> Some lenders apply 125% ICR to limited companies regardless of the director&apos;s personal tax position, which can give companies access to slightly higher lending amounts.</p>
          </div>

          <div className="pt-4 border-t border-navy-200 not-prose mt-6">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/calculators/mortgage" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Mortgage</p><p className="text-xs text-navy-400 mt-0.5">Monthly payments</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross & net yield</p></Link>
              <Link href="/calculators/deal-analyser" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Deal Analyser</p><p className="text-xs text-navy-400 mt-0.5">Full deal score</p></Link>
            </div>
          </div>
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
