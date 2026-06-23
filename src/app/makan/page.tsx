"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/lang-context";
import { countries, propertyTypes, formatPrice } from "@/lib/hetta-config";
import { SmartSearch } from "@/components/hetta/SmartSearch";


interface Listing {
  id: string;
  title: string;
  property_type: string;
  bedrooms: number;
  price: number;
  city: string;
  area: string;
  available_from: string;
  features: string[];
  images: string[];
  featured?: boolean;
  listing_type?: string;
  country?: string;
  size_sqm?: number;
  video_url?: string;
  highlights?: string[];
}

const CARD_FEATURE_ICONS: Record<string, string> = {
  "Parking": "🅿️", "Garage": "🏗️",
  "Pool": "🏊", "Swimming pool": "🏊",
  "Gym": "🏋️",
  "Garden": "🌿", "Private garden": "🌿",
  "Balcony": "🌤️", "Terrace": "☀️",
  "Sea view": "🌊", "Marina view": "⛵", "City view": "🌆",
  "Furnished": "🛋️", "Part furnished": "🪑",
  "Air conditioning": "❄️", "Chiller free": "❄️", "District cooling": "❄️",
  "En-suite": "🚿", "Bills included": "💡",
  "Pets OK": "🐾", "Pet friendly": "🐾",
  "Concierge": "🎩", "Security": "🔐",
  "Near transport": "🚇", "Near metro": "🚇",
  "Private beach": "🏖️", "Beach access": "🏖️",
  "Students welcome": "🎓", "Professionals only": "💼",
};

// Scroll-reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("revealed"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("revealed"), delay);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className="reveal-card">
      {children}
    </div>
  );
}

export default function MakanPage() {
  const { t } = useLang();
  const [typeFilter, setTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All cities");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [listings, setListings] = useState<Listing[]>([]);
  const [featuredListing, setFeaturedListing] = useState<Listing | null>(null);
  const heroRef = useScrollReveal();

  const selectedCountry = countries.find(c => c.code === countryFilter);
  const cityOptions = countryFilter === "All" ? [] : (selectedCountry?.cities || []);

  useEffect(() => {
    supabase.from("listings").select("*").eq("status", "active").order("created_at", { ascending: false })
      .then(({ data }) => {
        setListings(data || []);
        const withImg = (data || []).find((l: Listing) => l.images?.[0]);
        if (withImg) setFeaturedListing(withImg);
      });
  }, []);

  const filtered = listings.filter(l => {
    if (typeFilter !== "All" && l.property_type !== typeFilter) return false;
    if (countryFilter !== "All" && l.country && l.country !== countryFilter) return false;
    if (cityFilter !== "All cities" && l.city !== cityFilter) return false;
    if (l.listing_type !== "sale" && l.price > maxPrice) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.area.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isAvailableNow = (d: string) => !d || new Date(d) <= new Date();

  return (
    <>
      <style>{`
        .reveal-card {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .reveal-card.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-reveal {
          opacity: 0;
          transform: translateY(16px);
          animation: heroIn 0.8s ease 0.1s forwards;
        }
        .hero-reveal-2 {
          opacity: 0;
          transform: translateY(16px);
          animation: heroIn 0.8s ease 0.3s forwards;
        }
        .hero-reveal-3 {
          opacity: 0;
          transform: translateY(16px);
          animation: heroIn 0.8s ease 0.5s forwards;
        }
        @keyframes heroIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .preview-card-reveal {
          opacity: 0;
          transform: translateX(20px);
          animation: heroIn 0.9s ease 0.7s forwards;
        }
        .type-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--h-border);
          background: var(--h-surface);
          color: var(--h-muted);
          transition: all 0.15s;
        }
        .type-btn:hover { color: var(--h-text); border-color: var(--h-text); }
        .type-btn.active {
          background: var(--h-accent);
          color: white;
          border-color: var(--h-accent);
        }
        .listing-card {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--h-border);
          background: var(--h-surface);
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: pointer;
          display: block;
          text-decoration: none;
        }
        .listing-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          transform: translateY(-2px);
        }
        .listing-card:hover .card-img { transform: scale(1.04); }
        .card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          display: block;
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: "#0b0f14", position: "relative", overflow: "hidden", minHeight: 480 }}>

        {/* Background texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 50%, rgba(232,85,61,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(45,45,55,0.8) 0%, transparent 50%)",
          pointerEvents: "none"
        }} />

        {/* Floating preview card — top right */}
        {featuredListing && (
          <Link href={`/makan/listing/${featuredListing.id}`}
            className="preview-card-reveal"
            style={{
              position: "absolute", top: 32, right: 32,
              width: 200, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14, overflow: "hidden",
              backdropFilter: "blur(8px)",
              textDecoration: "none", display: "block",
              zIndex: 10
            }}>
            {featuredListing.images?.[0] && (
              <img src={featuredListing.images[0]} alt=""
                style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <div style={{ padding: "10px 12px" }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
                {featuredListing.area}, {featuredListing.city}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.3, marginBottom: 6 }}>
                {featuredListing.title.split(",")[0]}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e8553d" }}>
                  {formatPrice(featuredListing.price, featuredListing.country || "gb")}
                  {featuredListing.listing_type !== "sale" && <span style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/mo</span>}
                </span>
                {featuredListing.size_sqm && (
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{featuredListing.size_sqm} m²</span>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Hero content */}
        <div className="h-container" style={{ paddingTop: 56, paddingBottom: 52, position: "relative", zIndex: 2 }}>

          {/* Eyebrow */}
          <div className="hero-reveal" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8553d" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {countries.slice(0, 5).map(c => c.flag).join("  ")} &nbsp;+{countries.length - 5} more
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-reveal-2" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            maxWidth: 600
          }}>
            Find your<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.38)" }}>place.</em>
          </h1>

          {/* Search */}
          <div className="hero-reveal-3" style={{ maxWidth: 520, marginBottom: 48 }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "white", borderRadius: 12,
              overflow: "hidden", height: 50
            }}>
              <div style={{ padding: "0 14px", color: "#aaa", flexShrink: 0 }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <SmartSearch
                value={search}
                onChange={setSearch}
                onSelectCity={(city, code) => { setSearch(city); setCountryFilter(code); setCityFilter(city); }}
                placeholder="Search city, area, or keyword..."
              />
              <button
                className="h-btn h-btn-primary"
                style={{ borderRadius: "0 12px 12px 0", height: 50, padding: "0 24px", flexShrink: 0 }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-reveal-3" style={{ display: "flex", gap: 32 }}>
            {[
              { num: `${listings.length}+`, label: "listings live" },
              { num: `${countries.length}`, label: "countries" },
              { num: "£0", label: "agent fees" },
              { num: "Free", label: "forever" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTRAST STRIP — diaspora mode ───────────────── */}
      <section style={{ background: "var(--h-surface)", borderBottom: "1px solid var(--h-border)" }}>
        <div className="h-container" style={{ padding: "0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {/* Left: browsing from */}
            <div style={{ padding: "14px 20px", borderRight: "1px solid var(--h-border)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>
                {countries.find(c => c.code === "gb")?.flag ?? "🌍"}
              </span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "var(--h-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Browsing from</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--h-text)" }}>United Kingdom</p>
              </div>
            </div>
            {/* Right: show me properties in */}
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--h-muted)", flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
              </svg>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "var(--h-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Showing properties in</p>
                <select
                  value={countryFilter}
                  onChange={e => { setCountryFilter(e.target.value); setCityFilter("All cities"); }}
                  style={{
                    fontSize: 13, fontWeight: 600, color: "var(--h-text)",
                    background: "transparent", border: "none", outline: "none", cursor: "pointer", padding: 0
                  }}
                >
                  <option value="All">All countries</option>
                  {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
              </div>
              {countryFilter !== "All" && (
                <select
                  value={cityFilter}
                  onChange={e => setCityFilter(e.target.value)}
                  style={{
                    fontSize: 12, color: "var(--h-muted)",
                    background: "var(--h-warm)", border: "none", outline: "none", cursor: "pointer",
                    padding: "4px 8px", borderRadius: 8
                  }}
                >
                  <option value="All cities">All cities</option>
                  {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Country context panel ─────────────────────────── */}
      {countryFilter !== "All" && (() => {
        const c = countries.find(x => x.code === countryFilter);
        if (!c) return null;
        const cityStory = cityFilter !== "All cities" ? c.cityStories?.[cityFilter] : null;
        return (
          <section style={{ background: "var(--h-accent-light)", borderBottom: "1px solid var(--h-border)" }}>
            <div className="h-container" style={{ paddingTop: 16, paddingBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 28 }}>{c.flag}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: "var(--h-text)" }}>{cityFilter !== "All cities" ? cityFilter : c.name}</p>
                      <p style={{ fontSize: 12, color: "var(--h-accent)" }}>{c.avgRent} · {c.language} · {c.foreignBuy}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--h-text)", opacity: 0.8 }}>
                    {cityStory || c.hero}
                  </p>
                </div>
                <Link href={`/makan/country/${c.code}`}
                  style={{ flexShrink: 0, fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 10, background: "var(--h-accent)", color: "white", textDecoration: "none", alignSelf: "flex-start" }}>
                  {c.name} guide →
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── FILTERS + LISTINGS ───────────────────────────── */}
      <section style={{ background: "var(--h-bg)", paddingBottom: 48 }}>
        <div className="h-container">

          {/* Type chips + price filter */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, padding: "20px 0 16px" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
              {["All", "Room", "Studio", "Flat", "House", "Villa", "Penthouse"].map(tp => (
                <button key={tp} onClick={() => setTypeFilter(tp)}
                  className={`type-btn ${typeFilter === tp ? "active" : ""}`}>
                  {tp}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
              <label style={{ fontSize: 12, color: "var(--h-muted)", whiteSpace: "nowrap" }}>
                Max: <strong style={{ color: "var(--h-text)" }}>{maxPrice >= 5000 ? "Any" : maxPrice}</strong>
              </label>
              <input type="range" min={100} max={5000} step={50} value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                style={{ width: 100, accentColor: "var(--h-accent)" }} />
              <span style={{ fontSize: 13, color: "var(--h-subtle)", whiteSpace: "nowrap" }}>
                {filtered.length} results
              </span>
            </div>
          </div>

          {/* Listings grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 18
          }}>
            {filtered.map((l, idx) => (
              <RevealCard key={l.id} delay={(idx % 4) * 60}>
                <Link href={`/makan/listing/${l.id}`} className="listing-card">

                  {/* Photo */}
                  <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: l.property_type === "Room" ? "#f0e6da" : l.property_type === "Flat" ? "#dae3f0" : l.property_type === "House" ? "#daf0de" : l.property_type === "Villa" ? "#f0dae8" : "#e8e5e1" }}>
                    {l.images?.[0] ? (
                      <img src={l.images[0]} alt={l.title} className="card-img" />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="28" height="28" style={{ color: "var(--h-accent)" }} viewBox="0 0 24 24" fill="currentColor">
                            {(l.property_type === "House" || l.property_type === "Villa")
                              ? <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                              : <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
                            }
                          </svg>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--h-muted)" }}>{l.property_type}</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
                      {l.featured && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "var(--h-accent)", color: "white" }}>Featured</span>}
                      {l.listing_type === "sale" && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "var(--h-accent)", color: "white" }}>For Sale</span>}
                      {l.video_url && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(0,0,0,0.65)", color: "white" }}>🎬</span>}
                    </div>

                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "rgba(255,255,255,0.92)", color: "#333" }}>{l.property_type}</span>
                    </div>

                    {isAvailableNow(l.available_from) && l.listing_type !== "sale" && (
                      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "var(--h-green)", color: "white" }}>Available now</span>
                      </div>
                    )}

                    {l.size_sqm && (
                      <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "rgba(0,0,0,0.55)", color: "white" }}>{l.size_sqm} m²</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "12px 14px 14px" }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, marginBottom: 4, color: "var(--h-text)" }}
                      className="group-hover:text-[var(--h-accent)]">
                      {l.title}
                    </h3>
                    <p style={{ fontSize: 11, color: "var(--h-muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                      {l.area}, {l.city}
                    </p>

                    {/* Feature icons */}
                    {(l.features || []).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                        {(l.features || []).slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 8, background: "var(--h-warm)", color: "var(--h-muted)", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            {CARD_FEATURE_ICONS[tag] && <span>{CARD_FEATURE_ICONS[tag]}</span>}
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price + beds */}
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--h-border)" }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--h-text)" }}>
                          {formatPrice(l.price, l.country || "gb")}
                        </span>
                        {l.listing_type !== "sale" && (
                          <span style={{ fontSize: 12, color: "var(--h-subtle)" }}>/mo</span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: "var(--h-muted)" }}>
                        {l.bedrooms === 0 ? "Studio" : `${l.bedrooms} bed${l.bedrooms > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealCard>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--h-text)", marginBottom: 8 }}>No listings match</p>
              <p style={{ fontSize: 14, color: "var(--h-muted)" }}>Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)", paddingTop: 64, paddingBottom: 64 }}>
        <div className="h-container">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, textAlign: "center", marginBottom: 8, color: "var(--h-text)" }}>
            How Makan works
          </h2>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--h-muted)", marginBottom: 48 }}>
            Verified users · reviewed listings · legal in all {countries.length} countries
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, maxWidth: 760, margin: "0 auto" }}>
            {[
              { emoji: "🔍", title: "Browse free", desc: "Filter by type, country, city, or budget. No account needed." },
              { emoji: "✅", title: "Sign up & verify", desc: "Create a free account to contact landlords directly." },
              { emoji: "💬", title: "Message direct", desc: "WhatsApp or in-app enquiry — no agents, no middlemen." },
              { emoji: "🏠", title: "Move in", desc: "Agree terms, sign your contract, move in. Zero fees ever." },
            ].map(s => (
              <div key={s.title} style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: "var(--h-accent-light)" }}>
                  {s.emoji}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: 15, color: "var(--h-text)" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--h-muted)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE BY COUNTRY ───────────────────────────── */}
      <section style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)", paddingTop: 40, paddingBottom: 48 }}>
        <div className="h-container">
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, marginBottom: 20, color: "var(--h-text)" }}>
            Explore by country
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
            {countries.map(c => (
              <Link key={c.code} href={`/makan/country/${c.code}`}
                style={{ textAlign: "center", padding: "18px 8px", borderRadius: 14, border: "1px solid var(--h-border)", background: "var(--h-bg)", textDecoration: "none", transition: "border-color 0.15s" }}>
                <span style={{ fontSize: 26, display: "block", marginBottom: 6 }}>{c.flag}</span>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--h-text)" }}>{c.name}</p>
                <p style={{ fontSize: 11, color: "var(--h-subtle)", marginTop: 2 }}>{c.cities.length} cities</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section style={{ background: "#0b0f14", padding: "56px 0" }}>
        <div className="h-container" style={{ textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 700, color: "white", marginBottom: 12
          }}>
            Got a property?<br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>List it free.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 28, fontSize: 14, maxWidth: 360, margin: "0 auto 28px" }}>
            Reach tenants directly. No agent fees. No commission. No catch.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/makan/list" className="h-btn h-btn-primary" style={{ textAlign: "center" }}>
              List your property
            </Link>
            <Link href="/makan/wanted" className="h-btn" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white", textAlign: "center" }}>
              Post what you need
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
