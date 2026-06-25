import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free UK Property Templates — 40+ Legal & Landlord Documents | PropertyVault",
  description: "Download free UK property templates. AST agreements, Section 8 notices, inventory checklists, inspection records, rent receipts, and 40+ more legal documents for landlords.",
  keywords: "free property templates UK, landlord legal templates, free tenancy agreement template, Section 8 notice template, AST template download",
  openGraph: {
    title: "Free UK Property Templates — 40+ Legal Documents | PropertyVault",
    description: "Download free UK property templates. 40+ legal documents for landlords, tenants, and investors — no sign-up required.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Templates — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free UK Property Templates | PropertyVault", description: "40+ free legal documents for UK landlords and property investors." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
