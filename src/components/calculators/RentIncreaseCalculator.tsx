"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ShareResults } from "./ShareResults";

export function RentIncreaseCalculator() {
  const [currentRent, setCurrentRent] = useState(850);
  const [increaseType, setIncreaseType] = useState<"percent" | "fixed">("percent");
  const [increasePercent, setIncreasePercent] = useState(5);
  const [increaseFixed, setIncreaseFixed] = useState(50);
  const [monthsUntilIncrease, setMonthsUntilIncrease] = useState(0);
  const [noticeWeeks, setNoticeWeeks] = useState(2);

  const results = useMemo(() => {
    const newRent = increaseType === "percent"
      ? Math.round(currentRent * (1 + increasePercent / 100))
      : currentRent + increaseFixed;
    const increase = newRent - currentRent;
    const annualExtra = increase * 12;
    const yieldIncrease5yr = annualExtra * 5;
    const noticeDays = noticeWeeks * 7;
    const validS13 = noticeWeeks >= 2;
    const cpiBased = currentRent * 0.039; // approx CPI reference 3.9%
    const marketBased = currentRent * 0.05;
    return { newRent, increase, annualExtra, yieldIncrease5yr, validS13, noticeDays, cpiBased, marketBased };
  }, [currentRent, increaseType, increasePercent, increaseFixed, monthsUntilIncrease, noticeWeeks]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Current Tenancy</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Current Monthly Rent</label>
          <input type="range" min={400} max={3000} step={25} value={currentRent} onChange={e => setCurrentRent(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{fmt(currentRent)}/month</p>
        </div>

        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-2">Proposed Increase</h3>
        <div className="flex gap-2">
          <button onClick={() => setIncreaseType("percent")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${increaseType === "percent" ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-600 border-navy-200"}`}>By Percentage</button>
          <button onClick={() => setIncreaseType("fixed")} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${increaseType === "fixed" ? "bg-navy-800 text-white border-navy-800" : "bg-white text-navy-600 border-navy-200"}`}>Fixed Amount</button>
        </div>
        {increaseType === "percent" ? (
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">Increase Percentage</label>
            <input type="range" min={1} max={20} step={0.5} value={increasePercent} onChange={e => setIncreasePercent(+e.target.value)} className="w-full accent-gold-500" />
            <p className="text-center font-bold text-navy-800">{increasePercent}%</p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">Fixed Monthly Increase</label>
            <input type="range" min={10} max={500} step={5} value={increaseFixed} onChange={e => setIncreaseFixed(+e.target.value)} className="w-full accent-gold-500" />
            <p className="text-center font-bold text-navy-800">+{fmt(increaseFixed)}/month</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Months before increase takes effect</label>
          <input type="range" min={0} max={24} step={1} value={monthsUntilIncrease} onChange={e => setMonthsUntilIncrease(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{monthsUntilIncrease === 0 ? "Immediate" : `${monthsUntilIncrease} month${monthsUntilIncrease !== 1 ? "s" : ""}`}</p>
        </div>

        <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-2">Section 13 Notice</h3>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Notice period you plan to give</label>
          <input type="range" min={1} max={8} step={1} value={noticeWeeks} onChange={e => setNoticeWeeks(+e.target.value)} className="w-full accent-gold-500" />
          <p className="text-center font-bold text-navy-800">{noticeWeeks} week{noticeWeeks !== 1 ? "s" : ""} ({results.noticeDays} days)</p>
        </div>
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${results.validS13 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {results.validS13
            ? "✓ Meets minimum 2-week Section 13 notice requirement"
            : "✗ Section 13 requires at least 2 weeks' notice — increase your notice period"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white">
          <p className="text-sm text-white/60 mb-1">New monthly rent</p>
          <p className="text-5xl font-bold text-gold-400">{fmt(results.newRent)}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-sm text-white/60">Was {fmt(currentRent)}</p>
            <p className="text-green-400 font-bold">+{fmt(results.increase)}/month</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Extra per year</p>
            <p className="text-2xl font-bold text-green-700">+{fmt(results.annualExtra)}</p>
          </div>
          <div className="bg-white rounded-xl border border-navy-100 p-4">
            <p className="text-xs font-bold text-navy-500 mb-1">Extra over 5 years</p>
            <p className="text-2xl font-bold text-navy-800">+{fmt(results.yieldIncrease5yr)}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3 text-sm">
          <p className="font-bold text-amber-800">Benchmark comparison</p>
          <div className="flex justify-between items-center"><span className="text-amber-700">CPI-linked increase (~3.9%)</span><span className="font-semibold text-amber-800">{fmt(results.cpiBased + currentRent)}/mo</span></div>
          <div className="flex justify-between items-center"><span className="text-amber-700">Market average increase (~5%)</span><span className="font-semibold text-amber-800">{fmt(results.marketBased + currentRent)}/mo</span></div>
          <div className="flex justify-between items-center border-t border-amber-200 pt-2"><span className="text-amber-800 font-semibold">Your proposed new rent</span><span className="font-bold text-navy-800">{fmt(results.newRent)}/mo</span></div>
        </div>

        <div className="bg-white rounded-xl border border-navy-100 p-5 space-y-2 text-sm">
          <p className="font-bold text-navy-800 mb-3">Section 13 rent increase process</p>
          <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-navy-800 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span><p className="text-navy-600">Use official Form 4 (Section 13) to propose the increase in writing</p></div>
          <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-navy-800 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span><p className="text-navy-600">Give at least 2 weeks' notice (not mid-tenancy — only once per year)</p></div>
          <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-navy-800 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span><p className="text-navy-600">Tenant can challenge by applying to First-tier Tribunal within the notice period</p></div>
          <div className="flex gap-3 items-start"><span className="w-5 h-5 rounded-full bg-navy-800 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span><p className="text-navy-600">Tribunal will set market rate — keep your increase reasonable to avoid challenge</p></div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/templates/section-13-notice" className="btn-primary text-sm !py-2.5 !px-5">Section 13 Template →</Link>
          <Link href="/calculators/landlord-costs" className="btn-outline text-sm !py-2.5 !px-5">Full P&amp;L →</Link>
        </div>
        <ShareResults
          title="Rent Increase Calculator"
          summary={`Rent increase: from £${currentRent}/mo to £${results.newRent}/mo (+£${results.annualExtra.toLocaleString("en-GB")} extra per year)`}
        />
      </div>
    </div>
  );
}
