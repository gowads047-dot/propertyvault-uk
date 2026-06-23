import Link from "next/link";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "PropertyVault UK — Free Tools, Guaranteed Rent & Expert Guides",
  description: "17 free property calculators, 40+ templates, guaranteed rent for landlords, and expert guides for UK investors, buyers, and landlords.",
};

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-bg {
          0%, 100% { background-position: 0% 60%; }
          50%       { background-position: 100% 40%; }
        }
        .hero-section {
          background: linear-gradient(160deg, #050912 0%, #0f1b36 35%, #1a2e5a 65%, #0d1830 100%);
          background-size: 300% 300%;
          animation: hero-bg 14s ease infinite;
        }
        .stat-num { animation: countUp 0.6s ease both; }
        .stat-num:nth-child(2) { animation-delay: 0.1s; }
        .stat-num:nth-child(3) { animation-delay: 0.2s; }
        .stat-num:nth-child(4) { animation-delay: 0.3s; }
        .hero-line { animation: countUp 0.7s ease both; }
        .hero-line:nth-child(1) { animation-delay: 0s; }
        .hero-line:nth-child(2) { animation-delay: 0.2s; }
        .hero-line:nth-child(3) { animation-delay: 0.35s; }
        .hero-line:nth-child(4) { animation-delay: 0.5s; }
        .step-card:hover { transform: translateY(-3px); }
        .step-card { transition: transform 0.2s, box-shadow 0.2s; }
        .pillar-card:hover { border-color: #c9a84c; }
        .pillar-card { transition: border-color 0.2s, box-shadow 0.2s; }
        .pillar-card:hover { box-shadow: 0 8px 32px rgba(15,27,54,0.08); }
        .blog-hero-card { background: #0f1b36; }
        .blog-hero-card:hover { background: #1a2845; }
        .blog-hero-card { transition: background 0.2s; }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-section" style={{ position: "relative", overflow: "hidden" }}>
        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        {/* Gold glow */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container-max px-4" style={{ paddingTop: 72, paddingBottom: 80, position: "relative", zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div className="hero-line" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 20, padding: "6px 14px", marginBottom: 28 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", boxShadow: "0 0 0 3px rgba(201,168,76,0.25)", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#c9a84c", letterSpacing: "0.06em" }}>Birmingham · Nottingham · Derby · Guaranteed Rent</span>
              </div>

              <h1 className="hero-line" style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(34px, 4.5vw, 58px)", fontWeight: 800, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24 }}>
                Your rent,{" "}
                <span style={{ color: "#c9a84c" }}>guaranteed</span>
                <br />every month —<br />
                <em style={{ fontStyle: "normal", color: "rgba(255,255,255,0.35)" }}>no voids, ever.</em>
              </h1>

              <p className="hero-line" style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 16, maxWidth: 420 }}>
                Join Midlands landlords earning a predictable monthly income with our 3–5 year guaranteed rent scheme. We pay you whether the tenant pays or not.
              </p>

              <div className="hero-line" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
                {["No void periods", "No management stress", "No hidden fees"].map(t => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 10px" }}>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span> {t}
                  </span>
                ))}
              </div>

              <div className="hero-line" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                <Link href="/guaranteed-rent" className="btn-gold" style={{ fontSize: 15, padding: "13px 24px" }}>
                  Get My Free Rent Estimate →
                </Link>
                <Link href="/calculators" className="btn-primary" style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.12)" }}>
                  Explore Free Tools
                </Link>
              </div>

              <div className="hero-line" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { icon: "★", text: "5-star rated service" },
                  { icon: "🔒", text: "No obligation estimate" },
                  { icon: "⚡", text: "Response within 2 hrs" },
                ].map(t => (
                  <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{t.icon}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dashboard mockup */}
            <div className="hero-line" style={{ position: "relative" }}>
              {/* Main card */}
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 24, backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Your portfolio</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "white", fontFamily: "ui-monospace, monospace", fontVariantNumeric: "tabular-nums" }}>£4,250</p>
                    <p style={{ fontSize: 12, color: "rgba(201,168,76,0.8)", marginTop: 2 }}>▲ rent received this month</p>
                  </div>
                  <div style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "6px 12px" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#c9a84c" }}>3 properties</p>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60, marginBottom: 16 }}>
                  {[40, 65, 55, 80, 70, 90, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i === 6 ? "#c9a84c" : "rgba(255,255,255,0.1)" }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {["Jan","Feb","Mar","Apr","May","Jun","Jul"].map(m => (
                    <span key={m} style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{m}</span>
                  ))}
                </div>

                {/* Status rows */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 20, paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Void periods", value: "0 days", dot: "#22c55e" },
                    { label: "Next inspection", value: "14 Aug", dot: "#c9a84c" },
                    { label: "Compliance", value: "Up to date ✓", dot: "#22c55e" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: r.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating yield card */}
              <div style={{ position: "absolute", bottom: -20, left: -20, background: "white", borderRadius: 14, padding: "12px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", minWidth: 140 }}>
                <p style={{ fontSize: 10, color: "#a3a3a3", marginBottom: 2 }}>Gross yield</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#0f1b36", fontFamily: "ui-monospace, monospace", fontVariantNumeric: "tabular-nums" }}>7.2%</p>
                <p style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>▲ above market avg</p>
              </div>
            </div>
          </div>

          {/* Bottom stats bar — glassmorphic */}
          <div style={{ marginTop: 64, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { n: "17", l: "Free calculators" },
              { n: "40+", l: "Templates" },
              { n: "£0", l: "Sign-up cost" },
              { n: "3–5yr", l: "Guaranteed leases" },
            ].map((s, i) => (
              <div key={s.l} className="stat-num" style={{ textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none", padding: "0 24px" }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1, fontFamily: "ui-monospace, 'Cascadia Code', monospace", fontVariantNumeric: "tabular-nums" }}>{s.n}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6, fontWeight: 500, letterSpacing: "0.04em" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOCK STAT BANNER ─────────────────────────────── */}
      <section style={{ background: "#c9a84c" }}>
        <div className="container-max px-4" style={{ padding: "20px 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36" }}>
              UK landlords spend an average of <strong>£3,200/year</strong> on letting agent management fees.
            </p>
            <Link href="/guaranteed-rent" style={{ fontSize: 13, fontWeight: 700, background: "#0f1b36", color: "white", padding: "8px 18px", borderRadius: 20, textDecoration: "none", whiteSpace: "nowrap" }}>
              See the alternative →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────── */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>Why PropertyVault</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, textAlign: "center", color: "#0f1b36", marginBottom: 52, letterSpacing: "-0.01em" }}>
              Built for landlords who want<br />less hassle, more return
            </h2>
          </FadeIn>
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <rect x="2" y="8" width="28" height="20" rx="4" fill="#0f1b36"/>
                    <path d="M8 22V16" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M14 22V12" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M20 22V9" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M26 22V6" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Earn more",
                desc: "Guaranteed rent paid every month for 3–5 years. No void periods, no chasing tenants, no arrears.",
                stat: "£0 voids",
                href: "/guaranteed-rent",
                cta: "Get guaranteed rent",
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <path d="M16 3L4 9v9c0 6.075 5.373 10.5 12 12 6.627-1.5 12-5.925 12-12V9L16 3z" fill="#0f1b36"/>
                    <path d="M11 16l3.5 3.5L21 13" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "Stay protected",
                desc: "Full management included. Legal compliance, property inspections, and maintenance coordination.",
                stat: "100% covered",
                href: "/landlord-hub",
                cta: "Compliance guide",
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                    <rect x="4" y="4" width="24" height="24" rx="6" fill="#0f1b36"/>
                    <circle cx="16" cy="14" r="4" stroke="#c9a84c" strokeWidth="2"/>
                    <path d="M9 26c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Stay in control",
                desc: "No lock-ins. Direct contact with us, not a call centre. Transparent terms from day one.",
                stat: "No lock-in",
                href: "/guaranteed-rent",
                cta: "How it works",
              },
            ].map(p => (
              <div key={p.title} className="pillar-card" style={{ border: "1.5px solid #e8eaf0", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f8f9fc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {p.icon}
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#c9a84c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{p.stat}</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f1b36", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 24, flex: 1 }}>{p.desc}</p>
                <Link href={p.href} style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {p.cta} <span style={{ color: "#c9a84c" }}>→</span>
                </Link>
              </div>
            ))}
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ALTERNATING SECTION 1: Guaranteed Rent ────────── */}
      <section style={{ background: "#f8f9fc", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center" }}>
            {/* Left: copy */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>For landlords</p>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0f1b36", lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 20 }}>
                We pay your rent.<br />Every month.<br /><em style={{ fontStyle: "italic", fontWeight: 600, color: "#64748b" }}>Whether tenanted or not.</em>
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
                We take on your property on a 3–5 year lease and pay you a guaranteed monthly amount. No management fees, no void periods, no tenant hassle. We handle everything.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/guaranteed-rent" className="btn-gold">Get a free rent estimate</Link>
                <a href="https://calendly.com/gowads047/30min" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "#0f1b36", padding: "10px 20px", border: "1.5px solid #e8eaf0", borderRadius: 10, background: "white", textDecoration: "none" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0f1b36"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  Book a free call
                </a>
              </div>
            </div>

            {/* Right: stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { n: "3–5", l: "Year leases", sub: "long-term security" },
                { n: "£0", l: "Management fees", sub: "ever" },
                { n: "Zero", l: "Void periods", sub: "guaranteed" },
                { n: "100%", l: "Hands-off", sub: "we handle everything" },
              ].map(s => (
                <div key={s.l} style={{ background: "white", border: "1.5px solid #e8eaf0", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
                  <p style={{ fontSize: 26, fontWeight: 800, color: "#0f1b36", lineHeight: 1 }}>{s.n}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", marginTop: 4 }}>{s.l}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FREE TOOLS SECTION ────────────────────────────── */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>Free tools</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, textAlign: "center", color: "#0f1b36", marginBottom: 12, letterSpacing: "-0.01em" }}>
              Everything a landlord needs — free, forever
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", maxWidth: 560, margin: "0 auto 52px", lineHeight: 1.6 }}>
              No account required. No paywall. Use our calculators and legal templates directly in your browser.
            </p>
          </FadeIn>
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              {
                href: "/calculators",
                tag: "17 calculators",
                title: "Property calculators",
                desc: "Deal analyser, rental yield, stamp duty, mortgage, CGT, BRRR, HMO yield, Section 24 — all in one place.",
                items: ["Rental yield & cash flow", "Stamp duty & CGT", "BRRR & HMO analysis"],
              },
              {
                href: "/templates",
                tag: "17 templates",
                title: "Legal document templates",
                desc: "Section 8 notices, rent increase letters, tenancy applications, inspection records — print-ready in minutes.",
                items: ["Section 8 & 13 notices", "Inventory & inspection", "Tenant application form"],
              },
              {
                href: "/makan",
                tag: "UK · Egypt · Morocco",
                title: "Makan property listings",
                desc: "Find and list property across the UK and Middle East — direct landlord contact, no agent fees, forever free.",
                items: ["No agent fees", "WhatsApp direct contact", "Multi-country search"],
              },
            ].map(card => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", border: "1.5px solid #e8eaf0", borderRadius: 20, padding: 28, transition: "border-color 0.2s, box-shadow 0.2s" }}
                className="pillar-card">
                <span style={{ fontSize: 10, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{card.tag}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{card.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  {card.items.map(item => (
                    <li key={item} style={{ fontSize: 12, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Explore free <span style={{ color: "#c9a84c" }}>→</span>
                </span>
              </Link>
            ))}
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS — Step cards ─────────────────────── */}
      <section style={{ background: "#0f1b36", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>Simple process</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, textAlign: "center", color: "white", marginBottom: 52 }}>
              Guaranteed rent in 3 steps
            </h2>
          </FadeIn>
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { step: "01", title: "Book a free valuation", desc: "Tell us about your property. We'll assess it and give you a guaranteed monthly figure — no obligation.", icon: "📋" },
              { step: "02", title: "We take it on", desc: "We sign a 3–5 year lease and take over full management. You receive your first payment within days.", icon: "✍️" },
              { step: "03", title: "You get paid — every month", desc: "We handle tenants, repairs, compliance, and inspections. Your rent lands in your account no matter what.", icon: "💷" },
            ].map(s => (
              <div key={s.step} className="step-card" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: 36 }}>{s.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,168,76,0.5)", letterSpacing: "0.08em" }}>{s.step}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          </FadeIn>
          <FadeIn>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/guaranteed-rent" className="btn-gold">Book your free valuation</Link>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ALTERNATING SECTION 2: Tools ──────────────────── */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 64, alignItems: "center" }}>

            {/* Left: tool cards visual */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Deal Analyser", tag: "Most used", href: "/calculators/deal-analyser" },
                { label: "Stamp Duty", tag: "Calculator", href: "/calculators/stamp-duty" },
                { label: "BRRR Strategy", tag: "Calculator", href: "/calculators/brrr" },
                { label: "Rental Yield", tag: "Calculator", href: "/calculators/rental-yield" },
                { label: "Mortgage", tag: "Calculator", href: "/calculators/mortgage" },
                { label: "Section 24 Tax", tag: "Calculator", href: "/calculators/section-24" },
              ].map(t => (
                <Link key={t.label} href={t.href} style={{ background: "#f8f9fc", border: "1.5px solid #e8eaf0", borderRadius: 14, padding: "16px 14px", textDecoration: "none", display: "block" }}
                  className="hover:border-gold-300 transition-colors">
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{t.tag}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36" }}>{t.label}</p>
                </Link>
              ))}
            </div>

            {/* Right: copy */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Free tools</p>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0f1b36", lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 20 }}>
                17 calculators.<br />Zero sign-up.<br /><em style={{ fontStyle: "italic", color: "#94a3b8", fontWeight: 600 }}>Completely free.</em>
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
                From deal analysis to tax planning, stamp duty to mortgage stress-tests — every calculation a UK property investor needs, in one place.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/calculators" className="btn-gold">All 17 calculators</Link>
                <Link href="/templates" style={{ fontSize: 14, fontWeight: 600, color: "#0f1b36", padding: "10px 20px", border: "1.5px solid #e8eaf0", borderRadius: 10, background: "white", textDecoration: "none" }}>
                  40+ templates
                </Link>
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── VIDEO / TESTIMONIAL SECTION ───────────────────── */}
      <section style={{ background: "#f8f9fc", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center" }}>
            {/* Left: copy */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Landlord success</p>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#0f1b36", lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: 20 }}>
                "Not a single void month in two years"
              </h2>
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 8 }}>
                Our landlords in Birmingham, Nottingham, and Derby tell us the same thing: guaranteed rent changed how they think about property.
              </p>
              <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 32 }}>No chasing rent. No tenant calls. No surprise costs.</p>
              <Link href="/guaranteed-rent" className="btn-gold">See if your property qualifies</Link>
            </div>

            {/* Right: video placeholder (swap src for real video when ready) */}
            <div style={{ position: "relative" }}>
              <div style={{ background: "#0f1b36", borderRadius: 20, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {/* Background pattern */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                {/* Play button */}
                <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27d%20like%20to%20learn%20more%20about%20guaranteed%20rent." target="_blank" rel="noopener noreferrer"
                  style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(201,168,76,0.4)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>Speak with Nass</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Free 15-min call · WhatsApp</p>
                  </div>
                </a>
                {/* Corner badge */}
                <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 8, padding: "6px 12px" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#c9a84c" }}>Free consultation</p>
                </div>
              </div>

              {/* Below-video trust badges */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
                {["No fees", "No lock-in", "No agents"].map(b => (
                  <div key={b} style={{ background: "white", border: "1.5px solid #e8eaf0", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>✓ {b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── LANDLORD TESTIMONIALS ─────────────────────────── */}
      <section style={{ background: "#0f1b36", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>Real landlords</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, textAlign: "center", color: "white", marginBottom: 12 }}>
              What our landlords say
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
              Landlords in Birmingham, Nottingham, and Derby earning more — doing less.
            </p>
          </FadeIn>
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
            {[
              {
                quote: "I had a property sitting empty for 3 months, losing £900 each month. Now I get £780 guaranteed — every single month, whether it's occupied or not. Wish I'd done this years ago.",
                name: "J.R.",
                desc: "2-bed landlord, Erdington, Birmingham",
                tag: "Was losing £2,700 in voids",
                city: "BHM",
              },
              {
                quote: "Managing tenants was taking over my life — midnight calls, chasing rent, arranging repairs. With guaranteed rent I just check my bank balance. That's literally it.",
                name: "S.K.",
                desc: "Portfolio landlord, 4 properties, Nottingham",
                tag: "Went from stressed to stress-free",
                city: "NGM",
              },
              {
                quote: "My agent was charging 12% plus fees on top. The guaranteed rent I get now is actually more than what I netted after agent fees and voids. And I do absolutely nothing.",
                name: "M.A.",
                desc: "3-bed landlord, Normanton, Derby",
                tag: "Now earns more, does less",
                city: "DRB",
              },
            ].map(t => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px" }}>
                <span style={{ display: "inline-block", padding: "3px 10px", background: "rgba(201,168,76,0.15)", color: "#c9a84c", fontSize: 10, fontWeight: 700, borderRadius: 20, marginBottom: 16 }}>
                  {t.tag}
                </span>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" fill="#c9a84c" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 20 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#c9a84c", flexShrink: 0 }}>
                    {t.city}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </FadeIn>
          <FadeIn>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>Testimonials based on real landlord experiences in Birmingham, Nottingham & Derby. Names initialised for privacy. Verified via WhatsApp conversations.</p>
            <Link href="/guaranteed-rent" className="btn-gold">See if your property qualifies →</Link>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── MAKAN PROMO ───────────────────────────────────── */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
          <Link href="/makan" style={{ display: "block", borderRadius: 24, padding: "48px 40px", border: "2px solid #f0ece8", background: "linear-gradient(135deg, #faf9f7 0%, #fef0ed 100%)", textDecoration: "none" }}
            className="group hover:border-[#e8553d]/30 transition-all">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#e8553d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="white"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z"/></svg>
                  </div>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#0f1b36", letterSpacing: "-0.01em" }}>makan</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "#e8553d", color: "white", padding: "3px 8px", borderRadius: 20 }}>New</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, color: "#0f1b36", marginBottom: 10 }}>
                  Free property listings — UK, Middle East & North Africa
                </h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>
                  Browse rooms, flats, houses, and villas. List your property free. No agents, no fees, no catch — ever.
                </p>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Browse listings <span style={{ color: "#e8553d" }}>→</span>
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { n: "Free", l: "To list" },
                  { n: "Free", l: "To browse" },
                  { n: "£0", l: "Agent fees" },
                ].map(s => (
                  <div key={s.l} style={{ background: "white", borderRadius: 16, padding: "20px 12px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#0f1b36" }}>{s.n}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── TOOLS GRID ────────────────────────────────────── */}
      <section style={{ background: "#f8f9fc", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>Free tools</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, textAlign: "center", color: "#0f1b36", marginBottom: 48 }}>Everything in one place</h2>
          </FadeIn>
          <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
            <Link href="/calculators" className="group" style={{ background: "white", borderRadius: 20, border: "1.5px solid #e8eaf0", padding: 32, textDecoration: "none", display: "block" }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "#0f1b36", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg viewBox="0 0 28 28" fill="none" width="28" height="28"><rect x="2" y="6" width="24" height="18" rx="3" fill="#c9a84c"/><path d="M6 20V14" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 8 }}>17 Free Calculators</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>Deal analyser, mortgage, stamp duty, BRRR, rental yield, CGT, Section 24, HMO, and more.</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c" }}>Explore →</span>
            </Link>
            <Link href="/templates" className="group" style={{ background: "white", borderRadius: 20, border: "1.5px solid #e8eaf0", padding: 32, textDecoration: "none", display: "block" }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "#0f1b36", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg viewBox="0 0 28 28" fill="none" width="28" height="28"><rect x="4" y="2" width="20" height="24" rx="3" fill="#E8D5B7"/><rect x="8" y="6" width="12" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><rect x="8" y="10" width="8" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><rect x="8" y="14" width="10" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><path d="M16 18l3 3 5-6" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 8 }}>40+ Templates</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, marginBottom: 20 }}>Buyer, seller, landlord, and commercial templates. Fillable forms, compliance trackers, and inventories.</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#c9a84c" }}>Explore →</span>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { href: "/search", label: "Property Search", sub: "Rightmove, Zoopla & more" },
              { href: "/areas", label: "Area Guides", sub: "Birmingham, Nottingham, Derby" },
              { href: "/property-investing", label: "Expert Guides", sub: "BTL, BRRR, HMO, tax, law" },
              { href: "/glossary", label: "Property Glossary", sub: "49 terms explained" },
            ].map(t => (
              <Link key={t.href} href={t.href} style={{ background: "white", border: "1.5px solid #e8eaf0", borderRadius: 14, padding: "20px 16px", textDecoration: "none", display: "block" }}
                className="hover:border-gold-300 transition-colors">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", marginBottom: 4 }}>{t.label}</h3>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>{t.sub}</p>
              </Link>
            ))}
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BLOG ──────────────────────────────────────────── */}
      <section style={{ background: "white", padding: "80px 0" }}>
        <div className="container-max px-4">
          <FadeIn>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#0f1b36" }}>From the blog</h2>
            <Link href="/blog" style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>All articles →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Link href="/blog/uk-property-market-2026" style={{ background: "#0f1b36", borderRadius: 20, padding: "36px 32px", textDecoration: "none", display: "block", gridColumn: "span 2" }}
              className="blog-hero-card">
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#c9a84c", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", padding: "4px 12px", borderRadius: 20, marginBottom: 20 }}>New · June 2026</span>
              <h3 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 800, color: "white", marginBottom: 10, lineHeight: 1.25 }}>UK Property Market 2026 — What Investors Need to Know</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Mortgage rates, house prices, rental demand — an honest look at where we are and what it means for your next deal.</p>
            </Link>
            <Link href="/blog/brrr-strategy-explained" style={{ background: "#f8f9fc", border: "1.5px solid #e8eaf0", borderRadius: 20, padding: 28, textDecoration: "none", display: "block" }}
              className="hover:border-gold-300 transition-colors">
              <p style={{ fontSize: 11, fontWeight: 600, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Investing</p>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f1b36", lineHeight: 1.35 }}>What Is the BRRR Strategy?</h3>
            </Link>
            <Link href="/blog/guaranteed-rent-explained" style={{ background: "#f8f9fc", border: "1.5px solid #e8eaf0", borderRadius: 20, padding: 28, textDecoration: "none", display: "block" }}
              className="hover:border-gold-300 transition-colors">
              <p style={{ fontSize: 11, fontWeight: 600, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Landlords</p>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f1b36", lineHeight: 1.35 }}>Guaranteed Rent — Is It Worth It?</h3>
            </Link>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── QUICK LINKS ───────────────────────────────────── */}
      <section style={{ background: "#f8f9fc", borderTop: "1px solid #e8eaf0", padding: "60px 0" }}>
        <div className="container-max px-4">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 40, fontSize: 14 }}>
            {[
              { title: "For Landlords", links: [
                { href: "/guaranteed-rent", label: "Guaranteed Rent" },
                { href: "/landlord-hub", label: "Compliance Guide" },
                { href: "/renting-strategies", label: "Renting Strategies" },
                { href: "/templates", label: "Templates" },
              ]},
              { title: "For Investors", links: [
                { href: "/property-investing", label: "Investment Guides" },
                { href: "/calculators", label: "All 17 Calculators" },
                { href: "/glossary", label: "Property Glossary" },
                { href: "/blog", label: "Blog" },
              ]},
              { title: "For Buyers", links: [
                { href: "/first-time-buyer", label: "First-Time Buyers" },
                { href: "/mortgages", label: "Mortgages" },
                { href: "/calculators/stamp-duty", label: "Stamp Duty" },
                { href: "/search", label: "Property Search" },
              ]},
              { title: "Resources", links: [
                { href: "/areas", label: "Area Guides" },
                { href: "/tools", label: "Property Tools" },
                { href: "/sold-prices", label: "Sold Prices" },
                { href: "/contact", label: "Contact" },
              ]},
            ].map(group => (
              <div key={group.title}>
                <h3 style={{ fontWeight: 700, color: "#0f1b36", marginBottom: 14, fontSize: 13 }}>{group.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {group.links.map(link => (
                    <li key={link.href}><Link href={link.href} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }} className="hover:text-navy-800 transition-colors">{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section style={{ background: "#0f1b36", padding: "80px 0" }}>
        <div className="container-max px-4" style={{ textAlign: "center" }}>
          <FadeIn>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Get started</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "white", marginBottom: 16, letterSpacing: "-0.01em" }}>
              Start making smarter<br />
              <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>property decisions.</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 36, fontSize: 15, maxWidth: 400, margin: "0 auto 36px" }}>Free forever. No sign-up. No paywalls. No catch.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/calculators" className="btn-gold">Explore calculators</Link>
              <Link href="/guaranteed-rent" style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", padding: "12px 24px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, textDecoration: "none" }}>
                Guaranteed rent →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
