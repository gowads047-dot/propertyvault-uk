import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator UK 2026 — How Much Can I Borrow? | PropertyVault",
  description: "Find out how much mortgage you can borrow based on your income, outgoings, and deposit. Covers residential and buy-to-let stress testing. Free UK calculator.",
  keywords: "mortgage affordability calculator UK, how much can I borrow, mortgage calculator 2026, buy to let affordability, stress test mortgage",
  openGraph: {
    title: "Mortgage Affordability Calculator UK 2026 | PropertyVault",
    description: "Calculate how much you can borrow based on income and deposit. Includes buy-to-let stress testing.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/affordability/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Mortgage Affordability Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Mortgage Affordability Calculator UK 2026 | PropertyVault", description: "Free tool — find out how much you can borrow in 60 seconds." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/affordability/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
