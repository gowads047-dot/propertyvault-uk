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
    a: "Most courses give you theory and a Facebook group. The Academy gives you tools you actually use: a deal calculator, investor CRM, 11 copy-paste email templates, a compliance checklist, live deal reviews, a Q&A board where Nass answers personally. And it's free to join — no risk.",
    important: false,
  },
  {
    q: "Will this guarantee I make money?",
    a: "No. Results vary based on your effort, your area, your investor relationships, and market conditions. Anyone who guarantees results in deal sourcing is lying to you. What we guarantee is the best educational content and tools we can build. The rest is on you.",
    important: false,
  },
];

function StarRating({ n }: { n: number }) {
  return <span style={{ color: "#d4af37", fontSize: 14 }}>{"★".repeat(n)}</span>;
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
      <Link href="/academy/join" style={{ background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: large ? 18 : 15, padding: large ? "16px 48px" : "13px 32px", borderRadius: 14, letterSpacing: "-0.3px", display: "inline-block", textDecoration: "none" }}>
        Join the Academy — Free Sign Up
      </Link>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: "#0a0f1e", color: "white", minHeight: "100vh" }}>

      {/* LEGAL STRIP */}
      <div style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)", padding: "8px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(239,68,68,0.8)", fontWeight: 600 }}>
          Educational platform only · Not financial advice · Not investment advice · Results vary · Deal sourcers must comply with applicable FCA rules and property redress scheme requirements
        </p>
      </div>

      {/* HERO */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.05) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 780, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#d4af37", fontWeight: 700, marginBottom: 28, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4af37", display: "inline-block" }} />
            Now open · Free to join
          </div>

          <h1 style={{ fontSize: "clamp(36px,6vw,62px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 24, fontFamily: "var(--font-family-heading)", letterSpacing: "-0.02em" }}>
            Stop watching.<br />
            <span style={{ color: "#d4af37" }}>Start sourcing.</span>
          </h1>

          <p style={{ fontSize: "clamp(15px,2.2vw,18px)", color: "rgba(255,255,255,0.6)", maxWidth: 580, margin: "0 auto 14px", lineHeight: 1.7 }}>
            The Deal Sourcing Academy is where aspiring sourcers get the real education — not the highlight reel. Courses, tools, live deal reviews, scripts, compliance guides, and a Q&A board where I answer personally.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 36, fontStyle: "italic" }}>— Nass, PropertyVault UK</p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <CTAButton large />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>No payment required · Create your free account in 60 seconds</p>
          </div>
        </div>
      </section>

      {/* HONEST INTRO — Nass's voice */}
      <section style={{ padding: "0 24px 64px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 40px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>A message from Nass</p>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}>
            <p style={{ marginBottom: 14 }}>I built this because I couldn&apos;t find anything honest when I was starting out.</p>
            <p style={{ marginBottom: 14 }}>Every course I looked at was either £2,000+ with vague promises, or free YouTube content that told you what deal sourcing <em>was</em> but not how to actually <em>do it</em> — find investors, negotiate with sellers, price your fee, stay legal.</p>
            <p style={{ marginBottom: 14 }}>The Academy is what I wish I had. It&apos;s practical, it covers the compliance properly (non-negotiable in this industry), and the tools are things I use myself.</p>
            <p style={{ marginBottom: 0 }}>It&apos;s free to join. Sign up, get access, and start learning. No card. No catch.</p>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "rgba(212,175,55,0.06)", borderTop: "1px solid rgba(212,175,55,0.12)", borderBottom: "1px solid rgba(212,175,55,0.12)", padding: "24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 36 }}>
          {[
            ["12", "Course modules"],
            ["8", "Playbooks"],
            ["11", "Email templates"],
            ["37", "Step checklist"],
            ["7", "Cities covered"],
            ["Weekly", "Deal reviews"],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#d4af37" }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE QUIZ */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>Is the Academy right for you?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>3 quick questions. Takes 20 seconds.</p>
          </div>

          {!quizDone ? (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 28px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {QUIZ.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= quizStep ? "#d4af37" : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Question {quizStep + 1} of {QUIZ.length}</p>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, lineHeight: 1.4 }}>{QUIZ[quizStep].q}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {QUIZ[quizStep].opts.map((opt, i) => (
                  <button key={i} onClick={() => {
                    const newAnswers = [...quizAnswers, i];
                    setQuizAnswers(newAnswers);
                    if (quizStep < QUIZ.length - 1) setQuizStep(s => s + 1);
                  }} style={{ padding: "13px 18px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
                    className="hover:border-yellow-500/40">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 20, padding: "32px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Yes — the Academy is built for you.</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
                Whether you&apos;re starting from scratch, stuck at a particular stage, or just need a proper system — the Academy covers it. The 7-Day Challenge was designed for exactly where you are right now.
              </p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <CTAButton />
                <button onClick={() => { setQuizStep(0); setQuizAnswers([]); }} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retake quiz</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7-DAY CHALLENGE */}
      <section style={{ padding: "72px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 100, padding: "4px 14px", fontSize: 11, color: "#d4af37", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Start here</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--font-family-heading)", marginBottom: 8 }}>The 7-Day First Deal Challenge</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Seven days. Seven tasks. Real progress — not just motivation.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DAYS.map(d => (
              <div key={d.day} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${openDay === d.day ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setOpenDay(openDay === d.day ? null : d.day)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", color: "white", textAlign: "left" }}>
                  <div style={{ width: 44, height: 44, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#d4af37", textTransform: "uppercase" }}>Day</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#d4af37", lineHeight: 1 }}>{d.day}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700 }}>{d.title}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{d.task}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, flexShrink: 0 }}>{openDay === d.day ? "−" : "+"}</span>
                </button>
                {openDay === d.day && (
                  <div style={{ padding: "0 20px 20px 80px" }}>
                    <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 10, padding: "12px 16px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", marginBottom: 4 }}>NASS SAYS:</p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, fontStyle: "italic" }}>&ldquo;{d.honest}&rdquo;</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 MODULES */}
      <section style={{ padding: "72px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 100, padding: "4px 14px", fontSize: 11, color: "#a5b4fc", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Masterclass</div>
          <h2 style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--font-family-heading)", marginBottom: 8 }}>12 Modules. No Fluff.</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Every module ends with a task — not just reading material.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          {MODULES.map(m => (
            <div key={m.n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", display: "flex", gap: 14 }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#d4af37", opacity: 0.5 }}>M{m.n}</span>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{m.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6, background: "rgba(212,175,55,0.1)", color: "#d4af37", flexShrink: 0 }}>{m.tag}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT ELSE YOU GET */}
      <section style={{ padding: "72px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: "center", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>Everything else inside</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>No upsells. No &ldquo;upgrade for the good stuff.&rdquo; All of this is included — free.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {[
              { icon: "✉️", title: "Email Swipe File", desc: "11 copy-paste templates for reaching estate agents, investors, and motivated sellers. Includes subject lines and follow-up sequences.", href: "/academy/emails" },
              { icon: "👥", title: "Investor CRM", desc: "Track every investor contact — their strategy, budget, area, and status. Export to CSV. No more losing track of warm leads.", href: "/academy/crm" },
              { icon: "📊", title: "Advanced Deal Calculator", desc: "Model BRRR, JV splits, and packaging fees with sliders and a live deal score. More detailed than the public version.", href: "/academy/calculator" },
              { icon: "✅", title: "37-Step Sourcing Checklist", desc: "From setting up compliantly to collecting your first fee — every step tracked. Tick off as you go. Never miss a stage.", href: "/academy/checklist" },
              { icon: "📋", title: "Weekly Deal Reviews", desc: "Real deals — addresses blurred — with the numbers, strengths, risks, and the lesson. What went well. What I'd do differently.", href: "/academy/deal-reviews" },
              { icon: "🏘️", title: "Area Research Tool", desc: "7 major cities with sourcer-specific intelligence — not just yield data. Average discounts, typical refurb cost, and which strategies work where.", href: "/academy/area-research" },
              { icon: "❓", title: "Q&A Board", desc: "Ask me anything. I answer every question personally within 48 hours. No AI auto-responses. Real answers from someone who's done it.", href: "/academy/qa" },
              { icon: "⚖️", title: "Compliance Hub", desc: "Plain-English guide to FCA awareness, property redress schemes, AML, GDPR, and sourcing contracts. The non-negotiable stuff, made simple.", href: "/academy/legal" },
              { icon: "📁", title: "Downloads Library", desc: "Investor pack templates, deal analysis spreadsheets, compliance checklists, and presentation decks. Formats you can use tomorrow.", href: "/academy/downloads" },
            ].map(item => (
              <Link key={item.title} href={item.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 22px", display: "block", transition: "border-color 0.2s" }}
                className="group hover:border-yellow-500/30">
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: "white" }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{item.desc}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#d4af37", marginTop: 12 }}>Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "72px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: "center", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>What members actually say</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>Not curated highlights. What they told us when we asked.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {REVIEWS.map(r => (
            <div key={r.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <StarRating n={r.stars} />
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(212,175,55,0.1)", color: "#d4af37" }}>{r.result}</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{r.area}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "72px 24px", background: "linear-gradient(135deg,#0d1a3a,#0a0f1e)", borderTop: "1px solid rgba(212,175,55,0.12)", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(212,175,55,0.25)", borderRadius: 24, padding: "44px 36px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>Deal Sourcing Academy</p>
            <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>Free</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 32 }}>No payment required · Sign up in 60 seconds</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, textAlign: "left" }}>
              {[
                "12-Module Deal Sourcing Masterclass",
                "7-Day First Deal Challenge",
                "8 Strategy Playbooks",
                "11 Copy-Paste Email Templates",
                "Advanced Deal Calculator (BRRR / JV / Packaging)",
                "Investor CRM",
                "37-Step Compliance Checklist",
                "Weekly Live Deal Reviews",
                "Area Research Tool (7 cities)",
                "Q&A Board — Nass answers personally",
                "Downloads Library",
                "Legal & Compliance Hub",
                "Monthly new content",
              ].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}>
                  <span style={{ color: "#d4af37", fontWeight: 800, flexShrink: 0 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/academy/join" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 17, padding: "16px 0", borderRadius: 14, textDecoration: "none", marginBottom: 12 }}>
              Join the Academy — Free Sign Up →
            </Link>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
              No payment required to sign up · Educational platform — not financial or legal advice
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "72px 24px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>Questions worth asking</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 32 }}>The legal ones are at the top because they matter most.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: faq.important ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.03)", border: `1px solid ${faq.important ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "white", textAlign: "left", gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  {faq.important && <span style={{ fontSize: 10, fontWeight: 800, color: "#d4af37", background: "rgba(212,175,55,0.1)", borderRadius: 4, padding: "2px 6px", marginRight: 8 }}>LEGAL</span>}
                  {faq.q}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER LEGAL */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.8, maxWidth: 700, margin: "0 auto" }}>
          The Deal Sourcing Academy is an <strong style={{ color: "rgba(255,255,255,0.4)" }}>educational platform only</strong>. It does not constitute financial advice, investment advice, or legal advice. Educational content is provided for information purposes only. Results vary and are not guaranteed. Members who wish to operate commercially as deal sourcers must ensure they comply with all applicable legislation including FCA regulations, Property Redress Scheme membership requirements, Anti-Money Laundering (AML) supervision registration, and GDPR compliance. PropertyVault UK is not liable for any loss arising from your use of this content. Prices correct at time of publication and subject to change with notice.
          <br /><br />
          <Link href="/privacy" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline", marginRight: 12 }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline", marginRight: 12 }}>Terms of Service</Link>
          <Link href="/academy/legal" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>Compliance Hub</Link>
          <br /><br />
          &copy; {new Date().getFullYear()} PropertyVault UK. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
