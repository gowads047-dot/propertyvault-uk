import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "First-Time Buyer Guide UK — Step by Step | PropertyVault UK",
  description: "Complete first-time buyer guide. From saving a deposit to getting your keys. Mortgages, stamp duty relief, LISA, government schemes, and what to expect.",
  keywords: "first time buyer guide UK, how to buy first home, first time buyer mortgage, LISA property, first time buyer stamp duty",
};

export default function FTBArticle() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16"><div className="container-max px-4"><div className="max-w-3xl">
        <Link href="/blog" className="text-gold-400 text-sm font-medium hover:text-gold-300 mb-3 inline-block">← Back to Blog</Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>First-Time Buyer Guide — Step by Step to Your First Home</h1>
        <p className="text-navy-200">Everything you need to know about buying your first property in England or Wales.</p>
      </div></div></section>

      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">Buying your first home is one of the biggest financial decisions you will make. This guide walks you through the entire process — from saving a deposit to collecting your keys.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>1. Save Your Deposit</h2>
        <p>Most first-time buyer mortgages require a <strong>5-10% deposit</strong>. A 10-15% deposit will unlock better interest rates. For a £250,000 property, you need £12,500 at 5% or £25,000 at 10%.</p>
        <p><strong>Lifetime ISA (LISA):</strong> If you are aged 18-39, you can save up to £4,000 per year and receive a 25% government bonus (up to £1,000/year). The property must cost £450,000 or less. The LISA is one of the most effective tools for first-time buyers.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>2. Get a Mortgage Agreement in Principle</h2>
        <p>An AIP (also called Decision in Principle) confirms how much a lender is prepared to offer you. It involves a soft credit check and is usually valid for 60-90 days. Having an AIP makes your offer stronger and shows sellers you are serious.</p>
        <p>Most lenders will lend 4-4.5x your annual gross income. Use our affordability calculator to estimate your borrowing capacity.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>3. Find Your Property</h2>
        <p>Search on Rightmove, Zoopla, and OnTheMarket. Register with local estate agents. Attend viewings with our property viewing checklist to make sure you don&apos;t miss anything important.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>4. Budget for Additional Costs</h2>
        <p>The deposit is not the only cost. Budget for:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Solicitor/conveyancer fees:</strong> £800-1,500</li>
          <li><strong>Survey:</strong> £400-1,500 depending on type</li>
          <li><strong>Mortgage arrangement fee:</strong> £0-2,000</li>
          <li><strong>Stamp duty:</strong> £0 on first £300,000 for first-time buyers</li>
          <li><strong>Buildings insurance:</strong> required from exchange (£150-400/year)</li>
          <li><strong>Removal costs:</strong> £300-1,500</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Useful Tools for First-Time Buyers</h2>
        <div className="not-prose flex flex-wrap gap-3 mt-4">
          <Link href="/calculators/affordability" className="btn-primary text-sm !py-2.5 !px-5">Affordability Calculator →</Link>
          <Link href="/calculators/stamp-duty" className="btn-outline text-sm !py-2.5 !px-5">Stamp Duty Calculator →</Link>
          <Link href="/calculators/moving-costs" className="btn-outline text-sm !py-2.5 !px-5">Moving Cost Calculator →</Link>
          <Link href="/first-time-buyer" className="btn-outline text-sm !py-2.5 !px-5">Full FTB Guide →</Link>
        </div>

        
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/stamp-duty-guide" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Finance</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Stamp Duty Guide</p>
              </Link>
              <Link href="/blog/biggest-financial-lie-britain" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Opinion</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">The Biggest Financial Lie</p>
              </Link>
            </div>
          </div>

          <Disclaimer type="financial" />
      </div></article>
    </>
  );
}

