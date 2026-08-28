import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tenant Reference Request Letter UK — Landlord Reference Template",
  description: "Download a free tenant reference request letter template for UK landlords. Request employer references, previous landlord references, and character references professionally.",
  keywords: "tenant reference request letter UK, landlord reference template, tenant referencing template, reference request letter download UK",
  openGraph: {
    title: "Free Tenant Reference Request Letter UK | PropertyVault",
    description: "Free reference request letter for landlords — collect employment and previous landlord references professionally.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/reference-request/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Tenant Reference Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Tenant Reference Request Letter UK | PropertyVault", description: "Free landlord reference request template — collect tenant references the right way." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/reference-request/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
