import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "PRS Ombudsman Registration — Complete Landlord Guide 2026 | PropertyVault UK",
  description: "All private landlords in England must now register with the PRS Ombudsman under the Renters' Rights Act 2025. Here is exactly what to do, the deadline, and the penalties for non-compliance.",
  keywords: "PRS ombudsman registration landlord, private rented sector ombudsman UK, landlord ombudsman registration 2025, Renters Rights Act ombudsman, landlord registration England 2026",
  alternates: { canonical: "https://propertyvaultuk.co.uk/blog/prs-ombudsman-landlord-registration/" },
  openGraph: {
    title: "PRS Ombudsman Registration — Complete Landlord Guide 2026 | PropertyVault UK",
    description: "All private landlords in England must now register with the PRS Ombudsman under the Renters' Rights Act 2025. Here is exactly what to do, the deadline, and the penalties for non-compliance.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/blog/prs-ombudsman-landlord-registration/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PRS Ombudsman Landlord Registration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PRS Ombudsman Registration — Complete Landlord Guide 2026 | PropertyVault UK",
    description: "All private landlords in England must now register with the PRS Ombudsman under the Renters' Rights Act 2025. Here is exactly what to do, the deadline, and the penalties for non-compliance.",
  },
};

const faqs = [
  { q: "Do all landlords have to register with the PRS Ombudsman?", a: "Yes. Under the Renters' Rights Act 2025, all private landlords letting residential property in England are legally required to register with the new Private Rented Sector (PRS) Ombudsman. This is mandatory — there is no opt-out. Self-managing landlords must register directly. Landlords using a letting agent are covered by the agent's membership, but the landlord themselves must also be registered." },
  { q: "What happens if I don't register with the PRS Ombudsman?", a: "Failure to register is a criminal offence under the Renters' Rights Act 2025. The penalty can be a fine of up to £5,000 per property. Local housing authorities have enforcement powers and can serve compliance notices. Continued non-compliance after a notice can result in a rent repayment order — tenants can reclaim up to 12 months of rent paid during the period of non-compliance." },
  { q: "How much does PRS Ombudsman registration cost?", a: "The PRS Ombudsman is expected to charge a membership fee to landlords, similar to the existing property agent redress schemes. The government has indicated the fee will be set at a level proportionate to portfolio size — likely a small annual fee per property. Specific fee schedules will be published by the PRS Ombudsman body once fully operational." },
  { q: "What does the PRS Ombudsman actually do?", a: "The PRS Ombudsman resolves disputes between private landlords and tenants without the need for court proceedings. Tenants can bring complaints about maintenance failures, deposit disputes, communication failures, and other breaches of their tenancy agreement. The Ombudsman's decisions are binding on landlords — they can require compensation payments, repairs, or apologies." },
  { q: "Do I need to register if my letting agent is already a member of a redress scheme?", a: "Even if your letting agent is already a member of The Property Ombudsman (TPOS) or the Property Redress Scheme (PRS), you as the landlord must also be individually registered with the PRS Ombudsman. Agent membership and landlord membership are separate requirements under the Renters' Rights Act 2025." },
];

const steps = [
  { n: "1", title: "Check your registration status", body: "If you currently use a letting agent, confirm whether your agent has registered you or whether you need to register independently. Most self-managing landlords will need to register directly." },
  { n: "2", title: "Register at the PRS Ombudsman portal", body: "Go to the official PRS Ombudsman website (prs.co.uk or the government-designated portal) and complete the registration form. You will need: your name and contact details, the address(es) of each rental property, and proof of identity." },
  { n: "3", title: "Pay the annual membership fee", body: "Pay the registration fee for your portfolio. Keep your payment confirmation — this is your proof of compliance and may be requested by local housing authorities or tenants." },
  { n: "4", title: "Display your membership number", body: "You must provide your PRS Ombudsman membership number in any tenancy agreement, advertisement, and correspondence with tenants. This is a legal requirement under the Renters' Rights Act 2025." },
  { n: "5", title: "Renew annually", body: "PRS Ombudsman membership must be renewed each year. Lapsed membership is treated as non-registration for the purposes of enforcement. Set a calendar reminder at least 30 days before your renewal date." },
];

export default function PRSOmbudsmanGuideArticle() {
  return (
    <>
      <BlogArticleHero
        title="PRS Ombudsman Registration — What Every Landlord Must Do Now"
        excerpt="All private landlords in England must register with the PRS Ombudsman under the Renters' Rights Act 2025. Failure is a criminal offence. Here is exactly what to do."
        category="Landlords"
        date="July 2026"
        readTime="7 min"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80"
      />
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">

          <div className="not-prose bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900">
            <p className="font-bold mb-1">Action required — this is a legal obligation</p>
            <p>PRS Ombudsman registration is mandatory for all private landlords in England under the Renters&apos; Rights Act 2025. Failure to register is a criminal offence carrying a fine of up to £5,000 per property.</p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Is the PRS Ombudsman?</h2>
          <p>The Private Rented Sector (PRS) Ombudsman is a new mandatory dispute resolution body created by the Renters&apos; Rights Act 2025. It replaces the patchwork of voluntary redress schemes that existed previously and extends mandatory membership to private landlords — not just letting agents.</p>
          <p>The Ombudsman handles complaints from tenants about landlord behaviour: maintenance failures, deposit disputes, communication breakdowns, unlawful eviction attempts, and other breaches of the tenancy agreement. Its decisions are binding on landlords and can include compensation orders, requirements to carry out repairs, and formal apologies.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Who Must Register?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>All private landlords</strong> letting residential property in England — regardless of portfolio size. A landlord with one property and a landlord with 100 properties both have the same obligation.</li>
            <li><strong>Self-managing landlords</strong> must register directly with the PRS Ombudsman.</li>
            <li><strong>Landlords using a letting agent</strong> — your agent&apos;s membership in a redress scheme (TPOS or PRS) does not cover you. You must also register individually.</li>
            <li><strong>Portfolio landlords</strong> — register once but list all properties. Each property must be covered.</li>
          </ul>
          <p>Landlords renting through a social housing provider or who have only commercial tenants are exempt. Holiday lets and short-term accommodation (Airbnb-style) are a grey area — take legal advice if your situation is unclear.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Penalties for Non-Registration</h2>
          <div className="not-prose grid sm:grid-cols-3 gap-3">
            {[
              { label: "Fine per property", value: "Up to £5,000" },
              { label: "Rent repayment order", value: "Up to 12 months" },
              { label: "Offence type", value: "Criminal" },
            ].map(s => (
              <div key={s.label} className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-red-700 mb-1">{s.value}</p>
                <p className="text-xs text-red-600">{s.label}</p>
              </div>
            ))}
          </div>
          <p>Local housing authorities have new enforcement powers under the Act. They can proactively check registration status and issue compliance notices without waiting for a tenant complaint. If a landlord fails to comply with a notice, further fines and rent repayment orders follow.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>How to Register — Step by Step</h2>
          <div className="not-prose space-y-3">
            {steps.map(s => (
              <div key={s.n} className="flex gap-4 bg-white border border-navy-100 rounded-xl p-4">
                <span className="w-8 h-8 rounded-full bg-gold-400 text-navy-900 text-sm font-bold flex items-center justify-center flex-shrink-0">{s.n}</span>
                <div>
                  <p className="font-bold text-navy-800 text-sm">{s.title}</p>
                  <p className="text-xs text-navy-500 mt-1">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>What Tenants Can Complain About</h2>
          <p>Once you are registered, your tenants have the right to bring complaints to the PRS Ombudsman. The Ombudsman can investigate:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Failure to carry out repairs within a reasonable timeframe</li>
            <li>Deposit deductions you cannot properly evidence</li>
            <li>Harassment or interference with quiet enjoyment</li>
            <li>Failure to provide required documents (EPC, gas safety certificate, How to Rent guide)</li>
            <li>Unlawful attempts to evict without using the Section 8 procedure</li>
            <li>Poor communication or failure to respond to maintenance requests</li>
          </ul>
          <p>The Ombudsman&apos;s process is free for tenants and faster than court. Decisions are made within a set timeframe and compensation awards are binding — landlords cannot appeal to court to overturn an award.</p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>How Guaranteed Rent Protects You</h2>
          <p>Landlords on a guaranteed rent agreement with PropertyVault have all compliance obligations handled by us. We register, manage all tenant communication, handle maintenance, and deal with any Ombudsman complaints on your behalf — so you never have to interact with the scheme directly.</p>
          <div className="not-prose flex flex-wrap gap-3 mt-4">
            <Link href="/guaranteed-rent" className="btn-gold">See how guaranteed rent works →</Link>
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Guides</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/renters-rights-act" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Law</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Renters&apos; Rights Act 2025 — Full Guide</p>
              </Link>
              <Link href="/blog/renters-reform-act-landlord-checklist" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Landlords</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Renters&apos; Rights Act — The Landlord Checklist</p>
              </Link>
              <Link href="/templates/section-8-notice" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Template</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Free Section 8 Notice Template</p>
              </Link>
              <Link href="/templates/landlord-compliance" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Template</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Landlord Compliance Checklist</p>
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
