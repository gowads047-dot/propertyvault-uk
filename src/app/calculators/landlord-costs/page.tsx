"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { pctOf } from "@/lib/finance";
import { nonNegative } from "@/lib/inputs";

const faqs = [
  { q: "What costs does a UK landlord have to pay?", a: "Landlords are responsible for mortgage payments, buildings insurance, landlord liability insurance, maintenance and repairs, letting agent fees (if used), Gas Safety Certificates (annual), Electrical Installation Condition Reports (every 5 years), EPC renewal (every 10 years), and any HMO licensing fees. Void periods with no rental income are also a recurring cost to budget for." },
  { q: "How much should I budget for maintenance on a rental property?", a: "A common rule of thumb is 1% of the property's value per year for maintenance. On a £150,000 property that's £1,500/year — though spending is lumpy: quiet for several years then a boiler replacement or new kitchen costs £3,000-£10,000 in one go. Older stock costs proportionally more to maintain." },
  { q: "What is the difference between gross yield and net yield?", a: "Gross yield is annual rent divided by property value, expressed as a percentage. Net yield deducts all costs (management fees, insurance, maintenance, voids, compliance) before dividing by property value. Net yield gives a realistic picture of actual returns; gross yield is useful only as a quick comparison tool." },
  { q: "Can I deduct landlord costs from my tax bill?", a: "Yes. Allowable expenses include letting agent fees, insurance premiums, repairs and maintenance (not improvements), accountancy fees, and legal costs for tenancy renewals. Mortgage interest is no longer fully deductible for individual landlords due to Section 24 — only a 20% basic rate tax credit is available." },
  { q: "Do I need landlord insurance separate from buildings insurance?", a: "Yes. Standard buildings insurance does not cover landlord-specific risks such as malicious damage by tenants, loss of rent due to an insured event, or legal expenses for eviction proceedings. Dedicated landlord insurance combines buildings cover with these additional protections and is strongly recommended for all rental properties." },
];

export default function LandlordCostsPage() {
  const [monthlyRent, setMonthlyRent] = useState(950);
  const [mortgagePayment, setMortgagePayment] = useState(600);
  const [insurance, setInsurance] = useState(25);
  const [maintenance, setMaintenance] = useState(80);
  const [managementFee, setManagementFee] = useState(0);
  const [gasSafety, setGasSafety] = useState(7);
  const [eicr, setEicr] = useState(5);
  const [epc, setEpc] = useState(2);
  const [licensing, setLicensing] = useState(0);
  const [accountant, setAccountant] = useState(25);
  const [rentGuarantee, setRentGuarantee] = useState(0);
  const [voidWeeks, setVoidWeeks] = useState(2);
  const [taxRate, setTaxRate] = useState(20);

  const results = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const effectiveRent = annualRent * ((52 - voidWeeks) / 52);
    const totalMonthlyExpenses = mortgagePayment + insurance + maintenance + managementFee + gasSafety + eicr + epc + licensing + accountant + rentGuarantee;
    const annualExpenses = totalMonthlyExpenses * 12;
    const grossProfit = effectiveRent - annualExpenses;
    const taxableIncome = effectiveRent - ((annualExpenses - (mortgagePayment * 12))); // simplified - S24 means mortgage not deductible
    const taxCredit = mortgagePayment * 12 * 0.20; // 20% tax credit on mortgage interest
    const taxBill = Math.max(0, (taxableIncome * (taxRate / 100)) - taxCredit);
    const netProfit = grossProfit - taxBill;
    const monthlyCashFlow = netProfit / 12;

    return {
      annualRent, effectiveRent, totalMonthlyExpenses, annualExpenses,
      grossProfit, taxBill, netProfit, monthlyCashFlow,
      expenseRatio: pctOf(annualExpenses, effectiveRent),
    };
  }, [monthlyRent, mortgagePayment, insurance, maintenance, managementFee, gasSafety, eicr, epc, licensing, accountant, rentGuarantee, voidWeeks, taxRate]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  const costs = [
    { label: "Mortgage Payment", value: mortgagePayment, set: setMortgagePayment },
    { label: "Landlord Insurance", value: insurance, set: setInsurance },
    { label: "Maintenance / Repairs", value: maintenance, set: setMaintenance },
    { label: "Management Agent Fee", value: managementFee, set: setManagementFee },
    { label: "Gas Safety (monthly equiv.)", value: gasSafety, set: setGasSafety },
    { label: "EICR (monthly equiv.)", value: eicr, set: setEicr },
    { label: "EPC (monthly equiv.)", value: epc, set: setEpc },
    { label: "Licensing (monthly equiv.)", value: licensing, set: setLicensing },
    { label: "Accountant", value: accountant, set: setAccountant },
    { label: "Rent Guarantee Insurance", value: rentGuarantee, set: setRentGuarantee },
  ];

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Landlord Costs" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Landlord Cost Calculator</h1>
          <p className="text-navy-200 max-w-2xl">See the real cost of being a landlord. Enter your rental income and every expense to calculate your actual monthly cash flow and annual net profit.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rent (£)</label>
                <input aria-label="Monthly Rent (£)" type="number" min="0" value={monthlyRent} onChange={e => setMonthlyRent(nonNegative(e.target.value))} className="w-full px-4 py-3 border border-navy-200 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Void Weeks/Year ({voidWeeks})</label><input type="range" min={0} max={8} step={1} value={voidWeeks} onChange={e => setVoidWeeks(nonNegative(e.target.value))} className="w-full accent-gold-500" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Tax Rate ({taxRate}%)</label>
                  <select aria-label="Tax Rate" value={taxRate} onChange={e => setTaxRate(nonNegative(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg bg-white text-sm">
                    <option value={0}>0% (non-taxpayer)</option><option value={20}>20% (basic rate)</option><option value={40}>40% (higher rate)</option><option value={45}>45% (additional rate)</option>
                  </select>
                </div>
              </div>
              <h3 className="font-bold text-navy-800 text-sm border-b border-navy-100 pb-2">Monthly Costs (adjust to your figures)</h3>
              <div className="space-y-2">
                {costs.map((c) => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-sm text-navy-700">{c.label}</span>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                    <input type="number" min="0" value={c.value} onChange={(e) => c.set(Number(e.target.value))} className="w-24 pl-7 pr-2 py-1.5 border border-navy-200 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
                <p className="text-navy-200 text-sm mb-1">Monthly Cash Flow</p>
                <p className={`text-4xl font-bold mb-4 ${results.monthlyCashFlow >= 0 ? "text-gold-400" : "text-red-400"}`}>{fmt(results.monthlyCashFlow)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Annual Rent (adj. for voids)</p><p className="font-bold">{fmt(results.effectiveRent)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Annual Expenses</p><p className="font-bold text-red-300">{fmt(results.annualExpenses)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Tax Bill (estimated)</p><p className="font-bold text-red-300">{fmt(results.taxBill)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Annual Net Profit</p><p className={`font-bold ${results.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(results.netProfit)}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Profit &amp; Loss Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-600">Annual rent (gross)</span><span className="font-semibold">{fmt(results.annualRent)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Less void adjustment</span><span className="font-semibold text-red-600">-{fmt(results.annualRent - results.effectiveRent)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Less total expenses</span><span className="font-semibold text-red-600">-{fmt(results.annualExpenses)}</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2"><span className="font-bold">Gross profit</span><span className="font-bold">{fmt(results.grossProfit)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Less income tax</span><span className="font-semibold text-red-600">-{fmt(results.taxBill)}</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2"><span className="font-bold">Net profit</span><span className={`font-bold ${results.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(results.netProfit)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Expense ratio</span><span className="font-semibold">{results.expenseRatio.toFixed(1)}%</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8"><EmailResults /></div>
          <ShareResults title="Landlord Costs Calculator" summary={`Landlord costs: ${fmt(results.totalMonthlyExpenses)}/mo expenses, ${fmt(results.monthlyCashFlow)}/mo net cash flow`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">The Real Cost of Being a UK Landlord</h2>
          <p>New landlords consistently underestimate running costs. The two most common errors are forgetting to provision for void periods and maintenance. A well-run rental property typically has costs (excluding mortgage) equal to 30-40% of gross rent once you factor in agent fees, insurance, maintenance, compliance costs, and voids.</p>
          <h3 className="font-bold text-navy-800">Letting Agent Fees</h3>
          <p>Full management fees range from 10-15% of monthly rent plus VAT. Tenant-find only is typically 8-12% of the first year's rent. On a £1,000/month property, full management costs £1,440-£2,160/year. Self-managing saves this cost but requires time, landlord law knowledge, and the ability to handle maintenance emergencies and problem tenants directly.</p>
          <h3 className="font-bold text-navy-800">Budgeting for Maintenance</h3>
          <p>Reserve 1% of the property's value per year for maintenance and repairs. On a £150,000 property that's £1,500/year — you won't spend it every year, but you'll spend far more in years when a boiler, roof, or kitchen needs attention. Pre-1960s stock costs more to maintain than newer builds.</p>
          <h3 className="font-bold text-navy-800">Compliance Costs Landlords Forget</h3>
          <p>Annual Gas Safety Certificate: £60-£120. EICR (every 5 years): £150-£350. EPC (every 10 years): £60-£120. Smoke and CO alarm maintenance, deposit protection fees, Right to Rent checks, HMO licensing where applicable — all legal requirements with fines for non-compliance. Total compliance cost for a single-let: typically £150-300/year.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross & net yield</p></Link>
              <Link href="/calculators/hmo-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">HMO Yield</p><p className="text-xs text-navy-400 mt-0.5">HMO returns</p></Link>
              <Link href="/calculators/section-24" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Section 24</p><p className="text-xs text-navy-400 mt-0.5">Tax impact</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/guaranteed-rent-explained" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Guaranteed Rent Explained</p></Link>
              <Link href="/blog/renters-rights-act" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Renters Rights Act 2025</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}