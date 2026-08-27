"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The Makan front door.
 *
 * This page used to be a coming-soon waitlist for a bilingual diaspora
 * platform, sitting in front of a working product at other URLs — the only way
 * to find search or the Wanted board was to know the address.
 *
 * The proposition is now the one an estate agent creates by accident. Ring an
 * agent about a four-bed for supported living and they say no on the spot,
 * without asking the landlord, because a company let replaces their ongoing
 * management fee with a one-off tenant-find fee at best. The landlord never
 * hears the offer existed, even when the property has been empty for weeks.
 *
 * Two rules for the copy here:
 *   - Only claim what is built. Search, the Wanted board, listing and
 *     enquiries are live; photos-as-reels, verification and alerts are not, and
 *     nothing on this page implies otherwise.
 *   - No unsourced numbers. The previous version asserted "over 600,000
 *     Arab-speaking people living in the UK" with no citation.
 */

const OPERATOR_TYPES = [
  { icon: "🏨", title: "Serviced accommodation", body: "Companies running short stays who need whole properties on multi-year leases." },
  { icon: "🤝", title: "Supported living", body: "Providers housing people who need support, usually on long leases with guaranteed rent." },
  { icon: "🛏", title: "HMO operators", body: "Room-by-room operators looking for houses they can manage end to end." },
  { icon: "👥", title: "Tenants", body: "People looking for a room, a studio or a whole place — direct, no agency fee." },
];

const STEPS = [
  { n: "1", title: "Post it in about three minutes", body: "Postcode, type, rent. Photos and the rest can wait — you can publish first and fill in the detail after." },
  { n: "2", title: "Say who you'd let to", body: "Tenants, companies, or both. One tick is what puts your property in front of operators an agent would have turned away." },
  { n: "3", title: "They message you directly", body: "No agent in the middle taking a cut or deciding on your behalf. You can see when your message has been read." },
];

export default function MakanPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");

  return (
    <main style={{ background: "var(--h-bg)" }}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6" style={{ background: "var(--h-ink-deep)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(232,139,98,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(232,139,98,0.05) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex items-baseline justify-center gap-3 mb-6">
            <span className="text-3xl font-black text-white" style={{ fontFamily: "serif" }}>مكان</span>
            <span className="text-white/55 text-xl">·</span>
            <span className="text-3xl font-black text-white tracking-tight">MAKAN</span>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {(["en", "ar"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                      className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: lang === l ? "var(--h-accent)" : "rgba(255,255,255,0.1)",
                        color: lang === l ? "#ffffff" : "var(--h-on-ink-muted)",
                      }}>
                {l === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>

          {lang === "en" ? (
            <>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white">
                List once.<br />
                Tenants <span style={{ color: "var(--h-accent-on-ink)" }}>and companies</span> both see it.
              </h1>
              <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "var(--h-on-ink-muted)" }}>
                Rooms, studios and whole properties. Long lets and company lets — including the
                serviced-accommodation and supported-living companies an estate agent would have
                turned down on your behalf.
              </p>
            </>
          ) : (
            <div dir="rtl">
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white" style={{ fontFamily: "serif" }}>
                اعرض عقارك مرة واحدة.<br />
                <span style={{ color: "var(--h-accent-on-ink)" }}>المستأجرون والشركات</span> يرونه معاً.
              </h1>
              <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "var(--h-on-ink-muted)" }}>
                غرف واستوديوهات وعقارات كاملة. إيجارات طويلة وإيجارات للشركات — بما في ذلك شركات
                الإقامة المخدومة والسكن المدعوم التي كان الوكيل العقاري سيرفضها نيابة عنك.
              </p>
            </div>
          )}

          {/* The two doors. Everything else on this page is secondary. */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <Link href="/makan/list"
                  className="flex-1 rounded-2xl px-6 py-5 font-bold text-lg transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--h-accent)", color: "#ffffff" }}>
              I have a property
              <span className="block text-sm font-normal mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                Free to list, no agent
              </span>
            </Link>
            <Link href="/makan/rooms"
                  className="flex-1 rounded-2xl px-6 py-5 font-bold text-lg text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
              I&apos;m looking
              <span className="block text-sm font-normal mt-0.5" style={{ color: "var(--h-on-ink-muted)" }}>
                Rooms, studios, whole places
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── The problem. The sharpest thing on the page. ── */}
      <section className="py-20 px-6" style={{ background: "var(--h-ink)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--h-accent-on-ink)" }}>
            Why Makan exists
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white leading-tight">
            Your agent has been saying no on your behalf
          </h2>
          <div className="text-lg leading-relaxed space-y-4" style={{ color: "var(--h-on-ink-muted)" }}>
            <p>
              Ring an agent about a four-bed for supported living or serviced accommodation and the
              answer is no. Not after they&apos;ve asked the landlord — instead of asking them.
            </p>
            <p>
              There&apos;s a reason, and it isn&apos;t the property. A company let means the
              landlord signs a multi-year lease directly with an operator, and the agent&apos;s
              monthly management fee goes with it.
            </p>
            <p style={{ color: "#ffffff" }}>
              So the offer stops at the phone. The landlord carries on paying for an empty property
              and never learns that anybody wanted it.
            </p>
            <p>
              Makan takes that decision back off the agent. Both sides say what they would consider,
              and they find each other directly.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "var(--h-bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--h-accent-hover)" }}>
              For landlords
            </p>
            <h2 className="text-3xl font-black" style={{ color: "var(--h-text)" }}>
              Three minutes, no agent, no fee
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map(s => (
              <div key={s.n} className="rounded-2xl p-6"
                   style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <p className="text-3xl font-black mb-3" style={{ color: "var(--h-accent)" }}>{s.n}</p>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--h-text)" }}>{s.title}</h3>
                <p className="text-sm m-0" style={{ color: "var(--h-muted)" }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/makan/list" className="h-btn h-btn-primary">List a property — free</Link>
          </div>
        </div>
      </section>

      {/* ── Who is looking ────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "var(--h-warm)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--h-accent-hover)" }}>
              Who sees your listing
            </p>
            <h2 className="text-3xl font-black mb-3" style={{ color: "var(--h-text)" }}>
              Not just tenants
            </h2>
            <p className="text-base max-w-xl mx-auto m-0" style={{ color: "var(--h-muted)" }}>
              Say yes to company lets and your property reaches businesses that take whole
              properties on long leases.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {OPERATOR_TYPES.map(o => (
              <div key={o.title} className="flex gap-4 rounded-2xl p-6"
                   style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <span className="text-2xl shrink-0" aria-hidden="true">{o.icon}</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{o.title}</h3>
                  <p className="text-sm m-0" style={{ color: "var(--h-muted)" }}>{o.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Looking for something? ────────────────────── */}
      <section className="py-20 px-6" style={{ background: "var(--h-bg)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl p-8" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Looking for a place</h3>
            <p className="text-sm mb-5" style={{ color: "var(--h-muted)" }}>
              Rooms, studios and whole properties, each showing when the landlord last confirmed it
              was still available — so you&apos;re not enquiring about something that went weeks ago.
            </p>
            <Link href="/makan/rooms" className="h-btn h-btn-primary">Search</Link>
          </div>

          <div className="rounded-2xl p-8" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Can&apos;t find it? Post what you need</h3>
            <p className="text-sm mb-5" style={{ color: "var(--h-muted)" }}>
              Operators and tenants can post what they&apos;re after — &ldquo;four-bed wanted in
              Sandwell, supported living, three-year lease&rdquo; — and landlords answer directly.
            </p>
            <Link href="/makan/wanted" className="h-btn h-btn-secondary">The Wanted board</Link>
          </div>
        </div>
      </section>

      {/* ── Bilingual, as a feature rather than the pitch ── */}
      <section className="py-16 px-6" style={{ background: "var(--h-warm)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-3xl mb-3" style={{ fontFamily: "serif", color: "var(--h-text)" }}>مكان</p>
          <h2 className="text-2xl font-black mb-3" style={{ color: "var(--h-text)" }}>
            Makan means place
          </h2>
          <p className="text-base m-0" style={{ color: "var(--h-muted)" }}>
            Built in the Midlands, and bilingual from the start — English and Arabic, with
            right-to-left throughout. If you&apos;re buying or letting across the UK, Morocco, Egypt
            or the Gulf, there are guides for that too.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href="/makan/gcc" className="h-btn h-btn-secondary !py-2 !text-sm">Buying from the Gulf</Link>
            <Link href="/makan/compliance" className="h-btn h-btn-secondary !py-2 !text-sm">Country-by-country rules</Link>
          </div>
        </div>
      </section>

      {/* ── Close ─────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "var(--h-ink-deep)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white leading-tight">
            See the offers your agent turned down
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--h-on-ink-muted)" }}>
            Free to list. No commission, no tie-in, and you can take it down whenever you like.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/makan/list" className="rounded-xl px-7 py-4 font-bold"
                  style={{ background: "var(--h-accent)", color: "#ffffff" }}>
              List your property
            </Link>
            <Link href="/makan/rooms" className="rounded-xl px-7 py-4 font-bold text-white"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
              Browse what&apos;s there
            </Link>
          </div>
          <p className="text-sm mt-8 mb-0">
            <Link href="/" style={{ color: "var(--h-on-ink-muted)" }}>← Back to PropertyVault</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
