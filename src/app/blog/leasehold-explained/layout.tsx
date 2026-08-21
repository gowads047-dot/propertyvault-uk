import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/leasehold-explained/" },
  openGraph: {
    type: "article",
    title: "Leasehold Property Explained — The Complete UK Buyer's Guide | PropertyVault UK",
    description: "Everything UK buyers need to know about leasehold: lease lengths, extension costs, ground rent risks, marriage value, and how to avoid the most expensive mistakes.",
    url: "https://www.propertyvaultuk.co.uk/blog/leasehold-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Leasehold Explained — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2026-07-05T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Leasehold Property Explained — The Complete UK Buyer's Guide",
  description: "Everything UK buyers need to know about leasehold: lease lengths, extension costs, ground rent risks, marriage value, and how to avoid the most expensive mistakes.",
  url: "https://www.propertyvaultuk.co.uk/blog/leasehold-explained/",
  datePublished: "2026-07-05",
  dateModified: "2026-07-05",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Buying",
  keywords: ["leasehold", "lease extension", "ground rent", "marriage value", "leasehold reform", "UK property"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
