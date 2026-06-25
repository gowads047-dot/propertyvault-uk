import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Sale Preparation Checklist UK — Get Your Home Market Ready | PropertyVault",
  description: "Download a free property sale preparation checklist. From valuation and conveyancer to presentation, EPC, and legal documents — cover every step before listing.",
  keywords: "property sale preparation checklist UK, selling house checklist, get property ready to sell, home sale prep checklist UK",
  openGraph: {
    title: "Free Property Sale Preparation Checklist UK | PropertyVault",
    description: "Free checklist — everything you need to do before listing your property for sale.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/sale-prep-checklist/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Sale Prep Checklist — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Property Sale Preparation Checklist UK | PropertyVault", description: "Free checklist — get your property market ready with nothing missed." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/sale-prep-checklist/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
