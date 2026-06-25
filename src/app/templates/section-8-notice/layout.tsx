import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Section 8 Notice Template UK 2025 — Landlord Eviction Notice | PropertyVault",
  description: "Download a free Section 8 notice template for UK landlords. Covers all 17 grounds for possession. Updated for 2025. Use when tenants breach tenancy terms.",
  keywords: "Section 8 notice template UK, free Section 8 notice, landlord eviction notice template, Section 8 grounds for possession, Section 8 notice 2025",
  openGraph: {
    title: "Free Section 8 Notice Template UK 2025 | PropertyVault",
    description: "Free Section 8 notice template for UK landlords. All 17 grounds for possession covered — download instantly.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/section-8-notice/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Free Section 8 Notice Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Section 8 Notice Template UK 2025 | PropertyVault", description: "Free Section 8 notice — all grounds for possession, updated 2025." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/section-8-notice/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
