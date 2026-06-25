"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function FlipROIPage() {
  const [purchasePrice, setPurchasePrice] = useState(120000);
  const [stampDuty, setStampDuty] = useState(3600);
  const [legalFees, setLegalFees] = useState(1500);
  const [refurbCost, setRefurbCost] = useState(25000);
  const [financeCost, setFinanceCost] = useState(4000);
  const [holdingMonths, setHoldingMonths] = useState(4);
  const [holdingCosts, setHoldingCosts] = useState(300);
  const [salePrice, setSalePrice] = useState(190000);
  const [agentFee, setAgentFee] = useState(1.5);
  const [saleLegalFees, setSaleLegalFees] = useState(1000);

  const results = useMemo(() => {
    const totalBuyCost = purchasePrice + stampDuty + legalFees;
    const totalProjectCost = totalBuyCost + refurbCost + financeCost + (holdingCosts * holdingMonths);
    const agentFeeAmount = salePrice * (agentFee / 100);
    const totalSaleCosts = agentFeeAmount + saleLegalFees;
    const netSaleProceeds = salePrice - totalSaleCosts;
    const grossProfit = netSaleProceeds - totalProjectCost;
    const profitOnCost = totalProjectCost > 0 ? (grossProfit / totalProjectCost * 100) : 0;
    const roi = totalBuyCost > 0 ? (grossProfit / totalBuyCost * 100) : 0;
    const annualisedROI = holdingMonths > 0 ? (roi / holdingMonths * 12) : 0;

    return { totalBuyCost, totalProjectCost, agentFeeAmount, totalSaleCosts, netSaleProceeds, grossProfit, profitOnCost, roi, annualisedROI, holdingCostTotal: holdingCosts * holdingMonths };
  }, [purchasePrice, stampDuty, legalFees, refurbCost, financeCost, holdingMonths, holdingCosts, salePrice, agentFee, saleLegalFees]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Flip / Refurb ROI Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate the profit and return on investment for a buy-refurbish-sell (flip) project. Enter all costs and the expected sale price.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Purchase</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Purchase Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Stamp Duty</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={stampDuty} onChange={(e) => setStampDuty(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Legal Fees (purchase)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={legalFees} onChange={(e) => setLegalFees(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>

              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Refurbishment</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Refurb Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={refurbCost} onChange={(e) => setRefurbCost(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Finance Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={financeCost} onChange={(e) => setFinanceCost(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Holding Period (months)</label><input type="number" value={holdingMonths} onChange={(e) => setHoldingMonths(Number(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Monthly Holding Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={holdingCosts} onChange={(e) => setHoldingCosts(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>

              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Sale</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Expected Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Agent Fee (%)</label><input type="number" step={0.1} value={agentFee} onChange={(e) => setAgentFee(Number(e.target.value))} className="w-full px-3 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Legal Fees (sale)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span><input type="number" value={saleLegalFees} onChange={(e) => setSaleLegalFees(Number(e.target.value))} className="w-full pl-7 pr-2 py-2.5 border border-navy-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>
            </div>

            <div>
              <div className={`rounded-2xl p-8 text-white mb-6 ${results.grossProfit >= 0 ? "bg-gradient-to-br from-green-700 to-green-900" : "bg-gradient-to-br from-red-700 to-red-900"}`}>
                <p className="text-sm opacity-80 mb-1">Projected Profit</p>
                <p className="text-4xl font-bold mb-4">{fmt(results.grossProfit)}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Profit on Cost</p><p className="font-bold">{results.profitOnCost.toFixed(1)}%</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">ROI</p><p className="font-bold">{results.roi.toFixed(1)}%</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Annualised ROI</p><p className="font-bold">{results.annualisedROI.toFixed(1)}%</p></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Deal Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Purchase + costs</span><span>{fmt(results.totalBuyCost)}</span></div>
                  <div className="flex justify-between"><span>Refurb</span><span>{fmt(refurbCost)}</span></div>
                  <div className="flex justify-between"><span>Finance</span><span>{fmt(financeCost)}</span></div>
                  <div className="flex justify-between"><span>Holding costs ({holdingMonths} months)</span><span>{fmt(results.holdingCostTotal)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold"><span>Total project cost</span><span>{fmt(results.totalProjectCost)}</span></div>
                  <div className="flex justify-between mt-2"><span>Sale price</span><span className="text-green-600 font-semibold">{fmt(salePrice)}</span></div>
                  <div className="flex justify-between text-red-600"><span>Agent fee + legal</span><span>-{fmt(results.totalSaleCosts)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold"><span>Net proceeds</span><span>{fmt(results.netSaleProceeds)}</span></div>
                  <div className="flex justify-between border-t pt-1 font-bold text-lg"><span>PROFIT</span><span className={results.grossProfit >= 0 ? "text-green-600" : "text-red-600"}>{fmt(results.grossProfit)}</span></div>
                </div>
              </div>
            </div>
          </div>
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">Property Flipping in the UK — How to Make It Work</h2>
          <p>Property flipping (buying, renovating, and selling for profit) can generate significant returns but carries more risk than buy-to-let — your capital is tied up during refurbishment, the market can move against you, and costs almost always exceed initial estimates. A well-executed flip in the right area can return 15-25% on invested capital in 4-9 months. A poorly planned one loses money even in a rising market.</p>
          <p>The fundamental rule: <strong>profit is made on the purchase, not the sale.</strong> If you pay too much at acquisition, no renovation will make the numbers work. Target properties at least 20-25% below market value after works.</p>
          <h3 className="font-bold text-navy-800">Flip vs BRRR — Which Is Better?</h3>
          <p>Flipping generates a lump sum profit but you pay CGT on it and lose the asset. BRRR (Buy, Refurb, Refinance, Rent) recycles your capital — same refurbishment, but then remortgage to extract capital back out and hold for rental income. For long-term wealth building, BRRR typically wins. Flipping is better for generating short-term cash.</p>
          <h3 className="font-bold text-navy-800">The True Cost of a Flip</h3>
          <p>Beyond purchase price and refurb: stamp duty (3% surcharge if not your only property), bridging finance (0.65-1.2%/month), utilities during works, council tax, estate agent fees on sale (1-2.5%), both sides' legal fees, and CGT on the profit. This calculator captures all of these so your ROI figure reflects reality.</p>
          <h3 className="font-bold text-navy-800">Refurbishment Cost Control</h3>
          <p>Get three quotes for every trade. Build in a 20% contingency from the start — it's almost always needed. Project-managing trades yourself saves 15-20% vs a main contractor but requires significant time. For a first flip, a JV partner with experience protects you from the mistakes that wipe out margins.</p>
        </div>
      </section>
    </>
  );
}
