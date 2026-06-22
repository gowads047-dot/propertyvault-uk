import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Calculators UK — 16 Tools for Investors & Landlords | PropertyVault UK",
  description: "16 free UK property calculators. Mortgage, stamp duty, BRRR, rental yield, CGT, Section 24, HMO, affordability, remortgage, bridging, flip ROI, and more.",
};

const calculators = [
  {
    title: "Mortgage Calculator", desc: "Monthly repayments, total interest, repayment vs interest-only.", href: "/calculators/mortgage", cat: "Finance",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="13" width="22" height="13" rx="2" fill="#E8D5B7"/><path d="M2 14L14 4l12 10" stroke="#0f1b36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="11" y="18" width="6" height="8" rx="1" fill="#0f1b36"/><circle cx="21" cy="9" r="4" fill="#c9a84c" stroke="#0f1b36" strokeWidth="1.5"/><text x="21" y="11" textAnchor="middle" fill="#0f1b36" fontSize="6" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Mortgage Affordability", desc: "How much can you borrow based on income and outgoings.", href: "/calculators/affordability", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="3" fill="#0f1b36"/><rect x="6" y="8" width="16" height="4" rx="1" fill="#c9a84c"/><circle cx="14" cy="18" r="3" fill="#E8D5B7"/><text x="14" y="20" textAnchor="middle" fill="#0f1b36" fontSize="5" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Stamp Duty (SDLT)", desc: "Standard, additional property (+5%), and first-time buyer relief.", href: "/calculators/stamp-duty", cat: "Finance",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="18" height="22" rx="2" fill="#E8D5B7"/><rect x="8" y="7" width="12" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><rect x="8" y="11" width="8" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><circle cx="20" cy="20" r="6" fill="#c9a84c"/><text x="20" y="22.5" textAnchor="middle" fill="#0f1b36" fontSize="8" fontWeight="bold">%</text></svg>,
  },
  {
    title: "Capital Gains Tax", desc: "CGT on property sales — 18%/24% rates, deductions, and exemptions.", href: "/calculators/capital-gains-tax", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#0f1b36"/><path d="M6 20V14" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="#E8D5B7" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/></svg>,
  },
  {
    title: "Remortgage Savings", desc: "Compare current vs new rate with fees and break-even period.", href: "/calculators/remortgage", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#E8D5B7"/><path d="M9 14a5 5 0 0 1 10 0" stroke="#0f1b36" strokeWidth="2" strokeLinecap="round"/><path d="M19 14a5 5 0 0 1-10 0" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/><path d="M17 8l2 2-2 2" stroke="#0f1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 18l-2 2 2 2" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: "Rent vs Buy", desc: "Is it cheaper to rent or buy over time? Full cost comparison.", href: "/calculators/rent-vs-buy", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="4" width="10" height="20" rx="2" fill="#c9a84c"/><text x="7" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">R</text><rect x="16" y="4" width="10" height="20" rx="2" fill="#0f1b36"/><text x="21" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">B</text><text x="14" y="16" textAnchor="middle" fill="#0f1b36" fontSize="8" fontWeight="bold">/</text></svg>,
  },
  {
    title: "Moving Cost Calculator", desc: "Every cost of moving — stamp duty, solicitor, survey, removals.", href: "/calculators/moving-costs", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="12" width="18" height="11" rx="2" fill="#c9a84c"/><rect x="15" y="15" width="8" height="8" rx="1" fill="#0f1b36"/><circle cx="7" cy="24" r="2" fill="#0f1b36"/><circle cx="19" cy="24" r="2" fill="#0f1b36"/><rect x="5" y="7" width="8" height="6" rx="1" fill="#E8D5B7" stroke="#0f1b36" strokeWidth="1"/></svg>,
  },
  {
    title: "Rental Yield", desc: "Gross yield, net yield, and monthly cash flow on any BTL.", href: "/calculators/rental-yield", cat: "Investing",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#0f1b36"/><path d="M7 18l4-5 3 3 7-9" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="7" r="3" fill="#c9a84c"/></svg>,
  },
  {
    title: "BRRR Calculator", desc: "Buy-Refurbish-Rent-Refinance deal analysis with capital recycling.", href: "/calculators/brrr", cat: "Investing",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#E8D5B7"/><path d="M14 6v4m0 8v4m-6-10h4m8 0h4" stroke="#0f1b36" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="14" r="4" fill="#c9a84c"/><path d="M19.5 8.5l-2 2M10.5 17.5l-2 2M19.5 19.5l-2-2M10.5 10.5l-2-2" stroke="#0f1b36" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    title: "HMO Yield Calculator", desc: "Room-by-room income, occupancy, and cash flow for HMOs.", href: "/calculators/hmo-yield", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="10" width="22" height="16" rx="2" fill="#E8D5B7"/><path d="M2 11L14 3l12 8" stroke="#0f1b36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="14" y1="10" x2="14" y2="26" stroke="#0f1b36" strokeWidth="1.5"/><line x1="3" y1="18" x2="25" y2="18" stroke="#0f1b36" strokeWidth="1.5"/><circle cx="8.5" cy="14" r="1.5" fill="#c9a84c"/><circle cx="19.5" cy="14" r="1.5" fill="#c9a84c"/><circle cx="8.5" cy="22" r="1.5" fill="#c9a84c"/><circle cx="19.5" cy="22" r="1.5" fill="#c9a84c"/></svg>,
  },
  {
    title: "Flip / Refurb ROI", desc: "Buy-refurbish-sell profit projection with annualised ROI.", href: "/calculators/flip-roi", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M4 24L14 4l10 20H4z" fill="#c9a84c"/><path d="M4 24L14 14l10 10H4z" fill="#0f1b36" opacity="0.8"/><text x="14" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Bridging Loan", desc: "Total cost of bridging finance — interest, fees, and net funds.", href: "/calculators/bridging", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="20" width="6" height="6" rx="1" fill="#0f1b36"/><rect x="20" y="20" width="6" height="6" rx="1" fill="#0f1b36"/><path d="M5 20C5 14 14 10 14 10S23 14 23 20" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/><circle cx="14" cy="10" r="3" fill="#c9a84c"/></svg>,
  },
  {
    title: "Landlord Costs", desc: "Real P&L — expenses, tax, voids, and actual net profit.", href: "/calculators/landlord-costs", cat: "Landlord", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="4" y="2" width="20" height="24" rx="3" fill="#0f1b36"/><rect x="7" y="6" width="14" height="3" rx="1" fill="#c9a84c"/><line x1="7" y1="12" x2="15" y2="12" stroke="#E8D5B7" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="15" x2="18" y2="15" stroke="#E8D5B7" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="18" x2="12" y2="18" stroke="#E8D5B7" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="21" x2="16" y2="21" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    title: "Section 24 Tax", desc: "How mortgage interest restriction affects your tax bill.", href: "/calculators/section-24", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v8c0 6 10 10 10 10s10-4 10-10V8L14 2z" fill="#0f1b36"/><text x="14" y="18" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="bold">24</text></svg>,
  },
  {
    title: "Personal vs Ltd Company", desc: "Compare tax holding property personally vs through an SPV.", href: "/calculators/personal-vs-ltd", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="9" cy="10" r="4" fill="#c9a84c"/><rect x="5" y="16" width="8" height="10" rx="2" fill="#c9a84c"/><rect x="16" y="4" width="10" height="20" rx="2" fill="#0f1b36"/><text x="21" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Ltd</text></svg>,
  },
  {
    title: "EPC Retrofit Cost", desc: "Cost of improving EPC rating with grants and payback period.", href: "/calculators/epc-retrofit", cat: "Landlord", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M16 2L6 16h7l-2 10 12-14h-8L16 2z" fill="#c9a84c"/><path d="M16 2L6 16h7l-2 10" fill="#0f1b36" opacity="0.2"/></svg>,
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">Free tools</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property Calculators</h1>
          <p className="text-navy-500 max-w-lg mx-auto">{calculators.length} free calculators for UK property investors, landlords, and buyers. No sign-up required.</p>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calculators.map((calc) => (
              <Link key={calc.title} href={calc.href}
                className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {calc.icon}
                  </div>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 bg-navy-50 text-navy-400 text-xs font-semibold rounded-full">{calc.cat}</span>
                    {calc.tag && <span className="px-2 py-0.5 bg-navy-800 text-white text-xs font-semibold rounded-full">{calc.tag}</span>}
                  </div>
                </div>
                <h2 className="font-bold text-navy-800 mb-1 group-hover:text-gold-600 transition-colors">{calc.title}</h2>
                <p className="text-sm text-navy-400">{calc.desc}</p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-10">All calculators produce estimates for educational purposes only. Not financial, legal, or tax advice.</p>
        </div>
      </section>
    </>
  );
}
