import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Makan Works — Safe, Legal, Free Property Listings",
  description: "How Makan connects landlords and tenants safely across 10 countries. Verified users, reviewed listings, legal compliance in every market.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16" style={{ background: "var(--h-surface)" }}>
        <div className="h-container max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: "var(--h-text)" }}>How Makan works</h1>
          <p className="text-lg" style={{ color: "var(--h-muted)" }}>
            Simple and free — with real verification, legal compliance, and trust built in from day one.
          </p>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-10 border-y" style={{ borderColor: "var(--h-border)", background: "var(--h-warm)" }}>
        <div className="h-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            {[
              { icon: "✅", label: "Listings reviewed", sub: "before going live" },
              { icon: "🔐", label: "Verified users", sub: "phone required at signup" },
              { icon: "⚖️", label: "Legal compliant", sub: "across all 10 countries" },
              { icon: "£0", label: "Zero fees", sub: "forever, for everyone" },
            ].map(p => (
              <div key={p.label}>
                <p className="text-2xl mb-1">{p.icon}</p>
                <p className="text-sm font-bold" style={{ color: "var(--h-text)" }}>{p.label}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Tenants */}
      <section className="py-16" style={{ background: "var(--h-bg)" }}>
        <div className="h-container max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-semibold" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
            For tenants &amp; buyers
          </div>
          <div className="space-y-8">
            {[
              {
                n: "1", title: "Browse freely — no account needed",
                desc: "Search rooms, flats, houses, and villas across 10 countries. Filter by type, budget, and city. Every listing is free to view with no registration required.",
              },
              {
                n: "2", title: "Create a free account to contact landlords",
                desc: "To message a landlord or get their WhatsApp, you create a free account and provide your phone number. This protects landlords from spam and gives both parties a verified identity to communicate with.",
                trust: "Why we require this: anonymous contact creates fraud risk. Verified users protect everyone.",
              },
              {
                n: "3", title: "Message the landlord directly",
                desc: "No agent in the middle. Contact via WhatsApp or in-app enquiry. Ask questions, negotiate terms, arrange a viewing — all directly with the property owner.",
              },
              {
                n: "4", title: "Do your due diligence",
                desc: "Before signing any contract, check: the landlord has the legal right to let the property, all certificates are in order (EPC, Gas Safety, EICR for UK), and the tenancy agreement covers your rights. Our country-by-country compliance guide can help.",
                link: { href: "/makan/compliance", label: "View legal guide →" },
              },
              {
                n: "5", title: "Move in",
                desc: "Agree terms directly with your landlord. Makan never charges you anything — not at move-in, not ever.",
              },
            ].map(s => (
              <div key={s.n} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: "var(--h-accent)", color: "white" }}>{s.n}</div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
                  {s.trust && (
                    <p className="text-xs mt-2 px-3 py-1.5 rounded-lg inline-block" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                      🔐 {s.trust}
                    </p>
                  )}
                  {s.link && (
                    <Link href={s.link.href} className="text-xs font-semibold mt-2 inline-block" style={{ color: "var(--h-accent)" }}>{s.link.label}</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Landlords */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-semibold" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
            For landlords &amp; sellers
          </div>
          <div className="space-y-8">
            {[
              {
                n: "1", title: "Create a verified account",
                desc: "Sign up with your email and phone/WhatsApp. Your contact details are required — tenants need to know who they're dealing with. Profiles without a phone number cannot list properties.",
                trust: "Your phone number is only shared with users who send you an enquiry — not displayed publicly.",
              },
              {
                n: "2", title: "Check your legal obligations first",
                desc: "Before listing, make sure you're compliant with your country's laws. UK landlords: EPC, gas safety certificate, EICR, and deposit protection must be in place before any tenancy begins. UAE landlords: Ejari registration is mandatory. View our full guide for every country.",
                link: { href: "/makan/compliance", label: "Country compliance guide →" },
              },
              {
                n: "3", title: "Submit your listing",
                desc: "Fill in the listing form — property type, location, price, description, and a minimum of 3 clear photos. Video tour optional but strongly recommended. Incomplete or low-quality listings will not be approved.",
              },
              {
                n: "4", title: "We review and publish",
                desc: "Every listing is reviewed for quality and accuracy before going live. We check for: real photos (not stock images or screenshots), accurate description, no prohibited content, no bait-and-switch pricing. Listings that pass review go live within 24 hours.",
              },
              {
                n: "5", title: "Receive and manage enquiries",
                desc: "Verified tenants contact you directly via WhatsApp or in-app message. You choose who to respond to, when to arrange viewings, and who to accept. No commission on any deal you make.",
              },
              {
                n: "6", title: "Find your tenant — keep 100%",
                desc: "Agree terms directly. Sign your own tenancy agreement (a solicitor or standard template works fine). Makan takes zero commission, zero finder's fee. It's your property, your tenant, your relationship.",
              },
            ].map(s => (
              <div key={s.n} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: "var(--h-green)", color: "white" }}>{s.n}</div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{s.desc}</p>
                  {s.trust && (
                    <p className="text-xs mt-2 px-3 py-1.5 rounded-lg inline-block" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
                      🔒 {s.trust}
                    </p>
                  )}
                  {s.link && (
                    <Link href={s.link.href} className="text-xs font-semibold mt-2 inline-block" style={{ color: "var(--h-accent)" }}>{s.link.label}</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-16" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Safety &amp; trust</h2>
          <p className="text-sm mb-8" style={{ color: "var(--h-muted)" }}>How Makan protects you from scams, fraud, and bad actors.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🚫", title: "Never pay before viewing", desc: "Legitimate landlords do not ask for payment before you have viewed a property in person or had a video call. If anyone asks for money upfront, report the listing immediately." },
              { icon: "📞", title: "Verify the landlord's identity", desc: "Before paying a deposit, video call the landlord, confirm they are the person on the listing, and verify their ownership of the property (title deed, mortgage statement, or tenancy agreement)." },
              { icon: "📄", title: "Always get a signed contract", desc: "No verbal agreements. A written tenancy agreement protects both landlord and tenant. Use a solicitor-drafted template or a service like Rocket Lawyer if you need one quickly." },
              { icon: "🏦", title: "Deposit protection (UK)", desc: "UK tenants: your landlord must protect your deposit in a government-approved scheme (TDS, DPS, or MyDeposits) within 30 days of payment. If they don't, they cannot legally evict you via Section 21." },
              { icon: "🚩", title: "Report suspicious listings", desc: "See a listing that looks fake, uses stock photos, or asks for unusual payments? Use the report button on any listing. We review reports within 24 hours and ban repeat offenders." },
              { icon: "📧", title: "Contact us directly", desc: "If you've been scammed or suspect fraud, email us immediately. We will remove the listing, preserve evidence, and assist with any police report." },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-5" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-semibold mt-3 mb-1" style={{ color: "var(--h-text)" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "var(--h-text)" }}>Makan vs the alternatives</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--h-muted)" }}></th>
                  <th className="py-3 px-4 font-bold text-center rounded-t-xl" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>Makan</th>
                  <th className="py-3 px-4 font-semibold text-center" style={{ color: "var(--h-muted)" }}>Bayut / Dubizzle</th>
                  <th className="py-3 px-4 font-semibold text-center" style={{ color: "var(--h-muted)" }}>Rightmove</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Listing fee for landlords", m: "Free forever", b: "Paid plans", r: "Agent only" },
                  { label: "Tenant fees", m: "Free", b: "Free", r: "N/A" },
                  { label: "Direct landlord contact", m: "✓ Yes", b: "Partial", r: "✗ No" },
                  { label: "WhatsApp contact", m: "✓ Yes", b: "Partial", r: "✗ No" },
                  { label: "International (10 countries)", m: "✓ Yes", b: "GCC only", r: "UK only" },
                  { label: "Arabic + French language", m: "✓ Built-in", b: "Arabic only", r: "✗ No" },
                  { label: "Listing quality review", m: "✓ All listings", b: "Partial", r: "✗ No" },
                  { label: "Legal compliance guide", m: "✓ Per country", b: "✗ No", r: "✗ No" },
                  { label: "Agent commission", m: "£0 / 0%", b: "2–5%", r: "1–3% + VAT" },
                ].map(row => (
                  <tr key={row.label} style={{ borderBottom: "1px solid var(--h-border)" }}>
                    <td className="py-3 px-4 font-medium" style={{ color: "var(--h-text)" }}>{row.label}</td>
                    <td className="py-3 px-4 text-center font-semibold" style={{ color: "var(--h-accent)" }}>{row.m}</td>
                    <td className="py-3 px-4 text-center" style={{ color: "var(--h-muted)" }}>{row.b}</td>
                    <td className="py-3 px-4 text-center" style={{ color: "var(--h-muted)" }}>{row.r}</td>
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
          <h2 className="text-2xl font-bold text-white mb-3">Ready? It takes 3 minutes.</h2>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Whether you&apos;re looking for a place or listing one — Makan is free for everyone, in every country.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/makan" className="h-btn h-btn-primary text-center">Browse listings</Link>
            <Link href="/makan/list" className="h-btn text-center" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>List for free</Link>
          </div>
          <p className="text-xs mt-6" style={{ color: "rgba(255,255,255,0.3)" }}>
            Questions about legal compliance? <Link href="/makan/compliance" className="underline" style={{ color: "rgba(255,255,255,0.5)" }}>Read our country guide →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
