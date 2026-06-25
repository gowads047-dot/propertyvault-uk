"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">Personal Name vs Limited Company — The Tax Difference Explained</h2>
          <p>Since Section 24 removed mortgage interest relief for individual landlords, buying through a Special Purpose Vehicle (SPV) limited company has become significantly more tax-efficient for higher-rate taxpayers. A company pays 25% corporation tax on net profit and deducts mortgage interest in full — an individual higher-rate taxpayer pays 40% on gross rental income with only a 20% credit on mortgage interest.</p>
          <p>The tax saving can be substantial. A landlord with £50,000 rental income and £20,000 mortgage interest saves over £6,000/year via a company structure. But it's not free — setup costs, accountancy, and tax implications of transferring existing properties all need factoring in.</p>
          <h3 className="font-bold text-navy-800">The Hidden Costs of Company Ownership</h3>
          <p>Additional accountancy: £500-£2,000/year. BTL mortgages for limited companies typically carry higher rates and fewer lender options. Extracting profit as salary or dividends creates personal tax liability — the company tax saving is partly offset here. Transferring existing personally-owned properties to a company triggers SDLT at the 3% surcharge rate plus CGT on any gains since purchase.</p>
          <h3 className="font-bold text-navy-800">When Does a Limited Company Make Sense?</h3>
          <p>A company structure typically makes sense if: you're a higher or additional-rate taxpayer, you're buying new properties (not transferring existing ones), you intend to retain profit within the company, and you're building a portfolio of 5+ properties long-term. For basic-rate taxpayers with 1-2 properties, admin costs often outweigh the tax benefit.</p>
          <h3 className="font-bold text-navy-800">Always Get Professional Advice</h3>
          <p>This decision depends heavily on your individual tax position, existing portfolio, income sources, and long-term goals. This calculator illustrates the structural difference — but consult a property-specialist accountant before acting. The cost of advice (£200-£500) is trivial compared to the potential tax implications of the wrong structure.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/section-24" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Section 24</p><p className="text-xs text-navy-400 mt-0.5">Personal tax</p></Link>
              <Link href="/calculators/capital-gains-tax" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">CGT Calculator</p><p className="text-xs text-navy-400 mt-0.5">Tax on sale</p></Link>
              <Link href="/calculators/remortgage" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Remortgage</p><p className="text-xs text-navy-400 mt-0.5">Extract equity</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/personal-vs-limited-company" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Personal vs Ltd Company</p></Link>
              <Link href="/blog/section-24-explained" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Section 24 Explained</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}