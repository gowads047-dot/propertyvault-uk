import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { ArticleSchema } from "@/components/seo/ArticleSchema";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/is-guaranteed-rent-a-scam/" },
  title: "Is Guaranteed Rent a Scam? — Honest Guide for UK Landlords | PropertyVault UK",
  description: "Landlords ask: is guaranteed rent too good to be true? We explain how legitimate schemes work, the red flags to watch for, and what to check before signing anything.",
  keywords: "is guaranteed rent a scam, guaranteed rent scam UK, guaranteed rent scheme legitimate, rent to rent scam, guaranteed rent red flags",
  openGraph: {
    title: "Is Guaranteed Rent a Scam? — Honest Guide for UK Landlords | PropertyVault UK",
    description: "Landlords ask: is guaranteed rent too good to be true? We explain how legitimate schemes work, the red flags to watch for, and what to check before signing anything.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/is-guaranteed-rent-a-scam/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Is Guaranteed Rent a Scam?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Guaranteed Rent a Scam? — Honest Guide for UK Landlords | PropertyVault UK",
    description: "Landlords ask: is guaranteed rent too good to be true? We explain how legitimate schemes work, the red flags to watch for, and what to check before signing anything.",
  },
};

const faqs = [
  { q: "Is guaranteed rent a scam?", a: "Guaranteed rent itself is a legitimate and widely used property model. However, there are fraudulent operators who misrepresent what they offer. A legitimate scheme involves a company leasing your property for 3–5 years at a fixed monthly rent, with full management included. Red flags include upfront fees, vague contracts, unrealistically high rent offers, and pressure to sign quickly." },
  { q: "How do I know if a guaranteed rent company is legitimate?", a: "Check that the company: (1) is registered at Companies House with a trading history, (2) provides a written lease agreement before taking possession, (3) is a member of a Property Redress Scheme (TPOS or PRS), (4) offers rent at or slightly below market rate (not significantly above), and (5) can show you existing landlord references." },
  { q: "What is the difference between guaranteed rent and rent to rent?", a: "They are essentially the same model. A company leases your property and sublets it — often as an HMO or serviced accommodation — at a higher rent than they pay you, keeping the margin as profit. Both terms are used interchangeably, though 'guaranteed rent' emphasises the payment security for the landlord." },
  { q: "Can I lose my property through a guaranteed rent scheme?", a: "You cannot lose ownership of your property. However, if the company subletting it goes insolvent, you may have tenants in occupation with their own rights, and the company's rent payments will stop. This is why checking financial stability and using a proper lease agreement is critical before signing." },
  { q: "What should a guaranteed rent contract include?", a: "A legitimate guaranteed rent contract should include: the fixed monthly rent amount, the lease term (typically 3–5 years), who is responsible for repairs and maintenance, what happens if the company goes insolvent, notice periods for both parties, and whether you can access the property for inspections." },
];

export default function IsGuaranteedRentAScamArticle() {
  return (
    <>
      <ArticleSchema
        headline="Is Guaranteed Rent a Scam? An Honest Answer for Landlords"
        description="Landlords ask this question constantly. Here is an honest breakdown of how legitimate guaranteed rent works, what fraud looks like, and exactly what to check before signing."
        slug="is-guaranteed-rent-a-scam"
        datePublished="2026-06-25"
        section="Landlords"
      />
      <BlogArticleHero
        title="Is Guaranteed Rent a Scam? An Honest Answer for Landlords"
        excerpt="Landlords ask this question constantly. Here is an honest breakdown of how legitimate guaranteed rent works, what fraud looks like, and exactly what to check before signing."
        category="Landlords"
        date="June 2026"
        readTime="7 min"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">

          <p className="text-lg">The short answer: <strong>guaranteed rent is not a scam — but the industry has bad actors.</strong> Understanding the difference between a legitimate scheme and a fraudulent one could save you thousands.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Guaranteed Rent Actually Is</h2>
          <p>A legitimate guaranteed rent scheme works like this: a property management company leases your property from you on a 3–5 year agreement. They pay you a fixed monthly rent — usually slightly below open market rate — and sublet the property to tenants at market rate, keeping the difference as their profit.</p>
          <p>You receive your rent every month whether the property is occupied or not. The company manages everything: finding tenants, maintenance, compliance, inspections. You simply collect your payment.</p>
          <p>This model is entirely legal, widely used, and can be genuinely beneficial for landlords who want a hands-off, predictable income without agent fees or void periods.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Why People Think It's a Scam</h2>
          <p>The model has attracted fraudulent operators who:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Promise rent above market rate</strong> — no legitimate business can pay you more than market rent and remain profitable. If someone offers you £200/month above what the property would let for, ask how.</li>
            <li><strong>Take large upfront fees</strong> — legitimate guaranteed rent companies make their money from the subletting margin. They do not charge landlords setup fees.</li>
            <li><strong>Disappear after a few months</strong> — a common fraud pattern is to collect a few months of keys-in-hand while not paying you or the tenants, then vanish.</li>
            <li><strong>Use vague or non-existent contracts</strong> — a company without a proper written lease is not operating legitimately.</li>
            <li><strong>Apply high-pressure sales tactics</strong> — "this offer is only available today" is a red flag in any financial arrangement.</li>
          </ul>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>The 7-Point Legitimacy Checklist</h2>
          <p>Before signing anything, verify all of the following:</p>
          <div className="not-prose bg-navy-50 rounded-xl p-5 text-sm">
            <ol className="space-y-3">
              {[
                { n: "1", t: "Companies House registration", d: "Search the company name at companieshouse.gov.uk. Check incorporation date, directors, and filing history. A company registered last month with no accounts is a red flag." },
                { n: "2", t: "Property Redress Scheme membership", d: "The company should be a member of either The Property Ombudsman (TPOS) or the Property Redress Scheme (PRS). Check membership at their respective websites." },
                { n: "3", t: "Rent at or below market rate", d: "Get a letting agent appraisal of your property's open market rent. A legitimate operator will offer you 80–95% of this figure to cover their margin. Anything above market rate should prompt questions." },
                { n: "4", t: "Written lease agreement before handover", d: "Do not hand over keys without a signed lease. The agreement should be on their headed paper and specify rent, term, maintenance responsibilities, and exit clauses." },
                { n: "5", t: "Existing landlord references", d: "Ask for two or three landlords currently using the scheme and call them directly. Legitimate operators will be happy to provide these." },
                { n: "6", t: "Transparency about subletting", d: "Ask how they intend to use the property — HMO, single tenancy, serviced accommodation. The use affects your mortgage terms and insurance. A legitimate operator will tell you plainly." },
                { n: "7", t: "No upfront fees", d: "You should not pay anything to join a guaranteed rent scheme. The company profits from the rent difference, not from charging you." },
              ].map(item => (
                <li key={item.n} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.n}</span>
                  <div><strong className="text-navy-800">{item.t}:</strong> {item.d}</div>
                </li>
              ))}
            </ol>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Legitimate Guaranteed Rent Looks Like in Practice</h2>
          <p>Here is an example of a legitimate arrangement. A landlord in Erdington, Birmingham has a 3-bed property with an open market rent of £1,100/month. A guaranteed rent company offers £900/month on a 4-year lease, paying whether occupied or not, with full management included.</p>
          <p>The landlord previously used a letting agent at 12% + VAT (£132/month), experienced one 2-month void per year (£2,200 lost), and spent an average of £600/year on management and compliance issues. Their net annual income was roughly £9,468.</p>
          <p>Under guaranteed rent at £900/month with zero voids and zero management: £10,800/year. More income, less effort.</p>
          <p>The company makes their margin by subletting the property as an HMO at £450/room × 4 rooms = £1,800/month gross. After costs, they profit from the difference. Everyone benefits — as long as the operator is legitimate.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Questions to Ask Before Signing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>How long have you been operating in this area?</li>
            <li>Can I speak to three of your current landlords?</li>
            <li>How will you use the property? (HMO, SA, single let?)</li>
            <li>What happens if you stop paying?</li>
            <li>What notice period do I have if I want to exit?</li>
            <li>Are you a member of a Property Redress Scheme?</li>
            <li>Can I see a copy of the lease agreement before committing?</li>
          </ul>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Our Guaranteed Rent Scheme</h2>
          <p>PropertyVault UK has been operating guaranteed rent across Birmingham, Nottingham, Derby, Leicester, Coventry, and Sheffield. We offer 3–5 year leases at transparent rates, full management, and direct contact with Nass — not a call centre.</p>
          <div className="not-prose flex flex-wrap gap-3 mt-4">
            <Link href="/guaranteed-rent" className="btn-gold">Get a free rent estimate →</Link>
            <Link href="/guaranteed-rent" className="btn-outline">How it works →</Link>
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/guaranteed-rent-explained" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Landlords</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Guaranteed Rent Explained</p>
              </Link>
              <Link href="/blog/guaranteed-rent-vs-traditional-letting" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Landlords</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Guaranteed Rent vs Traditional Letting</p>
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
