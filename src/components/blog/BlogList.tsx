"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Article {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  image?: string;
  views?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Market:     { bg: "#dbeafe", text: "#1d4ed8" },
  Opinion:    { bg: "#ede9fe", text: "#6d28d9" },
  Investing:  { bg: "#e0f2fe", text: "#0369a1" },
  Landlords:  { bg: "#fef9c3", text: "#92400e" },
  Tax:        { bg: "#fee2e2", text: "#b91c1c" },
  Finance:    { bg: "#d1fae5", text: "#065f46" },
  Buying:     { bg: "#e0f2fe", text: "#0e7490" },
  Comparison: { bg: "#f1f5f9", text: "#475569" },
  Academy:    { bg: "#e0e7ff", text: "#3730a3" },
};


function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: email.split("@")[0], email, user_type: "blog" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f1b36 0%, #1a2f5e 100%)",
      borderRadius: 20,
      padding: "36px 32px",
      margin: "48px 0",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>✉️</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em" }}>Free weekly insights</span>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 8, lineHeight: 1.2 }}>
          Get the best property articles<br />straight to your inbox
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
          No spam. One email per week. Unsubscribe anytime.
        </p>
        {sent ? (
          <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 12, padding: "14px 20px", color: "#c9a84c", fontSize: 14, fontWeight: 600 }}>
            ✓ Thanks! We&apos;ll be in touch shortly.
          </div>
        ) : (
          <>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              style={{
                flex: 1,
                minWidth: 200,
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.07)",
                color: "white",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button type="submit" disabled={loading} style={{
              background: "#c9a84c",
              color: "#0f1b36",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Subscribing…" : "Subscribe →"}
            </button>
          </form>
          {error && <p style={{ fontSize: 12, color: "#fca5a5", marginTop: 8 }}>{error}</p>}
          </>
        )}
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>
          For landlords, investors and deal sourcers. Unsubscribe any time.
        </p>
      </div>
    </div>
  );
}

function FeaturedCard({ article, onCategoryClick }: { article: Article; onCategoryClick: (c: string) => void }) {
  return (
    <Link href={article.href} style={{ display: "block", textDecoration: "none", marginBottom: 32 }} className="group">
      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#0f1b36" }}>
        <div style={{ position: "relative", aspectRatio: "21/9" }}>
          {article.image && (
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1100px"
              style={{ objectFit: "cover", opacity: 0.4, transition: "opacity 0.5s, transform 0.6s" }}
              className="group-hover:opacity-50 group-hover:scale-[1.02]"
            />
          )}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,12,25,0.98) 0%, rgba(8,12,25,0.55) 50%, rgba(8,12,25,0.15) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, padding: "clamp(20px,4vw,40px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <button
                onClick={e => { e.preventDefault(); onCategoryClick(article.category); }}
                style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: CATEGORY_COLORS[article.category]?.bg ?? "#f1f5f9", color: CATEGORY_COLORS[article.category]?.text ?? "#475569", border: "none", cursor: "pointer" }}
              >
                {article.category}
              </button>
              {article.featured && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "#c9a84c", color: "#0f1b36" }}>
                  ★ Featured
                </span>
              )}
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{article.readTime} read · {article.date}</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(20px, 3.5vw, 36px)", fontWeight: 800, color: "white", lineHeight: 1.12, marginBottom: 12, maxWidth: 720, letterSpacing: "-0.02em" }}>
              {article.title}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
              {article.excerpt}
            </p>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Read article
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post, onCategoryClick }: { post: Article; onCategoryClick: (c: string) => void }) {
  return (
    <Link
      href={post.href}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", borderRadius: 20, overflow: "hidden", border: "1.5px solid #f0f2f7", background: "white", transition: "box-shadow 0.25s, transform 0.25s" }}
      className="group hover:shadow-xl hover:-translate-y-1"
    >
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#0f1b36", overflow: "hidden", flexShrink: 0 }}>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            style={{ objectFit: "cover", opacity: 0.88, transition: "transform 0.5s, opacity 0.3s" }}
            className="group-hover:scale-[1.05] group-hover:opacity-100"
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a2845 0%, #0f1b36 100%)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,15,30,0.4) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <button
            onClick={e => { e.preventDefault(); onCategoryClick(post.category); }}
            style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: CATEGORY_COLORS[post.category]?.bg ?? "#f1f5f9", color: CATEGORY_COLORS[post.category]?.text ?? "#475569", border: "none", cursor: "pointer" }}
          >
            {post.category}
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 10, right: 12, fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, background: "rgba(0,0,0,0.35)", padding: "2px 8px", borderRadius: 20, backdropFilter: "blur(4px)" }}>
          {post.readTime}
        </div>
      </div>

      <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 500 }}>
          {post.date}
        </p>
        <h3
          style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", lineHeight: 1.4, marginBottom: 8, flex: 1 }}
          className="group-hover:text-blue-700 transition-colors"
        >
          {post.title}
        </h3>
        <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
          {post.excerpt.length > 90 ? post.excerpt.slice(0, 90) + "…" : post.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>By Nass</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", display: "inline-flex", alignItems: "center", gap: 4 }}>
            Read
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function ToolsCTABanner() {
  return (
    <div style={{ background: "#f8faff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: "28px 28px", margin: "16px 0 32px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Free tools</p>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f1b36", marginBottom: 6, lineHeight: 1.3 }}>Put the numbers behind the strategy</h3>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18, lineHeight: 1.55 }}>Every article links to a free calculator. Run the numbers on your next deal.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          { label: "Deal Analyser", href: "/calculators/deal-analyser" },
          { label: "BRRR Calculator", href: "/calculators/brrr" },
          { label: "Rental Yield", href: "/calculators/rental-yield" },
          { label: "Section 24", href: "/calculators/section-24" },
          { label: "Stamp Duty", href: "/calculators/stamp-duty" },
        ].map(t => (
          <a key={t.href} href={t.href} style={{ fontSize: 12, fontWeight: 600, color: "#0f1b36", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "6px 14px", textDecoration: "none", transition: "border-color 0.15s" }}
            className="hover:border-navy-400">
            {t.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

export function BlogList({ articles }: { articles: Article[] }) {
  const categories = ["All", ...Array.from(new Set(articles.map(a => a.category)))];
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = articles.filter(a => {
    const matchCat = active === "All" || a.category === active;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const [featured, ...rest] = filtered;

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Search + filter bar */}
      <div style={{ marginBottom: 36 }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search articles… (press "/" to focus)'
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: 14,
              border: "1.5px solid #e2e8f0",
              background: "white",
              fontSize: 14,
              color: "#0f1b36",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "#c9a84c")}
            onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16, lineHeight: 1 }}>✕</button>
          )}
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
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
          {active !== "All" && (
            <button onClick={() => { setActive("All"); setSearch(""); }} style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: "#fee2e2", color: "#b91c1c" }}>
              Clear ✕
            </button>
          )}
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
          <p style={{ fontWeight: 700, color: "#0f1b36", marginBottom: 6 }}>No articles found</p>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>Try a different search or category.</p>
          <button onClick={() => { setSearch(""); setActive("All"); }} style={{ marginTop: 16, background: "#0f1b36", color: "white", border: "none", borderRadius: 12, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Show all articles
          </button>
        </div>
      )}

      {/* Featured */}
      {featured && !search && active === "All" && (
        <FeaturedCard article={featured} onCategoryClick={setActive} />
      )}

      {/* When filtering/searching, show results in grid without featured */}
      {(search || active !== "All") && filtered.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}{active !== "All" ? ` in ${active}` : ""}{search ? ` matching "${search}"` : ""}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filtered.map(post => (
              <ArticleCard key={post.href} post={post} onCategoryClick={setActive} />
            ))}
          </div>
        </div>
      )}

      {/* Normal grid (non-search, non-filter) */}
      {!search && active === "All" && rest.length > 0 && (
        <>
          {/* Tools CTA — above the grid */}
          <ToolsCTABanner />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
            {rest.slice(0, 5).map(post => (
              <ArticleCard key={post.href} post={post} onCategoryClick={setActive} />
            ))}
          </div>

          {/* Newsletter mid-grid */}
          <NewsletterBlock />

          {rest.length > 5 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {rest.slice(5).map(post => (
                <ArticleCard key={post.href} post={post} onCategoryClick={setActive} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Academy CTA at bottom */}
      <div style={{ marginTop: 56, background: "linear-gradient(135deg, #0f1b36 0%, #1a2f5e 100%)", borderRadius: 24, padding: "40px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Deal Sourcing Academy</p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: "white", marginBottom: 10, lineHeight: 1.2 }}>
            Ready to go beyond reading?
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
            The Academy gives you the playbooks, scripts, tools and step-by-step training to actually source deals — not just understand them.
          </p>
          <a href="/academy" style={{ display: "inline-block", background: "#c9a84c", color: "#0f1b36", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 14, textDecoration: "none" }}>
            Join the Academy — £14.99/month →
          </a>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>Educational platform · Not financial advice · Cancel anytime</p>
        </div>
      </div>
    </>
  );
}
