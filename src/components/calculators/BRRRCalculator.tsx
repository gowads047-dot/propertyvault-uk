"use client";

import { useState, useMemo } from "react";
import { ShareResults } from "./ShareResults";
import { pctOf } from "@/lib/finance";

export function BRRRCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(120000);
  const [refurbCost, setRefurbCost] = useState(30000);
  const [purchaseCosts, setPurchaseCosts] = useState(5000);
  const [afterRepairValue, setAfterRepairValue] = useState(200000);
  const [refinanceLTV, setRefinanceLTV] = useState(75);
  const [refinanceRate, setRefinanceRate] = useState(5.5);
  const [monthlyRent, setMonthlyRent] = useState(1100);
  const [monthlyExpenses, setMonthlyExpenses] = useState(250);

  const results = useMemo(() => {
    const totalInvested = purchasePrice + refurbCost + purchaseCosts;
    const refinanceAmount = afterRepairValue * (refinanceLTV / 100);
    const moneyLeftIn = totalInvested - refinanceAmount;
    const capitalRecycled = Math.min(refinanceAmount, totalInvested);
    const recyclePercent = pctOf(capitalRecycled, totalInvested);

    const monthlyMortgage = (refinanceAmount * (refinanceRate / 100)) / 12;
    const monthlyCashFlow = monthlyRent - monthlyExpenses - monthlyMortgage;
    const annualCashFlow = monthlyCashFlow * 12;

    const equityCreated = afterRepairValue - refinanceAmount;
    const roiOnCash = moneyLeftIn > 0 ? (annualCashFlow / moneyLeftIn) * 100 : Infinity;
    const grossYield = pctOf(monthlyRent * 12, afterRepairValue);

    return {
      totalInvested,
      refinanceAmount,
      moneyLeftIn: Math.max(moneyLeftIn, 0),
      capitalRecycled,
      recyclePercent: Math.min(recyclePercent, 100),
      allMoneyOut: moneyLeftIn <= 0,
      surplus: moneyLeftIn < 0 ? Math.abs(moneyLeftIn) : 0,
      monthlyMortgage,
      monthlyCashFlow,
      annualCashFlow,
      equityCreated,
      roiOnCash,
      grossYield,
      equityGain: afterRepairValue - purchasePrice,
      addedValue: afterRepairValue - purchasePrice - refurbCost,
    };
  }, [purchasePrice, refurbCost, purchaseCosts, afterRepairValue, refinanceLTV, refinanceRate, monthlyRent, monthlyExpenses]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <h3 className="font-bold text-navy-800 text-lg border-b border-navy-100 pb-2">BUY</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1">Purchase Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
              <input type="number" step={1000} value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-navy-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1">Purchase Costs</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
              <input type="number" step={500} value={purchaseCosts} onChange={(e) => setPurchaseCosts(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-navy-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>
        </div>

        <h3 className="font-bold text-navy-800 text-lg border-b border-navy-100 pb-2 pt-2">REFURBISH</h3>
        <div>
          <label className="block text-xs font-semibold text-navy-600 mb-1">Refurbishment Cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
            <input type="number" step={1000} value={refurbCost} onChange={(e) => setRefurbCost(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-navy-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy-600 mb-1">After Repair Value (ARV)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
            <input type="number" step={5000} value={afterRepairValue} onChange={(e) => setAfterRepairValue(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-navy-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
        </div>

        <h3 className="font-bold text-navy-800 text-lg border-b border-navy-100 pb-2 pt-2">RENT</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1">Monthly Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
              <input type="number" step={25} value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-navy-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1">Monthly Expenses</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
              <input type="number" step={25} value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-navy-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </div>
        </div>

        <h3 className="font-bold text-navy-800 text-lg border-b border-navy-100 pb-2 pt-2">REFINANCE</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1">LTV ({refinanceLTV}%)</label>
            <input type="range" min={50} max={85} step={1} value={refinanceLTV} onChange={(e) => setRefinanceLTV(Number(e.target.value))} className="w-full accent-gold-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-600 mb-1">Rate ({refinanceRate}%)</label>
            <input type="range" min={2} max={10} step={0.1} value={refinanceRate} onChange={(e) => setRefinanceRate(Number(e.target.value))} className="w-full accent-gold-500" />
          </div>
        </div>
      </div>

      <div>
        {/* Hero Result */}
        <div className={`rounded-2xl p-8 text-white mb-6 ${results.allMoneyOut ? "bg-gradient-to-br from-green-700 to-green-900" : "bg-gradient-to-br from-navy-800 to-navy-900"}`}>
          {results.allMoneyOut ? (
            <>
              <p className="text-green-200 text-sm mb-1">All Money Out + Surplus</p>
              <p className="text-4xl font-bold text-white mb-1">{fmt(results.surplus)}</p>
              <p className="text-green-200 text-sm">You recycle 100% of your capital and get {fmt(results.surplus)} back!</p>
            </>
          ) : (
            <>
              <p className="text-navy-200 text-sm mb-1">Money Left In Deal</p>
              <p className="text-4xl font-bold text-gold-400 mb-1">{fmt(results.moneyLeftIn)}</p>
              <p className="text-navy-300 text-sm">{results.recyclePercent.toFixed(0)}% of capital recycled</p>
            </>
          )}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-70">Monthly Cash Flow</p>
              <p className={`font-bold text-lg ${results.monthlyCashFlow >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(results.monthlyCashFlow)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-70">Equity Created</p>
              <p className="font-bold text-lg">{fmt(results.equityCreated)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-70">ROI on Cash</p>
              <p className="font-bold text-lg">{results.roiOnCash === Infinity ? "∞" : results.roiOnCash.toFixed(1) + "%"}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs opacity-70">Gross Yield</p>
              <p className="font-bold text-lg">{results.grossYield.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Deal Summary */}
        <div className="bg-white rounded-xl border border-navy-100 p-6">
          <h4 className="font-bold text-navy-800 mb-4">Deal Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1"><span className="text-navy-600">Purchase Price</span><span className="font-semibold">{fmt(purchasePrice)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">+ Refurbishment</span><span className="font-semibold">{fmt(refurbCost)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">+ Purchase Costs</span><span className="font-semibold">{fmt(purchaseCosts)}</span></div>
            <div className="flex justify-between py-2 border-t border-navy-200 font-bold"><span>Total Invested</span><span>{fmt(results.totalInvested)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">After Repair Value</span><span className="font-semibold text-green-600">{fmt(afterRepairValue)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">Value Added</span><span className="font-semibold text-green-600">{fmt(results.addedValue)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">Refinance Amount</span><span className="font-semibold">{fmt(results.refinanceAmount)}</span></div>
            <div className="flex justify-between py-1"><span className="text-navy-600">Monthly Mortgage</span><span className="font-semibold">{fmt(results.monthlyMortgage)}</span></div>
          </div>
        </div>
        <ShareResults
          title="BRRR Calculator"
          summary={`BRRR deal: ${results.recyclePercent.toFixed(0)}% capital recycled, £${Math.round(results.monthlyCashFlow).toLocaleString("en-GB")}/mo cash flow, ${results.grossYield.toFixed(1)}% yield`}
        />
      </div>
    </div>
  );
}
