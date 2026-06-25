import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    type: "article",
    title: "Section 24 Explained — How It Affects UK Landlords' Tax Bills | PropertyVault UK",
    description: "Section 24 mortgage interest restriction explained. How it works, how much extra tax you pay, and whether a limited company (SPV) could save you money.",
    url: "https://propertyvaultuk.co.uk/blog/section-24-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Section 24 Explained — PropertyVault UK" }],
    authors: ["Nass"],
    publishedTime: "2025-09-01T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Section 24 Explained — How It Affects UK Landlords' Tax Bills",
  description: "Section 24 mortgage interest restriction explained. How it works, how much extra tax you pay, and whether a limited company (SPV) could save you money.",
  url: "https://propertyvaultuk.co.uk/blog/section-24-explained/",
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
  image: "https://propertyvaultuk.co.uk/og-image.png",
  articleSection: "Tax",
  keywords: ["Section 24", "mortgage interest relief", "landlord tax", "SPV property"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
