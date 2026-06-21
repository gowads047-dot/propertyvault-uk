import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Guaranteed Rent Explained — Is It Worth It for Landlords? | PropertyVault UK",
  description: "What is guaranteed rent? How it works, the pros and cons, and whether it's worth it for UK landlords. Complete guide with income comparison.",
  keywords: "guaranteed rent UK, guaranteed rent scheme, is guaranteed rent worth it, guaranteed rent for landlords, guaranteed rent Birmingham",
};

export default function GuaranteedRentArticle() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <Link href="/blog" className="text-gold-400 text-sm font-medium hover:text-gold-300 mb-3 inline-block">← Back to Blog</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed Rent Explained — Is It Worth It for Landlords?</h1>
            <p className="text-navy-200">Everything you need to know about guaranteed rent schemes, how they work, and whether they make financial sense.</p>
          </div>
        </div>
      </section>

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
          <p>Guaranteed rent schemes are available across the UK, with particularly strong demand in the Midlands. We cover:</p>
          <div className="not-prose flex flex-wrap gap-3 mt-3">
            <Link href="/guaranteed-rent/birmingham" className="px-4 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Birmingham →</Link>
            <Link href="/guaranteed-rent/nottingham" className="px-4 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Nottingham →</Link>
            <Link href="/guaranteed-rent/derby" className="px-4 py-2 bg-navy-50 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-100">Derby →</Link>
          </div>

          <div className="not-prose mt-6">
            <Link href="/guaranteed-rent" className="btn-primary text-sm !py-2.5 !px-5">Learn More About Guaranteed Rent →</Link>
          </div>

          
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
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

          <Disclaimer type="general" />
        </div>
      </article>
    </>
  );
}

