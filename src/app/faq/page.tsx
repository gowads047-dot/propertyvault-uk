import type { Metadata } from "next";
import Link from "next/link";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "FAQ — Guaranteed Rent, Calculators & Property Questions",
  description: "Answers to common questions about PropertyVault UK's guaranteed rent service, free property calculators, landlord management, and the Academy. Find what you need instantly.",
  keywords: "PropertyVault FAQ, guaranteed rent questions, landlord FAQ UK, property calculator help, PropertyVault Academy FAQ",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/faq/" },
  openGraph: {
    title: "FAQ — Guaranteed Rent, Calculators & Property Questions",
    description: "Answers to common questions about PropertyVault UK's guaranteed rent service, free property calculators, landlord management, and the Academy. Find what you need instantly.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/faq/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK FAQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — Guaranteed Rent, Calculators & Property Questions",
    description: "Answers to common questions about PropertyVault UK's guaranteed rent service, free property calculators, landlord management, and the Academy. Find what you need instantly.",
  },
};

const sections = [
  {
    heading: "Guaranteed Rent",
    faqs: [
      { q: "What is guaranteed rent?", a: "Guaranteed rent is a property management model where a company leases your property from you on a 3–5 year agreement and pays you a fixed monthly amount — regardless of whether the property is occupied. You receive your rent even during voids, without agent fees, maintenance headaches, or compliance stress." },
      { q: "How much below market rate will I receive?", a: "Typically 80–95% of the open market rental value, depending on the property's location, condition, and how we intend to use it. When you factor in no agent fees (8–15%), no voids (average £1,000–£2,000/year), and no maintenance costs, most landlords net more under guaranteed rent than traditional letting." },
      { q: "What areas do you cover?", a: "We currently cover Birmingham, Nottingham, Derby, Leicester, Coventry, and Sheffield. If you have a property outside these areas, contact us — we are expanding and may be able to help." },
      { q: "How long is the lease?", a: "Standard leases are 3–5 years. Shorter or longer terms can sometimes be accommodated — contact us to discuss your situation." },
      { q: "How quickly can you take on my property?", a: "We can typically complete an assessment and make a formal offer within 48 hours of viewing. Onboarding (lease signing and handover) usually takes 1–2 weeks." },
      { q: "What happens if you stop paying?", a: "Your lease agreement specifies exactly what happens in this scenario, including your right to reclaim vacant possession. This is why having a proper written lease — not a verbal agreement — is critical. All our agreements are in writing, on our headed paper, and clearly specify all obligations." },
      { q: "Can I sell my property while it's on guaranteed rent?", a: "Yes — you can sell your property during a guaranteed rent lease. The new owner would take on the existing lease obligations, which is actually a selling point (sitting tenants producing consistent income). Alternatively, we can discuss early exit arrangements if you need to sell vacant." },
    ],
  },
  {
    heading: "Calculators",
    faqs: [
      { q: "Are your calculators free to use?", a: "Yes — all 20 calculators on PropertyVault UK are completely free to use with no account required. They are designed for UK property investors, landlords, and buyers." },
      { q: "Are the calculator results accurate?", a: "Our calculators use current UK tax rates, stamp duty bands, and standard mortgage formulas. Results are estimates for planning purposes — always verify with a qualified accountant, solicitor, or mortgage broker before making financial decisions." },
      { q: "Which calculator should I start with?", a: "For investors analysing deals: Deal Analyser. For landlords: Landlord Tax or Void Period Cost. For buyers: Stamp Duty and Mortgage. For tax planning: Section 24 or Personal vs Ltd." },
      { q: "Can I save or share my calculator results?", a: "You can email your results to yourself directly from most calculators using the email capture feature. Shareable links are coming soon." },
    ],
  },
  {
    heading: "Property Academy",
    faqs: [
      { q: "What is PropertyVault Academy?", a: "PropertyVault Academy is a 12-module property deal sourcing programme designed for beginners. It covers finding motivated sellers, running numbers, building a buyers list, packaging deals, and compliance — everything needed to source your first deal as a professional." },
      { q: "Who is the Academy for?", a: "The Academy is designed for people who want to get into property investing but don't yet have the capital to buy outright. Deal sourcing allows you to earn commission fees by connecting motivated sellers with investors — without needing to own a property yourself." },
      { q: "How much does the Academy cost?", a: "Visit the Academy page for current pricing. The programme is designed to pay for itself within your first deal." },
    ],
  },
  {
    heading: "Rentura",
    faqs: [
      { q: "What is Rentura?", a: "Rentura is PropertyVault's property management SaaS platform — a digital Property Passport for landlords to manage compliance, tenants, maintenance, finances, and documents in one place." },
      { q: "Is Rentura only for PropertyVault landlords?", a: "No — Rentura is available to any UK landlord. You do not need to use PropertyVault's guaranteed rent service to access the platform." },
    ],
  },
  {
    heading: "Templates",
    faqs: [
      { q: "Are the legal templates free?", a: "Yes — all PropertyVault UK legal templates (AST, Section 8, Section 13, inventory checklist, and more) are free to download. They are produced for educational purposes and should be reviewed by a solicitor before use in live tenancy situations." },
      { q: "Are your templates UK-compliant?", a: "Templates are written to reflect current UK landlord-tenant law including the Housing Act 1988, Renters' Rights Act 2025, and relevant regulations. However, legislation changes frequently — always check the current legal position before use." },
    ],
  },
];

const allFaqs = sections.flatMap(s => s.faqs);

export default function FaqPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4 text-center">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Help & answers</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Frequently Asked Questions</h1>
          <p className="text-navy-200 max-w-xl mx-auto">Find answers about guaranteed rent, calculators, the Academy, Rentura, and templates.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          {sections.map(section => (
            <div key={section.heading} className="mb-10">
              <h2 className="text-lg font-bold text-navy-800 mb-4 border-b border-navy-100 pb-2">{section.heading}</h2>
              <div className="space-y-3">
                {section.faqs.map((faq, i) => (
                  <details key={i} className="group border border-navy-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-navy-800 text-sm hover:text-gold-600 transition-colors">
                      {faq.q}
                      <span className="ml-3 flex-shrink-0 w-5 h-5 rounded-full bg-navy-50 flex items-center justify-center text-navy-400 group-open:bg-gold-100 group-open:text-gold-700 transition-all">
                        <svg className="w-3 h-3 group-open:rotate-180 transition-transform" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-navy-600 leading-relaxed border-t border-navy-50 pt-3">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-12 bg-navy-800 rounded-2xl p-8 text-center">
            <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-3">Still have questions?</p>
            <h3 className="text-xl font-bold text-white mb-3">Get a direct answer</h3>
            <p className="text-white/60 text-sm mb-5">WhatsApp Nass directly — typical response within 2 hours.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://wa.me/447415721628" target="_blank" rel="noopener noreferrer" className="btn-gold">
                WhatsApp now →
              </a>
              <Link href="/contact" className="btn-outline !border-white/20 !text-white hover:!bg-white/10">
                Contact form
              </Link>
            </div>
          </div>

          <FAQSchema faqs={allFaqs} />
        </div>
      </section>
    </>
  );
}
