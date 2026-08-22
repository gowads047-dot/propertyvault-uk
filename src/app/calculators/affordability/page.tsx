"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { monthlyRepayment, pctOf } from "@/lib/finance";
import { nonNegative } from "@/lib/inputs";

const faqs = [
  { q: "How much can I borrow for a mortgage in the UK?", a: "Most UK lenders cap borrowing at 4-4.5 times your gross annual income. Some lenders go up to 5.5x for high earners or certain professions. The actual amount also depends on a stress test: you must be able to afford repayments if interest rates rose by 3%." },
  { q: "Does a joint mortgage increase how much I can borrow?", a: "Yes. Joint applications combine both applicants' incomes, which directly increases the income multiple and therefore the maximum loan. The lender will also assess both applicants' credit histories and existing financial commitments." },
  { q: "What deposit do I need to get a mortgage?", a: "The minimum deposit for most residential mortgages is 5% of the purchase price. A 10% deposit gives access to more products and better rates, while 15-20%+ unlocks the best available rates and the widest choice of lenders." },
  { q: "What is a mortgage-to-income ratio and what is a good level?", a: "Your mortgage-to-income ratio is your monthly repayment as a percentage of gross monthly income. Most lenders prefer this below 35%. Below 28% is considered comfortable; above 40% and many mainstream lenders will decline. Lower is always better for long-term financial resilience." },
  { q: "Does my credit score affect how much I can borrow?", a: "Yes. A poor credit score can reduce the amount lenders are willing to offer or lead to outright refusal. It also affects the interest rates available — a lower score typically means higher rates, which affects the monthly payment and lender stress test calculations." },
];

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
    const monthlyPayment = monthlyRepayment(maxBorrowing, rate, term);
    const monthlyIncome = totalIncome / 12;
    const affordabilityRatio = pctOf(monthlyPayment, monthlyIncome);
    const disposableAfterMortgage = monthlyIncome - monthlyPayment - monthlyDebts;
    const ltv = maxProperty > 0 ? ((maxBorrowing / maxProperty) * 100) : 0;

    return { totalIncome, maxBorrowing, maxProperty, monthlyPayment, monthlyIncome, affordabilityRatio, disposableAfterMortgage, ltv };
  }, [income1, income2, deposit, monthlyDebts, multiplier, rate, term]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Affordability" }]} />
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
                <input aria-label="Your Annual Income (gross)" type="number" min="0" value={income1} onChange={(e) => setIncome1(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Second Applicant Income (if joint, otherwise £0)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Second Applicant Income (if joint, otherwise £0)" type="number" min="0" value={income2} onChange={(e) => setIncome2(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Deposit Available</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Deposit Available" type="number" min="0" value={deposit} onChange={e => setDeposit(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Debt Commitments (loans, credit cards, car finance)</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input aria-label="Monthly Debt Commitments (loans, credit cards, car finance)" type="number" min="0" value={monthlyDebts} onChange={e => setMonthlyDebts(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Income Multiplier ({multiplier}x)</label>
                <input aria-label="Income Multiplier (x)" type="range" min={3} max={5.5} step={0.25} value={multiplier} onChange={e => setMultiplier(nonNegative(e.target.value))} className="w-full accent-gold-500" />
                <div className="flex justify-between text-xs text-navy-500"><span>3x (conservative)</span><span>4.5x (typical)</span><span>5.5x (maximum)</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Interest Rate ({rate}%)</label>
                  <input aria-label="Interest Rate" type="range" min={2} max={8} step={0.1} value={rate} onChange={e => setRate(nonNegative(e.target.value))} className="w-full accent-gold-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Term ({term} years)</label>
                  <input aria-label="Term ( years)" type="range" min={5} max={40} step={1} value={term} onChange={e => setTerm(nonNegative(e.target.value))} className="w-full accent-gold-500" />
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
          <div className="mt-8"><EmailResults /></div>
          <ShareResults title="Mortgage Affordability Calculator" summary={`Affordability: can borrow ${fmt(results.maxBorrowing)}, property up to ${fmt(results.maxProperty)}, ${fmt(results.monthlyPayment)}/mo repayment`} />
          <FAQSchema faqs={faqs} />
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
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/remortgage" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Remortgage Savings</p><p className="text-xs text-navy-400 mt-0.5">Switch & save</p></Link>
              <Link href="/calculators/rent-vs-buy" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rent vs Buy</p><p className="text-xs text-navy-400 mt-0.5">Compare options</p></Link>
              <Link href="/calculators/moving-costs" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Moving Costs</p><p className="text-xs text-navy-400 mt-0.5">Total cost</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/first-time-buyer-guide" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">First Time Buyer Guide</p></Link>
              <Link href="/blog/stamp-duty-guide" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Stamp Duty Guide</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}