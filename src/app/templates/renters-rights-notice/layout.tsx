import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Renters Rights Act Notice Template UK 2025 | PropertyVault",
  description: "Download a free Renters Rights Act 2025 information notice template for UK landlords. Inform tenants of their rights under the new legislation. Legally compliant.",
  keywords: "Renters Rights Act notice template 2025, Renters Rights Act 2025 landlord notice, RRB 2025 tenant notice, landlord notice Renters Rights Act UK",
  openGraph: {
    title: "Free Renters Rights Act Notice Template UK 2025 | PropertyVault",
    description: "Free notice template for landlords under the Renters Rights Act 2025 — inform tenants of their new rights.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/renters-rights-notice/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Renters Rights Act Notice — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Renters Rights Act Notice Template 2025 | PropertyVault", description: "Free landlord notice template for the Renters Rights Act 2025." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/renters-rights-notice/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
