import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Offer Worksheet UK — Calculate Your Maximum Offer",
  description: "Download a free property offer worksheet. Calculate your maximum purchase price based on target yield, refurb costs, comparables, and exit strategy. For UK investors.",
  keywords: "property offer worksheet UK, maximum offer calculator property, property offer template, buy to let offer calculation, investment property offer sheet",
  openGraph: {
    title: "Free Property Offer Worksheet UK | PropertyVault",
    description: "Free offer worksheet — calculate the right price to offer on any UK investment property.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/offer-worksheet/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Offer Worksheet — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Property Offer Worksheet UK | PropertyVault", description: "Free template — calculate exactly what to offer on your next deal." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/offer-worksheet/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
