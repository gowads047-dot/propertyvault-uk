import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Property Case Studies UK — Illustrative Investment Examples",
  description: "Illustrative UK property investment case studies. BRRR deals, buy-to-let purchases, and HMO conversions with example numbers to show how strategies work.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/case-studies/" },
  openGraph: {
    title: "Property Case Studies UK — Illustrative Investment Examples",
    description: "Illustrative UK property investment case studies. BRRR deals, buy-to-let purchases, and HMO conversions with example numbers to show how strategies work.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/case-studies/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Case Studies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Case Studies UK — Illustrative Investment Examples",
    description: "Illustrative UK property investment case studies. BRRR deals, buy-to-let purchases, and HMO conversions with example numbers to show how strategies work.",
  },
};

const caseStudies = [
  {
    title: "BRRR Deal: Manchester Terraced House",
    strategy: "BRRR",
    investor: "James R.",
    summary: "Purchased a run-down 2-bed terrace in Salford for £95,000 using bridging finance. Spent £25,000 on a full refurbishment including new kitchen, bathroom, rewire, and central heating. Rented for £800/month. Revalued at £145,000 and refinanced at 75% LTV, pulling out £108,750 — recovering all capital plus £8,750 surplus.",
    metrics: [
      { label: "Purchase", value: "£95,000" },
      { label: "Refurb", value: "£25,000" },
      { label: "ARV", value: "£145,000" },
      { label: "Monthly Cash Flow", value: "£285" },
      { label: "Capital Recycled", value: "107%" },
      { label: "ROI", value: "Infinite" },
    ],
  },
  {
    title: "HMO Conversion: Leeds Victorian Semi",
    strategy: "HMO",
    investor: "Sarah & Tom K.",
    summary: "Bought a large 4-bed Victorian semi near Leeds University for £185,000. Converted to a 6-bed HMO with en-suite shower rooms at a cost of £55,000. Licensed with Leeds City Council. Each room lets for £525-600/month including bills, generating £3,300/month total.",
    metrics: [
      { label: "Purchase", value: "£185,000" },
      { label: "Conversion", value: "£55,000" },
      { label: "Monthly Income", value: "£3,300" },
      { label: "Monthly Costs", value: "£1,800" },
      { label: "Monthly Profit", value: "£1,500" },
      { label: "Gross Yield", value: "16.5%" },
    ],
  },
  {
    title: "Buy-to-Let: Birmingham City Apartment",
    strategy: "Buy-to-Let",
    investor: "Michael T.",
    summary: "Purchased a modern 2-bed apartment in Birmingham's Jewellery Quarter for £195,000 with a 25% deposit (£48,750). BTL mortgage at 5.2% interest-only. Rented through an agent at £1,050/month. After all costs, generates consistent positive cash flow.",
    metrics: [
      { label: "Purchase", value: "£195,000" },
      { label: "Deposit", value: "£48,750" },
      { label: "Monthly Rent", value: "£1,050" },
      { label: "Monthly Mortgage", value: "£633" },
      { label: "Net Cash Flow", value: "£197/month" },
      { label: "Gross Yield", value: "6.5%" },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Real Results</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Property Case Studies</h1>
          <p className="text-navy-200">Illustrative examples showing how different property investment strategies work in practice. Numbers are based on typical UK market scenarios.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="space-y-8">
            {caseStudies.map((cs) => (
              <div key={cs.title} className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-gold-50 text-gold-700 text-xs font-bold rounded-full">{cs.strategy}</span>
                    <span className="text-xs text-navy-400">by {cs.investor}</span>
                  </div>
                  <h2 className="text-xl font-bold text-navy-800 mb-3">{cs.title}</h2>
                  <p className="text-sm text-navy-600 leading-relaxed mb-6">{cs.summary}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="bg-navy-50 rounded-lg p-3">
                        <p className="text-xs text-navy-500">{m.label}</p>
                        <p className="font-bold text-navy-800">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-6 text-center">These case studies are illustrative examples based on typical UK market scenarios. They are not real transactions. Actual results will vary significantly depending on location, market conditions, and individual circumstances. Past performance does not guarantee future results. Always conduct your own due diligence and seek professional advice.</p>
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


