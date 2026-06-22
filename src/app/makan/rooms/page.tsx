"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  area: string;
  features: string[];
  available_from: string;
  images: string[];
  furnished?: string;
  bedrooms?: number;
  country?: string;
  listing_type?: string;
}

const SAMPLE_ROOMS: Listing[] = [
  {
    id: "sample-r1",
    title: "Spacious double room in shared house",
    price: 450, city: "Nottingham", area: "Lenton",
    features: ["Bills included", "Students welcome", "Wifi"],
    available_from: "2026-07-01",
    images: ["https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80"],
  },
  {
    id: "sample-r2",
    title: "Large double room, professional house share",
    price: 525, city: "Nottingham", area: "West Bridgford",
    features: ["Professionals only", "En-suite", "Garden"],
    available_from: "2026-06-01",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80"],
  },
  {
    id: "sample-r3",
    title: "Bright double room near city centre",
    price: 480, city: "Birmingham", area: "Digbeth",
    features: ["Bills included", "Furnished", "Near transport"],
    available_from: "2026-06-15",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80"],
  },
];

// Feature icons
const FEATURE_ICONS: Record<string, string> = {
  "Bills included": "💡",
  "Wifi": "📶",
  "En-suite": "🚿",
  "Garden": "🌿",
  "Parking": "🚗",
  "Furnished": "🛋️",
  "Students welcome": "🎓",
  "Professionals only": "💼",
  "Near transport": "🚇",
  "Pet friendly": "🐾",
};

const CITIES = ["All cities", "Birmingham", "Nottingham", "Derby", "Manchester", "London", "Leeds"];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Listing[]>(SAMPLE_ROOMS);
  const [cityFilter, setCityFilter] = useState("All cities");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [billsOnly, setBillsOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .eq("property_type", "Room")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setRooms(data);
        setLoading(false);
      });
  }, []);

  const isNow = (d: string) => !d || new Date(d) <= new Date();

  const filtered = rooms.filter(r => {
    if (cityFilter !== "All cities" && r.city !== cityFilter) return false;
    if (r.price > maxPrice) return false;
    if (billsOnly && !r.features?.some(f => f.toLowerCase().includes("bills"))) return false;
    return true;
  });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="py-14" style={{ background: "var(--h-slate)" }}>
        <div className="h-container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(232,85,61,0.15)", color: "var(--h-accent)" }}>
              🛏 Room rentals
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white leading-tight">
              Find your next room.<br />No fees, no agents.
            </h1>
            <p className="text-base mb-0" style={{ color: "rgba(255,255,255,0.6)" }}>
              Rooms in house shares and managed properties. Bills-included options available. Contact landlords directly on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="border-b" style={{ background: "var(--h-surface)", borderColor: "var(--h-border)" }}>
        <div className="h-container py-3">
          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--h-muted)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--h-green)" }} />
              <span><strong style={{ color: "var(--h-text)" }}>{rooms.length}</strong> rooms listed</span>
            </div>
            <span><strong style={{ color: "var(--h-text)" }}>£0</strong> agent fees</span>
            <span>Direct landlord contact</span>
            <Link href="/makan/list" className="ml-auto h-btn h-btn-primary !py-2 !text-sm">List a room free →</Link>
          </div>
        </div>
      </section>

      {/* ── Filters + Grid ───────────────────────────────── */}
      <section className="py-10" style={{ background: "var(--h-bg)" }}>
        <div className="h-container">

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="h-input !w-auto !py-2 !text-sm"
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--h-muted)" }}>
                Max: <strong style={{ color: "var(--h-text)" }}>£{maxPrice >= 1000 ? "Any" : maxPrice}/mo</strong>
              </label>
              <input
                type="range" min={200} max={1000} step={25} value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="w-28 accent-[var(--h-accent)]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--h-muted)" }}>
              <input
                type="checkbox"
                checked={billsOnly}
                onChange={e => setBillsOnly(e.target.checked)}
                className="accent-[var(--h-accent)]"
              />
              Bills included only
            </label>

            <span className="ml-auto text-sm font-semibold" style={{ color: "var(--h-muted)" }}>
              {filtered.length} room{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Room cards */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "var(--h-border)", borderTopColor: "var(--h-accent)" }} />
              <p className="text-sm" style={{ color: "var(--h-muted)" }}>Loading rooms...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(r => {
                const hasPhoto = r.images?.[0];
                const available = isNow(r.available_from);
                const hasBills = r.features?.some(f => f.toLowerCase().includes("bills"));

                return (
                  <Link href={`/makan/listing/${r.id}`} key={r.id} className="group rounded-2xl overflow-hidden transition-shadow hover:shadow-lg" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                    {/* Photo */}
                    <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "#e8e0d6" }}>
                      {hasPhoto ? (
                        <img
                          src={r.images[0]}
                          alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-14 h-14 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/></svg>
                        </div>
                      )}

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {available && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--h-green)", color: "white" }}>
                            Available now
                          </span>
                        )}
                        {hasBills && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "var(--h-slate)", color: "white" }}>
                            Bills inc.
                          </span>
                        )}
                      </div>

                      {/* Price overlay bottom right */}
                      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl font-extrabold text-sm" style={{ background: "rgba(0,0,0,0.7)", color: "white" }}>
                        £{r.price}<span className="text-xs font-normal opacity-70">/mo</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm leading-snug mb-1 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>
                        {r.title}
                      </h3>
                      <p className="flex items-center gap-1 text-xs mb-3" style={{ color: "var(--h-muted)" }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                        {r.area}, {r.city}
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(r.features || []).slice(0, 4).map(f => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
                            {FEATURE_ICONS[f] ?? "·"} {f}
                          </span>
                        ))}
                      </div>

                      {/* Footer row */}
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--h-border)" }}>
                        {!available && r.available_from && (
                          <p className="text-xs" style={{ color: "var(--h-muted)" }}>
                            From {new Date(r.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </p>
                        )}
                        <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-lg" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                          View room →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <p className="text-4xl mb-4">🛏</p>
              <p className="text-lg font-bold mb-1" style={{ color: "var(--h-text)" }}>No rooms match your filters</p>
              <p className="text-sm mb-6" style={{ color: "var(--h-muted)" }}>Try adjusting your city or price range</p>
              <button onClick={() => { setCityFilter("All cities"); setMaxPrice(1000); setBillsOnly(false); }}
                className="h-btn h-btn-secondary">Clear filters</button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6" style={{ background: "var(--h-slate)" }}>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Got a room to let?</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>List it free on Makan. Your next housemate is looking right now.</p>
            </div>
            <Link href="/makan/list" className="h-btn h-btn-primary whitespace-nowrap flex-shrink-0">
              List a room free →
            </Link>
          </div>

          {/* Safety note */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 text-xs" style={{ color: "var(--h-subtle)" }}>
            <p>🛡 Never pay a deposit before viewing in person.</p>
            <p>🔐 All landlords are verified at account creation.</p>
            <p>📄 Always get a written tenancy agreement.</p>
          </div>
        </div>
      </section>
    </>
  );
}
