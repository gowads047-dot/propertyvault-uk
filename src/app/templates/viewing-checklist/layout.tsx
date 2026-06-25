import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Viewing Checklist UK — What to Look For When Viewing | PropertyVault",
  description: "Download a free property viewing checklist for UK buyers and investors. Check structure, damp, electrics, heating, legal questions, and negotiation points at every viewing.",
  keywords: "property viewing checklist UK, house viewing checklist, what to check when viewing a property, property viewing tips UK, buy to let viewing checklist",
  openGraph: {
    title: "Free Property Viewing Checklist UK | PropertyVault",
    description: "Free viewing checklist — know exactly what to look for at every property viewing. Download instantly.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/viewing-checklist/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Viewing Checklist — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Property Viewing Checklist UK | PropertyVault", description: "Free checklist — never miss a red flag at a property viewing again." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/viewing-checklist/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
