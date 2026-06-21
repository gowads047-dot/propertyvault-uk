"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function LandlordCostsPage() {
  const [monthlyRent, setMonthlyRent] = useState(950);
  const [mortgagePayment, setMortgagePayment] = useState(600);
  const [insurance, setInsurance] = useState(25);
  const [maintenance, setMaintenance] = useState(80);
  const [managementFee, setManagementFee] = useState(0);
  const [gasSafety, setGasSafety] = useState(7);
  const [eicr, setEicr] = useState(5);
  const [epc, setEpc] = useState(2);
  const [licensing, setLicensing] = useState(0);
  const [accountant, setAccountant] = useState(25);
  const [rentGuarantee, setRentGuarantee] = useState(0);
  const [voidWeeks, setVoidWeeks] = useState(2);
  const [taxRate, setTaxRate] = useState(20);

  const results = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const effectiveRent = annualRent * ((52 - voidWeeks) / 52);
    const totalMonthlyExpenses = mortgagePayment + insurance + maintenance + managementFee + gasSafety + eicr + epc + licensing + accountant + rentGuarantee;
    const annualExpenses = totalMonthlyExpenses * 12;
    const grossProfit = effectiveRent - annualExpenses;
    const taxableIncome = effectiveRent - ((annualExpenses - (mortgagePayment * 12))); // simplified - S24 means mortgage not deductible
    const taxCredit = mortgagePayment * 12 * 0.20; // 20% tax credit on mortgage interest
    const taxBill = Math.max(0, (taxableIncome * (taxRate / 100)) - taxCredit);
    const netProfit = grossProfit - taxBill;
    const monthlyCashFlow = netProfit / 12;

    return {
      annualRent, effectiveRent, totalMonthlyExpenses, annualExpenses,
      grossProfit, taxBill, netProfit, monthlyCashFlow,
      expenseRatio: (annualExpenses / effectiveRent * 100),
    };
  }, [monthlyRent, mortgagePayment, insurance, maintenance, managementFee, gasSafety, eicr, epc, licensing, accountant, rentGuarantee, voidWeeks, taxRate]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  const costs = [
    { label: "Mortgage Payment", value: mortgagePayment, set: setMortgagePayment },
    { label: "Landlord Insurance", value: insurance, set: setInsurance },
    { label: "Maintenance / Repairs", value: maintenance, set: setMaintenance },
    { label: "Management Agent Fee", value: managementFee, set: setManagementFee },
    { label: "Gas Safety (monthly equiv.)", value: gasSafety, set: setGasSafety },
    { label: "EICR (monthly equiv.)", value: eicr, set: setEicr },
    { label: "EPC (monthly equiv.)", value: epc, set: setEpc },
    { label: "Licensing (monthly equiv.)", value: licensing, set: setLicensing },
    { label: "Accountant", value: accountant, set: setAccountant },
    { label: "Rent Guarantee Insurance", value: rentGuarantee, set: setRentGuarantee },
  ];

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Landlord Cost Calculator</h1>
          <p className="text-navy-200 max-w-2xl">See the real cost of being a landlord. Enter your rental income and every expense to calculate your actual monthly cash flow and annual net profit.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rent (£)</label>
                <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="w-full px-4 py-3 border border-navy-200 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Void Weeks/Year ({voidWeeks})</label><input type="range" min={0} max={8} step={1} value={voidWeeks} onChange={(e) => setVoidWeeks(Number(e.target.value))} className="w-full accent-gold-500" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Tax Rate ({taxRate}%)</label>
                  <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg bg-white text-sm">
                    <option value={0}>0% (non-taxpayer)</option><option value={20}>20% (basic rate)</option><option value={40}>40% (higher rate)</option><option value={45}>45% (additional rate)</option>
                  </select>
                </div>
              </div>
              <h3 className="font-bold text-navy-800 text-sm border-b border-navy-100 pb-2">Monthly Costs (adjust to your figures)</h3>
              <div className="space-y-2">
                {costs.map((c) => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-sm text-navy-700">{c.label}</span>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                    <input type="number" value={c.value} onChange={(e) => c.set(Number(e.target.value))} className="w-24 pl-7 pr-2 py-1.5 border border-navy-200 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
                <p className="text-navy-200 text-sm mb-1">Monthly Cash Flow</p>
                <p className={`text-4xl font-bold mb-4 ${results.monthlyCashFlow >= 0 ? "text-gold-400" : "text-red-400"}`}>{fmt(results.monthlyCashFlow)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Annual Rent (adj. for voids)</p><p className="font-bold">{fmt(results.effectiveRent)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Annual Expenses</p><p className="font-bold text-red-300">{fmt(results.annualExpenses)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Tax Bill (estimated)</p><p className="font-bold text-red-300">{fmt(results.taxBill)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-navy-300 text-xs">Annual Net Profit</p><p className={`font-bold ${results.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{fmt(results.netProfit)}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Profit &amp; Loss Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-600">Annual rent (gross)</span><span className="font-semibold">{fmt(results.annualRent)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Less void adjustment</span><span className="font-semibold text-red-600">-{fmt(results.annualRent - results.effectiveRent)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Less total expenses</span><span className="font-semibold text-red-600">-{fmt(results.annualExpenses)}</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2"><span className="font-bold">Gross profit</span><span className="font-bold">{fmt(results.grossProfit)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Less income tax</span><span className="font-semibold text-red-600">-{fmt(results.taxBill)}</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2"><span className="font-bold">Net profit</span><span className={`font-bold ${results.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(results.netProfit)}</span></div>
                  <div className="flex justify-between"><span className="text-navy-600">Expense ratio</span><span className="font-semibold">{results.expenseRatio.toFixed(1)}%</span></div>
                </div>
              </div>
            </div>
          </div>
          <Disclaimer type="calculator" />
        </div>
      </section>
    </>
  );
}
