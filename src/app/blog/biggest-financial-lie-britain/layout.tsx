import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/biggest-financial-lie-britain/" },
  openGraph: {
    type: "article",
    title: "The Biggest Financial Lie in Britain Is Unravelling | PropertyVault UK",
    description: "For 40 years, Britain believed property prices would always rise. That assumption is now failing. The housing market isn't crashing — it's freezing. And that could be worse.",
    url: "https://www.propertyvaultuk.co.uk/blog/biggest-financial-lie-britain/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "The Biggest Financial Lie in Britain — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Biggest Financial Lie in Britain Is Unravelling",
  description: "For 40 years, Britain believed property prices would always rise. That assumption is now failing. The housing market isn't crashing — it's freezing. And that could be worse.",
  url: "https://www.propertyvaultuk.co.uk/blog/biggest-financial-lie-britain/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Market Analysis",
  keywords: ["UK housing market", "property market UK", "house prices UK", "housing crisis"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
