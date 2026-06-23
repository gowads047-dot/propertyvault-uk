"use client";

import Link from "next/link";

const CHALLENGE_DAYS = [
  { day: 1, title: "Understand Deal Sourcing", desc: "The business model, income potential, legal framework, and mindset of a professional deal sourcer.", task: "Write down 3 target areas and why you chose them.", download: "Day 1 Checklist" },
  { day: 2, title: "Find Potential Deals", desc: "Use Rightmove, Zoopla, OnTheMarket, estate agents, and direct-to-vendor methods to build your first pipeline.", task: "Find 5 potential deals and record them in your Lead Tracker.", download: "Lead Tracker Template" },
  { day: 3, title: "Analyse Opportunities", desc: "Run the full numbers on each deal — yield, cash flow, ROI, stress test, and compare to your area benchmarks.", task: "Analyse all 5 deals. Identify the best 2.", download: "Deal Analysis Template" },
  { day: 4, title: "Build Your Buyer Database", desc: "Find active property investors on LinkedIn, Facebook Groups, property networking events, and investor forums.", task: "Add 10 investor profiles to your Investor CRM.", download: "Investor CRM Template" },
  { day: 5, title: "Create Your Investor Pack", desc: "Use our template to package your top deal into a professional investor presentation.", task: "Complete one full investor pack for your best deal.", download: "Investor Pack Template" },
  { day: 6, title: "Present to Investors", desc: "Use the exact email and WhatsApp scripts to present your deal to 3 investors from your buyer list.", task: "Send your pack to 3 investors. Log their responses.", download: "Investor Outreach Scripts" },
  { day: 7, title: "Close Your First Deal", desc: "Handle objections, negotiate terms, and get a reservation agreement signed by your investor.", task: "Follow up with all 3 investors. Aim for one agreement.", download: "Reservation Agreement Template" },
];

const MODULES = [
  {
    n: "01", title: "Introduction to Deal Sourcing",
    objectives: ["Understand what deal sourcing is and how the business model works", "Know the income potential and realistic timelines", "Understand legal requirements at a high level"],
    lessons: ["What is a Deal Sourcer?", "How Sourcing Fees Work", "The Deal Pipeline Overview", "Legal Considerations Intro", "Your 90-Day Action Plan"],
    task: "Write your personal goal statement and target monthly income from sourcing.",
  },
  {
    n: "02", title: "Property Strategies",
    objectives: ["Understand 6 core investment strategies", "Know which strategies attract which investors", "Match deals to investor criteria"],
    lessons: ["Buy to Let Deep Dive", "BRRR Strategy Explained", "HMO Licensing & Returns", "Commercial to Residential Conversions", "Serviced Accommodation (SA)", "Rent to Rent (R2R)"],
    task: "Choose 2 strategies to specialise in and research 3 comparable deals for each.",
  },
  {
    n: "03", title: "Finding Motivated Sellers",
    objectives: ["Identify the 7 types of motivated seller", "Build direct-to-vendor lead generation", "Create a repeatable off-market deal flow"],
    lessons: ["Types of Motivated Sellers", "Probate & Inheritance Leads", "Divorce & Repossession Leads", "Developer & Builder Leads", "The 'Just Listed' Strategy", "Building Agent Relationships"],
    task: "Contact 5 estate agents this week using the agent script. Log all responses.",
  },
  {
    n: "04", title: "Lead Generation Systems",
    objectives: ["Build automated and manual lead pipelines", "Use social media, ads, and networking", "Create a consistent deal flow system"],
    lessons: ["Facebook & Instagram Lead Ads", "Google Local Ads Basics", "Letter Drop Campaigns", "LinkedIn for Investor Leads", "Property Networking Events", "Referral Systems"],
    task: "Set up one active lead generation channel and run it for 7 days.",
  },
  {
    n: "05", title: "Property Analysis Mastery",
    objectives: ["Analyse any deal type accurately", "Know your numbers inside out", "Stress test every deal before presenting"],
    lessons: ["Gross vs Net Yield", "Cash Flow Modelling", "ROI & Capital Growth", "BRRR Numbers Walkthrough", "HMO Yield Analysis", "Deal Stress Testing", "Using the PropertyVault Calculators"],
    task: "Run a full analysis on 3 real live properties in your target area.",
  },
  {
    n: "06", title: "Investor Psychology",
    objectives: ["Understand what investors actually want", "Build trust before the first deal", "Position yourself as a deal flow partner"],
    lessons: ["The Investor Mindset", "What Investors Fear Most", "How to Build Credibility Fast", "The Know-Like-Trust Framework", "Investor Communication Styles", "Long-Term Relationship Building"],
    task: "Write your personal credibility statement and investor value proposition.",
  },
  {
    n: "07", title: "Deal Packaging",
    objectives: ["Turn an analysed deal into a professional investor pack", "Know what to include and what to leave out", "Present deals in a way that gets a fast decision"],
    lessons: ["Anatomy of an Investor Pack", "Property Summary Page", "Financial Breakdown", "Refurbishment Scope", "Comparables Evidence", "Area Research", "Exit Strategy Options", "Design & Presentation Tips"],
    task: "Package one of your analysed deals using the investor pack template.",
  },
  {
    n: "08", title: "Building Investor Relationships",
    objectives: ["Build a qualified buyers list", "Segment investors by strategy and budget", "Create a follow-up system that converts"],
    lessons: ["Where to Find Investors", "Investor Qualification Questions", "Building Your CRM", "Segmenting Your Buyers List", "The 90-Day Follow-Up Sequence", "Networking Events Strategy", "Social Media Presence for Sourcers"],
    task: "Add 20 qualified investors to your CRM with notes on their criteria.",
  },
  {
    n: "09", title: "Negotiation Skills",
    objectives: ["Negotiate confidently with sellers, agents, and investors", "Handle pushback without caving on price", "Create win-win outcomes that close faster"],
    lessons: ["The Negotiation Mindset", "Seller Negotiation Tactics", "Agent Relationship Negotiation", "Investor Fee Negotiation", "Anchoring & Framing Techniques", "Silence as a Tool", "When to Walk Away"],
    task: "Role-play 3 negotiation scenarios from the scripts library with a partner or record yourself.",
  },
  {
    n: "10", title: "Closing Sourcing Fees",
    objectives: ["Price your fee with confidence", "Present your fee without apology", "Close deals and collect payment professionally"],
    lessons: ["How to Price Your Sourcing Fee", "Presenting Your Fee to Investors", "The Reservation Agreement Explained", "Getting Paid — Process & Timing", "Handling Fee Objections", "Repeat Business & Referrals"],
    task: "Create your standard fee structure and draft your first sourcing agreement.",
  },
  {
    n: "11", title: "Compliance & Legal Requirements",
    objectives: ["Understand the regulatory landscape for deal sourcers", "Know what compliance steps to take before operating commercially", "Protect yourself and your clients legally"],
    lessons: ["FCA Awareness for Sourcers", "Property Redress Schemes Explained", "Anti-Money Laundering (AML) Basics", "Know Your Customer (KYC)", "GDPR for Sourcers", "Sourcing Contracts & Agreements", "Consumer Protection Basics"],
    task: "Research the two main property redress schemes and note what joining involves.",
    note: "This module is educational only. Always seek independent legal advice before operating commercially.",
  },
  {
    n: "12", title: "Scaling Your Deal Sourcing Business",
    objectives: ["Build systems that work without you", "Hire and manage a virtual assistant", "Create predictable monthly revenue from sourcing"],
    lessons: ["The Solo-to-Team Transition", "Building Standard Operating Procedures", "Hiring Your First VA", "CRM & Pipeline Automation", "Monthly Income Targets & Tracking", "Building Your Personal Brand", "Creating Passive Deal Flow", "The £10k/Month Roadmap"],
    task: "Map out your 6-month growth plan using the Scale Planning Template.",
  },
];

export default function CoursesPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>

      {/* NAV */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>DSA</Link>
        {[["Dashboard", "/academy/dashboard"], ["Playbooks", "/academy/playbooks"], ["Scripts", "/academy/scripts"], ["Downloads", "/academy/downloads"]].map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6, fontFamily: "var(--font-family-heading)" }}>Course Library</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>Everything structured, sequential, and action-focused.</p>

        {/* 7-DAY CHALLENGE */}
        <div id="challenge" style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#d4af37" }}>QUICK START</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-family-heading)" }}>7-Day First Deal Challenge</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CHALLENGE_DAYS.map(d => (
              <div key={d.day} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 56, height: 56, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#d4af37", opacity: 0.7 }}>DAY</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#d4af37" }}>{d.day}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{d.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 14, lineHeight: 1.5 }}>{d.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
                        <span style={{ color: "#60a5fa", fontWeight: 700 }}>Task: </span>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{d.task}</span>
                      </div>
                      <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
                        <span style={{ color: "#d4af37", fontWeight: 700 }}>↓ </span>
                        <Link href="/academy/downloads" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>{d.download}</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MASTERCLASS */}
        <div id="orientation">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>FLAGSHIP COURSE</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-family-heading)" }}>Deal Sourcing Masterclass</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MODULES.map(m => (
              <div key={m.n} id={`module-${m.n}`} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ minWidth: 48, height: 48, background: "rgba(255,255,255,0.05)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>M{m.n}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{m.title}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Learning Objectives</div>
                        {m.objectives.map(o => <div key={o} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 3, display: "flex", gap: 6 }}><span style={{ color: "#d4af37" }}>✓</span>{o}</div>)}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Lessons</div>
                        {m.lessons.map(l => <div key={l} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 3, display: "flex", gap: 6 }}><span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>{l}</div>)}
                      </div>
                    </div>
                    <div style={{ background: "rgba(59,130,246,0.08)", borderRadius: 8, padding: "8px 12px", fontSize: 12, display: "flex", gap: 6 }}>
                      <span style={{ color: "#60a5fa", fontWeight: 700 }}>Action Task:</span>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>{m.task}</span>
                    </div>
                    {m.note && <div style={{ marginTop: 8, background: "rgba(239,68,68,0.08)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "rgba(239,68,68,0.8)" }}>⚠️ {m.note}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
