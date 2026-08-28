import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "First-Time Buyer Guide UK — Step by Step | PropertyVault UK",
  description: "Complete first-time buyer guide. From saving a deposit to getting your keys. Mortgages, stamp duty relief, LISA, government schemes, and what to expect.",
  keywords: "first time buyer guide UK, how to buy first home, first time buyer mortgage, LISA property, first time buyer stamp duty",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/first-time-buyer-guide/" },
  openGraph: {
    title: "First-Time Buyer Guide UK — Step by Step | PropertyVault UK",
    description: "Complete first-time buyer guide. From saving a deposit to getting your keys. Mortgages, stamp duty relief, LISA, government schemes, and what to expect.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/first-time-buyer-guide/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "First-time buyer collecting house keys at front door" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "First-Time Buyer Guide UK — Step by Step | PropertyVault UK",
    description: "Complete first-time buyer guide. From saving a deposit to getting your keys. Mortgages, stamp duty relief, LISA, government schemes, and what to expect.",
  },
};

const faqs = [
  {
    q: "How much deposit do first-time buyers need in the UK?",
    a: "Most lenders require a minimum 5% deposit, though 10% unlocks significantly better mortgage rates. On a £250,000 property, a 5% deposit is £12,500 and a 10% deposit is £25,000. First-time buyers saving into a Lifetime ISA (LISA) can receive a 25% government bonus of up to £1,000 per year, making it one of the most effective savings vehicles available.",
  },
  {
    q: "Do first-time buyers pay stamp duty in the UK?",
    a: "First-time buyers in England pay no stamp duty on the first £300,000 of the purchase price and 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, the first-time buyer relief does not apply and standard rates are charged on the full amount. These thresholds apply from 1 April 2025.",
  },
  {
    q: "What is a mortgage Agreement in Principle (AIP) and do I need one?",
    a: "An Agreement in Principle (also called a Decision in Principle) is a written statement from a lender confirming how much they would be willing to lend you, subject to a full application and valuation. It involves a soft credit check and does not affect your credit score. Estate agents and sellers take offers more seriously from buyers who have an AIP, as it demonstrates you are financially prepared.",
  },
  {
    q: "What additional costs should first-time buyers budget for beyond the deposit?",
    a: "Beyond the deposit, first-time buyers should budget for a solicitor or conveyancer (£800–1,500), a survey (£400–1,500 depending on type), mortgage arrangement fees (£0–2,000), buildings insurance from exchange, and removal costs. On a £250,000 property with a 10% deposit, total costs including the deposit are typically £27,500–31,000.",
  },
  {
    q: "What is the difference between exchange and completion when buying a home?",
    a: "Exchange of contracts is the legally binding point at which both buyer and seller commit to the transaction. You pay your deposit (typically 10%) to your solicitor and neither party can pull out without significant financial penalty. Completion usually happens 1–4 weeks later, when your mortgage funds are drawn down, the balance is transferred, and you collect the keys.",
  },
];

export default function FTBArticle() {
  return (
    <>
      <BlogArticleHero
        title="First-Time Buyer Guide — Step by Step"
        excerpt="From saving a deposit and getting an AIP to completing your purchase. LISA, stamp duty relief, and what to expect."
        category="Buying"
        date="June 2026"
        readTime="6 min"
        image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80"
      />
      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">Buying your first home is one of the biggest financial decisions you will make. This guide walks you through the entire process — from saving a deposit to collecting your keys.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>1. Save Your Deposit</h2>
        <p>Most first-time buyer mortgages require a <strong>5-10% deposit</strong>. A 10-15% deposit will unlock better interest rates. For a £250,000 property, you need £12,500 at 5% or £25,000 at 10%.</p>
        <p><strong>Lifetime ISA (LISA):</strong> If you are aged 18-39, you can save up to £4,000 per year and receive a 25% government bonus (up to £1,000/year). The property must cost £450,000 or less. The LISA is one of the most effective tools for first-time buyers.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>2. Get a Mortgage Agreement in Principle</h2>
        <p>An AIP (also called Decision in Principle) confirms how much a lender is prepared to offer you. It involves a soft credit check and is usually valid for 60-90 days. Having an AIP makes your offer stronger and shows sellers you are serious.</p>
        <p>Most lenders will lend 4-4.5x your annual gross income. Use our <Link href="/calculators/affordability" className="text-gold-600 font-semibold">affordability calculator</Link> to estimate your borrowing capacity, and our <Link href="/calculators/mortgage" className="text-gold-600 font-semibold">mortgage calculator</Link> to model your monthly repayments.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>3. Find Your Property</h2>
        <p>Search on Rightmove, Zoopla, and OnTheMarket. Register with local estate agents so they call you before listings go online — this matters in fast-moving markets. Write down what matters (bedrooms, commute time, school catchment, parking, garden) before viewing so emotion doesn&apos;t cloud your judgement.</p>
        <p>When viewing, check: boiler age, EPC rating (anything below D will cost you to upgrade), mobile signal, signs of damp or recent plastering to hide it, and street parking at different times of day. Never view just once before offering.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>4. Make an Offer</h2>
        <p>Make your offer through the estate agent verbally and follow up in writing. Mention you are chain-free (as a first-time buyer you are) and confirm you have an AIP — this makes you a credible buyer.</p>
        <p>Your opening offer can be below the asking price, especially if the property has been on the market for a while. Check Rightmove/Zoopla for what similar properties have actually sold for, not just listed at. Negotiation is normal.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>5. Instruct a Solicitor and Arrange a Survey</h2>
        <p>Once an offer is accepted, instruct a solicitor (or conveyancer) immediately. They handle searches, review the seller&apos;s title, raise enquiries, and manage exchange and completion. Budget <strong>£800–1,500</strong>.</p>
        <p>Also arrange a survey. Three options:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Valuation only:</strong> Required by your lender — does NOT reveal defects. Don&apos;t rely on this alone.</li>
          <li><strong>Homebuyer Report (RICS Level 2):</strong> Highlights visible defects. Suitable for most standard properties. Cost: £400–750.</li>
          <li><strong>Building Survey (RICS Level 3):</strong> Full structural inspection. Best for older, unusual, or extended properties. Cost: £600–1,500.</li>
        </ul>
        <p>A survey can reveal issues that allow you to renegotiate the price before you&apos;re committed. It is almost always worth the money.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>6. Exchange and Complete</h2>
        <p><strong>Exchange</strong> is the legally binding moment. You pay your deposit (typically 10%) to your solicitor, who transfers it to the seller. Neither party can pull out after this point without significant penalty.</p>
        <p><strong>Completion</strong> happens 1–4 weeks after exchange. Your mortgage funds are drawn down, the balance transferred, and you collect the keys. <Link href="/calculators/stamp-duty" className="text-gold-600 font-semibold">Stamp duty</Link> must be paid within 14 days of completion — your solicitor handles this.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>7. Budget for Additional Costs</h2>
        <p>The deposit is not the only cost. For a £250,000 property with a 10% deposit, budget roughly <strong>£27,500–31,000 total</strong>:</p>
        <div className="not-prose bg-navy-50 rounded-xl p-5">
          <table className="w-full text-sm"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Cost</th><th className="text-right py-2">Typical Range</th></tr></thead><tbody>
            <tr className="border-b border-navy-100"><td className="py-2">Deposit (10%)</td><td className="py-2 text-right">£25,000</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">Solicitor/conveyancer</td><td className="py-2 text-right">£800–1,500</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">Survey (Homebuyer/Building)</td><td className="py-2 text-right">£400–1,500</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">Mortgage arrangement fee</td><td className="py-2 text-right">£0–2,000</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">Stamp duty (first-time buyer, under £300k)</td><td className="py-2 text-right">£0</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">Buildings insurance (from exchange)</td><td className="py-2 text-right">£150–400/yr</td></tr>
            <tr><td className="py-2">Removals</td><td className="py-2 text-right">£300–1,500</td></tr>
          </tbody></table>
        </div>

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

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        <HelpCTA />
      </div></article>
    </>
  );
}


