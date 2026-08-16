import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leasehold Calculator UK 2026 — Extension Cost, Depreciation & Ground Rent | PropertyVault",
  description: "Calculate lease extension premium, annual lease depreciation, ground rent escalation, and mortgage eligibility. Instantly see what a short lease is costing you — and how much you'll pay to extend.",
  keywords: "leasehold calculator UK, lease extension cost calculator, how much does lease extension cost, leasehold depreciation calculator, ground rent calculator UK, marriage value calculator, leasehold mortgage eligibility",
  openGraph: {
    title: "Leasehold Calculator UK 2026 | PropertyVault",
    description: "Extension premium, annual depreciation, ground rent projections, and a plain-English verdict on whether to buy the leasehold property.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/leasehold/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Leasehold Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Leasehold Calculator UK 2026 | PropertyVault", description: "Free tool — extension premium, ground rent, depreciation and mortgage eligibility in one place." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/leasehold/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
