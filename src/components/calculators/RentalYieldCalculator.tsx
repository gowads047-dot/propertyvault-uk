"use client";

import { useState, useMemo } from "react";
import { ShareResults } from "./ShareResults";

export function RentalYieldCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(200000);
  const [monthlyRent, setMonthlyRent] = useState(950);
  const [annualCosts, setAnnualCosts] = useState(2400);
  const [managementFee, setManagementFee] = useState(10);
  const [voidWeeks, setVoidWeeks] = useState(2);
  const [mortgagePayment, setMortgagePayment] = useState(750);

  const results = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const effectiveWeeks = 52 - voidWeeks;
    const adjustedRent = (monthlyRent * 12 * effectiveWeeks) / 52;
    const managementCost = adjustedRent * (managementFee / 100);
    const totalExpenses = annualCosts + managementCost;
    const annualMortgage = mortgagePayment * 12;
    const netIncome = adjustedRent - totalExpenses;
    const cashFlow = netIncome - annualMortgage;

    return {
      grossYield: (annualRent / propertyPrice) * 100,
      netYield: (netIncome / propertyPrice) * 100,
      annualRent,
      adjustedRent,
      managementCost,
      totalExpenses,
      netIncome,
      monthlyCashFlow: cashFlow / 12,
      annualCashFlow: cashFlow,
      roi: propertyPrice > 0 ? (cashFlow / propertyPrice) * 100 : 0,
    };
  }, [propertyPrice, monthlyRent, annualCosts, managementFee, voidWeeks, mortgagePayment]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmtExact = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Property Purchase Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
            <input type="number" min={0} step={5000} value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rent</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
            <input type="number" min={0} step={25} value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Running Costs (insurance, maintenance, etc.)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
            <input type="number" min={0} step={100} value={annualCosts} onChange={(e) => setAnnualCosts(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Management Fee ({managementFee}%)</label>
          <input type="range" min={0} max={20} step={1} value={managementFee} onChange={(e) => setManagementFee(Number(e.target.value))} className="w-full accent-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Void Weeks Per Year ({voidWeeks})</label>
          <input type="range" min={0} max={8} step={1} value={voidWeeks} onChange={(e) => setVoidWeeks(Number(e.target.value))} className="w-full accent-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Mortgage Payment</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
            <input type="number" min={0} step={25} value={mortgagePayment} onChange={(e) => setMortgagePayment(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
        </div>
      </div>

      <div>
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-navy-300 text-xs">Gross Yield</p>
              <p className="text-3xl font-bold text-gold-400">{results.grossYield.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-navy-300 text-xs">Net Yield</p>
              <p className="text-3xl font-bold text-white">{results.netYield.toFixed(2)}%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-navy-300 text-xs">Monthly Cash Flow</p>
              <p className={`font-bold text-lg ${results.monthlyCashFlow >= 0 ? "text-green-400" : "text-red-400"}`}>{fmtExact(results.monthlyCashFlow)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-navy-300 text-xs">Annual Cash Flow</p>
              <p className={`font-bold text-lg ${results.annualCashFlow >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(results.annualCashFlow)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 p-6">
          <h4 className="font-bold text-navy-800 mb-4">Income &amp; Expense Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1"><span className="text-navy-600">Annual Rent (gross)</span><span className="font-semibold text-navy-800">{fmt(results.annualRent)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">Adjusted for Voids</span><span className="font-semibold text-navy-800">{fmt(results.adjustedRent)}</span></div>
            <div className="flex justify-between py-1 text-red-600"><span>Management Fee</span><span>-{fmt(results.managementCost)}</span></div>
            <div className="flex justify-between py-1 text-red-600"><span>Running Costs</span><span>-{fmt(annualCosts)}</span></div>
            <div className="flex justify-between py-2 border-t border-navy-200 font-bold"><span className="text-navy-800">Net Operating Income</span><span className="text-navy-800">{fmt(results.netIncome)}</span></div>
          </div>
        </div>
        <ShareResults
          title="Rental Yield Calculator"
          summary={`Rental yield: ${results.grossYield.toFixed(2)}% gross / ${results.netYield.toFixed(2)}% net on a £${propertyPrice.toLocaleString("en-GB")} property at £${monthlyRent}/mo`}
        />
      </div>
    </div>
  );
}
