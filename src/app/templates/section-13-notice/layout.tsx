import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Section 13 Rent Increase Notice UK Template | PropertyVault",
  description: "Download a free Section 13 notice template to increase rent on an AST. Compliant with Housing Act 1988. Enter the new rent and notice period — print and serve.",
  keywords: "Section 13 notice template UK, rent increase notice template, Section 13 Housing Act 1988, free rent increase notice landlord",
  openGraph: {
    title: "Free Section 13 Rent Increase Notice UK | PropertyVault",
    description: "Free Section 13 notice template — legally increase your tenant's rent the right way. Download instantly.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/section-13-notice/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Section 13 Notice Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free Section 13 Rent Increase Notice UK | PropertyVault", description: "Free Section 13 notice — increase rent legally with one click." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/section-13-notice/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
