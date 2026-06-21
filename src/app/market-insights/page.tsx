import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "UK Property Market Insights — House Prices, Yields & Trends | PropertyVault",
  description: "UK property market data and analysis. House price trends, rental yields by region, interest rate impact, and property hotspot reports.",
};

const regions = [
  { name: "North East", avgPrice: "£163,000", yoy: "+2.1%", avgRent: "£625", yield: "4.6%" },
  { name: "North West", avgPrice: "£210,000", yoy: "+3.5%", avgRent: "£825", yield: "4.7%" },
  { name: "Yorkshire", avgPrice: "£205,000", yoy: "+2.8%", avgRent: "£775", yield: "4.5%" },
  { name: "East Midlands", avgPrice: "£240,000", yoy: "+2.3%", avgRent: "£825", yield: "4.1%" },
  { name: "West Midlands", avgPrice: "£250,000", yoy: "+3.1%", avgRent: "£875", yield: "4.2%" },
  { name: "East of England", avgPrice: "£340,000", yoy: "+1.5%", avgRent: "£1,050", yield: "3.7%" },
  { name: "London", avgPrice: "£525,000", yoy: "+0.8%", avgRent: "£1,800", yield: "4.1%" },
  { name: "South East", avgPrice: "£380,000", yoy: "+1.2%", avgRent: "£1,200", yield: "3.8%" },
  { name: "South West", avgPrice: "£320,000", yoy: "+1.8%", avgRent: "£975", yield: "3.7%" },
  { name: "Wales", avgPrice: "£215,000", yoy: "+2.5%", avgRent: "£750", yield: "4.2%" },
  { name: "Scotland", avgPrice: "£195,000", yoy: "+2.9%", avgRent: "£725", yield: "4.5%" },
];

export default function MarketInsightsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Data & Analysis</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">UK Property Market Insights</h1>
          <p className="text-navy-200">Regional house prices, rental yields, interest rate analysis, and market trends to inform your investment decisions.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Regional Market Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50">
                  <th className="text-left p-3 font-semibold text-navy-800">Region</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Avg Price</th>
                  <th className="text-left p-3 font-semibold text-navy-800">YoY Change</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Avg Rent (pcm)</th>
                  <th className="text-left p-3 font-semibold text-navy-800">Gross Yield</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r.name} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                    <td className="p-3 font-medium text-navy-800">{r.name}</td>
                    <td className="p-3 text-navy-600">{r.avgPrice}</td>
                    <td className="p-3 text-green-600 font-medium">{r.yoy}</td>
                    <td className="p-3 text-navy-600">{r.avgRent}</td>
                    <td className="p-3 font-semibold text-navy-800">{r.yield}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-navy-400 mt-4">Important: The figures shown are approximate and for illustrative purposes only. They are based on publicly available data from ONS, HM Land Registry, and the HomeLet Rental Index but may not reflect current market conditions. Always verify data from official sources and seek professional advice before making investment decisions.</p>
        </div>
      </section>

      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Key Market Indicators</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-800 mb-3">Bank of England Base Rate</h3>
              <p className="text-3xl font-bold text-navy-800 mb-2">4.50%</p>
              <p className="text-sm text-navy-500">The base rate directly influences mortgage rates. Markets are pricing in gradual cuts through 2025-2026, which would reduce mortgage costs and potentially stimulate demand.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-800 mb-3">UK Inflation (CPI)</h3>
              <p className="text-3xl font-bold text-navy-800 mb-2">3.5%</p>
              <p className="text-sm text-navy-500">Inflation affects both the real return on property investments and the Bank&apos;s rate decisions. Property historically acts as an inflation hedge, with rents and values tending to rise with the price level.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-800 mb-3">Average House Price (UK)</h3>
              <p className="text-3xl font-bold text-navy-800 mb-2">£290,000</p>
              <p className="text-sm text-navy-500">The UK average has shown moderate growth. Regional variation remains significant, with London and the South East at the highest absolute prices but northern regions showing stronger percentage growth.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-navy-800 mb-3">Housing Supply Gap</h3>
              <p className="text-3xl font-bold text-navy-800 mb-2">~150k/year</p>
              <p className="text-sm text-navy-500">The UK is building approximately 200,000 homes per year against a target of 300,000-370,000. This structural undersupply continues to support long-term property values and rental demand.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}


