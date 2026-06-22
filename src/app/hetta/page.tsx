"use client";

import Link from "next/link";
import { useState } from "react";

const listings = [
  { id: 1, title: "Modern 2-bed apartment, Jewellery Quarter", type: "Flat", beds: 2, price: 950, city: "Birmingham", area: "Jewellery Quarter", available: "Now", tags: ["Furnished", "Parking"], featured: true },
  { id: 2, title: "Spacious double room in shared house", type: "Room", beds: 1, price: 450, city: "Nottingham", area: "Lenton", available: "1 Jul", tags: ["Bills included", "Students"] },
  { id: 3, title: "Renovated 3-bed terraced house", type: "House", beds: 3, price: 850, city: "Derby", area: "Normanton", available: "Now", tags: ["Garden", "Pets OK"] },
  { id: 4, title: "Studio flat near city centre", type: "Flat", beds: 0, price: 595, city: "Birmingham", area: "Digbeth", available: "15 Jul", tags: ["Furnished", "Bills included"] },
  { id: 5, title: "Large double room, professional house share", type: "Room", beds: 1, price: 500, city: "Nottingham", area: "West Bridgford", available: "Now", tags: ["Professionals", "En-suite"] },
  { id: 6, title: "4-bed semi-detached, family home", type: "House", beds: 4, price: 1200, city: "Birmingham", area: "Edgbaston", available: "1 Aug", tags: ["Garden", "Garage", "Unfurnished"] },
  { id: 7, title: "Cosy single room near university", type: "Room", beds: 1, price: 380, city: "Derby", area: "Allestree", available: "Now", tags: ["Students", "Bills included"] },
  { id: 8, title: "Refurbished 1-bed flat, tram link", type: "Flat", beds: 1, price: 650, city: "Nottingham", area: "Hyson Green", available: "Now", tags: ["Furnished", "Transport"] },
];

const types = ["All", "Room", "Flat", "House"];
const cities = ["All cities", "Birmingham", "Nottingham", "Derby"];

export default function HettaPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All cities");
  const [search, setSearch] = useState("");

  const filtered = listings.filter(l => {
    if (typeFilter !== "All" && l.type !== typeFilter) return false;
    if (cityFilter !== "All cities" && l.city !== cityFilter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.area.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--h-surface)" }} className="py-12 md:py-20">
        <div className="h-container text-center">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--h-accent)" }}>100% free · No sign-up required</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--h-text)", lineHeight: 1.05 }}>
            Find your place
          </h1>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "var(--h-muted)" }}>
            Rooms, flats, and houses across Birmingham, Nottingham, and Derby. List free. Browse free. No agents needed.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 rounded-2xl" style={{ background: "var(--h-surface)", border: "2px solid var(--h-border)" }}>
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--h-subtle)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by area, city, or keyword..."
                  className="h-input !border-0 !pl-12 !shadow-none !ring-0"
                  style={{ background: "transparent" }}
                />
              </div>
              <button className="h-btn h-btn-primary !rounded-xl hidden sm:flex">Search</button>
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
              <span><strong style={{ color: "var(--h-text)" }}>{listings.length}</strong> listings live</span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong style={{ color: "var(--h-text)" }}>3</strong> cities</span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong style={{ color: "var(--h-text)" }}>Free</strong> forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span><strong style={{ color: "var(--h-text)" }}>Zero</strong> agent fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="py-10" style={{ background: "var(--h-bg)" }}>
        <div className="h-container">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex gap-1.5">
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`h-tag ${typeFilter === t ? "h-tag-active" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="w-px h-6" style={{ background: "var(--h-border)" }} />
            <div className="flex gap-1.5">
              {cities.map(c => (
                <button key={c} onClick={() => setCityFilter(c)}
                  className={`h-tag ${cityFilter === c ? "h-tag-active" : ""}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="ml-auto text-sm" style={{ color: "var(--h-subtle)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
          </div>

          {/* Listing Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(l => (
              <Link href={`/hetta/listing/${l.id}`} key={l.id} className="h-card group">
                {/* Image placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden" style={{ background: l.type === "Room" ? "#e8e0d6" : l.type === "Flat" ? "#d6dfe8" : "#d6e8db" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                      {l.type === "Room" && <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4zm2 8h-8V9h6c1.1 0 2 .9 2 2v4z"/>}
                      {l.type === "Flat" && <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>}
                      {l.type === "House" && <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>}
                    </svg>
                  </div>
                  {l.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="h-badge text-white" style={{ background: "var(--h-accent)" }}>Featured</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="h-badge" style={{ background: "var(--h-surface)", color: "var(--h-text)" }}>{l.type}</span>
                  </div>
                  {l.available === "Now" && (
                    <div className="absolute bottom-3 left-3">
                      <span className="h-badge" style={{ background: "var(--h-green)", color: "white" }}>Available now</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm leading-snug group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>{l.title}</h3>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--h-muted)" }}>{l.area}, {l.city}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {l.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold" style={{ color: "var(--h-text)" }}>£{l.price}</span>
                      <span className="text-sm" style={{ color: "var(--h-subtle)" }}>/mo</span>
                    </div>
                    {l.beds > 0 && (
                      <span className="text-xs font-medium" style={{ color: "var(--h-muted)" }}>{l.beds} bed{l.beds > 1 ? "s" : ""}</span>
                    )}
                    {l.beds === 0 && (
                      <span className="text-xs font-medium" style={{ color: "var(--h-muted)" }}>Studio</span>
                    )}
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
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--h-text)" }}>How Hetta works</h2>
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

      {/* CTA */}
      <section className="py-16" style={{ background: "var(--h-slate)" }}>
        <div className="h-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Got a property? List it free.</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto text-sm">Reach tenants directly. No agent fees. No commission. No catch.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/hetta/list" className="h-btn h-btn-primary text-center">List your property</Link>
            <Link href="/guaranteed-rent" className="h-btn h-btn-secondary !border-white/20 !text-white hover:!bg-white/10 text-center">Or get guaranteed rent</Link>
          </div>
        </div>
      </section>
    </>
  );
}
