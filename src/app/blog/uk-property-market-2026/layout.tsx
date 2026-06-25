import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    title: "UK Property Market 2026 — What Investors Need to Know | PropertyVault UK",
    description: "UK property market analysis for 2026. Mortgage rates, house prices, rental demand, and what it means for buy-to-let investors and landlords.",
    url: "https://propertyvaultuk.co.uk/blog/uk-property-market-2026/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Market 2026 — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2026-01-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "UK Property Market 2026 — What Investors Need to Know",
  description: "UK property market analysis for 2026. Mortgage rates, house prices, rental demand, and what it means for buy-to-let investors and landlords.",
  url: "https://propertyvaultuk.co.uk/blog/uk-property-market-2026/",
  datePublished: "2026-01-01",
  dateModified: "2026-01-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
  image: "https://propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Market Analysis",
  keywords: ["UK property market 2026", "house prices 2026", "buy to let 2026", "property investment outlook"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
