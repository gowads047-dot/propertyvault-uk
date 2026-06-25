"use client";

import { useState } from "react";
import Link from "next/link";

const MODULES = [
  { n: "01", title: "What Deal Sourcing Actually Is", desc: "Not the Instagram version. The real business model — how money moves, who pays who, and why most beginners get this wrong from day one.", tag: "Foundation" },
  { n: "02", title: "Choosing Your Strategy", desc: "BTL, BRRR, HMO, Serviced Accommodation, Rent-to-Rent. We break down each one honestly — the good, the cash requirement, and who it's actually suited for.", tag: "Strategy" },
  { n: "03", title: "Finding Motivated Sellers", desc: "Probate. Divorce. Repossession. Reluctant landlords. These are real people in real situations — and the right approach matters as much as the deal.", tag: "Sourcing" },
  { n: "04", title: "Building Your Lead Pipeline", desc: "Leaflet drops, agent relationships, social media, Google. We cover what works in 2025 — and what's a waste of your Saturday.", tag: "Lead Gen" },
  { n: "05", title: "Running the Numbers Properly", desc: "Yield, ROI, cash flow, BRRR stacking, stress tests. You'll learn to spot a bad deal in 90 seconds — before you waste a viewing.", tag: "Analysis" },
  { n: "06", title: "Understanding Investor Psychology", desc: "What investors are actually scared of. What builds trust before a first call. Why most sourcers lose investors before they even send a deal.", tag: "Investors" },
  { n: "07", title: "Packaging a Deal", desc: "Turn numbers in a spreadsheet into a professional pack that makes an investor say yes. We include a real template you can use today.", tag: "Packaging" },
  { n: "08", title: "Building a Buyers List That Buys", desc: "Not 200 names on a spreadsheet. Real, qualified buyers with capital, strategy fit, and the ability to move fast. Quality over quantity every time.", tag: "Investors" },
  { n: "09", title: "Negotiation — the Real Stuff", desc: "Scripts for when a seller says no. Scripts for when an investor haggles your fee. We've been in these conversations and recorded them.", tag: "Negotiation" },
  { n: "10", title: "Closing Your Fee", desc: "How to price it, say it, and stand by it. Most sourcers undercharge because they're scared. This module fixes that.", tag: "Closing" },
  { n: "11", title: "Compliance — Non-Negotiable", desc: "Property Redress Scheme. AML registration. GDPR. FCA awareness. Sourcing agreements. Operating without this is not just risky — it's illegal.", tag: "Legal" },
  { n: "12", title: "From One Deal to a Business", desc: "VA hiring, CRM systems, deal flow automation. The sourcers hitting £10k months aren't working harder. They're working smarter.", tag: "Scale" },
];

const DAYS = [
  { day: 1, title: "Get your head straight", task: "Understand the business model, what you're committing to, and set one realistic 30-day target.", honest: "Most people quit here because they expect it to be passive income. It's not. It's a business." },
  { day: 2, title: "Pick your area and your strategy", task: "Choose one city. One strategy. Run the numbers on what a good deal looks like there.", honest: "Trying to source everywhere is how you source nowhere." },
  { day: 3, title: "Analyse 3 live deals", task: "Pull 3 properties from Rightmove and run them through the Deal Calculator. Don't try to find a deal yet — just learn what a deal looks like.", honest: "You need reps before you have conviction. This is your first 3." },
  { day: 4, title: "Find 10 investors", task: "One LinkedIn message. One networking event. One Facebook group. Start conversations — not pitches.", honest: "Your first investor conversation will feel awkward. Do it anyway." },
  { day: 5, title: "Build your investor pack template", task: "Download the pack template from the library. Fill it out with a practice deal. Get it looking sharp.", honest: "Professional presentation is the difference between £3,000 and £0." },
  { day: 6, title: "Send your first deal email", task: "Use the email swipe file. Send one packaged deal to one investor. Actually send it.", honest: "This day separates people who are learning from people who are doing." },
  { day: 7, title: "Review, reflect, and build the habit", task: "What happened? What worked? What felt hard? Set your activity targets for next week.", honest: "One week won't get you a deal. It'll get you the habits that lead to a deal." },
];

const REVIEWS = [
  { name: "James T.", area: "Birmingham", text: "I'd spent three months watching YouTube and still hadn't sent a single deal pack. Joined the Academy on a Sunday, completed the 7-day challenge, and sent my first pack on Day 6. Packaged my first deal three weeks later — £4,500 fee. The scripts are genuinely incredible.", stars: 5, result: "£4,500 first fee" },
  { name: "Priya M.", area: "Manchester", text: "The compliance module alone was worth joining. I was terrified of getting the legal side wrong. After Module 11 I understood exactly what I needed to register for and why. I felt like a legitimate business for the first time.", stars: 5, result: "Fully compliant setup" },
  { name: "Dean W.", area: "Leeds", text: "I'd done a £2,000 course that gave me a load of theory and a Facebook group full of people asking the same questions. The Academy is different — it's actual tools. The email templates. The CRM. The deal calculator. I use them weekly.", stars: 5, result: "Active sourcer, 2 deals in" },
  { name: "Aaliya R.", area: "Nottingham", text: "I was a full-time nurse thinking about whether property sourcing was even possible around shifts. The 7-day challenge showed me I could do the work in 90-minute blocks. I'm still nursing but I've packaged two deals in four months.", stars: 5, result: "2 deals whilst working full-time" },
];

const FAQS = [
  {
    q: "Is this legal?",
    a: "Yes — selling educational content is completely legal. The Academy teaches you about property deal sourcing: how it works, the strategies, the compliance requirements. It's a learning platform, not a regulated financial service. If you go on to operate as a deal sourcer commercially, Module 11 covers exactly what you need to register for (property redress scheme, AML, etc.). This subscription gives you knowledge and tools — what you do with them is your business.",
    important: true,
  },
  {
    q: "Is this financial advice?",
    a: "No. Nothing in the Academy is financial advice, investment advice, or legal advice. All content is educational. The tools (calculators, deal templates) are for learning and modelling purposes. Before making any property or financial decision, seek independent advice from a qualified professional — solicitor, mortgage broker, or financial adviser.",
    important: true,
  },
  {
    q: "Do I need experience to join?",
    a: "None at all. The 7-Day Challenge starts from absolute zero. We explain what deal sourcing is before we explain how to do it. If you know what a buy-to-let is, you're already ahead.",
    important: false,
  },
  {
    q: "What if I'm still working full-time?",
    a: "Most members are. Deal sourcing can be done in evenings and weekends, especially in the early stages when you're building your investor list and learning to analyse deals. Members like Aaliya (a full-time nurse) have packaged deals working 90-minute blocks.",
    important: false,
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel with one click, no questions asked. Under the Consumer Contracts Regulations 2013, you also have a 14-day cooling-off period from sign-up — if you're not satisfied within 14 days, email us for a full refund.",
    important: true,
  },
  {
    q: "How is this different from a £2,000 course?",
    a: "Most courses give you theory and a Facebook group. The Academy gives you tools you actually use: a deal calculator, investor CRM, 11 copy-paste email templates, a compliance checklist, live deal reviews, a Q&A board where Nass answers personally. £14.99/month — cancel anytime, no long-term commitment.",
    important: false,
  },
  {
    q: "Will this guarantee I make money?",
    a: "No. Results vary based on your effort, your area, your investor relationships, and market conditions. Anyone who guarantees results in deal sourcing is lying to you. What we guarantee is the best educational content and tools we can build. The rest is on you.",
    important: false,
  },
];

const TAG_COLORS: Record<string, string> = {
  Foundation: "#6366f1", Strategy: "#d4af37", Sourcing: "#16a34a",
  "Lead Gen": "#0891b2", Analysis: "#7c3aed", Investors: "#2563eb",
  Packaging: "#d97706", Negotiation: "#dc2626", Closing: "#16a34a",
  Legal: "#ef4444", Scale: "#a855f7",
};

function StarRating({ n }: { n: number }) {
  return <span style={{ color: "#d4af37", fontSize: 16 }}>{"★".repeat(n)}</span>;
}

export default function AcademyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const loading = false;

  const QUIZ = [
    { q: "Have you ever tried to get into property before?", opts: ["Complete beginner", "I've done some research", "I own property already", "I've tried sourcing before"] },
    { q: "What's your biggest blocker right now?", opts: ["I don't know where to start", "I can't find deals", "I don't have investors", "I'm worried about the legal side"] },
    { q: "How much time can you commit per week?", opts: ["Under 5 hours", "5–10 hours", "10–20 hours", "Full time"] },
  ];

  const quizDone = quizAnswers.length === QUIZ.length;

  function CTAButton({ large = false }: { large?: boolean }) {
    return (
      <Link href="/academy/subscribe" style={{ background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: large ? 18 : 15, padding: large ? "16px 48px" : "13px 32px", borderRadius: 14, letterSpacing: "-0.3px", display: "inline-block", textDecoration: "none" }}>
        Join the Academy — £14.99/mo
      </Link>
    );
  }

  const TOOLS = [
    { icon: "✉️", title: "Email Swipe File", desc: "11 copy-paste templates for agents, investors, and motivated sellers. Includes subject lines and follow-up sequences.", href: "/academy/emails", accent: "#2563eb" },
    { icon: "👥", title: "Investor CRM", desc: "Track every investor — strategy, budget, area, status. Export to CSV. Never lose a warm lead again.", href: "/academy/crm", accent: "#7c3aed" },
    { icon: "📊", title: "Deal Calculator", desc: "Model BRRR, JV splits, and packaging fees with sliders and a live deal score. More detailed than the public version.", href: "/academy/calculator", accent: "#d4af37" },
    { icon: "✅", title: "37-Step Checklist", desc: "From compliance setup to collecting your first fee — every step tracked. Tick off as you go.", href: "/academy/checklist", accent: "#16a34a" },
    { icon: "📋", title: "Weekly Deal Reviews", desc: "Real deals — addresses blurred — with numbers, strengths, risks, and the lesson Nass took.", href: "/academy/deal-reviews", accent: "#0891b2" },
    { icon: "🏘️", title: "Area Research Tool", desc: "7 major cities with sourcer-specific intelligence: discounts, refurb costs, and which strategies work where.", href: "/academy/area-research", accent: "#d97706" },
    { icon: "❓", title: "Q&A Board", desc: "Ask anything. Nass answers personally within 48 hours. No AI auto-responses.", href: "/academy/qa", accent: "#6366f1" },
    { icon: "⚖️", title: "Compliance Hub", desc: "Plain-English guide to FCA awareness, property redress, AML, GDPR, and sourcing contracts.", href: "/academy/legal", accent: "#ef4444" },
    { icon: "📁", title: "Downloads Library", desc: "Investor pack templates, deal spreadsheets, compliance checklists, and presentation decks.", href: "/academy/downloads", accent: "#a855f7" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: "#080d1a", color: "white", minHeight: "100vh" }}>

      {/* LEGAL STRIP */}
      <div style={{ background: "rgba(239,68,68,0.1)", borderBottom: "1px solid rgba(239,68,68,0.18)", padding: "9px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(239,68,68,0.9)", fontWeight: 600, letterSpacing: "0.01em" }}>
          Educational platform only · Not financial advice · Not investment advice · Results vary · Deal sourcers must comply with FCA rules and property redress scheme requirements
        </p>
      </div>

      {/* ── HERO ── */}
      <section style={{ padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(212,175,55,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 100, padding: "7px 18px", fontSize: 12, color: "#d4af37", fontWeight: 800, marginBottom: 36, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d4af37", display: "inline-block" }} />
            Now open · £14.99/month
          </div>

          <h1 style={{ fontSize: "clamp(52px,9vw,96px)", fontWeight: 900, lineHeight: 0.93, marginBottom: 32, fontFamily: "var(--font-family-heading)", letterSpacing: "-0.03em" }}>
            Stop watching.<br />
            <span style={{ background: "linear-gradient(135deg, #d4af37 0%, #f5d96a 50%, #d4af37 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Start sourcing.
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px,2.2vw,20px)", color: "rgba(255,255,255,0.72)", maxWidth: 600, margin: "0 auto 12px", lineHeight: 1.65 }}>
            The Deal Sourcing Academy gives aspiring sourcers the real education — not the highlight reel. Courses, tools, live deal reviews, scripts, compliance guides, and a Q&A board where I answer personally.
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.32)", marginBottom: 48, fontStyle: "italic" }}>— Nass, PropertyVault UK</p>

          <CTAButton large />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>£14.99/month · Cancel anytime · Instant access on payment</p>
        </div>
      </section>

      {/* ── FREE MODULE 1 PREVIEW ── */}
      <section style={{ background: "rgba(212,175,55,0.04)", borderTop: "1px solid rgba(212,175,55,0.18)", borderBottom: "1px solid rgba(212,175,55,0.18)", padding: "56px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 100, padding: "6px 18px", fontSize: 11, color: "#4ade80", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Free — no account needed
            </div>
            <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, fontFamily: "var(--font-family-heading)", marginBottom: 10, letterSpacing: "-0.02em" }}>Module 1 — Free Preview</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", maxWidth: 560, margin: "0 auto" }}>Read the first module before you pay a penny. No sign-up, no email required.</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(212,175,55,0.25)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ background: "rgba(212,175,55,0.1)", borderBottom: "1px solid rgba(212,175,55,0.2)", padding: "20px 32px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, background: "rgba(212,175,55,0.15)", border: "1.5px solid rgba(212,175,55,0.4)", borderRadius: 12, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: "#d4af37", textTransform: "uppercase" as const }}>Module</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#d4af37", lineHeight: 1.1 }}>01</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#d4af37", fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>Foundation</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0 }}>What Deal Sourcing Actually Is</h3>
              </div>
            </div>

            <div style={{ padding: "32px 32px" }}>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: 24 }}>
                Most people who &ldquo;want to do property&rdquo; think deal sourcing is finding a house on Rightmove and flipping it. It&apos;s not. Deal sourcing is a <strong style={{ color: "white" }}>B2B service business</strong>. You find below-market properties, package them professionally, and sell the opportunity to investors who buy them. Your fee — typically £2,000 to £10,000 — comes from the investor, not the seller.
              </p>

              <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#d4af37", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 14 }}>How the money actually moves</p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {[
                    "Find a motivated seller (probate, divorce, repossession, reluctant landlord)",
                    "Agree to source the deal — negotiate below market value",
                    "Package it: numbers, area analysis, strategy, projected returns",
                    "Present to a qualified investor on your buyers list",
                    "Investor buys. You collect your sourcing fee (£2k–£10k) on completion",
                  ].map((text, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#d4af37" }}>{i + 1}</div>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#f87171", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>The mistake most beginners make</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: 0 }}>They source deals before they have investors. This is backwards. You need a buyer before you find the deal — otherwise you&apos;re doing free research. Module 8 covers building your buyers list first.</p>
              </div>

              <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#4ade80", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>Module 1 task</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: 0 }}>Write down three types of motivated seller situations in your target area. Not properties — situations. Then write one sentence on why each seller might accept below market value. This trains your eye before you hit the streets.</p>
              </div>

              <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28 }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>That&apos;s Module 1. There are 11 more — plus 8 playbooks, tools, live deal reviews, and a Q&A board where I answer personally.</p>
                <CTAButton large />
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>£14.99/month · Cancel anytime · 14-day money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.07) 0%, rgba(212,175,55,0.04) 100%)", borderTop: "1px solid rgba(212,175,55,0.18)", borderBottom: "1px solid rgba(212,175,55,0.18)", padding: "36px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {[["12","Course modules"],["8","Playbooks"],["11","Email templates"],["37","Step checklist"],["7","Cities covered"],["Weekly","Deal reviews"]].map(([val, label], i, arr) => (
            <div key={label} style={{ textAlign: "center", padding: "0 36px", borderRight: i < arr.length - 1 ? "1px solid rgba(212,175,55,0.18)" : "none" }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: "#d4af37", lineHeight: 1, letterSpacing: "-0.02em" }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", marginTop: 8, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NASS MESSAGE ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", background: "linear-gradient(145deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 28, padding: "52px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -16, left: 28, fontSize: 160, color: "rgba(212,175,55,0.07)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>&ldquo;</div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 24, position: "relative" }}>A message from Nass</p>
          <div style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", lineHeight: 1.85, position: "relative" }}>
            <p style={{ marginBottom: 18 }}>I built this because I couldn&apos;t find anything honest when I was starting out.</p>
            <p style={{ marginBottom: 18 }}>Every course was either £2,000+ with vague promises, or free YouTube content that told you what deal sourcing <em>was</em> but not how to actually <em>do it</em> — find investors, negotiate with sellers, price your fee, stay legal.</p>
            <p style={{ marginBottom: 18 }}>The Academy is what I wish I had. Practical. Compliance-first. Tools I use myself.</p>
            <p style={{ fontWeight: 800, color: "white", fontSize: 18, marginBottom: 0 }}>£14.99/month. Cancel anytime. Full access from day one — no drip-feeding, no upsells.</p>
          </div>
        </div>
      </section>

      {/* ── QUIZ ── */}
      <section style={{ padding: "0 24px 88px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 900, marginBottom: 10, fontFamily: "var(--font-family-heading)", letterSpacing: "-0.02em" }}>Is the Academy right for you?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>3 quick questions. Takes 20 seconds.</p>
          </div>

          {!quizDone ? (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "40px 36px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                {QUIZ.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= quizStep ? "#d4af37" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Question {quizStep + 1} of {QUIZ.length}</p>
              <h3 style={{ fontSize: 21, fontWeight: 800, marginBottom: 28, lineHeight: 1.3 }}>{QUIZ[quizStep].q}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {QUIZ[quizStep].opts.map((opt, i) => (
                  <button key={i} onClick={() => {
                    const newAnswers = [...quizAnswers, i];
                    setQuizAnswers(newAnswers);
                    if (quizStep < QUIZ.length - 1) setQuizStep(s => s + 1);
                  }} style={{ padding: "16px 22px", borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.88)", fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "linear-gradient(145deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03))", border: "2px solid rgba(212,175,55,0.35)", borderRadius: 24, padding: "48px 36px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: "rgba(22,163,74,0.15)", border: "2px solid rgba(22,163,74,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>✅</div>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 14 }}>Yes — the Academy is built for you.</h3>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, marginBottom: 32 }}>
                Whether you&apos;re starting from scratch or stuck at a particular stage — the Academy covers it. The 7-Day Challenge was built for exactly where you are right now.
              </p>
              <CTAButton />
              <br /><br />
              <button onClick={() => { setQuizStep(0); setQuizAnswers([]); }} style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Retake quiz</button>
            </div>
          )}
        </div>
      </section>

      {/* ── 7-DAY CHALLENGE ── */}
      <section style={{ padding: "88px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(99,102,241,0.03)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-block", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 100, padding: "6px 18px", fontSize: 11, color: "#d4af37", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Start Here</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--font-family-heading)", marginBottom: 12, letterSpacing: "-0.02em" }}>The 7-Day First Deal Challenge</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16 }}>Seven days. Seven tasks. Real progress — not just motivation.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DAYS.map(d => (
              <div key={d.day} onClick={() => setOpenDay(openDay === d.day ? null : d.day)}
                style={{ background: openDay === d.day ? "rgba(212,175,55,0.07)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${openDay === d.day ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.09)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 52, height: 52, background: openDay === d.day ? "rgba(212,175,55,0.22)" : "rgba(212,175,55,0.1)", border: `1.5px solid rgba(212,175,55,${openDay === d.day ? 0.5 : 0.28})`, borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontWeight: 800, color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.06em" }}>Day</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#d4af37", lineHeight: 1.1 }}>{d.day}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 17, fontWeight: 800, color: "white", marginBottom: 4 }}>{d.title}</p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{d.task}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 22, fontWeight: 300, flexShrink: 0 }}>{openDay === d.day ? "−" : "+"}</span>
                </div>
                {openDay === d.day && (
                  <div style={{ padding: "0 24px 22px 96px" }}>
                    <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 12, padding: "16px 20px" }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#d4af37", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>Nass says</p>
                      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, fontStyle: "italic" }}>&ldquo;{d.honest}&rdquo;</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12 MODULES ── */}
      <section style={{ padding: "88px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", borderRadius: 100, padding: "6px 18px", fontSize: 11, color: "#a5b4fc", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Masterclass</div>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--font-family-heading)", marginBottom: 12, letterSpacing: "-0.02em" }}>12 Modules. No Fluff.</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16 }}>Every module ends with a task — not just reading material.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {MODULES.map(m => {
            const c = TAG_COLORS[m.tag] ?? "#d4af37";
            return (
              <div key={m.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "22px 24px", display: "flex", gap: 18, borderLeft: `3px solid ${c}` }}>
                <div style={{ flexShrink: 0, paddingTop: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: c, opacity: 0.75, fontFamily: "var(--font-family-heading)" }}>{m.n}</span>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "white", lineHeight: 1.3 }}>{m.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `${c}18`, color: c, flexShrink: 0, letterSpacing: "0.04em", marginTop: 2 }}>{m.tag}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.65 }}>{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* ── WHAT ELSE YOU GET ── */}
      <section style={{ padding: "88px 24px", background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--font-family-heading)", marginBottom: 12, letterSpacing: "-0.02em" }}>Everything else inside</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16 }}>No upsells. No &ldquo;upgrade for the good stuff.&rdquo; All included — free.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {TOOLS.map(item => (
              <Link key={item.title} href={item.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "26px 26px", display: "block", borderTop: `2px solid ${item.accent}` }}>
                <div style={{ width: 44, height: 44, background: `${item.accent}18`, border: `1px solid ${item.accent}40`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: "white" }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.65, marginBottom: 16 }}>{item.desc}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: item.accent }}>Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding: "88px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--font-family-heading)", marginBottom: 12, letterSpacing: "-0.02em" }}>What members actually say</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16 }}>Not curated highlights. What they told us when we asked.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: "30px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 8, right: 18, fontSize: 80, color: "rgba(212,175,55,0.06)", fontFamily: "Georgia, serif", lineHeight: 1, pointerEvents: "none" }}>&rdquo;</div>
                <div style={{ marginBottom: 14 }}><StarRating n={r.stars} /></div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{r.area}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 20, background: "rgba(22,163,74,0.12)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.25)", whiteSpace: "nowrap" }}>{r.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "88px 24px", background: "linear-gradient(145deg, #0d1530, #080d1a)", borderTop: "1px solid rgba(212,175,55,0.15)", textAlign: "center" }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: 8, fontFamily: "var(--font-family-heading)", letterSpacing: "-0.02em" }}>Everything. One price.</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40 }}>Cancel anytime. No upsells. No hidden fees.</p>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "2px solid rgba(212,175,55,0.3)", borderRadius: 28, padding: "48px 40px", textAlign: "left" }}>
            <div style={{ textAlign: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, background: "linear-gradient(135deg,#d4af37,#f5d96a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>£14.99</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textAlign: "center", marginBottom: 36 }}>Per month · Cancel anytime · Instant access</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {["12-Module Deal Sourcing Masterclass","7-Day First Deal Challenge","8 Strategy Playbooks","11 Copy-Paste Email Templates","Advanced Deal Calculator (BRRR / JV / Packaging)","Investor CRM","37-Step Compliance Checklist","Weekly Live Deal Reviews","Area Research Tool (7 cities)","Q&A Board — Nass answers personally","Downloads Library","Legal & Compliance Hub","Monthly new content"].map(f => (
                <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14 }}>
                  <span style={{ color: "#d4af37", fontWeight: 900, flexShrink: 0, fontSize: 16, marginTop: 1 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.82)" }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/academy/subscribe" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#080d1a", fontWeight: 900, fontSize: 18, padding: "18px 0", borderRadius: 16, textDecoration: "none", marginBottom: 14, letterSpacing: "-0.3px" }}>
              Join the Academy — £14.99/mo →
            </Link>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.7, textAlign: "center" }}>Cancel anytime · Educational platform — not financial or legal advice</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "88px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, marginBottom: 10, fontFamily: "var(--font-family-heading)", letterSpacing: "-0.02em" }}>Questions worth asking</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>The legal ones are at the top — they matter most.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: faq.important ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${faq.important ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.09)"}`, borderRadius: 16, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "white", textAlign: "left", gap: 16, fontFamily: "inherit" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
                    {faq.important && <span style={{ fontSize: 10, fontWeight: 800, color: "#d4af37", background: "rgba(212,175,55,0.12)", borderRadius: 6, padding: "2px 7px", marginRight: 10, verticalAlign: "middle" }}>LEGAL</span>}
                    {faq.q}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 22, fontWeight: 300, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "4px 22px 22px", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY WE BUILT THIS ── */}
      <section style={{ padding: "80px 24px", background: "#080d1a", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", letterSpacing: "0.08em", textTransform: "uppercase" }}>Why we built the Academy</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "start" }}>

            {/* Story text */}
            <div>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: 28, letterSpacing: "-0.025em" }}>
                Most people who want to source deals don&apos;t lack drive. They lack{" "}
                <span style={{ color: "#d4af37" }}>access.</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.85 }}>
                <p>
                  The Deal Sourcing Academy was built to close the gap between &ldquo;I&apos;ve been watching YouTube for six months&rdquo; and &ldquo;I sent my first deal pack this week.&rdquo; That gap is mostly confidence, real tools, and honest information — not raw capital or luck.
                </p>
                <p>
                  We&apos;re direct about what deal sourcing actually is: it&apos;s not passive income. It&apos;s a business. The early conversations are awkward. The first deal sometimes falls through. We say that upfront — because the people who still want to do it after hearing the truth are the people who close deals.
                </p>
                <p>
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>Module 11 — Compliance — is non-negotiable.</strong> Operating commercially as a deal sourcer without proper registration isn&apos;t just risky, it&apos;s illegal in certain circumstances. We cover it fully because we want members building legitimate businesses they&apos;re proud of, not scrambling to catch up when it matters.
                </p>
                <p>
                  The Q&amp;A board is answered personally by Nass within 48 hours — no AI auto-responses, no community managers redirecting you to the FAQ. If you&apos;re stuck on a deal, a conversation, or a compliance question, you get a real answer.
                </p>
              </div>
            </div>

            {/* What makes this different */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>What makes this different</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "✉️", point: "11 email templates you can send today — not adapt from scratch" },
                  { icon: "📊", point: "A deal calculator that models BRRR, JV splits, and sourcing fees with sliders" },
                  { icon: "👥", point: "An investor CRM to track every buyer — strategy, budget, and how warm they are" },
                  { icon: "✅", point: "A 37-step checklist from compliance setup to collecting your first fee" },
                  { icon: "🏘️", point: "Weekly deal reviews — real deals, numbers included, lessons from Nass" },
                  { icon: "⚖️", point: "A plain-English compliance hub: PRS, AML, FCA awareness, GDPR, sourcing contracts" },
                  { icon: "❓", point: "Nass answers personally on the Q&A board — not a community manager" },
                ].map(item => (
                  <div key={item.point} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{item.point}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28 }}>
                <Link href="/academy/subscribe" style={{ background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 15, padding: "13px 32px", borderRadius: 14, display: "inline-block", textDecoration: "none" }}>
                  Join the Academy — £14.99/mo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "rgba(212,175,55,0.04)", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, marginBottom: 14, fontFamily: "var(--font-family-heading)", letterSpacing: "-0.02em" }}>Ready to stop watching?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 36, lineHeight: 1.6 }}>£14.99/month. Start the 7-Day Challenge today. Cancel anytime.</p>
          <CTAButton large />
        </div>
      </section>

      {/* ── FOOTER LEGAL ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", lineHeight: 1.9, maxWidth: 720, margin: "0 auto" }}>
          The Deal Sourcing Academy is an <strong style={{ color: "rgba(255,255,255,0.38)" }}>educational platform only</strong>. It does not constitute financial advice, investment advice, or legal advice. Content is for information purposes only. Results vary and are not guaranteed. Members who wish to operate commercially as deal sourcers must comply with all applicable legislation including FCA regulations, Property Redress Scheme requirements, AML supervision, and GDPR. PropertyVault UK is not liable for any loss arising from use of this content.
          <br /><br />
          <Link href="/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline", marginRight: 16 }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline", marginRight: 16 }}>Terms of Service</Link>
          <Link href="/academy/legal" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>Compliance Hub</Link>
          <br /><br />
          &copy; {new Date().getFullYear()} PropertyVault UK. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
