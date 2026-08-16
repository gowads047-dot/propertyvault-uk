import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  alternates: { canonical: "https://propertyvaultuk.co.uk/blog/deal-sourcing-uk-guide/" },
  title: "Deal Sourcing UK — Complete Beginner Guide 2026 | PropertyVault Academy",
  description: "What is property deal sourcing in the UK? How it works, how much you can earn, what's legal, and how to source your first deal. Complete beginner guide from PropertyVault Academy.",
  keywords: "deal sourcing UK guide, property deal sourcing beginners, how to become a deal sourcer UK, deal sourcing income UK, property deal sourcing legal UK",
  openGraph: {
    title: "Deal Sourcing UK — Complete Beginner Guide 2026 | PropertyVault Academy",
    description: "What is property deal sourcing in the UK? How it works, how much you can earn, what's legal, and how to source your first deal. Complete beginner guide from PropertyVault Academy.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/blog/deal-sourcing-uk-guide/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Deal Sourcing UK Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deal Sourcing UK — Complete Beginner Guide 2026 | PropertyVault Academy",
    description: "What is property deal sourcing in the UK? How it works, how much you can earn, what's legal, and how to source your first deal. Complete beginner guide from PropertyVault Academy.",
  },
};

const faqs = [
  { q: "What is property deal sourcing in the UK?", a: "Property deal sourcing is finding below-market-value or high-cashflow property deals and passing them to investors in exchange for a fee (typically £2,000–£10,000 per deal). The deal sourcer does not buy the property — they connect motivated sellers with investors who have the capital, then charge a fee for the introduction." },
  { q: "Is deal sourcing legal in the UK?", a: "Yes — property deal sourcing is legal in the UK. However, deal sourcers who regularly introduce clients to property investments may need to comply with Financial Conduct Authority (FCA) regulations and register with a Property Redress Scheme (PRS). Professional deal sourcers should take proper legal advice and ensure their contracts, marketing, and fee structures comply with current legislation." },
  { q: "How much does a deal sourcer earn in the UK?", a: "Typical deal sourcing fees range from £2,000 to £10,000 per deal, depending on the deal quality, location, and investor demand. Experienced sourcers completing 2–4 deals per month can earn £4,000–£40,000/month. Beginner sourcers typically complete their first deal within 3–6 months of starting." },
  { q: "Do I need money to start deal sourcing?", a: "No — deal sourcing is specifically appealing because it requires minimal capital to start. You need time to find motivated sellers and build an investor network, plus modest costs for marketing (leaflets, online ads, a website). Many successful sourcers start with under £500 in initial costs." },
  { q: "How do I find motivated sellers for deal sourcing?", a: "Key strategies include: direct to vendor marketing (leaflets, letters, online ads targeting distressed sellers), estate agent relationships (asking agents to pass on deals that need quick sale), probate and divorce solicitors, landlords selling portfolios, and auction catalogue research. Building a pipeline of motivated seller leads is the core skill in deal sourcing." },
];

export default function DealSourcingGuideArticle() {
  return (
    <>
      <BlogArticleHero
        title="Deal Sourcing UK — Complete Beginner Guide 2026"
        excerpt="What deal sourcing actually is, how much you can earn, what's legal, and how to get started — even with no money and no experience."
        category="Academy"
        date="June 2026"
        readTime="10 min"
        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">

          <p className="text-lg">Deal sourcing is one of the few genuine ways to enter property investment without buying a property. Done properly, experienced sourcers earn £3,000–£8,000 per deal for connecting motivated sellers with investors — and the entire business can be started from a laptop.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Is Deal Sourcing?</h2>
          <p>A deal sourcer finds property opportunities — typically below-market-value or high-yielding buy-to-lets — and packages them for investors who have capital to deploy but not the time or local knowledge to find deals themselves.</p>
          <p>The sourcer never buys the property. They find the deal, run the numbers, and present it to an investor. When the investor buys, the sourcer receives a sourcing fee — typically £2,000–£10,000 depending on deal quality and location.</p>

          <div className="not-prose bg-navy-800 rounded-xl p-5 text-white text-sm">
            <p className="font-bold text-gold-400 mb-3">Example deal sourcing transaction</p>
            <ol className="space-y-2 text-white/80">
              <li><strong className="text-white">1.</strong> Sourcer finds motivated seller: 3-bed in Derby, valued at £140k, seller wants quick sale at £110k</li>
              <li><strong className="text-white">2.</strong> Sourcer runs numbers: rental value £850/month, yield 9.3% at £110k purchase</li>
              <li><strong className="text-white">3.</strong> Sourcer packages deal with comparable evidence, floor plan, photos, and financial analysis</li>
              <li><strong className="text-white">4.</strong> Sourcer presents to investor from their buyers list — investor agrees to buy</li>
              <li><strong className="text-white">5.</strong> Solicitors exchange contracts — sourcer collects £3,500 sourcing fee</li>
            </ol>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Is Deal Sourcing Legal?</h2>
          <p>Yes — deal sourcing is legal. But there are important compliance requirements that professional sourcers must follow:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Property Redress Scheme:</strong> If you regularly arrange property transactions for clients, you may need to register with a redress scheme</li>
            <li><strong>FCA authorisation:</strong> Introducing investors to regulated investments can require FCA authorisation — take proper legal advice</li>
            <li><strong>Written agreements:</strong> Always use written introduction agreements with both sellers and buyers, specifying fee amounts and conditions</li>
            <li><strong>AML checks:</strong> Anti-money laundering regulations apply — you must verify identities</li>
          </ul>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>How Much Can You Earn?</h2>
          <p>Sourcing fees typically range from £2,000 to £10,000 per deal, based on deal quality, discount achieved, and investor demand in the area. Here are realistic income scenarios:</p>
          <div className="not-prose grid sm:grid-cols-3 gap-4">
            {[
              { level: "Beginner", deals: "1/month", fee: "£2,500", annual: "£30,000" },
              { level: "Established", deals: "3/month", fee: "£3,500", annual: "£126,000" },
              { level: "Advanced", deals: "6/month", fee: "£5,000", annual: "£360,000" },
            ].map(s => (
              <div key={s.level} className="bg-navy-50 rounded-xl p-4 text-center">
                <p className="font-bold text-navy-800 text-sm mb-2">{s.level}</p>
                <p className="text-xs text-navy-500 mb-1">{s.deals} · {s.fee} avg fee</p>
                <p className="text-xl font-bold text-gold-600">{s.annual}/yr</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>The 4 Core Skills</h2>
          <div className="not-prose space-y-3">
            {[
              { n: "1", title: "Finding motivated sellers", body: "People who need to sell quickly — probate, divorce, relocation, financial difficulty, problem tenants. The deal only exists because the seller's need for speed outweighs their desire for top price." },
              { n: "2", title: "Running the numbers correctly", body: "Yield, cash flow, potential uplift, comparable sales, rental comps. A deal only has value if the investor's numbers work. Getting this wrong destroys your reputation." },
              { n: "3", title: "Building a buyers list", body: "An active list of investors ready to move. A deal without a buyer is worthless. Most successful sourcers spend as much time building investor relationships as finding deals." },
              { n: "4", title: "Packaging professionally", body: "How you present a deal determines whether an investor trusts you enough to buy. Professional deal packs include financials, photos, local comparables, planning research, and a clear investment summary." },
            ].map(s => (
              <div key={s.n} className="flex gap-4 bg-white border border-navy-100 rounded-xl p-4">
                <span className="w-8 h-8 rounded-full bg-gold-400 text-navy-900 text-sm font-bold flex items-center justify-center flex-shrink-0">{s.n}</span>
                <div>
                  <p className="font-bold text-navy-800 text-sm">{s.title}</p>
                  <p className="text-xs text-navy-500 mt-1">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Getting Structured Training</h2>
          <p>Deal sourcing can absolutely be self-taught — but the learning curve is steep. Knowing the legal structure, the right contract wording, how to properly value a deal, and how to avoid sourcing for free (delivering a deal and getting ghosted) are lessons that cost experienced sourcers thousands before they learned them.</p>
          <p>PropertyVault Academy is a 12-module programme that covers every stage from zero to first deal — built around what actually works in the UK Midlands market right now.</p>
          <div className="not-prose flex flex-wrap gap-3 mt-4">
            <Link href="/academy" className="btn-gold">Explore the Academy →</Link>
            <Link href="/calculators/deal-analyser" className="btn-outline">Free Deal Analyser tool →</Link>
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Resources</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <Link href="/calculators/deal-analyser" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Calculator</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Deal Analyser Tool</p>
              </Link>
              <Link href="/calculators/rental-yield" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Calculator</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Rental Yield Calculator</p>
              </Link>
              <Link href="/calculators/brrr" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Calculator</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">BRRR Calculator</p>
              </Link>
              <Link href="/calculators/btl-mortgage" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Calculator</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">BTL Mortgage Stress Test</p>
              </Link>
              <Link href="/calculators/bridging" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Calculator</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Bridging Loan Calculator</p>
              </Link>
              <Link href="/academy" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Academy</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">PropertyVault Academy</p>
              </Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="general" />
        </div>
      </article>
    </>
  );
}
