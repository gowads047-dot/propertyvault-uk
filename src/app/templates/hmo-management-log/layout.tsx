import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free HMO Management Log Template UK — House in Multiple Occupation Record | PropertyVault",
  description: "Download a free HMO management log for UK landlords. Track room occupancy, rent payments, maintenance, compliance, and licensing renewals in one place.",
  keywords: "HMO management log UK, HMO record template, house in multiple occupation log, HMO landlord management template, HMO compliance record",
  openGraph: {
    title: "Free HMO Management Log Template UK | PropertyVault",
    description: "Free HMO management log — track rooms, rent, maintenance, and compliance in one template.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/hmo-management-log/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free HMO Management Log — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free HMO Management Log Template UK | PropertyVault", description: "Free HMO log — keep every room, payment, and job in one place." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/hmo-management-log/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
