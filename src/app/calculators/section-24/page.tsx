"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { personalAllowance, calcSection24Credit,
  propertyIncomeTaxCost,
} from "@/lib/tax";
import { nonNegative } from "@/lib/inputs";

const faqs = [
  { q: "What is Section 24 of the Finance Act 2015?", a: "Section 24 removed the right for individual buy-to-let landlords to deduct mortgage interest from rental income before calculating tax. It was phased in from 2017 and fully in force since April 2020. Instead of a deduction, landlords now receive a 20% basic rate tax credit on their mortgage interest costs." },
  { q: "Who is affected by Section 24?", a: "Only individual landlords holding property in their personal name are affected. Limited companies (SPVs) can still deduct mortgage interest in full and pay corporation tax on the net profit. Basic-rate taxpayers are largely unaffected by Section 24 — the main impact falls on higher-rate (40%) and additional-rate (45%) taxpayers." },
  { q: "Can Section 24 cause me to pay more tax than I earned in profit?", a: "Yes. Because you declare the full rental income on your self-assessment (before deducting mortgage interest), this can push your apparent income into the higher-rate band even if your actual cash profit is modest or negative. In extreme cases where mortgage interest is high relative to rent, the tax bill can exceed the net rental income." },
  { q: "Does Section 24 apply to limited companies?", a: "No. Section 24 only applies to individual landlords. Limited companies pay corporation tax on net rental profit after deducting mortgage interest, management fees, and all other allowable expenses. This is why many higher-rate landlords have incorporated into SPV structures in recent years." },
  { q: "What expenses can individual landlords still deduct under Section 24?", a: "Individual landlords can still deduct all genuine rental expenses except mortgage interest. Allowable deductions include letting agent fees, buildings and landlord insurance, maintenance and repairs (not improvements), accountancy fees, legal costs for tenancy renewals, ground rent, and service charges. Mortgage interest is restricted to a 20% tax credit only." },
];

function taxBandLabel(income: number): string {
  if (income <= 12_570) return "Below personal allowance";
  if (income <= 50_270) return "Basic rate (20%)";
  if (income <= 100_000) return "Higher rate (40%)";
  if (income < 125_140) return "Higher rate — PA taper (60% effective)";
  return "Additional rate (45%)";
}

export default function Section24Page() {
  const [rentalIncome, setRentalIncome] = useState(12000);
  const [mortgageInterest, setMortgageInterest] = useState(6000);
  const [allowableExpenses, setAllowableExpenses] = useState(2000);
  const [otherIncome, setOtherIncome] = useState(35000);

  const results = useMemo(() => {
    const rentalProfit = rentalIncome - allowableExpenses; // before interest

    // Old rules: mortgage interest was deductible
    const oldTax = propertyIncomeTaxCost(otherIncome, Math.max(0, rentalProfit - mortgageInterest));

    // New rules (Section 24): no interest deduction, 20% credit with 3-way cap
    const newTotalIncome = otherIncome + rentalProfit; // full profit added to other income
    const pa = personalAllowance(newTotalIncome);
    const newTaxBeforeCredit = propertyIncomeTaxCost(otherIncome, rentalProfit);
    const taxCredit = calcSection24Credit(mortgageInterest, rentalProfit, newTotalIncome, pa);
    const newTax = Math.max(0, newTaxBeforeCredit - taxCredit);
    const extraTax = newTax - oldTax;

    const netIncomeOld = rentalProfit - oldTax - mortgageInterest;
    const netIncomeNew = rentalProfit - newTax - mortgageInterest;
    const effectiveRate = rentalProfit > 0 ? (newTax / rentalProfit) * 100 : 0;

    return {
      rentalProfit,
      oldTax,
      newTaxBeforeCredit,
      taxCredit,
      newTax,
      extraTax,
      netIncomeOld,
      netIncomeNew,
      effectiveRate,
      taxBand: taxBandLabel(newTotalIncome),
    };
  }, [rentalIncome, mortgageInterest, allowableExpenses, otherIncome]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Section 24 Impact" }]} />
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
                <strong>What is Section 24?</strong> Since April 2020, individual landlords can no longer deduct mortgage interest from rental income. Instead, you receive a 20% basic-rate tax credit on your mortgage interest. This means higher-rate (40%) and additional-rate (45%) taxpayers pay significantly more tax on their rental income.
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Rental Income</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Annual Rental Income" type="number" min="0" value={rentalIncome} onChange={e => setRentalIncome(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Mortgage Interest</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Annual Mortgage Interest" type="number" min="0" value={mortgageInterest} onChange={e => setMortgageInterest(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Other Allowable Expenses (insurance, repairs, agent fees)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Other Allowable Expenses (insurance, repairs, agent fees)" type="number" min="0" value={allowableExpenses} onChange={e => setAllowableExpenses(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">
                  Other Annual Income <span className="font-normal text-navy-400">(salary, pension, other)</span>
                </label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Other annual income in pounds" type="number" min="0" value={otherIncome} onChange={e => setOtherIncome(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <p className="text-xs text-navy-400 mt-1">Your tax band is computed automatically — <strong className="text-navy-600">{results.taxBand}</strong></p>
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
                  <div className="flex justify-between border-t pt-1"><span>Taxable rental profit</span><span className="font-bold">{fmt(Math.max(0, results.rentalProfit - mortgageInterest))}</span></div>
                  <div className="flex justify-between"><span>Tax on property income</span><span className="font-bold">{fmt(results.oldTax)}</span></div>

                  <p className="font-semibold text-navy-600 text-xs uppercase mt-4">Current Rules (Section 24)</p>
                  <div className="flex justify-between"><span className="text-navy-600">Rental income</span><span>{fmt(rentalIncome)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less expenses (no mortgage)</span><span>-{fmt(allowableExpenses)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span>Taxable rental profit</span><span className="font-bold">{fmt(results.rentalProfit)}</span></div>
                  <div className="flex justify-between"><span>Tax before credit</span><span>{fmt(results.newTaxBeforeCredit)}</span></div>
                  <div className="flex justify-between text-green-600"><span>Less 20% tax credit (3-way cap)</span><span>-{fmt(results.taxCredit)}</span></div>
                  <div className="flex justify-between border-t pt-1"><span>Tax payable on property</span><span className="font-bold">{fmt(results.newTax)}</span></div>
                </div>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 mt-4 text-sm text-navy-600">
                <strong>Net Income Comparison:</strong> Old rules: <strong>{fmt(results.netIncomeOld)}/yr</strong> &rarr; Current rules: <strong>{fmt(results.netIncomeNew)}/yr</strong>.
                Tax calculated using HMRC income tax bands — marginal tax on property income only, not total personal tax liability.{" "}
                <a href="https://www.gov.uk/guidance/changes-to-tax-relief-for-residential-landlords-how-its-worked-out-including-case-studies" target="_blank" rel="noopener noreferrer" className="underline text-navy-500">HMRC Section 24 guidance →</a>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 mt-4 text-sm text-navy-600">
                <strong>SPV Solution:</strong> Limited company (SPV) structures are not affected by Section 24. Companies can still deduct mortgage interest in full and pay corporation tax on the net profit. If Section 24 significantly impacts you, consult an accountant about whether an SPV structure would be beneficial.
              </div>
            </div>
          </div>
          <div className="mt-8"><EmailResults /></div>
          <ShareResults title="Section 24 Tax Calculator" summary={`Section 24: ${fmt(results.extraTax)} extra tax/yr, net income ${fmt(results.netIncomeNew)}/yr (was ${fmt(results.netIncomeOld)}/yr before S24)`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="tax" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">What is Section 24 and Why Does It Matter?</h2>
          <p>Section 24 of the Finance Act 2015 — commonly called the "landlord tax" — phased out the ability for individual buy-to-let landlords to deduct mortgage interest from rental income before calculating tax. It was fully in force from April 2020. Before Section 24, a landlord earning £12,000 in rent with £6,000 in mortgage interest only paid tax on £6,000. Now, they pay tax on the full £12,000 and receive a 20% tax credit on the interest instead.</p>
          <p>For basic-rate (20%) taxpayers the maths roughly balances out. For higher-rate (40%) and additional-rate (45%) taxpayers, the effective tax rate on rental profit can exceed 100% — meaning some landlords now make a loss after tax on properties that were previously profitable.</p>
          <h3 className="font-bold text-navy-800">The Three-Way Credit Cap</h3>
          <p>The Section 24 credit is not simply 20% of your mortgage interest. HMRC caps it at the lowest of: your mortgage interest, your net rental profit, or your taxable income above the personal allowance. This prevents landlords with near-zero taxable income from claiming a credit that exceeds their actual tax liability.</p>
          <h3 className="font-bold text-navy-800">Who Is Affected?</h3>
          <p>Only <strong>individual landlords</strong> are affected. Limited companies (SPVs) can still deduct mortgage interest in full and pay corporation tax on net profit. This is why so many landlords have incorporated in recent years, though the costs and tax implications of transferring existing properties into a company need careful consideration.</p>
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
