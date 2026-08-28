import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Section 24 Explained — How It Affects UK Landlords' Tax Bills",
  description: "Section 24 mortgage interest restriction explained. How it works, how much extra tax you pay, and whether a limited company (SPV) could save you money.",
  keywords: "Section 24 UK, Section 24 explained, mortgage interest relief landlords, Section 24 tax calculator, SPV property",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/section-24-explained/" },
  openGraph: {
    title: "Section 24 Explained — How It Affects UK Landlords' Tax Bills",
    description: "Section 24 mortgage interest restriction explained. How it works, how much extra tax you pay, and whether a limited company (SPV) could save you money.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/section-24-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Section 24 mortgage interest restriction impact on landlord tax bills" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Section 24 Explained — How It Affects UK Landlords' Tax Bills",
    description: "Section 24 mortgage interest restriction explained. How it works, how much extra tax you pay, and whether a limited company (SPV) could save you money.",
  },
};

const faqs = [
  {
    q: "What is Section 24 and when did it take effect?",
    a: "Section 24 of the Finance (No. 2) Act 2015 removed the right for individual landlords to deduct mortgage interest as an expense from rental income. It was phased in from 2017 and fully applied from April 2020. Instead of deducting interest, landlords now receive a basic rate (20%) tax credit on their mortgage interest costs — which significantly increases the tax bill for higher and additional rate taxpayers.",
  },
  {
    q: "How does Section 24 affect higher rate taxpayers?",
    a: "Before Section 24, a higher rate taxpayer paying £6,000 per year in mortgage interest could deduct it from rental income before calculating their 40% tax. Now they cannot deduct it — they pay 40% tax on the gross rental income and receive only a 20% tax credit on the interest. On the same figures, this can mean £1,200 or more in additional tax per property per year, compared to pre-2017 rules.",
  },
  {
    q: "Does Section 24 apply to limited companies?",
    a: "No. Section 24 applies only to individuals (and partnerships of individuals) receiving residential property rental income. Limited companies can still deduct mortgage interest in full as a business expense before calculating Corporation Tax. This is the primary structural reason why many higher rate taxpayer landlords now purchase new investment properties through limited company SPVs.",
  },
  {
    q: "Can Section 24 push a landlord into a higher income tax band?",
    a: "Yes, and this is one of its most harmful effects. Because you are taxed on gross rental income before deducting mortgage interest, your taxable income is inflated even if your real profit after mortgage costs is modest. A landlord earning £35,000 from employment plus £14,000 gross rent has £49,000 of taxable income — pushing them close to the 40% threshold — even if their actual profit after £10,000 mortgage interest is only £4,000.",
  },
  {
    q: "Does Section 24 apply to commercial property?",
    a: "No. Section 24 applies only to residential property income. Commercial property mortgage interest (offices, retail units, industrial property) remains fully deductible under normal loan relationship rules, making commercial property more tax-efficient for leveraged investors. The Furnished Holiday Lettings (FHL) regime was abolished from 6 April 2025 — SA income is now taxed in the same way as standard residential rental income, subject to Section 24.",
  },
];

export default function Section24Article() {
  return (
    <>
      <BlogArticleHero
        title="Section 24 Explained — How It Affects Your Tax Bill"
        excerpt="Understanding the mortgage interest restriction and how it impacts different tax bands."
        category="Tax"
        date="June 2026"
        readTime="6 min"
        image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
          <p className="text-lg"><strong>Section 24 of the Finance (No. 2) Act 2015</strong> changed how individual landlords are taxed on their rental income. Since April 2020, landlords can no longer deduct mortgage interest as an expense from their rental income. Instead, they receive a basic rate (20%) tax credit on their mortgage interest costs.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Changed</h2>
          <p><strong>Before Section 24 (pre-2017):</strong> Landlords could deduct their full mortgage interest from rental income before calculating tax. This meant you only paid tax on your actual profit after mortgage costs.</p>
          <p><strong>After Section 24 (from April 2020, fully phased in):</strong> Mortgage interest is no longer an allowable expense. You pay tax on your rental income as if you had no mortgage, then receive a 20% tax credit on your mortgage interest. For basic rate (20%) taxpayers, this makes no difference. For higher rate (40%) and additional rate (45%) taxpayers, it significantly increases the tax bill. Use our <Link href="/calculators/landlord-tax" className="text-gold-600 font-semibold">landlord tax calculator</Link> to see your full tax position.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>How It Affects Different Tax Bands</h2>
          <p>The table below compares how the <Link href="/calculators/section-24" className="text-gold-600 font-semibold">Section 24 rules</Link> affect landlords at each tax band compared with the old rules:</p>
          <div className="bg-navy-50 rounded-xl p-6 text-sm not-prose">
            <p className="font-bold text-navy-800 mb-3">Example: £12,000 rent, £6,000 mortgage interest, £2,000 expenses</p>
            <table className="w-full"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Tax Band</th><th className="text-right py-2">Old Rules</th><th className="text-right py-2">Section 24</th><th className="text-right py-2">Extra Tax</th></tr></thead><tbody>
              <tr className="border-b border-navy-200"><td className="py-2">20% Basic</td><td className="py-2 text-right">£800</td><td className="py-2 text-right">£800</td><td className="py-2 text-right text-green-600">£0</td></tr>
              <tr className="border-b border-navy-200"><td className="py-2">40% Higher</td><td className="py-2 text-right">£1,600</td><td className="py-2 text-right">£2,800</td><td className="py-2 text-right text-red-600">+£1,200</td></tr>
              <tr><td className="py-2">45% Additional</td><td className="py-2 text-right">£1,800</td><td className="py-2 text-right">£3,300</td><td className="py-2 text-right text-red-600">+£1,500</td></tr>
            </tbody></table>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>The SPV Solution</h2>
          <p>Limited companies (Special Purpose Vehicles or SPVs) are <strong>not affected by Section 24</strong>. Companies can still deduct mortgage interest as a business expense in full, and pay corporation tax (25% for profits over £250,000, 19% for profits under £50,000, with marginal relief between) on the net profit.</p>
          <p>This is why many landlords — particularly higher rate taxpayers with significant mortgage debt — are now purchasing new properties through limited companies. However, there are additional costs to consider:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Accountant fees (typically £500-1,500 per year)</li>
            <li>Companies House filing fees (£13 per year)</li>
            <li>Higher mortgage interest rates on limited company BTL products</li>
            <li>Fewer lender options compared to personal BTL mortgages</li>
            <li>Dividend tax if you extract profits from the company</li>
          </ul>
          <p><strong>Important:</strong> Transferring existing personally-held properties into a company triggers Capital Gains Tax and Stamp Duty on the transfer. This makes it uneconomical for most existing properties. The SPV approach works best for new purchases.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>When Section 24 Pushes You into a Higher Tax Band</h2>
          <p>One of the most damaging effects of Section 24 is that it can push landlords into a higher income tax band even when their real profit (after mortgage) is modest. Because you&apos;re taxed on gross rental income before deducting mortgage interest, your total taxable income is inflated.</p>
          <p>Example: a landlord earning £35,000 from employment plus £14,000 gross rental income now has £49,000 of taxable income — near the £50,270 higher rate threshold. After deducting £10,000 mortgage interest their real profit is only £4,000, but they&apos;re taxed as if they earned much more. Section 24 has not increased their wealth — it has increased their tax.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Does Section 24 Apply to Limited Companies?</h2>
          <p>No. Section 24 applies only to individuals (and partnerships of individuals) receiving residential property income. A limited company can still deduct mortgage interest in full as a business expense before calculating Corporation Tax. This is the main structural advantage of a limited company for highly leveraged landlords — and the key driver behind the growth of SPV ownership since 2017.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Does Section 24 Apply to Commercial Property?</h2>
          <p>No. Section 24 applies only to residential property income. Commercial property (offices, retail, industrial) mortgage interest remains fully deductible under normal loan relationship rules, making commercial property more tax-efficient for leveraged investors.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Calculate Your Section 24 Impact</h2>
          <p>Use our free calculators to see exactly how Section 24 affects you and whether a limited company structure would save you money:</p>
          <div className="not-prose flex flex-wrap gap-3 mt-4">
            <Link href="/calculators/section-24" className="btn-primary text-sm !py-2.5 !px-5">Section 24 Calculator →</Link>
            <Link href="/calculators/personal-vs-ltd" className="btn-outline text-sm !py-2.5 !px-5">Personal vs Ltd Company →</Link>
          </div>

          
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Calculators</h3>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <Link href="/calculators/section-24" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Section 24</p>
                <p className="text-xs text-navy-400 mt-0.5">See your tax impact</p>
              </Link>
              <Link href="/calculators/personal-vs-ltd" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">Personal vs Ltd</p>
                <p className="text-xs text-navy-400 mt-0.5">Compare structures</p>
              </Link>
              <Link href="/calculators/capital-gains-tax" className="block bg-navy-50 rounded-xl p-4 text-center card-hover">
                <p className="font-semibold text-navy-800 text-sm">CGT Calculator</p>
                <p className="text-xs text-navy-400 mt-0.5">Tax on sale</p>
              </Link>
            </div>
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/personal-vs-limited-company" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Tax</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Personal vs Ltd Company</p>
              </Link>
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Investing</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">BRRR Strategy Explained</p>
              </Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="tax" />
        </div>
      </article>
    </>
  );
}


