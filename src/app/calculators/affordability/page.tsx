"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function AffordabilityPage() {
  const [income1, setIncome1] = useState(35000);
  const [income2, setIncome2] = useState(0);
  const [deposit, setDeposit] = useState(25000);
  const [monthlyDebts, setMonthlyDebts] = useState(200);
  const [multiplier, setMultiplier] = useState(4.5);
  const [rate, setRate] = useState(5.5);
  const [term, setTerm] = useState(25);

  const results = useMemo(() => {
    const totalIncome = income1 + income2;
    const maxBorrowing = totalIncome * multiplier;
    const maxProperty = maxBorrowing + deposit;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;
    const monthlyPayment = maxBorrowing * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    const monthlyIncome = totalIncome / 12;
    const affordabilityRatio = (monthlyPayment / monthlyIncome) * 100;
    const disposableAfterMortgage = monthlyIncome - monthlyPayment - monthlyDebts;
    const ltv = maxProperty > 0 ? ((maxBorrowing / maxProperty) * 100) : 0;

    return { totalIncome, maxBorrowing, maxProperty, monthlyPayment, monthlyIncome, affordabilityRatio, disposableAfterMortgage, ltv };
  }, [income1, income2, deposit, monthlyDebts, multiplier, rate, term]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Mortgage Affordability Calculator</h1>
          <p className="text-navy-200 max-w-2xl">How much can you borrow? Enter your income, deposit, and outgoings to estimate your maximum mortgage and the property price you could afford.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Your Annual Income (gross)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={income1} onChange={(e) => setIncome1(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Second Applicant Income (if joint, otherwise £0)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={income2} onChange={(e) => setIncome2(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Deposit Available</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Debt Commitments (loans, credit cards, car finance)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Income Multiplier ({multiplier}x)</label>
                <input type="range" min={3} max={5.5} step={0.25} value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="w-full accent-gold-500" />
                <div className="flex justify-between text-xs text-navy-500"><span>3x (conservative)</span><span>4.5x (typical)</span><span>5.5x (maximum)</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Interest Rate ({rate}%)</label>
                  <input type="range" min={2} max={8} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-gold-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Term ({term} years)</label>
                  <input type="range" min={5} max={40} step={1} value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full accent-gold-500" />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
                <p className="text-navy-200 text-sm mb-1">You Could Afford a Property Up To</p>
                <p className="text-4xl md:text-5xl font-bold text-gold-400 mb-6">{fmt(results.maxProperty)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Max Borrowing</p><p className="font-bold text-lg">{fmt(results.maxBorrowing)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Your Deposit</p><p className="font-bold text-lg">{fmt(deposit)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Monthly Payment</p><p className="font-bold text-lg">{fmt(results.monthlyPayment)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">LTV Ratio</p><p className="font-bold text-lg">{results.ltv.toFixed(0)}%</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-navy-100 p-6">
                <h4 className="font-bold text-navy-800 mb-3">Monthly Budget Check</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-600">Gross monthly income</span><span className="font-semibold">{fmt(results.monthlyIncome)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Mortgage payment</span><span>-{fmt(results.monthlyPayment)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Existing debts</span><span>-{fmt(monthlyDebts)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-navy-200 font-bold"><span>Remaining (before tax & bills)</span><span className={results.disposableAfterMortgage >= 0 ? "text-green-600" : "text-red-600"}>{fmt(results.disposableAfterMortgage)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Mortgage-to-income ratio</span><span className={`font-semibold ${results.affordabilityRatio > 35 ? "text-red-600" : results.affordabilityRatio > 28 ? "text-amber-600" : "text-green-600"}`}>{results.affordabilityRatio.toFixed(1)}%</span></div>
                </div>
                <div className={`mt-3 p-3 rounded-lg text-xs ${results.affordabilityRatio > 35 ? "bg-red-50 text-red-700" : results.affordabilityRatio > 28 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                  {results.affordabilityRatio > 35 ? "Your mortgage would be over 35% of gross income. Most lenders prefer this to be under 35%. Consider a lower borrowing amount or longer term." : results.affordabilityRatio > 28 ? "Your mortgage is 28-35% of income. This is acceptable to most lenders but leaves less room for other expenses." : "Your mortgage is under 28% of income. This is a comfortable affordability level."}
                </div>
              </div>
            </div>
          </div>
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">How Do UK Lenders Calculate Mortgage Affordability?</h2>
          <p>UK mortgage lenders use two main tests: an income multiple cap (typically 4-4.5x your annual income, occasionally up to 5.5x for high earners) and a stress test that checks you can still afford repayments if interest rates rise by 3%. The combination of these two tests determines the maximum you can borrow — the lower result of the two wins.</p>
          <p>This calculator applies the income multiple approach. To understand what a lender will actually offer, you'll need a Decision in Principle (DIP) which factors in your credit score, outgoings, employment type, and the specific property.</p>
          <h3 className="font-bold text-navy-800">Mortgage-to-Income Ratio Explained</h3>
          <p>Your mortgage-to-income ratio is your monthly mortgage payment as a percentage of your gross monthly income. Most lenders prefer this to be below 35%, with 28% considered comfortable. Above 40% and you may struggle to find mainstream lenders willing to lend — specialist lenders exist but at higher rates.</p>
          <h3 className="font-bold text-navy-800">What Counts as Income for a Mortgage?</h3>
          <p>Salaried employment income is straightforward. For self-employed applicants, most lenders use the average of the last 2-3 years' net profit or salary + dividends (for company directors). Bonus and commission income is typically included at 50-100% depending on the lender. Rental income from existing properties can usually be included, typically at 125-145% of the gross rent to cover costs.</p>
          <h3 className="font-bold text-navy-800">Buy-to-Let Affordability Is Different</h3>
          <p>Buy-to-let affordability is based primarily on rental income, not your personal income. Lenders typically require the monthly rent to cover 125-145% of the mortgage payment (at a stressed rate of 5-5.5%). Personal income matters mainly for portfolio landlords and for minimum income thresholds (usually £25,000).</p>
        </div>
      </section>
    </>
  );
}
