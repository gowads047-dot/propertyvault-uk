import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Property Management Dashboard — Tenants, Rent & Compliance | PropertyVault UK",
  description: "Manage your rental properties in one place. Tenant referencing, digital contracts, rent collection, maintenance tracking, deposit protection, and compliance reminders.",
};

export default function ManagePage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Landlord Tools</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Property Management</h1>
            <p className="text-navy-200 text-lg">Everything you need to manage your tenancies. Referencing, contracts, rent collection, compliance tracking, and maintenance — all in one place. No letting agent needed.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Tenant Referencing",
                desc: "Comprehensive tenant checks including credit history, employment verification, previous landlord references, Right to Rent, and affordability assessment. Results in 24-48 hours.",
                features: ["Credit check (Experian/Equifax)", "Employment verification", "Previous landlord reference", "Right to Rent check", "Affordability assessment", "Fraud detection"],
                price: "From £15/tenant",
              },
              {
                title: "Digital Tenancy Agreements",
                desc: "Legally compliant Assured Shorthold Tenancy (AST) agreements generated and signed digitally. Includes all required clauses, break clauses, and prescribed information.",
                features: ["AST templates (Section 11 compliant)", "E-signature (legally binding)", "Custom clauses", "Break clause options", "Guarantor agreements", "Company let agreements"],
                price: "Free with listing",
              },
              {
                title: "Rent Collection",
                desc: "Automated rent collection via Direct Debit. Tenants set up once, rent arrives on time every month. Instant notifications for late payments with automated reminders.",
                features: ["Direct Debit setup", "Automated monthly collection", "Late payment alerts", "Payment history dashboard", "Arrears tracking", "Tenant payment portal"],
                price: "1% of rent collected",
              },
              {
                title: "Deposit Protection",
                desc: "Protect your tenant's deposit with a government-approved scheme directly from your dashboard. Serve the prescribed information automatically and manage disputes.",
                features: ["DPS integration", "Automatic prescribed info", "End-of-tenancy claims", "Dispute resolution", "Deposit return processing", "Compliance tracking"],
                price: "Scheme fees apply",
              },
              {
                title: "Compliance Calendar",
                desc: "Never miss a compliance deadline. Automated reminders for gas safety certificates, EICRs, EPC renewals, HMO licence renewals, and insurance expiry dates.",
                features: ["Gas safety reminders", "EICR tracking", "EPC expiry alerts", "HMO licence renewal", "Insurance expiry", "Selective licence tracking"],
                price: "Free",
              },
              {
                title: "Maintenance Management",
                desc: "Tenants report issues through a portal. You track, assign, and resolve maintenance requests. Build a network of trusted contractors and track spend per property.",
                features: ["Tenant reporting portal", "Photo/video attachments", "Contractor assignment", "Job tracking & completion", "Spend tracking", "Maintenance history"],
                price: "Free",
              },
              {
                title: "Financial Reporting",
                desc: "Automatic income and expense tracking for every property. Generate reports for your accountant, track yields, and monitor portfolio performance.",
                features: ["Income tracking", "Expense categorisation", "Profit & loss statements", "Tax-year reports", "Portfolio overview", "Export for accountant"],
                price: "Pro membership",
              },
              {
                title: "Tenant Communication",
                desc: "Built-in messaging system for all tenant communication. Keep a clear record of every message, notice, and correspondence for compliance and dispute evidence.",
                features: ["In-app messaging", "Email notifications", "Message history", "Notice templates", "Section 21/8 notices", "Read receipts"],
                price: "Free",
              },
              {
                title: "Property Inventory",
                desc: "Create detailed check-in and check-out inventories with photos. Compare condition at start and end of tenancy to support deposit claims.",
                features: ["Room-by-room inventory", "Photo documentation", "Check-in reports", "Check-out comparison", "Deposit evidence", "PDF export"],
                price: "From £10/report",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-navy-100 p-6 hover:shadow-lg transition-all">
                <h3 className="font-bold text-navy-800 text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-navy-500 mb-4">{f.desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {f.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-navy-600">
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold text-gold-600">{f.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison vs Agent */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center">PropertyVault vs Traditional Letting Agent</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-100">
                  <th className="text-left p-3 font-semibold">Service</th>
                  <th className="text-left p-3 font-semibold">Letting Agent</th>
                  <th className="text-left p-3 font-semibold text-gold-600">PropertyVault</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Property listing", "Included", "Free"],
                  ["Tenant finding fee", "50-100% of one month's rent", "Free (basic) / £29 featured"],
                  ["Monthly management", "8-15% of rent", "1% rent collection only"],
                  ["Tenant referencing", "£25-50/tenant", "From £15/tenant"],
                  ["Tenancy agreement", "£100-300", "Free"],
                  ["Deposit protection", "Included", "Scheme fees only"],
                  ["Compliance tracking", "Varies", "Free"],
                  ["Maintenance coordination", "Markup on contractor costs", "No markup"],
                  ["Annual cost (£1,000/month rent)", "£1,440-2,800/year", "£120-480/year"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-navy-100">
                    <td className="p-3 font-medium text-navy-800">{row[0]}</td>
                    <td className="p-3 text-navy-600">{row[1]}</td>
                    <td className="p-3 text-gold-600 font-semibold">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-padding gradient-navy">
        <div className="container-max text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Start Managing Your Properties Smarter</h2>
          <p className="text-navy-200 mb-6 max-w-xl mx-auto">Save thousands per year vs traditional letting agents. List your property, find tenants, and manage everything from one dashboard.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/list-property" className="btn-primary text-lg !py-4 !px-8">List Your Property →</Link>
            <Link href="/membership" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 text-lg !py-4 !px-8">View Plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
