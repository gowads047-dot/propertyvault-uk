import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/hmo-investing-uk/" },
  openGraph: {
    type: "article",
    title: "HMO Investing UK — Is It Still Profitable? | PropertyVault UK",
    description: "HMO investing explained. Licensing, room sizes, fire safety, yields, and whether Houses in Multiple Occupation are still worth it for UK landlords.",
    url: "https://www.propertyvaultuk.co.uk/blog/hmo-investing-uk/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "HMO Investing UK — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "HMO Investing UK — Is It Still Profitable?",
  description: "HMO investing explained. Licensing, room sizes, fire safety, yields, and whether Houses in Multiple Occupation are still worth it for UK landlords.",
  url: "https://www.propertyvaultuk.co.uk/blog/hmo-investing-uk/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Strategy",
  keywords: ["HMO investing UK", "HMO yield", "HMO licensing", "houses in multiple occupation"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
