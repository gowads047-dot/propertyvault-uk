"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ShareResults } from "./ShareResults";
import { marginalRate as getMarginalRate, calcSection24Credit, personalAllowance,
  propertyIncomeTaxCost,
} from "@/lib/tax";
import { nonNegative } from "@/lib/inputs";

export function LandlordTaxCalculator() {
  const [rentalIncome, setRentalIncome] = useState(12000);
  const [expenses, setExpenses] = useState(2000);
  const [mortgageInterest, setMortgageInterest] = useState(6000);
  const [otherIncome, setOtherIncome] = useState(30000);

  const results = useMemo(() => {
    const netRentalProfit = rentalIncome - expenses;

    // Old rules: mortgage interest was fully deductible from rental profit
    const totalTaxOld = propertyIncomeTaxCost(otherIncome, Math.max(0, netRentalProfit - mortgageInterest));

    // Section 24: interest is NOT deductible; HMRC three-way capped 20% credit applies
    const s24Income = otherIncome + netRentalProfit;
    const pa = personalAllowance(s24Income);
    const s24Credit = calcSection24Credit(mortgageInterest, netRentalProfit, s24Income, pa);
    const totalTaxS24gross = propertyIncomeTaxCost(otherIncome, netRentalProfit);
    const totalTaxS24 = Math.max(totalTaxS24gross - s24Credit, 0);

    const extraTaxS24 = totalTaxS24 - totalTaxOld;
    const netProfitOld = netRentalProfit - mortgageInterest - totalTaxOld;
    const netProfitS24 = netRentalProfit - mortgageInterest - totalTaxS24;
    const marginalRate = Math.round(getMarginalRate(s24Income) * 100);

    return { totalTaxOld, totalTaxS24, extraTaxS24, netProfitOld, netProfitS24, marginalRate, netRentalProfit, s24Credit };
  }, [rentalIncome, expenses, mortgageInterest, otherIncome]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Your Property Income</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Rental Income</label>
          <input aria-label="Annual Rental Income" type="range" min={3000} max={60000} step={500} value={rentalIncome} onChange={e => setRentalIncome(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(rentalIncome)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Allowable Expenses (repairs, insurance, agent fees etc.)</label>
          <input aria-label="Allowable Expenses (repairs, insurance, agent fees etc.)" type="range" min={0} max={15000} step={250} value={expenses} onChange={e => setExpenses(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(expenses)}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Annual Mortgage Interest</label>
          <input aria-label="Annual Mortgage Interest" type="range" min={0} max={30000} step={250} value={mortgageInterest} onChange={e => setMortgageInterest(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(mortgageInterest)}</p>
        </div>
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Your Other Income</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Employment / Self-Employment Income</label>
          <input aria-label="Employment / Self-Employment Income" type="range" min={0} max={150000} step={1000} value={otherIncome} onChange={e => setOtherIncome(nonNegative(e.target.value))} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(otherIncome)}</p>
        </div>
        <div className="bg-navy-50 rounded-xl p-4 text-xs text-navy-600">
          <strong>Marginal tax rate:</strong> {results.marginalRate}% — this is the rate at which your rental profit is taxed.
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-green-700 mb-1">OLD RULES (pre-2017)</p>
            <p className="text-3xl font-bold text-green-800">{fmt(results.totalTaxOld)}</p>
            <p className="text-xs text-green-600 mt-1">Tax on rental income</p>
            <p className="text-xs text-green-600 mt-2">Net profit: <strong>{fmt(results.netProfitOld)}</strong></p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-red-700 mb-1">SECTION 24 (now)</p>
            <p className="text-3xl font-bold text-red-800">{fmt(results.totalTaxS24)}</p>
            <p className="text-xs text-red-600 mt-1">Tax on rental income</p>
            <p className="text-xs text-red-600 mt-2">Net profit: <strong>{fmt(results.netProfitS24)}</strong></p>
          </div>
        </div>

        {results.extraTaxS24 > 0 ? (
          <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-6 text-white">
            <p className="text-sm opacity-80 mb-1">Section 24 is costing you an extra</p>
            <p className="text-4xl font-bold">{fmt(results.extraTaxS24)}</p>
            <p className="text-sm opacity-70 mt-1">per year vs the old rules</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold">Section 24 does not affect you</p>
            <p className="text-sm opacity-70 mt-1">At the basic rate (20%) the credit exactly offsets — no extra tax.</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-navy-100 p-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-navy-600">Gross rental income</span><span className="font-semibold">{fmt(rentalIncome)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">Allowable expenses</span><span className="font-semibold">−{fmt(expenses)}</span></div>
          <div className="flex justify-between border-t border-navy-100 pt-2"><span className="text-navy-700 font-semibold">Net rental profit</span><span className="font-bold">{fmt(results.netRentalProfit)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">Mortgage interest</span><span className="font-semibold">−{fmt(mortgageInterest)}</span></div>
          <div className="flex justify-between"><span className="text-navy-600">S24 tax credit (20%)</span><span className="font-semibold text-green-600">+{fmt(results.s24Credit)}</span></div>
          <div className="flex justify-between border-t border-navy-100 pt-2 font-bold"><span>Actual net cash profit</span><span>{fmt(results.netProfitS24)}</span></div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/calculators/section-24" className="btn-primary text-sm !py-2.5 !px-5">Section 24 Deep Dive →</Link>
          <Link href="/calculators/personal-vs-ltd" className="btn-outline text-sm !py-2.5 !px-5">Personal vs Ltd →</Link>
        </div>
        <ShareResults
          title="Landlord Tax Calculator"
          summary={`Landlord tax: net cash profit £${Math.round(results.netProfitS24).toLocaleString("en-GB")} after Section 24 on £${rentalIncome.toLocaleString("en-GB")} rental income (${results.marginalRate}% marginal rate)`}
        />
      </div>
    </div>
  );
}
