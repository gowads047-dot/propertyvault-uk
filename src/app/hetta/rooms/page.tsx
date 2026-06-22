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
}

const sampleRooms = [
  { id: "sample-2", title: "Spacious double room in shared house", price: 450, city: "Nottingham", area: "Lenton", features: ["Bills included", "Students"], available_from: "2026-07-01", images: [] },
  { id: "sample-5", title: "Large double room, professional house share", price: 500, city: "Nottingham", area: "West Bridgford", features: ["Professionals", "En-suite"], available_from: "2026-06-01", images: [] },
  { id: "sample-7", title: "Cosy single room near university", price: 380, city: "Derby", area: "Allestree", features: ["Students", "Bills included"], available_from: "2026-06-01", images: [] },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Listing[]>(sampleRooms);

  useEffect(() => {
    supabase.from("listings").select("*").eq("status", "active").eq("property_type", "Room").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setRooms(data); });
  }, []);

  const isNow = (d: string) => !d || new Date(d) <= new Date();

  return (
    <>
      <section className="py-12" style={{ background: "var(--h-surface)" }}>
        <div className="h-container">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--h-text)" }}>Rooms to rent</h1>
            <p style={{ color: "var(--h-muted)" }}>Find your next room in Birmingham, Nottingham, or Derby. Bills included options available. No agent fees.</p>
          </div>
        </div>
      </section>

      <section className="py-10" style={{ background: "var(--h-bg)" }}>
        <div className="h-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map(r => (
              <Link href={`/hetta/listing/${r.id}`} key={r.id} className="h-card group">
                <div className="relative aspect-[4/3] flex items-center justify-center" style={{ background: r.images?.[0] ? undefined : "#e8e0d6" }}>
                  {r.images?.[0] ? (
                    <img src={r.images[0]} alt={r.title} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/></svg>
                  )}
                  {isNow(r.available_from) && <div className="absolute bottom-3 left-3"><span className="h-badge" style={{ background: "var(--h-green)", color: "white" }}>Available now</span></div>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>{r.title}</h3>
                  <p className="text-xs mb-2" style={{ color: "var(--h-muted)" }}>{r.area}, {r.city}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(r.features || []).map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{t}</span>)}
                  </div>
                  <span className="text-xl font-bold" style={{ color: "var(--h-text)" }}>£{r.price}</span>
                  <span className="text-sm" style={{ color: "var(--h-subtle)" }}>/mo</span>
                </div>
              </Link>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-semibold" style={{ color: "var(--h-text)" }}>No rooms listed yet</p>
              <p className="text-sm mt-1 mb-6" style={{ color: "var(--h-muted)" }}>Be the first to list a room on Hetta</p>
              <Link href="/hetta/list" className="h-btn h-btn-primary inline-flex">List a room free</Link>
            </div>
          )}

          <div className="text-center mt-10 py-10 rounded-2xl" style={{ background: "var(--h-warm)" }}>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Got a room to let?</h2>
            <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>List it free on Hetta and find your next housemate.</p>
            <Link href="/hetta/list" className="h-btn h-btn-primary inline-flex">List a room free</Link>
          </div>
        </div>
      </section>
    </>
  );
}
