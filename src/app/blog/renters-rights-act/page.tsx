import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "Renters' Rights Act 2025 — What Every UK Landlord Must Know",
  description: "The Renters' Rights Act abolishes Section 21, ends fixed-term tenancies, restricts rent increases, and extends new rights to tenants. Full guide for landlords on what changed and when.",
  keywords: "Renters Rights Act 2025, Section 21 abolished, renters reform UK, landlord guide renters rights, no fault eviction ban, periodic tenancy UK",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/renters-rights-act/" },
  openGraph: {
    title: "Renters' Rights Act 2025 — What Every UK Landlord Must Know",
    description: "The Renters' Rights Act abolishes Section 21, ends fixed-term tenancies, restricts rent increases, and extends new rights to tenants. Full guide for landlords on what changed and when.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/renters-rights-act/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK rental property legal document and Renters Rights Act guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renters' Rights Act 2025 — What Every UK Landlord Must Know",
    description: "The Renters' Rights Act abolishes Section 21, ends fixed-term tenancies, restricts rent increases, and extends new rights to tenants. Full guide for landlords on what changed and when.",
  },
};

const faqs = [
  {
    q: "What did the Renters' Rights Act 2025 change for UK landlords?",
    a: "The Renters' Rights Act is the most significant change to the private rented sector in England for 30 years. It abolishes Section 21 no-fault evictions, ends fixed-term ASTs (replacing them with periodic tenancies), restricts rent increases to once per year via Section 13 notices, bans rental bidding wars, requires landlords to respond to pet requests within 28 days, introduces mandatory repair timescales under Awaab's Law, and makes membership of the PRS Ombudsman compulsory.",
  },
  {
    q: "Can landlords still evict tenants after Section 21 was abolished?",
    a: "Yes, but only through Section 8, which requires you to prove a specific legal ground. Grounds include selling the property (Ground 1A, 4 months' notice), a family member moving in (Ground 1B, 4 months' notice), 3+ months' rent arrears at both notice and hearing (Ground 8, mandatory), and antisocial behaviour (Ground 14, immediate notice). Courts can refuse possession even on mandatory grounds if the correct procedure has not been followed.",
  },
  {
    q: "Do existing fixed-term tenancies become periodic under the Renters' Rights Act?",
    a: "Yes. All existing fixed-term ASTs were automatically converted to periodic (rolling monthly) tenancies on 1 May 2026. New tenancies cannot be granted on a fixed-term basis. Tenants can give 2 months' written notice to leave at any time; landlords must use a Section 8 ground to regain possession.",
  },
  {
    q: "How can landlords raise rents under the Renters' Rights Act?",
    a: "Rent can only be increased once every 12 months and must be done using a formal Section 13 notice with at least 2 months' written notice. Any rent review clause written into a tenancy agreement is void — the statutory Section 13 process is the only legal route. Tenants can challenge any proposed increase at the First-tier Tribunal, which will assess whether the rent reflects open market rates.",
  },
  {
    q: "What is Awaab's Law and how does it apply to private landlords?",
    a: "Awaab's Law was named after Awaab Ishak, a toddler who died following prolonged mould exposure in social housing. Extended to private rented properties under the Renters' Rights Act, it requires landlords to investigate and begin fixing emergency hazards (such as total heating failure) within 24 hours and non-emergency hazards (such as damp and mould) within 14 days. Failure to comply within these timescales can result in council enforcement action and rent repayment orders.",
  },
];

export default function RentersRightsActArticle() {
  return (
    <>
      <BlogArticleHero
        title="Renters' Rights Act 2025 — What Every Landlord Needs to Know"
        excerpt="Section 21 is gone. Fixed-term ASTs are gone. Rent bidding wars are banned. Here is exactly what changed, when it takes effect, and what you must do."
        category="Landlords"
        date="June 2026"
        readTime="10 min"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 not-prose">
            <p className="text-sm font-semibold text-amber-800">⚠️ Important for landlords</p>
            <p className="text-sm text-amber-700 mt-1">The Renters' Rights Act received Royal Assent on 27 October 2025. A first wave of measures commenced on 27 December 2025, and the main tenancy reforms — including the abolition of Section 21 — took effect on 1 May 2026. Non-compliance can result in financial penalties, rent repayment orders, and restrictions on future possession. This article covers the key changes — always check gov.uk for the latest implementation dates.</p>
          </div>

          <p className="text-lg">The <strong>Renters' Rights Act 2025</strong> is the most significant change to the private rented sector in England for 30 years. Introduced by the Labour government in 2024, given Royal Assent in October 2025 and in force since 1 May 2026, it fundamentally changes the landlord-tenant relationship — abolishing no-fault evictions, ending fixed-term tenancies, capping rent increases, and giving tenants new rights on pets, deposits, and repairs.</p>

          <p>If you own a buy-to-let property in England, you are affected. This guide covers every major change and what you need to do.</p>

          {/* TOC */}
          <div className="bg-navy-50 rounded-xl p-6 not-prose">
            <p className="text-sm font-bold text-navy-800 mb-3">In this article</p>
            <ul className="space-y-1.5 text-sm text-navy-600">
              {[
                ["1. Section 21 abolished — no-fault evictions are over", "#s21"],
                ["2. All tenancies become periodic (rolling monthly)", "#periodic"],
                ["3. Strengthened Section 8 possession grounds", "#s8"],
                ["4. Rent increases restricted to once per year", "#rent"],
                ["5. Rental bidding wars banned", "#bidding"],
                ["6. Pet ownership — landlords cannot unreasonably refuse", "#pets"],
                ["7. Awaab's Law — mandatory repair timescales", "#awaab"],
                ["8. PRS Ombudsman and Landlord Register", "#ombudsman"],
                ["9. Advance rent and deposit rules", "#deposits"],
                ["10. What you must do now", "#action"],
              ].map(([label, href]) => (
                <li key={href}><a href={href} className="text-navy-600 hover:text-gold-600 transition-colors">{label as string}</a></li>
              ))}
            </ul>
          </div>

          {/* S21 */}
          <h2 id="s21" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>1. Section 21 Abolished — No-Fault Evictions Are Over</h2>
          <p>This is the headline change. <strong>Section 21 of the Housing Act 1988 — the "no-fault" eviction notice — has been repealed.</strong> You can no longer end a tenancy simply by giving two months' notice without providing a legal reason.</p>
          <p>Every eviction must now go through <strong>Section 8</strong>, which requires you to prove a specific legal ground — rent arrears, antisocial behaviour, wanting to sell, or a set of other defined reasons. If you cannot prove a ground, you cannot evict.</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 not-prose text-sm">
            <p className="font-bold text-red-800">What this means in practice:</p>
            <ul className="mt-2 space-y-1 text-red-700 list-disc pl-4">
              <li>You cannot ask tenants to leave "because you want your property back" without a legal ground</li>
              <li>Planning to redevelop or sell? You must use the new Section 8 grounds (with 4 months notice)</li>
              <li>Family member moving in? Same — specific ground required with 4 months notice</li>
              <li>Tenant is simply not working out? You will need to evidence a ground (arrears, ASB, breach of tenancy terms)</li>
            </ul>
          </div>

          {/* Periodic */}
          <h2 id="periodic" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>2. All Tenancies Are Now Periodic — No More Fixed Terms</h2>
          <p>Fixed-term Assured Shorthold Tenancies (ASTs) no longer exist for new tenancies. Every private tenancy is now a <strong>rolling periodic tenancy</strong> from day one — typically month-to-month.</p>
          <p><strong>For existing tenancies:</strong> All existing fixed-term ASTs were automatically converted to periodic tenancies on 1 May 2026.</p>
          <p><strong>What changes for landlords:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>No more 6-month or 12-month initial fixed periods</li>
            <li>Tenants can give <strong>2 months' written notice</strong> to leave at any time</li>
            <li>You cannot require tenants to commit beyond a rolling periodic basis</li>
            <li>Break clauses, renewal fees, and renewal negotiations are all gone</li>
          </ul>
          <p><strong>The upside:</strong> Good tenants who want to stay can stay indefinitely. Long-term, stable tenancies are the norm under this system — which actually suits the guaranteed rent model well.</p>

          {/* S8 */}
          <h2 id="s8" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>3. Strengthened Section 8 Possession Grounds</h2>
          <p>To compensate for losing Section 21, the government has expanded and strengthened the Section 8 grounds for possession. Key grounds you can use:</p>
          <div className="not-prose overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-navy-800 text-white">
                  <th className="text-left p-3 rounded-tl-lg">Ground</th>
                  <th className="text-left p-3">Reason</th>
                  <th className="text-left p-3">Notice required</th>
                  <th className="text-left p-3 rounded-tr-lg">Mandatory/Discretionary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {[
                  ["Ground 1A", "Landlord wishes to sell the property", "4 months", "Mandatory"],
                  ["Ground 1B", "Landlord or family member to occupy", "4 months", "Mandatory"],
                  ["Ground 8", "3+ months rent arrears at notice and hearing", "4 weeks", "Mandatory"],
                  ["Ground 10", "Some rent arrears (less than 3 months)", "4 weeks", "Discretionary"],
                  ["Ground 11", "Persistent late payment of rent", "4 weeks", "Discretionary"],
                  ["Ground 14", "Antisocial behaviour or nuisance", "Immediate (from date of notice)", "Discretionary"],
                  ["Ground 14A", "Domestic abuse", "2 weeks", "Mandatory"],
                  ["Ground 17", "Tenancy obtained by false statement", "2 weeks", "Discretionary"],
                ].map(([g, r, n, t]) => (
                  <tr key={g as string} className="hover:bg-navy-50">
                    <td className="p-3 font-semibold text-navy-800">{g}</td>
                    <td className="p-3 text-navy-600">{r}</td>
                    <td className="p-3 text-navy-600">{n}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t === "Mandatory" ? "bg-navy-800 text-white" : "bg-navy-100 text-navy-700"}`}>{t}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-navy-400">Note: Always serve notices correctly and keep evidence. Courts can refuse possession even on mandatory grounds if procedure is not followed exactly.</p>

          {/* Rent */}
          <h2 id="rent" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>4. Rent Increases — Once Per Year, Via Section 13 Only</h2>
          <p>Rent increases are now strictly regulated:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Maximum frequency:</strong> One increase per 12-month period</li>
            <li><strong>Method:</strong> Must use a Section 13 notice (prescribed form). Informal requests or letters do not count.</li>
            <li><strong>Notice period:</strong> 2 months' written notice before any increase takes effect</li>
            <li><strong>Tenant's right to challenge:</strong> Tenants can refer any increase to the First-tier Tribunal (Property Chamber). The Tribunal will assess whether the proposed rent is in line with the open market rate. <strong>The Tribunal cannot award a rent higher than the landlord proposed</strong> — but it can award lower.</li>
            <li><strong>No "above market" increases:</strong> Increases must reflect genuine open market rents</li>
          </ul>
          <p>Rent review clauses written into tenancy agreements are <strong>void</strong> — you must use the statutory Section 13 process regardless of what any agreement says.</p>
          <div className="not-prose mt-5 border border-gold-200 bg-gold-50 rounded-xl p-5 flex items-start gap-4">
            <div className="text-2xl">🧮</div>
            <div>
              <p className="font-bold text-navy-800 text-sm">Free tool: Section 13 Rent Increase Calculator</p>
              <p className="text-navy-500 text-sm mt-1">Calculate whether a proposed rent increase is within market rates, and generate the correct notice period and wording.</p>
              <Link href="/calculators/rent-increase" className="inline-block mt-3 btn-primary text-sm">Open calculator →</Link>
            </div>
          </div>

          {/* Bidding */}
          <h2 id="bidding" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>5. Rental Bidding Wars Banned</h2>
          <p>Landlords and letting agents are now <strong>banned from inviting, encouraging, or accepting offers above the advertised asking rent</strong>. The rent you advertise must be the rent you charge. This includes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Indicating that bids above the listed rent will be considered</li>
            <li>Listing properties without a stated rent</li>
            <li>Accepting a voluntary higher offer from a prospective tenant</li>
          </ul>
          <p>Breach of this rule carries a financial penalty. Always advertise at the rent you intend to charge.</p>

          {/* Pets */}
          <h2 id="pets" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>6. Pets — You Cannot Unreasonably Refuse</h2>
          <p>Tenants now have the right to request permission to keep a pet. Landlords:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Must respond within <strong>28 days</strong> of a pet request</li>
            <li>Cannot include a blanket "no pets" clause — each request must be individually considered</li>
            <li>Can only refuse on <strong>reasonable grounds</strong> (e.g., lease prohibits pets, property size, allergy risk)</li>
            <li>Can require the tenant to take out <strong>pet damage insurance</strong> as a condition of approval</li>
            <li>Silence or ignoring the request is treated as unreasonable refusal</li>
          </ul>
          <p>Tenants whose requests are refused without reasonable grounds can take the matter to the PRS Ombudsman.</p>

          {/* Awaab's */}
          <h2 id="awaab" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>7. Awaab's Law — Mandatory Repair Timescales</h2>
          <p>Awaab's Law (named after Awaab Ishak, a toddler who died from mould exposure in social housing) has been extended to the private rented sector. It requires landlords to investigate and fix reported hazards within set timescales:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Emergency hazards</strong> (e.g., total heating failure in winter, structural danger): 24 hours to begin remediation</li>
            <li><strong>Non-emergency hazards</strong> (e.g., damp, mould, minor leaks): 14 days to investigate, repair within a "reasonable period" thereafter</li>
            <li><strong>Damp and mould specifically:</strong> Must be treated as a hazard, not attributed to "lifestyle" or "condensation" without investigation</li>
          </ul>
          <p>Failure to act within these timescales exposes landlords to enforcement action by local councils and potential rent repayment orders.</p>

          {/* Ombudsman */}
          <h2 id="ombudsman" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>8. PRS Ombudsman and Landlord Register</h2>
          <p><strong>Private Rented Sector Ombudsman:</strong> Membership is now <strong>mandatory</strong> for all private landlords in England. The Ombudsman handles tenant complaints about repairs, rent increases, deposit disputes, and conduct. Non-members face financial penalties. Registration is free for individual landlords.</p>
          <p><strong>Landlord and Agent Register:</strong> A new national register of private landlords and letting agents is being established. Landlords must register (and re-register periodically). Local councils will have access to enforce compliance. Unregistered landlords cannot legally let their properties.</p>

          {/* Deposits */}
          <h2 id="deposits" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>9. Advance Rent and Deposit Rules</h2>
          <p>The Act introduced new restrictions on advance rent:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Maximum advance rent:</strong> Landlords cannot require more than <strong>one month's rent</strong> in advance before the tenancy begins. Requesting 2 or 3 months' advance rent upfront is now prohibited.</li>
            <li><strong>Deposit cap:</strong> Unchanged — remains at 5 weeks' rent (or 6 weeks where annual rent exceeds £50,000)</li>
            <li><strong>Deposit protection:</strong> Still required within 30 days in an approved scheme (DPS, MyDeposits, TDS)</li>
            <li><strong>Pet damage insurance:</strong> Where permitted as a condition of a pet request, the tenant (not landlord) arranges and pays for this — it does not increase the overall deposit</li>
          </ul>

          {/* Action */}
          <h2 id="action" className="text-xl font-bold text-navy-800 mt-10" style={{ fontFamily: "var(--font-family-heading)" }}>10. What You Must Do Now</h2>
          <div className="not-prose space-y-3">
            {[
              { n: "01", title: "Register with the PRS Ombudsman", desc: "Mandatory. Free for individual landlords. Check gov.uk for the registration portal." },
              { n: "02", title: "Register on the Landlord Register", desc: "When the portal opens, you must register all properties. Failure to register means you cannot legally let the property." },
              { n: "03", title: "Remove Section 21 notices from your process", desc: "Do not serve any Section 21 notice — they are void. Update your eviction process to Section 8 only." },
              { n: "04", title: "Update your tenancy agreements", desc: "Remove any fixed-term provisions, renewal clauses, pet restriction clauses, and rent review provisions. Use a solicitor-drafted periodic tenancy agreement." },
              { n: "05", title: "Update your rent increase process", desc: "Switch entirely to Section 13 notices. Keep records of every notice served and the date it took effect." },
              { n: "06", title: "Create a repair reporting and response log", desc: "To comply with Awaab's Law, document every repair report, the date received, and when remediation began and completed." },
              { n: "07", title: "Issue your tenants the 'Tenant Rights Notice'", desc: "The law does not require a specific notice, but issuing a Tenant Rights Notice is best practice. It demonstrates good faith and protects you if disputes arise." },
            ].map(item => (
              <div key={item.n} className="flex gap-4 p-4 bg-navy-50 rounded-xl">
                <div className="w-8 h-8 bg-gold-400 text-navy-900 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">{item.n}</div>
                <div>
                  <p className="font-bold text-navy-800 text-sm">{item.title}</p>
                  <p className="text-navy-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GR CTA */}
          <div className="not-prose mt-10 bg-navy-800 rounded-2xl p-8 text-white">
            <h3 className="text-lg font-bold mb-2">Worried about losing the right to evict bad tenants?</h3>
            <p className="text-navy-200 text-sm mb-5">Guaranteed rent removes this risk entirely. We take on all tenancy management, comply with all legislation, and pay you a fixed rent every month — regardless of what happens with the tenant. You have no possession risk because you have no direct tenancy relationship.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/guaranteed-rent" className="btn-gold text-sm">Learn about guaranteed rent →</Link>
              <Link href="/guaranteed-rent" className="btn-secondary text-sm">Get a free rent estimate</Link>
            </div>
          </div>

          {/* Template CTA */}
          <div className="not-prose mt-6 border border-navy-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="text-3xl">📄</div>
            <div>
              <p className="font-bold text-navy-800">Free template: Tenant Rights Notice</p>
              <p className="text-navy-500 text-sm mt-1">A printable notice you can give your tenants explaining their key rights under the Renters' Rights Act. Fill in the property details, print, and sign.</p>
              <Link href="/templates/renters-rights-notice" className="inline-block mt-3 btn-primary text-sm">Open template →</Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="legal" />
        </div>
        <HelpCTA />
      </article>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Related guides</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { href: "/calculators/landlord-costs", label: "Landlord Costs Calculator", icon: "💰" },
              { href: "/calculators/monthly-cashflow", label: "Monthly Cash Flow Calculator", icon: "📊" },
              { href: "/calculators/rent-increase", label: "Section 13 Rent Increase Calculator", icon: "📈" },
              { href: "/calculators/void-period", label: "Void Period Cost Calculator", icon: "📅" },
              { href: "/templates/landlord-compliance", label: "Compliance Checklist", icon: "✅" },
              { href: "/blog/guaranteed-rent-explained", label: "Guaranteed Rent Explained", icon: "🏠" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-navy-100 hover:border-gold-400 transition-colors card-hover">
                <span className="text-xl">{l.icon}</span>
                <span className="font-semibold text-navy-800 text-sm">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
