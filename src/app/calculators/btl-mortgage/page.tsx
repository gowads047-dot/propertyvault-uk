import type { Metadata } from "next";
import { BtlMortgageCalculator } from "@/components/calculators/BtlMortgageCalculator";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { EmbedCode } from "@/components/calculators/EmbedCode";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free BTL Mortgage Stress Test Calculator UK — Interest Coverage Ratio | PropertyVault",
  description: "Check if your rental income passes the buy-to-let mortgage stress test. Calculate ICR at actual and stress rates, max borrowing, and whether your deal qualifies for BTL finance.",
  keywords: "BTL mortgage stress test, interest coverage ratio calculator, buy to let mortgage calculator, ICR calculator UK, rental income mortgage test",
};

const faqs = [
  { q: "What is the BTL mortgage stress test?", a: "Buy-to-let lenders test whether your rental income covers the mortgage interest payments by a required multiple called the Interest Coverage Ratio (ICR). They calculate this at a stressed interest rate — typically 5.0–5.5% — rather than the actual product rate, to ensure the loan remains affordable if rates rise." },
  { q: "What Interest Coverage Ratio (ICR) do lenders require?", a: "Most lenders require 125% ICR for basic rate (20%) taxpayers, meaning rent must be at least 125% of the monthly mortgage interest. Higher rate (40%) and additional rate (45%) taxpayers typically face a 145% requirement because Section 24 reduces their net rental income after tax." },
  { q: "What stress test rate do lenders typically use?", a: "Most lenders stress test at 5.0% to 5.5%, regardless of the actual product rate you are offered. Some lenders use a pay rate stress test (the actual rate) — this is more common for limited company BTL mortgages and can increase the maximum loan available." },
  { q: "Can I get a BTL mortgage on interest-only?", a: "Yes — most buy-to-let mortgages are arranged on an interest-only basis. This keeps monthly payments lower, which helps pass the ICR stress test. You will need a repayment strategy at the end of the term (typically selling the property or remortgaging). Some lenders also offer capital repayment BTL mortgages." },
  { q: "Does the stress test differ for limited company BTL?", a: "Yes — many lenders apply 125% ICR to limited company (SPV) mortgages regardless of the director's personal tax position. This is because the company is the borrower and is not subject to Section 24. This can allow limited companies to borrow more on the same rental income than a higher rate taxpaying individual." },
];

export default function BtlMortgagePage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "BTL Mortgage Stress Test" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">BTL Mortgage Stress Test Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Check whether your rental income passes the lender&apos;s stress test — and find out exactly how much you can borrow on a buy-to-let mortgage.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <BtlMortgageCalculator />

          <div className="mt-8">
            <EmailResults />
            <EmbedCode slug="btl-mortgage" title="BTL Mortgage Stress Test Calculator" />
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 space-y-4 max-w-3xl text-sm text-navy-600">
            <h2 className="text-xl font-bold text-navy-800">How Does the BTL Mortgage Stress Test Work?</h2>
            <p>Buy-to-let lenders do not use the same affordability test as residential mortgages. Instead of looking at your income, they focus on whether the rental income covers the mortgage interest by a set multiple — the Interest Coverage Ratio (ICR).</p>
            <p><strong>Standard ICR rules:</strong> Most lenders require rent to cover mortgage interest by 125% if you&apos;re a basic rate taxpayer, or 145% if you&apos;re a higher rate taxpayer. They calculate this at a stressed rate (typically 5.0–5.5%) rather than the actual product rate.</p>
            <p><strong>Example:</strong> A £150,000 loan at a 5.5% stress rate costs £8,250/year in interest. At 145% ICR, you need annual rent of £11,963 (£997/month) to pass. If your actual rent is lower, the lender will reduce the maximum loan until the test passes.</p>
            <p><strong>Limited company loans:</strong> Some lenders apply 125% ICR to limited companies regardless of the director&apos;s personal tax position, which can give companies access to slightly higher lending amounts.</p>
          </div>

          <div className="pt-4 border-t border-navy-200 not-prose mt-6">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/calculators/mortgage" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Mortgage</p><p className="text-xs text-navy-400 mt-0.5">Monthly payments</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross &amp; net yield</p></Link>
              <Link href="/calculators/deal-analyser" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Deal Analyser</p><p className="text-xs text-navy-400 mt-0.5">Full deal score</p></Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
