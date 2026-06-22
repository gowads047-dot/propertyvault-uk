import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Personal vs Limited Company — Which Is Better for BTL? | PropertyVault UK",
  description: "Should you hold buy-to-let property personally or through a limited company (SPV)? Tax comparison, pros, cons, and which structure suits you.",
  keywords: "personal vs limited company property, SPV property, limited company buy to let, Section 24 SPV, corporation tax rental income",
};

export default function PersonalVsLtdArticle() {
  return (
    <>
      <BlogArticleHero
        title="Personal vs Limited Company — Which Is Better for BTL?"
        excerpt="Side-by-side tax comparison of holding property personally versus through an SPV."
        category="Tax"
        date="June 2026"
        readTime="7 min"
        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80"
      />
      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">Since Section 24 removed mortgage interest relief for individual landlords, more investors are asking whether they should hold property through a limited company (SPV — Special Purpose Vehicle) instead. The answer depends on your tax band, mortgage situation, and long-term plans.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Personal Ownership</h2>
        <p><strong>How it works:</strong> You buy the property in your own name. Rental income is added to your other income and taxed at your marginal rate (20%, 40%, or 45%). Section 24 means you cannot deduct mortgage interest — instead you get a 20% tax credit.</p>
        <p><strong>Best for:</strong> Basic rate taxpayers, properties with no mortgage, landlords with one or two properties, and those who want simplicity.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Limited Company (SPV)</h2>
        <p><strong>How it works:</strong> You set up a limited company (typically with SIC code 68100 — letting of own property) and the company buys the property. Mortgage interest is fully deductible as a business expense. Corporation tax applies to the net profit.</p>
        <p><strong>Corporation tax rates:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>19% on profits up to £50,000</li>
          <li>25% on profits over £250,000</li>
          <li>Marginal relief between £50,000 and £250,000</li>
        </ul>
        <p><strong>Best for:</strong> Higher and additional rate taxpayers, highly leveraged properties, portfolio landlords, and those planning to retain profits for reinvestment.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Key Differences</h2>
        <div className="not-prose bg-navy-50 rounded-xl p-5">
          <table className="w-full text-sm"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Factor</th><th className="text-left py-2">Personal</th><th className="text-left py-2">Ltd Company</th></tr></thead><tbody>
            <tr className="border-b border-navy-200"><td className="py-2">Mortgage interest</td><td className="py-2">20% tax credit only</td><td className="py-2">Fully deductible</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Tax rate</td><td className="py-2">20/40/45%</td><td className="py-2">19-25% corp tax</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Extracting profits</td><td className="py-2">Already taxed</td><td className="py-2">Dividend tax applies</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">CGT on sale</td><td className="py-2">18/24%</td><td className="py-2">Corp tax then dividend tax</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">Accountant costs</td><td className="py-2">£150-300/year</td><td className="py-2">£500-1,500/year</td></tr>
            <tr><td className="py-2">Mortgage rates</td><td className="py-2">Generally lower</td><td className="py-2">Typically 0.5-1% higher</td></tr>
          </tbody></table>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Calculate Which Is Better for You</h2>
        <div className="not-prose flex flex-wrap gap-3 mt-4">
          <Link href="/calculators/personal-vs-ltd" className="btn-primary text-sm !py-2.5 !px-5">Personal vs Ltd Calculator →</Link>
          <Link href="/calculators/section-24" className="btn-outline text-sm !py-2.5 !px-5">Section 24 Calculator →</Link>
        </div>

        <p className="mt-4"><strong>Important:</strong> This is a complex decision with significant tax implications. Always consult a qualified property tax accountant (ACCA, ICAEW, or CIOT qualified) before choosing a structure. The right answer depends entirely on your individual circumstances.</p>

        
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/section-24-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Tax</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Section 24 Explained</p>
              </Link>
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Investing</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">BRRR Strategy Explained</p>
              </Link>
            </div>
          </div>

          <Disclaimer type="tax" />
      </div></article>
    </>
  );
}


