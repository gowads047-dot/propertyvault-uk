import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Inspection Report Template UK — Landlord Inspection Form | PropertyVault",
  description: "Download a free property inspection report template for UK landlords. Conduct periodic inspections professionally and document property condition with photos and notes.",
  keywords: "property inspection report template UK, landlord inspection form, periodic inspection template, rental property inspection checklist",
  openGraph: {
    title: "Free Property Inspection Report Template UK | PropertyVault",
    description: "Free periodic inspection report template for landlords. Document property condition with this professional form.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/inspection-record/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Inspection Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Property Inspection Report Template UK | PropertyVault", description: "Free landlord inspection form — professional and legally defensible." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/inspection-record/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
