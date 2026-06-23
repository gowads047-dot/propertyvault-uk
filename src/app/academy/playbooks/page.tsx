"use client";

import Link from "next/link";
import { useState } from "react";

const PLAYBOOKS = [
  {
    id: "btl", n: "01", title: "How to Source a Buy to Let Deal",
    nass: "BTL is the most straightforward strategy to explain to investors — and the most competitive to source. Your edge is speed and relationships. The sourcers who win in BTL have agents calling them. Build that.",
    overview: "A step-by-step system for finding, analysing, and packaging a compliant BTL deal that your investor can buy immediately.",
    steps: [
      "Define your target area — rental demand, yield benchmarks, vacancy rates",
      "Set your investor criteria — budget, preferred property type, target yield",
      "Search Rightmove/Zoopla for properties priced below area average",
      "Run gross yield and net yield calculations for each candidate",
      "Request viewings through agents using the Agent Relationship Script",
      "Complete a full cash flow analysis including voids, maintenance, and management fees",
      "Stress test the deal at +1% and +2% interest rate increases",
      "Package the deal using the BTL Investor Pack template",
      "Present to 3 investors from your buyers list",
      "Negotiate reservation, collect fee, introduce solicitors",
    ],
    mistakes: ["Presenting deals without stress testing", "Forgetting to include management costs in yield calc", "Not having a signed reservation agreement before chasing buyers"],
    scripts: ["Agent Introduction Script", "Viewing Request Script", "Investor Deal Presentation Script"],
    checklist: ["Area research completed", "Yield calculated (gross + net)", "Cash flow modelled", "Stress test done", "Investor pack built", "Reservation agreement ready"],
  },
  {
    id: "brrr", n: "02", title: "How to Source a BRRR Deal",
    nass: "BRRR is where the money is. Investors love it because they get their capital back. The numbers are more complex — which means fewer sourcers do it well, which means you can charge more. Learn this one properly.",
    overview: "BRRR (Buy, Refurbish, Rent, Refinance) is the strategy investors use to recycle capital. Your job is to find the right distressed property with the right numbers.",
    steps: [
      "Target properties needing refurbishment — search 'in need of modernisation', auctions, probate",
      "Estimate post-refurb value (GDV) using Land Registry sold data and agent appraisals",
      "Get 2 refurb cost quotes from local contractors",
      "Calculate if the investor can refinance at 75% LTV and pull most capital out",
      "Model the deal: purchase + stamp duty + legal + refurb + finance vs refinance proceeds",
      "Confirm rental income post-refurb using Rightmove rental comparables",
      "Build your BRRR deal pack with the full financial model",
      "Present to BRRR-focused investors on your buyers list",
    ],
    mistakes: ["Underestimating refurb costs", "Using optimistic GDV without evidence", "Ignoring refinance criteria of the lender"],
    scripts: ["Motivated Seller Script", "Contractor Quote Request Script", "BRRR Investor Pitch Script"],
    checklist: ["GDV evidenced by 3+ comparables", "Refurb cost quoted (not estimated)", "Refinance model complete", "Cash left in deal calculated", "Rental income confirmed"],
  },
  {
    id: "hmo", n: "03", title: "How to Source an HMO Deal",
    nass: "HMO fees are bigger — £4,000 to £8,000 is normal for a good deal. But don't skip the compliance checks. An HMO without the right licence or in an Article 4 area can cost your investor tens of thousands. Do it right.",
    overview: "HMOs generate higher yields but require planning, licensing, and the right investor. This playbook walks you through every step.",
    steps: [
      "Research HMO licensing requirements in your target local authority",
      "Check Article 4 directions that restrict permitted development",
      "Identify properties with 4+ bedrooms in student/professional areas",
      "Calculate HMO yield room by room — compare to single-let yield",
      "Confirm demand: room rental rates, local occupancy rates, target tenant profile",
      "Model refurb to HMO standard including fire safety, room sizes, facilities",
      "Check planning permission requirements for change of use",
      "Build your HMO investor pack with room-by-room income breakdown",
      "Target HMO investors specifically — they have different criteria to BTL buyers",
    ],
    mistakes: ["Presenting HMO deals to BTL investors", "Ignoring Article 4 restrictions", "Underestimating HMO licensing costs and timelines"],
    scripts: ["HMO Agent Script", "HMO Investor Criteria Script"],
    checklist: ["HMO licence rules checked", "Article 4 status confirmed", "Room-by-room yield modelled", "Planning position confirmed", "Tenant demand evidenced"],
  },
  {
    id: "off-market", n: "04", title: "How to Source Off-Market Deals",
    nass: "I'll be honest — off-market takes time to build. Don't expect a deal in week one. But once your system is running, you'll be getting calls instead of making them. That's the goal.",
    overview: "The best deals never hit Rightmove. This playbook teaches you how to find motivated sellers before anyone else.",
    steps: [
      "Set up Google Alerts for your area + 'probate', 'repossession', 'quick sale'",
      "Build relationships with 5 local solicitors who handle probate work",
      "Write and send a monthly letter to targeted postcodes (high rental demand areas)",
      "Create a Facebook page and run 'We Buy Properties' ads",
      "Attend 2 property networking events per month and collect business cards",
      "Contact landlords whose properties have been on Rightmove 60+ days",
      "Use LinkedIn to connect with property developers and investors disposing of stock",
      "Build a 'referral fee' scheme with estate agents for off-market leads",
    ],
    mistakes: ["Expecting quick results — off-market takes 3-6 months to build", "Sending one letter and giving up", "Not following up every lead within 24 hours"],
    scripts: ["Cold Letter Template", "Facebook Ad Copy", "Probate Solicitor Introduction Email", "Landlord Outreach Script"],
    checklist: ["Google Alerts set up", "Solicitor relationships started", "Letter campaign live", "Facebook page/ad running", "Networking events booked"],
  },
  {
    id: "buyers-list", n: "05", title: "How to Build a Buyers List",
    nass: "This is the playbook I wish I had at the start. I spent months finding deals I couldn't sell because I had no buyers. Build the list first — before you have a deal to sell.",
    overview: "No buyers list, no business. This playbook shows you exactly how to find, qualify, and organise active property investors.",
    steps: [
      "Join 10 UK property investment Facebook groups — engage daily",
      "Attend property networking events (PIMP, BRRR, local meetups)",
      "Set up a simple landing page offering a free deal analysis — collect emails",
      "Post content on LinkedIn about property deals in your area",
      "Create a qualification form (use our template) and send to every lead",
      "Add each qualified investor to your CRM with their exact criteria",
      "Segment your list: BTL, BRRR, HMO, SA, R2R, budget range",
      "Set up a monthly email update — share market insights and available deals",
      "Aim for 50 qualified investors before presenting your first deal",
    ],
    mistakes: ["Presenting to unqualified investors", "Not asking for criteria upfront", "Ignoring investors who say 'not right now' — they will buy eventually"],
    scripts: ["Investor Introduction Script", "Qualification Call Script", "Monthly Newsletter Template"],
    checklist: ["CRM set up", "Qualification form live", "50+ investors targeted", "Criteria recorded for each", "Monthly update scheduled"],
  },
  {
    id: "packaging", n: "06", title: "How to Package a Deal",
    nass: "The pack is your credibility on paper. A scrappy email with a few numbers won't work. A clean, well-evidenced pack with a clear financial model will. This playbook shows you every section.",
    overview: "A well-packaged deal sells itself. This playbook covers every element of a professional investor pack.",
    steps: [
      "Download the Investor Pack Template from the Downloads section",
      "Complete the Property Summary — address, type, condition, photos",
      "Write the Investment Overview — why this deal, what strategy, what return",
      "Add the Financial Breakdown — purchase price, costs, projected income, ROI",
      "Include a Refurbishment Scope (if applicable) — room by room, materials, timeline",
      "Add Comparable Evidence — 3 sales comparables and 3 rental comparables",
      "Write the Area Research — demand, transport, schools, tenant profile",
      "Define the Exit Strategy — capital growth, remortgage, long-term hold",
      "Design your pack using the Canva template — 8-12 pages maximum",
      "Save as PDF and send via email using the Pack Delivery Script",
    ],
    mistakes: ["Too much text, not enough data", "Missing comparables", "No professional design — packs that look bad lose deals"],
    scripts: ["Pack Delivery Email Script", "Pack Follow-Up Script"],
    checklist: ["All 8 sections complete", "3 sales comparables included", "3 rental comparables included", "Financial model checked twice", "Canva design applied", "PDF exported and named correctly"],
  },
  {
    id: "selling", n: "07", title: "How to Sell a Deal",
    nass: "Most sourcers send the pack and wait. That's not selling — that's hoping. This playbook is the follow-up system, the objection handling, the call structure. The bit most people skip.",
    overview: "Packaging is half the job. Selling is the other half. This playbook walks you through presenting, following up, and closing.",
    steps: [
      "Match the deal to the right 3 investors on your list based on their criteria",
      "Send your pack via email using the Deal Presentation Script",
      "Follow up 24 hours later with the Follow-Up Script",
      "Book a 20-minute call to walk through the numbers",
      "Handle objections using the Objection Handling Scripts",
      "Agree on terms — price, fee, timeline",
      "Send the Reservation Agreement and invoice",
      "Collect your fee — typically 50% upfront, 50% on completion",
      "Introduce solicitors on both sides",
      "Stay involved through to completion — protect your reputation",
    ],
    mistakes: ["Presenting to too many investors at once — creates urgency conflict", "Chasing price instead of resolving the real objection", "Collecting fee without a signed agreement"],
    scripts: ["Deal Presentation Email", "Follow-Up Call Script", "Objection: 'The yield isn't high enough'", "Closing Script", "Fee Collection Script"],
    checklist: ["Pack sent to 3 matched investors", "24-hour follow-up done", "Call booked", "Objections handled", "Agreement signed", "Fee collected"],
  },
  {
    id: "scaling", n: "08", title: "How to Scale to £5,000+ Per Month",
    nass: "Don't look at this playbook until you've done at least 2 deals. Scaling a broken process just breaks it faster. Once you have a system that works — even slowly — this playbook is how you pour fuel on it.",
    overview: "Once you've done your first 2-3 deals, it's time to build a repeatable, scalable sourcing business.",
    steps: [
      "Document every step of your deal process into a Standard Operating Procedure",
      "Identify which part of the pipeline takes most of your time",
      "Hire a VA (virtual assistant) to handle admin, research, and initial outreach",
      "Set up a CRM with automated follow-up sequences",
      "Create a content strategy — post 3x per week on LinkedIn and Instagram",
      "Build referral relationships with 3 mortgage brokers and 3 solicitors",
      "Set a target: 2 deals per month minimum",
      "Price your fees at £3,000-£7,000 per deal depending on deal size",
      "Create a monthly investor update that keeps your buyers engaged",
      "Reinvest early income into paid lead generation",
    ],
    mistakes: ["Trying to scale before the process is proven", "Underpricing fees to win deals", "Not documenting processes — makes hiring impossible"],
    scripts: ["VA Job Description Template", "CRM Automation Sequence", "Broker Introduction Script", "Fee Increase Announcement"],
    checklist: ["SOPs documented", "VA hired or VA job posted", "CRM automated", "Content schedule live", "2+ referral partners active", "Monthly income target set"],
  },
];

export default function PlaybooksPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>DSA</Link>
        {[["Dashboard", "/academy/dashboard"], ["Courses", "/academy/courses"], ["Scripts", "/academy/scripts"], ["Downloads", "/academy/downloads"]].map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6, fontFamily: "var(--font-family-heading)" }}>Implementation Playbooks</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Not theory. Not inspiration. Step-by-step execution guides for every major strategy — with the common mistakes written out so you don&apos;t make them.</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 40 }}>Tap any playbook to expand the full process, scripts, and checklist.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PLAYBOOKS.map(p => (
            <div key={p.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${open === p.id ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === p.id ? null : p.id)}
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#d4af37", opacity: 0.6, minWidth: 24 }}>{p.n}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{p.steps.length} steps · {p.scripts.length} scripts · {p.checklist.length} checklist items</div>
                  </div>
                </div>
                <span style={{ color: "#d4af37", fontSize: 18 }}>{open === p.id ? "−" : "+"}</span>
              </button>

              {open === p.id && (
                <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "16px 0 12px" }}>{p.overview}</p>
                  {"nass" in p && <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", marginBottom: 4 }}>NASS SAYS:</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, fontStyle: "italic" }}>&ldquo;{(p as typeof p & { nass: string }).nass}&rdquo;</p>
                  </div>}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Steps</div>
                      {p.steps.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                          <span style={{ minWidth: 20, fontSize: 11, fontWeight: 800, color: "#d4af37", opacity: 0.6, paddingTop: 1 }}>{i + 1}.</span>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Common Mistakes</div>
                      {p.mistakes.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                          <span style={{ color: "#ef4444", fontSize: 13 }}>✗</span>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>{m}</span>
                        </div>
                      ))}

                      <div style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 10px" }}>Scripts Included</div>
                      {p.scripts.map(s => (
                        <div key={s} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 4, display: "flex", gap: 6 }}>
                          <Link href="/academy/scripts" style={{ color: "#60a5fa", textDecoration: "none" }}>→</Link> {s}
                        </div>
                      ))}

                      <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 10px" }}>Completion Checklist</div>
                      {p.checklist.map((c, i) => (
                        <label key={i} style={{ display: "flex", gap: 8, marginBottom: 6, cursor: "pointer", alignItems: "center" }}>
                          <input type="checkbox" style={{ accentColor: "#22c55e" }} />
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{c}</span>
                        </label>
                      ))}
                    </div>
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
