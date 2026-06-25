import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    title: "Guaranteed Rent vs Traditional Letting — Full Comparison | PropertyVault UK",
    description: "Compare guaranteed rent vs traditional letting side by side. Income, risk, management, costs, and which option suits your situation as a UK landlord.",
    url: "https://propertyvaultuk.co.uk/blog/guaranteed-rent-vs-traditional-letting/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Guaranteed Rent vs Traditional Letting — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guaranteed Rent vs Traditional Letting — Full Comparison",
  description: "Compare guaranteed rent vs traditional letting side by side. Income, risk, management, costs, and which option suits your situation as a UK landlord.",
  url: "https://propertyvaultuk.co.uk/blog/guaranteed-rent-vs-traditional-letting/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
  image: "https://propertyvaultuk.co.uk/og-image.png",
  articleSection: "Guaranteed Rent",
  keywords: ["guaranteed rent vs traditional letting", "landlord rent options", "company let vs self manage"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
