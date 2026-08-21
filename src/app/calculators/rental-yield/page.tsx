import { RentalYieldCalculator } from "@/components/calculators/RentalYieldCalculator";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { EmbedCode } from "@/components/calculators/EmbedCode";
import { GuaranteedRentCTA } from "@/components/ui/GuaranteedRentCTA";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const faqs = [
  { q: "What is a good rental yield in the UK?", a: "A gross yield above 6% is generally considered strong for UK single-let buy-to-let. Net yields above 5% (after costs) are solid. London and the South East typically yield 3-5% gross, while northern cities like Manchester, Liverpool, and Nottingham regularly achieve 7-10%+. HMOs typically yield 10-15% in the same areas." },
  { q: "What is the difference between gross yield and net yield?", a: "Gross yield is annual rent divided by purchase price. Net yield deducts all running costs — management fees, insurance, maintenance, void periods, compliance costs — before dividing by property value. Net yield gives a realistic picture of actual returns; gross yield is a quick comparison tool only." },
  { q: "How do void periods affect rental yield?", a: "Each week a property sits empty costs you approximately 1.9% of annual rent. Two void weeks per year reduces effective yield by 3.8%. Building void periods into your calculation is essential — budgeting one to three void weeks per year is realistic for most single-let properties in normal market conditions." },
  { q: "Does the purchase price or current value matter for yield calculations?", a: "Yield on purchase price (initial yield) shows the return you locked in at acquisition. Yield on current value (revaluation yield) shows your current income return if you were buying today. Both are useful: initial yield shows deal quality, current yield shows whether to hold, sell, or refinance." },
  { q: "What costs should I include when calculating net rental yield?", a: "Include management fees (8-15% of rent if using an agent), buildings and landlord insurance, maintenance (typically 1% of property value per year), void period allowance, Gas Safety Certificates, EICR, EPC costs, and any licensing fees. Mortgage payments are excluded from yield calculations but included in cash flow analysis." },
];

export const metadata: Metadata = {
  title: "Rental Yield Calculator UK — Gross & Net Yield | PropertyVault",
  description: "Calculate gross yield, net yield, and monthly cash flow on any UK buy-to-let property. Factor in voids, management fees, and running costs.",
  openGraph: {
    title: "Rental Yield Calculator UK | PropertyVault",
    description: "Calculate gross and net rental yield on any UK property — factor in voids, management, and all costs.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/rental-yield/",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Rental Yield Calculator — PropertyVault UK" }],
  },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/rental-yield/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rental Yield Calculator UK",
  description: "Calculate gross yield, net yield, and monthly cash flow on any UK buy-to-let property.",
  url: "https://www.propertyvaultuk.co.uk/calculators/rental-yield/",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  provider: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
};

export default function RentalYieldPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Rental Yield" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Rental Yield Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate gross and net rental yields, monthly cash flow, and annual returns. Factor in void periods, management fees, and all operating costs.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-max">
          <RentalYieldCalculator />
          <div className="mt-8"><EmailResults /></div>
          <GuaranteedRentCTA context="yield" />
          <EmbedCode slug="rental-yield" title="Rental Yield Calculator UK" />
          <FAQSchema faqs={faqs} />
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
