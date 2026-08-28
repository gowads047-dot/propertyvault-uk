import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Landlord Compliance Checklist UK 2026 — Legal Requirements",
  description: "Download a free landlord compliance checklist for 2026. Gas safety, EPC, EICR, smoke alarms, deposit protection, right to rent, and all legal landlord obligations.",
  keywords: "landlord compliance checklist UK 2026, landlord legal requirements checklist, rental property compliance UK, landlord obligations checklist",
  openGraph: {
    title: "Free Landlord Compliance Checklist UK 2026 | PropertyVault",
    description: "Free compliance checklist — gas, electric, EPC, deposit, right to rent. Know every legal requirement for UK landlords.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/landlord-compliance/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Landlord Compliance Checklist — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Landlord Compliance Checklist UK 2026 | PropertyVault", description: "Free compliance checklist — every landlord legal requirement in one place." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/landlord-compliance/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
