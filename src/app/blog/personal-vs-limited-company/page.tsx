import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import { YouTubeEmbed } from "@/components/blog/YouTubeEmbed";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Personal vs Limited Company — Which Is Better for BTL? | PropertyVault UK",
  description: "Should you hold buy-to-let property personally or through a limited company (SPV)? Tax comparison, pros, cons, and which structure suits you.",
  keywords: "personal vs limited company property, SPV property, limited company buy to let, Section 24 SPV, corporation tax rental income",
  alternates: { canonical: "https://propertyvaultuk.co.uk/blog/personal-vs-limited-company/" },
  openGraph: {
    title: "Personal vs Limited Company — Which Is Better for BTL? | PropertyVault UK",
    description: "Should you hold buy-to-let property personally or through a limited company (SPV)? Tax comparison, pros, cons, and which structure suits you.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/blog/personal-vs-limited-company/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Tax comparison personal vs limited company property ownership" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal vs Limited Company — Which Is Better for BTL? | PropertyVault UK",
    description: "Should you hold buy-to-let property personally or through a limited company (SPV)? Tax comparison, pros, cons, and which structure suits you.",
  },
};

const faqs = [
  {
    q: "Should I hold buy-to-let property personally or through a limited company?",
    a: "The answer depends on your income tax band and whether the property has a mortgage. Higher rate (40%) and additional rate (45%) taxpayers with mortgaged properties generally pay significantly less tax through a limited company SPV, because companies are not affected by Section 24 and can deduct mortgage interest in full. Basic rate (20%) taxpayers and those with unencumbered properties often find personal ownership simpler and equally efficient.",
  },
  {
    q: "What is an SPV and how is it used for property investment?",
    a: "SPV stands for Special Purpose Vehicle — a limited company set up specifically to hold investment property, typically using Companies House SIC code 68100 (letting of own property). The company buys and owns the properties, receives the rental income, pays corporation tax on the net profit, and can deduct mortgage interest in full — unlike individual landlords subject to Section 24.",
  },
  {
    q: "Can I transfer my existing buy-to-let properties into a limited company?",
    a: "Technically yes, but it is rarely cost-effective. Transferring personally held properties into a company triggers Capital Gains Tax on the gain at the time of transfer and Stamp Duty Land Tax at current rates (including the 5% additional property surcharge) on the market value. For most landlords, this makes transfer uneconomical. The limited company structure works best when used for new purchases.",
  },
  {
    q: "What are the extra costs of running a limited company for buy-to-let?",
    a: "Limited company landlords typically pay an accountant £500–1,500 per year for bookkeeping, accounts preparation, and corporation tax filings — compared to £150–300 for personal rental income. Mortgage rates on limited company BTL products are also typically 0.5–1% higher than equivalent personal mortgages. These costs must be weighed against the tax saving when deciding on structure.",
  },
  {
    q: "How is Capital Gains Tax different for a limited company versus personal ownership?",
    a: "Individual landlords pay Capital Gains Tax at 18% (basic rate) or 24% (higher or additional rate) on residential property gains, with a £3,000 annual exempt amount. A limited company pays Corporation Tax (19–25%) on the gain. If you then extract those proceeds as dividends, dividend tax applies on top, creating a double tax layer. Personal ownership is often more efficient for properties you plan to sell; company ownership suits long-term holds where profits are reinvested.",
  },
];

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
        {/* Replace YOUTUBE_VIDEO_ID with your video ID once uploaded */}
        <YouTubeEmbed videoId="YOUTUBE_VIDEO_ID" title="Personal vs Limited Company for Buy-to-Let — UK Tax Guide" />
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

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Real Numbers — Higher Rate Taxpayer Example</h2>
        <div className="not-prose bg-navy-50 rounded-xl p-5 text-sm">
          <p className="font-bold text-navy-800 mb-3">£18,000 annual rent · £8,000 mortgage interest · £1,500 expenses · 40% taxpayer</p>
          <table className="w-full"><thead><tr className="border-b border-navy-200"><th className="text-left py-2"></th><th className="text-right py-2">Personal</th><th className="text-right py-2">Ltd Company</th></tr></thead><tbody>
            <tr className="border-b border-navy-100"><td className="py-1.5">Rental income</td><td className="py-1.5 text-right">£18,000</td><td className="py-1.5 text-right">£18,000</td></tr>
            <tr className="border-b border-navy-100"><td className="py-1.5">Deductible expenses</td><td className="py-1.5 text-right">−£1,500</td><td className="py-1.5 text-right">−£1,500</td></tr>
            <tr className="border-b border-navy-100"><td className="py-1.5">Mortgage interest</td><td className="py-1.5 text-right">Not deductible</td><td className="py-1.5 text-right">−£8,000</td></tr>
            <tr className="border-b border-navy-100"><td className="py-1.5 font-semibold">Taxable profit</td><td className="py-1.5 text-right font-semibold">£16,500</td><td className="py-1.5 text-right font-semibold">£8,500</td></tr>
            <tr className="border-b border-navy-100"><td className="py-1.5">Tax before relief</td><td className="py-1.5 text-right">£6,600 (40%)</td><td className="py-1.5 text-right">£1,615 (19%)</td></tr>
            <tr className="border-b border-navy-100"><td className="py-1.5">20% mortgage interest credit</td><td className="py-1.5 text-right">−£1,600</td><td className="py-1.5 text-right">N/A</td></tr>
            <tr className="font-bold"><td className="py-1.5">Tax payable</td><td className="py-1.5 text-right text-red-700">£5,000</td><td className="py-1.5 text-right text-green-700">£1,615</td></tr>
          </tbody></table>
          <p className="text-xs text-navy-500 mt-2">Ltd saving before accountant costs: ~£3,385/year per property at this level.</p>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Extracting Profits from a Limited Company</h2>
        <p>Once profits are in the company, getting them out triggers additional tax. Two options:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Dividends:</strong> Tax-free allowance of £500 (2025/26). Basic rate dividend tax: 8.75%. Higher rate: 33.75%.</li>
          <li><strong>Salary:</strong> Subject to income tax and National Insurance above £12,570.</li>
        </ul>
        <p>Many portfolio landlords leave profits in the company and reinvest into new properties — deferring personal tax until they extract. If your goal is portfolio growth rather than income, a limited company is structurally more efficient. If you need income now, run the net-of-dividend-tax numbers first.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>When NOT to Use a Limited Company</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>You are a basic rate (20%) taxpayer.</strong> Section 24 doesn&apos;t disadvantage you, and accountancy costs erode returns.</li>
          <li><strong>You want to move existing personally-held properties into a company.</strong> Transfer triggers CGT and Stamp Duty at market value — usually uneconomical without specialist SDLT partnership relief structuring.</li>
          <li><strong>You need monthly income.</strong> Dividend tax on top of corporation tax can exceed personal income tax at the basic rate band.</li>
          <li><strong>You only own one property with a small mortgage.</strong> The £500–1,500/year accountant fee may not justify the saving.</li>
        </ul>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>CGT on Sale — Personal vs Company</h2>
        <p>Individuals pay Capital Gains Tax at 18% (basic rate) or 24% (higher/additional rate) on residential property gains, with a £3,000 annual exempt amount. A limited company pays Corporation Tax (19–25%) on the gain — then dividend tax on top if you extract the proceeds. This double layer makes a company less efficient for properties you plan to sell in the short to medium term. Personal ownership is often better for those properties; company ownership for long-term holds where profits are reinvested.</p>

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

          <FAQSchema faqs={faqs} />
          <Disclaimer type="tax" />
      </div></article>
    </>
  );
}


