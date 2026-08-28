import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/epc-c-deadline-landlords/" },
  openGraph: {
    type: "article",
    title: "EPC C Deadline 2030 — What Landlords Need to Know",
    description: "The confirmed EPC C deadline (2030) for UK rental properties explained. What landlords need to do, estimated costs, available grants, and how to prepare.",
    url: "https://www.propertyvaultuk.co.uk/blog/epc-c-deadline-landlords/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "EPC C Deadline 2030 — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "EPC C Deadline 2030 — What Landlords Need to Know",
  description: "The confirmed EPC C deadline (2030) for UK rental properties explained. What landlords need to do, estimated costs, available grants, and how to prepare.",
  url: "https://www.propertyvaultuk.co.uk/blog/epc-c-deadline-landlords/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Compliance",
  keywords: ["EPC C deadline 2030", "EPC requirements landlords", "EPC retrofit cost"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
