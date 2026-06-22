"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Article {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  image?: string;
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

export function BlogList({ articles }: { articles: Article[] }) {
  const categories = ["All", ...Array.from(new Set(articles.map(a => a.category)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? articles : articles.filter(a => a.category === active);
  const [featured, ...rest] = filtered;

  return (
    <>
      {/* Category filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: active === cat ? "none" : "1.5px solid #e2e8f0",
              background: active === cat ? "#0f1b36" : "white",
              color: active === cat ? "white" : "#64748b",
              transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#94a3b8", padding: "64px 0" }}>No articles in this category yet.</p>
      )}

      {/* Featured hero card */}
      {featured && (
        <Link href={featured.href} style={{ display: "block", textDecoration: "none", marginBottom: 24 }}
          className="group">
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "21/9", background: "#0f1b36" }}>
            {featured.image && (
              <Image src={featured.image} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 900px"
                style={{ objectFit: "cover", opacity: 0.45, transition: "opacity 0.4s, transform 0.5s" }}
                className="group-hover:opacity-55 group-hover:scale-[1.02]"
              />
            )}
            {/* Grid texture overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            {/* Gradient overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.3) 60%, transparent 100%)" }} />
            {/* Content */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: CATEGORY_COLORS[featured.category] ?? "#0f1b36", color: "white" }}>
                  {featured.category}
                </span>
                {featured.featured && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#c9a84c", color: "#0f1b36" }}>
                    Featured
                  </span>
                )}
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{featured.readTime} read · {featured.date}</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 12, maxWidth: 700 }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 580, marginBottom: 20 }}>{featured.excerpt}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c", display: "inline-flex", alignItems: "center", gap: 6 }}>
                Read article
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {rest.map(post => (
            <Link key={post.href} href={post.href} style={{ display: "block", textDecoration: "none", borderRadius: 18, overflow: "hidden", border: "1.5px solid #e2e8f0", background: "white", transition: "box-shadow 0.2s, transform 0.2s" }}
              className="group hover:shadow-lg hover:-translate-y-1">
              {/* Image */}
              <div style={{ position: "relative", aspectRatio: "16/9", background: "#0f1b36", overflow: "hidden" }}>
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "cover", transition: "transform 0.5s", opacity: 0.9 }}
                    className="group-hover:scale-[1.04]"
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a2845 0%, #0f1b36 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 32, opacity: 0.2 }}>📄</span>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,15,30,0.5) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: CATEGORY_COLORS[post.category] ?? "#0f1b36", color: "white" }}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "18px 20px 20px" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>By Nass · {post.date} · {post.readTime} read</p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", lineHeight: 1.35, marginBottom: 8 }}
                  className="group-hover:text-gold-600 transition-colors">
                  {post.title}
                </h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55, marginBottom: 14 }}>
                  {post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + "…" : post.excerpt}
                </p>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Read more
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    className="group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
