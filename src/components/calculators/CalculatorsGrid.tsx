"use client";

import Link from "next/link";
import { useState } from "react";

const calculators = [
  {
    title: "Deal Analyser", desc: "Know if a deal makes money before you commit — 8 metrics, stress tests, and an AI buy/pass verdict.", href: "/calculators/deal-analyser", cat: "Investing", tag: "Flagship",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#c9a84c"/><path d="M6 20V14" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>,
  },
  {
    title: "Mortgage Calculator", desc: "See your exact monthly payment and total cost before you apply — repayment vs interest-only.", href: "/calculators/mortgage", cat: "Finance", tag: "Most popular",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="13" width="22" height="13" rx="2" fill="#E8D5B7"/><path d="M2 14L14 4l12 10" stroke="#0f1b36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="11" y="18" width="6" height="8" rx="1" fill="#0f1b36"/><circle cx="21" cy="9" r="4" fill="#c9a84c" stroke="#0f1b36" strokeWidth="1.5"/><text x="21" y="11" textAnchor="middle" fill="#0f1b36" fontSize="6" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Mortgage Affordability", desc: "Find the maximum you can borrow based on income and outgoings — before you talk to a broker.", href: "/calculators/affordability", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="3" fill="#0f1b36"/><rect x="6" y="8" width="16" height="4" rx="1" fill="#c9a84c"/><circle cx="14" cy="18" r="3" fill="#E8D5B7"/><text x="14" y="20" textAnchor="middle" fill="#0f1b36" fontSize="5" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Stamp Duty (SDLT)", desc: "See exactly how much SDLT you owe — including the 5% additional property surcharge and first-time buyer relief.", href: "/calculators/stamp-duty", cat: "Finance", tag: "Most popular",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="18" height="22" rx="2" fill="#E8D5B7"/><rect x="8" y="7" width="12" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><rect x="8" y="11" width="8" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><circle cx="20" cy="20" r="6" fill="#c9a84c"/><text x="20" y="22.5" textAnchor="middle" fill="#0f1b36" fontSize="8" fontWeight="bold">%</text></svg>,
  },
  {
    title: "Capital Gains Tax", desc: "Find out your CGT bill before you sell — with all allowable deductions at the 18%/24% rates.", href: "/calculators/capital-gains-tax", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#0f1b36"/><path d="M6 20V14" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="#E8D5B7" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/></svg>,
  },
  {
    title: "Remortgage Savings", desc: "Work out whether remortgaging actually saves you money once arrangement fees and break-even are factored in.", href: "/calculators/remortgage", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#E8D5B7"/><path d="M9 14a5 5 0 0 1 10 0" stroke="#0f1b36" strokeWidth="2" strokeLinecap="round"/><path d="M19 14a5 5 0 0 1-10 0" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/><path d="M17 8l2 2-2 2" stroke="#0f1b36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 18l-2 2 2 2" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: "Rent vs Buy", desc: "Find out over 10 years whether renting or buying comes out cheaper for your specific numbers.", href: "/calculators/rent-vs-buy", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="4" width="10" height="20" rx="2" fill="#c9a84c"/><text x="7" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">R</text><rect x="16" y="4" width="10" height="20" rx="2" fill="#0f1b36"/><text x="21" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">B</text><text x="14" y="16" textAnchor="middle" fill="#0f1b36" fontSize="8" fontWeight="bold">/</text></svg>,
  },
  {
    title: "Moving Cost Calculator", desc: "Add up every cost of moving so there are no surprises on completion day.", href: "/calculators/moving-costs", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="12" width="18" height="11" rx="2" fill="#c9a84c"/><rect x="15" y="15" width="8" height="8" rx="1" fill="#0f1b36"/><circle cx="7" cy="24" r="2" fill="#0f1b36"/><circle cx="19" cy="24" r="2" fill="#0f1b36"/><rect x="5" y="7" width="8" height="6" rx="1" fill="#E8D5B7" stroke="#0f1b36" strokeWidth="1"/></svg>,
  },
  {
    title: "Rental Yield", desc: "Find out in 60 seconds if a BTL property will genuinely make money after all costs.", href: "/calculators/rental-yield", cat: "Investing", tag: "Most popular",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#0f1b36"/><path d="M7 18l4-5 3 3 7-9" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="7" r="3" fill="#c9a84c"/></svg>,
  },
  {
    title: "BRRR Calculator", desc: "See how much money you can pull out after refinancing and whether you can recycle your full deposit.", href: "/calculators/brrr", cat: "Investing",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" fill="#E8D5B7"/><path d="M14 6v4m0 8v4m-6-10h4m8 0h4" stroke="#0f1b36" strokeWidth="2" strokeLinecap="round"/><circle cx="14" cy="14" r="4" fill="#c9a84c"/><path d="M19.5 8.5l-2 2M10.5 17.5l-2 2M19.5 19.5l-2-2M10.5 10.5l-2-2" stroke="#0f1b36" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    title: "HMO Yield Calculator", desc: "Model your HMO room-by-room and find the occupancy rate where it turns profitable.", href: "/calculators/hmo-yield", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="10" width="22" height="16" rx="2" fill="#E8D5B7"/><path d="M2 11L14 3l12 8" stroke="#0f1b36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="14" y1="10" x2="14" y2="26" stroke="#0f1b36" strokeWidth="1.5"/><line x1="3" y1="18" x2="25" y2="18" stroke="#0f1b36" strokeWidth="1.5"/><circle cx="8.5" cy="14" r="1.5" fill="#c9a84c"/><circle cx="19.5" cy="14" r="1.5" fill="#c9a84c"/><circle cx="8.5" cy="22" r="1.5" fill="#c9a84c"/><circle cx="19.5" cy="22" r="1.5" fill="#c9a84c"/></svg>,
  },
  {
    title: "Flip / Refurb ROI", desc: "Work out your profit margin and annualised ROI on a flip before you buy — not after.", href: "/calculators/flip-roi", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M4 24L14 4l10 20H4z" fill="#c9a84c"/><path d="M4 24L14 14l10 10H4z" fill="#0f1b36" opacity="0.8"/><text x="14" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Bridging Loan", desc: "See the true total cost of bridging so you know exactly what it eats into your margin.", href: "/calculators/bridging", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="20" width="6" height="6" rx="1" fill="#0f1b36"/><rect x="20" y="20" width="6" height="6" rx="1" fill="#0f1b36"/><path d="M5 20C5 14 14 10 14 10S23 14 23 20" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/><circle cx="14" cy="10" r="3" fill="#c9a84c"/></svg>,
  },
  {
    title: "Landlord Costs", desc: "See your real annual profit after every expense, void, tax charge, and management fee.", href: "/calculators/landlord-costs", cat: "Landlord", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="4" y="2" width="20" height="24" rx="3" fill="#0f1b36"/><rect x="7" y="6" width="14" height="3" rx="1" fill="#c9a84c"/><line x1="7" y1="12" x2="15" y2="12" stroke="#E8D5B7" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="15" x2="18" y2="15" stroke="#E8D5B7" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="18" x2="12" y2="18" stroke="#E8D5B7" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="21" x2="16" y2="21" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    title: "Section 24 Tax", desc: "Find out how much extra tax Section 24 is costing you — and whether a limited company would pay less.", href: "/calculators/section-24", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v8c0 6 10 10 10 10s10-4 10-10V8L14 2z" fill="#0f1b36"/><text x="14" y="18" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="bold">24</text></svg>,
  },
  {
    title: "Personal vs Ltd Company", desc: "Compare the actual after-tax profit of holding property personally vs through an SPV — with your numbers.", href: "/calculators/personal-vs-ltd", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><circle cx="9" cy="10" r="4" fill="#c9a84c"/><rect x="5" y="16" width="8" height="10" rx="2" fill="#c9a84c"/><rect x="16" y="4" width="10" height="20" rx="2" fill="#0f1b36"/><text x="21" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Ltd</text></svg>,
  },
  {
    title: "EPC Retrofit Cost", desc: "Find out what it costs to hit EPC C — and which improvements give the fastest payback before the 2030 deadline.", href: "/calculators/epc-retrofit", cat: "Landlord", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><path d="M16 2L6 16h7l-2 10 12-14h-8L16 2z" fill="#c9a84c"/><path d="M16 2L6 16h7l-2 10" fill="#0f1b36" opacity="0.2"/></svg>,
  },
  {
    title: "Landlord Tax Calculator", desc: "See your exact income tax bill on rental income — old rules vs Section 24, and your real net profit.", href: "/calculators/landlord-tax", cat: "Tax", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="4" width="24" height="20" rx="3" fill="#0f1b36"/><path d="M7 22l4-12 3 8 2-4 4 8" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><text x="22" y="10" textAnchor="middle" fill="#c9a84c" fontSize="8" fontWeight="bold">£</text></svg>,
  },
  {
    title: "BTL Mortgage Stress Test", desc: "Check if your deal passes the lender's stress test before the mortgage broker tells you it doesn't.", href: "/calculators/btl-mortgage", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="8" width="22" height="16" rx="3" fill="#E8D5B7"/><path d="M2 10L14 3l12 7" stroke="#0f1b36" strokeWidth="2" strokeLinecap="round"/><path d="M10 24v-6h8v6" stroke="#0f1b36" strokeWidth="1.5" strokeLinecap="round"/><circle cx="22" cy="8" r="5" fill="#22c55e"/><path d="M19.5 8l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: "Void Period Cost", desc: "Find out what a void period actually costs you — including bills you still pay while it's empty.", href: "/calculators/void-period", cat: "Landlord", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="3" y="4" width="22" height="20" rx="3" fill="#E8D5B7"/><rect x="3" y="4" width="22" height="7" rx="3" fill="#0f1b36"/><circle cx="9" cy="7.5" r="1.5" fill="#c9a84c"/><circle cx="14" cy="7.5" r="1.5" fill="white" opacity="0.5"/><circle cx="19" cy="7.5" r="1.5" fill="white" opacity="0.5"/><text x="14" y="21" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">£0</text></svg>,
  },
  {
    title: "Rent Increase Calculator", desc: "Model the impact of a rent increase and check you're following the correct Section 13 rules.", href: "/calculators/rent-increase", cat: "Landlord", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#0f1b36"/><path d="M6 18l5-6 4 4 7-8" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 8h-4v4" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    title: "BTL Monthly Cash Flow", desc: "Get a full monthly income vs expenses breakdown so you know the exact cash in your pocket each month.", href: "/calculators/monthly-cashflow", cat: "Investing", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="4" width="24" height="20" rx="3" fill="#E8D5B7"/><path d="M6 20V14" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V10" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V13" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V7" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/><text x="14" y="6" textAnchor="middle" fill="#c9a84c" fontSize="5" fontWeight="bold">£</text></svg>,
  },
  {
    title: "Leasehold Calculator", desc: "Find out if a short lease is a trap — extension cost, depreciation, and mortgage eligibility risks.", href: "/calculators/leasehold", cat: "Finance", tag: "New",
    icon: <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="18" height="22" rx="2" fill="#E8D5B7"/><rect x="8" y="7" width="12" height="2" rx="1" fill="#0f1b36" opacity="0.4"/><rect x="8" y="11" width="8" height="2" rx="1" fill="#0f1b36" opacity="0.4"/><rect x="8" y="15" width="10" height="2" rx="1" fill="#0f1b36" opacity="0.4"/><circle cx="21" cy="21" r="5" fill="#c9a84c"/><text x="21" y="23.5" textAnchor="middle" fill="#0f1b36" fontSize="7" fontWeight="bold">📜</text></svg>,
  },
];

const CATS = ["All", "Finance", "Investing", "Tax", "Landlord"] as const;
type Cat = (typeof CATS)[number];

export function CalculatorsGrid() {
  const [active, setActive] = useState<Cat>("All");

  const filtered = active === "All" ? calculators : calculators.filter((c) => c.cat === active);

  const counts: Record<string, number> = {
    All: calculators.length,
    Finance: calculators.filter((c) => c.cat === "Finance").length,
    Investing: calculators.filter((c) => c.cat === "Investing").length,
    Tax: calculators.filter((c) => c.cat === "Tax").length,
    Landlord: calculators.filter((c) => c.cat === "Landlord").length,
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="transition-all"
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: active === cat ? "none" : "1.5px solid #e2e5ee",
              background: active === cat ? "#0f1b36" : "white",
              color: active === cat ? "white" : "#64748b",
              boxShadow: active === cat ? "0 2px 8px rgba(15,27,54,0.18)" : "none",
            }}
          >
            {cat}
            <span
              style={{
                marginLeft: 6,
                fontSize: 11,
                fontWeight: 700,
                color: active === cat ? "#c9a84c" : "#94a3b8",
              }}
            >
              {counts[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((calc) => (
          <Link
            key={calc.title}
            href={calc.href}
            className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {calc.icon}
              </div>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 bg-navy-50 text-navy-400 text-xs font-semibold rounded-full">
                  {calc.cat}
                </span>
                {calc.tag && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      calc.tag === "Flagship"
                        ? "bg-gold-400 text-navy-900"
                        : calc.tag === "Most popular"
                        ? "bg-green-100 text-green-800"
                        : "bg-navy-800 text-white"
                    }`}
                  >
                    {calc.tag}
                  </span>
                )}
              </div>
            </div>
            <h2 className="font-bold text-navy-800 mb-1 group-hover:text-gold-600 transition-colors">
              {calc.title}
            </h2>
            <p className="text-sm text-navy-400">{calc.desc}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-navy-400 text-center mt-10">
        All calculators produce estimates for educational purposes only. Not financial, legal, or tax advice.
      </p>
    </>
  );
}
