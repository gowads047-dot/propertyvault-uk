"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

const MODULES = [
  { n: "01", title: "Introduction to Deal Sourcing", desc: "What deal sourcing is, how the industry works, and what you need to get started legally." },
  { n: "02", title: "Property Strategies", desc: "Buy to Let, BRRR, HMO, Commercial Conversions, Serviced Accommodation, and Rent to Rent — in depth." },
  { n: "03", title: "Finding Motivated Sellers", desc: "Where to find off-market deals — probate, divorce, auctions, developers, and direct-to-vendor." },
  { n: "04", title: "Lead Generation Systems", desc: "Build automated pipelines using social media, Google Ads, letter drops, and agent relationships." },
  { n: "05", title: "Property Analysis Mastery", desc: "Run the numbers on any deal — yield, cash flow, ROI, stress tests, and exit modelling." },
  { n: "06", title: "Investor Psychology", desc: "Understand what investors want, how they think, and how to build trust before the first call." },
  { n: "07", title: "Deal Packaging", desc: "Turn an analysed deal into a professional investor pack that stands out and gets accepted." },
  { n: "08", title: "Building Investor Relationships", desc: "Build a buyers list, nurture contacts, and create investors who come back deal after deal." },
  { n: "09", title: "Negotiation Skills", desc: "Negotiate with sellers, agents, and investors. Scripts, tactics, and real conversation breakdowns." },
  { n: "10", title: "Closing Sourcing Fees", desc: "How to price your fee, present it confidently, and close without discounting yourself." },
  { n: "11", title: "Compliance & Legal", desc: "FCA awareness, property redress schemes, GDPR, AML, KYC, and your sourcing contracts." },
  { n: "12", title: "Scaling Your Business", desc: "Systems, VA hiring, CRM setup, and how to go from solo sourcer to a team doing £10k+ months." },
];

const PLAYBOOKS = [
  "How to Source a Buy to Let Deal",
  "How to Source a BRRR Deal",
  "How to Source an HMO Deal",
  "How to Source Off-Market Deals",
  "How to Build a Buyers List",
  "How to Package a Deal",
  "How to Sell a Deal",
  "How to Scale to £5,000+ Per Month",
];

const REVIEWS = [
  { name: "James T.", role: "First-time sourcer, Birmingham", text: "Packaged my first deal within 3 weeks of joining. The scripts alone are worth ten times the monthly fee.", stars: 5 },
  { name: "Priya M.", role: "Former letting agent, Manchester", text: "The compliance module answered every question I had about operating legally. I finally felt confident to start.", stars: 5 },
  { name: "Dean W.", role: "Side hustle sourcer, Leeds", text: "I'd watched loads of YouTube videos and got nowhere. The 7-day challenge got me moving in a week.", stars: 5 },
];

export default function AcademyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, userId: user?.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: "#0a0f1e", color: "white", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a3a 50%, #0a0f1e 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 13, color: "#d4af37", fontWeight: 600, marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d4af37", display: "inline-block", animation: "pulse 2s infinite" }} />
            Now Open — £14.99/month
          </div>
          <h1 style={{ fontSize: "clamp(36px,6vw,64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: "var(--font-family-heading)" }}>
            Deal Sourcing<br />
            <span style={{ color: "#d4af37" }}>Academy</span>
          </h1>
          <p style={{ fontSize: "clamp(16px,2.5vw,20px)", color: "rgba(255,255,255,0.7)", maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.6 }}>
            The complete learning platform for aspiring property deal sourcers. From zero to your first sourcing fee — with courses, playbooks, scripts, tools, and a community of doers.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>
            Educational content and tools only. Not financial advice. Results vary.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{ background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 18, padding: "16px 48px", borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, letterSpacing: "-0.3px" }}
            >
              {loading ? "Redirecting..." : "Start Learning — £14.99/month"}
            </button>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Cancel anytime. No contracts. Secure checkout via Stripe.</p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "rgba(212,175,55,0.08)", borderTop: "1px solid rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(212,175,55,0.15)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
          {[
            ["12", "Course Modules"],
            ["8", "Playbooks"],
            ["100+", "Scripts & Templates"],
            ["50+", "AI Prompts"],
            ["17+", "Calculators & Tools"],
            ["7-Day", "Quick Start Challenge"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#d4af37" }}>{val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section style={{ padding: "72px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>Everything You Need to Source Your First Deal</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>One platform. No upsells. No gatekeeping.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {[
            { icon: "🎓", title: "12-Module Masterclass", desc: "Complete deal sourcing education from fundamentals to scaling a £10k+/month business." },
            { icon: "⚡", title: "7-Day First Deal Challenge", desc: "Action-focused daily missions that take you from beginner to investor-ready in one week." },
            { icon: "📋", title: "8 Strategy Playbooks", desc: "Step-by-step guides for BTL, BRRR, HMO, off-market, packaging, selling, and scaling." },
            { icon: "🗣️", title: "100+ Sales Scripts", desc: "Word-for-word scripts for sellers, agents, investors, objection handling, and closing fees." },
            { icon: "🤖", title: "AI Prompts Library", desc: "50+ ready-to-use AI prompts for deal analysis, investor packs, emails, and social content." },
            { icon: "📊", title: "Calculators & Tools", desc: "Deal analyser, ROI calculator, cash flow tool, yield calculator, BRRR modeller and more." },
            { icon: "📁", title: "Downloads Library", desc: "Investor pack templates, CRM tracker, compliance checklists, presentation decks and more." },
            { icon: "⚖️", title: "Legal & Compliance Hub", desc: "Plain-English guidance on operating as a deal sourcer — FCA awareness, contracts, GDPR." },
            { icon: "🏘️", title: "Real Deal Examples", desc: "Worked examples of BTL, BRRR, HMO, and commercial deals with all the numbers." },
          ].map(item => (
            <div key={item.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7-DAY CHALLENGE */}
      <section style={{ padding: "72px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: "#d4af37", fontWeight: 600, marginBottom: 16 }}>FIRST DEAL CHALLENGE</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-family-heading)" }}>7 Days to Investor-Ready</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>Action every day. No theory without practice.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Day 1", "Understand Deal Sourcing", "The business model, legal framework, and what makes a good deal sourcer."],
              ["Day 2", "Find Potential Deals", "Use Rightmove, Zoopla, agents, and off-market sources to build your first pipeline."],
              ["Day 3", "Analyse Opportunities", "Run the numbers on 3 real deals using our calculators. Know what works."],
              ["Day 4", "Build Your Buyer Database", "Find 10 active property investors and add them to your CRM."],
              ["Day 5", "Create Your First Investor Pack", "Use our template to package one of the deals you analysed."],
              ["Day 6", "Present to Investors", "Send your pack to 3 investors using the exact email script provided."],
              ["Day 7", "Close Your First Deal", "Follow up, handle objections, and secure your first reservation agreement."],
            ].map(([day, title, desc], i) => (
              <div key={day} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ minWidth: 60, height: 44, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#d4af37", flexDirection: "column" }}>
                  <span>DAY</span><span style={{ fontSize: 18 }}>{i + 1}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSE MODULES */}
      <section style={{ padding: "72px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: "#60a5fa", fontWeight: 600, marginBottom: 16 }}>DEAL SOURCING MASTERCLASS</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-family-heading)" }}>12 Modules. Zero Fluff.</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>Every module ends with a real-world action task.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          {MODULES.map(m => (
            <div key={m.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20, display: "flex", gap: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#d4af37", opacity: 0.6, minWidth: 28, paddingTop: 2 }}>M{m.n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLAYBOOKS */}
      <section style={{ padding: "72px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>8 Implementation Playbooks</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>Step-by-step guides with scripts, checklists, and templates for every strategy.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            {PLAYBOOKS.map((p, i) => (
              <div key={p} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "center", textAlign: "left" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#d4af37", opacity: 0.5 }}>0{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "72px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 40, fontFamily: "var(--font-family-heading)" }}>What Members Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {REVIEWS.map(r => (
            <div key={r.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
              <div style={{ color: "#d4af37", marginBottom: 12, fontSize: 16 }}>{"★".repeat(r.stars)}</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 16 }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING CTA */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, #0d1a3a, #0a0f1e)", borderTop: "1px solid rgba(212,175,55,0.15)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(212,175,55,0.3)", borderRadius: 24, padding: "40px 32px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#d4af37", letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>Deal Sourcing Academy</div>
            <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>£14.99</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 32 }}>per month — cancel anytime</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, textAlign: "left" }}>
              {["12-module Deal Sourcing Masterclass", "7-Day First Deal Challenge", "8 implementation playbooks", "100+ sales scripts", "50+ AI prompts", "Calculators & deal tools", "Downloads library (templates, trackers)", "Legal & compliance hub", "Real deal examples", "Monthly new content"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
                  <span style={{ color: "#d4af37", fontWeight: 700 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{ width: "100%", background: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 17, padding: "15px 0", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Redirecting..." : "Join the Academy →"}
            </button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
              Educational platform. Not financial advice. 14-day cancellation right under UK consumer law.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "72px 24px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 32, fontFamily: "var(--font-family-heading)" }}>Common Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            ["Is this legal to do?", "Yes. Selling educational content is entirely legal. The Academy teaches you skills, provides tools, and gives you the knowledge to pursue deal sourcing. Whether you go on to operate as a deal sourcer is your decision — and we cover exactly what compliance steps you'll need to take in Module 11."],
            ["Do I need any experience?", "No. The Academy is built for complete beginners. The 7-Day Challenge is designed to get you from zero to investor-ready in a week."],
            ["Can I cancel anytime?", "Yes. Cancel with one click at any time — no penalties, no questions. Under UK consumer law you also have a 14-day cooling-off period from sign-up."],
            ["Is this financial advice?", "No. The Academy provides education, tools, and templates. Nothing here constitutes financial, investment, or legal advice. Always seek independent professional advice before making property or financial decisions."],
            ["How is this different from YouTube?", "The Academy is structured, sequential, and action-focused. Every module ends with a task. You get scripts, templates, and tools you can use immediately — not just theory."],
          ].map(([q, a]) => (
            <div key={q as string} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{q}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{a}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        Deal Sourcing Academy is an educational platform. It does not constitute financial, investment, or legal advice. Results vary. Deal sourcers operating commercially must ensure compliance with applicable FCA rules and property redress scheme requirements. &copy; {new Date().getFullYear()} PropertyVault UK.
        <br /><Link href="/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline", marginRight: 12 }}>Privacy Policy</Link>
        <Link href="/terms" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>Terms</Link>
      </footer>
    </div>
  );
}
