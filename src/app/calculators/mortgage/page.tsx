import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmailResults } from "@/components/calculators/EmailResults";
import { EmbedCode } from "@/components/calculators/EmbedCode";
import { PrintButton } from "@/components/calculators/PrintButton";

const mortgageFaqs = [
  { q: "How much can I borrow for a mortgage?", a: "Most UK lenders will lend 4-4.5 times your annual gross income. Some specialist lenders may go up to 5.5x. Use our Affordability Calculator for a more accurate estimate based on your income and outgoings." },
  { q: "What is the difference between repayment and interest-only mortgages?", a: "With a repayment mortgage, your monthly payment covers both interest and capital, so the loan is fully repaid at the end of the term. With interest-only, you only pay the interest each month — the original loan amount remains and must be repaid at the end. Interest-only is popular with buy-to-let investors." },
  { q: "What deposit do I need for a mortgage?", a: "Residential mortgages are available from 5% deposit (95% LTV), though 10-15% unlocks better rates. Buy-to-let mortgages typically require 25% minimum (75% LTV)." },
  { q: "What is LTV and why does it matter?", a: "LTV (Loan-to-Value) is the mortgage amount as a percentage of the property value. Lower LTV means better interest rates. For example, a 75% LTV mortgage on a £200,000 property means borrowing £150,000 with a £50,000 deposit." },
  { q: "Are mortgage calculator results accurate?", a: "Our calculator uses the standard UK mortgage amortisation formula and produces accurate estimates. However, actual mortgage offers depend on your credit score, income verification, and individual lender criteria. Always consult a qualified mortgage broker for personalised advice." },
];

export const metadata: Metadata = {
  title: "Free Mortgage Calculator UK — Monthly Payments & Interest | PropertyVault",
  description: "Calculate your UK mortgage monthly payments, total interest, and compare repayment vs interest-only. Free, accurate, and mobile-friendly mortgage calculator.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/mortgage/" },
  openGraph: {
    title: "Free Mortgage Calculator UK — Monthly Payments & Interest | PropertyVault",
    description: "Calculate your UK mortgage monthly payments, total interest, and compare repayment vs interest-only. Free, accurate, and mobile-friendly mortgage calculator.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/calculators/mortgage/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Mortgage Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mortgage Calculator UK — Monthly Payments & Interest | PropertyVault",
    description: "Calculate your UK mortgage monthly payments, total interest, and compare repayment vs interest-only. Free, accurate, and mobile-friendly mortgage calculator.",
  },
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Mortgage" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Mortgage Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate your monthly mortgage payments, total interest costs, and compare repayment versus interest-only options.</p>
          <div className="mt-3"><PrintButton /></div>
        </div>
      </section>
      <section className="section-padding bg-navy-50">
        <div className="container-max">
          <MortgageCalculator />
          <div className="mt-8"><EmailResults /></div>
          <EmbedCode slug="mortgage" title="Mortgage Calculator UK" />
          <FAQSchema faqs={mortgageFaqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      {/* SEO Content */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">How the Mortgage Calculator Works</h2>
          <div className="prose prose-navy max-w-none space-y-4 text-navy-600">
            <p>Our mortgage calculator uses the standard UK mortgage amortisation formula to provide accurate monthly payment estimates. For repayment mortgages, we calculate using the formula: M = P[r(1+r)^n]/[(1+r)^n-1], where P is the principal, r is the monthly interest rate, and n is the total number of payments.</p>
            <h3 className="text-xl font-bold text-navy-800 mt-8">Repayment vs Interest-Only</h3>
            <p><strong>Repayment mortgages</strong> pay off both the interest and the capital over the term. At the end of your mortgage, you own the property outright. Monthly payments are higher but you build equity every month.</p>
            <p><strong>Interest-only mortgages</strong> only pay the interest each month. The original loan amount remains unchanged and must be repaid at the end of the term. Popular with buy-to-let investors as monthly costs are lower, maximising cash flow.</p>
            <h3 className="text-xl font-bold text-navy-800 mt-8">Understanding LTV</h3>
            <p>Loan-to-Value (LTV) is the percentage of the property price that you borrow. A lower LTV typically means better interest rates. Most residential lenders offer their best rates at 60% LTV, while buy-to-let mortgages commonly require a minimum 25% deposit (75% LTV).</p>
            <h3 className="text-xl font-bold text-navy-800 mt-8">Current UK Mortgage Rates</h3>
            <p>UK mortgage rates vary based on the Bank of England base rate, your LTV, credit score, and whether you choose a fixed or variable rate. As of 2024-2025, typical fixed rates range from 4% to 6% depending on term length and LTV. Always compare rates from multiple lenders or use a whole-of-market mortgage broker.</p>
          </div>
        </div>
      </section>
    </>
  );
}
