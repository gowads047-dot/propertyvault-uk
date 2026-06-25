import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    title: "Guaranteed Rent Explained — Is It Worth It for Landlords? | PropertyVault UK",
    description: "What is guaranteed rent? How it works, the pros and cons, and whether it's worth it for UK landlords. Complete guide with income comparison.",
    url: "https://propertyvaultuk.co.uk/blog/guaranteed-rent-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Guaranteed Rent Explained — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guaranteed Rent Explained — Is It Worth It for Landlords?",
  description: "What is guaranteed rent? How it works, the pros and cons, and whether it's worth it for UK landlords. Complete guide with income comparison.",
  url: "https://propertyvaultuk.co.uk/blog/guaranteed-rent-explained/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
  image: "https://propertyvaultuk.co.uk/og-image.png",
  articleSection: "Guaranteed Rent",
  keywords: ["guaranteed rent UK", "guaranteed rent scheme", "guaranteed rent for landlords"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
