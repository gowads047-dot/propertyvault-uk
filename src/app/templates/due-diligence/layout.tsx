import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Due Diligence Checklist UK — Investment Research Template | PropertyVault",
  description: "Download a free property investment due diligence checklist. Area research, deal analysis, legal checks, financing, and planning considerations for UK investors.",
  keywords: "property due diligence checklist UK, property investment research template, buy to let due diligence, property deal checklist UK",
  openGraph: {
    title: "Free Property Due Diligence Checklist UK | PropertyVault",
    description: "Free due diligence checklist for UK property investors — cover every angle before you buy.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/due-diligence/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Due Diligence Checklist — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Property Due Diligence Checklist UK | PropertyVault", description: "Free checklist — never skip a critical check before buying a property." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/due-diligence/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
