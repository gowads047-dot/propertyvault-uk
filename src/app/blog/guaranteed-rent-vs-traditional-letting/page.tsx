import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
  title: "Guaranteed Rent vs Traditional Letting — Full Comparison | PropertyVault UK",
  description: "Compare guaranteed rent vs traditional letting side by side. Income, risk, management, costs, and which option suits your situation as a UK landlord.",
  keywords: "guaranteed rent vs traditional letting, guaranteed rent comparison, landlord rent options, guaranteed rent pros cons, company let vs self manage",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/guaranteed-rent-vs-traditional-letting/" },
  openGraph: {
    title: "Guaranteed Rent vs Traditional Letting — Full Comparison | PropertyVault UK",
    description: "Compare guaranteed rent vs traditional letting side by side. Income, risk, management, costs, and which option suits your situation as a UK landlord.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/guaranteed-rent-vs-traditional-letting/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Guaranteed rent vs traditional letting comparison for UK landlords" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guaranteed Rent vs Traditional Letting — Full Comparison | PropertyVault UK",
    description: "Compare guaranteed rent vs traditional letting side by side. Income, risk, management, costs, and which option suits your situation as a UK landlord.",
  },
};

const faqs = [
  { q: "What is the difference between guaranteed rent and traditional letting?", a: "With guaranteed rent, a company leases your property and pays you a fixed rent regardless of whether it's occupied. With traditional letting, you (or an agent) find tenants directly — you receive market rent but bear the risk of voids, arrears, and management costs." },
  { q: "Do I earn more with guaranteed rent or traditional letting?", a: "Traditional letting typically offers 10-15% higher gross rent, but after deducting management fees (8-12%), void periods (2-4 weeks/year), maintenance, and arrears risk, guaranteed rent often delivers comparable or higher net income with zero hassle." },
  { q: "Who is guaranteed rent best for?", a: "Guaranteed rent is ideal for landlords who want hands-off income, those with mortgages requiring consistent payments, portfolio landlords scaling up, overseas landlords, and anyone who values certainty over chasing maximum rent." },
];

export default function GuaranteedRentComparison() {
  return (
    <>
      <BlogArticleHero
        title="Guaranteed Rent vs Traditional Letting — Full Comparison"
        excerpt="Side-by-side comparison of guaranteed rent vs traditional letting. Real income numbers and risk analysis."
        category="Comparison"
        date="June 2026"
        readTime="6 min"
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          {/* Comparison Table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 bg-navy-50 rounded-tl-xl font-bold text-navy-800">&nbsp;</th>
                  <th className="py-3 px-4 bg-gold-50 text-gold-700 font-bold text-center">Guaranteed Rent</th>
                  <th className="py-3 px-4 bg-navy-50 rounded-tr-xl text-navy-600 font-bold text-center">Traditional Letting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {[
                  { label: "Monthly income", gr: "Fixed — paid every month", tl: "Variable — depends on tenants" },
                  { label: "Void periods", gr: "Paid whether or not it is let", tl: "2-4 weeks/year typical" },
                  { label: "Rent arrears risk", gr: "Company pays you, not the tenant", tl: "You bear the risk" },
                  { label: "Management", gr: "Included in the lease", tl: "Self-manage or 8-12% agent fee" },
                  { label: "Maintenance", gr: "Handled by company", tl: "Your responsibility" },
                  { label: "Tenant finding", gr: "Not needed", tl: "Agent fee or your time" },
                  { label: "Contract length", gr: "3-5 years", tl: "6-12 month ASTs" },
                  { label: "Gross rent level", gr: "10-15% below market", tl: "Full market rate" },
                  { label: "Net income (after costs)", gr: "Often comparable or higher", tl: "Reduced by fees, voids, arrears" },
                  { label: "Stress level", gr: "Minimal", tl: "Variable" },
                  { label: "Best for", gr: "Hands-off, portfolio, overseas", tl: "Local, single property, experienced" },
                ].map(row => (
                  <tr key={row.label}>
                    <td className="py-3 px-4 font-semibold text-navy-800">{row.label}</td>
                    <td className="py-3 px-4 text-center text-navy-600">{row.gr}</td>
                    <td className="py-3 px-4 text-center text-navy-600">{row.tl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-navy max-w-none">
            <h2>The real income comparison</h2>
            <p>Let&apos;s say you have a 3-bed house in Birmingham worth £850/month market rent.</p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
                <h3 className="font-bold text-navy-800 mb-3">Guaranteed Rent</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Monthly rent</span><span className="font-semibold">£750</span></div>
                  <div className="flex justify-between"><span>Management fees</span><span className="font-semibold text-green-600">£0</span></div>
                  <div className="flex justify-between"><span>Void cost (0 weeks)</span><span className="font-semibold text-green-600">£0</span></div>
                  <div className="flex justify-between"><span>Maintenance</span><span className="font-semibold text-green-600">£0</span></div>
                  <div className="flex justify-between border-t border-gold-300 pt-2 font-bold"><span>Annual net</span><span>£9,000</span></div>
                </div>
              </div>
              <div className="bg-navy-50 border border-navy-200 rounded-2xl p-6">
                <h3 className="font-bold text-navy-800 mb-3">Traditional Letting</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Monthly rent</span><span className="font-semibold">£850</span></div>
                  <div className="flex justify-between"><span>Management (10%)</span><span className="font-semibold text-red-600">-£85/mo</span></div>
                  <div className="flex justify-between"><span>Void cost (3 weeks)</span><span className="font-semibold text-red-600">-£197/mo equiv</span></div>
                  <div className="flex justify-between"><span>Maintenance</span><span className="font-semibold text-red-600">-£50/mo avg</span></div>
                  <div className="flex justify-between border-t border-navy-300 pt-2 font-bold"><span>Annual net</span><span>£8,016</span></div>
                </div>
              </div>
            </div>

            <p>In this example, guaranteed rent delivers <strong>£984 more per year</strong> in actual income — despite the lower headline rent. And that&apos;s before factoring in the value of your time, stress, and the risk of a bad tenant. You can model your own <Link href="/calculators/void-period" className="text-gold-600 font-semibold">void period costs</Link> and <Link href="/calculators/monthly-cashflow" className="text-gold-600 font-semibold">monthly cash flow</Link> with our free calculators.</p>

            <h2>When traditional letting wins</h2>
            <p>Traditional letting can be the better choice if:</p>
            <ul>
              <li>You self-manage and live near the property (no agent fees)</li>
              <li>You have long-term, reliable tenants already in place</li>
              <li>You enjoy the hands-on aspect of being a landlord</li>
              <li>You have a single property and the premium matters</li>
            </ul>

            <h2>When guaranteed rent wins</h2>
            <ul>
              <li>You have multiple properties and want scale without hassle</li>
              <li>You live far from the property or overseas</li>
              <li>You need guaranteed income to cover mortgage payments</li>
              <li>You&apos;ve been burned by bad tenants, arrears, or void periods</li>
              <li>You value your time and peace of mind</li>
            </ul>

            <div className="not-prose bg-navy-800 rounded-2xl p-8 text-center my-8">
              <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">Ready to compare?</p>
              <h3 className="text-xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Get a free guaranteed rent valuation</h3>
              <p className="text-white/60 text-sm mb-5">We&apos;ll tell you exactly what your property would earn on a guaranteed rent contract — no obligation.</p>
              <Link href="/guaranteed-rent" className="btn-gold">Book free valuation</Link>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200">
            <FAQSchema faqs={faqs} />
            <Disclaimer type="financial" />
          </div>
        </div>
      </article>
      <RelatedArticles
        slug="guaranteed-rent-vs-traditional-letting"
      />
    </>
  );
}

