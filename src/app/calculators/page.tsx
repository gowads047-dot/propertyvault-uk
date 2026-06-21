import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Calculators UK — 16 Tools for Investors & Landlords | PropertyVault UK",
  description: "16 free UK property calculators. Mortgage, stamp duty, BRRR, rental yield, HMO, Section 24, personal vs ltd, affordability, remortgage, bridging, EPC retrofit, flip ROI, and more.",
};

const calculators = [
  { title: "Mortgage Calculator", desc: "Monthly repayments, total interest, repayment vs interest-only.", href: "/calculators/mortgage", icon: "🏠", cat: "Finance" },
  { title: "Mortgage Affordability", desc: "How much can you borrow based on income and outgoings.", href: "/calculators/affordability", icon: "💰", cat: "Finance", tag: "New" },
  { title: "Stamp Duty (SDLT)", desc: "Standard, additional property (+5%), and first-time buyer relief.", href: "/calculators/stamp-duty", icon: "📋", cat: "Finance" },
  { title: "Remortgage Savings", desc: "Compare current vs new rate with fees and break-even period.", href: "/calculators/remortgage", icon: "🔑", cat: "Finance", tag: "New" },
  { title: "Rent vs Buy", desc: "Is it cheaper to rent or buy over time? Full cost comparison.", href: "/calculators/rent-vs-buy", icon: "⚖️", cat: "Finance", tag: "New" },
  { title: "Moving Cost Calculator", desc: "Every cost of moving — stamp duty, solicitor, survey, removals.", href: "/calculators/moving-costs", icon: "📦", cat: "Finance", tag: "New" },
  { title: "Rental Yield", desc: "Gross yield, net yield, and monthly cash flow on any BTL.", href: "/calculators/rental-yield", icon: "📊", cat: "Investing" },
  { title: "BRRR Calculator", desc: "Buy-Refurbish-Rent-Refinance deal analysis with capital recycling.", href: "/calculators/brrr", icon: "🔄", cat: "Investing" },
  { title: "HMO Yield Calculator", desc: "Room-by-room income, occupancy, and cash flow for HMOs.", href: "/calculators/hmo-yield", icon: "🏢", cat: "Investing", tag: "New" },
  { title: "Flip / Refurb ROI", desc: "Buy-refurbish-sell profit projection with annualised ROI.", href: "/calculators/flip-roi", icon: "🔨", cat: "Investing", tag: "New" },
  { title: "Bridging Loan", desc: "Total cost of bridging finance — interest, fees, and net funds.", href: "/calculators/bridging", icon: "🌉", cat: "Investing", tag: "New" },
  { title: "Landlord Costs", desc: "Real P&L — expenses, tax, voids, and actual net profit.", href: "/calculators/landlord-costs", icon: "🔢", cat: "Landlord", tag: "New" },
  { title: "Section 24 Tax", desc: "How mortgage interest restriction affects your tax bill.", href: "/calculators/section-24", icon: "📑", cat: "Tax", tag: "New" },
  { title: "Personal vs Ltd Company", desc: "Compare tax holding property personally vs through an SPV.", href: "/calculators/personal-vs-ltd", icon: "🏛️", cat: "Tax", tag: "New" },
  { title: "EPC Retrofit Cost", desc: "Cost of improving EPC rating with grants and payback period.", href: "/calculators/epc-retrofit", icon: "🏡", cat: "Landlord", tag: "New" },
];

export default function CalculatorsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Free Tools</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Property Calculators</h1>
            <p className="text-navy-200 text-lg">{calculators.length} free calculators for property investors, landlords, buyers, and sellers. All calculations run in your browser — no sign-up required.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {calculators.map((calc) => (
              <Link key={calc.title} href={calc.href}
                className="group block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-xl hover:border-gold-400/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{calc.icon}</span>
                  <div className="flex gap-1">
                    {(calc as any).tag && <span className="px-2 py-0.5 bg-gold-400 text-navy-800 text-xs font-bold rounded-full">{(calc as any).tag}</span>}
                    <span className="px-2 py-0.5 bg-navy-50 text-navy-500 text-xs rounded-full">{calc.cat}</span>
                  </div>
                </div>
                <h2 className="text-sm font-bold text-navy-800 mb-1 group-hover:text-gold-600 transition-colors">{calc.title}</h2>
                <p className="text-xs text-navy-500">{calc.desc}</p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-8">All calculators produce estimates for educational purposes only. Not financial, legal, or tax advice. Always consult a qualified professional.</p>
        </div>
      </section>
    </>
  );
}
