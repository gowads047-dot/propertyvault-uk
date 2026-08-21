import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Property Professional — Agents, Brokers, Solicitors | PropertyVault UK",
  description: "Find vetted UK property professionals. Estate agents, letting agents, mortgage brokers, solicitors, surveyors, accountants, and contractors in your area.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/find-agent/" },
  openGraph: {
    title: "Find a Property Professional — Agents, Brokers, Solicitors | PropertyVault UK",
    description: "Find vetted UK property professionals. Estate agents, letting agents, mortgage brokers, solicitors, surveyors, accountants, and contractors in your area.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/find-agent/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Find a Property Agent UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Property Professional — Agents, Brokers, Solicitors | PropertyVault UK",
    description: "Find vetted UK property professionals. Estate agents, letting agents, mortgage brokers, solicitors, surveyors, accountants, and contractors in your area.",
  },
};

const categories = [
  {
    title: "Mortgage Brokers",
    desc: "FCA-regulated whole-of-market brokers who can access deals from 90+ lenders",
    regulated: "FCA",
    items: [
      { name: "The Mortgage Centre", location: "Nationwide", specialisms: ["BTL", "HMO", "Limited Company", "Adverse Credit"] },
      { name: "Habito", location: "Online", specialisms: ["First-Time Buyer", "Remortgage", "BTL"] },
      { name: "L&C Mortgages", location: "Nationwide", specialisms: ["Residential", "BTL", "Self-Employed"] },
    ],
  },
  {
    title: "Property Solicitors",
    desc: "SRA-regulated solicitors and CLC-licensed conveyancers for property transactions",
    regulated: "SRA / CLC",
    items: [
      { name: "Premier Property Lawyers", location: "Nationwide", specialisms: ["Conveyancing", "Remortgage", "Transfer of Equity"] },
      { name: "Goldsmith Williams", location: "Liverpool", specialisms: ["Conveyancing", "Leasehold", "New Build"] },
      { name: "JMW Solicitors", location: "Manchester", specialisms: ["Conveyancing", "Commercial", "Landlord & Tenant"] },
    ],
  },
  {
    title: "Chartered Surveyors",
    desc: "RICS-registered surveyors for valuations, homebuyer reports, and building surveys",
    regulated: "RICS",
    items: [
      { name: "Allsop LLP", location: "London / National", specialisms: ["Commercial Valuation", "Residential Survey", "Auction"] },
      { name: "SDL Surveying", location: "Nationwide", specialisms: ["RICS Level 2", "Level 3", "Valuation"] },
      { name: "e.surv", location: "Nationwide", specialisms: ["Mortgage Valuation", "Homebuyer Report"] },
    ],
  },
  {
    title: "Property Accountants",
    desc: "Specialist property tax accountants for landlords, investors, and developers",
    regulated: "ACCA / ICAEW / CIOT",
    items: [
      { name: "Optimise Accountants", location: "Online / London", specialisms: ["Property Tax", "SPV", "Portfolio Landlords", "CGT"] },
      { name: "Provestor", location: "Online", specialisms: ["Landlord Tax Returns", "Company Formations", "Section 24"] },
      { name: "GoSimpleTax", location: "Online", specialisms: ["Self-Assessment", "Property Income", "CGT Reporting"] },
    ],
  },
  {
    title: "Letting Agents",
    desc: "ARLA Propertymark protected letting and management agents",
    regulated: "ARLA Propertymark",
    items: [
      { name: "OpenRent", location: "Online / National", specialisms: ["Tenant Finding", "Self-Management", "Referencing"] },
      { name: "Hunters", location: "National", specialisms: ["Full Management", "Tenant Finding", "Portfolio"] },
      { name: "Leaders Romans Group", location: "South England", specialisms: ["Full Management", "HMO", "Block Management"] },
    ],
  },
  {
    title: "Insurance Providers",
    desc: "Specialist landlord and property insurance from FCA-regulated insurers",
    regulated: "FCA",
    items: [
      { name: "Just Landlords", location: "Online", specialisms: ["Landlord Buildings", "Rent Guarantee", "Legal Expenses"] },
      { name: "Total Landlord", location: "Online", specialisms: ["Portfolio Insurance", "HMO", "Unoccupied Property"] },
      { name: "Simply Business", location: "Online", specialisms: ["Landlord Insurance", "Commercial", "Public Liability"] },
    ],
  },
];

export default function FindAgentPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Find a Property Professional</h1>
          <p className="text-navy-200 max-w-2xl mx-auto">Vetted, regulated professionals for every stage of your property journey. All professionals are verified with their relevant regulatory body.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          {categories.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-navy-800">{cat.title}</h2>
                  <p className="text-sm text-navy-500">{cat.desc}</p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full flex-shrink-0">{cat.regulated}</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {cat.items.map((item) => (
                  <div key={item.name} className="bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all">
                    <h3 className="font-bold text-navy-800 mb-1">{item.name}</h3>
                    <p className="text-xs text-navy-500 mb-2">{item.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.specialisms.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-navy-50 text-navy-600 text-xs rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-xl font-bold text-navy-800 mb-3">Are You a Property Professional?</h2>
          <p className="text-sm text-navy-500 mb-4">Get listed on PropertyVault and reach thousands of active investors and landlords.</p>
          <button className="btn-primary">Apply for Listing</button>
          <p className="text-xs text-navy-400 mt-3">We verify all professional listings with the relevant regulatory body (FCA, SRA, RICS, ARLA, ACCA/ICAEW).</p>
        </div>
      </section>
    </>
  );
}

