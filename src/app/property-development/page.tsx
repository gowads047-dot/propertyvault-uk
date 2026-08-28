import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Property Development UK — Land, Planning, Build Costs Guide",
  description: "Complete UK property development guide. Land acquisition, planning permission, build costs, GDV calculations, development finance, and exit strategies.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/property-development/" },
  openGraph: {
    title: "Property Development UK — Land, Planning, Build Costs Guide",
    description: "Complete UK property development guide. Land acquisition, planning permission, build costs, GDV calculations, development finance, and exit strategies.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/property-development/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Property Development UK Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Development UK — Land, Planning, Build Costs Guide",
    description: "Complete UK property development guide. Land acquisition, planning permission, build costs, GDV calculations, development finance, and exit strategies.",
  },
};

export default function PropertyDevelopmentPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Development Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Property Development UK</h1>
            <p className="text-navy-200 text-lg">From site sourcing to exit strategy. Learn how to appraise development opportunities, navigate planning, manage construction, and maximise your profit.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">What Is Property Development?</h2>
            <p className="text-navy-600 leading-relaxed">Property development involves acquiring land or property, adding value through construction, conversion, or refurbishment, and either selling for profit or retaining for rental income. It is the most capital-intensive property strategy but can offer the highest returns — typically 15-30% profit on cost for successful projects.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Development Appraisal</h2>
            <p className="text-navy-600 leading-relaxed mb-4">Before committing to any development, you must complete a thorough financial appraisal. The key calculation is:</p>
            <div className="bg-navy-50 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-navy-800">Profit = GDV − (Land + Build Costs + Finance + Fees + Contingency)</p>
            </div>
            <div className="mt-6 space-y-3 text-navy-600">
              <p><strong>Gross Development Value (GDV):</strong> The total market value of the completed development. For residential, calculate using comparable sold prices per square foot. For example, 4 houses at £250,000 each = £1,000,000 GDV.</p>
              <p><strong>Build Costs:</strong> Typically £1,200-2,500 per square foot depending on specification, location, and build type. New build is generally £1,500-2,000/sqft, conversions £1,000-1,800/sqft. Always get quantity surveyor estimates.</p>
              <p><strong>Development Finance:</strong> Typically 55-65% of GDV, released in stages. Interest rates of 6-12% plus arrangement fees of 1-2%. Factor in holding costs during the build period.</p>
              <p><strong>Professional Fees:</strong> Architect (5-7% of build costs), structural engineer, planning consultant, building regulations, CDM coordinator, warranties (NHBC/Premier Guarantee), sales agent fees (1-2% of GDV).</p>
              <p><strong>Contingency:</strong> Always include a 10-15% contingency on build costs. Unexpected issues with foundations, drainage, contamination, or materials are common.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Types of Development</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Ground-Up New Build", desc: "Building from scratch on land. Highest cost and risk but maximum control over design and specification. Requires full planning permission." },
                { title: "Conversion", desc: "Converting commercial buildings to residential under Permitted Development (Class MA) or full planning. Offices, barns, pubs, and churches are common conversion targets." },
                { title: "Subdivision", desc: "Splitting larger properties into multiple units. Converting a large house into flats or subdividing plots for additional dwellings." },
                { title: "Extension & Refurbishment", desc: "Adding value through extensions, loft conversions, or major refurbishment. Lower risk entry point into development with smaller capital requirements." },
              ].map((d) => (
                <div key={d.title} className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-2">{d.title}</h3>
                  <p className="text-sm text-navy-600">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Planning Permission</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Planning is the single biggest risk in property development. Land without planning permission is worth a fraction of land with planning consent. Understanding the planning system is essential.</p>
              <p><strong>Pre-application advice:</strong> Most local planning authorities offer a pre-application service (£200-2,000) where a planning officer reviews your proposals informally before you submit. This is highly recommended and can save thousands in abortive costs.</p>
              <p><strong>Outline Planning:</strong> Establishes the principle of development. Typically used for larger sites where detailed plans will follow. Reserved matters (layout, scale, appearance, access, landscaping) are agreed separately.</p>
              <p><strong>Full Planning:</strong> Detailed application covering everything. Typically determined within 8 weeks (minor) or 13 weeks (major). Include a Design and Access Statement, environmental assessments, and supporting reports.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/calculators" className="btn-primary text-lg !py-4 !px-8">Use Our Property Calculators →</Link>
          </div>
        </div>
      </section>
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}



