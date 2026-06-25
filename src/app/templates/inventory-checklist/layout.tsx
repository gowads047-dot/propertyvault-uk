import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Inventory Checklist Template UK — Landlord Move-In Inventory | PropertyVault",
  description: "Download a free property inventory checklist for UK landlords. Room-by-room condition report for move-in and check-out. Helps resolve deposit disputes.",
  keywords: "free inventory checklist UK, landlord inventory template, property inventory template download, move in inventory checklist, tenancy inventory UK",
  openGraph: {
    title: "Free Inventory Checklist Template UK | PropertyVault",
    description: "Free room-by-room inventory template for landlords. Protect your deposit and avoid disputes at check-out.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/inventory-checklist/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Inventory Checklist — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Inventory Checklist Template UK | PropertyVault", description: "Free landlord inventory checklist — protect your deposit with a proper record." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/inventory-checklist/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
