import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Rent Receipt Template UK — Printable Landlord Rent Receipt | PropertyVault",
  description: "Download a free rent receipt template for UK landlords. Issue professional rent receipts to tenants for monthly payments. Print or send digitally. No sign-up required.",
  keywords: "free rent receipt template UK, landlord rent receipt, printable rent receipt, rent receipt download, rental payment receipt UK",
  openGraph: {
    title: "Free Rent Receipt Template UK | PropertyVault",
    description: "Free printable rent receipt template for UK landlords. Issue professional receipts to tenants in seconds.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/rent-receipt/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Rent Receipt Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Rent Receipt Template UK | PropertyVault", description: "Free rent receipt template — print or send digitally in seconds." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/rent-receipt/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
