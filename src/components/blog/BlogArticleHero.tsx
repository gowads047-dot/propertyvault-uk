import Link from "next/link";
import Image from "next/image";
import { ShareButtons } from "@/components/makan/ShareButtons";

interface Props {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

const MONTHS: Record<string, string> = {
  January: "01", February: "02", March: "03", April: "04", May: "05", June: "06",
  July: "07", August: "08", September: "09", October: "10", November: "11", December: "12",
};

function toISODate(d: string): string {
  const full = d.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
  if (full) return `${full[3]}-${MONTHS[full[2]] ?? "01"}-${full[1].padStart(2, "0")}`;
  const my = d.match(/^(\w+)\s+(\d{4})$/);
  if (my) return `${my[2]}-${MONTHS[my[1]] ?? "01"}-01`;
  return d;
}

const CATEGORY_COLORS: Record<string, string> = {
  Market:     "#1d4ed8",
  Opinion:    "#7c3aed",
  Investing:  "#0f1b36",
  Landlords:  "#c9a84c",
  Tax:        "#dc2626",
  Finance:    "#059669",
  Buying:     "#0891b2",
  Comparison: "#64748b",
};

export function BlogArticleHero({ title, excerpt, category, date, readTime, image }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: image,
    author: { "@type": "Person", name: "Nass", url: "https://www.propertyvaultuk.co.uk/about" },
    publisher: {
      "@type": "Organization",
      name: "PropertyVault UK",
      logo: { "@type": "ImageObject", url: "https://www.propertyvaultuk.co.uk/favicon.ico" },
    },
    datePublished: toISODate(date),
    dateModified: toISODate(date),
    inLanguage: "en-GB",
    articleSection: category,
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.propertyvaultuk.co.uk/blog" },
  };

  return (
    <section style={{ position: "relative", background: "#0a0f1e", overflow: "hidden", minHeight: 420 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Hero image */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", opacity: 0.35 }}
      />
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,15,30,0.98) 0%, rgba(10,15,30,0.5) 60%, rgba(10,15,30,0.2) 100%)" }} />
      {/* Grid texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div className="container-max px-4" style={{ position: "relative", zIndex: 2, paddingTop: 56, paddingBottom: 60 }}>
        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 24 }}
          className="hover:text-white transition-colors">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          All articles
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: CATEGORY_COLORS[category] ?? "#0f1b36", color: "white" }}>
            {category}
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>By Nass · {date} · {readTime} read</span>
        </div>

        <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16, maxWidth: 760 }}>
          {title}
        </h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: 600, marginBottom: 24 }}>
          {excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Share</span>
          <ShareButtons title={title} />
        </div>
      </div>
    </section>
  );
}
