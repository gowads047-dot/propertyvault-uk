import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/rent-to-rent-explained/" },
  title: "Rent-to-Rent Explained — The Complete UK Guide 2026",
  description:
    "Everything you need to know about Rent-to-Rent in the UK: how it works, the 3 models, legal requirements, how much you can earn, and how to get your first deal.",
  openGraph: {
    type: "article",
    title: "Rent-to-Rent Explained — The Complete UK Guide 2026",
    description:
      "Everything you need to know about Rent-to-Rent in the UK: how it works, the 3 models, legal requirements, how much you can earn, and how to get your first deal.",
    url: "https://www.propertyvaultuk.co.uk/blog/rent-to-rent-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630 }],
    authors: ["Nass"],
    publishedTime: "2026-07-05T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Rent-to-Rent Explained — The Complete UK Guide 2026",
  description:
    "Everything you need to know about Rent-to-Rent in the UK: how it works, the 3 models, legal requirements, how much you can earn, and how to get your first deal.",
  url: "https://www.propertyvaultuk.co.uk/blog/rent-to-rent-explained/",
  datePublished: "2026-07-05",
  dateModified: "2026-07-05",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Investing",
  keywords: ["rent to rent", "R2R", "HMO", "serviced accommodation", "property investing UK", "no mortgage property"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
