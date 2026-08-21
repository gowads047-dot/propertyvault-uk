"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { ShareResults } from "@/components/calculators/ShareResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { calcSDLT } from "@/lib/tax";
import { nonNegative } from "@/lib/inputs";

const faqs = [
  { q: "How much does it cost to move house in the UK?", a: "On a £250,000 property, total moving costs typically range from £10,000-£20,000. This includes stamp duty, solicitor fees (£1,000-£2,500), searches (£250-£400), survey (£400-£1,500), mortgage arrangement fees, removal costs, and any redecoration or furniture purchases. Buyers often underestimate these costs significantly." },
  { q: "Do I need a solicitor to buy a house?", a: "Yes. In England and Wales you need a solicitor or licensed conveyancer to handle the legal transfer of ownership. They conduct property searches, review the title, handle the exchange and completion, and register the new ownership with HM Land Registry. Fees typically range from £800-£2,000 plus disbursements." },
  { q: "What type of survey should I get when buying a house?", a: "A RICS Level 2 HomeBuyer Report (£400-£700) is suitable for standard modern properties in reasonable condition. A RICS Level 3 Building Survey (£600-£1,500) is recommended for older, larger, or unusual properties. Never skip the survey to save money — issues identified can be used to renegotiate the price or safely exit the purchase." },
  { q: "What are search fees when buying a house?", a: "Search fees cover local authority searches (planning history, road schemes, environmental risks), drainage searches, environmental searches, and chancel repair liability. Typical cost is £250-£450. Searches are required by most mortgage lenders and are a standard part of conveyancing." },
  { q: "How much do removals cost in the UK?", a: "A local move within the same city typically costs £300-£800 for a removal firm. A regional move costs £700-£1,500, while a long-distance or full-service move can exceed £2,000. Getting three quotes is strongly recommended. Moving on a Friday or at month-end is typically more expensive due to demand." },
];

export default function MovingCostsPage() {
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isAdditional, setIsAdditional] = useState(false);
  const [solicitorFee, setSolicitorFee] = useState(1200);
  const [searchFees, setSearchFees] = useState(300);
  const [surveyFee, setSurveyFee] = useState(500);
  const [mortgageFee, setMortgageFee] = useState(999);
  const [removalCost, setRemovalCost] = useState(800);
  const [mailRedirect, setMailRedirect] = useState(35);
  const [cleaning, setCleaning] = useState(200);
  const [furniture, setFurniture] = useState(2000);
  const [otherCosts, setOtherCosts] = useState(0);

  const stampDuty = useMemo(
    () => calcSDLT(propertyPrice, isAdditional, isFirstTime),
    [propertyPrice, isFirstTime, isAdditional],
  );

  const totalCosts = useMemo(() => {
    return stampDuty + solicitorFee + searchFees + surveyFee + mortgageFee + removalCost + mailRedirect + cleaning + furniture + otherCosts;
  }, [stampDuty, solicitorFee, searchFees, surveyFee, mortgageFee, removalCost, mailRedirect, cleaning, furniture, otherCosts]);

  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  const costItems = [
    { label: "Stamp Duty (SDLT)", value: stampDuty, editable: false },
    { label: "Solicitor / Conveyancer", value: solicitorFee, set: setSolicitorFee },
    { label: "Search Fees", value: searchFees, set: setSearchFees },
    { label: "Survey / Valuation", value: surveyFee, set: setSurveyFee },
    { label: "Mortgage Arrangement Fee", value: mortgageFee, set: setMortgageFee },
    { label: "Removals", value: removalCost, set: setRemovalCost },
    { label: "Mail Redirection", value: mailRedirect, set: setMailRedirect },
    { label: "Professional Cleaning", value: cleaning, set: setCleaning },
    { label: "Furniture / Essentials", value: furniture, set: setFurniture },
    { label: "Other Costs", value: otherCosts, set: setOtherCosts },
  ];

  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Moving Costs" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Moving Cost Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate the full cost of moving home — stamp duty, solicitor fees, surveys, removals, and everything else. Adjust each cost to match your quotes.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-navy-700 mb-1">Property Purchase Price</label>
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">£</span>
            <input type="number" min="0" value={propertyPrice} onChange={e => setPropertyPrice(nonNegative(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-navy-200 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" checked={isFirstTime} onChange={(e) => { setIsFirstTime(e.target.checked); if (e.target.checked) setIsAdditional(false); }} className="rounded" /> First-time buyer</label>
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" checked={isAdditional} onChange={(e) => { setIsAdditional(e.target.checked); if (e.target.checked) setIsFirstTime(false); }} className="rounded" /> Additional property (+5%)</label>
            </div>
          </div>

          <h2 className="text-lg font-bold text-navy-800 mb-3">Cost Breakdown</h2>
          <div className="space-y-3">
            {costItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-white rounded-lg border border-navy-100">
                <span className="text-sm text-navy-700 font-medium">{item.label}</span>
                {item.set ? (
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                  <input type="number" min="0" value={item.value} onChange={(e) => item.set!(Number(e.target.value))} className="w-28 pl-7 pr-2 py-2 border border-navy-200 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                ) : (
                  <span className="font-bold text-navy-800">{fmt(item.value)}</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white text-center">
            <p className="text-navy-300 text-sm mb-1">Total Moving Costs</p>
            <p className="text-4xl font-bold text-gold-400">{fmt(totalCosts)}</p>
          </div>

          <EmailResults />
          <ShareResults title="Moving Costs Calculator" summary={`Moving costs: stamp duty ${fmt(stampDuty)} + fees = ${fmt(totalCosts)} total for ${fmt(propertyPrice)} property`} />
          <FAQSchema faqs={faqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl space-y-6 text-navy-700 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-navy-800">The True Cost of Moving House in the UK</h2>
          <p>Moving house costs far more than most people budget for. On a £250,000 property, the combined costs of stamp duty, legal fees, survey, mortgage fees, estate agent commission, and removal firm can easily exceed £15,000-£20,000. Knowing this upfront — rather than discovering it at completion — lets you plan properly and avoid financial stress.</p>
          <h3 className="font-bold text-navy-800">Solicitor and Conveyancer Fees</h3>
          <p>Legal fees for a standard purchase: £800-£2,000 plus disbursements (land registry fees, search fees, electronic transfer fee). Buying and selling simultaneously means two sets of fees. Leasehold transactions typically cost more than freehold due to additional work around the lease, ground rent clauses, and service charge review.</p>
          <h3 className="font-bold text-navy-800">Survey Types and Costs</h3>
          <p>RICS HomeBuyer Report (Level 2): £400-£700 — recommended for most standard properties. RICS Building Survey (Level 3): £600-£1,500 — recommended for older, larger, or unusual properties. Never skip the survey to save money — issues identified can be used to renegotiate the price or exit the deal before you're legally bound.</p>
          <h3 className="font-bold text-navy-800">Estate Agent Fees When Selling</h3>
          <p>High street agents typically charge 1-3% plus VAT. On a £300,000 sale that's £3,600-£10,800. Online agents charge a fixed fee of £500-£2,000 — significant savings if your property sells quickly. Many online agents require upfront payment before the property sells, so the saving comes with added risk if it takes longer than expected.</p>
          <div className="pt-4 border-t border-navy-200">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Guides</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <Link href="/calculators/affordability" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Affordability</p><p className="text-xs text-navy-400 mt-0.5">How much to borrow</p></Link>
              <Link href="/calculators/rent-vs-buy" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rent vs Buy</p><p className="text-xs text-navy-400 mt-0.5">Compare options</p></Link>
              <Link href="/calculators/remortgage" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Remortgage</p><p className="text-xs text-navy-400 mt-0.5">Switch & save</p></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/blog/first-time-buyer-guide" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">First Time Buyer Guide</p></Link>
              <Link href="/blog/stamp-duty-guide" className="group block bg-white rounded-lg border border-navy-100 p-3 hover:shadow-md transition-all"><span className="text-xs font-bold text-gold-600">Guide</span><p className="font-bold text-navy-800 text-xs group-hover:text-gold-600 mt-0.5">Stamp Duty Guide</p></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}