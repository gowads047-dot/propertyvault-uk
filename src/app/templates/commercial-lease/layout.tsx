import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Commercial Lease Template UK — Basic Commercial Property Agreement",
  description: "Download a free basic commercial lease template for UK landlords. Covers small offices, retail units, and light industrial. Not a substitute for professional legal advice.",
  keywords: "commercial lease template UK, free commercial lease agreement, commercial property lease template, basic commercial tenancy UK",
  openGraph: {
    title: "Free Commercial Lease Template UK | PropertyVault",
    description: "Free commercial lease template for small UK commercial properties — office, retail, and light industrial.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/commercial-lease/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Commercial Lease Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Commercial Lease Template UK | PropertyVault", description: "Free basic commercial lease template for UK landlords." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/commercial-lease/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
