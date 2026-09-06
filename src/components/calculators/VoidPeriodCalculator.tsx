"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ShareResults } from "./ShareResults";
import { nonNegative } from "@/lib/inputs";
import { DEFAULT_ASSUMPTIONS } from "@/lib/guaranteed-rent-model";

export function VoidPeriodCalculator() {
  const [monthlyRent, setMonthlyRent] = useState(900);
  const [monthlyMortgage, setMonthlyMortgage] = useState(600);
  const [councilTax, setCouncilTax] = useState(120);
  const [monthlyInsurance, setMonthlyInsurance] = useState(30);
  const [utilities, setUtilities] = useState(50);
  const [voidWeeks, setVoidWeeks] = useState(4);
  const [voidsPerYear, setVoidsPerYear] = useState(1);

  const results = useMemo(() => {
    const voidMonths = voidWeeks / 4.33;
    const lostRent = monthlyRent * voidMonths;
    const ongoingCosts = (monthlyMortgage + councilTax + monthlyInsurance + utilities) * voidMonths;
    const totalVoidCost = lostRent + ongoingCosts;
    const annualVoidCost = totalVoidCost * voidsPerYear;
    const annualRent = monthlyRent * 12;
    const pctOfAnnualRent = annualRent > 0 ? (annualVoidCost / annualRent) * 100 : 0;
    const effectiveMonthlyIncome = (annualRent - annualVoidCost) / 12;
    // The mid-point of the 82-88% offer range, matching /guaranteed-rent.
    // This used to hard-code 0.88 and call it typical, which is the top of
    // the range and made the comparison look better than the page it cites.
    const guaranteedRentComparison = monthlyRent * DEFAULT_ASSUMPTIONS.offerPct;
    const guaranteedRentAnnual = guaranteedRentComparison * 12;
    const savingVsGuaranteed = guaranteedRentAnnual - (annualRent - annualVoidCost);
    return { lostRent, ongoingCosts, totalVoidCost, annualVoidCost, pctOfAnnualRent, effectiveMonthlyIncome, guaranteedRentComparison, guaranteedRentAnnual, savingVsGuaranteed };
  }, [monthlyRent, monthlyMortgage, councilTax, monthlyInsurance, utilities, voidWeeks, voidsPerYear]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Your Property Income</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rent</label>
          <input aria-label="Monthly Rent" type="range" min={400} max={3000} step={50} value={monthlyRent} onChange={e => setMonthlyRent(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(monthlyRent)}/month</p>
        </div>

        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Monthly Costs (still paid during void)</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Mortgage / Finance Payment</label>
          <input aria-label="Mortgage / Finance Payment" type="range" min={0} max={2500} step={25} value={monthlyMortgage} onChange={e => setMonthlyMortgage(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(monthlyMortgage)}/month</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Council Tax (while empty)</label>
          <input aria-label="Council Tax (while empty)" type="range" min={0} max={300} step={10} value={councilTax} onChange={e => setCouncilTax(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(councilTax)}/month</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Buildings Insurance</label>
          <input aria-label="Buildings Insurance" type="range" min={10} max={200} step={5} value={monthlyInsurance} onChange={e => setMonthlyInsurance(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(monthlyInsurance)}/month</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Utilities / Other Fixed Costs</label>
          <input aria-label="Utilities / Other Fixed Costs" type="range" min={0} max={300} step={10} value={utilities} onChange={e => setUtilities(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(utilities)}/month</p>
        </div>

        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Void Pattern</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Duration per Void Period</label>
          <input aria-label="Duration per Void Period" type="range" min={1} max={26} step={1} value={voidWeeks} onChange={e => setVoidWeeks(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{voidWeeks} week{voidWeeks !== 1 ? "s" : ""}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Void Periods per Year</label>
          <input aria-label="Void Periods per Year" type="range" min={1} max={6} step={1} value={voidsPerYear} onChange={e => setVoidsPerYear(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{voidsPerYear} per year</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80 mb-1">Annual void cost to your income</p>
          <p className="text-5xl font-bold">{fmt(results.annualVoidCost)}</p>
          <p className="text-sm opacity-70 mt-1">= {results.pctOfAnnualRent.toFixed(1)}% of your annual rental income</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Lost rent per void</p>
            <p className="text-2xl font-bold text-navy-800">{fmt(results.lostRent)}</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Ongoing costs per void</p>
            <p className="text-2xl font-bold text-navy-800">{fmt(results.ongoingCosts)}</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Total per void period</p>
            <p className="text-2xl font-bold text-red-700">{fmt(results.totalVoidCost)}</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Effective monthly income</p>
            <p className="text-2xl font-bold text-navy-800">{fmt(results.effectiveMonthlyIncome)}</p>
          </div>
        </div>

        <div className={`rounded-2xl p-5 border-2 ${results.savingVsGuaranteed > 0 ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"}`}>
          <p className="font-bold text-navy-800 mb-2 text-sm">Guaranteed Rent Comparison</p>
          <p className="text-xs text-navy-600 mb-3">If guaranteed rent pays you {fmt(results.guaranteedRentComparison)}/month (88% of market rate, zero voids, zero management):</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-navy-500">Current (after voids)</p>
              <p className="text-lg font-bold text-navy-800">{fmt((monthlyRent * 12 - results.annualVoidCost) / 12)}/mo</p>
            </div>
            <div>
              <p className="text-xs text-navy-500">Guaranteed rent</p>
              <p className="text-lg font-bold text-green-700">{fmt(results.guaranteedRentComparison)}/mo</p>
            </div>
          </div>
          {results.savingVsGuaranteed > 0 ? (
            <p className="text-xs text-green-700 mt-3 font-semibold">Guaranteed rent earns you {fmt(results.savingVsGuaranteed)} MORE per year with zero hassle</p>
          ) : (
            <p className="text-xs text-amber-700 mt-3 font-semibold">Your voids are low — you currently earn more managing it yourself</p>
          )}
        </div>

        <Link href="/guaranteed-rent" className="btn-gold w-full text-center block">Get a free guaranteed rent estimate →</Link>
        <ShareResults
          title="Void Period Cost Calculator"
          summary={`Void period cost: £${Math.round(results.annualVoidCost).toLocaleString("en-GB")}/yr (${voidWeeks} weeks × ${voidsPerYear} void${voidsPerYear > 1 ? "s" : ""} per year, £${monthlyRent}/mo rent)`}
        />
      </div>
    </div>
  );
}
