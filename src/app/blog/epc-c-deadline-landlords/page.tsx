import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "EPC C Deadline 2030 — What Landlords Need to Know",
  description: "The confirmed EPC C deadline (2030) for UK rental properties explained. What landlords need to do, estimated costs, available grants, and how to prepare.",
  keywords: "EPC C deadline 2030, EPC requirements landlords, EPC retrofit cost, EPC C rental properties, energy efficiency rental",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/epc-c-deadline-landlords/" },
  openGraph: {
    title: "EPC C Deadline 2030 — What Landlords Need to Know",
    description: "The confirmed EPC C deadline (2030) for UK rental properties explained. What landlords need to do, estimated costs, available grants, and how to prepare.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/epc-c-deadline-landlords/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "EPC rating chart for UK rental properties" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EPC C Deadline 2030 — What Landlords Need to Know",
    description: "The confirmed EPC C deadline (2030) for UK rental properties explained. What landlords need to do, estimated costs, available grants, and how to prepare.",
  },
};

const faqs = [
  {
    q: "What is the EPC C deadline for rental properties in England?",
    a: "The UK Government confirmed that all privately rented properties in England must achieve a minimum EPC rating of band C by 2030. This applies to all private rental properties — both new and existing tenancies. The earlier phased 2028/2030 proposal was superseded by the confirmed 2030 single deadline. Landlords should begin planning improvements now as the deadline is fixed and there are no extensions.",
  },
  {
    q: "What is the current minimum EPC rating required for rental properties?",
    a: "Since April 2020, all privately rented properties in England and Wales must have a minimum EPC rating of E. Landlords who let a property with an F or G rating face fines of up to £5,000 per property. The confirmed uplift to band C by 2030 represents a significant increase in the minimum standard — plan upgrades now.",
  },
  {
    q: "How much does it cost to improve a property's EPC rating to band C?",
    a: "Costs vary significantly depending on the property's current rating and construction type. For a D-rated property, common improvements such as loft insulation, cavity wall insulation, and LED lighting may cost £1,000–3,000 combined and could be sufficient. For older solid-wall properties currently rated E or F, solid wall insulation and a new boiler could cost £8,000–16,000. A spend cap of around £15,000 per property is expected to be part of any exemption scheme.",
  },
  {
    q: "Are there government grants to help landlords meet the EPC C requirement?",
    a: "Yes. The Boiler Upgrade Scheme offers up to £7,500 towards an air source heat pump. The Great British Insulation Scheme and ECO4 provide free or subsidised insulation for eligible properties. Many local councils also offer additional funding. Landlords should check eligibility before paying for improvements out of pocket.",
  },
  {
    q: "Can landlords be exempt from the EPC C requirement?",
    a: "Exemptions apply where improvements would exceed the cost cap (expected around £15,000 — confirm on GOV.UK), where the property is listed and works would alter its character, where third-party consent such as a freeholder has been refused, or where all recommended measures have been made but the property still cannot reach band C. Exemptions must be registered on the PRS Exemptions Register and do not transfer to a new owner on sale.",
  },
];

export default function EPCArticle() {
  return (
    <>
      <BlogArticleHero
        title="EPC C Deadline — What Landlords Need to Know"
        excerpt="The confirmed EPC C requirement (deadline 2030) for rental properties. Improvement costs, available grants, and how to prepare your portfolio."
        category="Landlords"
        date="June 2026"
        readTime="6 min"
        image="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=1400&q=80"
      />
      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">The UK Government has confirmed that all privately rented properties in England and Wales must achieve an Energy Performance Certificate (EPC) rating of at least band C by 2030. The deadline is fixed — landlords should be planning and commissioning improvements now.</p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 not-prose">
          <p className="text-sm text-red-800"><strong>Current requirement:</strong> All rental properties must have a minimum EPC rating of E. This has been in force since April 2020. Fines of up to £5,000 per property apply for non-compliance.</p>
          <p className="text-sm text-red-800 mt-2"><strong>Confirmed requirement:</strong> EPC band C by 2030 for all private rental properties. Non-compliance fines could be up to £30,000 per property. The 2030 deadline is confirmed — check GOV.UK for exemption guidance.</p>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Is an EPC?</h2>
        <p>An Energy Performance Certificate rates a property&apos;s energy efficiency from A (most efficient) to G (least efficient). It also includes recommendations for improvements and estimated costs. EPCs are valid for 10 years and must be provided to tenants before a tenancy begins.</p>
        <p>You can look up any property&apos;s current EPC rating for free at <a href="https://www.gov.uk/find-energy-certificate" target="_blank" rel="noopener noreferrer" className="text-gold-600 font-semibold">gov.uk/find-energy-certificate</a>.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Common Improvements to Reach EPC C</h2>
        <p>The most cost-effective measures to improve an EPC rating include:</p>
        <div className="not-prose bg-navy-50 rounded-xl p-5">
          <table className="w-full text-sm"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Measure</th><th className="text-left py-2">Typical Cost</th><th className="text-left py-2">EPC Impact</th></tr></thead><tbody>
            <tr className="border-b border-navy-200"><td className="py-2">Loft insulation (270mm)</td><td className="py-2">£300-500</td><td className="py-2">High</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Cavity wall insulation</td><td className="py-2">£500-1,000</td><td className="py-2">High</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">New condensing boiler</td><td className="py-2">£2,500-4,000</td><td className="py-2">High</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">LED lighting</td><td className="py-2">£50-150</td><td className="py-2">Low</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Smart heating controls</td><td className="py-2">£200-400</td><td className="py-2">Low-Medium</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Double glazing</td><td className="py-2">£3,000-7,000</td><td className="py-2">Medium</td></tr>
            <tr><td className="py-2">Solid wall insulation</td><td className="py-2">£5,000-12,000</td><td className="py-2">Very High</td></tr>
          </tbody></table>
        </div>
        <p className="text-xs text-navy-400">Costs are approximate and vary by property size, location, and contractor. Always get multiple quotes.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Available Grants</h2>
        <p>Several government grants can help offset the cost of energy efficiency improvements:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Boiler Upgrade Scheme:</strong> Up to £7,500 towards an air source heat pump</li>
          <li><strong>Great British Insulation Scheme:</strong> Free or subsidised insulation for eligible properties</li>
          <li><strong>ECO4:</strong> Energy Company Obligation funding for insulation and heating measures</li>
          <li><strong>Local authority grants:</strong> Many councils offer additional funding — check with your local authority</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Exemptions — When EPC C May Not Apply</h2>
        <p>Not every property will be required to reach EPC C. Exemptions apply where:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The cost of improvements exceeds the spend cap (expected around £15,000 per property — confirm on GOV.UK)</li>
          <li>The property is a listed building where works would alter its character</li>
          <li>All recommended improvements have been made but the property still cannot reach C</li>
          <li>Third-party consent (e.g., freeholder for a leasehold flat) has been refused</li>
          <li>Planning permission for the recommended works is denied</li>
        </ul>
        <p>Exemptions must be registered on the PRS Exemptions Register and are property-specific — they do not transfer to a new owner on sale.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Impact on Property Values</h2>
        <p>EPC ratings are increasingly affecting property values. Research suggests properties rated F or G may face discounts of 10–20% compared to equivalent C-rated properties as buyers price in required improvement costs. Improving EPC ratings is not just a compliance cost — it protects asset value and rental desirability as tenants become more energy-cost-aware.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent as a Simpler Alternative</h2>
        <p>If EPC compliance, licensing, and ongoing regulation is becoming too much to manage alongside your day job, guaranteed rent removes all the complexity. We lease your property for 3-5 years at a fixed monthly income — we take on all management, maintenance, compliance responsibility, and tenant relations. You receive your rent payment on the same date every month.</p>
        <div className="not-prose mt-3 mb-2">
          <Link href="/guaranteed-rent" className="btn-primary text-sm !py-2.5 !px-5">Learn About Guaranteed Rent →</Link>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Should Landlords Do Now?</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Check your current EPC rating at gov.uk/find-energy-certificate</li>
          <li>If rated D or below, get a new EPC assessment with recommendations</li>
          <li>Use our EPC Retrofit Calculator to estimate improvement costs</li>
          <li>Check eligibility for government grants</li>
          <li>Start with the cheapest, highest-impact improvements first</li>
          <li>Factor costs into your investment analysis and cash flow projections</li>
        </ol>

        <div className="not-prose flex flex-wrap gap-3 mt-6">
          <Link href="/calculators/epc-retrofit" className="btn-primary text-sm !py-2.5 !px-5">EPC Retrofit Calculator →</Link>
          <Link href="/calculators/landlord-costs" className="btn-outline text-sm !py-2.5 !px-5">Landlord Cost Calculator →</Link>
        </div>

        
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/guaranteed-rent-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Landlords</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Guaranteed Rent Explained</p>
              </Link>
              <Link href="/blog/hmo-investing-uk" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Investing</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">HMO Investing UK</p>
              </Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="general" />
      </div></article>
    </>
  );
}


