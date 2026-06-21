"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function PersonalVsLtdPage() {
  const [rentalIncome, setRentalIncome] = useState(24000);
  const [mortgageInterest, setMortgageInterest] = useState(12000);
  const [expenses, setExpenses] = useState(3000);
  const [personalTaxRate, setPersonalTaxRate] = useState(40);
  const [corpTaxRate] = useState(25);
  const [dividendRate, setDividendRate] = useState(33.75);
  const [extractAll, setExtractAll] = useState(false);

  const results = useMemo(() => {
    const profit = rentalIncome - expenses;

    // Personal: Section 24 applies
    const personalTaxable = profit;
    const personalTaxBeforeCredit = personalTaxable * (personalTaxRate / 100);
    const personalTaxCredit = mortgageInterest * 0.20;
    const personalTax = Math.max(0, personalTaxBeforeCredit - personalTaxCredit);
    const personalNet = profit - personalTax - mortgageInterest;

    // Ltd Company: mortgage interest deductible
    const ltdTaxableProfit = rentalIncome - expenses - mortgageInterest;
    const corpTax = Math.max(0, ltdTaxableProfit * (corpTaxRate / 100));
    const profitAfterCorpTax = ltdTaxableProfit - corpTax;
    const dividendAllowance = 500;
    const taxableDividend = extractAll ? Math.max(0, profitAfterCorpTax - dividendAllowance) : 0;
    const dividendTax = taxableDividend * (dividendRate / 100);
    const ltdTotalTax = corpTax + dividendTax;
    const ltdNet = profitAfterCorpTax - dividendTax;

    const saving = personalTax - ltdTotalTax;
    const ltdBetter = saving > 0;

    return { personalTaxable, personalTax, personalNet, ltdTaxableProfit, corpTax, profitAfterCorpTax, dividendTax, ltdTotalTax, ltdNet, saving, ltdBetter };
  }, [rentalIncome, mortgageInterest, expenses, personalTaxRate, corpTaxRate, dividendRate, extractAll]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Personal vs Limited Company</h1>
          <p className="text-navy-200 max-w-2xl">Should you hold property personally or through an SPV (Special Purpose Vehicle)? Compare the tax implications side by side.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Inputs */}
            <div className="space-y-4">
              <h3 className="font-bold text-navy-800">Property Details</h3>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Annual Rental Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={rentalIncome} onChange={(e) => setRentalIncome(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Annual Mortgage Interest</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={mortgageInterest} onChange={(e) => setMortgageInterest(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Other Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Your Personal Tax Rate</label>
                <select value={personalTaxRate} onChange={(e) => setPersonalTaxRate(Number(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value={20}>20% Basic</option><option value={40}>40% Higher</option><option value={45}>45% Additional</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
                <input type="checkbox" checked={extractAll} onChange={(e) => setExtractAll(e.target.checked)} className="rounded" />
                Extract all profit as dividends
              </label>
            </div>

            {/* Personal */}
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <h3 className="font-bold text-navy-800 mb-1">Personal Ownership</h3>
              <p className="text-xs text-navy-500 mb-4">Section 24 applies</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Rental income</span><span>{fmt(rentalIncome)}</span></div>
                <div className="flex justify-between text-red-600"><span>Expenses</span><span>-{fmt(expenses)}</span></div>
                <div className="flex justify-between border-t pt-1"><span>Taxable (S24)</span><span className="font-bold">{fmt(results.personalTaxable)}</span></div>
                <div className="flex justify-between"><span>Tax at {personalTaxRate}%</span><span>{fmt(results.personalTax)}</span></div>
                <div className="flex justify-between"><span>Less mortgage</span><span className="text-red-600">-{fmt(mortgageInterest)}</span></div>
                <div className="flex justify-between border-t pt-1 font-bold text-lg"><span>Net Income</span><span className={results.personalNet >= 0 ? "text-green-600" : "text-red-600"}>{fmt(results.personalNet)}</span></div>
                <div className="flex justify-between"><span>Total tax</span><span className="font-bold text-red-600">{fmt(results.personalTax)}</span></div>
              </div>
            </div>

            {/* Ltd */}
            <div className={`rounded-xl border-2 p-5 ${results.ltdBetter ? "border-green-400 bg-green-50/30" : "border-navy-100 bg-white"}`}>
              <h3 className="font-bold text-navy-800 mb-1">Limited Company (SPV)</h3>
              <p className="text-xs text-navy-500 mb-4">Mortgage interest deductible</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Rental income</span><span>{fmt(rentalIncome)}</span></div>
                <div className="flex justify-between text-red-600"><span>Expenses + mortgage</span><span>-{fmt(expenses + mortgageInterest)}</span></div>
                <div className="flex justify-between border-t pt-1"><span>Taxable profit</span><span className="font-bold">{fmt(results.ltdTaxableProfit)}</span></div>
                <div className="flex justify-between"><span>Corp tax ({corpTaxRate}%)</span><span>{fmt(results.corpTax)}</span></div>
                {extractAll && <div className="flex justify-between"><span>Dividend tax</span><span>{fmt(results.dividendTax)}</span></div>}
                <div className="flex justify-between border-t pt-1 font-bold text-lg"><span>Net Income</span><span className="text-green-600">{fmt(results.ltdNet)}</span></div>
                <div className="flex justify-between"><span>Total tax</span><span className="font-bold text-red-600">{fmt(results.ltdTotalTax)}</span></div>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className={`mt-6 rounded-xl p-6 text-center ${results.ltdBetter ? "bg-green-50 border border-green-200" : "bg-navy-50 border border-navy-200"}`}>
            <p className="text-lg font-bold text-navy-800">{results.ltdBetter ? `A limited company could save you ${fmt(results.saving)} per year` : `Personal ownership is more tax-efficient by ${fmt(Math.abs(results.saving))} per year`}</p>
            <p className="text-sm text-navy-500 mt-1">{results.ltdBetter ? "Consider consulting an accountant about setting up an SPV" : "At your current tax rate, the additional costs of running a company may not be justified"}</p>
          </div>

          <div className="bg-navy-50 rounded-xl p-4 mt-4 text-xs text-navy-600">
            <strong>Important:</strong> This is a simplified comparison. Ltd companies have additional costs (accountant fees £500-1,500/year, Companies House filing £13/year, confirmation statements) and different mortgage products (often higher rates). CGT treatment also differs. Retained profits in a company are not taxed again until extracted. Always consult a qualified property tax accountant before making a decision.
          </div>

          <Disclaimer type="tax" />
        </div>
      </section>
    </>
  );
}
