import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import { YouTubeEmbed } from "@/components/blog/YouTubeEmbed";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "What Is the BRRR Strategy? A Complete UK Guide | PropertyVault UK",
  description: "The BRRR strategy explained for UK property investors. Buy, Refurbish, Rent, Refinance — learn how it works, the risks, and how to model your first deal.",
  keywords: "BRRR strategy UK, buy refurbish rent refinance, BRRR property investing, BRRR explained, BRRR calculator",
};

const faqs = [
  {
    q: "What does BRRR stand for in UK property investing?",
    a: "BRRR stands for Buy, Refurbish, Rent, Refinance. It is a strategy where you purchase a property below market value, renovate it to increase its value, let it to a tenant, and then refinance against the new higher value to recycle your original capital into your next deal.",
  },
  {
    q: "How much deposit do you need for a BRRR deal in the UK?",
    a: "For a standard BRRR deal you typically need to fund the purchase and refurbishment costs upfront — either with cash or bridging finance. After refinancing at 75% LTV on the new value, you recover most or all of your initial outlay. On a well-executed deal, you may have only a small amount of capital permanently tied up in the property.",
  },
  {
    q: "What is the 6-month rule for BRRR refinancing in the UK?",
    a: "Most mainstream buy-to-let mortgage lenders require you to have owned the property for at least 6 months before they will refinance it. This means you need bridging finance or cash to fund the purchase and refurbishment period. Some specialist lenders offer day-one refinance products but these typically carry higher rates.",
  },
  {
    q: "What are the biggest risks of the BRRR strategy?",
    a: "The main risks are refurbishment cost overruns, the property valuing lower than expected after refurbishment (meaning you cannot recycle as much capital), bridging finance costs if the project takes longer than planned, and interest rate changes between purchase and refinance. Thorough due diligence on purchase price, refurb costs, and comparable sales is essential.",
  },
  {
    q: "Can you use the BRRR strategy with a limited company in the UK?",
    a: "Yes, and many investors do. A limited company (SPV) can implement the BRRR strategy and benefits from full mortgage interest deductibility under corporation tax, unlike individual landlords affected by Section 24. However, limited company BTL mortgages are specialist products with slightly higher rates and fewer lender options than personal mortgages.",
  },
];

export default function BRRRArticle() {
  return (
    <>
      <BlogArticleHero
        title="What Is the BRRR Strategy? A Complete UK Guide"
        excerpt="Buy, Refurbish, Rent, Refinance explained — how it works, example deal, risks, and how to model your first BRRR deal."
        category="Investing"
        date="June 2026"
        readTime="8 min"
        image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
          <p className="text-lg">BRRR stands for <strong>Buy, Refurbish, Rent, Refinance</strong>. It is one of the most popular property investment strategies in the UK because it allows investors to recycle their capital and build a portfolio faster than traditional buy-to-let.</p>

          {/* Replace YOUTUBE_VIDEO_ID with your video ID once uploaded */}
          <YouTubeEmbed videoId="YOUTUBE_VIDEO_ID" title="BRRR Strategy Explained — UK Property Investing" />

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>How the BRRR Strategy Works</h2>
          <p>The concept is straightforward. You purchase a property below its market value — typically one that needs refurbishment. You renovate it to increase its value, rent it out to a tenant, and then refinance against the new higher value. The refinance releases most or all of your original investment, which you can then use to repeat the process with another property.</p>

          <h3 className="text-lg font-bold text-navy-800 mt-6">Step 1: Buy Below Market Value</h3>
          <p>The strategy only works if you purchase at a discount. You need to find properties selling below their true market value — often from motivated sellers, at auction, through estate agents, or via property sourcers. The bigger the discount, the more capital you can recycle when you refinance.</p>
          <p>Common sources of below market value (BMV) deals include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Property auctions (Allsop, SDL, Savills, local auctioneers)</li>
            <li>Estate agents — building relationships so you hear about deals first</li>
            <li>Direct-to-vendor marketing (leaflets, letters, social media)</li>
            <li>Property sourcers (typically charge £3,000-5,000 per deal)</li>
            <li>Probate properties and repossessions</li>
          </ul>

          <h3 className="text-lg font-bold text-navy-800 mt-6">Step 2: Refurbish to Add Value</h3>
          <p>The refurbishment phase is where you create value. The goal is to spend strategically so that every pound invested returns more than a pound in increased property value. Focus on improvements that surveyors recognise when they value the property:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Kitchen</strong> — new kitchen is the single biggest value driver (budget £3,000-8,000)</li>
            <li><strong>Bathroom</strong> — modern suite with tiling (budget £2,000-5,000)</li>
            <li><strong>Central heating</strong> — new boiler and radiators if needed (budget £2,500-4,000)</li>
            <li><strong>Rewire</strong> — often necessary in older properties (budget £2,500-4,500)</li>
            <li><strong>Decoration</strong> — neutral colours throughout (budget £1,500-3,000)</li>
            <li><strong>Flooring</strong> — LVT or carpet (budget £1,500-3,000)</li>
          </ul>
          <p>Always get at least three quotes from contractors, use a detailed specification document, and budget a 10-15% contingency for unexpected costs.</p>

          <h3 className="text-lg font-bold text-navy-800 mt-6">Step 3: Rent</h3>
          <p>Once refurbished, the property is let to a tenant at market rent. The rental income must comfortably cover the refinanced mortgage payment to produce positive monthly cash flow. Before letting, you must ensure the property is fully compliant:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Gas Safety Certificate (CP12) — annual requirement</li>
            <li>EICR (Electrical Installation Condition Report) — every 5 years</li>
            <li>EPC rating of E or above (C expected by 2028 for new tenancies)</li>
            <li>Smoke alarms on every floor, CO alarms where required</li>
            <li>Deposit protected in a government-approved scheme within 30 days</li>
            <li>Right to Rent checks on all adult occupants</li>
            <li>How to Rent guide provided to tenants</li>
          </ul>

          <h3 className="text-lg font-bold text-navy-800 mt-6">Step 4: Refinance</h3>
          <p>This is where the strategy pays off. A surveyor values the refurbished property at its new market value. You take out a new buy-to-let mortgage (typically at 75% loan-to-value) against this higher value. The mortgage funds are used to repay any bridging finance, and the remainder is returned to you as recycled capital.</p>
          <p><strong>Important:</strong> Most buy-to-let lenders require you to have owned the property for at least 6 months before refinancing. This is known as the &ldquo;6-month rule&rdquo;. Some specialist lenders offer &ldquo;day one refinance&rdquo; products, but these are less common and may come with higher rates.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Example BRRR Deal</h2>
          <div className="bg-navy-50 rounded-xl p-6 space-y-2 text-sm not-prose">
            <div className="flex justify-between"><span>Purchase price</span><span className="font-bold">£120,000</span></div>
            <div className="flex justify-between"><span>Refurbishment cost</span><span className="font-bold">£30,000</span></div>
            <div className="flex justify-between"><span>Purchase costs (stamp duty, legal, etc.)</span><span className="font-bold">£5,000</span></div>
            <div className="flex justify-between border-t border-navy-200 pt-2"><span className="font-bold">Total invested</span><span className="font-bold">£155,000</span></div>
            <div className="flex justify-between mt-3"><span>After repair value (ARV)</span><span className="font-bold text-green-600">£200,000</span></div>
            <div className="flex justify-between"><span>Refinance at 75% LTV</span><span className="font-bold">£150,000</span></div>
            <div className="flex justify-between border-t border-navy-200 pt-2"><span className="font-bold">Money left in deal</span><span className="font-bold text-gold-600">£5,000</span></div>
            <div className="flex justify-between"><span>Capital recycled</span><span className="font-bold text-green-600">96.8%</span></div>
          </div>
          <p className="text-xs text-navy-400">This is an illustrative example. Actual figures depend on property, location, and market conditions.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Risks of the BRRR Strategy</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Refurbishment overruns</strong> — costs can exceed budget, especially with older properties</li>
            <li><strong>Valuation risk</strong> — the surveyor may value the property lower than expected, meaning you cannot refinance out all your capital</li>
            <li><strong>Interest rate risk</strong> — if rates rise between purchase and refinance, your mortgage costs increase</li>
            <li><strong>Void periods</strong> — delays in finding a tenant mean holding costs with no income</li>
            <li><strong>Bridging finance costs</strong> — bridging loans are expensive (typically 0.5-1.5% per month); delays increase your total finance cost</li>
            <li><strong>Market decline</strong> — if property values fall during the refurbishment period, the ARV may be lower than projected</li>
          </ul>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Model Your BRRR Deal</h2>
          <p>Use our free BRRR Calculator to model any deal before you commit. Enter purchase price, refurb cost, ARV, rent, and mortgage details — see money left in, capital recycled, ROI, and monthly cash flow instantly.</p>
          <div className="not-prose flex flex-wrap gap-3 mt-4">
            <Link href="/calculators/brrr" className="btn-primary text-sm !py-2.5 !px-5">BRRR Calculator →</Link>
            <Link href="/brrr-academy" className="btn-outline text-sm !py-2.5 !px-5">Full BRRR Academy →</Link>
          </div>

          
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Calculators</h3>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <Link href="/calculators/deal-analyser" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Deal Analyser</p>
                <p className="text-xs text-navy-400 mt-0.5">Full deal breakdown</p>
              </Link>
              <Link href="/calculators/brrr" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">BRRR Calculator</p>
                <p className="text-xs text-navy-400 mt-0.5">Model your deal</p>
              </Link>
              <Link href="/calculators/bridging" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Bridging Loan</p>
                <p className="text-xs text-navy-400 mt-0.5">Finance costs</p>
              </Link>
            </div>
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/hmo-investing-uk" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Investing</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">HMO Investing UK</p>
              </Link>
              <Link href="/blog/section-24-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Tax</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Section 24 Explained</p>
              </Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </article>
    </>
  );
}


