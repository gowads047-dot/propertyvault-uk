"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function MovingCostsPage() {
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isAdditional, setIsAdditional] = useState(false);
  const [solicitorFee, setSolicitorFee] = useState(1200);
  const [searchFees, setSearchFees] = useState(300);
  const [surveyFee, setSurveyFee] = useState(500);
  const [mortgageFee, setMortgageFee] = useState(999);
  const [removalCost, setRemovalCost] = useState(800);
  const [mailRedirect, setMailRedirect] = useState(35);
  const [cleaning, setCleaning] = useState(200);
  const [furniture, setFurniture] = useState(2000);
  const [otherCosts, setOtherCosts] = useState(0);

  const stampDuty = useMemo(() => {
    let tax = 0;
    const surcharge = isAdditional ? 0.05 : 0;
    if (isFirstTime && propertyPrice <= 500000) {
      if (propertyPrice > 300000) tax = (propertyPrice - 300000) * 0.05;
      return tax;
    }
    const bands = [
      { threshold: 125000, rate: 0 },
      { threshold: 250000, rate: 0.02 },
      { threshold: 925000, rate: 0.05 },
      { threshold: 1500000, rate: 0.10 },
      { threshold: Infinity, rate: 0.12 },
    ];
    let prev = 0;
    for (const band of bands) {
      if (propertyPrice <= prev) break;
      const taxable = Math.min(propertyPrice, band.threshold) - prev;
      if (taxable > 0) tax += taxable * (band.rate + surcharge);
      prev = band.threshold;
    }
    return tax;
  }, [propertyPrice, isFirstTime, isAdditional]);

  const totalCosts = useMemo(() => {
    return stampDuty + solicitorFee + searchFees + surveyFee + mortgageFee + removalCost + mailRedirect + cleaning + furniture + otherCosts;
  }, [stampDuty, solicitorFee, searchFees, surveyFee, mortgageFee, removalCost, mailRedirect, cleaning, furniture, otherCosts]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  const costItems = [
    { label: "Stamp Duty (SDLT)", value: stampDuty, editable: false },
    { label: "Solicitor / Conveyancer", value: solicitorFee, set: setSolicitorFee },
    { label: "Search Fees", value: searchFees, set: setSearchFees },
    { label: "Survey / Valuation", value: surveyFee, set: setSurveyFee },
    { label: "Mortgage Arrangement Fee", value: mortgageFee, set: setMortgageFee },
    { label: "Removals", value: removalCost, set: setRemovalCost },
    { label: "Mail Redirection", value: mailRedirect, set: setMailRedirect },
    { label: "Professional Cleaning", value: cleaning, set: setCleaning },
    { label: "Furniture / Essentials", value: furniture, set: setFurniture },
    { label: "Other Costs", value: otherCosts, set: setOtherCosts },
  ];

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Moving Cost Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate the full cost of moving home — stamp duty, solicitor fees, surveys, removals, and everything else. Adjust each cost to match your quotes.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-navy-700 mb-1">Property Purchase Price</label>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
            <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" checked={isFirstTime} onChange={(e) => { setIsFirstTime(e.target.checked); if (e.target.checked) setIsAdditional(false); }} className="rounded" /> First-time buyer</label>
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" checked={isAdditional} onChange={(e) => { setIsAdditional(e.target.checked); if (e.target.checked) setIsFirstTime(false); }} className="rounded" /> Additional property (+5%)</label>
            </div>
          </div>

          <h2 className="text-lg font-bold text-navy-800 mb-3">Cost Breakdown</h2>
          <div className="space-y-3">
            {costItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-white rounded-lg border border-navy-100">
                <span className="text-sm text-navy-700 font-medium">{item.label}</span>
                {item.set ? (
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                  <input type="number" value={item.value} onChange={(e) => item.set!(Number(e.target.value))} className="w-28 pl-7 pr-2 py-2 border border-navy-200 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                ) : (
                  <span className="font-bold text-navy-800">{fmt(item.value)}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white text-center">
            <p className="text-navy-300 text-sm mb-1">Total Moving Costs</p>
            <p className="text-4xl font-bold text-gold-400">{fmt(totalCosts)}</p>
          </div>

          <Disclaimer type="calculator" />
        </div>
      </section>
    </>
  );
}
