import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tenant Application Form Template UK — Landlord Reference Form | PropertyVault",
  description: "Download a free tenant application form template for UK landlords. Collect employment, rental history, references, and identity documents before offering a tenancy.",
  keywords: "tenant application form UK, landlord tenant reference form, rental application template UK, tenant vetting form, tenant screening form UK",
  openGraph: {
    title: "Free Tenant Application Form Template UK | PropertyVault",
    description: "Free tenant application form — collect employment, rental history, and references before offering a tenancy. No sign-up required.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/tenant-application/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Tenant Application Form — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Tenant Application Form UK | PropertyVault", description: "Free landlord tenant application template — screen tenants before letting." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/tenant-application/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
