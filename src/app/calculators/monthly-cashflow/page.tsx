import type { Metadata } from "next";
import { CashFlowCalculator } from "@/components/calculators/CashFlowCalculator";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free BTL Monthly Cash Flow Calculator UK — Net Yield, Cash-on-Cash Return | PropertyVault",
  description: "Calculate monthly cash flow on any buy-to-let property. See gross yield, net yield, cash-on-cash return, and every expense broken down — including voids and management fees.",
  keywords: "BTL cash flow calculator, buy to let monthly income calculator, net yield calculator UK, cash on cash return calculator, rental property cash flow",
};

const faqs = [
  { q: "What is cash flow on a rental property?", a: "Cash flow is the money left over each month after paying all costs associated with a rental property — mortgage, management fees, insurance, maintenance, council tax, and any other expenses. Positive cash flow means the property generates income each month; negative cash flow means you are subsidising it from other income." },
  { q: "What is a good monthly cash flow on a buy-to-let?", a: "Most UK property investors aim for at least £200–£300 positive cash flow per month after all expenses. Properties in the Midlands and North of England (Birmingham, Nottingham, Derby, Leeds) often produce better cash flow than London, where high purchase prices compress yields. A property cash-flowing £200/month generates £2,400/year — enough to cover an unexpected boiler replacement." },
  { q: "What is cash-on-cash return in property?", a: "Cash-on-cash return measures your annual cash flow as a percentage of the cash you actually invested (deposit + purchase costs). If you invested £50,000 deposit and earn £3,600/year net cash flow, your cash-on-cash return is 7.2%. Most investors target 8–12% cash-on-cash return to justify a BTL investment over other asset classes." },
  { q: "How do voids affect cash flow?", a: "Each week of vacancy reduces your effective monthly rent. A 4-week void on a £1,000/month property costs £923 in lost rent (4/4.33 months). Meanwhile, mortgage, insurance, and council tax payments continue. A realistic cash flow model should always include 3–5% allowance for voids — equivalent to 1.5–2.5 weeks per year." },
  { q: "Should I include maintenance costs in my cash flow calculation?", a: "Yes — always. Maintenance is often the most underestimated cost for new landlords. A conservative rule is to budget 5–10% of gross rent for maintenance and repairs. On a £1,000/month property, that is £50–£100/month held in reserve. This covers boilers, appliances, decorating, and the inevitable 'tenant called at 11pm' scenario." },
];

export default function MonthlyCashFlowPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "BTL Cash Flow" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">BTL Monthly Cash Flow Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate exactly what your buy-to-let earns each month after every expense — mortgage, agent fees, voids, maintenance, and insurance.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <CashFlowCalculator />

          <div className="mt-8">
            <EmailResults />
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 space-y-4 max-w-3xl text-sm text-navy-600">
            <h2 className="text-xl font-bold text-navy-800">What Makes a Good BTL Cash Flow?</h2>
            <p>UK investors typically target at least 6–8% gross yield and £200+ positive cash flow per month. Properties in the Midlands and North (Birmingham, Nottingham, Derby, Sheffield) frequently meet this threshold at current prices. London properties rarely produce positive cash flow at standard 75% LTV due to the high purchase price-to-rent ratio.</p>
            <p><strong>The four metrics that matter:</strong> Gross yield (total income vs purchase price), Net yield (income after all costs vs purchase price), Cash-on-cash return (annual cash flow as % of money invested), and Interest Coverage Ratio (rent vs mortgage interest — lenders require 125–145%).</p>
            <p>Use this calculator alongside the <Link href="/calculators/btl-mortgage" className="text-gold-600 hover:underline">BTL Mortgage Stress Test</Link> to check both your personal cash flow and whether a lender will approve the loan.</p>
          </div>

          <div className="pt-4 border-t border-navy-200 not-prose mt-6">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/calculators/deal-analyser" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Deal Analyser</p><p className="text-xs text-navy-400 mt-0.5">Full deal score</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross &amp; net</p></Link>
              <Link href="/calculators/void-period" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Void Period Cost</p><p className="text-xs text-navy-400 mt-0.5">Empty weeks cost</p></Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
