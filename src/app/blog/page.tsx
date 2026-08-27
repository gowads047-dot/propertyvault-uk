import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogList";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Property Investment Blog | PropertyVault UK",
  description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, leasehold, rent-to-rent, deal sourcing, and more.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/" },
  openGraph: {
    title: "Property Investment Blog | PropertyVault UK",
    description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, leasehold, rent-to-rent, deal sourcing, and more.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/blog/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Property Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investment Blog | PropertyVault UK",
    description: "Expert property investment articles. BRRR strategy, guaranteed rent, Section 24, HMO investing, stamp duty, leasehold, rent-to-rent, deal sourcing, and more.",
  },
};

const articles = blogPosts;

export default function BlogPage() {
  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0f1b36", position: "relative", overflow: "hidden", padding: "64px 0 56px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        {/* Radial glow */}
        <div style={{ position: "absolute", top: "-30%", left: "60%", width: 600, height: 600, background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container-max px-4" style={{ position: "relative", zIndex: 1 }}>
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", display: "inline-block" }} />
                  PropertyVault Blog
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "white", lineHeight: 1.06, letterSpacing: "-0.025em", marginBottom: 16 }}>
                UK property investing<br />
                <span style={{ color: "var(--gold-ink)" }}>guides that pay off.</span>
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.62)", maxWidth: 440, lineHeight: 1.7 }}>
                Expert guides on UK property investing, tax, landlord law, and deal sourcing. Every article links to our free tools and calculators.
              </p>
            </div>
            {/* Stats strip */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { value: `${articles.length}`, label: "Articles" },
                { value: `${categories.length}`, label: "Topics" },
                { value: "Free", label: "Always" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section style={{ background: "#f8fafc", padding: "48px 0 80px" }}>
        <div className="container-max px-4" style={{ maxWidth: 1100 }}>
          <BlogList articles={articles} />
        </div>
      </section>
    </>
  );
}
