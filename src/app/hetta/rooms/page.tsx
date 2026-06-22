import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms to Rent — Birmingham, Nottingham & Derby",
  description: "Browse rooms to rent across Birmingham, Nottingham, and Derby. Bills included, en-suite, student and professional rooms. List or find a room free.",
};

const rooms = [
  { id: 2, title: "Spacious double room in shared house", price: 450, city: "Nottingham", area: "Lenton", tags: ["Bills included", "Students"], available: "1 Jul" },
  { id: 5, title: "Large double room, professional house share", price: 500, city: "Nottingham", area: "West Bridgford", tags: ["Professionals", "En-suite"], available: "Now" },
  { id: 7, title: "Cosy single room near university", price: 380, city: "Derby", area: "Allestree", tags: ["Students", "Bills included"], available: "Now" },
];

export default function RoomsPage() {
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
                <div className="aspect-[4/3] flex items-center justify-center" style={{ background: "#e8e0d6" }}>
                  <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/></svg>
                  {r.available === "Now" && <span className="absolute bottom-3 left-3 h-badge" style={{ background: "var(--h-green)", color: "white" }}>Available now</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>{r.title}</h3>
                  <p className="text-xs mb-2" style={{ color: "var(--h-muted)" }}>{r.area}, {r.city}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {r.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{t}</span>)}
                  </div>
                  <span className="text-xl font-bold" style={{ color: "var(--h-text)" }}>£{r.price}</span>
                  <span className="text-sm" style={{ color: "var(--h-subtle)" }}>/mo</span>
                </div>
              </Link>
            ))}
          </div>

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
