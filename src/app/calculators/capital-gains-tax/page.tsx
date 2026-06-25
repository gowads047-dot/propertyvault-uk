"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

const cgtFaqs = [
  { q: "When do I pay Capital Gains Tax on property?", a: "You pay CGT when you sell a property that is not your main home (principal private residence). This includes buy-to-let properties, second homes, inherited properties you don't live in, and commercial property. You must report and pay within 60 days of completion." },
  { q: "What are the CGT rates on residential property?", a: "From 30 October 2024, residential property CGT rates are 18% for basic rate taxpayers and 24% for higher/additional rate taxpayers. The rate depends on your total taxable income plus the gain — if the gain pushes you into the higher rate band, part may be taxed at 18% and part at 24%." },
  { q: "What is the CGT annual exempt amount?", a: "The annual exempt amount for 2024-25 and 2025-26 is £3,000. This was reduced from £6,000 in 2023-24 and £12,300 in 2022-23. Each individual gets their own allowance." },
  { q: "What costs can I deduct from a capital gain?", a: "You can deduct: the original purchase price, stamp duty paid on purchase, solicitor fees (buying and selling), estate agent fees on sale, cost of significant improvements (not maintenance), and surveyor fees. You cannot deduct mortgage interest or routine maintenance." },
  { q: "How do I report and pay CGT on property?", a: "You must report the disposal and pay the CGT within 60 days of completion using HMRC's real-time Capital Gains Tax on UK property service. You'll also need to include it on your Self Assessment tax return for the relevant tax year." },
];

export default function CGTCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(150000);
  const [purchaseCosts, setPurchaseCosts] = useState(5000);
  const [improvementCosts, setImprovementCosts] = useState(20000);
  const [salePrice, setSalePrice] = useState(250000);
  const [saleCosts, setSaleCosts] = useState(5000);
  const [annualExemption, setAnnualExemption] = useState(3000);
  const [otherIncome, setOtherIncome] = useState(40000);
  const [ownership, setOwnership] = useState<"personal" | "company">("personal");

  const results = useMemo(() => {
    const totalCostBase = purchasePrice + purchaseCosts + improvementCosts;
    const netProceeds = salePrice - saleCosts;
    const totalGain = netProceeds - totalCostBase;
    const taxableGain = Math.max(0, totalGain - annualExemption);

    if (ownership === "company") {
      const corpTaxRate = taxableGain + annualExemption > 250000 ? 0.25 : taxableGain + annualExemption < 50000 ? 0.19 : 0.25;
      const corpTax = totalGain * corpTaxRate;
      return { totalGain, taxableGain: totalGain, tax: corpTax, effectiveRate: totalGain > 0 ? (corpTax / totalGain * 100) : 0, netProfit: totalGain - corpTax, basicBand: 0, higherBand: 0, isCompany: true };
    }

    const basicRateLimit = 50270;
    const remainingBasicBand = Math.max(0, basicRateLimit - otherIncome);

    let basicBand = 0;
    let higherBand = 0;

    if (taxableGain <= remainingBasicBand) {
      basicBand = taxableGain;
    } else {
      basicBand = remainingBasicBand;
      higherBand = taxableGain - remainingBasicBand;
    }

    const tax = (basicBand * 0.18) + (higherBand * 0.24);
    const effectiveRate = totalGain > 0 ? (tax / totalGain * 100) : 0;
    const netProfit = totalGain - tax;

    return { totalGain, taxableGain, tax, effectiveRate, netProfit, basicBand, higherBand, isCompany: false };
  }, [purchasePrice, purchaseCosts, improvementCosts, salePrice, saleCosts, annualExemption, otherIncome, ownership]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Capital Gains Tax Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate your CGT liability when selling a UK property. Covers residential property rates (18%/24%), annual exempt amount, and allowable deductions.</p>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Ownership Structure</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setOwnership("personal")} className={`py-3 rounded-xl text-sm font-semibold transition-all ${ownership === "personal" ? "bg-navy-800 text-white" : "bg-white border border-navy-100 text-navy-600 hover:border-navy-300"}`}>Personal</button>
                  <button onClick={() => setOwnership("company")} className={`py-3 rounded-xl text-sm font-semibold transition-all ${ownership === "company" ? "bg-navy-800 text-white" : "bg-white border border-navy-100 text-navy-600 hover:border-navy-300"}`}>Ltd Company</button>
                </div>
              </div>

              <h3 className="font-semibold text-navy-800 text-sm pt-2">Purchase</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-600 mb-1">Purchase Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-600 mb-1">Purchase Costs (SDLT, legal)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={purchaseCosts} onChange={(e) => setPurchaseCosts(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-600 mb-1">Improvement Costs (not maintenance)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={improvementCosts} onChange={(e) => setImprovementCosts(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>

              <h3 className="font-semibold text-navy-800 text-sm pt-2">Sale</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-600 mb-1">Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-600 mb-1">Sale Costs (agent, legal)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={saleCosts} onChange={(e) => setSaleCosts(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>

              {ownership === "personal" && (
                <>
                  <h3 className="font-semibold text-navy-800 text-sm pt-2">Your Tax Position</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs font-semibold text-navy-600 mb-1">Other Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={otherIncome} onChange={(e) => setOtherIncome(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                    <div><label className="block text-xs font-semibold text-navy-600 mb-1">Annual Exempt Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={annualExemption} onChange={(e) => setAnnualExemption(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-navy-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                  </div>
                </>
              )}
            </div>

            {/* Results */}
            <div>
              <div className="bg-navy-800 rounded-2xl p-8 text-white mb-5">
                <p className="text-white/50 text-sm mb-1">Capital Gains Tax</p>
                <p className="text-4xl font-extrabold text-gold-400 mb-5">{fmt(results.tax)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-4"><p className="text-white/50 text-xs">Total Gain</p><p className="font-bold text-lg">{fmt(results.totalGain)}</p></div>
                  <div className="bg-white/10 rounded-xl p-4"><p className="text-white/50 text-xs">Taxable Gain</p><p className="font-bold text-lg">{fmt(results.taxableGain)}</p></div>
                  <div className="bg-white/10 rounded-xl p-4"><p className="text-white/50 text-xs">Effective Rate</p><p className="font-bold text-lg">{results.effectiveRate.toFixed(1)}%</p></div>
                  <div className="bg-white/10 rounded-xl p-4"><p className="text-white/50 text-xs">Net Profit After Tax</p><p className="font-bold text-lg text-green-400">{fmt(results.netProfit)}</p></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <h4 className="font-bold text-navy-800 mb-3">Calculation Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-500">Sale price</span><span className="font-semibold">{fmt(salePrice)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less sale costs</span><span>-{fmt(saleCosts)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less purchase price</span><span>-{fmt(purchasePrice)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less purchase costs</span><span>-{fmt(purchaseCosts)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Less improvements</span><span>-{fmt(improvementCosts)}</span></div>
                  <div className="flex justify-between border-t border-navy-100 pt-2 font-bold"><span>Total gain</span><span>{fmt(results.totalGain)}</span></div>
                  {!results.isCompany && (
                    <>
                      <div className="flex justify-between text-green-600"><span>Less annual exemption</span><span>-{fmt(annualExemption)}</span></div>
                      <div className="flex justify-between"><span>Taxable gain</span><span className="font-semibold">{fmt(results.taxableGain)}</span></div>
                      {results.basicBand > 0 && <div className="flex justify-between"><span className="text-navy-500">{fmt(results.basicBand)} at 18%</span><span>{fmt(results.basicBand * 0.18)}</span></div>}
                      {results.higherBand > 0 && <div className="flex justify-between"><span className="text-navy-500">{fmt(results.higherBand)} at 24%</span><span>{fmt(results.higherBand * 0.24)}</span></div>}
                    </>
                  )}
                  {results.isCompany && (
                    <div className="flex justify-between"><span className="text-navy-500">Corporation tax</span><span>{fmt(results.tax)}</span></div>
                  )}
                  <div className="flex justify-between border-t border-navy-100 pt-2 font-bold text-lg"><span>CGT payable</span><span className="text-red-600">{fmt(results.tax)}</span></div>
                </div>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 mt-4 text-xs text-navy-500">
                <strong>Remember:</strong> CGT on UK residential property must be reported and paid within 60 days of completion using HMRC&apos;s real-time service. Late reporting incurs penalties.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={cgtFaqs} />
          <Disclaimer type="tax" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">Capital Gains Tax on UK Property — What You Need to Know</h2>
          <p>Capital Gains Tax (CGT) is charged on the profit when you sell a property that is not your main home. Since October 2024, the CGT rates on residential property are 18% for basic-rate taxpayers and 24% for higher-rate taxpayers. The Annual Exempt Amount (AEA) is currently £3,000 per person per tax year — anything above this is taxable.</p>
          <p>You must report and pay CGT within 60 days of completion on the property sale — not by the following 31 January. Missing this deadline incurs an automatic penalty and interest charges from HMRC.</p>
          <h3 className="font-bold text-navy-800">What Can You Deduct to Reduce CGT?</h3>
          <p>Your CGT liability is based on your net gain after deducting: the original purchase price, stamp duty paid on purchase, legal and survey fees on purchase, capital improvement costs (not maintenance or repairs), estate agent fees on sale, and legal fees on sale. Keep receipts for all capital improvements — HMRC may request evidence of these deductions.</p>
          <h3 className="font-bold text-navy-800">Private Residence Relief (PRR)</h3>
          <p>If you've lived in the property as your main home at any point, you may qualify for Private Residence Relief, which can reduce or eliminate CGT entirely. PRR covers the period you lived there plus the final 9 months of ownership regardless of whether you were living there. This is particularly relevant for accidental landlords who moved out and then let the property.</p>
          <h3 className="font-bold text-navy-800">Halve Your CGT with a Spouse or Civil Partner</h3>
          <p>If you own property jointly with a spouse or civil partner, each person uses their own £3,000 AEA and pays CGT at their own marginal rate. Transfers between spouses occur at no-gain/no-loss for CGT — so transferring a share of a property to a lower-earning spouse before selling is a legitimate tax planning strategy worth exploring with an accountant.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/section-24" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Section 24</p><p className="text-xs text-navy-400 mt-0.5">Income tax</p></Link>
              <Link href="/calculators/personal-vs-ltd" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Personal vs Ltd</p><p className="text-xs text-navy-400 mt-0.5">Company ownership</p></Link>
              <Link href="/calculators/flip-roi" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Flip ROI</p><p className="text-xs text-navy-400 mt-0.5">Sale profit</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/stamp-duty-guide" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Stamp Duty Guide</p></Link>
              <Link href="/blog/personal-vs-limited-company" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Personal vs Ltd Company</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}