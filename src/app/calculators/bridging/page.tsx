"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";

const faqs = [
  { q: "What is a bridging loan and how does it work?", a: "A bridging loan is short-term secured finance used to bridge a gap — typically between buying a new property and selling another, or between purchasing and refinancing onto a long-term mortgage. They complete in days rather than weeks and are commonly used for auction purchases, uninhabitable properties, or chain breaks." },
  { q: "How much does bridging finance cost?", a: "Bridging loans are charged at a monthly rate, typically 0.65-1.2% per month (8-14% annualised). On top of interest, expect an arrangement fee of 1-2%, possibly an exit fee of 0-1%, valuation fees, and legal costs for both sides. Always calculate the total cost — not just the monthly rate — before committing." },
  { q: "What is the difference between retained and serviced bridging interest?", a: "With retained (rolled-up) interest, the lender adds all projected interest to the loan upfront and you repay it on exit — you don't make monthly payments. With serviced interest, you pay monthly like a mortgage. Retained is more expensive overall but is better for cash flow during a refurbishment period." },
  { q: "What is the maximum LTV on a bridging loan?", a: "Most bridging lenders offer up to 70-75% LTV on residential property, though 65-70% is more common for commercial or development. Some lenders will go to 80% on very strong security. The higher the LTV, the higher the monthly rate will be." },
  { q: "What happens if I cannot repay a bridging loan on time?", a: "Failure to repay on time can trigger default interest rates (often 2-3x the standard monthly rate) and ultimately repossession. Always have a credible, documented exit strategy — either a confirmed sale or a mortgage offer in principle — before taking out a bridge." },
];

export default function BridgingPage() {
  const [loanAmount, setLoanAmount] = useState(150000);
  const [monthlyRate, setMonthlyRate] = useState(0.85);
  const [termMonths, setTermMonths] = useState(6);
  const [arrangementFee, setArrangementFee] = useState(2);
  const [exitFee, setExitFee] = useState(1);
  const [valuationFee, setValuationFee] = useState(500);
  const [legalFees, setLegalFees] = useState(1500);
  const [interestType, setInterestType] = useState<"retained" | "serviced">("retained");

  const results = useMemo(() => {
    const monthlyInterest = loanAmount * (monthlyRate / 100);
    const totalInterest = monthlyInterest * termMonths;
    const arrangementFeeAmt = loanAmount * (arrangementFee / 100);
    const exitFeeAmt = loanAmount * (exitFee / 100);
    const totalFees = arrangementFeeAmt + exitFeeAmt + valuationFee + legalFees;
    const totalCost = totalInterest + totalFees;
    const grossLoan = interestType === "retained" ? loanAmount + totalInterest : loanAmount;
    const netDay1 = loanAmount - arrangementFeeAmt - valuationFee - legalFees;
    const annualRate = monthlyRate * 12;

    return { monthlyInterest, totalInterest, arrangementFeeAmt, exitFeeAmt, totalFees, totalCost, grossLoan, netDay1, annualRate };
  }, [loanAmount, monthlyRate, termMonths, arrangementFee, exitFee, valuationFee, legalFees, interestType]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bridging Loan Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate the total cost of bridging finance including monthly interest, arrangement fees, exit fees, and all associated costs.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Loan Amount</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span><input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rate ({monthlyRate}%)</label><input type="range" min={0.4} max={2} step={0.05} value={monthlyRate} onChange={(e) => setMonthlyRate(Number(e.target.value))} className="w-full accent-gold-500" /><p className="text-xs text-navy-500 text-center">{results.annualRate.toFixed(1)}% annual equivalent</p></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Term ({termMonths} months)</label><input type="range" min={1} max={24} step={1} value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} className="w-full accent-gold-500" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Interest Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setInterestType("retained")} className={`py-2 rounded-lg text-sm font-medium ${interestType === "retained" ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600"}`}>Retained (rolled up)</button>
                  <button onClick={() => setInterestType("serviced")} className={`py-2 rounded-lg text-sm font-medium ${interestType === "serviced" ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600"}`}>Serviced (monthly)</button>
                </div>
              </div>
              <h3 className="font-bold text-navy-800 text-sm border-b border-navy-100 pb-2">Fees</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Arrangement Fee (%)</label><input type="number" step={0.5} value={arrangementFee} onChange={(e) => setArrangementFee(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Exit Fee (%)</label><input type="number" step={0.5} value={exitFee} onChange={(e) => setExitFee(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Valuation Fee (£)</label><input type="number" value={valuationFee} onChange={(e) => setValuationFee(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Legal Fees (£)</label><input type="number" value={legalFees} onChange={(e) => setLegalFees(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
                <p className="text-navy-200 text-sm mb-1">Total Cost of Bridging</p>
                <p className="text-4xl font-bold text-gold-400 mb-4">{fmt(results.totalCost)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Monthly Interest</p><p className="font-bold">{fmt(results.monthlyInterest)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Total Interest</p><p className="font-bold">{fmt(results.totalInterest)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Total Fees</p><p className="font-bold">{fmt(results.totalFees)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Net Day 1 Funds</p><p className="font-bold">{fmt(results.netDay1)}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Loan amount</span><span>{fmt(loanAmount)}</span></div>
                  <div className="flex justify-between"><span>Interest ({termMonths} months × {monthlyRate}%)</span><span>{fmt(results.totalInterest)}</span></div>
                  <div className="flex justify-between"><span>Arrangement fee ({arrangementFee}%)</span><span>{fmt(results.arrangementFeeAmt)}</span></div>
                  <div className="flex justify-between"><span>Exit fee ({exitFee}%)</span><span>{fmt(results.exitFeeAmt)}</span></div>
                  <div className="flex justify-between"><span>Valuation</span><span>{fmt(valuationFee)}</span></div>
                  <div className="flex justify-between"><span>Legal fees</span><span>{fmt(legalFees)}</span></div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>Total cost</span><span className="text-red-600">{fmt(results.totalCost)}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8"><EmailResults /></div>
          <ShareResults title="Bridging Loan Calculator" summary={`Bridging loan ${fmt(loanAmount)} for ${termMonths} months at ${monthlyRate}%/mo: total cost ${fmt(results.totalCost)}`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">What Is Bridging Finance and When Should You Use It?</h2>
          <p>Bridging loans are short-term, secured finance used to "bridge" a gap — typically between buying a property and either selling another, or refinancing onto a longer-term mortgage. They complete much faster than mortgages (often within 3-14 days) and lend against properties that standard mortgages won't touch: uninhabitable condition, no kitchen or bathroom, structural issues, or auction purchases requiring completion in 28 days.</p>
          <p>Bridging is expensive — monthly rates of 0.65-1.2% mean an annualised cost of 8-14%. The justification is that you're buying at a discount (because the property needs work) that far exceeds the finance cost, and you exit via a remortgage or sale once the property is habitable or improved.</p>
          <h3 className="font-bold text-navy-800">Closed vs Open Bridging</h3>
          <p>A <strong>closed bridge</strong> has a defined exit date — you've already exchanged on a sale, for example, and just need to bridge 6 weeks to completion. These are cheaper. An <strong>open bridge</strong> has no fixed exit, which lenders price in with higher rates and shorter maximum terms (usually 12-18 months). Always have a realistic exit strategy — lenders will ask for it.</p>
          <h3 className="font-bold text-navy-800">How Bridging Loan Costs Add Up</h3>
          <p>The total cost includes: monthly interest (usually rolled up and paid on exit), arrangement fee (1-2% of the loan), exit fee (0-1%), valuation fee, and legal fees for both sides. On a £200,000 loan for 6 months at 0.9%/month with a 2% arrangement fee, total costs exceed £18,000. This calculator shows you the exact breakdown so you can factor it into your deal analysis before committing.</p>
          <h3 className="font-bold text-navy-800">Regulated vs Unregulated Bridging</h3>
          <p>Bridging on your main home (or a home a close family member will live in) is regulated by the FCA. Bridging on investment property is unregulated — always use a specialist broker and ensure you understand the risks, including what happens if your exit strategy fails.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/deal-analyser" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Deal Analyser</p><p className="text-xs text-navy-400 mt-0.5">Full deal model</p></Link>
              <Link href="/calculators/flip-roi" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Flip ROI</p><p className="text-xs text-navy-400 mt-0.5">Refurb profit</p></Link>
              <Link href="/calculators/brrr" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">BRRR Calculator</p><p className="text-xs text-navy-400 mt-0.5">Recycle capital</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">BRRR Strategy Explained</p></Link>
              <Link href="/blog/hmo-investing-uk" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">HMO Investing UK</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}