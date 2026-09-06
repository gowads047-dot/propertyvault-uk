import type { Metadata } from "next";

const TITLE = "How to Find a Property Deal Without Paying a Sourcer";
const DESCRIPTION =
  "Sourcing fees are commonly quoted at £3,000–£5,000 a deal. Here is what that fee buys, " +
  "which parts of it you can do yourself with free public data, and the part that is genuinely " +
  "worth paying for.";
const URL = "https://www.propertyvaultuk.co.uk/blog/find-a-deal-without-a-sourcer/";

export const metadata: Metadata = {
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Finding a UK property deal without a sourcer" }],
    authors: ["Nass"],
    publishedTime: "2026-09-06T00:00:00.000Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2026-09-06",
  dateModified: "2026-09-06",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://www.propertyvaultuk.co.uk" },
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  articleSection: "Investing",
  keywords: ["find a deal without a sourcer", "property sourcing fees UK", "BMV property UK", "deal sourcing UK"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
