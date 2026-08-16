import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "First-Time Buyer Guide UK — Step by Step to Your First Home | PropertyVault",
  description: "Complete first-time buyer guide. Saving a deposit, mortgages, government schemes, the buying process, stamp duty relief, and tips for getting on the property ladder.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/first-time-buyer/" },
  openGraph: {
    title: "First-Time Buyer Guide UK — Step by Step to Your First Home | PropertyVault",
    description: "Complete first-time buyer guide. Saving a deposit, mortgages, government schemes, the buying process, stamp duty relief, and tips for getting on the property ladder.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/first-time-buyer/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "First-Time Buyer UK Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "First-Time Buyer Guide UK — Step by Step to Your First Home | PropertyVault",
    description: "Complete first-time buyer guide. Saving a deposit, mortgages, government schemes, the buying process, stamp duty relief, and tips for getting on the property ladder.",
  },
};

export default function FirstTimeBuyerPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Buyer Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">First-Time Buyer Hub</h1>
            <p className="text-navy-200 text-lg">Your step-by-step guide to buying your first home in the UK. From saving a deposit to getting your keys — everything you need to know in one place.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Step 1: Save Your Deposit</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Most first-time buyer mortgages require a 5-10% deposit, though 10-15% will unlock better interest rates. For a £250,000 property, you need £12,500 at 5% or £25,000 at 10%.</p>
              <p><strong>Lifetime ISA:</strong> Save up to £4,000 per year and receive a 25% government bonus (up to £1,000/year). Must be aged 18-39 to open, and the property must cost £450,000 or less. The bonus can add significantly to your deposit over several years.</p>
              <p><strong>Bank of Mum and Dad:</strong> Around 50% of first-time buyers receive help from family. Gifted deposits are accepted by most lenders with a signed gift letter confirming no repayment is expected.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Step 2: Get a Mortgage Agreement in Principle</h2>
            <p className="text-navy-600 leading-relaxed">An AIP (also called a Decision in Principle) confirms how much a lender is willing to offer you. It involves a soft credit check and assessment of your income and outgoings. Most AIPs are valid for 60-90 days and make your offer stronger when competing with other buyers.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Step 3: Find Your Property</h2>
            <p className="text-navy-600 leading-relaxed">Search on Rightmove, Zoopla, and OnTheMarket. Register with local estate agents. Attend viewings and assess the property for structural issues, location quality, transport links, and future development nearby. Never feel pressured to make a quick decision.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Step 4: Make an Offer</h2>
            <p className="text-navy-600 leading-relaxed">Research comparable sold prices to inform your offer. Consider the property&apos;s time on market, seller motivation, and local market conditions. Your offer is not legally binding until contracts are exchanged.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Step 5: Surveys and Legal Work</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p><strong>Mortgage Valuation:</strong> Your lender will instruct a basic valuation (sometimes free) to confirm the property is adequate security for the loan.</p>
              <p><strong>Homebuyer Survey (Level 2):</strong> A more detailed inspection covering the property&apos;s condition, defects, and maintenance issues. Recommended for most purchases (£400-700).</p>
              <p><strong>Building Survey (Level 3):</strong> The most comprehensive survey. Recommended for older, larger, or unusual properties (£600-1,500).</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">First-Time Buyer Stamp Duty Relief</h2>
            <p className="text-navy-600 leading-relaxed">From 1 April 2025, first-time buyers pay no stamp duty on the first £300,000, and 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, the relief does not apply and standard rates are charged. The temporary higher thresholds (£425,000 / £625,000) ended on 31 March 2025.</p>
            <Link href="/calculators/stamp-duty" className="inline-block text-gold-600 font-semibold text-sm mt-2">Calculate your stamp duty →</Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Budget for Additional Costs</h2>
            <ul className="list-disc pl-6 space-y-2 text-navy-600">
              <li><strong>Solicitor/conveyancer fees:</strong> £800-1,500</li>
              <li><strong>Survey:</strong> £400-1,500 depending on type</li>
              <li><strong>Mortgage arrangement fee:</strong> £0-2,000</li>
              <li><strong>Stamp duty:</strong> see calculator above</li>
              <li><strong>Removal costs:</strong> £300-1,500</li>
              <li><strong>Furniture and essentials:</strong> £2,000-10,000</li>
              <li><strong>Buildings insurance:</strong> required from exchange (£150-400/year)</li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <Link href="/calculators/mortgage" className="btn-primary text-lg !py-4 !px-8">Calculate Your Mortgage →</Link>
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


