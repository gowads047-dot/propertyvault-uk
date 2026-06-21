"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function RentVsBuyPage() {
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [depositPct, setDepositPct] = useState(10);
  const [mortgageRate, setMortgageRate] = useState(5.5);
  const [term, setTerm] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [annualGrowth, setAnnualGrowth] = useState(3);
  const [annualRentIncrease, setAnnualRentIncrease] = useState(4);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const depositAmt = propertyPrice * (depositPct / 100);
    const loan = propertyPrice - depositAmt;
    const monthlyRate = mortgageRate / 100 / 12;
    const totalPayments = term * 12;
    const monthlyMortgage = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const monthlyOwnerCosts = 150; // insurance, maintenance average
    const totalMonthlyBuying = monthlyMortgage + monthlyOwnerCosts;

    let totalRentPaid = 0;
    let currentRent = monthlyRent;
    for (let y = 0; y < years; y++) {
      totalRentPaid += currentRent * 12;
      currentRent *= (1 + annualRentIncrease / 100);
    }

    let totalBuyingCost = depositAmt + (propertyPrice * 0.03); // stamp duty estimate + fees
    totalBuyingCost += totalMonthlyBuying * 12 * years;

    const futureValue = propertyPrice * Math.pow(1 + annualGrowth / 100, years);
    const equityGained = futureValue - loan; // simplified
    const netCostBuying = totalBuyingCost - equityGained;
    const buyingIsCheaper = netCostBuying < totalRentPaid;

    return {
      depositAmt, loan, monthlyMortgage, totalMonthlyBuying,
      monthlyRent, finalMonthlyRent: monthlyRent * Math.pow(1 + annualRentIncrease / 100, years),
      totalRentPaid, totalBuyingCost, futureValue, equityGained,
      netCostBuying, buyingIsCheaper,
      savingAmount: Math.abs(totalRentPaid - netCostBuying),
    };
  }, [propertyPrice, depositPct, mortgageRate, term, monthlyRent, annualGrowth, annualRentIncrease, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Rent vs Buy Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Is it cheaper to rent or buy? Compare the total cost of renting versus buying over time, factoring in capital growth, rent increases, and ownership costs.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Buying Scenario</h3>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Property Price</label>
                <input type="range" min={100000} max={1000000} step={5000} value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} className="w-full accent-gold-500" />
                <p className="text-center font-bold text-navy-800">{fmt(propertyPrice)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Deposit ({depositPct}%)</label><input type="range" min={5} max={40} step={1} value={depositPct} onChange={(e) => setDepositPct(Number(e.target.value))} className="w-full accent-gold-500" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Mortgage Rate ({mortgageRate}%)</label><input type="range" min={2} max={8} step={0.1} value={mortgageRate} onChange={(e) => setMortgageRate(Number(e.target.value))} className="w-full accent-gold-500" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Annual Property Growth ({annualGrowth}%)</label><input type="range" min={0} max={8} step={0.5} value={annualGrowth} onChange={(e) => setAnnualGrowth(Number(e.target.value))} className="w-full accent-gold-500" /></div>

              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Renting Scenario</h3>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Current Monthly Rent</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Annual Rent Increase ({annualRentIncrease}%)</label><input type="range" min={0} max={10} step={0.5} value={annualRentIncrease} onChange={(e) => setAnnualRentIncrease(Number(e.target.value))} className="w-full accent-gold-500" /></div>

              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Comparison Period</h3>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Compare over {years} years</label><input type="range" min={1} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-gold-500" /></div>
            </div>

            <div>
              <div className={`rounded-2xl p-8 text-white mb-6 ${results.buyingIsCheaper ? "bg-gradient-to-br from-green-700 to-green-900" : "bg-gradient-to-br from-navy-800 to-navy-900"}`}>
                <p className="text-sm opacity-80 mb-1">Over {years} years, it is cheaper to</p>
                <p className="text-4xl font-bold mb-1">{results.buyingIsCheaper ? "BUY" : "RENT"}</p>
                <p className="text-sm opacity-80">by approximately {fmt(results.savingAmount)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-navy-100 p-5">
                  <h4 className="font-bold text-navy-800 text-sm mb-3">Buying</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-navy-600">Monthly mortgage</span><span className="font-semibold">{fmt(results.monthlyMortgage)}</span></div>
                    <div className="flex justify-between"><span className="text-navy-600">+ running costs</span><span className="font-semibold">~£150</span></div>
                    <div className="flex justify-between"><span className="text-navy-600">Total cost ({years}yr)</span><span className="font-semibold">{fmt(results.totalBuyingCost)}</span></div>
                    <div className="flex justify-between text-green-600"><span>Property value in {years}yr</span><span className="font-semibold">{fmt(results.futureValue)}</span></div>
                    <div className="flex justify-between font-bold border-t border-navy-200 pt-2"><span>Net cost</span><span>{fmt(results.netCostBuying)}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-navy-100 p-5">
                  <h4 className="font-bold text-navy-800 text-sm mb-3">Renting</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-navy-600">Current rent</span><span className="font-semibold">{fmt(results.monthlyRent)}/mo</span></div>
                    <div className="flex justify-between"><span className="text-navy-600">Rent in year {years}</span><span className="font-semibold">{fmt(results.finalMonthlyRent)}/mo</span></div>
                    <div className="flex justify-between font-bold border-t border-navy-200 pt-2"><span>Total rent ({years}yr)</span><span>{fmt(results.totalRentPaid)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Equity built</span><span className="font-semibold">£0</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 text-xs text-navy-600">
                <strong>Note:</strong> This is a simplified comparison. Buying costs include an estimate for stamp duty, legal fees, insurance, and maintenance. It does not account for investment returns on a deposit if renting, tax implications, or personal circumstances. Always seek professional financial advice.
              </div>
            </div>
          </div>
          <Disclaimer type="calculator" />
        </div>
      </section>
    </>
  );
}
