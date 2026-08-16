import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "UK Property Law — Conveyancing, Landlord Law, HMO Regulations | PropertyVault",
  description: "Complete UK property law guide. Conveyancing, landlord obligations, tenant rights, HMO licensing, planning permission, building regulations, and lease law explained.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/property-law/" },
  openGraph: {
    title: "UK Property Law — Conveyancing, Landlord Law, HMO Regulations | PropertyVault",
    description: "Complete UK property law guide. Conveyancing, landlord obligations, tenant rights, HMO licensing, planning permission, building regulations, and lease law explained.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/property-law/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Law Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Property Law — Conveyancing, Landlord Law, HMO Regulations | PropertyVault",
    description: "Complete UK property law guide. Conveyancing, landlord obligations, tenant rights, HMO licensing, planning permission, building regulations, and lease law explained.",
  },
};

export default function PropertyLawPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Legal Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">UK Property Law Centre</h1>
            <p className="text-navy-200 text-lg">Understand the legal framework around buying, selling, letting, and developing property in England and Wales. Written for investors and landlords in plain English.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-12">
          {/* Conveyancing */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">The Conveyancing Process</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Conveyancing is the legal process of transferring property ownership from seller to buyer. It typically takes 8-12 weeks and involves several key stages:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Instruct a solicitor or conveyancer</strong> — choose an SRA-regulated solicitor or CLC-licensed conveyancer</li>
                <li><strong>Searches</strong> — local authority searches, environmental searches, water and drainage searches, mining searches (where applicable)</li>
                <li><strong>Review the contract pack</strong> — title deeds, property information forms, fittings and contents form, leasehold management pack (if applicable)</li>
                <li><strong>Raise enquiries</strong> — your solicitor asks questions about anything unclear in the documentation</li>
                <li><strong>Mortgage offer</strong> — your lender issues a formal offer and sends it to your solicitor</li>
                <li><strong>Exchange of contracts</strong> — both parties are legally bound, deposit paid (usually 10%)</li>
                <li><strong>Completion</strong> — remaining funds transferred, keys handed over, ownership transfers</li>
                <li><strong>Post-completion</strong> — SDLT payment, Land Registry registration</li>
              </ol>
            </div>
          </div>

          {/* Ownership Types */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Property Ownership Types</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-navy-50 rounded-xl p-5">
                <h3 className="font-bold text-navy-800 mb-2">Freehold</h3>
                <p className="text-sm text-navy-600">You own the property and the land it sits on outright, indefinitely. Most houses are freehold. You are responsible for all maintenance and there is no ground rent or service charge.</p>
              </div>
              <div className="bg-navy-50 rounded-xl p-5">
                <h3 className="font-bold text-navy-800 mb-2">Leasehold</h3>
                <p className="text-sm text-navy-600">You own the property for a set term (typically 99-999 years) but not the land. Common with flats. You pay ground rent and service charges to the freeholder. Leases under 80 years can be expensive to extend.</p>
              </div>
              <div className="bg-navy-50 rounded-xl p-5">
                <h3 className="font-bold text-navy-800 mb-2">Commonhold</h3>
                <p className="text-sm text-navy-600">A relatively new form of ownership for flats where each owner holds a freehold share. No ground rent, no lease expiry. Managed by a commonhold association. Still rare in practice.</p>
              </div>
            </div>
          </div>

          {/* Landlord Obligations */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Landlord Legal Obligations</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <h3 className="text-lg font-bold text-navy-800 mt-4">Safety Requirements</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Gas Safety Certificate</strong> — annual inspection by a Gas Safe registered engineer. Must be provided to tenants within 28 days of the check.</li>
                <li><strong>EICR</strong> — Electrical Installation Condition Report every 5 years by a qualified electrician. Must be satisfactory or remedial works completed within 28 days.</li>
                <li><strong>EPC</strong> — Energy Performance Certificate rated E or above. EPC C will be required for all rental properties by 2030 — properties rated D or E need an upgrade plan now.</li>
                <li><strong>Smoke and CO alarms</strong> — smoke alarms on every floor, carbon monoxide alarms in rooms with fixed combustion appliances. Must be checked at the start of each tenancy.</li>
                <li><strong>Legionella risk assessment</strong> — assess the risk of Legionella bacteria in the water system.</li>
                <li><strong>Fire safety</strong> — fire-safe furniture, clear escape routes, fire doors in HMOs.</li>
              </ul>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Deposit Protection</h3>
              <p>All tenancy deposits must be protected in a government-approved scheme within 30 days of receipt: DPS (Deposit Protection Service), MyDeposits, or TDS (Tenancy Deposit Scheme). Failure to protect a deposit is a criminal offence and the court may award the tenant a penalty of 1–3x the deposit amount. Note: Section 21 was abolished under the Renters' Rights Act 2025 — landlords now use Section 8 grounds to recover possession.</p>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Right to Rent</h3>
              <p>Landlords must verify that all adult tenants have the legal right to rent in England. This involves checking original documents (passport, visa, share code) before the tenancy begins. Failure to check can result in fines up to £20,000 per tenant.</p>
            </div>
          </div>

          {/* HMO Licensing */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">HMO Licensing</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>A property is an HMO if 3 or more people from 2 or more separate households share facilities (kitchen, bathroom). Mandatory licensing applies to HMOs with 5+ occupants from 2+ households. Many councils also operate Additional Licensing schemes covering smaller HMOs.</p>
              <p><strong>Licence conditions</strong> typically include maximum occupancy limits, room size minimums (6.51m² single, 10.22m² double), fire safety standards, kitchen and bathroom ratios, and management conditions.</p>
              <p><strong>Penalties:</strong> Operating an unlicensable HMO without a licence is a criminal offence with unlimited fines. Tenants can also apply for Rent Repayment Orders to recover up to 12 months&apos; rent.</p>
            </div>
          </div>

          {/* Planning */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Planning Permission</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p><strong>Permitted Development (PD):</strong> Certain changes do not require planning permission, including some extensions, loft conversions, and change of use from commercial to residential (Class MA). PD rights may be removed by Article 4 directions in some areas.</p>
              <p><strong>Full Planning Permission:</strong> Required for new builds, large extensions, change of use (where PD doesn&apos;t apply), and works in conservation areas. Typically takes 8-13 weeks for minor applications.</p>
              <p><strong>Building Regulations:</strong> Separate from planning permission. Building regulations ensure structural safety, fire safety, energy efficiency, and accessibility standards. Most building work requires Building Regulations approval even if planning permission is not needed.</p>
            </div>
          </div>

          <Disclaimer type="legal" />
        </div>
      </section>
    </>
  );
}
