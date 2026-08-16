import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Property Valuation UK — Instant Online Estimates | PropertyVault UK",
  description: "Get a free instant property valuation using official tools from Zoopla, Rightmove, and HM Land Registry. Compare estimates from multiple sources.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/valuation/" },
  openGraph: {
    title: "Free Property Valuation UK — Instant Online Estimates | PropertyVault UK",
    description: "Get a free instant property valuation using official tools from Zoopla, Rightmove, and HM Land Registry. Compare estimates from multiple sources.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/valuation/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Valuation Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Property Valuation UK — Instant Online Estimates | PropertyVault UK",
    description: "Get a free instant property valuation using official tools from Zoopla, Rightmove, and HM Land Registry. Compare estimates from multiple sources.",
  },
};

export default function ValuationPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">How Much Is Your Property Worth?</h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto mb-8">
            Get free instant valuations from the UK&apos;s leading property tools. We recommend checking multiple sources for the most accurate picture.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Free Valuation Tools</h2>
          <div className="space-y-4">
            <a href="https://www.zoopla.co.uk/house-prices/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-navy-100 hover:shadow-lg hover:border-gold-400/30 transition-all">
              <div>
                <h3 className="font-bold text-navy-800 text-lg">Zoopla Estimate</h3>
                <p className="text-sm text-navy-500">Automated valuation based on sold prices, local market data, and property features. Most widely used free tool.</p>
              </div>
              <svg className="w-5 h-5 text-navy-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href="https://www.rightmove.co.uk/house-prices.html" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-navy-100 hover:shadow-lg hover:border-gold-400/30 transition-all">
              <div>
                <h3 className="font-bold text-navy-800 text-lg">Rightmove Sold Prices</h3>
                <p className="text-sm text-navy-500">See what your property and neighbours sold for historically. Best for comparable evidence.</p>
              </div>
              <svg className="w-5 h-5 text-navy-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href="https://landregistry.data.gov.uk/app/ppd" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-navy-100 hover:shadow-lg hover:border-gold-400/30 transition-all">
              <div>
                <h3 className="font-bold text-navy-800 text-lg">HM Land Registry</h3>
                <p className="text-sm text-navy-500">Official government sold price data. Every transaction in England and Wales. The most authoritative source.</p>
              </div>
              <svg className="w-5 h-5 text-navy-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a href="https://www.mouseprice.com/house-prices" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-navy-100 hover:shadow-lg hover:border-gold-400/30 transition-all">
              <div>
                <h3 className="font-bold text-navy-800 text-lg">MousePrice</h3>
                <p className="text-sm text-navy-500">Free automated valuations with confidence ranges. Also shows rental estimates.</p>
              </div>
              <svg className="w-5 h-5 text-navy-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>

          <div className="bg-navy-50 rounded-xl p-6 mt-8">
            <h3 className="font-bold text-navy-800 mb-2">For an Accurate Valuation</h3>
            <p className="text-sm text-navy-600">Online estimates are useful guides but can be inaccurate. For a formal valuation — especially before selling, refinancing, or for tax purposes — instruct a <strong>RICS-registered chartered surveyor</strong>. A professional valuation typically costs £250-500 and is the only valuation accepted by mortgage lenders.</p>
            <Link href="/find-agent" className="inline-block text-sm font-semibold text-gold-600 mt-2">Find a RICS Surveyor →</Link>
          </div>

          <p className="text-xs text-navy-400 text-center mt-6">PropertyVault is not affiliated with these tools. Links open on external websites.</p>
        </div>
      </section>
    </>
  );
}
