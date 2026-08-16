import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free AST Template UK 2026 — Assured Shorthold Tenancy Agreement | PropertyVault",
  description: "Download a free Assured Shorthold Tenancy (AST) agreement template for England. Updated for 2026 including Renters Rights Act 2025 provisions. No sign-up required.",
  keywords: "free AST template UK, assured shorthold tenancy agreement template, AST template download, tenancy agreement template UK 2026",
  openGraph: {
    title: "Free AST Template UK 2026 | PropertyVault",
    description: "Free Assured Shorthold Tenancy agreement template — updated for 2026 with Renters Rights Act 2025 provisions. Download instantly, no sign-up.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/ast/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free AST Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free AST Template UK 2026 | PropertyVault", description: "Free AST template for England — updated for 2026 legislation." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/ast/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      {/* Educational content — server-rendered for SEO */}
      <section className="bg-white section-padding border-t border-navy-100">
        <div className="container-max max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>
            What is an Assured Shorthold Tenancy Agreement?
          </h2>
          <div className="prose prose-navy max-w-none space-y-4 text-navy-600 text-sm leading-relaxed">
            <p>
              An Assured Shorthold Tenancy (AST) is the most common form of residential tenancy in England and Wales.
              It is governed primarily by the Housing Act 1988, as amended, and gives tenants the right to occupy a
              property for an agreed fixed term — typically 6 or 12 months — before converting to a periodic
              (rolling) tenancy.
            </p>
            <p>
              For most residential lettings in England where the annual rent is between £1,000 and £100,000, the
              tenancy will automatically be an AST unless the parties agree to a different form of tenancy in writing.
              The AST framework provides a clear legal structure for both landlords and tenants, setting out rights
              and obligations during and after the fixed term.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-8 mb-3">What Must an AST Include?</h3>
            <p>
              While the law does not prescribe a single mandatory format, a legally sound AST should contain
              the following key sections:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Parties</strong> — full legal names and addresses of all landlords and tenants (including all adults who will live at the property).</li>
              <li><strong>Property details</strong> — the full address and description of what is included in the tenancy (parking, garden, storage).</li>
              <li><strong>Term</strong> — the start date and length of the fixed term. After the fixed term, most ASTs become periodic (month-to-month) automatically.</li>
              <li><strong>Rent</strong> — the amount, frequency, due date, and payment method. Rent can only be increased using a statutory Section 13 Notice or by mutual written agreement.</li>
              <li><strong>Deposit</strong> — the amount and the government-approved deposit protection scheme used (DPS, MyDeposits, or TDS). The deposit must not exceed 5 weeks' rent under the Tenant Fees Act 2019.</li>
              <li><strong>Obligations</strong> — tenant and landlord obligations including repair responsibilities, access rights, and permitted use.</li>
              <li><strong>Ending the tenancy</strong> — the grounds and notice required for the landlord or tenant to end the agreement.</li>
            </ul>

            <h3 className="text-lg font-bold text-navy-800 mt-8 mb-3">How the Renters' Rights Act 2025 Changes ASTs</h3>
            <p>
              The Renters' Rights Act 2025 made significant changes to the AST framework in England. The most
              important change is the abolition of Section 21 &quot;no-fault evictions&quot;. Under the Act, landlords
              can no longer end a tenancy simply by serving a Section 21 Notice — they must now rely on one of
              the statutory grounds in Schedule 2 of the Housing Act 1988 and serve a valid Section 8 Notice.
            </p>
            <p>
              The Act also introduced new mandatory grounds for possession (including Ground 1A for landlords
              wishing to sell and Ground 1B for landlords or family members wishing to occupy) and strengthened
              tenant rights around pets — landlords cannot unreasonably refuse a tenant&apos;s request to keep a pet.
            </p>
            <p>
              Our AST generator includes flags on all clauses affected by the Renters&apos; Rights Act 2025 so you
              can identify where legal review is most important.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-8 mb-3">Prescribed Documents You Must Serve</h3>
            <p>
              Before a tenancy can be ended using a Section 8 Notice, the landlord must have served all
              prescribed documents at the start of the tenancy. Failure to serve these documents can mean you
              cannot recover possession. You must serve:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>How to Rent guide</strong> — the current edition from gov.uk. Must be the version current at the start of the tenancy.</li>
              <li><strong>Energy Performance Certificate (EPC)</strong> — the property must have an EPC rating of E or above. Properties rated F or G cannot be legally let.</li>
              <li><strong>Gas Safety Certificate (CP12)</strong> — issued within the last 12 months by a Gas Safe registered engineer. A copy must be given to tenants before they move in.</li>
              <li><strong>Electrical Installation Condition Report (EICR)</strong> — required every 5 years. A copy must be given to tenants within 28 days of the report or before tenancy start, whichever is sooner.</li>
              <li><strong>Deposit prescribed information</strong> — must be served within 30 days of receiving the deposit, along with the relevant scheme&apos;s leaflet.</li>
            </ul>

            <h3 className="text-lg font-bold text-navy-800 mt-8 mb-3">Deposit Rules — Tenant Fees Act 2019</h3>
            <p>
              The Tenant Fees Act 2019 caps the tenancy deposit at 5 weeks&apos; rent (for properties with annual
              rent below £50,000) or 6 weeks&apos; rent (for properties above £50,000). Any deposit above these
              limits is unlawful and the tenant can apply to court to recover it. The deposit must be protected
              in one of the three government-approved schemes within 30 days: the Deposit Protection Service
              (DPS), MyDeposits, or the Tenancy Deposit Scheme (TDS).
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-8 mb-3">Is This Template Right for My Situation?</h3>
            <p>
              This template is designed for standard residential lettings in England where the rent is between
              £1,000 and £100,000 per year and the tenant is an individual (not a company). It is <strong>not</strong> suitable for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Properties in Scotland (use a Private Residential Tenancy) or Wales (use a Standard Occupation Contract under the Renting Homes Act 2016)</li>
              <li>HMO tenancies with 3 or more unrelated tenants (additional licensing and management rules apply)</li>
              <li>Holiday lets or short-term lets (these use different agreements)</li>
              <li>Company lets (where the tenant is a company rather than an individual)</li>
            </ul>
            <p>
              Always have your tenancy agreement reviewed by a qualified solicitor or licensed conveyancer
              before any party signs. Tenancy law changes frequently and errors can make the agreement
              unenforceable.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/templates/section-8-notice" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors">
              Free Section 8 Notice Template →
            </Link>
            <Link href="/templates/landlord-compliance" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors">
              Landlord Compliance Checklist →
            </Link>
            <Link href="/blog/renters-rights-act" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors">
              Renters&apos; Rights Act 2025 Guide →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
