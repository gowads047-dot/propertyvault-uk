import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Deal Analyser UK — Free Investment Calculator | PropertyVault",
  description: "Analyse any UK property deal in minutes. Calculate cash flow, ROI, yield, equity, and annual returns. Covers buy-to-let, HMO, BRRR, and flips. Free tool.",
  keywords: "property deal analyser UK, property investment calculator, buy to let deal analyser, property ROI calculator, deal analysis tool",
  openGraph: {
    title: "Property Deal Analyser UK | PropertyVault",
    description: "Run the numbers on any property deal — cash flow, ROI, yield, and return on investment.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/deal-analyser/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Property Deal Analyser — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Property Deal Analyser UK | PropertyVault", description: "Free tool — analyse any property investment deal in under 5 minutes." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/deal-analyser/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
