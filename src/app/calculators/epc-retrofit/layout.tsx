import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EPC Retrofit Cost Calculator UK 2025 — Upgrade to EPC C | PropertyVault",
  description: "Estimate the cost of upgrading your rental property to EPC C rating. Model insulation, heating, windows, and solar upgrades before the 2030 EPC deadline.",
  keywords: "EPC retrofit calculator UK, EPC C upgrade cost, EPC improvement cost calculator, energy efficiency upgrade landlord, EPC 2030 deadline cost",
  openGraph: {
    title: "EPC Retrofit Cost Calculator UK 2025 | PropertyVault",
    description: "Estimate upgrade costs to reach EPC C before the 2030 deadline. Model insulation, heating, and renewable energy improvements.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/epc-retrofit/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "EPC Retrofit Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "EPC Retrofit Cost Calculator UK 2025 | PropertyVault", description: "Free tool — estimate your EPC upgrade costs before the 2030 deadline." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/epc-retrofit/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
