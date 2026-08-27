"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

const CATEGORIES = ["All","Estate Agents","Motivated Sellers","Investors","Solicitors","Follow-Up","Objection Handling"];

const EMAILS = [
  {
    id: 1, category: "Estate Agents", title: "Cold outreach to estate agent",
    subject: "Off-Market Buyers — Midlands Property Sourcer",
    body: `Hi [Name],

My name is [Your Name] — I work as a property sourcer in [area] and I'm actively looking for off-market or pre-market properties on behalf of cash buyers.

My investors are currently looking for:
- 2–4 bed residential (BTL or BRRR)
- Up to £[budget] purchase price
- Any condition considered

I can move quickly — cash buyers, no chain, and I can often exchange within 2–3 weeks. I pay a sourcing fee on completion, not from the vendor.

Would you be open to a quick call to discuss? I'd love to build a long-term relationship where I can take properties off your hands quickly.

Kind regards,
[Your Name]
[Phone]`,
    tip: "Send this to every estate agent in your target area. Follow up 3 days later if no reply.",
  },
  {
    id: 2, category: "Estate Agents", title: "Follow-up after first contact",
    subject: "Re: Off-Market Buyers — Following Up",
    body: `Hi [Name],

Just following up on my email from [date]. I appreciate you're busy, so I'll keep this brief.

I have a cash buyer ready to move immediately for the right property in [area]. Budget up to £[budget], any condition.

If anything comes to mind — especially anything that's been sitting on the market or a vendor who needs a quick sale — I'd love to hear from it.

Happy to chat for 5 minutes at your convenience.

[Your Name]
[Phone]`,
    tip: "Send exactly 3 days after first email. Keep it short — agents are busy.",
  },
  {
    id: 3, category: "Motivated Sellers", title: "Response to 'needs quick sale' advert",
    subject: "We Can Help — Quick, Certain Sale",
    body: `Hi [Name],

I saw your listing / advert and wanted to reach out directly.

I work with a network of cash buyers who are able to complete in as little as 2–3 weeks, with no chain and no estate agent fees for you.

I understand that sometimes speed and certainty matter more than achieving the highest possible price, and that's exactly what we offer.

I'm not here to pressure you — I'd just love to have a no-obligation 10-minute conversation to see if we can help.

Would that be okay?

Kind regards,
[Your Name]
[Phone]`,
    tip: "Use for Gumtree, Facebook Marketplace, and 'quick sale needed' type listings.",
  },
  {
    id: 4, category: "Motivated Sellers", title: "Door-knock / leaflet follow-up",
    subject: "Following Up — We Posted Through Your Door",
    body: `Hi [Name],

We recently posted a leaflet through your door regarding a cash property purchase service. I just wanted to follow up personally to see if you had a moment to consider it.

We're local property buyers looking for homes in [area]. We can:
✓ Buy in any condition
✓ Complete in 2–4 weeks
✓ Cover all legal costs
✓ No estate agent fees

There's absolutely no obligation — even a 10-minute chat could be worth your while.

Please feel free to call or WhatsApp me on [number] at any time.

[Your Name]`,
    tip: "Pair with a professionally designed leaflet for best results.",
  },
  {
    id: 5, category: "Investors", title: "Initial investor outreach",
    subject: "Off-Market Property Deals — [Area] Sourcer",
    body: `Hi [Name],

My name is [Your Name]. I'm a property sourcer based in [area], and I specialise in finding below-market-value investment opportunities for a small group of investors.

I source deals that typically offer:
- Minimum 20% below market value
- 7%+ gross yield
- Suitable for BTL, BRRR or HMO strategies
- Fully packaged with due diligence, comparables and legal referrals

I charge a transparent sourcing fee on completion (typically £3,000–£6,000), paid only when you're satisfied with the deal and choose to proceed.

I'd love to understand what you're looking for and see if we can work together. Would you be open to a quick call?

[Your Name]
[Phone]`,
    tip: "Be clear about your fee upfront. Investors respect transparency.",
  },
  {
    id: 6, category: "Investors", title: "Sending a deal to an investor",
    subject: "Deal Alert: [Address] — [Strategy] Opportunity",
    body: `Hi [Name],

I have a deal I wanted to share with you before it goes to anyone else.

📍 Address: [Address]
💷 Asking Price: £[price]
🏠 Type: [bedrooms] bed [type]
📊 GDV (after works): £[GDV]
🔧 Refurb Estimate: £[refurb]
💰 Gross Yield: [X]%
📋 Strategy: [BTL / BRRR / HMO]

Why it works:
[2–3 bullet points on what makes this deal stand out]

I've prepared a full deal pack including comparables, rental market data, and a recommended solicitor. I can send this over immediately.

My sourcing fee is £[fee], payable on exchange.

Are you interested in seeing the full pack?

[Your Name]`,
    tip: "Always lead with the numbers. Investors decide on data, not descriptions.",
  },
  {
    id: 7, category: "Solicitors", title: "Building a solicitor relationship",
    subject: "Property Sourcing — Looking to Build a Referral Relationship",
    body: `Dear [Name],

My name is [Your Name] and I work as a property sourcer in [area]. I source off-market residential investment properties for a group of cash buyers.

I'm looking to build a relationship with a reliable local solicitor who understands investment purchases and can turn transactions around quickly.

My buyers typically need:
- Fast exchange (2–4 weeks)
- Experience with BTL and BRRR transactions
- Clear, proactive communication

In return, I can refer multiple transactions per month as my investor pipeline grows.

Would you be open to a short introductory call?

Kind regards,
[Your Name]
[Phone / Email]`,
    tip: "A good solicitor relationship is one of the most valuable assets in your business.",
  },
  {
    id: 8, category: "Follow-Up", title: "Investor went quiet — re-engagement",
    subject: "Quick Check In — Still Looking for Deals?",
    body: `Hi [Name],

Hope you're well. I wanted to reach out as I haven't heard from you in a while.

I've had a few strong opportunities come through recently in [area] and I want to make sure I'm sending them to the right people.

Are you still actively looking? If so, what's changed in your criteria — budget, area, strategy?

Happy to jump on a 10-minute call to realign and make sure I'm bringing you the right deals.

[Your Name]`,
    tip: "Send to any investor who hasn't responded in 4+ weeks. Simple, no pressure.",
  },
  {
    id: 9, category: "Follow-Up", title: "After investor views a deal but goes quiet",
    subject: "Re: [Address] — Any Thoughts?",
    body: `Hi [Name],

Just wanted to follow up on the deal pack I sent over for [address].

I know there's a lot to consider, and I don't want to pressure you — but I do have a couple of other investors who've expressed interest, and I want to be fair to you as my first contact.

Even if it's not right for you, any feedback would be genuinely useful — too expensive, wrong area, yield not high enough? That helps me find better deals for you next time.

Happy to talk through any questions.

[Your Name]`,
    tip: "This email surfaces objections. Objections are good — they tell you how to serve the investor better.",
  },
  {
    id: 10, category: "Objection Handling", title: "Investor says 'your fee is too high'",
    subject: "Re: Sourcing Fee — Happy to Explain the Value",
    body: `Hi [Name],

Completely understand — it's a fair question and I'm happy to address it directly.

My fee of £[fee] covers:
✓ 20–40+ hours of sourcing, viewing and negotiation
✓ Full due diligence pack (comparables, rental data, refurb estimate)
✓ Legal referrals and transaction management
✓ Ongoing support through to completion

On a deal where the below-market discount alone is worth £[discount], the fee is typically a fraction of the equity you're gaining from day one.

I also only charge on completion — you pay nothing unless you're 100% happy with the deal.

Would it help to walk through the numbers together?

[Your Name]`,
    tip: "Never apologise for your fee. Explain the value instead.",
  },
  {
    id: 11, category: "Objection Handling", title: "Seller says 'I'll just go with an estate agent'",
    subject: "Re: Estate Agent vs Direct Sale — Quick Comparison",
    body: `Hi [Name],

Totally understand — it's always worth exploring all options.

Here's a quick comparison to help you decide:

Estate agent route:
- Timeline: 3–6 months average
- Fees: 1–3% of sale price
- Chain risk: High
- Certainty: Low

Working with us:
- Timeline: 2–4 weeks
- Fees: None to you
- Chain: None (cash buyers)
- Certainty: Very high

We're not the right fit for everyone — if you're happy to wait and want to maximise price, an agent may be better. But if speed and certainty matter, we could save you significant stress.

Worth a 10-minute call to explore?

[Your Name]`,
    tip: "Don't argue. Present facts and let them decide.",
  },
];

export default function AcademyEmailsPage() {
  const [active, setActive] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const filtered = active === "All" ? EMAILS : EMAILS.filter(e => e.category === active);

  function copy(id: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: l === "Emails" ? "#d4af37" : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Email Swipe File</h1>
        <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, marginBottom: 28 }}>
          {EMAILS.length} copy-paste email templates for every scenario. Click any email to expand, then copy the body.
        </p>

        {/* Category filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: active === cat ? "#d4af37" : "rgba(255,255,255,0.07)", color: active === cat ? "#0a0f1e" : "rgba(255,255,255,0.6)" }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(email => (
            <div key={email.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${expanded === email.id ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setExpanded(expanded === email.id ? null : email.id)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: "white", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(212,175,55,0.12)", color: "#d4af37" }}>{email.category}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{email.title}</span>
                </div>
                <span style={{ fontSize: 18, color: "rgba(255,255,255,0.62)", flexShrink: 0 }}>{expanded === email.id ? "−" : "+"}</span>
              </button>

              {expanded === email.id && (
                <div style={{ padding: "0 20px 20px" }}>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)", marginBottom: 4 }}>SUBJECT LINE</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px 14px" }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{email.subject}</span>
                      <button onClick={() => copy(email.id * 100, email.subject)} style={{ fontSize: 11, color: "#d4af37", background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginLeft: 12 }}>
                        {copied === email.id * 100 ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.58)" }}>EMAIL BODY</p>
                      <button onClick={() => copy(email.id, email.body)} style={{ fontSize: 12, fontWeight: 700, color: copied === email.id ? "#4ade80" : "#d4af37", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>
                        {copied === email.id ? "✓ Copied!" : "Copy Email"}
                      </button>
                    </div>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", margin: 0 }}>
                      {email.body}
                    </pre>
                  </div>

                  <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", marginBottom: 4 }}>💡 PRO TIP</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{email.tip}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
