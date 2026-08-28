import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/brrr-strategy-explained/" },
  openGraph: {
    type: "article",
    title: "What Is the BRRR Strategy? A Complete UK Guide",
    description: "The BRRR strategy explained for UK property investors. Buy, Refurbish, Rent, Refinance — learn how it works, the risks, and how to model your first deal.",
    url: "https://www.propertyvaultuk.co.uk/blog/brrr-strategy-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "BRRR Strategy Explained — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is the BRRR Strategy? A Complete UK Guide",
  description: "The BRRR strategy explained for UK property investors. Buy, Refurbish, Rent, Refinance — learn how it works, the risks, and how to model your first deal.",
  url: "https://www.propertyvaultuk.co.uk/blog/brrr-strategy-explained/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Strategy",
  keywords: ["BRRR strategy UK", "buy refurbish rent refinance", "BRRR property investing"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
