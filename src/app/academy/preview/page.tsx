import Link from "next/link";

const MODULES = [
  { n: "01", title: "Introduction to Deal Sourcing", lessons: ["What is a Deal Sourcer?", "How Sourcing Fees Work", "The Deal Pipeline Overview", "Legal Considerations Intro", "Your 90-Day Action Plan"] },
  { n: "02", title: "Property Strategies", lessons: ["Buy to Let Deep Dive", "BRRR Strategy Explained", "HMO Licensing & Returns", "Commercial to Residential Conversions", "Serviced Accommodation (SA)", "Rent to Rent (R2R)"] },
  { n: "03", title: "Finding Motivated Sellers", lessons: ["Types of Motivated Sellers", "Probate & Inheritance Leads", "Divorce & Repossession Leads", "Developer & Builder Leads", "The 'Just Listed' Strategy", "Building Agent Relationships"] },
  { n: "04", title: "Lead Generation Systems", lessons: ["Facebook & Instagram Lead Ads", "Google Local Ads Basics", "Letter Drop Campaigns", "LinkedIn for Investor Leads", "Property Networking Events", "Referral Systems"] },
  { n: "05", title: "Property Analysis Mastery", lessons: ["Gross vs Net Yield", "Cash Flow Modelling", "ROI & Capital Growth", "BRRR Numbers Walkthrough", "HMO Yield Analysis", "Deal Stress Testing"] },
  { n: "06", title: "Investor Psychology", lessons: ["The Investor Mindset", "What Investors Fear Most", "How to Build Credibility Fast", "The Know-Like-Trust Framework", "Investor Communication Styles", "Long-Term Relationship Building"] },
  { n: "07", title: "Deal Packaging", lessons: ["Anatomy of an Investor Pack", "Property Summary Page", "Financial Breakdown", "Refurbishment Scope", "Comparables Evidence", "Area Research", "Exit Strategy Options"] },
  { n: "08", title: "Building Investor Relationships", lessons: ["Where to Find Investors", "Investor Qualification Questions", "Building Your CRM", "Segmenting Your Buyers List", "The 90-Day Follow-Up Sequence", "Social Media Presence for Sourcers"] },
  { n: "09", title: "Negotiation Skills", lessons: ["The Negotiation Mindset", "Seller Negotiation Tactics", "Agent Relationship Negotiation", "Investor Fee Negotiation", "Anchoring & Framing Techniques", "Silence as a Tool"] },
  { n: "10", title: "Closing Sourcing Fees", lessons: ["How to Price Your Sourcing Fee", "Presenting Your Fee to Investors", "The Reservation Agreement Explained", "Getting Paid — Process & Timing", "Handling Fee Objections", "Repeat Business & Referrals"] },
  { n: "11", title: "Compliance & Legal Requirements", lessons: ["FCA Awareness for Sourcers", "Property Redress Schemes Explained", "Anti-Money Laundering (AML) Basics", "Know Your Customer (KYC)", "GDPR for Sourcers", "Sourcing Contracts & Agreements"] },
  { n: "12", title: "Scaling Your Deal Sourcing Business", lessons: ["The Solo-to-Team Transition", "Building Standard Operating Procedures", "Hiring Your First VA", "CRM & Pipeline Automation", "Monthly Income Targets & Tracking", "The £10k/Month Roadmap"] },
];

const CHALLENGE = [
  { day: 1, title: "Understand Deal Sourcing", preview: "The business model, income potential, legal framework, and mindset of a professional deal sourcer." },
  { day: 2, title: "Find Potential Deals", preview: "Use Rightmove, Zoopla, estate agents, and direct-to-vendor methods to build your first pipeline." },
  { day: 3, title: "Analyse Opportunities", preview: "Run the full numbers on each deal — yield, cash flow, ROI, stress test, and area benchmarks." },
  { day: 4, title: "Build Your Buyer Database", preview: "Find active property investors on LinkedIn, Facebook Groups, property networking events, and investor forums." },
  { day: 5, title: "Create Your Investor Pack", preview: "Use our template to package your top deal into a professional investor presentation." },
  { day: 6, title: "Present to Investors", preview: "Use the exact email and WhatsApp scripts to present your deal to 3 investors." },
  { day: 7, title: "Review, Reflect, Build the Habit", preview: "What went well? What felt hard? Set your weekly activity targets going forward." },
];

const ALSO_INCLUDED = [
  { icon: "📋", title: "8 Deal Sourcing Playbooks", desc: "Step-by-step systems for BTL, HMO, SA, BRRR, R2R, and off-market strategies." },
  { icon: "✉️", title: "11 Investor Email Templates", desc: "Proven cold outreach, follow-up, and deal presentation emails ready to send." },
  { icon: "📞", title: "Scripts Library", desc: "Word-for-word scripts for estate agents, motivated sellers, and investor calls." },
  { icon: "⚖️", title: "Legal Hub", desc: "Compliance checklist, redress schemes guide, AML basics, and sourcing agreements." },
  { icon: "🧮", title: "Deal Calculator", desc: "BTL, BRRR, HMO, and SA calculators built into your dashboard." },
  { icon: "📁", title: "Downloads & Templates", desc: "Investor packs, lead trackers, CRM templates, reservation agreements, and more." },
  { icon: "🗺️", title: "Area Research Tool", desc: "Research any UK postcode for yield, demand, and comparable sales data." },
  { icon: "💬", title: "Q&A Board", desc: "Post questions. Nass answers personally — no AI, no community moderators." },
];

const C = { gold: "#d4af37", dark: "#0a0f1e" };

export default function AcademyPreviewPage() {
  return (
    <div style={{ background: C.dark, minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>
      <style>{`
        body > header, body > footer { display: none !important; }
        .lesson-locked { filter: blur(3px); user-select: none; pointer-events: none; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(10,15,30,0.95)", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <Link href="/academy" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.gold},#f0d060)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
          <span style={{ fontWeight: 900, fontSize: 16, color: "white" }}>Deal Sourcing Academy</span>
        </Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/academy/auth" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Log in</Link>
          <Link href="/academy/join" style={{ background: `linear-gradient(135deg,${C.gold},#f0d060)`, color: C.dark, fontWeight: 800, fontSize: 13, padding: "8px 20px", borderRadius: 10, textDecoration: "none" }}>Join — £14.99/mo →</Link>
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "72px 24px 56px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>Course Preview</span>
        </div>
        <h1 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", fontFamily: "var(--font-family-heading)", marginBottom: 16 }}>
          Everything inside the<br /><span style={{ color: C.gold }}>Deal Sourcing Academy</span>
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 32 }}>
          12 modules. 80+ lessons. 8 playbooks. Scripts. Templates. Legal hub. Q&A with Nass.<br />One price. No upsells.
        </p>
        <Link href="/academy/join" style={{ display: "inline-flex", background: `linear-gradient(135deg,${C.gold},#f0d060)`, color: C.dark, fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 12, textDecoration: "none" }}>
          Start for £14.99/month →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>Cancel anytime · No refunds · Instant access</p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* 7-DAY CHALLENGE */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em" }}>Start Here</div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>7-Day First Deal Challenge</h2>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 20 }}>Seven days. Seven tasks. Do every step once — so you know exactly what the process feels like.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {CHALLENGE.map((d, i) => (
              <div key={d.day} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < 2 ? `linear-gradient(135deg,${C.gold},#f0d060)` : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i < 2 ? C.dark : "rgba(255,255,255,0.58)", flexShrink: 0 }}>
                    {d.day}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: i < 2 ? "white" : "rgba(255,255,255,0.85)" }}>{d.title}</span>
                </div>
                {i < 2 ? (
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>{d.preview}</p>
                ) : (
                  <div style={{ position: "relative" }}>
                    <p className="lesson-locked" style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>{d.preview}</p>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 11, color: C.gold, fontWeight: 700, background: "rgba(10,15,30,0.8)", padding: "3px 10px", borderRadius: 6 }}>🔒 Members only</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 12 MODULES */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>12-Module Masterclass</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 24 }}>80+ lessons covering every aspect of professional deal sourcing. Every module ends with a real-world task.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MODULES.map((m, mi) => (
              <div key={m.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: mi < 2 ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${mi < 2 ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: mi < 2 ? C.gold : "rgba(255,255,255,0.62)", flexShrink: 0 }}>
                    {m.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: mi < 2 ? "white" : "rgba(255,255,255,0.9)" }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.62)", marginTop: 2 }}>{m.lessons.length} lessons</div>
                  </div>
                  {mi >= 2 && <span style={{ fontSize: 11, color: C.gold, fontWeight: 700, background: "rgba(212,175,55,0.08)", padding: "3px 10px", borderRadius: 6 }}>🔒 Members</span>}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {m.lessons.map((lesson, li) => (
                    <span key={lesson} style={{
                      fontSize: 11, padding: "4px 10px", borderRadius: 6,
                      background: (mi < 2 && li < 2) ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${(mi < 2 && li < 2) ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.06)"}`,
                      color: (mi < 2 && li < 2) ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.62)",
                      filter: mi >= 2 && li >= 1 ? "blur(3.5px)" : "none",
                      userSelect: mi >= 2 && li >= 1 ? "none" : "auto",
                    }}>{lesson}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALSO INCLUDED */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Also included in your membership</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 24 }}>Courses are just the start. Your dashboard gives you access to an entire operating system for deal sourcers.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
            {ALSO_INCLUDED.map(item => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 18px" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.04))", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 20, padding: "48px 36px", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Ready to start?</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>Get full access for £14.99/month</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.7 }}>12 modules. 7-day challenge. Playbooks, scripts, templates, legal hub, Q&A. Everything in one place.</p>
          <Link href="/academy/join" style={{ display: "inline-flex", background: `linear-gradient(135deg,${C.gold},#f0d060)`, color: C.dark, fontWeight: 900, fontSize: 17, padding: "16px 42px", borderRadius: 12, textDecoration: "none" }}>
            Join the Academy →
          </Link>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {["✓ Cancel anytime", "✓ Instant access", "✓ No refunds after payment"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
