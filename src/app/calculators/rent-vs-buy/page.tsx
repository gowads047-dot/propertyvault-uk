"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { monthlyRepayment, compoundGrowth } from "@/lib/finance";
import { nonNegative, signed } from "@/lib/inputs";

const faqs = [
  { q: "Is it cheaper to rent or buy in the UK?", a: "It depends on the local market, time horizon, and what you'd do with a deposit if you didn't buy. In most UK cities outside London, buying becomes cheaper than renting over a 5-10 year period when capital growth is factored in. In London and the South East, the higher purchase costs and price-to-rent ratios make the calculation less clear-cut." },
  { q: "How long do I need to stay in a property for buying to make sense?", a: "Buying costs (stamp duty, legal fees, survey, moving) are typically 3-5% of the purchase price. To amortise these costs, you generally need to stay at least 3-5 years, and ideally longer. Buying for short periods in a flat or slow-growth market can be more expensive than renting the equivalent property." },
  { q: "What are the hidden costs of buying that renters don't have?", a: "Homeowners pay buildings insurance, bear all maintenance and repair costs, pay for boiler servicing, and are responsible for structural issues. Renters also benefit from flexibility to move without incurring transaction costs. The opportunity cost of the deposit — invested elsewhere — is another cost buyers implicitly accept." },
  { q: "What is the price-to-rent ratio and how is it used?", a: "The price-to-rent ratio compares a property's purchase price to its annual rent. A ratio of 15 or below generally favours buying; above 20-25 generally favours renting. In London, ratios of 25-35 are common, making renting relatively more attractive. In northern cities, ratios of 12-18 typically favour buying." },
  { q: "How does the Renters' Rights Act 2025 affect the rent vs buy decision?", a: "The Renters' Rights Act 2025 abolished Section 21 'no-fault' evictions and restricts in-tenancy rent increases to once per year. This gives renters more security and predictability, making renting a more viable long-term option for those who previously felt forced to buy for stability reasons." },
];

export default function RentVsBuyPage() {
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [depositPct, setDepositPct] = useState(10);
  const [mortgageRate, setMortgageRate] = useState(5.5);
  const [term, setTerm] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [annualGrowth, setAnnualGrowth] = useState(3);
  const [annualRentIncrease, setAnnualRentIncrease] = useState(4);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const depositAmt = propertyPrice * (depositPct / 100);
    const loan = propertyPrice - depositAmt;
    const monthlyMortgage = monthlyRepayment(loan, mortgageRate, term);
    const monthlyOwnerCosts = 150; // insurance, maintenance average
    const totalMonthlyBuying = monthlyMortgage + monthlyOwnerCosts;

    let totalRentPaid = 0;
    let currentRent = monthlyRent;
    for (let y = 0; y < years; y++) {
      totalRentPaid += currentRent * 12;
      currentRent *= (1 + annualRentIncrease / 100);
    }

    let totalBuyingCost = depositAmt + (propertyPrice * 0.03); // stamp duty estimate + fees
    totalBuyingCost += totalMonthlyBuying * 12 * years;

    const futureValue = compoundGrowth(propertyPrice, annualGrowth, years);
    const equityGained = futureValue - loan; // simplified
    const netCostBuying = totalBuyingCost - equityGained;
    const buyingIsCheaper = netCostBuying < totalRentPaid;

    return {
      depositAmt, loan, monthlyMortgage, totalMonthlyBuying,
      monthlyRent, finalMonthlyRent: compoundGrowth(monthlyRent, annualRentIncrease, years),
      totalRentPaid, totalBuyingCost, futureValue, equityGained,
      netCostBuying, buyingIsCheaper,
      savingAmount: Math.abs(totalRentPaid - netCostBuying),
    };
  }, [propertyPrice, depositPct, mortgageRate, term, monthlyRent, annualGrowth, annualRentIncrease, years]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Rent vs Buy" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Rent vs Buy Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Is it cheaper to rent or buy? Compare the total cost of renting versus buying over time, factoring in capital growth, rent increases, and ownership costs.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2">Buying Scenario</h3>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Property Price</label>
                <input type="range" min={100000} max={1000000} step={5000} value={propertyPrice} onChange={e => setPropertyPrice(nonNegative(e.target.value))} className="w-full accent-gold-500" />
                <p className="text-center font-bold text-navy-800">{fmt(propertyPrice)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Deposit ({depositPct}%)</label><input type="range" min={5} max={40} step={1} value={depositPct} onChange={e => setDepositPct(nonNegative(e.target.value))} className="w-full accent-gold-500" /></div>
                <div><label className="block text-xs font-semibold text-navy-700 mb-1">Mortgage Rate ({mortgageRate}%)</label><input type="range" min={2} max={8} step={0.1} value={mortgageRate} onChange={e => setMortgageRate(nonNegative(e.target.value))} className="w-full accent-gold-500" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Mortgage Term ({term} years)</label><input type="range" min={5} max={40} step={1} value={term} onChange={e => setTerm(nonNegative(e.target.value))} className="w-full accent-gold-500" /></div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Annual Property Growth ({annualGrowth}%)</label><input type="range" min={0} max={8} step={0.5} value={annualGrowth} onChange={e => setAnnualGrowth(signed(e.target.value))} className="w-full accent-gold-500" /></div>

              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Renting Scenario</h3>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Current Monthly Rent</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                <input type="number" min="0" value={monthlyRent} onChange={e => setMonthlyRent(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-navy-700 mb-1">Annual Rent Increase ({annualRentIncrease}%)</label><input type="range" min={0} max={10} step={0.5} value={annualRentIncrease} onChange={e => setAnnualRentIncrease(nonNegative(e.target.value))} className="w-full accent-gold-500" /></div>

              <h3 className="font-bold text-navy-800 border-b border-navy-100 pb-2 pt-3">Comparison Period</h3>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Compare over {years} years</label><input type="range" min={1} max={30} step={1} value={years} onChange={e => setYears(nonNegative(e.target.value))} className="w-full accent-gold-500" /></div>
            </div>

            <div>
              <div className={`rounded-2xl p-8 text-white mb-6 ${results.buyingIsCheaper ? "bg-gradient-to-br from-green-700 to-green-900" : "bg-gradient-to-br from-navy-800 to-navy-900"}`}>
                <p className="text-sm opacity-80 mb-1">Over {years} years, it is cheaper to</p>
                <p className="text-4xl font-bold mb-1">{results.buyingIsCheaper ? "BUY" : "RENT"}</p>
                <p className="text-sm opacity-80">by approximately {fmt(results.savingAmount)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-navy-100 p-5">
                  <h4 className="font-bold text-navy-800 text-sm mb-3">Buying</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-navy-600">Monthly mortgage</span><span className="font-semibold">{fmt(results.monthlyMortgage)}</span></div>
                    <div className="flex justify-between"><span className="text-navy-600">+ running costs</span><span className="font-semibold">~£150</span></div>
                    <div className="flex justify-between"><span className="text-navy-600">Total cost ({years}yr)</span><span className="font-semibold">{fmt(results.totalBuyingCost)}</span></div>
                    <div className="flex justify-between text-green-600"><span>Property value in {years}yr</span><span className="font-semibold">{fmt(results.futureValue)}</span></div>
                    <div className="flex justify-between font-bold border-t border-navy-200 pt-2"><span>Net cost</span><span>{fmt(results.netCostBuying)}</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-navy-100 p-5">
                  <h4 className="font-bold text-navy-800 text-sm mb-3">Renting</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-navy-600">Current rent</span><span className="font-semibold">{fmt(results.monthlyRent)}/mo</span></div>
                    <div className="flex justify-between"><span className="text-navy-600">Rent in year {years}</span><span className="font-semibold">{fmt(results.finalMonthlyRent)}/mo</span></div>
                    <div className="flex justify-between font-bold border-t border-navy-200 pt-2"><span>Total rent ({years}yr)</span><span>{fmt(results.totalRentPaid)}</span></div>
                    <div className="flex justify-between text-red-600"><span>Equity built</span><span className="font-semibold">£0</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-navy-50 rounded-xl p-4 text-xs text-navy-600">
                <strong>Note:</strong> This is a simplified comparison. Buying costs include an estimate for stamp duty, legal fees, insurance, and maintenance. It does not account for investment returns on a deposit if renting, tax implications, or personal circumstances. Always seek professional financial advice.
              </div>
            </div>
          </div>
          <div className="mt-8"><EmailResults /></div>
          <ShareResults title="Rent vs Buy Calculator" summary={`Rent vs Buy over ${years} years: ${results.buyingIsCheaper ? `buying saves ${fmt(results.savingAmount)}` : `renting saves ${fmt(results.savingAmount)}`}`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">Renting vs Buying in the UK — What the Maths Actually Says</h2>
          <p>The rent-vs-buy debate is rarely simple. In some UK cities, buying is dramatically cheaper than renting over the long term. In others — particularly London and the South East — the deposit and purchase costs are so large that investing that capital elsewhere can outperform property ownership for a decade or more. The right answer depends on your local market, time horizon, and what you'd do with the deposit if you didn't buy.</p>
          <h3 className="font-bold text-navy-800">The Hidden Costs of Buying</h3>
          <p>Buyers often compare the monthly mortgage payment to rent but forget: stamp duty (thousands tied up immediately), legal fees, survey, arrangement fee, building insurance, maintenance responsibility, and the opportunity cost of the deposit. A £30,000 deposit invested at 7% average return grows to £59,000 in 10 years — this is the benchmark your property equity needs to beat.</p>
          <h3 className="font-bold text-navy-800">The Hidden Costs of Renting</h3>
          <p>Renters don't build equity, can face rent increases at renewal (the Renters' Rights Act 2025 restricts in-tenancy increases to once per year and removes Section 21 "no-fault" evictions), and have less long-term certainty. These are real costs that don't appear in a monthly payment comparison but significantly affect quality of life and financial planning.</p>
          <h3 className="font-bold text-navy-800">When Buying Wins and When Renting Wins</h3>
          <p>Buying typically wins if: you plan to stay 5+ years (long enough to amortise purchase costs), the area has strong price growth potential, and mortgage payments are comparable to rent. Renting typically wins if: you need flexibility, the price-to-rent ratio is very high (over 25x annual rent), or you have high-return alternatives for the deposit capital. Run both scenarios with your actual numbers above.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/affordability" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Affordability</p><p className="text-xs text-navy-400 mt-0.5">How much to borrow</p></Link>
              <Link href="/calculators/moving-costs" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Moving Costs</p><p className="text-xs text-navy-400 mt-0.5">Total cost</p></Link>
              <Link href="/calculators/remortgage" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Remortgage</p><p className="text-xs text-navy-400 mt-0.5">Switch & save</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/first-time-buyer-guide" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">First Time Buyer Guide</p></Link>
              <Link href="/blog/biggest-financial-lie-britain" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">The Biggest Financial Lie in Britain</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}