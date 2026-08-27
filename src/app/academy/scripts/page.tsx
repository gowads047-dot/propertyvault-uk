"use client";

import Link from "next/link";
import { useState } from "react";

const SCRIPT_CATEGORIES = [
  {
    cat: "Seller Scripts",
    icon: "🏠",
    scripts: [
      {
        title: "Cold Call — Motivated Seller Introduction",
        scenario: "You've found a property that's been on the market 90+ days and you're calling the agent to get the seller's situation.",
        script: `"Hi, I'm calling about [ADDRESS] — I noticed it's been on the market for a while. I work with investors who purchase quickly and I'm keen to understand the seller's situation. Is there any flexibility on price if we could offer a fast, chain-free purchase?

If the agent is open: "What's the seller's ideal timescale? We could potentially complete in 4-6 weeks if the price works for both sides."`,
        followUp: "Follow up with an email summarising your offer in writing within 2 hours.",
        objections: [
          { obj: "The seller wants full market value", response: "Understood completely. Our value is the certainty and speed we offer — no chains, no fall-throughs. If timing matters, we're worth considering even at a small adjustment." },
          { obj: "We have other interested parties", response: "Great — would you let me know if anything falls through? I can move within days of getting a formal offer accepted." },
        ],
      },
      {
        title: "Direct Seller Introduction — Cold Letter Follow-Up",
        scenario: "The seller has called you back after receiving your letter. This is your opening 90 seconds.",
        script: `"Thank you so much for calling. My name is [NAME] — I help landlords and homeowners sell their property quickly when timing matters.

I'm not an estate agent — I work with cash buyers and investors who can complete in 4-6 weeks without the uncertainty of a chain.

Can I ask — what's your situation? Are you looking for speed, certainty, or the best possible price?"`,
        followUp: "Book a viewing within 48 hours if they show any interest.",
        objections: [
          { obj: "I've already got an estate agent", response: "That's fine — I work alongside agents all the time. I just want to understand your property and see if I have a buyer who fits. There's no obligation." },
        ],
      },
    ],
  },
  {
    cat: "Estate Agent Scripts",
    icon: "🤝",
    scripts: [
      {
        title: "Agent Relationship Introduction",
        scenario: "First contact with a new estate agent — building a relationship for future off-market and pre-market deals.",
        script: `"Hi, I'm [NAME] — I work with a group of cash buyers looking for properties in [AREA]. My buyers move quickly and don't require mortgages.

I'm specifically looking for properties that might suit cash purchase — motivated sellers, properties needing work, or anything priced to sell quickly.

Would you be open to flagging those to me before they hit Rightmove? I'd always make sure to work through you on the sale."`,
        followUp: "Send a follow-up WhatsApp or email with your buyer criteria the same day.",
        objections: [
          { obj: "We treat all buyers the same", response: "Of course — I completely respect that. I just wanted to introduce myself so you know I'm serious and can move fast when the right property comes up." },
        ],
      },
      {
        title: "Requesting a Reduction Discussion",
        scenario: "You want to negotiate a price reduction after your initial offer was rejected.",
        script: `"I've run the numbers again carefully on [ADDRESS]. At the current asking price the yields don't work for my buyers, but I genuinely want to get this deal done.

If the seller could meet us at [PRICE], I can have a formal offer in writing within the hour and we can push to exchange within 28 days. Is that a conversation worth having with them?"`,
        followUp: "Have your formal offer letter ready to send the moment they agree.",
        objections: [
          { obj: "The seller won't go below asking", response: "I understand. Would they consider a faster exchange in exchange for the price holding? We can exchange in 14 days if that helps their situation." },
        ],
      },
    ],
  },
  {
    cat: "Investor Scripts",
    icon: "💼",
    scripts: [
      {
        title: "First Investor Outreach — Deal Presentation",
        scenario: "Sending your investor pack to a qualified investor on your buyers list for the first time.",
        script: `Subject: Deal Alert — [PROPERTY TYPE], [AREA] | [YIELD]% Net Yield

Hi [NAME],

I've just packaged a deal that matches your criteria — I wanted to share it with you before anyone else.

Property: [ADDRESS]
Strategy: [BTL/BRRR/HMO]
Purchase Price: £[PRICE]
Net Yield: [X]%
Monthly Cash Flow: £[AMOUNT]

Full analysis attached — I've run the numbers carefully including voids, management, and a stress test at +2%.

Available for a quick call this week to walk through it? Happy to answer any questions first by email.

[NAME]`,
        followUp: "Call within 24 hours if no response to the email.",
        objections: [
          { obj: "The yield isn't high enough", response: "What yield are you targeting? I want to make sure I'm matching deals to your exact criteria going forward — it'll save us both time." },
          { obj: "I'm not buying right now", response: "No problem at all. I'll keep your criteria on file and reach out when the right one comes up. When do you see your timing improving?" },
        ],
      },
      {
        title: "Investor Qualification Call",
        scenario: "A new investor has enquired. This script qualifies them in 10 minutes.",
        script: `"Thanks for getting in touch. I want to make sure I'm only sending you deals that genuinely match what you're looking for — so can I ask a few quick questions?

1. What property strategy are you focused on — BTL, BRRR, HMO, or something else?
2. What's your available budget for the next purchase?
3. What area or areas are you targeting?
4. What net yield or cash flow are you looking for?
5. How quickly can you move when the right deal comes up?
6. Are you a cash buyer or do you use finance?

Perfect — based on that, I should have something relevant for you [soon/within X weeks]. I'll be in touch the moment something matches."`,
        followUp: "Add to CRM immediately. Tag by strategy, budget, area, and timeline.",
        objections: [],
      },
    ],
  },
  {
    cat: "Objection Handling Scripts",
    icon: "🛡️",
    scripts: [
      {
        title: "Handling Sourcing Fee Objections",
        scenario: "The investor questions your fee after seeing the deal.",
        script: `"I completely understand — it's a fair question.

My fee covers the time I've spent finding this deal, negotiating the price, running the analysis, building the pack, and making sure it stacks before bringing it to you. You're also paying for the certainty that you're not wasting your time on deals that don't work.

If the deal returns [X]% net yield and cash flows at £[AMOUNT]/month, my fee is recovered in [X months]. Is it the fee itself that's the concern, or is there something about the deal you'd like me to look at again?"`,
        followUp: "If they push back on fee amount, hold firm. Consider a payment split — 50% upfront, 50% on completion.",
        objections: [
          { obj: "Other sourcers don't charge as much", response: "That may be true — and I'd encourage you to ask what's included. I provide a full analysis, pack, legal introductions, and I stay involved through to completion. That's worth something." },
        ],
      },
    ],
  },
  {
    cat: "Email Scripts",
    icon: "✉️",
    scripts: [
      {
        title: "Monthly Investor Update Email",
        scenario: "Keeping your buyers list warm with a monthly roundup.",
        script: `Subject: [Month] Property Update — [AREA] Market & New Deals Coming

Hi [First Name],

Quick update from me this month:

📍 Market: [Brief 2-sentence area insight — prices, demand, rental trends]

🔍 In the pipeline: I'm currently analysing [X] deals in [AREA] — expect to share the strongest one with you [this week/next week].

📊 Deal from last month: [Property type], [area], [yield]% net — sold in 48 hours to a buyer on my list.

If your criteria have changed since we last spoke, reply to this email and let me know — I want to make sure I'm only sending you relevant opportunities.

Speak soon,
[NAME]`,
        followUp: "Send on the 1st of each month. Track open rates.",
        objections: [],
      },
    ],
  },
  {
    cat: "WhatsApp Scripts",
    icon: "💬",
    scripts: [
      {
        title: "Deal Alert WhatsApp",
        scenario: "Quick message to a warm investor when a good deal comes in.",
        script: `"Hi [NAME] — just packaged a [BTL/BRRR/HMO] in [AREA] that I think suits your criteria.

[YIELD]% net yield, [£AMOUNT]/month cash flow, [£PRICE] purchase price.

Sending the full pack now — worth a quick call this week to walk through it? 📊"`,
        followUp: "Send the full pack email immediately after this message.",
        objections: [],
      },
    ],
  },
];

export default function ScriptsPage() {
  const [openCat, setOpenCat] = useState<string | null>(SCRIPT_CATEGORIES[0].cat);
  const [openScript, setOpenScript] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = SCRIPT_CATEGORIES.map(c => ({
    ...c,
    scripts: c.scripts.filter(s =>
      !search || s.title.toLowerCase().includes(search.toLowerCase()) || c.cat.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(c => c.scripts.length > 0);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>DSA</Link>
        {[["Dashboard", "/academy/dashboard"], ["Courses", "/academy/courses"], ["Playbooks", "/academy/playbooks"], ["Downloads", "/academy/downloads"]].map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6, fontFamily: "var(--font-family-heading)" }}>Sales Scripts Library</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Word-for-word scripts for every conversation. Sellers, agents, investors, objections, closing.</p>

        <input
          type="text"
          placeholder="Search scripts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 16px", color: "white", fontSize: 14, marginBottom: 32, outline: "none", boxSizing: "border-box" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
          {/* SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SCRIPT_CATEGORIES.map(c => (
              <button key={c.cat} onClick={() => { setOpenCat(c.cat); setOpenScript(null); }}
                style={{ background: openCat === c.cat ? "rgba(212,175,55,0.1)" : "none", border: `1px solid ${openCat === c.cat ? "rgba(212,175,55,0.3)" : "transparent"}`, borderRadius: 10, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                <span style={{ fontSize: 16 }}>{c.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: openCat === c.cat ? "#d4af37" : "rgba(255,255,255,0.6)" }}>{c.cat}</span>
              </button>
            ))}
          </div>

          {/* SCRIPTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(filtered.find(c => c.cat === openCat) || filtered[0])?.scripts.map(s => (
              <div key={s.title} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${openScript === s.title ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setOpenScript(openScript === s.title ? null : s.title)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "white" }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginTop: 3 }}>{s.scenario}</div>
                  </div>
                  <span style={{ color: "#d4af37", fontSize: 18, marginLeft: 16 }}>{openScript === s.title ? "−" : "+"}</span>
                </button>

                {openScript === s.title && (
                  <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Script</div>
                      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, whiteSpace: "pre-line", fontFamily: "monospace" }}>
                        {s.script}
                      </div>
                    </div>
                    {s.followUp && (
                      <div style={{ marginTop: 14, background: "rgba(59,130,246,0.08)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                        <span style={{ color: "#60a5fa", fontWeight: 700 }}>Follow-up: </span>
                        <span style={{ color: "rgba(255,255,255,0.65)" }}>{s.followUp}</span>
                      </div>
                    )}
                    {s.objections.length > 0 && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Handling Objections</div>
                        {s.objections.map(o => (
                          <div key={o.obj} style={{ background: "rgba(239,68,68,0.06)", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>"{o.obj}"</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{o.response}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
