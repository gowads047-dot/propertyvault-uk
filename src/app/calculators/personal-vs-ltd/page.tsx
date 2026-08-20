"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  personalAllowance,
  calcCorpTax,
  calcDividendTax,
  calcSection24Credit,
  calcTaxSplit,
} from "@/lib/tax";

const faqs = [
  { q: "Should I buy investment property personally or through a limited company?", a: "For higher-rate (40%) and additional-rate (45%) taxpayers buying new properties, a limited company (SPV) is usually more tax-efficient because mortgage interest is fully deductible and corporation tax is lower than personal income tax. For basic-rate taxpayers with one or two properties, the extra accountancy costs often outweigh the tax saving." },
  { q: "What is Section 24 and why does it affect personal landlords?", a: "Section 24 removed the right for individual landlords to deduct mortgage interest from rental income before calculating tax. Instead, a 20% basic rate credit applies. Higher-rate taxpayers pay 40% on the full rental profit (before interest) and only receive a 20% credit — meaning Section 24 can nearly double their effective tax rate." },
  { q: "Can I transfer my existing buy-to-let properties into a limited company?", a: "Yes, but it is expensive. Transferring triggers SDLT at the 5% additional property surcharge on market value, and Capital Gains Tax on any gains since purchase. These costs typically make it uneconomical to transfer existing properties. A company structure is most advantageous when buying new properties from scratch." },
  { q: "What are the extra costs of running a property SPV?", a: "Additional costs include accountancy fees (£500-£2,000 per year), Companies House annual confirmation statement (£34), corporation tax filing, and potentially higher mortgage rates with fewer lender options for limited company BTL. Directors may also need to take personal guarantees on company mortgages." },
  { q: "What tax do I pay when taking money out of a property SPV?", a: "Profit retained in the company is taxed at corporation tax rates (19% for profits up to £50,000, tapering to 25% above £250,000 — limits divided by associated companies). When you extract the profit, additional personal tax applies: dividends are taxed at 8.75% (basic rate), 33.75% (higher rate), or 39.35% (additional rate) above the £500 annual dividend allowance." },
  { q: "What is marginal relief for corporation tax?", a: "For profits between £50,000 and £250,000 (in a standalone company with no associated companies), corporation tax applies at an effective rate between 19% and 25% using a marginal relief formula. If your SPV has associated group companies, these limits are divided equally among all companies — reducing the range in which marginal relief applies." },
];

export default function PersonalVsLtdPage() {
  const [rentalIncome, setRentalIncome] = useState(24000);
  const [mortgageInterest, setMortgageInterest] = useState(12000);
  const [expenses, setExpenses] = useState(3000);
  const [otherIncome, setOtherIncome] = useState(35000);
  const [associatedCompanies, setAssociatedCompanies] = useState(0);
  const [extractAll, setExtractAll] = useState(false);

  const results = useMemo(() => {
    const rentalProfit = rentalIncome - expenses; // net profit before interest

    // ── Personal (Section 24) ─────────────────────────────────────────────
    // Tax on total income with property (other income + full rental profit, no interest deduction)
    const totalIncome = otherIncome + rentalProfit;
    const pa = personalAllowance(totalIncome);
    const totalTax = calcTaxSplit(otherIncome, rentalProfit).total;
    const baseTax = calcTaxSplit(otherIncome, 0).total; // tax on other income alone
    const s24Credit = calcSection24Credit(mortgageInterest, rentalProfit, totalIncome, pa);
    // Marginal tax attributable to property income (after S24 credit)
    const personalTax = Math.max(0, totalTax - baseTax - s24Credit);
    const personalNet = rentalProfit - personalTax - mortgageInterest;

    // ── Limited Company (SPV) ─────────────────────────────────────────────
    const ltdTaxableProfit = Math.max(0, rentalProfit - mortgageInterest);
    const corpTax = calcCorpTax(ltdTaxableProfit, associatedCompanies);
    const profitAfterCorpTax = ltdTaxableProfit - corpTax;

    // Effective CT rate for display
    const ctEffectiveRate = ltdTaxableProfit > 0 ? (corpTax / ltdTaxableProfit) * 100 : 19;

    const dividendTax = extractAll
      ? calcDividendTax(profitAfterCorpTax, otherIncome)
      : 0;
    const ltdTotalTax = corpTax + dividendTax;
    const ltdNet = profitAfterCorpTax - dividendTax;

    const saving = personalTax - ltdTotalTax;
    const ltdBetter = saving > 0;

    return {
      personalTax,
      personalNet,
      ltdTaxableProfit,
      corpTax,
      ctEffectiveRate,
      profitAfterCorpTax,
      dividendTax,
      ltdTotalTax,
      ltdNet,
      saving,
      ltdBetter,
      s24Credit,
    };
  }, [rentalIncome, mortgageInterest, expenses, otherIncome, associatedCompanies, extractAll]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const pct = (n: number) => n.toFixed(1) + "%";

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Personal vs Ltd Company" }]} />
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
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Other Allowable Expenses</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>

              <div className="border-t border-navy-100 pt-4">
                <h3 className="font-bold text-navy-800 mb-3">Your Tax Position</h3>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Other Annual Income <span className="font-normal text-navy-400">(salary, pension, etc.)</span></label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={otherIncome} onChange={(e) => setOtherIncome(Number(e.target.value))} className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div><p className="text-xs text-navy-400 mt-1">Used to compute your marginal tax band and Section 24 credit</p></div>
                <div className="mt-3"><label className="block text-xs font-semibold text-navy-700 mb-1">Associated Companies <span className="font-normal text-navy-400">(other group companies)</span></label><input type="number" min={0} max={9} value={associatedCompanies} onChange={(e) => setAssociatedCompanies(Number(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /><p className="text-xs text-navy-400 mt-1">Divides the CT thresholds (0 for a standalone SPV)</p></div>
              </div>

              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
                <input type="checkbox" checked={extractAll} onChange={(e) => setExtractAll(e.target.checked)} className="rounded" />
                Extract all profit as dividends
              </label>
            </div>

            {/* Personal */}
            <div className="bg-white rounded-xl border border-navy-100 p-5">
              <h3 className="font-bold text-navy-800 mb-1">Personal Ownership</h3>
              <p className="text-xs text-navy-500 mb-4">Section 24 applies — marginal tax on property income</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Rental income</span><span>{fmt(rentalIncome)}</span></div>
                <div className="flex justify-between text-red-600"><span>Expenses</span><span>-{fmt(expenses)}</span></div>
                <div className="flex justify-between border-t pt-1"><span>Taxable (S24 — no interest deduction)</span><span className="font-bold">{fmt(rentalIncome - expenses)}</span></div>
                <div className="flex justify-between text-green-700"><span>Section 24 credit (20%)</span><span>-{fmt(results.s24Credit)}</span></div>
                <div className="flex justify-between"><span>Tax on property income</span><span>{fmt(results.personalTax)}</span></div>
                <div className="flex justify-between text-red-600"><span>Less mortgage interest</span><span>-{fmt(mortgageInterest)}</span></div>
                <div className="flex justify-between border-t pt-1 font-bold text-lg"><span>Net Income</span><span className={results.personalNet >= 0 ? "text-green-600" : "text-red-600"}>{fmt(results.personalNet)}</span></div>
                <div className="flex justify-between"><span>Total tax</span><span className="font-bold text-red-600">{fmt(results.personalTax)}</span></div>
              </div>
            </div>

            {/* Ltd */}
            <div className={`rounded-xl border-2 p-5 ${results.ltdBetter ? "border-green-400 bg-green-50/30" : "border-navy-100 bg-white"}`}>
              <h3 className="font-bold text-navy-800 mb-1">Limited Company (SPV)</h3>
              <p className="text-xs text-navy-500 mb-4">Mortgage interest deductible · CT at {pct(results.ctEffectiveRate)}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Rental income</span><span>{fmt(rentalIncome)}</span></div>
                <div className="flex justify-between text-red-600"><span>Expenses + mortgage</span><span>-{fmt(expenses + mortgageInterest)}</span></div>
                <div className="flex justify-between border-t pt-1"><span>Taxable profit</span><span className="font-bold">{fmt(results.ltdTaxableProfit)}</span></div>
                <div className="flex justify-between"><span>Corp tax ({pct(results.ctEffectiveRate)})</span><span>{fmt(results.corpTax)}</span></div>
                {extractAll && <div className="flex justify-between"><span>Dividend tax</span><span>{fmt(results.dividendTax)}</span></div>}
                <div className="flex justify-between border-t pt-1 font-bold text-lg"><span>Net Income</span><span className="text-green-600">{fmt(results.ltdNet)}</span></div>
                <div className="flex justify-between"><span>Total tax</span><span className="font-bold text-red-600">{fmt(results.ltdTotalTax)}</span></div>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className={`mt-6 rounded-xl p-6 text-center ${results.ltdBetter ? "bg-green-50 border border-green-200" : "bg-navy-50 border border-navy-200"}`}>
            <p className="text-lg font-bold text-navy-800">{results.ltdBetter ? `A limited company could save you ${fmt(results.saving)} per year on this property` : `Personal ownership is more tax-efficient by ${fmt(Math.abs(results.saving))} per year`}</p>
            <p className="text-sm text-navy-500 mt-1">{results.ltdBetter ? "Consider consulting an accountant about setting up an SPV — savings compound significantly across a portfolio" : "At your income level, additional company admin costs may not be justified for a single property"}</p>
          </div>

          <div className="bg-navy-50 rounded-xl p-4 mt-4 text-xs text-navy-600">
            <strong>Important:</strong> This shows the marginal tax on property income only — it does not model your total personal tax bill. Ltd companies have additional costs (accountancy £500–1,500/year, Companies House £34/year) and often higher mortgage rates. CGT treatment also differs on disposal. Retained company profits are not taxed again until extracted. Always consult a qualified property tax accountant before making a decision.
            {" "}<a href="https://www.gov.uk/guidance/corporation-tax-marginal-relief" target="_blank" rel="noopener noreferrer" className="underline text-navy-500">CT marginal relief — GOV.UK</a>
          </div>

          <div className="mt-6"><EmailResults /></div>
          <ShareResults title="Personal vs Limited Company BTL Calculator" summary={`Personal: ${fmt(results.personalNet)}/yr net vs Ltd: ${fmt(results.ltdNet)}/yr net — ${results.ltdBetter ? `Ltd saves ${fmt(results.saving)}/yr` : `personal saves ${fmt(-results.saving)}/yr`}`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="tax" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">Personal Name vs Limited Company — The Tax Difference Explained</h2>
          <p>Since Section 24 removed mortgage interest relief for individual landlords, buying through a Special Purpose Vehicle (SPV) limited company has become significantly more tax-efficient for higher-rate taxpayers. A company pays corporation tax on net profit and deducts mortgage interest in full — an individual higher-rate taxpayer pays 40% on gross rental income with only a 20% credit on mortgage interest.</p>
          <p>The tax saving can be substantial. A landlord with £50,000 rental income and £20,000 mortgage interest saves over £6,000/year via a company structure. But it's not free — setup costs, accountancy, and tax implications of transferring existing properties all need factoring in.</p>
          <h3 className="font-bold text-navy-800">Corporation Tax — Three Tiers</h3>
          <p>Corporation tax is not a flat 25%. Standalone companies with profits up to £50,000 pay 19%. Profits between £50,000 and £250,000 attract marginal relief — an effective rate between 19% and 25%. Profits above £250,000 pay the full 25%. If your SPV has associated group companies, these limits are divided equally among all companies, which can push a profitable SPV into the 25% band sooner.</p>
          <h3 className="font-bold text-navy-800">When Does a Limited Company Make Sense?</h3>
          <p>A company structure typically makes sense if: you're a higher or additional-rate taxpayer, you're buying new properties (not transferring existing ones), you intend to retain profit within the company, and you're building a portfolio of 5+ properties long-term. For basic-rate taxpayers with 1–2 properties, admin costs often outweigh the tax benefit.</p>
          <h3 className="font-bold text-navy-800">Always Get Professional Advice</h3>
          <p>This decision depends heavily on your individual tax position, existing portfolio, income sources, and long-term goals. This calculator illustrates the structural difference — but consult a property-specialist accountant before acting. The cost of advice (£200–£500) is trivial compared to the potential tax implications of the wrong structure.</p>
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
