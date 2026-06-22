import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Makan Works — Free Property Listings",
  description: "How Makan works for tenants and landlords. Free listings, direct messaging, no agent fees. Find or list a property in Birmingham, Nottingham, or Derby.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="py-16" style={{ background: "var(--h-surface)" }}>
        <div className="h-container max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--h-text)" }}>How Makan works</h1>
          <p className="text-lg" style={{ color: "var(--h-muted)" }}>A simple, free way to find or list a property. No agents. No fees. No catch.</p>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-16" style={{ background: "var(--h-bg)" }}>
        <div className="h-container max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-semibold" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>For tenants</div>
          <div className="space-y-8">
            {[
              { n: "1", title: "Browse listings", desc: "Search rooms, flats, and houses across Birmingham, Nottingham, and Derby. Filter by type, price, and area. Every listing is free to view." },
              { n: "2", title: "Message the landlord", desc: "Found something you like? Send an enquiry or message the landlord directly on WhatsApp. No agents in the middle, no call centres." },
              { n: "3", title: "Arrange a viewing", desc: "Agree a time to view the property. You deal directly with the property owner — ask your questions, negotiate terms." },
              { n: "4", title: "Move in", desc: "Once you're happy, agree the tenancy and move in. Hetta doesn't charge you anything — not now, not ever." },
            ].map(s => (
              <div key={s.n} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: "var(--h-accent)", color: "white" }}>{s.n}</div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Landlords */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-semibold" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>For landlords</div>
          <div className="space-y-8">
            {[
              { n: "1", title: "Submit your listing", desc: "Fill in a simple form — property type, area, rent, description, and your contact details. Takes about 3 minutes." },
              { n: "2", title: "We review and publish", desc: "Our team checks your listing for quality and accuracy, then publishes it within 24 hours. We may contact you for photos." },
              { n: "3", title: "Receive enquiries", desc: "Tenants contact you directly via WhatsApp or email. You choose who to respond to and when to arrange viewings." },
              { n: "4", title: "Find your tenant", desc: "Agree terms directly with your tenant. No commission, no finder's fees, no hidden charges. It's your property, your decision." },
            ].map(s => (
              <div key={s.n} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: "var(--h-green)", color: "white" }}>{s.n}</div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16" style={{ background: "var(--h-bg)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--h-text)" }}>Makan vs the rest</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--h-muted)" }}></th>
                  <th className="py-3 px-4 font-bold text-center rounded-t-xl" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>Hetta</th>
                  <th className="py-3 px-4 font-semibold text-center" style={{ color: "var(--h-muted)" }}>Rightmove</th>
                  <th className="py-3 px-4 font-semibold text-center" style={{ color: "var(--h-muted)" }}>OpenRent</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Landlord listing fee", h: "Free", r: "Agent only", o: "Free (basic)" },
                  { label: "Tenant fees", h: "Free", r: "N/A", o: "Free" },
                  { label: "Direct messaging", h: "Yes", r: "No", o: "Limited" },
                  { label: "Room listings", h: "Yes", r: "No", o: "No" },
                  { label: "WhatsApp contact", h: "Yes", r: "No", o: "No" },
                  { label: "Agent required", h: "No", r: "Yes", o: "No" },
                  { label: "Guaranteed rent option", h: "Yes", r: "No", o: "No" },
                ].map(row => (
                  <tr key={row.label} style={{ borderBottom: "1px solid var(--h-border)" }}>
                    <td className="py-3 px-4 font-medium" style={{ color: "var(--h-text)" }}>{row.label}</td>
                    <td className="py-3 px-4 text-center font-semibold" style={{ color: "var(--h-accent)" }}>{row.h}</td>
                    <td className="py-3 px-4 text-center" style={{ color: "var(--h-muted)" }}>{row.r}</td>
                    <td className="py-3 px-4 text-center" style={{ color: "var(--h-muted)" }}>{row.o}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "var(--h-slate)" }}>
        <div className="h-container text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto text-sm">Whether you&apos;re looking for a place or listing one — Makan is free for everyone.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/hetta" className="h-btn h-btn-primary text-center">Browse listings</Link>
            <Link href="/hetta/list" className="h-btn h-btn-secondary !border-white/20 !text-white text-center">List for free</Link>
          </div>
        </div>
      </section>
    </>
  );
}
