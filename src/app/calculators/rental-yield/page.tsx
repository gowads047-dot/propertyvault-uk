import { RentalYieldCalculator } from "@/components/calculators/RentalYieldCalculator";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Rental Yield Calculator UK — Gross & Net Yield | PropertyVault",
  description: "Calculate gross yield, net yield, and monthly cash flow on any UK buy-to-let property. Factor in voids, management fees, and running costs.",
  openGraph: {
    title: "Rental Yield Calculator UK | PropertyVault",
    description: "Calculate gross and net rental yield on any UK property — factor in voids, management, and all costs.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/rental-yield/",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Rental Yield Calculator — PropertyVault UK" }],
  },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/rental-yield/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rental Yield Calculator UK",
  description: "Calculate gross yield, net yield, and monthly cash flow on any UK buy-to-let property.",
  url: "https://propertyvaultuk.co.uk/calculators/rental-yield/",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  provider: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
};

export default function RentalYieldPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Rental Yield Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate gross and net rental yields, monthly cash flow, and annual returns. Factor in void periods, management fees, and all operating costs.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-max">
          <RentalYieldCalculator />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Understanding Rental Yields</h2>
          <div className="space-y-4 text-navy-600">
            <p><strong>Gross yield</strong> is the simplest measure: annual rent divided by purchase price, expressed as a percentage. A property bought for £200,000 generating £12,000 per year has a 6% gross yield.</p>
            <p><strong>Net yield</strong> accounts for operating costs — insurance, maintenance, management fees, void periods, and compliance costs. This gives you a far more realistic picture of actual returns.</p>
            <h3 className="text-xl font-bold text-navy-800 mt-6">What Is a Good Rental Yield?</h3>
            <p>In the UK, gross yields typically range from 3-4% in London and the South East to 7-10%+ in northern cities like Liverpool, Manchester, and Hull. A net yield above 5% is generally considered strong for single-let buy-to-let properties.</p>
            <h3 className="text-xl font-bold text-navy-800 mt-6">Yield vs Capital Growth</h3>
            <p>Higher-yield areas (typically the North) often see lower capital growth, while lower-yield areas (London, South East) tend to see stronger long-term price appreciation. The best strategy depends on whether you prioritise income or growth.</p>
          </div>
        </div>
      </section>
    </>
  );
}
