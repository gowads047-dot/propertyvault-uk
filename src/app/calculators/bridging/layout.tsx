import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bridging Loan Calculator UK — Total Cost & Monthly Interest | PropertyVault",
  description: "Calculate bridging loan costs, monthly interest, arrangement fees, and exit fees. See total cost of bridging finance for property purchases, auctions, and refurbishments.",
  keywords: "bridging loan calculator UK, bridging finance calculator, bridging loan costs, property bridging calculator, auction finance calculator",
  openGraph: {
    title: "Bridging Loan Calculator UK | PropertyVault",
    description: "Calculate total bridging loan costs including interest, arrangement fees, and exit charges.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/bridging/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Bridging Loan Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Bridging Loan Calculator UK | PropertyVault", description: "Free tool — calculate bridging finance costs before you commit." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/bridging/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
