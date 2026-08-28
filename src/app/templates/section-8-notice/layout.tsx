import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Section 8 Notice Template UK 2026 — Landlord Eviction Notice",
  description: "Download a free Section 8 notice template for UK landlords. Covers all 17 grounds for possession. Updated for 2026. Use when tenants breach tenancy terms.",
  keywords: "Section 8 notice template UK, free Section 8 notice, landlord eviction notice template, Section 8 grounds for possession, Section 8 notice 2026",
  openGraph: {
    title: "Free Section 8 Notice Template UK 2026 | PropertyVault",
    description: "Free Section 8 notice template for UK landlords. All 17 grounds for possession covered — download instantly.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/section-8-notice/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Section 8 Notice Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Section 8 Notice Template UK 2026 | PropertyVault", description: "Free Section 8 notice — all grounds for possession, updated 2026." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/section-8-notice/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
