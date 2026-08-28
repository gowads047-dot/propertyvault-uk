import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Guaranteed Rent Explained — Is It Worth It for Landlords?",
  description: "What is guaranteed rent? How it works, the pros and cons, and whether it's worth it for UK landlords. Complete guide with income comparison.",
  keywords: "guaranteed rent UK, guaranteed rent scheme, is guaranteed rent worth it, guaranteed rent for landlords, guaranteed rent Birmingham",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/guaranteed-rent-explained/" },
  openGraph: {
    title: "Guaranteed Rent Explained — Is It Worth It for Landlords?",
    description: "What is guaranteed rent? How it works, the pros and cons, and whether it's worth it for UK landlords. Complete guide with income comparison.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/guaranteed-rent-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Landlord signing guaranteed rent agreement with property company" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guaranteed Rent Explained — Is It Worth It for Landlords?",
    description: "What is guaranteed rent? How it works, the pros and cons, and whether it's worth it for UK landlords. Complete guide with income comparison.",
  },
};

const faqs = [
  {
    q: "What is guaranteed rent and how does it work for UK landlords?",
    a: "Guaranteed rent is an arrangement where a property management company leases your property directly from you for an agreed term — typically 3 to 5 years — and pays you a fixed monthly rent whether or not the property is occupied. The company handles all tenant management, maintenance, and compliance. You receive the same amount on the same date every month regardless of voids or tenant issues.",
  },
  {
    q: "How much less will I receive under a guaranteed rent scheme?",
    a: "Guaranteed rent providers typically offer 80–90% of the open market rent. However, when you account for the hidden costs of self-managing — letting agent fees (typically 10%), void periods, maintenance, compliance costs, and tenant-find fees — guaranteed rent often puts more money in your pocket than self-managing. On a £1,000 per month property, self-managed net income after deductions is often closer to £725–800 per month.",
  },
  {
    q: "Who are the tenants in a guaranteed rent scheme?",
    a: "Guaranteed rent providers typically work with local councils and housing associations to house tenants referred through local authority housing programmes. The provider acts as the tenant in your lease agreement — they sublet to the occupants. You have no direct tenancy relationship with the end occupants and no responsibility for managing them.",
  },
  {
    q: "What happens to my property at the end of a guaranteed rent lease?",
    a: "At the end of the agreed lease term, the property is returned to you in the condition it was at the start of the agreement, subject to fair wear and tear. Any damage beyond fair wear and tear is typically the provider's responsibility. You then have the option to renew the arrangement, revert to self-managing, or sell.",
  },
  {
    q: "Is guaranteed rent affected by the Renters' Rights Act 2025?",
    a: "No. Because the guaranteed rent provider — not you — is the legal landlord for the occupying tenants, you are not directly affected by the Renters' Rights Act as a property owner in this arrangement. The provider handles all compliance with current legislation including Section 21 abolition, periodic tenancy rules, and maintenance obligations.",
  },
];

export default function GuaranteedRentArticle() {
  return (
    <>
      <BlogArticleHero
        title="Guaranteed Rent Explained — Is It Worth It for Landlords?"
        excerpt="How guaranteed rent works, the real income comparison, pros and cons, and who it's best for."
        category="Landlords"
        date="June 2026"
        readTime="7 min"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
          <p className="text-lg">Guaranteed rent is a scheme where a property company leases your property from you for an agreed period — typically 3 to 5 years — and pays you a fixed monthly rent regardless of whether the property is occupied or not. The company handles all tenant management, maintenance, and compliance.</p>


          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>How Guaranteed Rent Works</h2>
          <p>The process is straightforward:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>A guaranteed rent provider assesses your property — its condition, location, and rental potential</li>
            <li>They make you a guaranteed rent offer, typically 80-90% of the open market rent</li>
            <li>If you accept, a lease agreement is signed for an agreed term (usually 3-5 years)</li>
            <li>From day one, you receive your guaranteed rent on the same date every month</li>
            <li>The provider handles everything — tenant sourcing, management, maintenance, and compliance</li>
            <li>At the end of the lease, the property is returned in the condition it was at the start (fair wear and tear excepted)</li>
          </ol>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Who Provides Guaranteed Rent?</h2>
          <p>Guaranteed rent is typically provided by property management companies who work with local councils, housing associations, and social housing providers. They lease properties from private landlords and use them to house tenants referred through local authority housing programmes.</p>
          <p>This means guaranteed rent providers are often part of the social housing ecosystem, working to address the UK&apos;s housing shortage while offering landlords a hands-off income solution.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>The Real Numbers: Is It Actually Worth It?</h2>
          <p>The headline rent is lower — typically 80-90% of market rate. But when you factor in the hidden costs of self-managing, guaranteed rent often puts more money in your pocket:</p>

          <div className="bg-navy-50 rounded-xl p-6 text-sm not-prose">
            <p className="font-bold text-navy-800 mb-3">Example: 3-bed house, market rent £1,000/month</p>
            <table className="w-full"><tbody>
              <tr className="border-b border-navy-200"><td className="py-2">Self-managed annual rent</td><td className="py-2 text-right">£12,000</td></tr>
              <tr className="border-b border-navy-200 text-red-600"><td className="py-2">Less void periods (3 weeks)</td><td className="py-2 text-right">-£692</td></tr>
              <tr className="border-b border-navy-200 text-red-600"><td className="py-2">Less letting agent (10%)</td><td className="py-2 text-right">-£1,200</td></tr>
              <tr className="border-b border-navy-200 text-red-600"><td className="py-2">Less maintenance</td><td className="py-2 text-right">-£600</td></tr>
              <tr className="border-b border-navy-200 text-red-600"><td className="py-2">Less compliance costs</td><td className="py-2 text-right">-£300</td></tr>
              <tr className="border-b border-navy-200 text-red-600"><td className="py-2">Less tenant-find fee</td><td className="py-2 text-right">-£500</td></tr>
              <tr className="font-bold"><td className="py-2">Actual self-managed income</td><td className="py-2 text-right">£8,708</td></tr>
              <tr className="font-bold text-green-600 border-t border-navy-200"><td className="py-2">Guaranteed rent (£850/month)</td><td className="py-2 text-right">£10,200</td></tr>
              <tr className="font-bold text-green-700 bg-green-50"><td className="py-2">Difference</td><td className="py-2 text-right">+£1,492 more</td></tr>
            </tbody></table>
          </div>
          <p className="text-xs text-navy-400">Illustrative example. Actual figures depend on property, location, and circumstances.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Pros and Cons</h2>
          <div className="grid md:grid-cols-2 gap-4 not-prose">
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-bold text-green-800 text-sm mb-2">Advantages</h3>
              <ul className="space-y-1 text-xs text-green-700">
                <li>✓ Guaranteed income — no void periods</li>
                <li>✓ Zero management responsibility</li>
                <li>✓ No letting agent fees</li>
                <li>✓ Maintenance handled by provider</li>
                <li>✓ Compliance managed for you</li>
                <li>✓ Long-term lease security (3-5 years)</li>
                <li>✓ Property returned in condition</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-5">
              <h3 className="font-bold text-red-800 text-sm mb-2">Considerations</h3>
              <ul className="space-y-1 text-xs text-red-700">
                <li>✗ Headline rent is 10-20% below market</li>
                <li>✗ Less control over tenant selection</li>
                <li>✗ Long lease commitment</li>
                <li>✗ Potential for higher wear and tear</li>
                <li>✗ Quality of provider varies — research carefully</li>
                <li>✗ Slower rent increases during lease term</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Who Is Guaranteed Rent Best For?</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Landlords who want completely passive, hands-off income</li>
            <li>Landlords who live far from their rental property</li>
            <li>Portfolio landlords looking to reduce management workload</li>
            <li>Landlords who have experienced void periods or problem tenants</li>
            <li>Overseas landlords who cannot manage properties in person</li>
          </ul>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent in Your Area</h2>
          <p>Guaranteed rent schemes are available across the UK, with particularly strong demand in the Midlands. The elimination of <Link href="/calculators/void-period" className="text-gold-600 font-semibold">void periods</Link> alone can make guaranteed rent the more profitable option — we cover:</p>
          <div className="not-prose flex flex-wrap gap-3 mt-3">
            <Link href="/guaranteed-rent/birmingham" className="px-4 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Birmingham →</Link>
            <Link href="/guaranteed-rent/nottingham" className="px-4 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Nottingham →</Link>
            <Link href="/guaranteed-rent/derby" className="px-4 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Derby →</Link>
          </div>

          <div className="not-prose mt-6">
            <Link href="/guaranteed-rent" className="btn-primary text-sm !py-2.5 !px-5">Learn More About Guaranteed Rent →</Link>
          </div>

          
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Calculators</h3>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <Link href="/calculators/rental-yield" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Rental Yield</p>
                <p className="text-xs text-navy-400 mt-0.5">Compare your returns</p>
              </Link>
              <Link href="/calculators/monthly-cashflow" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Monthly Cash Flow</p>
                <p className="text-xs text-navy-400 mt-0.5">Net income per month</p>
              </Link>
              <Link href="/calculators/void-period" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Void Period</p>
                <p className="text-xs text-navy-400 mt-0.5">Cost of empty periods</p>
              </Link>
            </div>
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/epc-c-deadline-landlords" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Landlords</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">EPC C Deadline for Landlords</p>
              </Link>
              <Link href="/blog/personal-vs-limited-company" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Tax</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Personal vs Ltd Company</p>
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


