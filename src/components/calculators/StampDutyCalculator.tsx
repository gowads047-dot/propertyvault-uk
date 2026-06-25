"use client";

import { useState, useMemo } from "react";
import { ShareResults } from "./ShareResults";

// SDLT rates effective from 1 April 2025 (thresholds reverted from temporary Covid-era levels)
const residentialBands = [
  { threshold: 125000, rate: 0 },
  { threshold: 250000, rate: 0.02 },
  { threshold: 925000, rate: 0.05 },
  { threshold: 1500000, rate: 0.10 },
  { threshold: Infinity, rate: 0.12 },
];

// Surcharge increased to 5% from 31 October 2024 (previously 3%)
const additionalSurcharge = 0.05;
// FTB relief: nil rate threshold reverted to £300,000 from 1 April 2025 (was temporarily £425,000)
const firstTimeBuyerThreshold = 300000;
const firstTimeBuyerCap = 500000;

type BuyerType = "standard" | "additional" | "first-time";

export function StampDutyCalculator() {
  const [price, setPrice] = useState(300000);
  const [buyerType, setBuyerType] = useState<BuyerType>("standard");

  const results = useMemo(() => {
    const bands: { from: number; to: number; rate: number; tax: number }[] = [];
    let totalTax = 0;
    let prev = 0;

    if (buyerType === "first-time" && price <= firstTimeBuyerCap) {
      const ftbBands = [
        { threshold: firstTimeBuyerThreshold, rate: 0 },
        { threshold: firstTimeBuyerCap, rate: 0.05 },
        { threshold: Infinity, rate: 0.05 },
      ];
      for (const band of ftbBands) {
        if (price <= prev) break;
        const taxable = Math.min(price, band.threshold) - prev;
        if (taxable <= 0) { prev = band.threshold; continue; }
        const tax = taxable * band.rate;
        bands.push({ from: prev, to: Math.min(price, band.threshold), rate: band.rate, tax });
        totalTax += tax;
        prev = band.threshold;
      }
    } else {
      const surcharge = buyerType === "additional" ? additionalSurcharge : 0;
      for (const band of residentialBands) {
        if (price <= prev) break;
        const taxable = Math.min(price, band.threshold) - prev;
        if (taxable <= 0) { prev = band.threshold; continue; }
        const rate = band.rate + surcharge;
        const tax = taxable * rate;
        bands.push({ from: prev, to: Math.min(price, band.threshold), rate, tax });
        totalTax += tax;
        prev = band.threshold;
      }
    }

    return {
      bands,
      totalTax,
      effectiveRate: price > 0 ? (totalTax / price) * 100 : 0,
    };
  }, [price, buyerType]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Property Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 font-semibold">£</span>
            <input
              type="number" min={0} step={1000} value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg text-navy-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
            />
          </div>
          <input
            type="range" min={50000} max={3000000} step={5000} value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full mt-3 accent-gold-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Buyer Type</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: "standard" as BuyerType, label: "Standard Purchase", desc: "Main residence, not first-time buyer" },
              { value: "additional" as BuyerType, label: "Additional Property (+5%)", desc: "Second homes, buy-to-let, investment" },
              { value: "first-time" as BuyerType, label: "First-Time Buyer", desc: "Relief on properties up to £500,000 (from April 2025)" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBuyerType(opt.value)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${buyerType === opt.value ? "border-gold-400 bg-gold-50" : "border-navy-100 hover:border-navy-200"}`}
              >
                <p className="font-semibold text-sm text-navy-800">{opt.label}</p>
                <p className="text-xs text-navy-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
          <p className="text-navy-200 text-sm mb-1">Stamp Duty (SDLT)</p>
          <p className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">{fmt(results.totalTax)}</p>
          <p className="text-navy-300 text-sm">Effective rate: {results.effectiveRate.toFixed(2)}%</p>
        </div>

        {/* Visual band bar */}
        {results.totalTax > 0 && (
          <div className="bg-white rounded-xl border border-navy-100 p-6 mb-4">
            <h4 className="font-bold text-navy-800 mb-3 text-sm">Tax by band</h4>
            <div className="space-y-2">
              {results.bands.filter(b => b.tax > 0).map((band, i) => {
                const colors = ["#0f1b36", "#c9a84c", "#6b7280", "#3b82f6", "#ef4444"];
                const maxTax = Math.max(...results.bands.map(b => b.tax));
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-navy-500 mb-1">
                      <span>{(band.rate * 100).toFixed(0)}% on {fmt(band.from)}–{fmt(band.to)}</span>
                      <span className="font-semibold text-navy-800">{fmt(band.tax)}</span>
                    </div>
                    <div className="h-5 bg-navy-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${maxTax > 0 ? (band.tax / maxTax * 100) : 0}%`, backgroundColor: colors[i % colors.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-navy-100 p-6">
          <h4 className="font-bold text-navy-800 mb-4">Tax Band Breakdown</h4>
          <div className="space-y-3">
            {results.bands.map((band, i) => (
              <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-navy-50 last:border-0">
                <div>
                  <p className="text-navy-700 font-medium">{fmt(band.from)} – {fmt(band.to)}</p>
                  <p className="text-navy-400 text-xs">{(band.rate * 100).toFixed(0)}% rate</p>
                </div>
                <p className="font-bold text-navy-800">{fmt(band.tax)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-navy-200 flex justify-between items-center">
            <span className="font-bold text-navy-800">Total SDLT</span>
            <span className="font-bold text-lg text-gold-600">{fmt(results.totalTax)}</span>
          </div>
        </div>

        <p className="text-xs text-navy-400 mt-4">
          Based on SDLT rates for England and Northern Ireland from 1 April 2025 (nil-rate threshold £125,000; additional property surcharge 5%). Scotland (LBTT) and Wales (LTT) have different rates. This calculator is for guidance only.
        </p>
        <ShareResults
          title="Stamp Duty Calculator"
          summary={`Stamp duty: £${Math.round(results.totalTax).toLocaleString("en-GB")} on a £${price.toLocaleString("en-GB")} property (${results.effectiveRate.toFixed(2)}% effective rate)`}
        />
      </div>
    </div>
  );
}
