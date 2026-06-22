"use client";

import Link from "next/link";
import { useState } from "react";

interface Article {
  title: string;
  excerpt: string;
  href: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
}

export function BlogList({ articles }: { articles: Article[] }) {
  const categories = ["All", ...Array.from(new Set(articles.map(a => a.category)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? articles : articles.filter(a => a.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${active === cat ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-500 hover:bg-navy-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filtered.map((post) => (
          <Link key={post.href} href={post.href}
            className={`group block rounded-2xl p-6 card-hover ${post.featured ? "bg-gradient-to-br from-navy-800 to-navy-900 text-white border-2 border-gold-400/30" : "bg-white border border-navy-100/80"}`}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {post.featured && <span className="px-3 py-1 bg-gold-400 text-navy-900 text-xs font-bold rounded-full">Featured</span>}
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${post.featured ? "bg-white/20 text-white" : "bg-navy-50 text-navy-600"}`}>{post.category}</span>
              <span className={`text-xs ${post.featured ? "text-navy-300" : "text-navy-400"}`}>{post.readTime} read</span>
              <span className={`text-xs ${post.featured ? "text-navy-300" : "text-navy-400"}`}>By Nass · {post.date}</span>
            </div>
            <h2 className={`text-lg font-bold mb-2 transition-colors ${post.featured ? "text-white group-hover:text-gold-400 text-xl md:text-2xl" : "text-navy-800 group-hover:text-gold-600"}`} style={post.featured ? { fontFamily: "var(--font-family-heading)" } : undefined}>{post.title}</h2>
            <p className={`text-sm leading-relaxed ${post.featured ? "text-navy-200" : "text-navy-500"}`}>{post.excerpt}</p>
            <span className={`inline-flex items-center gap-1 mt-3 text-sm font-semibold ${post.featured ? "text-gold-400" : "text-gold-600"}`}>
              Read article <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-navy-400 py-10">No articles in this category yet.</p>
        )}
      </div>
    </>
  );
}
