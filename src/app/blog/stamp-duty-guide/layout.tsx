import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/stamp-duty-guide/" },
  openGraph: {
    type: "article",
    title: "Stamp Duty UK — Complete Guide to Current SDLT Rates",
    description: "Complete UK stamp duty guide. Current SDLT rates, first-time buyer relief, additional property surcharge, and how to calculate your stamp duty bill.",
    url: "https://www.propertyvaultuk.co.uk/blog/stamp-duty-guide/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Stamp Duty UK Guide — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Stamp Duty UK — Complete Guide to Current SDLT Rates",
  description: "Complete UK stamp duty guide. Current SDLT rates, first-time buyer relief, additional property surcharge, and how to calculate your stamp duty bill.",
  url: "https://www.propertyvaultuk.co.uk/blog/stamp-duty-guide/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Tax",
  keywords: ["stamp duty UK", "SDLT rates", "first time buyer stamp duty", "additional property surcharge"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
