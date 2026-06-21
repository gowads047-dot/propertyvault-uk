import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Calculators UK — 15 Tools for Investors & Landlords | PropertyVault UK",
  description: "15 free UK property calculators. Mortgage, stamp duty, BRRR, rental yield, Section 24, HMO, affordability, remortgage, bridging, flip ROI, and more.",
};

const calculators = [
  { title: "Mortgage Calculator", desc: "Monthly repayments, total interest, repayment vs interest-only.", href: "/calculators/mortgage", cat: "Finance" },
  { title: "Mortgage Affordability", desc: "How much can you borrow based on income and outgoings.", href: "/calculators/affordability", cat: "Finance", tag: "New" },
  { title: "Stamp Duty (SDLT)", desc: "Standard, additional property (+5%), and first-time buyer relief.", href: "/calculators/stamp-duty", cat: "Finance" },
  { title: "Remortgage Savings", desc: "Compare current vs new rate with fees and break-even period.", href: "/calculators/remortgage", cat: "Finance", tag: "New" },
  { title: "Rent vs Buy", desc: "Is it cheaper to rent or buy over time? Full cost comparison.", href: "/calculators/rent-vs-buy", cat: "Finance", tag: "New" },
  { title: "Moving Cost Calculator", desc: "Every cost of moving — stamp duty, solicitor, survey, removals.", href: "/calculators/moving-costs", cat: "Finance", tag: "New" },
  { title: "Rental Yield", desc: "Gross yield, net yield, and monthly cash flow on any BTL.", href: "/calculators/rental-yield", cat: "Investing" },
  { title: "BRRR Calculator", desc: "Buy-Refurbish-Rent-Refinance deal analysis with capital recycling.", href: "/calculators/brrr", cat: "Investing" },
  { title: "HMO Yield Calculator", desc: "Room-by-room income, occupancy, and cash flow for HMOs.", href: "/calculators/hmo-yield", cat: "Investing", tag: "New" },
  { title: "Flip / Refurb ROI", desc: "Buy-refurbish-sell profit projection with annualised ROI.", href: "/calculators/flip-roi", cat: "Investing", tag: "New" },
  { title: "Bridging Loan", desc: "Total cost of bridging finance — interest, fees, and net funds.", href: "/calculators/bridging", cat: "Investing", tag: "New" },
  { title: "Landlord Costs", desc: "Real P&L — expenses, tax, voids, and actual net profit.", href: "/calculators/landlord-costs", cat: "Landlord", tag: "New" },
  { title: "Section 24 Tax", desc: "How mortgage interest restriction affects your tax bill.", href: "/calculators/section-24", cat: "Tax", tag: "New" },
  { title: "Personal vs Ltd Company", desc: "Compare tax holding property personally vs through an SPV.", href: "/calculators/personal-vs-ltd", cat: "Tax", tag: "New" },
  { title: "EPC Retrofit Cost", desc: "Cost of improving EPC rating with grants and payback period.", href: "/calculators/epc-retrofit", cat: "Landlord", tag: "New" },
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
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-0.5 bg-navy-50 text-navy-400 text-xs font-semibold rounded-full">{calc.cat}</span>
                  {(calc as any).tag && <span className="px-2 py-0.5 bg-navy-800 text-white text-xs font-semibold rounded-full">{(calc as any).tag}</span>}
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
