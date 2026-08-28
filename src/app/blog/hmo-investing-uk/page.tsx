import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "HMO Investing UK — Is It Still Profitable?",
  description: "HMO investing explained. Licensing, room sizes, fire safety, yields, and whether Houses in Multiple Occupation are still worth it for UK landlords.",
  keywords: "HMO investing UK, HMO yield, HMO licensing, houses in multiple occupation, HMO calculator",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/hmo-investing-uk/" },
  openGraph: {
    title: "HMO Investing UK — Is It Still Profitable?",
    description: "HMO investing explained. Licensing, room sizes, fire safety, yields, and whether Houses in Multiple Occupation are still worth it for UK landlords.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/hmo-investing-uk/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "HMO house in multiple occupation exterior UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMO Investing UK — Is It Still Profitable?",
    description: "HMO investing explained. Licensing, room sizes, fire safety, yields, and whether Houses in Multiple Occupation are still worth it for UK landlords.",
  },
};

const faqs = [
  {
    q: "What is an HMO and when does it require a licence in the UK?",
    a: "A House in Multiple Occupation (HMO) is a property rented to three or more people from two or more separate households who share facilities such as a kitchen or bathroom. Mandatory HMO licensing in England applies to properties with five or more occupants from two or more households. Many councils also operate additional licensing schemes covering smaller HMOs — always check with your local authority before purchasing.",
  },
  {
    q: "What yields can HMO investors achieve in the UK?",
    a: "HMOs typically achieve gross yields of 10–18%, significantly higher than the 4–8% achievable on standard single-let buy-to-let properties. Net yields after management, Council Tax (often the landlord's responsibility in HMOs), maintenance, licensing, and voids are typically 7–13%. The yield premium over single-lets compensates for the additional complexity and compliance obligations.",
  },
  {
    q: "What are Article 4 Directions and how do they affect HMO investors?",
    a: "Article 4 Directions are planning designations used by many councils to remove the permitted development right to convert a family home (Use Class C3) to an HMO (Use Class C4). In areas covered by Article 4, you need full planning permission — not just an HMO licence — before converting. Planning can be refused. Birmingham, Nottingham, Leicester, and most major UK cities have Article 4 Directions covering significant areas. Always check with the local planning authority before purchasing.",
  },
  {
    q: "What are the minimum room sizes required in an HMO?",
    a: "Under the Management of Houses in Multiple Occupation (England) Regulations, single bedrooms for one person aged 10 or over must be at least 6.51 m², and double bedrooms for two people aged 10 or over must be at least 10.22 m². Rooms below these sizes cannot be used as sleeping accommodation. Local councils can also impose stricter standards than the national minimum.",
  },
  {
    q: "Do HMO landlords pay Council Tax?",
    a: "In most cases yes. Where rooms are let individually on separate Assured Shorthold Tenancy agreements — the most common HMO structure — the landlord is typically liable for Council Tax rather than the tenants. This adds £1,000–2,500 per year depending on the property's council tax band and local rates. It is fully deductible as a business expense but must be factored into cash flow projections from the outset.",
  },
];

export default function HMOArticle() {
  return (
    <>
      <BlogArticleHero
        title="HMO Investing UK — Is It Still Profitable?"
        excerpt="HMO licensing, minimum room sizes, fire safety requirements, yield comparison with single-lets."
        category="Investing"
        date="June 2026"
        readTime="7 min"
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80"
      />
      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">A House in Multiple Occupation (HMO) is a property rented to <strong>3 or more people from 2 or more separate households</strong> who share facilities such as a kitchen or bathroom. HMOs typically generate significantly higher rental yields than single-let properties because you charge rent per room rather than per property.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>HMO Licensing Requirements</h2>
        <p><strong>Mandatory licensing</strong> is required in England for HMOs with 5 or more people from 2 or more separate households. This applies regardless of the number of storeys.</p>
        <p><strong>Additional licensing</strong> schemes operate in many local authority areas, covering smaller HMOs (3-4 people). You must check with your local council whether additional licensing applies in your area.</p>
        <p><strong>Selective licensing</strong> schemes require all privately rented properties (not just HMOs) to be licensed in certain areas.</p>
        <p>Operating an HMO without the required licence is a criminal offence carrying unlimited fines. Tenants can also apply for Rent Repayment Orders to recover up to 12 months&apos; rent.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Minimum Room Sizes</h2>
        <p>The Management of Houses in Multiple Occupation (England) Regulations 2006 set minimum room sizes:</p>
        <div className="not-prose bg-navy-50 rounded-xl p-5">
          <table className="w-full text-sm"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Room Use</th><th className="text-left py-2">Minimum Size</th></tr></thead><tbody>
            <tr className="border-b border-navy-200"><td className="py-2">Single bedroom (1 person aged 10+)</td><td className="py-2">6.51 m²</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Double bedroom (2 persons aged 10+)</td><td className="py-2">10.22 m²</td></tr>
            <tr><td className="py-2">Child under 10</td><td className="py-2">4.64 m²</td></tr>
          </tbody></table>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Fire Safety Requirements</h2>
        <p>HMOs have stricter fire safety requirements than single-let properties:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Fire doors (FD30S rated, self-closing) on all bedrooms, kitchens, and living rooms</li>
          <li>Interlinked fire detection system (Grade A in larger HMOs)</li>
          <li>Emergency lighting on escape routes</li>
          <li>Fire blanket in the kitchen</li>
          <li>Fire extinguishers on each floor</li>
          <li>Clear, unobstructed escape routes</li>
          <li>Fire risk assessment reviewed annually</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Article 4 Directions — A Critical Pre-Purchase Check</h2>
        <p>Many councils have introduced <strong>Article 4 Directions</strong> that remove permitted development rights for converting a dwelling to an HMO. This means you need <strong>planning permission</strong> before converting — not just a licence. Councils can refuse. Always check with the local planning authority before purchasing a property you intend to convert. Birmingham, Nottingham, Leicester, Sheffield, and most other major cities have Article 4 Directions covering significant areas.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>HMO Finance — What to Expect</h2>
        <p>HMO mortgages are specialist products not available through standard BTL lenders. Use our <Link href="/calculators/mortgage" className="text-gold-600 font-semibold">mortgage calculator</Link> to model your monthly payments before you approach a lender:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Typically require a <strong>25-30% deposit</strong></li>
          <li>Interest rates are <strong>0.5-1.5% higher</strong> than standard BTL rates</li>
          <li>Lenders stress test on projected HMO rental income, not single-let comparables</li>
          <li>Most HMO landlords use <strong>interest-only mortgages</strong> to maximise monthly cash flow</li>
        </ul>
        <p>Licensing costs vary by council but budget <strong>£500–1,200 per licence</strong> (covering 5 years in most areas) — a deductible business expense, but a real upfront cost to factor in.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Council Tax — Don&apos;t Get Caught Out</h2>
        <p>For room-by-room ASTs (the most common HMO structure), the <strong>landlord pays Council Tax</strong> in most councils. This is deductible as an expense but adds £1,000–2,500/year to running costs depending on the property&apos;s band — a figure many first-time HMO investors miss. Always confirm Council Tax liability with the local council and factor it into your cash flow projections.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Is HMO Investing Still Profitable?</h2>
        <p>Yes, but margins are tighter than they were five years ago. The yield premium over single-lets remains significant enough to justify the complexity:</p>
        <div className="not-prose bg-navy-50 rounded-xl p-5 text-sm">
          <table className="w-full"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Type</th><th className="text-right py-2">Gross Yield</th><th className="text-right py-2">Net Yield (est.)</th></tr></thead><tbody>
            <tr className="border-b border-navy-100"><td className="py-2">Single-let (standard BTL)</td><td className="py-2 text-right">4–8%</td><td className="py-2 text-right">3–6%</td></tr>
            <tr><td className="py-2">HMO (per-room letting)</td><td className="py-2 text-right">10–18%</td><td className="py-2 text-right">7–13%</td></tr>
          </tbody></table>
          <p className="text-xs text-navy-500 mt-2">Net yield assumes management, maintenance, Council Tax (if landlord-liable), licensing, insurance, and voids.</p>
        </div>
        <p className="mt-4">The key is thorough due diligence, accurate cost modelling, and compliance with all licensing and safety requirements before you commit to the purchase. Run your numbers through our <Link href="/calculators/hmo-yield" className="text-gold-600 font-semibold">HMO yield calculator</Link> to see your projected gross and net returns.</p>

        <div className="not-prose flex flex-wrap gap-3 mt-6">
          <Link href="/calculators/hmo-yield" className="btn-primary text-sm !py-2.5 !px-5">HMO Yield Calculator →</Link>
          <Link href="/hmo-hub" className="btn-outline text-sm !py-2.5 !px-5">Full HMO Guide →</Link>
        </div>

        
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Investing</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">BRRR Strategy Explained</p>
              </Link>
              <Link href="/blog/epc-c-deadline-landlords" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Landlords</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">EPC C Deadline for Landlords</p>
              </Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
      </div></article>
    </>
  );
}


