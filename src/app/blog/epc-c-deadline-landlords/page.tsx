import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "EPC C Deadline 2030 — What Landlords Need to Know | PropertyVault UK",
  description: "The proposed EPC C deadline for UK rental properties explained. What landlords need to do, estimated costs, available grants, and how to prepare.",
  keywords: "EPC C deadline 2030, EPC requirements landlords, EPC retrofit cost, EPC C rental properties, energy efficiency rental",
};

export default function EPCArticle() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16"><div className="container-max px-4"><div className="max-w-3xl">
        <Link href="/blog" className="text-gold-400 text-sm font-medium hover:text-gold-300 mb-3 inline-block">← Back to Blog</Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>EPC C Deadline — What Landlords Need to Know</h1>
        <p className="text-navy-200">The proposed requirement for rental properties to reach EPC band C and how to prepare.</p>
      </div></div></section>

      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">The UK Government has proposed that all privately rented properties in England and Wales must achieve an Energy Performance Certificate (EPC) rating of at least band C. While the exact timeline and details are subject to confirmation, landlords should be preparing now.</p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-5 not-prose">
          <p className="text-sm text-red-800"><strong>Current requirement:</strong> All rental properties must have a minimum EPC rating of E. This has been in force since April 2020. Fines of up to £5,000 per property apply for non-compliance.</p>
          <p className="text-sm text-red-800 mt-2"><strong>Proposed requirement:</strong> EPC band C by 2028 for new tenancies and 2030 for existing tenancies. Non-compliance fines could be up to £30,000 per property. Check GOV.UK for the latest confirmed dates.</p>
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

          <Disclaimer type="general" />
      </div></article>
    </>
  );
}

