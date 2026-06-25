import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Property Repair Report Template UK — Maintenance Request Form | PropertyVault",
  description: "Download a free property repair and maintenance request template. Log repair requests, contractor visits, costs, and completion dates. Essential for landlords and property managers.",
  keywords: "property repair report template UK, maintenance request form landlord, repair log template, property maintenance record UK",
  openGraph: {
    title: "Free Property Repair Report Template UK | PropertyVault",
    description: "Free repair report and maintenance log template for landlords — track every job from report to completion.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/repair-report/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Free Repair Report Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Property Repair Report Template UK | PropertyVault", description: "Free maintenance request and repair log for landlords." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/repair-report/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
