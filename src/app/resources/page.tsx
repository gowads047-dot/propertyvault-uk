import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Resources — Templates, Checklists & Toolkits | PropertyVault",
  description: "Free downloadable property investment resources. BRRR checklists, deal analysers, development appraisal templates, landlord compliance checklists, and more.",
};

const resources = [
  { title: "BRRR Deal Analyser Spreadsheet", desc: "Complete Excel spreadsheet to model any BRRR deal. Purchase, refurb, rent, refinance — with built-in ROI and cash flow calculations.", category: "Spreadsheet", format: "XLSX" },
  { title: "Property Due Diligence Checklist", desc: "40-point checklist covering legal, structural, financial, and compliance checks before purchasing any investment property.", category: "Checklist", format: "PDF" },
  { title: "Landlord Compliance Checklist", desc: "Every legal requirement for UK landlords in one document. Gas safety, electrical, EPC, deposit protection, and more.", category: "Checklist", format: "PDF" },
  { title: "Development Appraisal Template", desc: "Professional development appraisal spreadsheet with GDV, build costs, finance costs, professional fees, and profit analysis.", category: "Spreadsheet", format: "XLSX" },
  { title: "Mortgage Comparison Tracker", desc: "Compare mortgage products side by side. Rates, fees, total cost over term, and true cost analysis.", category: "Spreadsheet", format: "XLSX" },
  { title: "Rental Property Cash Flow Template", desc: "Monthly and annual cash flow tracker for single-let and multi-let properties. Income, expenses, and net profit analysis.", category: "Spreadsheet", format: "XLSX" },
  { title: "HMO Setup Checklist", desc: "Everything you need to set up an HMO — licensing, fire safety, room standards, furnishing, and compliance requirements.", category: "Checklist", format: "PDF" },
  { title: "Property Viewing Checklist", desc: "Structured checklist for property viewings. Assess structural condition, location factors, potential issues, and investment potential.", category: "Checklist", format: "PDF" },
  { title: "Portfolio Tracker Spreadsheet", desc: "Track your entire property portfolio — values, equity, mortgage balances, rental income, yields, and net worth over time.", category: "Spreadsheet", format: "XLSX" },
  { title: "First-Time Buyer Step-by-Step Guide", desc: "Complete PDF guide walking first-time buyers through the entire process from saving a deposit to getting keys.", category: "Guide", format: "PDF" },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Free Downloads</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Property Resource Library</h1>
          <p className="text-navy-200">Free templates, checklists, spreadsheets, and guides to support your property investment journey.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="space-y-4">
            {resources.map((r) => (
              <div key={r.title} className="bg-white rounded-xl border border-navy-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-navy-50 text-navy-600 text-xs font-semibold rounded">{r.category}</span>
                    <span className="px-2 py-0.5 bg-gold-50 text-gold-700 text-xs font-semibold rounded">{r.format}</span>
                  </div>
                  <h3 className="font-bold text-navy-800 mb-1">{r.title}</h3>
                  <p className="text-sm text-navy-500">{r.desc}</p>
                </div>
                <button className="btn-primary !py-2 !px-5 text-sm flex-shrink-0">Download Free</button>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-6 text-center">Enter your email to receive download links. We will also add you to our weekly newsletter (unsubscribe anytime).</p>
        </div>
      </section>
    </>
  );
}
