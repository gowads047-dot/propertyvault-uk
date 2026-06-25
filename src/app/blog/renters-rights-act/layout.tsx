import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    title: "Renters' Rights Act 2025 — What Every UK Landlord Must Know | PropertyVault UK",
    description: "The Renters' Rights Act abolishes Section 21, ends fixed-term tenancies, restricts rent increases, and extends new rights to tenants. Full guide for landlords.",
    url: "https://propertyvaultuk.co.uk/blog/renters-rights-act/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Renters Rights Act 2025 — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-07-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Renters' Rights Act 2025 — What Every UK Landlord Must Know",
  description: "The Renters' Rights Act abolishes Section 21, ends fixed-term tenancies, restricts rent increases, and extends new rights to tenants. Full guide for landlords.",
  url: "https://propertyvaultuk.co.uk/blog/renters-rights-act/",
  datePublished: "2025-07-01",
  dateModified: "2025-07-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
  image: "https://propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Law",
  keywords: ["Renters Rights Act 2025", "Section 21 abolished", "renters reform UK", "no fault eviction ban"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
