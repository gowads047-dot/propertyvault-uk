"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ShareResults } from "./ShareResults";

const fmt  = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const fmtD = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

// England SDLT April 2025 rates (incl 5% additional property surcharge from Oct 2024)
function calcSDLT(price: number, isBTL: boolean): number {
  const bands = isBTL
    ? [{ up: 125000, rate: 0.05 }, { up: 250000, rate: 0.07 }, { up: 925000, rate: 0.10 }, { up: 1500000, rate: 0.15 }, { up: Infinity, rate: 0.17 }]
    : [{ up: 125000, rate: 0 },    { up: 250000, rate: 0.02 }, { up: 925000, rate: 0.05 }, { up: 1500000, rate: 0.10 }, { up: Infinity, rate: 0.12 }];
  let tax = 0, prev = 0;
  for (const b of bands) {
    if (price <= prev) break;
    tax += (Math.min(price, b.up) - prev) * b.rate;
    prev = b.up;
  }
  return Math.round(tax);
}

function Slider({ label, value, onChange, min, max, step, display }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; display: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-navy-700">{label}</label>
        <span className="text-sm font-bold text-navy-800 bg-navy-50 px-3 py-1 rounded-lg">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-gold-500 cursor-pointer" />
    </div>
  );
}

export function MortgageCalculator() {
  const [isBTL,        setIsBTL]        = useState(true);
  const [repayType,    setRepayType]    = useState<"repayment" | "interest-only">("repayment");
  const [price,        setPrice]        = useState(180000);
  const [depositPct,   setDepositPct]   = useState(25);
  const [rate,         setRate]         = useState(5.0);
  const [termYrs,      setTermYrs]      = useState(25);
  const [monthlyRent,  setMonthlyRent]  = useState(900);
  const [showAmort,    setShowAmort]    = useState(false);

  const deposit    = price * depositPct / 100;
  const loan       = price - deposit;
  const mr         = rate / 100 / 12;
  const n          = termYrs * 12;

  const results = useMemo(() => {
    const monthlyPmt = repayType === "repayment"
      ? (mr === 0 ? loan / n : loan * mr / (1 - Math.pow(1 + mr, -n)))
      : loan * mr;

    const totalRepaid  = repayType === "repayment" ? monthlyPmt * n : monthlyPmt * n + loan;
    const totalInterest = totalRepaid - loan;
    const ltv           = (loan / price) * 100;
    const sdlt          = calcSDLT(price, isBTL);
    const grossYield    = ((monthlyRent * 12) / price) * 100;

    // BTL stress test: 125% ICR at 5.5%
    const stressMonthly  = loan * (0.055 / 12);
    const minRent        = stressMonthly * 1.25;
    const coverage       = monthlyRent / stressMonthly;
    const stressPass     = monthlyRent >= minRent;

    // Amortisation (year-by-year)
    const amort: { year: number; interest: number; principal: number; balance: number }[] = [];
    if (repayType === "repayment") {
      let bal = loan;
      for (let y = 1; y <= Math.min(termYrs, 30); y++) {
        let yi = 0, yp = 0;
        for (let m = 0; m < 12; m++) {
          const i = bal * mr;
          const p = monthlyPmt - i;
          yi += i; yp += p; bal -= p;
        }
        amort.push({ year: y, interest: yi, principal: yp, balance: Math.max(0, bal) });
      }
    }

    // IO comparison figures
    const ioMonthly      = loan * mr;
    const ioTotalInterest = ioMonthly * n;

    return { monthlyPmt, totalRepaid, totalInterest, ltv, sdlt, grossYield,
             stressMonthly, minRent, coverage, stressPass, amort, ioMonthly, ioTotalInterest };
  }, [isBTL, repayType, price, depositPct, rate, termYrs, monthlyRent, loan, mr, n]);

  const ltvColor = results.ltv > 75 ? "#dc2626" : results.ltv > 70 ? "#d97706" : "#16a34a";

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      {/* ── INPUTS ── */}
      <div>
        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <p className="text-xs font-semibold text-navy-500 mb-2 uppercase tracking-wide">Mortgage type</p>
            <div className="flex bg-navy-50 rounded-xl p-1 gap-1">
              {([["btl", "Buy-to-Let"], ["res", "Residential"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setIsBTL(v === "btl")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${(v === "btl") === isBTL ? "bg-navy-800 text-white" : "text-navy-500"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-navy-500 mb-2 uppercase tracking-wide">Repayment</p>
            <div className="flex bg-navy-50 rounded-xl p-1 gap-1">
              {([["repayment", "Capital"], ["interest-only", "IO"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setRepayType(v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${repayType === v ? "bg-navy-800 text-white" : "text-navy-500"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Slider label="Property value" value={price} onChange={setPrice} min={50000} max={1500000} step={5000}
          display={fmt(price)} />
        <Slider label={`Deposit — ${depositPct}%`} value={depositPct} onChange={setDepositPct} min={5} max={60} step={1}
          display={fmt(deposit)} />
        <Slider label={`Interest rate — ${rate}%`} value={rate} onChange={setRate} min={0.5} max={12} step={0.05}
          display={`${rate.toFixed(2)}% p.a.`} />
        <Slider label={`Mortgage term — ${termYrs} yrs`} value={termYrs} onChange={setTermYrs} min={5} max={40} step={1}
          display={`${termYrs} years`} />

        {isBTL && (
          <Slider label="Monthly rent (£)" value={monthlyRent} onChange={setMonthlyRent} min={300} max={4000} step={25}
            display={`${fmt(monthlyRent)}/mo`} />
        )}

        {/* LTV badge */}
        <div className="rounded-xl border px-4 py-3 mt-1" style={{ borderColor: ltvColor + "40", background: ltvColor + "10" }}>
          <p className="text-sm font-bold" style={{ color: ltvColor }}>
            LTV: {results.ltv.toFixed(1)}%
            {results.ltv > 75 && isBTL ? " — above 75% LTV limit for most BTL lenders" : results.ltv > 75 ? " — higher LTV, limited product range" : " ✓ Good LTV for lending"}
          </p>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="space-y-4">

        {/* Main result */}
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white">
          <p className="text-navy-300 text-xs mb-1 uppercase tracking-wider">Monthly payment</p>
          <p className="text-4xl font-extrabold text-gold-400 mb-1">{fmtD(results.monthlyPmt)}</p>
          <p className="text-navy-400 text-xs mb-5">
            {repayType === "interest-only" ? "Interest only · capital still owed at term end" : `Repayment over ${termYrs} years`}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Loan",          v: fmt(loan) },
              { l: "LTV",           v: `${results.ltv.toFixed(1)}%` },
              { l: "Total interest",v: fmt(results.totalInterest) },
              { l: "Total repaid",  v: fmt(results.totalRepaid) },
              { l: "SDLT",          v: fmt(results.sdlt) },
              { l: isBTL ? "Gross yield" : "Deposit", v: isBTL ? `${results.grossYield.toFixed(2)}%` : fmt(deposit) },
            ].map(r => (
              <div key={r.l} className="bg-white/10 rounded-xl p-3">
                <p className="text-navy-300 text-xs">{r.l}</p>
                <p className="font-bold text-sm">{r.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BTL Stress Test */}
        {isBTL && (
          <div className="bg-white rounded-xl border border-navy-100 p-5">
            <p className="text-sm font-bold text-navy-800 mb-3">BTL Stress Test</p>
            <p className="text-xs text-navy-400 mb-4">Lenders require rent ≥ 125% of mortgage payment at a 5.5% stress rate.</p>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              {[
                { l: "Min rent needed", v: fmt(results.minRent) + "/mo" },
                { l: "Your rent",       v: fmt(monthlyRent) + "/mo" },
                { l: "ICR coverage",    v: `${results.coverage.toFixed(2)}x` },
              ].map(r => (
                <div key={r.l} className="bg-navy-50 rounded-lg p-3">
                  <p className="text-xs text-navy-400 mb-1">{r.l}</p>
                  <p className="text-sm font-bold text-navy-800">{r.v}</p>
                </div>
              ))}
            </div>
            <div className={`rounded-lg px-4 py-3 ${results.stressPass ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className={`text-sm font-bold ${results.stressPass ? "text-green-700" : "text-red-700"}`}>
                {results.stressPass ? "✓ Stress test likely to pass" : "✗ Rent may be too low for lender stress test"}
              </p>
              <p className="text-xs text-navy-500 mt-1">Gross yield: {results.grossYield.toFixed(2)}%
                {results.grossYield >= 6 ? " · Strong BTL return" : results.grossYield >= 4.5 ? " · Acceptable" : " · Below 6% benchmark"}
              </p>
            </div>
          </div>
        )}

        {/* Repayment vs IO comparison */}
        <div className="bg-white rounded-xl border border-navy-100 p-5">
          <p className="text-sm font-bold text-navy-800 mb-4">Repayment vs Interest-Only</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-navy-100">
                <th className="text-left pb-2 text-navy-400 font-semibold"></th>
                <th className="text-right pb-2 text-navy-600 font-semibold">Repayment</th>
                <th className="text-right pb-2 text-gold-600 font-semibold">Interest Only</th>
              </tr>
            </thead>
            <tbody>
              {[
                { l: "Monthly payment", rep: fmtD(loan * mr / (1 - Math.pow(1 + mr, -n))), io: fmtD(results.ioMonthly) },
                { l: "Total interest",  rep: fmt(loan * mr / (1 - Math.pow(1 + mr, -n)) * n - loan), io: fmt(results.ioTotalInterest) },
                { l: "Balance at end",  rep: "£0",    io: fmt(loan) },
              ].map(r => (
                <tr key={r.l} className="border-b border-navy-50">
                  <td className="py-2 text-navy-600 font-medium">{r.l}</td>
                  <td className="py-2 text-right font-bold text-navy-800">{r.rep}</td>
                  <td className="py-2 text-right font-bold text-gold-600">{r.io}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-navy-400 mt-3">IO reduces monthly cost but leaves the full loan outstanding at term end.</p>
        </div>

        {/* Amortisation */}
        {repayType === "repayment" && results.amort.length > 0 && (
          <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
            <button onClick={() => setShowAmort(p => !p)}
              className="w-full flex justify-between items-center px-5 py-4 text-left text-sm font-bold text-navy-800 hover:bg-navy-50 transition-colors">
              Amortisation schedule
              <span className="text-gold-500 text-xl font-light">{showAmort ? "−" : "+"}</span>
            </button>
            {showAmort && (
              <div className="overflow-auto max-h-72 border-t border-navy-100">
                <table className="w-full text-xs">
                  <thead className="bg-navy-50 sticky top-0">
                    <tr>
                      {["Year", "Interest", "Principal", "Balance"].map(h => (
                        <th key={h} className="py-2 px-3 text-right text-navy-500 font-semibold first:text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.amort.map(r => (
                      <tr key={r.year} className="border-b border-navy-50">
                        <td className="py-1.5 px-3 font-bold text-navy-800">{r.year}</td>
                        <td className="py-1.5 px-3 text-right text-red-500">{fmt(r.interest)}</td>
                        <td className="py-1.5 px-3 text-right text-green-600">{fmt(r.principal)}</td>
                        <td className="py-1.5 px-3 text-right text-navy-700">{fmt(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Cross-sell to Deal Analyser */}
        <div className="bg-navy-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white text-sm font-bold">Want full deal analysis?</p>
            <p className="text-navy-300 text-xs mt-0.5">Net yield · cash flow · BRRR · 5-yr projection</p>
          </div>
          <Link href="/calculators/deal-analyser"
            className="flex-shrink-0 bg-gold-400 text-navy-900 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gold-300 transition-colors whitespace-nowrap">
            Deal Analyser →
          </Link>
        </div>
        <ShareResults
          title="Mortgage Calculator"
          summary={`Mortgage: £${Math.round(results.monthlyPmt).toLocaleString("en-GB")}/mo on a £${price.toLocaleString("en-GB")} property at ${rate}% interest (${depositPct}% deposit, ${termYrs} yr ${repayType})`}
        />
      </div>
    </div>
  );
}
