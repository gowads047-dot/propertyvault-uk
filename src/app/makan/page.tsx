"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/lang-context";
import { countries, propertyTypes, formatPrice } from "@/lib/hetta-config";

const sampleListings = [
  { id: "sample-1", title: "Modern 2-bed apartment, Jewellery Quarter", property_type: "Flat", bedrooms: 2, price: 950, city: "Birmingham", area: "Jewellery Quarter", available_from: "2026-06-01", features: ["Furnished", "Parking"], featured: true, images: [] },
  { id: "sample-2", title: "Spacious double room in shared house", property_type: "Room", bedrooms: 1, price: 450, city: "Nottingham", area: "Lenton", available_from: "2026-07-01", features: ["Bills included", "Students"], images: [] },
  { id: "sample-3", title: "Renovated 3-bed terraced house", property_type: "House", bedrooms: 3, price: 850, city: "Derby", area: "Normanton", available_from: "2026-06-01", features: ["Garden", "Pets OK"], images: [] },
  { id: "sample-4", title: "Studio flat near city centre", property_type: "Flat", bedrooms: 0, price: 595, city: "Birmingham", area: "Digbeth", available_from: "2026-07-15", features: ["Furnished", "Bills included"], images: [] },
  { id: "sample-5", title: "Large double room, professional house share", property_type: "Room", bedrooms: 1, price: 500, city: "Nottingham", area: "West Bridgford", available_from: "2026-06-01", features: ["Professionals", "En-suite"], images: [] },
  { id: "sample-6", title: "4-bed semi-detached, family home", property_type: "House", bedrooms: 4, price: 1200, city: "Birmingham", area: "Edgbaston", available_from: "2026-08-01", features: ["Garden", "Garage", "Unfurnished"], images: [] },
];

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
}

const typeFilters = ["All", ...propertyTypes];

export default function MakanPage() {
  const { t } = useLang();
  const [typeFilter, setTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All cities");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [listings, setListings] = useState<Listing[]>(sampleListings);

  const selectedCountry = countries.find(c => c.code === countryFilter);
  const cityOptions = countryFilter === "All" ? [] : (selectedCountry?.cities || []);

  useEffect(() => {
    supabase.from("listings").select("*").eq("status", "active").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setListings(data);
      });
  }, []);

  const filtered = listings.filter(l => {
    if (typeFilter !== "All" && l.property_type !== typeFilter) return false;
    if (cityFilter !== "All cities" && l.city !== cityFilter) return false;
    if (l.price > maxPrice) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.area.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isAvailableNow = (d: string) => !d || new Date(d) <= new Date();

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--h-surface)" }} className="py-12 md:py-20">
        <div className="h-container text-center">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            {countries.slice(0, 5).map(c => <span key={c.code} className="text-lg">{c.flag}</span>)}
            <span className="text-sm font-medium" style={{ color: "var(--h-subtle)" }}>+{countries.length - 5} more</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--h-text)", lineHeight: 1.05 }}>
            {t("hero.title")}
          </h1>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "var(--h-muted)" }}>
            {t("hero.subtitle")}
          </p>

          {/* Diaspora Mode */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 flex-wrap py-3 px-5 rounded-xl" style={{ background: "var(--h-warm)" }}>
              <span className="text-sm" style={{ color: "var(--h-muted)" }}>I&apos;m in</span>
              <select
                value={countryFilter === "All" ? "gb" : ""}
                onChange={e => { setCountryFilter("All"); }}
                className="text-sm font-semibold py-1 px-2 rounded-lg border-0"
                style={{ background: "var(--h-surface)", color: "var(--h-text)" }}
              >
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
              <span className="text-sm" style={{ color: "var(--h-muted)" }}>show me properties in</span>
              <select
                value={countryFilter}
                onChange={e => { setCountryFilter(e.target.value); setCityFilter("All cities"); }}
                className="text-sm font-semibold py-1 px-2 rounded-lg border-0"
                style={{ background: "var(--h-surface)", color: "var(--h-text)" }}
              >
                <option value="All">All countries</option>
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 rounded-2xl" style={{ background: "var(--h-surface)", border: "2px solid var(--h-border)" }}>
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--h-subtle)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={t("hero.search")}
                  className="h-input !border-0 !pl-12 !shadow-none !ring-0"
                  style={{ background: "transparent" }}
                />
              </div>
              <button className="h-btn h-btn-primary !rounded-xl hidden sm:flex">{t("hero.cta")}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y" style={{ borderColor: "var(--h-border)", background: "var(--h-warm)" }}>
        <div className="h-container py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: "var(--h-muted)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--h-green)" }} />
              <span><strong style={{ color: "var(--h-text)" }}>{listings.length}</strong> {t("stats.listings")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong style={{ color: "var(--h-text)" }}>{countries.length}</strong> {t("stats.countries")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong style={{ color: "var(--h-text)" }}>{t("stats.free")}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong style={{ color: "var(--h-text)" }}>{t("stats.noFees")}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="py-10" style={{ background: "var(--h-bg)" }}>
        <div className="h-container">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Room", "Studio", "Flat", "House", "Villa", "Penthouse"].map(tp => (
                <button key={tp} onClick={() => setTypeFilter(tp)}
                  className={`h-tag ${typeFilter === tp ? "h-tag-active" : ""}`}>
                  {tp}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <select value={countryFilter} onChange={e => { setCountryFilter(e.target.value); setCityFilter("All cities"); }} className="h-input !w-auto !py-2 !text-sm">
              <option value="All">{t("filter.allCountries")}</option>
              {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </select>
            {countryFilter !== "All" && (
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="h-input !w-auto !py-2 !text-sm">
                <option value="All cities">{t("filter.allCities")}</option>
                {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <label className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--h-muted)" }}>Max: <strong style={{ color: "var(--h-text)" }}>{maxPrice >= 5000 ? "Any" : `${maxPrice}`}</strong></label>
              <input type="range" min={100} max={5000} step={50} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-28 accent-[var(--h-accent)]" />
              <span className="text-sm" style={{ color: "var(--h-subtle)" }}>{filtered.length} {t("filter.results")}</span>
            </div>
          </div>

          {/* Listing Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(l => (
              <Link href={`/makan/listing/${l.id}`} key={l.id} className="h-card group">
                <div className="relative aspect-[4/3] overflow-hidden" style={{ background: l.images?.[0] ? undefined : l.property_type === "Room" ? "#e8e0d6" : l.property_type === "Flat" ? "#d6dfe8" : "#d6e8db" }}>
                  {l.images?.[0] ? (
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                        {l.property_type === "Room" && <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/>}
                        {l.property_type === "Flat" && <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>}
                        {l.property_type === "House" && <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>}
                      </svg>
                    </div>
                  )}
                  {l.featured && <div className="absolute top-3 left-3"><span className="h-badge text-white" style={{ background: "var(--h-accent)" }}>Featured</span></div>}
                  <div className="absolute top-3 right-3"><span className="h-badge" style={{ background: "var(--h-surface)", color: "var(--h-text)" }}>{l.property_type}</span></div>
                  {isAvailableNow(l.available_from) && <div className="absolute bottom-3 left-3"><span className="h-badge" style={{ background: "var(--h-green)", color: "white" }}>Available now</span></div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>{l.title}</h3>
                  <p className="text-xs mb-2" style={{ color: "var(--h-muted)" }}>{l.area}, {l.city}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(l.features || []).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div><span className="text-xl font-bold" style={{ color: "var(--h-text)" }}>£{l.price}</span><span className="text-sm" style={{ color: "var(--h-subtle)" }}>/mo</span></div>
                    <span className="text-xs font-medium" style={{ color: "var(--h-muted)" }}>{l.bedrooms === 0 ? "Studio" : `${l.bedrooms} bed${l.bedrooms > 1 ? "s" : ""}`}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-semibold" style={{ color: "var(--h-text)" }}>No listings match your search</p>
              <p className="text-sm mt-1" style={{ color: "var(--h-muted)" }}>Try changing your filters or search term</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--h-text)" }}>How Makan works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "1", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>, title: "Browse or search", desc: "Filter by rooms, flats, or houses. Search by city, area, or budget." },
              { step: "2", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>, title: "Message directly", desc: "Contact the landlord via WhatsApp or enquiry form. No middlemen." },
              { step: "3", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>, title: "Move in", desc: "Agree terms, sign up, and move in. It's your place." },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                  {s.icon}
                </div>
                <h3 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{s.title}</h3>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Can't find what you need? */}
      <section className="py-12" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container">
          <div className="grid md:grid-cols-2 gap-5">
            <Link href="/makan/wanted" className="h-card !rounded-2xl p-8 group">
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>Can&apos;t find what you need?</h3>
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>Post what you&apos;re looking for and let landlords come to you.</p>
            </Link>
            <Link href="/makan/about" className="h-card !rounded-2xl p-8 group">
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>Our story</h3>
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>Why we built Makan and what makes us different.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "var(--h-slate)" }}>
        <div className="h-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Got a property? List it free.</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto text-sm">Reach tenants directly. No agent fees. No commission. No catch.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/makan/list" className="h-btn h-btn-primary text-center">List your property</Link>
            <Link href="/makan/wanted" className="h-btn h-btn-secondary !border-white/20 !text-white hover:!bg-white/10 text-center">Post what you need</Link>
          </div>
        </div>
      </section>
    </>
  );
}
