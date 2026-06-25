import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Section 24 Tax Calculator UK 2025 — Landlord Mortgage Relief | PropertyVault",
  description: "Calculate exactly how much extra tax you pay under Section 24's mortgage interest restriction. Compare before/after as a basic or higher rate taxpayer. Free tool.",
  keywords: "Section 24 calculator, mortgage interest relief calculator, Section 24 tax UK, landlord tax calculator 2025",
  openGraph: {
    title: "Section 24 Tax Calculator UK 2025 | PropertyVault",
    description: "See how Section 24 affects your buy-to-let tax bill. Enter your rental income, mortgage interest, and other income to compare the old vs new system.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/section-24/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Section 24 Tax Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Section 24 Tax Calculator UK 2025 | PropertyVault", description: "Free tool — see exactly how much more tax Section 24 costs you." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/section-24/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
