"use client";

import { useState } from "react";
import Link from "next/link";

const MODULES = [
  { n: "01", title: "Property Foundations", desc: "How the UK market works, title types, key metrics every investor must know, and the mindset behind successful portfolios." },
  { n: "02", title: "Finding Your Strategy", desc: "BTL, HMO, Rent-to-Rent, Serviced Accommodation, BRRR, Flipping — how to pick the one that fits your capital, time, and goals." },
  { n: "03", title: "Deal Sourcing Mastery", desc: "Where to find off-market deals, how to build agent relationships, direct-to-vendor marketing, and the call scripts that get viewings." },
  { n: "04", title: "Analysing Deals", desc: "Gross yield, net yield, ROI, cash-on-cash return, BRRR recycling — how to stress-test a deal before you spend a penny." },
  { n: "05", title: "Funding Your Deals", desc: "BTL mortgages, bridging loans, JV structures, angel investors, and how to fund your first deal with limited personal capital." },
  { n: "06", title: "HMO Deep Dive", desc: "Licensing, planning, room sizing, fire safety, management, letting to professionals — the complete HMO operating manual." },
  { n: "07", title: "Rent-to-Rent Playbook", desc: "The head lease, mortgage lender consent, phone scripts for agents and landlords, setting up your first R2R deal legally and profitably." },
  { n: "08", title: "Mortgages & Finance", desc: "How BTL mortgages work, Ltd company structures, ICR stress tests, remortgaging to recycle capital, and working with brokers." },
  { n: "09", title: "Legal & Compliance", desc: "Landlord law, Section 8 possession grounds, the Renters' Rights Act 2025, HMO licensing, deposit protection, Right to Rent — know your legal position." },
  { n: "10", title: "Tax Strategy", desc: "Section 24, Ltd company vs personal ownership, CGT, SDLT, allowable expenses — how to legally minimise your tax bill." },
  { n: "11", title: "Scaling Your Portfolio", desc: "Systemising management, building a power team, refinancing, equity release, and going from 1 property to 10." },
  { n: "12", title: "Exit Strategies", desc: "When to sell, lease options, gifting properties, estate planning, and building generational wealth through property." },
];

const FEATURES = [
  { icon: "🎓", title: "12-Module Video Masterclass", desc: "Over 40 hours of structured, no-fluff property education — from total beginner to confident investor. Each module includes video lessons, written summaries, and action steps." },
  { icon: "📞", title: "Done-For-You Scripts", desc: "Word-for-word phone scripts for cold-calling agents, approaching landlords, negotiating prices, and handling objections. The exact scripts we use — ready to go." },
  { icon: "📦", title: "Deal Pack Templates", desc: "Professional offer worksheets, due diligence checklists, deal analysis spreadsheets, viewing reports, and letter-of-intent templates. Download, customise, use." },
  { icon: "⚖️", title: "Legal & Compliance Vault", desc: "Section 8 notices, HMO licence applications, AST templates, guaranteed rent agreements, compliance checklists — fully up to date with the Renters' Rights Act 2025. Section 21 notices are no longer valid." },
  { icon: "💬", title: "Weekly Live Deal Reviews", desc: "Every week, bring a real deal you've found and get it reviewed live. Know exactly whether to proceed, negotiate, or walk — before you commit a penny." },
  { icon: "🤖", title: "AI Prompt Toolkit", desc: "50+ tested ChatGPT and Claude prompts for deal analysis, comparable research, market reports, email drafts, and more. AI-powered property investing." },
  { icon: "🏆", title: "7-Day First Deal Challenge", desc: "A structured challenge to find, analyse, and approach your first potential deal within 7 days of joining. Accountability built in." },
  { icon: "👥", title: "Private Investor Community", desc: "A vetted community of serious UK property investors. Deal sharing, JV opportunities, accountability partners, and direct access to Nass." },
];

export default function AcademyPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Academy Waitlist", email: email.trim(), user_type: "academy_waitlist" }),
    }).catch(() => {});
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(201,168,76,0.1) 0%,transparent 65%)" }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-sm font-semibold tracking-wide">COMING SOON — JOIN THE WAITLIST</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center text-3xl">🎓</div>
            <div className="text-left">
              <p className="text-white/40 text-xs uppercase tracking-widest">PropertyVault</p>
              <p className="text-3xl font-black text-white">Academy</p>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            Everything You Need to Build a<br />
            <span className="text-[#c9a84c]">UK Property Portfolio</span>
          </h1>

          <p className="text-white/65 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            12 modules, done-for-you scripts, legal templates, weekly live deal reviews, and a private investor community. The most practical property education in the UK — all for <strong className="text-white">£14.99/month</strong>.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[["12", "Modules"], ["40+", "Hours of content"], ["£14.99", "Per month"], ["∞", "Cancel anytime"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-3xl font-black text-[#c9a84c]">{v}</p>
                <p className="text-white/50 text-sm">{l}</p>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="bg-[#c9a84c]/15 border border-[#c9a84c]/40 rounded-2xl px-8 py-6 max-w-md mx-auto">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-white text-lg">You&apos;re on the list!</p>
              <p className="text-white/60 text-sm mt-1">We&apos;ll email you the moment Academy goes live — plus early-access pricing.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a84c]/60 focus:bg-white/15 transition-all" />
              <button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap">
                Notify Me →
              </button>
            </form>
          )}
          <p className="text-white/30 text-xs mt-3">No spam. Waitlist members get early-bird pricing locked in for life.</p>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="bg-[#0f1b36] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">What is PropertyVault Academy?</p>
            <h2 className="text-3xl font-black mb-5">Property Education That Actually Gets You to a Deal</h2>
            <div className="space-y-4 text-white/70 leading-relaxed text-sm">
              <p>Most property courses are either <strong className="text-white">too expensive</strong> (£3,000–£10,000 weekends), <strong className="text-white">too vague</strong> (motivational content with no action steps), or <strong className="text-white">hopelessly outdated</strong>.</p>
              <p>PropertyVault Academy is built differently. Every module is written around <strong className="text-white">real deals, real numbers, and real UK legislation</strong> as it stands today. Scripts are tested. Templates are live documents we actually use.</p>
              <p>At £14.99/month, it&apos;s less than a single coffee shop visit per week — and one deal makes it pay for itself for life.</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              "Updated constantly to reflect current legislation (Renters Rights Act, SDLT, ICR)",
              "Written by an active UK investor — not a theorist",
              "Action-first: every module ends with specific tasks, not just knowledge",
              "Scripts and templates you can use on your very first call",
              "A community of serious investors, not hype-merchants",
              "Cancel any time — no 12-month lock-ins",
            ].map((p) => (
              <div key={p} className="flex gap-3 items-start bg-white/5 rounded-xl p-4">
                <span className="text-green-400 shrink-0 font-bold text-sm">✓</span>
                <p className="text-white/75 text-sm">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">The Curriculum</p>
            <h2 className="text-3xl font-black">12 Modules. Zero Fluff.</h2>
            <p className="text-white/50 mt-2">A complete journey from understanding the UK market to building and scaling your portfolio.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m) => (
              <div key={m.n} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#c9a84c] font-black text-xs font-mono bg-[#c9a84c]/10 px-2 py-0.5 rounded">{m.n}</span>
                  <h3 className="font-bold text-white text-sm">{m.title}</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#0f1b36] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Everything Included</p>
            <h2 className="text-3xl font-black">What You Get for £14.99/Month</h2>
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

      {/* WHO IT'S FOR */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Is This For You?</p>
            <h2 className="text-3xl font-black">Academy is Built for People Who Are Serious</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
              <h3 className="text-green-400 font-bold mb-4">✅ This is for you if…</h3>
              <ul className="space-y-3">
                {["You want to invest in UK property but don't know where to start",
                  "You've bought a course before and left with notes but no deal",
                  "You're earning a salary and want to build a passive income alongside it",
                  "You want to understand HMOs, R2R, BTL, and BRRR — and choose the right one",
                  "You want systems, scripts, and templates — not more theory",
                  "You want a community of people actually doing deals, not just talking"].map((p) => (
                  <li key={p} className="flex gap-3 text-white/75 text-sm"><span className="text-green-400 shrink-0">→</span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold mb-4">❌ This is NOT for you if…</h3>
              <ul className="space-y-3">
                {["You're looking for get-rich-quick schemes or overnight results",
                  "You're not willing to put in the research, calls, and legwork",
                  "You want someone to do the deals for you",
                  "You're not serious about taking action within 90 days"].map((p) => (
                  <li key={p} className="flex gap-3 text-white/75 text-sm"><span className="text-red-400 shrink-0">→</span>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#0f1b36] py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="inline-block bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full px-4 py-1.5 text-[#c9a84c] text-sm font-semibold mb-6">Early-bird pricing for waitlist members</span>
          <h2 className="text-3xl font-black mb-3">Be the First to Know When We Launch</h2>
          <p className="text-white/50 mb-8">Waitlist members get early access and a discounted rate locked in forever.</p>
          {submitted ? (
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl px-8 py-6">
              <p className="font-bold text-white text-lg">You&apos;re on the list 🎉</p>
              <p className="text-white/50 text-sm mt-1">We&apos;ll be in touch very soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a84c]/60 transition-all" />
              <button type="submit" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-6 py-3.5 rounded-xl transition-colors whitespace-nowrap">Join Waitlist</button>
            </form>
          )}
          <div className="mt-10 pt-8 border-t border-white/10">
            <Link href="/calculators/deal-analyser" className="text-[#c9a84c] hover:underline text-sm">Use our free Deal Analyser while you wait →</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
