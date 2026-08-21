import type { Metadata } from "next";
import { VoidPeriodCalculator } from "@/components/calculators/VoidPeriodCalculator";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { EmbedCode } from "@/components/calculators/EmbedCode";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Void Period Cost Calculator UK — How Much Are Empty Weeks Costing You? | PropertyVault",
  description: "Calculate the true cost of void periods on your rental property. See lost rent, ongoing costs, annual impact, and how guaranteed rent compares.",
  keywords: "void period calculator, cost of void period UK, empty rental property cost, void period landlord, rental void calculator",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/void-period/" },
  openGraph: {
    title: "Free Void Period Cost Calculator UK — How Much Are Empty Weeks Costing You? | PropertyVault",
    description: "Calculate the true cost of void periods on your rental property. See lost rent, ongoing costs, annual impact, and how guaranteed rent compares.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/calculators/void-period/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Void Period Cost Calculator UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Void Period Cost Calculator UK — How Much Are Empty Weeks Costing You? | PropertyVault",
    description: "Calculate the true cost of void periods on your rental property. See lost rent, ongoing costs, annual impact, and how guaranteed rent compares.",
  },
};

const faqs = [
  { q: "What is a void period in property?", a: "A void period is any time your rental property sits empty with no tenant in occupation. During this time, you receive no rent but still pay the mortgage, council tax, utilities, and insurance. The average void period in the UK is 3–4 weeks per tenancy change, but poorly managed properties can experience months of empty time per year." },
  { q: "How much does a void period cost a landlord?", a: "The cost depends on your mortgage, council tax, and insurance obligations. For a typical £1,000/month rental property with a £700 monthly mortgage, a 4-week void period costs approximately £1,000 in lost rent plus £175 in mortgage payments plus roughly £120 in council tax and utilities — totalling around £1,295 for one month empty." },
  { q: "Who pays council tax during a void period?", a: "The landlord is liable for council tax when a property is empty between tenancies. You may be entitled to a 1-month council tax exemption when a property becomes empty, after which full council tax is typically charged. Some councils charge a premium of 100–300% council tax on long-term empty properties." },
  { q: "How can I reduce void periods?", a: "Key strategies include: advertising 6–8 weeks before current tenancy ends, pricing rent at market rate (overpricing is the main cause of voids), maintaining the property well so tenants renew, using a letting agent with an active applicant database, and considering guaranteed rent which eliminates voids entirely." },
  { q: "Does guaranteed rent eliminate void periods?", a: "Yes — under a guaranteed rent scheme, a company leases your property from you and pays you a fixed monthly amount regardless of occupancy. You receive rent even when the property is empty between their tenants. This eliminates void period risk entirely for the duration of the lease." },
];

export default function VoidPeriodPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Void Period Cost" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Void Period Cost Calculator</h1>
          <p className="text-navy-200 max-w-2xl">See exactly how much empty weeks are costing you — lost rent, ongoing bills, and the annual hit to your returns.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <VoidPeriodCalculator />

          <div className="mt-8">
            <EmailResults />
          </div>
          <EmbedCode slug="void-period" title="Void Period Cost Calculator" />

          <div className="mt-10 pt-8 border-t border-navy-200 space-y-4 max-w-3xl text-sm text-navy-600">
            <h2 className="text-xl font-bold text-navy-800">The Hidden Cost of Void Periods</h2>
            <p>Most landlords underestimate the true cost of empty periods. It is not just lost rent — you continue to pay the mortgage, council tax, buildings insurance, and potentially utilities during every void. A single 6-week void on a £900/month property can wipe out 3 months of profit.</p>
            <p>The UK average void between tenancies is 3–4 weeks, but this varies widely by area, property type, and management quality. HMO landlords often see shorter voids per room but must manage multiple changeovers per year. Portfolio landlords with 5+ properties can expect at least one significant void per year somewhere in their portfolio.</p>
            <p><strong>The guaranteed rent alternative:</strong> Rather than managing void risk yourself, a guaranteed rent scheme eliminates it entirely. You receive a fixed monthly payment whether the property is occupied or not, for the full 3–5 year lease term.</p>
            <div className="mt-4">
              <Link href="/guaranteed-rent" className="btn-gold inline-flex">Get a free guaranteed rent estimate →</Link>
            </div>
          </div>

          <div className="pt-4 border-t border-navy-200 not-prose mt-6">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross &amp; net yield</p></Link>
              <Link href="/calculators/landlord-costs" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Landlord Costs</p><p className="text-xs text-navy-400 mt-0.5">Full P&amp;L breakdown</p></Link>
              <Link href="/calculators/deal-analyser" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Deal Analyser</p><p className="text-xs text-navy-400 mt-0.5">Full deal score</p></Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
