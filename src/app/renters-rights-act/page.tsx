import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Renters' Rights Act 2025 — Complete Landlord & Tenant Guide | PropertyVault UK",
  description:
    "Everything landlords and tenants need to know about the Renters' Rights Act 2025. Section 21 abolition, fixed-term tenancies, rent increases, pets, PRS Ombudsman, and what to do now.",
  keywords:
    "Renters Rights Act 2025, Section 21 abolished, fixed term tenancy abolished, rent increase rules 2025, PRS Ombudsman registration, landlord Renters Rights Act checklist, periodic tenancy UK",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/renters-rights-act/" },
  openGraph: {
    title: "Renters' Rights Act 2025 — Complete Landlord & Tenant Guide | PropertyVault UK",
    description: "Everything landlords and tenants need to know about the Renters' Rights Act 2025. Section 21 abolition, fixed-term tenancies, rent increases, pets, PRS Ombudsman, and what to do now.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/renters-rights-act/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Renters' Rights Act 2025 Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renters' Rights Act 2025 — Complete Landlord & Tenant Guide | PropertyVault UK",
    description: "Everything landlords and tenants need to know about the Renters' Rights Act 2025. Section 21 abolition, fixed-term tenancies, rent increases, pets, PRS Ombudsman, and what to do now.",
  },
};

const faqs = [
  {
    q: "When did the Renters' Rights Act come into force?",
    a: "The Renters' Rights Act received Royal Assent and came into force in 2025. Key provisions — including the abolition of Section 21, the end of fixed-term tenancies for new lets, and the introduction of the PRS Ombudsman registration requirement — took effect from the commencement date. All existing periodic tenancies were converted to the new regime on the transition date.",
  },
  {
    q: "What has replaced Section 21 evictions?",
    a: "Section 21 'no-fault' evictions have been abolished. Landlords now use Section 8 grounds to seek possession. The Act significantly expanded the available grounds — including new mandatory grounds for landlords wishing to sell the property or move in a family member. Notice periods vary by ground: 4 months for sale/relocation grounds, 2–4 weeks for serious rent arrears, and as little as immediate notice for serious antisocial behaviour. Always check the specific ground and its notice period.",
  },
  {
    q: "Are fixed-term tenancies still legal?",
    a: "No. New fixed-term tenancy agreements are no longer permitted. All new tenancies are now periodic from the outset — typically rolling on a month-by-month basis. Tenants can give two months' notice to leave at any point. Existing fixed-term tenancies were converted to periodic tenancies on the statutory transition date.",
  },
  {
    q: "How can landlords increase rent under the Renters' Rights Act?",
    a: "Landlords can only increase rent once per year via the Section 13 process. They must give at least two months' written notice using the prescribed form. Tenants have the right to challenge the proposed increase at the First-tier Tribunal (Property Chamber), which will assess whether the increase is at or below the market rent for comparable properties.",
  },
  {
    q: "Are tenants now allowed to keep pets?",
    a: "Yes. Tenants have the right to request permission to keep a pet, and landlords cannot unreasonably refuse. Landlords may require the tenant to take out pet damage insurance as a condition of consent. Landlords must respond to a pet request within 28 days.",
  },
  {
    q: "What is the PRS Ombudsman and do I need to register?",
    a: "The Private Rented Sector (PRS) Ombudsman is a new statutory ombudsman scheme that all private landlords in England must join. It provides a free, impartial dispute resolution service for tenants. Failure to register is a criminal offence with fines up to £5,000 per property. Registration is done through the government's official landlord registration portal.",
  },
  {
    q: "What is the new Decent Homes Standard for rentals?",
    a: "The Renters' Rights Act extended the Decent Homes Standard — previously applying only to social housing — to the private rented sector. Rental properties must meet minimum standards for structural integrity, heating, sanitation, and freedom from serious hazards. Local councils have enhanced enforcement powers to require landlords to make improvements.",
  },
  {
    q: "Can landlords still reference tenants under the new rules?",
    a: "Yes. Referencing is still allowed and strongly recommended. However, landlords cannot discriminate unlawfully against prospective tenants on the basis of their receipt of housing benefit or universal credit (the so-called 'No DSS' ban is strengthened). Blanket 'no DSS' policies are unlawful.",
  },
  {
    q: "What happens to student tenancies under the Renters' Rights Act?",
    a: "A limited exemption applies to student accommodation where the landlord is a higher education provider. However, private landlords — including those letting to students — are subject to the main provisions of the Act. This means students can give two months' notice and leave mid-year, which has significant implications for the student HMO market.",
  },
  {
    q: "What are the new Section 8 grounds for possession?",
    a: "The Act significantly expanded the Section 8 grounds. New mandatory grounds include: the landlord intending to sell the property (must not re-let for 12 months); the landlord or close family member moving in; repeated rent arrears (even if cleared). All existing grounds were retained and several minimum notice periods were extended to 4 months.",
  },
];

const SECTIONS = [
  {
    id: "section-21",
    icon: "⚖️",
    title: "Section 21 abolished",
    subtitle: "No-fault evictions are gone",
    content: `Section 21 — the legal mechanism that allowed landlords to evict tenants without giving a reason — has been permanently abolished.

All evictions now require a valid Section 8 ground. The Act introduced several new mandatory grounds designed to protect legitimate landlord interests: the right to sell the property with vacant possession, the right to move in a family member, and grounds for serious or persistent rent arrears.

**What landlords must do:**
- Review all existing tenancy agreements and remove any Section 21-style clauses
- Ensure all Section 8 grounds documentation is properly maintained
- Understand which grounds are mandatory (court must grant possession) vs discretionary (court has discretion)
- Consult a solicitor before issuing any possession notice`,
  },
  {
    id: "periodic-tenancies",
    icon: "📅",
    title: "All tenancies are now periodic",
    subtitle: "Fixed-term agreements no longer permitted",
    content: `Fixed-term tenancy agreements are no longer permitted for new lets. All new tenancies automatically run as periodic tenancies — typically month-by-month — from the outset.

Tenants may give two months' written notice to terminate at any point. Landlords cannot contractually prevent this. Existing fixed-term tenancies were converted to periodic tenancies on the statutory transition date.

**Implications for landlords:**
- Higher tenant turnover risk — students and short-term occupiers may leave earlier
- Student HMO lettings require careful forward planning as tenants can leave mid-year
- Void periods should be modelled more conservatively in investment calculations
- Guaranteed rent schemes offer complete protection against this risk`,
  },
  {
    id: "rent-increases",
    icon: "📈",
    title: "Rent increase restrictions",
    subtitle: "Once per year, two months' notice, market rate only",
    content: `Landlords may only increase rent once per 12-month period. Any increase must be implemented using the statutory Section 13 procedure — a prescribed written notice giving at least two months' advance notice.

Tenants have the right to challenge a proposed increase at the First-tier Tribunal (Property Chamber). The Tribunal will assess whether the proposed rent is at or below the market rate for comparable properties in the area.

**Practical steps:**
- Keep a record of all comparable rental evidence when setting or increasing rent
- Use the correct prescribed Section 13 notice form
- Give at least two months' notice before the increase takes effect
- Do not include contractual rent review clauses — they are ineffective under the new regime`,
  },
  {
    id: "pets",
    icon: "🐾",
    title: "Tenants' right to request pets",
    subtitle: "Cannot be unreasonably refused",
    content: `Tenants have a statutory right to request permission to keep a pet. Landlords cannot unreasonably refuse a pet request. Refusal must be based on reasonable grounds — for example, very small properties, listed buildings with lease restrictions, or severe allergy concerns in a shared building.

Landlords may require the tenant to obtain pet damage insurance as a condition of granting consent. This provides financial protection against pet-related damage to the property.

**What landlords should do:**
- Respond to any pet request within 28 days
- If refusing, document the specific reasonable grounds in writing
- If consenting, specify that the tenant must maintain pet damage insurance
- Update AST templates to include a pet clause covering insurance obligations`,
  },
  {
    id: "ombudsman",
    icon: "🏛️",
    title: "PRS Ombudsman — mandatory registration",
    subtitle: "Criminal offence not to register — fines up to £5,000",
    content: `All private landlords in England must register with the new Private Rented Sector (PRS) Ombudsman. This is not optional — failure to register is a criminal offence with fines of up to £5,000 per property.

The Ombudsman provides a free dispute resolution service for tenants. Tenants can bring complaints about property condition, deposit disputes, service charges, and landlord conduct. The Ombudsman's decisions are binding on landlords.

**Action required:**
- Register with the PRS Ombudsman through the official government registration portal
- Provide tenants with the Ombudsman's details and complaint procedure at the start of any tenancy
- Ensure your letting agent is also registered if they manage properties on your behalf
- Keep your registration up to date — registration covers a specific property, not just the landlord`,
  },
  {
    id: "decent-homes",
    icon: "🏠",
    title: "Decent Homes Standard",
    subtitle: "Minimum property standards now enforceable in private rented sector",
    content: `The Decent Homes Standard — previously only applicable to social housing — has been extended to the private rented sector. All rental properties must now meet minimum standards across four areas:

1. **Structural integrity** — sound structure and roof
2. **Modern facilities** — reasonably modern kitchen and bathroom
3. **Thermal comfort** — effective heating and insulation
4. **Freedom from serious hazards** — no Category 1 HHSRS hazards

Local councils have significantly enhanced enforcement powers. They can issue Improvement Notices, Prohibition Orders, and in serious cases, take over management of a property. Civil penalties of up to £30,000 are available for breaches.

**Compliance checklist:**
- Commission an HHSRS assessment if you have any concerns about hazard categories
- Check boiler and heating system condition — EPC C preparation is good practice
- Ensure kitchens and bathrooms meet minimum functional standards
- Address any Category 1 hazards identified during inspection immediately`,
  },
];

export default function RentersRightsActPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-4xl">
          <Breadcrumbs items={[{ label: "Renters' Rights Act 2025" }]} />
          <div className="mt-6">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              In force — action required for all landlords
            </span>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-5 leading-tight"
              style={{ fontFamily: "var(--font-family-heading)", letterSpacing: "-0.02em" }}
            >
              Renters&apos; Rights Act 2025
            </h1>
            <p className="text-xl text-navy-600 max-w-2xl leading-relaxed mb-8">
              The most significant change to landlord-tenant law in a generation. Section 21 is abolished, fixed-term tenancies are gone, and PRS Ombudsman registration is now mandatory.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#section-21" className="text-sm font-semibold text-navy-800 bg-navy-50 border border-navy-200 px-4 py-2 rounded-xl hover:border-navy-400 transition-colors">
                Section 21 abolished →
              </Link>
              <Link href="#ombudsman" className="text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl hover:border-amber-400 transition-colors">
                PRS Ombudsman →
              </Link>
              <Link href="#rent-increases" className="text-sm font-semibold text-navy-800 bg-navy-50 border border-navy-200 px-4 py-2 rounded-xl hover:border-navy-400 transition-colors">
                Rent increase rules →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Summary stats bar */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-3xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>
                Gone
              </p>
              <p className="text-sm text-navy-500 mt-1">Section 21 no-fault evictions</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>
                £5,000
              </p>
              <p className="text-sm text-navy-500 mt-1">Fine per property for non-registration</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>
                1×/yr
              </p>
              <p className="text-sm text-navy-500 mt-1">Maximum rent increase frequency</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>
                2 months
              </p>
              <p className="text-sm text-navy-500 mt-1">Tenant notice to leave</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content — key provisions */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-4xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-10"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            What the Act changes — section by section
          </h2>

          <div className="space-y-12">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl flex-shrink-0 mt-0.5">{s.icon}</span>
                  <div>
                    <h3
                      className="text-xl font-extrabold text-navy-900"
                      style={{ fontFamily: "var(--font-family-heading)" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-sm font-semibold text-navy-400 mt-0.5">{s.subtitle}</p>
                  </div>
                </div>
                <div className="ml-0 md:ml-14">
                  <div className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
                    {s.content.split("\n\n").map((para, i) => {
                      if (para.startsWith("**") && para.endsWith("**")) {
                        return (
                          <p key={i} className="font-bold text-navy-800 mt-5 mb-2">
                            {para.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      if (para.startsWith("- ") || para.startsWith("1. ")) {
                        const lines = para.split("\n");
                        return (
                          <ul key={i} className="space-y-1.5 mt-2">
                            {lines.map((line, li) => (
                              <li key={li} className="flex items-start gap-2 text-sm text-navy-600">
                                <span className="text-gold-500 flex-shrink-0 mt-0.5">—</span>
                                <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-\d+\.\s]+/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={i} className="text-navy-600 leading-relaxed text-sm mb-2" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-navy-800'>$1</strong>") }} />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick action checklist */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Landlord action checklist
          </h2>
          <p className="text-navy-500 text-sm mb-8">
            12 things every private landlord in England must have done or be doing now.
          </p>
          <div className="space-y-3">
            {[
              { priority: "Urgent", item: "Register with the PRS Ombudsman — criminal offence if not done" },
              { priority: "Urgent", item: "Remove all Section 21 notices from AST templates immediately" },
              { priority: "Urgent", item: "Ensure all tenancies are converted to periodic — no new fixed-terms" },
              { priority: "High", item: "Update Section 8 notice templates with all new mandatory grounds" },
              { priority: "High", item: "Review rent review clauses — contractual review clauses are ineffective; use Section 13 only" },
              { priority: "High", item: "Complete an HHSRS hazard assessment for each property" },
              { priority: "High", item: "Provide tenants with the PRS Ombudsman contact details and procedure" },
              { priority: "Medium", item: "Add a pet clause to all new AST agreements" },
              { priority: "Medium", item: "Prepare Section 13 notice templates for upcoming rent reviews" },
              { priority: "Medium", item: "Gather rental comparables evidence to support any proposed rent increases" },
              { priority: "Medium", item: "Check heating and insulation standards against the Decent Homes Standard" },
              { priority: "Low", item: "Review guarantor arrangements — guarantors now cover periodic tenancies by default" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-navy-100 p-4">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                  item.priority === "Urgent" ? "bg-red-50 text-red-700 border border-red-200" :
                  item.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  item.priority === "Medium" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                  "bg-navy-50 text-navy-600 border border-navy-200"
                }`}>
                  {item.priority}
                </span>
                <p className="text-sm text-navy-700 leading-relaxed">{item.item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related tools */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Free tools and templates for the new regime
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/templates" className="group bg-navy-50 rounded-2xl border border-navy-100 p-5 hover:border-gold-400 transition-colors">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">Free Legal Templates</p>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">Updated AST, Section 8, Section 13 notices — compliant with the 2025 Act</p>
              <span className="text-xs font-semibold text-gold-600 mt-3 block">Browse templates →</span>
            </Link>
            <Link href="/calculators/rental-yield" className="group bg-navy-50 rounded-2xl border border-navy-100 p-5 hover:border-gold-400 transition-colors">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">Rental Yield Calculator</p>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">Recalculate your yields accounting for higher expected void rates post-Act</p>
              <span className="text-xs font-semibold text-gold-600 mt-3 block">Calculate →</span>
            </Link>
            <Link href="/calculators/monthly-cashflow" className="group bg-navy-50 rounded-2xl border border-navy-100 p-5 hover:border-gold-400 transition-colors">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">Monthly Cash Flow Calculator</p>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">Model the impact of higher vacancy rates and compliance costs on net income</p>
              <span className="text-xs font-semibold text-gold-600 mt-3 block">Model your cashflow →</span>
            </Link>
            <Link href="/guaranteed-rent" className="group bg-gold-50 rounded-2xl border border-gold-200 p-5 hover:border-gold-400 transition-colors">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">Guaranteed Rent — eliminate all risk</p>
              <p className="text-xs text-navy-500 mt-1 leading-relaxed">We lease your property for 3–5 years and take on the day-to-day management. No Section 8, no Ombudsman, no compliance headaches.</p>
              <span className="text-xs font-semibold text-gold-600 mt-3 block">Learn more →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Renters&apos; Rights Act — frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-navy-100 p-6">
                <h3 className="font-bold text-navy-900 mb-3">{faq.q}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={faqs} />
          <div className="mt-12">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
