"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";

const faqs = [
  { q: "When should I remortgage my property?", a: "The best time to start the remortgage process is 3-6 months before your current fixed-rate deal expires. At expiry, you revert to the lender's Standard Variable Rate (SVR), which is typically 1-2% above the best available fixed rates — costing hundreds per month extra. Starting early gives time to compare the full market." },
  { q: "How much does it cost to remortgage?", a: "Switching costs typically include an arrangement fee (£0-£1,999 depending on the deal), legal fees (£0-£500, often free on competitive remortgage products), valuation fee (£0-£600, often free), and any early repayment charge (ERC) if you're still in a fixed-rate period. The break-even calculation — total costs divided by monthly saving — tells you whether switching is worthwhile." },
  { q: "What is a product transfer and how is it different from a remortgage?", a: "A product transfer means switching to a new rate with your existing lender without moving the mortgage elsewhere. It is faster (often same day), cheaper (usually no legal or valuation fees), and does not require a full affordability reassessment. A full remortgage to a new lender takes 4-8 weeks but may offer better rates or allow you to borrow more." },
  { q: "Can I remortgage to release equity?", a: "Yes. If your property has increased in value since purchase, your loan-to-value (LTV) will have fallen. You can borrow against this additional equity by remortgaging to a higher loan amount. This is commonly used to fund deposit for additional buy-to-let properties (the BRRR strategy) or to fund home improvements." },
  { q: "Does remortgaging affect my credit score?", a: "A full remortgage to a new lender involves a hard credit search, which temporarily reduces your credit score by a small amount. Multiple applications in a short period have a greater impact. Product transfers with your existing lender typically only involve a soft search and have minimal credit impact." },
];

export default function RemortgagePage() {
  const [outstandingBalance, setOutstandingBalance] = useState(180000);
  const [currentRate, setCurrentRate] = useState(6.5);
  const [newRate, setNewRate] = useState(4.5);
  const [remainingTerm, setRemainingTerm] = useState(20);
  const [arrangementFee, setArrangementFee] = useState(999);
  const [valuationFee, setValuationFee] = useState(0);
  const [legalFees, setLegalFees] = useState(0);
  const [exitFee, setExitFee] = useState(0);

  const results = useMemo(() => {
    const months = remainingTerm * 12;
    const calcPayment = (balance: number, rate: number, m: number) => {
      const r = rate / 100 / 12;
      if (r === 0) return balance / m;
      return balance * (r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
    };

    const currentMonthly = calcPayment(outstandingBalance, currentRate, months);
    const newMonthly = calcPayment(outstandingBalance, newRate, months);
    const monthlySaving = currentMonthly - newMonthly;
    const annualSaving = monthlySaving * 12;
    const totalSavingOverTerm = monthlySaving * months;

    const totalSwitchCost = arrangementFee + valuationFee + legalFees + exitFee;
    const netSaving = totalSavingOverTerm - totalSwitchCost;
    const breakEvenMonths = monthlySaving > 0 ? totalSwitchCost / monthlySaving : 0;

    const currentTotalCost = currentMonthly * months;
    const newTotalCost = (newMonthly * months) + totalSwitchCost;

    return {
      currentMonthly, newMonthly, monthlySaving, annualSaving,
      totalSavingOverTerm, totalSwitchCost, netSaving, breakEvenMonths,
      currentTotalCost, newTotalCost, worthSwitching: netSaving > 0,
    };
  }, [outstandingBalance, currentRate, newRate, remainingTerm, arrangementFee, valuationFee, legalFees, exitFee]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmtExact = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Remortgage Savings Calculator</h1>
          <p className="text-navy-200 max-w-2xl">See how much you could save by switching to a new mortgage deal. Compare your current rate with a new rate and factor in all switching costs.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Outstanding Mortgage Balance</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" value={outstandingBalance} onChange={(e) => setOutstandingBalance(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Current Rate ({currentRate}%)</label><input type="range" min={1} max={10} step={0.1} value={currentRate} onChange={(e) => setCurrentRate(Number(e.target.value))} className="w-full accent-gold-500" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">New Rate ({newRate}%)</label><input type="range" min={1} max={10} step={0.1} value={newRate} onChange={(e) => setNewRate(Number(e.target.value))} className="w-full accent-gold-500" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Remaining Term ({remainingTerm} years)</label><input type="range" min={5} max={35} step={1} value={remainingTerm} onChange={(e) => setRemainingTerm(Number(e.target.value))} className="w-full accent-gold-500" /></div>

              <h3 className="font-bold text-navy-800 text-sm border-b border-navy-100 pb-2">Switching Costs</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Arrangement Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={arrangementFee} onChange={(e) => setArrangementFee(Number(e.target.value))} className="w-full pl-7 pr-2 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Valuation Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={valuationFee} onChange={(e) => setValuationFee(Number(e.target.value))} className="w-full pl-7 pr-2 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Legal Fees</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={legalFees} onChange={(e) => setLegalFees(Number(e.target.value))} className="w-full pl-7 pr-2 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Early Exit Fee</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={exitFee} onChange={(e) => setExitFee(Number(e.target.value))} className="w-full pl-7 pr-2 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>
            </div>

            <div>
              <div className={`rounded-2xl p-8 text-white mb-6 ${results.worthSwitching ? "bg-gradient-to-br from-green-700 to-green-900" : "bg-gradient-to-br from-navy-800 to-navy-900"}`}>
                {results.worthSwitching ? (
                  <>
                    <p className="text-green-200 text-sm mb-1">Switching could save you</p>
                    <p className="text-4xl font-bold text-white mb-1">{fmt(results.netSaving)}</p>
                    <p className="text-green-200 text-sm">over the remaining {remainingTerm} years</p>
                  </>
                ) : (
                  <>
                    <p className="text-navy-200 text-sm mb-1">Switching would cost you more</p>
                    <p className="text-4xl font-bold text-red-400 mb-1">{fmt(Math.abs(results.netSaving))}</p>
                    <p className="text-navy-200 text-sm">Fees outweigh the savings — not worth switching</p>
                  </>
                )}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Current Monthly</p><p className="font-bold text-lg">{fmtExact(results.currentMonthly)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">New Monthly</p><p className="font-bold text-lg">{fmtExact(results.newMonthly)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Monthly Saving</p><p className="font-bold text-lg text-green-400">{fmtExact(results.monthlySaving)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Break-Even</p><p className="font-bold text-lg">{results.breakEvenMonths > 0 ? Math.ceil(results.breakEvenMonths) + " months" : "—"}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Full Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-600">Total cost staying (current rate)</span><span className="font-semibold">{fmt(results.currentTotalCost)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Total cost switching (new rate + fees)</span><span className="font-semibold">{fmt(results.newTotalCost)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Switching costs</span><span className="font-semibold">{fmt(results.totalSwitchCost)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Annual saving</span><span className="font-semibold text-green-600">{fmt(results.annualSaving)}</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2 font-bold"><span>Net saving over term</span><span className={results.netSaving >= 0 ? "text-green-600" : "text-red-600"}>{fmt(results.netSaving)}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8"><EmailResults /></div>
          <ShareResults title="Remortgage Savings Calculator" summary={`Remortgage: ${fmt(results.annualSaving)}/yr saving, ${results.worthSwitching ? `${results.breakEvenMonths}-month payback, ${fmt(results.netSaving)} net gain` : 'not worth switching at current costs'}`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">When and Why to Remortgage Your Property</h2>
          <p>Remortgaging means switching your mortgage to a new deal — with your current lender (product transfer) or a new lender. Most fixed-rate mortgages revert to the lender's Standard Variable Rate (SVR) when the term ends. SVRs are typically 1-2% above the best available fixed rates, meaning you can save hundreds per month simply by remortgaging at the right time.</p>
          <p>For buy-to-let investors, remortgaging is also how you pull equity out of appreciated properties to fund further acquisitions — the cornerstone of the BRRR strategy.</p>
          <h3 className="font-bold text-navy-800">Is Remortgaging Worth the Cost?</h3>
          <p>Calculate total switching costs: early repayment charge (ERC) if still in a fixed term, valuation fee, legal fees (often free on competitive deals), and arrangement fee. Then calculate the monthly saving on the new rate. Divide total costs by monthly saving to get the break-even month. If this is less than the new deal term, remortgaging is financially justified.</p>
          <h3 className="font-bold text-navy-800">What LTV Means for Your Rate</h3>
          <p>Loan-to-value (LTV) is the mortgage as a percentage of property value. Lower LTV = better rate. Best rates are typically at 60% LTV, increasing at 65%, 70%, 75% (most common BTL maximum), and 80%+. If your property has appreciated since purchase, your LTV may have fallen significantly — giving access to far better rates than when you first bought.</p>
          <h3 className="font-bold text-navy-800">Product Transfer vs Full Remortgage</h3>
          <p>A product transfer (same lender, new rate) is faster, cheaper, and doesn't require full affordability checks. A full remortgage (switching lender) takes 4-8 weeks but may offer better rates or allow additional borrowing. Start the process 3-6 months before your current deal ends to avoid falling onto the SVR and to compare the full market properly.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/affordability" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Affordability</p><p className="text-xs text-navy-400 mt-0.5">Borrowing power</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Check returns</p></Link>
              <Link href="/calculators/brrr" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">BRRR Calculator</p><p className="text-xs text-navy-400 mt-0.5">Recycle capital</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">BRRR Strategy Explained</p></Link>
              <Link href="/blog/uk-property-market-2026" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">UK Property Market 2026</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}