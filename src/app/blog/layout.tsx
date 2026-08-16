import { ReadingProgress } from "@/components/blog/ReadingProgress";

const authorJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nass",
  url: "https://propertyvaultuk.co.uk/about",
  worksFor: {
    "@type": "Organization",
    name: "PropertyVault UK",
    url: "https://propertyvaultuk.co.uk",
  },
  knowsAbout: [
    "UK property investment",
    "buy-to-let",
    "guaranteed rent",
    "HMO property",
    "landlord compliance",
    "Renters Rights Act 2025",
  ],
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />
      <ReadingProgress />
      {children}
    </>
  );
}
