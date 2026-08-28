import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "Renters' Rights Act Landlord Checklist 2025 — 12 Things You Must Do Now",
  description: "The Renters' Rights Act 2025 is live. Here is the practical landlord checklist: what to update, what to stop doing, what to prepare — before enforcement catches you out.",
  keywords: "renters reform act landlord checklist, renters rights act 2025 landlords, landlord compliance checklist 2025, section 21 abolished what to do, periodic tenancy landlord checklist",
  openGraph: {
    title: "Renters' Rights Act Landlord Checklist 2025",
    description: "12 practical actions every landlord must take now that the Renters' Rights Act is live. Section 21 is gone — here is what replaces it.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/renters-reform-act-landlord-checklist/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Renters' Rights Act Landlord Checklist 2025" }],
  },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/renters-reform-act-landlord-checklist/" },
};

const faqs = [
  {
    q: "Is Section 21 definitely abolished — can I still use it?",
    a: "No. Section 21 no-fault evictions were abolished when the Renters' Rights Act came into force in 2025. Any Section 21 notice served after the commencement date is invalid. You must now use Section 8 and cite a specific legal ground. Serving an invalid Section 21 can result in a £7,000 fine or more.",
  },
  {
    q: "Do I need new tenancy agreements after the Renters' Rights Act?",
    a: "Yes — fixed-term ASTs are no longer valid for new tenancies. All new tenancies must be periodic (rolling) from the start. Existing tenancy agreements were automatically converted to periodic. You should update your template agreements to remove fixed-term references and ensure the Section 13 rent review process is clearly documented.",
  },
  {
    q: "How do I raise rent legally now that Section 21 is gone?",
    a: "Rent increases must now be done via a formal Section 13 notice, served at least 2 months before the new rent takes effect, and no more than once every 12 months. Any rent review clause in a tenancy agreement is void. Tenants have the right to challenge any proposed increase at the First-tier Tribunal.",
  },
  {
    q: "What happens if I haven't registered with a Property Redress Scheme?",
    a: "Private landlords managing their own properties are now required to join the new Private Rented Sector Ombudsman (which replaces the existing redress schemes). Operating without registration can result in civil penalties of up to £7,000 for a first offence and up to £40,000 for repeat offences. Registration is mandatory, not optional.",
  },
  {
    q: "Can I get tenants out quickly if I want to sell my property?",
    a: "Yes, but not immediately. Under the Renters' Rights Act, you can regain possession to sell using a new mandatory Ground 1A, but you must give at least 4 months' notice and cannot serve this notice in the first 12 months of a tenancy. The property must then be sold — you cannot re-let it for at least 12 months after gaining possession. Courts can still refuse possession if correct procedure hasn't been followed.",
  },
];

const CHECKLIST = [
  {
    n: "01",
    title: "Stop using Section 21 immediately",
    urgent: true,
    detail: "Section 21 is abolished. Any notice served after the commencement date is void and could result in a fine up to £7,000. If you were planning a no-fault eviction, you now need a Section 8 ground. The most commonly used grounds are: rent arrears (Ground 8/10/11), selling the property (Ground 1A), family occupation (Ground 1), or antisocial behaviour.",
    action: "Review any pending possession proceedings with a solicitor.",
    link: { text: "Download Section 8 notice template →", href: "/templates/section-8-notice" },
  },
  {
    n: "02",
    title: "Update your tenancy agreement templates",
    urgent: true,
    detail: "Fixed-term ASTs cannot be used for new tenancies. All new tenancies are periodic from day one — rolling monthly by default. Remove any fixed-term end dates, break clauses, or fixed-term renewal terms from your templates. Rent review clauses (e.g. 'rent increases by 3% per year') are also void — delete them.",
    action: "Replace your AST template with a periodic tenancy agreement.",
    link: { text: "Download free AST template →", href: "/templates/ast" },
  },
  {
    n: "03",
    title: "Set up the Section 13 rent review process",
    urgent: true,
    detail: "Rent can only increase once every 12 months, via a formal Section 13 notice served at least 2 months before the new rent takes effect. You cannot increase rent in any other way — not via a clause in the tenancy, not via informal agreement documented in an email. The Section 13 route is the only valid legal route.",
    action: "Calendar your rent review dates and use a compliant Section 13 notice.",
    link: { text: "Download Section 13 notice template →", href: "/templates/section-13-notice" },
  },
  {
    n: "04",
    title: "Register with the PRS Ombudsman",
    urgent: true,
    detail: "All private landlords — including self-managing landlords who do not use an agent — must now join the new Private Rented Sector Ombudsman. This replaces the previous redress scheme requirements. Fines for non-compliance start at £7,000 and rise to £40,000 for repeated breaches. Registration is free for small landlords.",
    action: "Visit the official PRS Ombudsman website to register.",
  },
  {
    n: "05",
    title: "Join the Property Portal (Landlord Register)",
    urgent: true,
    detail: "The Renters' Rights Act introduces a national Property Portal — a mandatory landlord register. You must register each property you let, provide compliance evidence (EPC, gas safety, EICR), and keep information up to date. Failing to register is a criminal offence with a £7,000 penalty. The portal is being phased in through 2025-2026.",
    action: "Check the portal launch date and register when it opens in your area.",
  },
  {
    n: "06",
    title: "Audit your properties for Awaab's Law compliance",
    urgent: false,
    detail: "Awaab's Law — named after a child who died from mould exposure — now applies to private rented properties. You must investigate and begin fixing emergency hazards (heating failure, major leaks) within 24 hours and respond to non-emergency hazards like damp and mould within 14 days. Councils can now issue emergency repair notices with enforcement action.",
    action: "Inspect all properties for damp, mould, and ventilation issues. Log all repair requests and response times.",
    link: { text: "Download repair log template →", href: "/templates/repair-report" },
  },
  {
    n: "07",
    title: "Create a pet policy and response process",
    urgent: false,
    detail: "Landlords can no longer include a blanket 'no pets' clause. Tenants have a right to request a pet and you must respond in writing within 28 days. You can only refuse on specific reasonable grounds. You can require a tenant to take out pet insurance, but you cannot charge a higher deposit (deposit cap still applies). Silence counts as refusal after 28 days and can be challenged.",
    action: "Create a written pet request response process.",
    link: { text: "Download pet permission letter template →", href: "/templates/pet-permission" },
  },
  {
    n: "08",
    title: "Review your deposit protection timelines",
    urgent: false,
    detail: "Deposit protection rules are unchanged but now sit alongside a periodic tenancy framework. Since there are no fixed-term end dates, you need to ensure your deposit protection is renewed or maintained if you switch providers. The 30-day protection deadline from receipt of deposit is unchanged.",
    action: "Audit each tenancy to confirm deposit is protected and prescribed information was served.",
  },
  {
    n: "09",
    title: "Understand the new eviction grounds and notice periods",
    urgent: false,
    detail: "Section 8 now has expanded mandatory grounds to compensate for losing Section 21. Key new/updated grounds: Ground 1A (selling — 4 months' notice, cannot serve in first 12 months), Ground 1 (family occupation — 4 months' notice), Ground 6A (demolition/redevelopment), Ground 7A (antisocial behaviour — immediate/serious cases). Courts can still refuse possession if proper procedure is not followed.",
    action: "Familiarise yourself with all 18+ Section 8 grounds before you ever need them.",
    link: { text: "Read the full Section 8 guide →", href: "/templates/section-8-notice" },
  },
  {
    n: "10",
    title: "Stop rental bidding — and document your asking rent",
    urgent: false,
    detail: "Landlords and agents can no longer invite or accept bids above the advertised asking rent. You must set an asking price and stick to it. If multiple tenants apply, you choose based on non-financial criteria. Breaching this rule is an offence under the Renters' Rights Act.",
    action: "Set a firm asking rent for each property and do not deviate from it during marketing.",
  },
  {
    n: "11",
    title: "Decide whether guaranteed rent removes your risk",
    urgent: false,
    detail: "With Section 21 gone, getting a problem tenant out is slower and more expensive than before. The minimum timeline for possession through the courts — even on a clear rent arrears case — is typically 3-6 months. Some landlords in the Midlands are switching to guaranteed rent schemes to remove tenant risk entirely: you get paid every month regardless, and the scheme provider takes on tenancy management, compliance, and void risk.",
    action: "Compare your current net income against a guaranteed rent offer.",
    link: { text: "Get a free guaranteed rent quote →", href: "/guaranteed-rent" },
  },
  {
    n: "12",
    title: "Get proper accounting in place",
    urgent: false,
    detail: "With rents now only reviewable once a year via a formal process, and court costs for possession rising, accurate P&L tracking per property is more important than ever. Know your actual net yield. Know when your rent is due for review. Know your Section 24 tax position. Managing without this data is the most common reason landlords take a loss without realising it.",
    action: "Run your numbers through the cash flow and landlord tax calculators.",
    link: { text: "Try the free BTL cash flow calculator →", href: "/calculators/monthly-cashflow" },
  },
];

export default function RentersReformChecklistPage() {
  return (
    <>
      <ArticleSchema
        headline="Renters' Rights Act 2025 — The Landlord Checklist"
        description="12 practical actions every landlord must take now that the Renters' Rights Act is live. Section 21 is gone — here is exactly what to do instead."
        slug="renters-reform-act-landlord-checklist"
        datePublished="2026-06-25"
        section="Landlords"
      />
      <BlogArticleHero
        title="Renters' Rights Act 2025 — The Landlord Checklist"
        excerpt="12 practical actions every landlord must take now that the Renters' Rights Act is live. Section 21 is gone — here is exactly what to do instead."
        date="25 June 2026"
        readTime="9 min"
        category="Landlords"
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-article">

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
            <p className="font-bold text-red-800 text-sm mb-1">Important — read before you do anything</p>
            <p className="text-red-700 text-sm leading-relaxed">The Renters&apos; Rights Act 2025 is now in force. Several items on this checklist are urgent (marked in red) — doing them wrong or late carries fines of £7,000–£40,000. This is a practical summary, not legal advice. For complex situations — ongoing possession proceedings, lease disputes — get a solicitor involved.</p>
          </div>

          <p className="lead">The Renters&apos; Rights Act is the biggest change to the private rented sector in 30 years. It abolishes Section 21, ends fixed-term tenancies, restricts rent increases, mandates faster repairs, and requires landlords to join a national register. Most landlords are unprepared. This checklist tells you exactly what to do — and in what order.</p>

          <div className="space-y-6 mt-8">
            {CHECKLIST.map((item) => (
              <div key={item.n} className={`rounded-2xl border p-6 ${item.urgent ? "border-red-200 bg-red-50" : "border-navy-100 bg-navy-50/30"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${item.urgent ? "bg-red-100 text-red-700" : "bg-navy-100 text-navy-700"}`}>
                    {item.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h2 className="font-extrabold text-navy-800 text-base" style={{ fontFamily: "var(--font-family-heading)", margin: 0 }}>{item.title}</h2>
                      {item.urgent && <span className="text-xs font-bold px-2 py-0.5 bg-red-600 text-white rounded-full">URGENT</span>}
                    </div>
                    <p className="text-navy-600 text-sm leading-relaxed mb-3">{item.detail}</p>
                    <div className="bg-white border border-navy-100 rounded-xl px-4 py-3 mb-3">
                      <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-1">Action</p>
                      <p className="text-sm text-navy-700 font-medium">{item.action}</p>
                    </div>
                    {item.link && (
                      <Link href={item.link.href} className="text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors">{item.link.text}</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-navy-800 rounded-2xl text-white text-center">
            <p className="text-gold-400 font-bold text-xs uppercase tracking-widest mb-2">The stress-free alternative</p>
            <h3 className="text-xl font-extrabold mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Tired of compliance headaches?</h3>
            <p className="text-navy-200 text-sm leading-relaxed mb-5">With Section 21 gone, removing a problem tenant now takes months and thousands in legal costs. Some landlords in the Midlands are switching to guaranteed rent — no tenants to manage, no possession proceedings, no compliance risk. You just receive your rent every month.</p>
            <Link href="/guaranteed-rent" className="inline-block bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-gold-300 transition-colors">See how guaranteed rent works →</Link>
          </div>

          <h2>Further reading</h2>
          <ul>
            <li><Link href="/blog/renters-rights-act">Full Renters&apos; Rights Act 2025 guide — every change explained</Link></li>
            <li><Link href="/templates/section-8-notice">Section 8 Notice template — free download</Link></li>
            <li><Link href="/templates/section-13-notice">Section 13 Rent Increase Notice template</Link></li>
            <li><Link href="/templates/ast">Assured Shorthold Tenancy template</Link></li>
            <li><Link href="/calculators/void-period">Void period cost calculator — what empty months are costing you</Link></li>
          </ul>

          <Disclaimer type="legal" />
        </div>
        <HelpCTA />
      </article>

      <FAQSchema faqs={faqs} />
      <RelatedArticles
        slug="renters-reform-act-landlord-checklist"
      />
    </>
  );
}
