import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Check-Out Report Template UK — End of Tenancy Inspection",
  description: "Download a free check-out report template for UK landlords. Document property condition at end of tenancy, compare against inventory, and support deposit deductions.",
  keywords: "checkout report template UK, end of tenancy inspection template, check out report landlord, tenancy checkout form, deposit deduction evidence template",
  openGraph: {
    title: "Free Check-Out Report Template UK | PropertyVault",
    description: "Free end-of-tenancy check-out report for landlords. Document damage and compare against move-in inventory.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/checkout-report/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Check-Out Report Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Check-Out Report Template UK | PropertyVault", description: "Free end-of-tenancy inspection template — protect your deposit claim." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/checkout-report/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
