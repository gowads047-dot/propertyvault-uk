import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/first-time-buyer-guide/" },
  openGraph: {
    type: "article",
    title: "First-Time Buyer Guide UK — Step by Step | PropertyVault UK",
    description: "Complete first-time buyer guide. From saving a deposit to getting your keys. Mortgages, stamp duty relief, LISA, government schemes, and what to expect.",
    url: "https://www.propertyvaultuk.co.uk/blog/first-time-buyer-guide/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "First Time Buyer Guide UK — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "First-Time Buyer Guide UK — Step by Step",
  description: "Complete first-time buyer guide. From saving a deposit to getting your keys. Mortgages, stamp duty relief, LISA, government schemes, and what to expect.",
  url: "https://www.propertyvaultuk.co.uk/blog/first-time-buyer-guide/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Buying",
  keywords: ["first time buyer guide UK", "first time buyer mortgage", "LISA property", "first time buyer stamp duty"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
