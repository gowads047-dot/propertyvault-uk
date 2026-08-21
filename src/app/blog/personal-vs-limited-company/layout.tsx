import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/personal-vs-limited-company/" },
  openGraph: {
    type: "article",
    title: "Personal vs Limited Company — Which Is Better for BTL? | PropertyVault UK",
    description: "Should you hold buy-to-let property personally or through a limited company (SPV)? Tax comparison, pros, cons, and which structure suits you.",
    url: "https://www.propertyvaultuk.co.uk/blog/personal-vs-limited-company/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Personal vs Limited Company Property — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Personal vs Limited Company — Which Is Better for Buy-to-Let?",
  description: "Should you hold buy-to-let property personally or through a limited company (SPV)? Tax comparison, pros, cons, and which structure suits you.",
  url: "https://www.propertyvaultuk.co.uk/blog/personal-vs-limited-company/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Tax",
  keywords: ["personal vs limited company property", "SPV property", "limited company buy to let", "corporation tax rental income"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
