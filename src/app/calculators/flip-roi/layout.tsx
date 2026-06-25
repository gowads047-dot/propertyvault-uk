import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Flip ROI Calculator UK — Buy, Refurb & Sell Profit | PropertyVault",
  description: "Calculate your profit, ROI, and annualised return on a UK property flip. Factor in purchase costs, stamp duty, refurb budget, finance costs, and sale fees.",
  keywords: "property flip calculator UK, flip ROI calculator, house flip profit calculator, buy refurb sell calculator, flip property returns UK",
  openGraph: {
    title: "Property Flip ROI Calculator UK | PropertyVault",
    description: "Model your buy-refurb-sell deal end to end. Calculate profit, ROI, and annualised return.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/flip-roi/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Property Flip ROI Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Property Flip ROI Calculator UK | PropertyVault", description: "Free tool — model your flip deal profit before you buy." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/flip-roi/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
