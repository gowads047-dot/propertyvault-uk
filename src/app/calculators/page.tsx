import type { Metadata } from "next";
import { CalculatorsGrid } from "@/components/calculators/CalculatorsGrid";
import { siteMetrics } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteMetrics.calculators} Free UK Property Calculators | PropertyVault UK`,
  description: `${siteMetrics.calculators} free UK property calculators — mortgage, SDLT, BRRR, rental yield, CGT, Section 24, HMO, bridging, cash flow, and more. No login required.`,
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/" },
  openGraph: {
    title: `${siteMetrics.calculators} Free UK Property Calculators | PropertyVault UK`,
    description: `${siteMetrics.calculators} free UK property calculators — mortgage, SDLT, BRRR, rental yield, CGT, Section 24, HMO, bridging, cash flow, and more. No login required.`,
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free UK Property Calculators" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteMetrics.calculators} Free UK Property Calculators | PropertyVault UK`,
    description: `${siteMetrics.calculators} free UK property calculators — mortgage, SDLT, BRRR, rental yield, CGT, Section 24, HMO, bridging, cash flow, and more. No login required.`,
  },
};

export default function CalculatorsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Free tools</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property Calculators</h1>
          <p className="text-navy-200 max-w-lg mx-auto">{siteMetrics.calculators} free calculators for UK property investors, landlords, and buyers. No sign-up required.</p>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <CalculatorsGrid />
        </div>
      </section>
    </>
  );
}
