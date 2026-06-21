"use client";

import { useState, useMemo } from "react";

export function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [deposit, setDeposit] = useState(25);
  const [interestRate, setInterestRate] = useState(5.5);
  const [term, setTerm] = useState(25);
  const [mortgageType, setMortgageType] = useState<"repayment" | "interest-only">("repayment");

  const results = useMemo(() => {
    const loanAmount = propertyPrice * (1 - deposit / 100);
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = term * 12;

    let monthlyPayment: number;
    let totalCost: number;
    let totalInterest: number;

    if (mortgageType === "repayment") {
      if (monthlyRate === 0) {
        monthlyPayment = loanAmount / totalPayments;
      } else {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      }
      totalCost = monthlyPayment * totalPayments;
      totalInterest = totalCost - loanAmount;
    } else {
      monthlyPayment = loanAmount * monthlyRate;
      totalInterest = monthlyPayment * totalPayments;
      totalCost = totalInterest + loanAmount;
    }

    return {
      loanAmount,
      monthlyPayment,
      totalCost,
      totalInterest,
      ltv: ((loanAmount / propertyPrice) * 100).toFixed(0),
      depositAmount: propertyPrice * (deposit / 100),
    };
  }, [propertyPrice, deposit, interestRate, term, mortgageType]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
  const fmtExact = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Property Price</label>
          <input
            type="range" min={50000} max={2000000} step={5000} value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-sm text-navy-500 mt-1">
            <span>£50k</span>
            <span className="font-bold text-navy-800 text-lg">{fmt(propertyPrice)}</span>
            <span>£2M</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Deposit ({deposit}%)</label>
          <input
            type="range" min={5} max={50} step={1} value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-sm text-navy-500 mt-1">
            <span>5%</span>
            <span className="font-bold text-navy-800">{fmt(results.depositAmount)}</span>
            <span>50%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Interest Rate ({interestRate}%)</label>
          <input
            type="range" min={1} max={12} step={0.1} value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-sm text-navy-500 mt-1">
            <span>1%</span>
            <span className="font-bold text-navy-800">{interestRate}%</span>
            <span>12%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Mortgage Term ({term} years)</label>
          <input
            type="range" min={5} max={40} step={1} value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between text-sm text-navy-500 mt-1">
            <span>5 yrs</span>
            <span className="font-bold text-navy-800">{term} years</span>
            <span>40 yrs</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-2">Mortgage Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMortgageType("repayment")}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${mortgageType === "repayment" ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
            >
              Repayment
            </button>
            <button
              onClick={() => setMortgageType("interest-only")}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${mortgageType === "interest-only" ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
            >
              Interest Only
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white mb-6">
          <p className="text-navy-200 text-sm mb-1">Monthly Payment</p>
          <p className="text-4xl md:text-5xl font-bold text-gold-400 mb-6">{fmtExact(results.monthlyPayment)}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-navy-300 text-xs">Loan Amount</p>
              <p className="font-bold text-lg">{fmt(results.loanAmount)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-navy-300 text-xs">LTV Ratio</p>
              <p className="font-bold text-lg">{results.ltv}%</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-navy-300 text-xs">Total Interest</p>
              <p className="font-bold text-lg">{fmt(results.totalInterest)}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-navy-300 text-xs">Total Cost</p>
              <p className="font-bold text-lg">{fmt(results.totalCost)}</p>
            </div>
          </div>
        </div>

        {/* Visual Breakdown */}
        <div className="bg-white rounded-xl border border-navy-100 p-6">
          <h4 className="font-bold text-navy-800 mb-4">Payment Breakdown</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy-600">Deposit</span>
                <span className="font-semibold text-navy-800">{fmt(results.depositAmount)}</span>
              </div>
              <div className="w-full bg-navy-100 rounded-full h-3">
                <div className="bg-gold-400 h-3 rounded-full" style={{ width: `${(results.depositAmount / results.totalCost) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy-600">Capital Repaid</span>
                <span className="font-semibold text-navy-800">{fmt(results.loanAmount)}</span>
              </div>
              <div className="w-full bg-navy-100 rounded-full h-3">
                <div className="bg-navy-600 h-3 rounded-full" style={{ width: `${(results.loanAmount / results.totalCost) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-navy-600">Interest</span>
                <span className="font-semibold text-navy-800">{fmt(results.totalInterest)}</span>
              </div>
              <div className="w-full bg-navy-100 rounded-full h-3">
                <div className="bg-red-400 h-3 rounded-full" style={{ width: `${(results.totalInterest / results.totalCost) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
