"use client";

import { useState, useMemo } from "react";
import { Disclaimer } from "@/components/legal/Disclaimer";

export default function BridgingPage() {
  const [loanAmount, setLoanAmount] = useState(150000);
  const [monthlyRate, setMonthlyRate] = useState(0.85);
  const [termMonths, setTermMonths] = useState(6);
  const [arrangementFee, setArrangementFee] = useState(2);
  const [exitFee, setExitFee] = useState(1);
  const [valuationFee, setValuationFee] = useState(500);
  const [legalFees, setLegalFees] = useState(1500);
  const [interestType, setInterestType] = useState<"retained" | "serviced">("retained");

  const results = useMemo(() => {
    const monthlyInterest = loanAmount * (monthlyRate / 100);
    const totalInterest = monthlyInterest * termMonths;
    const arrangementFeeAmt = loanAmount * (arrangementFee / 100);
    const exitFeeAmt = loanAmount * (exitFee / 100);
    const totalFees = arrangementFeeAmt + exitFeeAmt + valuationFee + legalFees;
    const totalCost = totalInterest + totalFees;
    const grossLoan = interestType === "retained" ? loanAmount + totalInterest : loanAmount;
    const netDay1 = loanAmount - arrangementFeeAmt - valuationFee - legalFees;
    const annualRate = monthlyRate * 12;

    return { monthlyInterest, totalInterest, arrangementFeeAmt, exitFeeAmt, totalFees, totalCost, grossLoan, netDay1, annualRate };
  }, [loanAmount, monthlyRate, termMonths, arrangementFee, exitFee, valuationFee, legalFees, interestType]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Bridging Loan Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate the total cost of bridging finance including monthly interest, arrangement fees, exit fees, and all associated costs.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Loan Amount</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span><input type="number" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rate ({monthlyRate}%)</label><input type="range" min={0.4} max={2} step={0.05} value={monthlyRate} onChange={(e) => setMonthlyRate(Number(e.target.value))} className="w-full accent-gold-500" /><p className="text-xs text-navy-500 text-center">{results.annualRate.toFixed(1)}% annual equivalent</p></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Term ({termMonths} months)</label><input type="range" min={1} max={24} step={1} value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} className="w-full accent-gold-500" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Interest Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setInterestType("retained")} className={`py-2 rounded-lg text-sm font-medium ${interestType === "retained" ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600"}`}>Retained (rolled up)</button>
                  <button onClick={() => setInterestType("serviced")} className={`py-2 rounded-lg text-sm font-medium ${interestType === "serviced" ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600"}`}>Serviced (monthly)</button>
                </div>
              </div>
              <h3 className="font-bold text-navy-800 text-sm border-b border-navy-100 pb-2">Fees</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Arrangement Fee (%)</label><input type="number" step={0.5} value={arrangementFee} onChange={(e) => setArrangementFee(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Exit Fee (%)</label><input type="number" step={0.5} value={exitFee} onChange={(e) => setExitFee(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Valuation Fee (£)</label><input type="number" value={valuationFee} onChange={(e) => setValuationFee(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Legal Fees (£)</label><input type="number" value={legalFees} onChange={(e) => setLegalFees(Number(e.target.value))} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
                <p className="text-navy-200 text-sm mb-1">Total Cost of Bridging</p>
                <p className="text-4xl font-bold text-gold-400 mb-4">{fmt(results.totalCost)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Monthly Interest</p><p className="font-bold">{fmt(results.monthlyInterest)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Total Interest</p><p className="font-bold">{fmt(results.totalInterest)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Total Fees</p><p className="font-bold">{fmt(results.totalFees)}</p></div>
                  <div className="bg-white/10 rounded-lg p-3"><p className="text-xs opacity-70">Net Day 1 Funds</p><p className="font-bold">{fmt(results.netDay1)}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-navy-100 p-5">
                <h4 className="font-bold text-navy-800 mb-3">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Loan amount</span><span>{fmt(loanAmount)}</span></div>
                  <div className="flex justify-between"><span>Interest ({termMonths} months × {monthlyRate}%)</span><span>{fmt(results.totalInterest)}</span></div>
                  <div className="flex justify-between"><span>Arrangement fee ({arrangementFee}%)</span><span>{fmt(results.arrangementFeeAmt)}</span></div>
                  <div className="flex justify-between"><span>Exit fee ({exitFee}%)</span><span>{fmt(results.exitFeeAmt)}</span></div>
                  <div className="flex justify-between"><span>Valuation</span><span>{fmt(valuationFee)}</span></div>
                  <div className="flex justify-between"><span>Legal fees</span><span>{fmt(legalFees)}</span></div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>Total cost</span><span className="text-red-600">{fmt(results.totalCost)}</span></div>
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
