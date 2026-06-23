"use client";

import { useState } from "react";
import Link from "next/link";

const TEMPLATES = [
  {
    id: "tenant-application",
    title: "Tenant Application Form",
    desc: "Professional application form collecting personal details, employment, rental history, references, and Right to Rent confirmation.",
    category: "landlord",
    time: "5 min",
    pages: "2 pages",
    badge: "Most popular",
    icon: "👤",
  },
  {
    id: "viewing-checklist",
    title: "Property Viewing Checklist",
    desc: "A 50-point structured checklist for evaluating any property. Covers interior, exterior, structure, location, and investment metrics.",
    category: "buyer",
    time: "At viewing",
    pages: "2 pages",
    badge: "",
    icon: "🔍",
  },
  {
    id: "landlord-compliance",
    title: "Landlord Compliance Checklist",
    desc: "Every legal obligation for landlords in England — gas safety, EICR, EPC, deposit protection, Right to Rent, smoke alarms, and more.",
    category: "landlord",
    time: "10 min",
    pages: "3 pages",
    badge: "Essential",
    icon: "✅",
  },
  {
    id: "inventory-checklist",
    title: "Property Inventory",
    desc: "Room-by-room inventory template with condition ratings, meter readings, key log, and photo prompts. Essential for deposit protection.",
    category: "landlord",
    time: "15 min",
    pages: "4 pages",
    badge: "",
    icon: "📋",
  },
  {
    id: "checkout-report",
    title: "Check-Out Inspection Report",
    desc: "End-of-tenancy condition report comparing check-in vs check-out. Includes deposit deduction schedule and signature blocks.",
    category: "landlord",
    time: "10 min",
    pages: "3 pages",
    badge: "",
    icon: "🔑",
  },
  {
    id: "offer-worksheet",
    title: "Offer Preparation Worksheet",
    desc: "Comparable research, negotiation points, and a professional offer letter template. Know your numbers before you negotiate.",
    category: "buyer",
    time: "8 min",
    pages: "2 pages",
    badge: "",
    icon: "📝",
  },
  {
    id: "sale-prep-checklist",
    title: "Home Sale Preparation",
    desc: "Everything to do before listing — repairs, decluttering, EPC, staging, photography, and documentation checklist.",
    category: "seller",
    time: "10 min",
    pages: "2 pages",
    badge: "",
    icon: "🏡",
  },
  {
    id: "inspection-record",
    title: "Mid-Tenancy Inspection Record",
    desc: "Structured form for periodic property inspections. Records condition, maintenance issues, and tenant compliance room by room.",
    category: "landlord",
    time: "8 min",
    pages: "2 pages",
    badge: "",
    icon: "🔎",
  },
  {
    id: "renters-rights-notice",
    title: "Tenant Rights Notice",
    desc: "Formal notice to issue to tenants explaining their rights under the Renters' Rights Act 2025 — security of tenure, rent increases, repairs, pets, and the PRS Ombudsman.",
    category: "landlord",
    time: "3 min",
    pages: "2 pages",
    badge: "New law",
    icon: "⚖️",
  },
  {
    id: "due-diligence",
    title: "Commercial Due Diligence",
    desc: "Comprehensive checklist for investigating a commercial property before purchase — title, planning, environmental, and compliance.",
    category: "commercial",
    time: "20 min",
    pages: "4 pages",
    badge: "",
    icon: "🏢",
  },
];

const CATEGORY_FILTERS = [
  { id: "all",        label: "All Templates" },
  { id: "landlord",  label: "Landlords" },
  { id: "buyer",     label: "Home Buyers" },
  { id: "seller",    label: "Home Sellers" },
  { id: "commercial",label: "Commercial" },
];

const CAT_COLORS: Record<string, { dot: string; label: string }> = {
  landlord:   { dot: "#c9a84c", label: "Landlord" },
  buyer:      { dot: "#1d4ed8", label: "Home Buyer" },
  seller:     { dot: "#16a34a", label: "Seller" },
  commercial: { dot: "#7c3aed", label: "Commercial" },
};

// Templates with full interactive forms
const INTERACTIVE = new Set(["tenant-application", "viewing-checklist", "landlord-compliance", "inventory-checklist", "checkout-report", "inspection-record", "offer-worksheet", "renters-rights-notice"]);

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter(t => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0f1b36", position: "relative", overflow: "hidden", padding: "72px 0 60px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div className="container-max px-4" style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            {TEMPLATES.length} Free Templates · England & Wales
          </p>
          <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Property<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>Templates.</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 520, lineHeight: 1.65, marginBottom: 32 }}>
            Fill in a simple form. Get a print-ready professional document — tenancy applications, compliance checklists, inspection records, and more.
          </p>
          {/* Stats row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 40px" }}>
            {[
              { label: "Templates", value: TEMPLATES.length.toString() },
              { label: "Interactive forms", value: "3" },
              { label: "Print-ready PDF", value: "All" },
              { label: "Always free", value: "✓" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Search + Grid */}
      <section style={{ background: "#f8f9fc", padding: "48px 0 80px" }}>
        <div className="container-max px-4" style={{ maxWidth: 1100 }}>

          {/* Search + Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32, alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
                style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14, outline: "none", background: "white", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATEGORY_FILTERS.map(f => (
                <button key={f.id} onClick={() => setActiveCategory(f.id)}
                  style={{ padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: activeCategory === f.id ? "none" : "1.5px solid #e2e8f0", background: activeCategory === f.id ? "#0f1b36" : "white", color: activeCategory === f.id ? "white" : "#64748b", transition: "all 0.15s" }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>{filtered.length} template{filtered.length !== 1 ? "s" : ""}</p>

          {/* Template grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {filtered.map(t => {
              const cat = CAT_COLORS[t.category];
              const isInteractive = INTERACTIVE.has(t.id);
              return (
                <div key={t.id} style={{ background: "white", borderRadius: 18, border: "1.5px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s, transform 0.2s" }}
                  className="hover:shadow-lg hover:-translate-y-0.5">
                  {/* Top bar */}
                  <div style={{ padding: "20px 20px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{t.icon}</span>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.dot, display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>{cat.label}</span>
                            {t.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#fef3c7", color: "#92400e" }}>{t.badge}</span>}
                          </div>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", lineHeight: 1.3 }}>{t.title}</h3>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55, marginBottom: 14 }}>{t.desc}</p>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>⏱ {t.time}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>📄 {t.pages}</span>
                      {isInteractive && <span style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c" }}>✦ Interactive</span>}
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", marginTop: "auto", display: "flex", gap: 10, alignItems: "center" }}>
                    {isInteractive ? (
                      <Link href={`/templates/${t.id}`}
                        style={{ flex: 1, padding: "10px 0", background: "#0f1b36", color: "white", borderRadius: 10, fontSize: 13, fontWeight: 700, textAlign: "center", textDecoration: "none", display: "block", transition: "background 0.15s" }}
                        className="hover:bg-navy-700">
                        Fill in & Download →
                      </Link>
                    ) : (
                      <span style={{ flex: 1, padding: "10px 0", background: "#f1f5f9", color: "#94a3b8", borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: "center", display: "block", cursor: "default" }}>
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>No templates match your search.</div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "white", padding: "64px 0" }}>
        <div className="container-max px-4" style={{ maxWidth: 800 }}>
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 28, fontWeight: 800, color: "#0f1b36", textAlign: "center", marginBottom: 40 }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { step: "01", title: "Choose a template", desc: "Browse by category and pick the document you need." },
              { step: "02", title: "Fill in the form", desc: "Simple, step-by-step inputs. No legal jargon, no confusing fields." },
              { step: "03", title: "Preview the document", desc: "See the professional formatted output update in real time." },
              { step: "04", title: "Print or save as PDF", desc: "One click. Print to PDF from your browser — no account needed." },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#c9a84c", letterSpacing: "0.08em", marginBottom: 8 }}>{s.step}</p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
