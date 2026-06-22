import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "HMO Investing UK — Is It Still Profitable? | PropertyVault UK",
  description: "HMO investing explained. Licensing, room sizes, fire safety, yields, and whether Houses in Multiple Occupation are still worth it for UK landlords.",
  keywords: "HMO investing UK, HMO yield, HMO licensing, houses in multiple occupation, HMO calculator",
};

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

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Is HMO Investing Still Profitable?</h2>
        <p>Yes, but margins are tighter than they were 5 years ago due to increased regulation, licensing costs, and Section 24 tax changes. However, the yield premium over single-lets remains significant:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Single-let gross yield:</strong> typically 4-8% depending on area</li>
          <li><strong>HMO gross yield:</strong> typically 10-18% in the same areas</li>
          <li>The yield premium is 2-3x, which absorbs the higher management costs</li>
        </ul>
        <p>The key to profitable HMO investing is thorough due diligence, accurate cost modelling, and compliance with all licensing and safety requirements.</p>

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

          <Disclaimer type="financial" />
      </div></article>
    </>
  );
}


