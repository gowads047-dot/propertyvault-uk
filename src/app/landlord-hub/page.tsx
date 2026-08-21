import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Landlord Hub UK — Compliance, Management & Legal Guide | PropertyVault",
  description: "Everything UK landlords need to know. Compliance checklists, deposit protection, EPC requirements, eviction processes, insurance, and tenant management.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/landlord-hub/" },
  openGraph: {
    title: "Landlord Hub UK — Compliance, Management & Legal Guide | PropertyVault",
    description: "Everything UK landlords need to know. Compliance checklists, deposit protection, EPC requirements, eviction processes, insurance, and tenant management.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/landlord-hub/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Landlord Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Landlord Hub UK — Compliance, Management & Legal Guide | PropertyVault",
    description: "Everything UK landlords need to know. Compliance checklists, deposit protection, EPC requirements, eviction processes, insurance, and tenant management.",
  },
};

export default function LandlordHubPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Landlord Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Landlord Hub</h1>
            <p className="text-navy-200 text-lg">Your complete resource for UK landlord compliance, tenant management, legal obligations, and best practices. Stay compliant and protect your investment.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Landlord Compliance Checklist</h2>
            <div className="space-y-3">
              {[
                { item: "Gas Safety Certificate", freq: "Annual", detail: "CP12 certificate from Gas Safe registered engineer. Provide copy to tenant within 28 days." },
                { item: "EICR (Electrical Safety)", freq: "Every 5 years", detail: "Electrical Installation Condition Report. Must be satisfactory. Remedial works within 28 days if unsatisfactory." },
                { item: "EPC", freq: "Every 10 years", detail: "Minimum E rating required. Must be provided before marketing. C rating required by 2030 — plan upgrades now." },
                { item: "Smoke Alarms", freq: "Start of tenancy", detail: "Working smoke alarm on every floor. Carbon monoxide alarm in rooms with fixed combustion appliances." },
                { item: "Deposit Protection", freq: "Within 30 days", detail: "Protect in DPS, MyDeposits, or TDS. Serve prescribed information within 30 days." },
                { item: "Right to Rent", freq: "Before tenancy", detail: "Check original documents or share code for all adult occupants." },
                { item: "How to Rent Guide", freq: "Start of tenancy", detail: "Provide latest government 'How to Rent' guide to tenants." },
                { item: "Legionella Risk Assessment", freq: "Periodic", detail: "Assess risk of Legionella in water systems. Can often be done as part of your risk assessment." },
                { item: "Furniture Fire Safety", freq: "Ongoing", detail: "All upholstered furniture must meet fire safety regulations with appropriate labelling." },
              ].map((c) => (
                <div key={c.item} className="bg-navy-50 rounded-lg p-4 flex flex-col md:flex-row md:items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-navy-800 text-sm">{c.item}</h3>
                    <p className="text-xs text-navy-500 mt-1">{c.detail}</p>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1 bg-gold-100 text-gold-800 text-xs font-semibold rounded-full">{c.freq}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Eviction Process</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p><strong>Section 21 abolished (Renters&apos; Rights Act 2025):</strong> Section 21 no-fault evictions no longer exist. Landlords cannot end a tenancy without a specific legal reason. All new tenancies are periodic (rolling monthly) — fixed-term ASTs cannot be issued.</p>
              <p><strong>Section 8 — the only route to possession:</strong> Used when tenants breach the tenancy agreement or a specific statutory ground applies. Common grounds: rent arrears (Ground 8: 2+ months, mandatory), selling the property (Ground 1A: 4 months&apos; notice), family occupation (Ground 1: 4 months&apos; notice), antisocial behaviour (immediate in serious cases).</p>
              <p>Courts can refuse possession even on mandatory grounds if the landlord has not followed correct procedure — ensure all prescribed documents were served at the start of the tenancy and the Section 13 rent review process has been correctly used.</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Landlord Insurance</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p><strong>Buildings Insurance:</strong> Essential — covers the structure against fire, flood, subsidence. Required by most mortgage lenders.</p>
              <p><strong>Landlord Contents Insurance:</strong> Covers your furnishings and fittings if you let the property furnished.</p>
              <p><strong>Rent Guarantee Insurance:</strong> Pays your rent if a tenant defaults. Typically covers up to 12 months&apos; rent and legal costs.</p>
              <p><strong>Landlord Liability Insurance:</strong> Covers claims from tenants or visitors injured at the property.</p>
            </div>
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


