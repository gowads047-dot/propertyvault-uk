import { BRRRCalculator } from "@/components/calculators/BRRRCalculator";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { EmbedCode } from "@/components/calculators/EmbedCode";
import { GuaranteedRentCTA } from "@/components/ui/GuaranteedRentCTA";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const brrrFaqs = [
  { q: "What does BRRR stand for?", a: "BRRR stands for Buy, Refurbish, Rent, Refinance. It is a property investment strategy where you purchase below market value, add value through refurbishment, rent the property out, then refinance against the higher value to recycle your original capital." },
  { q: "How much deposit do I need for a BRRR deal?", a: "For the initial purchase, you typically need 25-30% if using bridging finance, or cash if buying at auction. For the refinance stage, most BTL lenders require 25% equity (75% LTV) in the property based on the new higher valuation." },
  { q: "What is the 6-month rule?", a: "Most buy-to-let mortgage lenders require you to have owned the property for at least 6 months before they will refinance based on the new market value. Some specialist lenders offer day-one refinance products but these are less common." },
  { q: "Can I get all my money out with BRRR?", a: "It is possible if the difference between your purchase price and the after-repair value (ARV) is large enough. If you buy at a sufficient discount and add enough value, the 75% LTV refinance can return 100% or more of your invested capital." },
  { q: "What are the risks of the BRRR strategy?", a: "Key risks include refurbishment cost overruns, the surveyor valuing the property lower than expected (meaning you cannot refinance out all your capital), interest rate changes between purchase and refinance, void periods, and bridging finance costs if the project takes longer than planned." },
];

export const metadata: Metadata = {
  title: "BRRR Calculator UK — Buy Refurbish Rent Refinance",
  description: "Free BRRR calculator. Model your buy, refurbish, rent, refinance deal. Calculate money left in, ROI, cash flow, equity created, and capital recycling.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/brrr/" },
  openGraph: {
    title: "BRRR Calculator UK — Buy Refurbish Rent Refinance",
    description: "Free BRRR calculator. Model your buy, refurbish, rent, refinance deal. Calculate money left in, ROI, cash flow, equity created, and capital recycling.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/calculators/brrr/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "BRRR Calculator UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BRRR Calculator UK — Buy Refurbish Rent Refinance",
    description: "Free BRRR calculator. Model your buy, refurbish, rent, refinance deal. Calculate money left in, ROI, cash flow, equity created, and capital recycling.",
  },
};

export default function BRRRPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "BRRR Calculator" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">BRRR Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Model your Buy, Refurbish, Rent, Refinance deal from start to finish. See how much capital you recycle, your cash flow, ROI, and whether you get all your money out.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-max">
          <BRRRCalculator />
          <div className="mt-8">
            <EmailResults />
          </div>
          <EmbedCode slug="brrr" title="BRRR Calculator UK" />
          <GuaranteedRentCTA context="brrr" />
          <FAQSchema faqs={brrrFaqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">The BRRR Strategy Explained</h2>
          <div className="space-y-4 text-navy-600">
            <p>BRRR (Buy, Refurbish, Rent, Refinance) is a property investment strategy that allows you to recycle your capital and scale a portfolio rapidly. The goal is to purchase below market value, add value through refurbishment, rent the property out, then refinance to pull your original capital back out — and repeat.</p>
            <h3 className="text-xl font-bold text-navy-800 mt-6">Key Metrics</h3>
            <p><strong>Money Left In:</strong> The amount of your original investment that remains tied up after refinancing. Ideally this is zero or negative (meaning you got all your money back plus surplus).</p>
            <p><strong>Capital Recycling:</strong> The percentage of your total investment recovered through refinancing. 100% means you got all your money back. Over 100% means you made money on the refinance.</p>
            <p><strong>ROI on Cash Left In:</strong> Annual cash flow divided by the money left in the deal. If you have no money left in, your ROI is technically infinite — you&apos;re earning returns on a zero cash investment.</p>
          </div>
        </div>
      </section>
    </>
  );
}
