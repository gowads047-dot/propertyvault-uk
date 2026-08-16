import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Buy-to-Let Guide UK — Complete BTL Investment Guide | PropertyVault",
  description: "Everything about buy-to-let investing in the UK. Mortgages, yields, tax, legal requirements, portfolio building, and expert strategies for BTL landlords.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/buy-to-let/" },
  openGraph: {
    title: "Buy-to-Let Guide UK — Complete BTL Investment Guide | PropertyVault",
    description: "Everything about buy-to-let investing in the UK. Mortgages, yields, tax, legal requirements, portfolio building, and expert strategies for BTL landlords.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/buy-to-let/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Buy-to-Let Guide UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy-to-Let Guide UK — Complete BTL Investment Guide | PropertyVault",
    description: "Everything about buy-to-let investing in the UK. Mortgages, yields, tax, legal requirements, portfolio building, and expert strategies for BTL landlords.",
  },
};

export default function BuyToLetPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Investment Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Buy-to-Let Investing UK</h1>
            <p className="text-navy-200 text-lg">The complete guide to buy-to-let property investment. From your first BTL purchase to building a multi-property portfolio generating passive income.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">What Is Buy-to-Let?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p>Buy-to-let (BTL) is the most popular property investment strategy in the UK. You purchase a residential property specifically to let it to tenants, generating monthly rental income while benefiting from long-term capital appreciation.</p>
            <p>There are currently over 2.7 million buy-to-let properties in England, housing approximately 4.4 million tenants. Despite regulatory changes and tax reforms in recent years, BTL remains one of the most reliable wealth-building strategies available to UK investors.</p>

            <h3 className="text-xl font-bold text-navy-800 mt-8">How Much Deposit Do You Need?</h3>
            <p>Most buy-to-let mortgage lenders require a minimum 25% deposit (75% LTV). Some specialist lenders offer 80% or even 85% LTV products, but these typically come with higher interest rates. For example, a £200,000 property would require a minimum deposit of £50,000 at 75% LTV.</p>

            <h3 className="text-xl font-bold text-navy-800 mt-8">Buy-to-Let Mortgage Affordability</h3>
            <p>BTL mortgages are assessed primarily on rental income, not your personal income. Most lenders require the rental income to cover 125-145% of the mortgage payment at a stress-tested rate (typically 5.5%). This is known as the Interest Coverage Ratio (ICR).</p>

            <h3 className="text-xl font-bold text-navy-800 mt-8">Tax Considerations</h3>
            <p>Since April 2020, Section 24 has fully removed the ability to deduct mortgage interest from rental income for individual landlords. Instead, you receive a 20% tax credit on mortgage interest. This has made limited company (SPV) structures more tax-efficient for higher-rate taxpayers.</p>

            <h3 className="text-xl font-bold text-navy-800 mt-8">Running Costs to Budget For</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Mortgage payments</strong> — your largest ongoing cost</li>
              <li><strong>Letting agent fees</strong> — typically 8-12% of rent for full management</li>
              <li><strong>Insurance</strong> — landlord buildings and contents, rent guarantee</li>
              <li><strong>Maintenance</strong> — budget 10-15% of rental income</li>
              <li><strong>Void periods</strong> — typically 2-4 weeks per year</li>
              <li><strong>Gas safety certificate</strong> — annual legal requirement (£60-100)</li>
              <li><strong>EPC</strong> — required before letting, valid for 10 years</li>
              <li><strong>Electrical safety check</strong> — every 5 years (£150-300)</li>
            </ul>

            <h3 className="text-xl font-bold text-navy-800 mt-8">Choosing the Right Area</h3>
            <p>The best BTL areas balance strong rental demand, achievable yields, and capital growth potential. Consider proximity to transport links, employment centres, universities, and hospitals. Research local rental demand using Rightmove, OpenRent, and local letting agents.</p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <Link href="/calculators/rental-yield" className="block bg-navy-50 rounded-xl p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 mb-1">Calculate Your Yield</h3>
              <p className="text-sm text-navy-500">Use our rental yield calculator to analyse any BTL deal.</p>
            </Link>
            <Link href="/mortgages" className="block bg-navy-50 rounded-xl p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 mb-1">BTL Mortgage Guide</h3>
              <p className="text-sm text-navy-500">Compare BTL mortgage types, rates, and lender requirements.</p>
            </Link>
          </div>

          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
