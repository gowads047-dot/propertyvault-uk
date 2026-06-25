"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function Section24Page() {
  const [rentalIncome, setRentalIncome] = useState(12000);
  const [mortgageInterest, setMortgageInterest] = useState(6000);
  const [allowableExpenses, setAllowableExpenses] = useState(2000);
  const [otherIncome, setOtherIncome] = useState(35000);
  const [taxBand, setTaxBand] = useState(40);

  const results = useMemo(() => {
    const profit = rentalIncome - allowableExpenses;
    const oldTaxableProfit = rentalIncome - allowableExpenses - mortgageInterest;
    const oldTax = Math.max(0, oldTaxableProfit * (taxBand / 100));
    const newTaxableProfit = rentalIncome - allowableExpenses;
    const newTaxBeforeCredit = newTaxableProfit * (taxBand / 100);
    const taxCredit = mortgageInterest * 0.20;
    const newTax = Math.max(0, newTaxBeforeCredit - taxCredit);
    const extraTax = newTax - oldTax;
    const effectiveRate = rentalIncome > 0 ? (newTax / profit * 100) : 0;
    const netIncomeOld = profit + mortgageInterest - oldTax - mortgageInterest;
    const netIncomeNew = profit - newTax;

    return { profit, oldTaxableProfit, oldTax, newTaxableProfit, newTaxBeforeCredit, taxCredit, newTax, extraTax, effectiveRate, netIncomeOld, netIncomeNew };
  }, [rentalIncome, mortgageInterest, allowableExpenses, taxBand]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Section 24 Tax Calculator</h1>
          <p className="text-navy-200 max-w-2xl">See how Section 24 (mortgage interest restriction) affects your tax bill as a landlord. Compare old rules vs current rules and calculate the additional tax you pay.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="bg-navy-50 rounded-xl p-4 text-sm text-navy-600">
                <strong>What is Section 24?</strong> Since April 2020, individual landlords can no longer deduct mortgage interest from rental income. Instead, you receive a 20% tax credit on your mortgage interest. This means higher-rate (40%) and additional-rate (45%) taxpayers pay significantly more tax on their rental income.
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Rental Income</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={rentalIncome} onChange={(e) => setRentalIncome(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Mortgage Interest</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={mortgageInterest} onChange={(e) => setMortgageInterest(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Other Allowable Expenses (insurance, repairs, agent fees)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={allowableExpenses} onChange={(e) => setAllowableExpenses(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Your Tax Band</label>
                <select value={taxBand} onChange={(e) => setTaxBand(Number(e.target.value))} className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option value={20}>20% — Basic rate (£12,571 - £50,270)</option>
                  <option value={40}>40% — Higher rate (£50,271 - £125,140)</option>
                  <option value={45}>45% — Additional rate (over £125,140)</option>
                </select>
              </div>
            </div>

            <div>
              <div className={`rounded-2xl p-8 text-white mb-6 ${results.extraTax > 0 ? "bg-gradient-to-br from-red-700 to-red-900" : "bg-gradient-to-br from-green-700 to-green-900"}`}>
                <p className="text-sm opacity-80 mb-1">Additional Tax Due to Section 24</p>
                <p className="text-4xl font-bold mb-1">{results.extraTax > 0 ? "+" : ""}{fmt(results.extraTax)}</p>
                <p className="text-sm opacity-80">{results.extraTax > 0 ? "per year more than the old rules" : "Section 24 has no additional impact at basic rate"}</p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Tax (old rules)</p><p className="font-bold text-lg">{fmt(results.oldTax)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Tax (current rules)</p><p className="font-bold text-lg">{fmt(results.newTax)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">20% Tax Credit</p><p className="font-bold text-lg text-green-300">-{fmt(results.taxCredit)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Effective Tax Rate</p><p className="font-bold text-lg">{results.effectiveRate.toFixed(1)}%</p></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-navy-100 p-6">
                <h4 className="font-bold text-navy-800 mb-3">Before vs After Section 24</h4>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-navy-600 text-xs uppercase">Old Rules (pre-2020)</p>
                  <div className="flex justify-between"><span className="text-navy-600">Rental income</span><span>{fmt(rentalIncome)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less expenses</span><span>-{fmt(allowableExpenses)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less mortgage interest</span><span>-{fmt(mortgageInterest)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span>Taxable profit</span><span className="font-bold">{fmt(results.oldTaxableProfit)}</span></div>
                  <div className="flex justify-between"><span>Tax at {taxBand}%</span><span className="font-bold">{fmt(results.oldTax)}</span></div>

                  <p className="font-semibold text-navy-600 text-xs uppercase mt-4">Current Rules (Section 24)</p>
                  <div className="flex justify-between"><span className="text-navy-600">Rental income</span><span>{fmt(rentalIncome)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less expenses (no mortgage)</span><span>-{fmt(allowableExpenses)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span>Taxable profit</span><span className="font-bold">{fmt(results.newTaxableProfit)}</span></div>
                  <div className="flex justify-between"><span>Tax at {taxBand}%</span><span>{fmt(results.newTaxBeforeCredit)}</span></div>
                  <div className="flex justify-between text-green-600"><span>Less 20% tax credit</span><span>-{fmt(results.taxCredit)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span>Tax payable</span><span className="font-bold">{fmt(results.newTax)}</span></div>
                </div>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 mt-4 text-sm text-navy-600">
                <strong>SPV Solution:</strong> Limited company (SPV) structures are not affected by Section 24. Companies can still deduct mortgage interest in full and pay corporation tax (25%) on the net profit. If Section 24 significantly impacts you, consult an accountant about whether an SPV structure would be beneficial.
              </div>
            </div>
          </div>
          <Disclaimer type="tax" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">What is Section 24 and Why Does It Matter?</h2>
          <p>Section 24 of the Finance Act 2015 — commonly called the "landlord tax" — phased out the ability for individual buy-to-let landlords to deduct mortgage interest from rental income before calculating tax. It was fully in force from April 2020. Before Section 24, a landlord earning £12,000 in rent with £6,000 in mortgage interest only paid tax on £6,000. Now, they pay tax on the full £12,000 and receive a 20% tax credit on the interest instead.</p>
          <p>For basic-rate (20%) taxpayers the maths roughly balances out. For higher-rate (40%) and additional-rate (45%) taxpayers, the effective tax rate on rental profit can exceed 100% — meaning some landlords now make a loss after tax on properties that were previously profitable.</p>
          <h3 className="font-bold text-navy-800">Who Is Affected?</h3>
          <p>Only <strong>individual landlords</strong> are affected. Limited companies (SPVs) can still deduct mortgage interest in full and pay corporation tax at 25% on net profit. This is why so many landlords have incorporated in recent years, though the costs and tax implications of transferring existing properties into a company need careful consideration.</p>
          <h3 className="font-bold text-navy-800">What Counts as Mortgage Interest?</h3>
          <p>The restriction applies to mortgage interest only — not capital repayment. It also covers interest on loans taken out to purchase furnishings for the property. Arrangement fees, legal fees, and other finance costs are also restricted under the same rules.</p>
          <h3 className="font-bold text-navy-800">Can Section 24 Push You Into a Higher Tax Band?</h3>
          <p>Yes. Because you now declare the full rental income (before mortgage interest) on your self-assessment return, this can push your total income into the higher-rate band even if your actual cash profit is modest. This is one of the most damaging aspects for landlords with large mortgages relative to rental income.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/personal-vs-ltd" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Personal vs Ltd</p><p className="text-xs text-navy-400 mt-0.5">Compare structures</p></Link>
              <Link href="/calculators/capital-gains-tax" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">CGT Calculator</p><p className="text-xs text-navy-400 mt-0.5">Tax on sale</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Property returns</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/section-24-explained" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Section 24 Explained</p></Link>
              <Link href="/blog/personal-vs-limited-company" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Personal vs Ltd Company</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}