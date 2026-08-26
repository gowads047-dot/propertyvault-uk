"use client";

import { useState } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "🇬🇧",
    title: "UK Property Listings",
    desc: "Buy, rent, and find rooms across the UK. From Birmingham to London, Manchester to Nottingham — properties listed in English and Arabic for the Arab diaspora community.",
  },
  {
    icon: "🇲🇦",
    title: "Morocco Listings",
    desc: "Marrakech, Casablanca, Agadir, Rabat — buy or invest in Moroccan property, with pricing shown in both GBP and MAD.",
  },
  {
    icon: "🌍",
    title: "North Africa & Middle East",
    desc: "Egypt, UAE, and beyond. Makan is building the first bilingual property platform connecting the Arab world diaspora in the UK to investment opportunities back home.",
  },
  {
    icon: "🌐",
    title: "Fully Bilingual",
    desc: "Every listing, every search, every message — available in Arabic and English. Right-to-left layout fully supported. No more translating your own home search.",
  },
  {
    icon: "🔍",
    title: "Smart Bilingual Search",
    desc: "Search in Arabic or English and get the same results. Makan's search will read both languages natively — no clunky auto-translation.",
  },
  {
    icon: "✅",
    title: "Verified Landlords",
    desc: "Landlords and agents will be identity-checked before they can list, so a listing means a real property with a real person behind it.",
  },
  {
    icon: "💬",
    title: "Message in Your Language",
    desc: "Contact landlords and agents directly in Arabic or English via in-app messaging. No awkward Google Translate conversations.",
  },
  {
    icon: "🆓",
    title: "Free to List",
    desc: "Landlords and agents will list for free. Always. Makan will make its money on premium placements and featured listings — never by charging the people listing their properties.",
  },
];

const MARKETS = [
  { flag: "🇬🇧", country: "United Kingdom", cities: ["London", "Birmingham", "Manchester", "Nottingham", "Derby", "Leicester", "Sheffield", "Leeds", "Bradford"], status: "Launching first" },
  { flag: "🇲🇦", country: "Morocco", cities: ["Marrakech", "Casablanca", "Agadir", "Rabat", "Fez", "Tangier"], status: "Phase 2" },
  { flag: "🇪🇬", country: "Egypt", cities: ["Cairo", "Alexandria", "El Gouna", "New Cairo"], status: "Phase 3" },
  { flag: "🇦🇪", country: "UAE", cities: ["Dubai", "Abu Dhabi", "Sharjah"], status: "Future" },
];

export default function MakanPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Makan Waitlist", email: email.trim(), user_type: "makan_waitlist" }),
    }).catch(() => {});
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Dual glow — left blue for UK, right gold for MENA */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 65%)" }} />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 65%)" }} />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-sm font-semibold tracking-wide">COMING SOON — JOIN THE WAITLIST</span>
          </div>

          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#c9a84c]/30 to-blue-500/20 border border-[#c9a84c]/30 mb-4">
              <span className="text-4xl font-black" style={{ fontFamily: "serif", color: "var(--gold-ink)" }}>م</span>
            </div>
            <div className="flex items-baseline justify-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight" style={{ fontFamily: "serif" }}>مكان</h1>
              <span className="text-white/55 text-2xl">·</span>
              <h1 className="text-4xl font-black text-white tracking-tight">MAKAN</h1>
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => setLang("en")} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${lang === "en" ? "bg-[#c9a84c] text-[#0a1628]" : "bg-white/10 text-white/60"}`}>English</button>
            <button onClick={() => setLang("ar")} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${lang === "ar" ? "bg-[#c9a84c] text-[#0a1628]" : "bg-white/10 text-white/60"}`}>العربية</button>
          </div>

          {lang === "en" ? (
            <>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                The First Bilingual Property<br />
                Platform for the <span className="text-[#c9a84c]">Arab Diaspora</span>
              </h2>
              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Search for homes, rooms, and investment properties in the UK, Morocco, Egypt and beyond — in Arabic or English. One platform. Two languages. Your community.
              </p>
            </>
          ) : (
            <div dir="rtl">
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5" style={{ fontFamily: "serif" }}>
                المنصة العقارية الأولى<br />
                <span className="text-[#c9a84c]">للجالية العربية</span> في بريطانيا
              </h2>
              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                ابحث عن منازل وغرف وعقارات للاستثمار في المملكة المتحدة والمغرب ومصر وما بعدها — بالعربية أو الإنجليزية. منصة واحدة. لغتان. مجتمعك.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[["2", "Countries at launch"], ["🇬🇧🇲🇦", "UK & Morocco"], ["عربي", "Arabic-first"], ["Free", "To list"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-black text-[#c9a84c]">{v}</p>
                <p className="text-white/55 text-xs">{l}</p>
              </div>
            ))}
          </div>

          {/* Waitlist */}
          {submitted ? (
            <div className="bg-[#c9a84c]/15 border border-[#c9a84c]/40 rounded-2xl px-8 py-6 max-w-md mx-auto">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-white text-lg">You&apos;re on the list!</p>
              <p className="text-white/55 text-sm mt-1" dir="ltr">We&apos;ll notify you the moment Makan goes live.</p>
              {lang === "ar" && <p className="text-white/55 text-sm mt-1" dir="rtl">سنُعلمك فور إطلاق منصة مكان.</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === "ar" ? "بريدك الإلكتروني" : "your@email.com"}
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a84c]/60 focus:bg-white/15 transition-all" />
              <button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap">
                {lang === "ar" ? "انضم للقائمة" : "Notify Me →"}
              </button>
            </form>
          )}
          <p className="text-white/55 text-xs mt-3">{lang === "ar" ? "لا رسائل مزعجة. إلغاء الاشتراك في أي وقت." : "No spam. Unsubscribe any time."}</p>
        </div>
      </section>

      {/* WHAT IS MAKAN */}
      <section className="bg-[#0f1b36] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">What is Makan?</p>
            <h2 className="text-3xl font-black text-white mb-5">Property Search Built for a Community That Was Ignored</h2>
            <div className="space-y-4 text-white/70 leading-relaxed text-sm">
              <p>There are over <strong className="text-white">600,000 Arab-speaking people</strong> living in the UK — and until now, every property platform assumed they only spoke English and only wanted properties in one country.</p>
              <p>Makan is built for the Arab diaspora. Whether you&apos;re a family in Birmingham searching for a home, an investor comparing yields in Nottingham vs Marrakech, or a student looking for a room near your university — Makan speaks your language.</p>
              <p>Listings are available in <strong className="text-white">Arabic and English</strong>. Landlords are <strong className="text-white">verified</strong>. And it&apos;s completely <strong className="text-white">free to list</strong>.</p>
            </div>
          </div>
          {/* Bilingual comparison */}
          <div className="space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white/55 text-xs uppercase tracking-wider mb-3">Other platforms</p>
              <ul className="space-y-2 text-sm text-white/60">
                {["English only", "UK properties only", "No understanding of Arab market needs", "Expensive listing fees for landlords", "No bilingual support or messaging"].map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-red-400">✗</span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-5">
              <p className="text-[#c9a84c] text-xs uppercase tracking-wider font-bold mb-3">مكان / Makan</p>
              <ul className="space-y-2 text-sm text-white/75">
                {["Arabic & English — fully bilingual", "UK, Morocco, Egypt and expanding", "Built by and for the community", "Always free to list", "Message landlords in your language"].map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-green-400">✓</span>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Planned At Launch</p>
            <h2 className="text-3xl font-black text-white">What Makan Will Do</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#c9a84c]/30 transition-colors">
                <span className="text-3xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section className="bg-[#0f1b36] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Where We&apos;re Launching</p>
            <h2 className="text-3xl font-black text-white">From the UK to North Africa and Beyond</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKETS.map((m) => (
              <div key={m.country} className={`rounded-2xl p-5 border ${m.status === "Launching first" ? "border-[#c9a84c]/40 bg-[#c9a84c]/10" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{m.flag}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.status === "Launching first" ? "bg-[#c9a84c]/20 text-[#d6ba66]" : "bg-white/10 text-white/55"}`}>{m.status}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{m.country}</h3>
                <div className="flex flex-wrap gap-1">
                  {m.cities.map((c) => (
                    <span key={c} className="text-xs text-white/55 bg-white/5 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Who Makan Is For</p>
            <h2 className="text-3xl font-black text-white">Built for Your Community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "🏠", who: "Renters & Buyers", desc: "Arab-speaking families and individuals looking for homes and rooms in the UK — in a platform that speaks their language and understands their needs." },
              { icon: "💰", who: "UK-Based Investors", desc: "Arab diaspora investors comparing UK and MENA opportunities — yield analysis, bilingual listings, and a community of like-minded property investors." },
              { icon: "📋", who: "Landlords & Agents", desc: "Property professionals who want to reach the large, underserved Arab-speaking tenant and buyer market in the UK. List for free, reach more people." },
            ].map((c) => (
              <div key={c.who} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#c9a84c]/30 transition-colors">
                <span className="text-4xl block mb-4">{c.icon}</span>
                <h3 className="font-bold text-white mb-2">{c.who}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#0f1b36] py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-4" style={{ fontFamily: "serif" }}>مكان</div>
          <h2 className="text-3xl font-black text-white mb-3">Be First Through the Door</h2>
          <p className="text-white/55 mb-8">Join the waitlist and be notified the moment Makan launches. Early users get priority listing placement.</p>
          {submitted ? (
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl px-8 py-6">
              <p className="font-bold text-white text-lg">You&apos;re on the list 🎉</p>
              <p className="text-white/55 text-sm mt-1">We&apos;ll be in touch very soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a84c]/60 transition-all" />
              <button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap">Join Waitlist</button>
            </form>
          )}
          <div className="mt-10 pt-8 border-t border-white/10">
            <Link href="/" className="text-white/55 hover:text-white/70 text-sm transition-colors">← Back to PropertyVault</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
