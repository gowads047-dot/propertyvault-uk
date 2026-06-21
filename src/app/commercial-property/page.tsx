import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Commercial Property Investment UK Guide | PropertyVault",
  description: "Complete guide to UK commercial property investing. Offices, retail, industrial, mixed-use. Yields, leases, finance, and risk assessment.",
};

export default function CommercialPropertyPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Investment Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Commercial Property</h1>
            <p className="text-navy-200 text-lg">Invest in offices, retail, industrial, and mixed-use properties. Longer leases, institutional tenants, and different risk-return profiles compared to residential.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Types of Commercial Property</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Office", desc: "From serviced offices to multi-floor HQs. Yields vary by location and tenant quality. Remote working has shifted demand." },
                { title: "Retail", desc: "High street shops, retail parks, and out-of-town units. Challenging sector but can offer strong yields in prime locations." },
                { title: "Industrial & Logistics", desc: "Warehouses, distribution centres, and light industrial units. One of the strongest-performing sectors driven by e-commerce growth." },
                { title: "Mixed-Use", desc: "Commercial ground floor with residential above. Diversified income streams and potential for permitted development conversions." },
              ].map((t) => (
                <div key={t.title} className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-2">{t.title}</h3>
                  <p className="text-sm text-navy-600">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Key Differences from Residential</h2>
            <ul className="list-disc pl-6 space-y-2 text-navy-600 leading-relaxed">
              <li><strong>Lease lengths</strong> — commercial leases are typically 3-25 years (vs 6-12 months for ASTs)</li>
              <li><strong>Tenant responsibilities</strong> — under Full Repairing and Insuring (FRI) leases, the tenant covers all maintenance and insurance</li>
              <li><strong>No Section 24</strong> — mortgage interest is fully deductible for commercial property</li>
              <li><strong>Business rates</strong> — paid by the occupying tenant, not the landlord</li>
              <li><strong>VAT</strong> — commercial property transactions may be subject to VAT (option to tax)</li>
              <li><strong>Higher deposits</strong> — typically 25-40% for commercial mortgages</li>
              <li><strong>Void risk</strong> — void periods can be longer and more costly than residential</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Assessing Commercial Deals</h2>
            <p className="text-navy-600 leading-relaxed">Commercial property is valued primarily on income. The key metric is the capitalisation rate (cap rate) — net operating income divided by purchase price. Tenant covenant strength (financial reliability), lease length remaining, and break clauses all significantly affect value. Always instruct a RICS-registered commercial surveyor for valuations.</p>
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


