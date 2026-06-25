import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Pet Permission Letter Template UK — Landlord Pet Addendum | PropertyVault",
  description: "Download a free pet permission letter template for UK landlords. Grant conditional permission for pets with conditions on cleaning, damage liability, and inspection rights.",
  keywords: "pet permission letter template UK, landlord pet addendum, pet permission tenancy UK, allow pets rental property template, pet clause tenancy agreement",
  openGraph: {
    title: "Free Pet Permission Letter Template UK | PropertyVault",
    description: "Free pet permission letter for landlords — grant permission with the right conditions in place.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/pet-permission/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Pet Permission Letter — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Pet Permission Letter Template UK | PropertyVault", description: "Free template — allow pets in your rental with the right conditions." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/pet-permission/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
