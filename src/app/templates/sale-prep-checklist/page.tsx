"use client";

import { useState } from "react";
import {ShareToolbar } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter } from "@/components/PrintDoc";

const SECTIONS = [
  {
    title: "Legal & Documentation",
    icon: "📄",
    items: [
      { id: "title_deeds", title: "Locate title deeds / Land Registry title number", detail: "Check HM Land Registry (gov.uk/search-property-information). Most properties are registered — download your title register for £3. If unregistered, locate your paper deeds.", critical: true },
      { id: "epc", title: "Valid EPC (Energy Performance Certificate) in place", detail: "EPC required before marketing. Must be valid (within 10 years). Rating of E or above required to sell. Get one from an accredited assessor (£60–120). Buyers will see this before viewing.", critical: true },
      { id: "solicitor", title: "Instruct a solicitor / conveyancer", detail: "Instruct before accepting an offer — conveyancers can prepare draft contracts in advance. Compare at least 3 quotes. Budget £800–2,000 for a typical freehold sale.", critical: true },
      { id: "leasehold_docs", title: "Leasehold: obtain management pack and lease", detail: "Leasehold only: contact your freeholder/management company for a Leasehold Information Pack (LPE1/LPE2). This takes 6–12 weeks and costs £150–400. Start this early — it delays many sales.", critical: false },
      { id: "planning", title: "Gather planning permissions and building regs certs", detail: "For any extensions, loft conversions, conservatories, or structural changes since 1985 — locate the planning permission and completion certificate. If missing, your solicitor may need indemnity insurance.", critical: false },
      { id: "warranties", title: "Locate guarantees and warranties", detail: "NHBC warranty (new builds), window FENSA certificates, damp-proofing guarantees, roof warranties, electrical certificates (EICR). Buyers will ask for these.", critical: false },
      { id: "ta6", title: "Complete TA6 Property Information Form", detail: "Your solicitor will send you a TA6 (property information) and TA10 (fittings and contents) form. Complete these accurately and fully — misrepresentation can delay or kill a sale.", critical: true },
    ],
  },
  {
    title: "Property Condition & Repairs",
    icon: "🔧",
    items: [
      { id: "survey_issues", title: "Address any known structural issues", detail: "Buyers will commission a survey. Known issues (subsidence, roof damage, damp) that a survey will find are better disclosed and resolved (or priced in) upfront. Surprises after survey kill deals.", critical: true },
      { id: "boiler", title: "Service the boiler and obtain Gas Safe certificate", detail: "A recent boiler service (£80–120) and servicing record gives buyers confidence. If boiler is over 10 years old, be prepared to negotiate.", critical: false },
      { id: "damp", title: "Investigate and treat any damp or mould", detail: "Visible damp or mould is the #1 reason buyers reduce offers or pull out. Identify the cause (condensation, rising damp, penetrating damp) and fix it. Not just cosmetically — fix the root cause.", critical: true },
      { id: "roof", title: "Check roof condition from outside and in loft", detail: "Look for missing or slipped tiles, sagging, and signs of water ingress in the loft. Buyers' surveyors always check the roof. A quote for any works can prevent renegotiation.", critical: false },
      { id: "gutters", title: "Clear gutters and check downpipes", detail: "Blocked gutters lead to damp. A £80 gutter clean is worth far more in buyer confidence than its cost.", critical: false },
      { id: "electrics", title: "Resolve any known electrical issues", detail: "Buyers will ask about EICR date. If you have old wiring or known faults, consider getting an EICR done before marketing. Issues flagged by a buyer's EICR survey will be used to reduce the offer.", critical: false },
      { id: "minor_repairs", title: "Fix obvious minor defects (doors, handles, tiles, etc.)", detail: "Cracked tiles, stiff doors, dripping taps, broken handles — fix them all. Small faults create a perception that the property hasn't been maintained, leading buyers to mentally add 'what else is wrong'.", critical: false },
    ],
  },
  {
    title: "Presentation & Staging",
    icon: "✨",
    items: [
      { id: "declutter", title: "Declutter — remove at least 30% of belongings", detail: "Less furniture and fewer possessions make rooms look bigger. Hire a storage unit if needed. This is the single highest-ROI action you can take before marketing.", critical: true },
      { id: "deep_clean", title: "Professional deep clean throughout", detail: "Budget £200–600 for a thorough professional clean including carpets, oven, windows. A property that smells and looks clean triggers an emotional response that pricing rarely overcomes.", critical: true },
      { id: "painting", title: "Touch up or repaint walls in neutral colours", detail: "Fresh paint is cheap and transformative. Stick to warm whites, light greys, or off-whites. Remove any bold or unusual colours — buyers need to visualise themselves there.", critical: false },
      { id: "garden", title: "Tidy garden, cut lawn, weed borders", detail: "Kerb appeal matters enormously. Mow the lawn, trim hedges, clear the patio, remove dead plants. The front of the property is the first thing buyers see — online and in person.", critical: true },
      { id: "front_door", title: "Clean or repaint front door, polish letterbox", detail: "A fresh front door (paint or replacement) dramatically improves kerb appeal. Match letterbox, knocker, and handle finishes.", critical: false },
      { id: "depersonalise", title: "Remove personal photos and very personal items", detail: "Family photos and highly personal décor make it harder for buyers to imagine themselves living there. Depersonalise without making it feel cold.", critical: false },
      { id: "lighting", title: "Maximise light — clean windows, open curtains, add lamps", detail: "Bright, light rooms photograph better and feel more appealing. Clean every window (inside and out), open all curtains/blinds, add lamps to dark corners.", critical: false },
    ],
  },
  {
    title: "Valuation & Pricing",
    icon: "💰",
    items: [
      { id: "valuations", title: "Get 3 estate agent valuations", detail: "Invite at least 3 agents for a free valuation. Discount the highest estimate — overpricing leads to stale listings and eventual price drops. A realistic price sells faster and for more net.", critical: true },
      { id: "rightmove", title: "Research comparable sold prices on Rightmove/Zoopla", detail: "Use Rightmove's 'Sold Prices' and Zoopla's 'House Prices' tool to see what similar properties on your street or nearby actually sold for (not just listed). Adjust for your property's condition and size.", critical: true },
      { id: "agent_fees", title: "Compare estate agent fees and contracts", detail: "Typical fees: 0.75–1.5% (sole agency), 2–3% (multi-agency). Check: minimum contract period, what happens if you switch, whether fee is on listing or completion, and whether it includes professional photography.", critical: false },
      { id: "online_agent", title: "Consider hybrid/online agent options", detail: "Purplebricks, Strike, Yopa, and others offer lower fees. Weigh the fee saving against the service, local knowledge, and negotiation support. Works best in high-demand areas.", critical: false },
    ],
  },
  {
    title: "Photography & Marketing",
    icon: "📸",
    items: [
      { id: "pro_photos", title: "Insist on professional photography (not agent's phone)", detail: "Professional property photos (£150–300 separately, or included by some agents) add £5,000–20,000 to sale price on average. Never allow smartphone photos in a listing.", critical: true },
      { id: "floorplan", title: "Ensure floor plan is included in listing", detail: "Listings with floor plans receive significantly more enquiries. Insist your agent includes one. Some offer 3D/virtual tours — useful for out-of-area buyers.", critical: false },
      { id: "rightmove_listing", title: "Review your Rightmove/Zoopla listing before going live", detail: "Check the main photo is your best shot, the description is accurate and compelling, the price is right, and all information is complete. First 48 hours of a listing get the most views.", critical: true },
      { id: "social", title: "Share listing on personal social media", detail: "Facebook, Instagram, WhatsApp groups — word of mouth still sells properties. Buyers sometimes find homes through friends before Rightmove.", critical: false },
    ],
  },
  {
    title: "Viewings",
    icon: "🚪",
    items: [
      { id: "viewing_schedule", title: "Decide: accompanied or unaccompanied viewings", detail: "Your agent can conduct viewings on your behalf (accompanied). Being present yourself can work if you're a confident seller — or backfire if buyers feel unable to speak freely.", critical: false },
      { id: "pets_out", title: "Remove pets and pet evidence during viewings", detail: "Bowls, beds, cages, pet hair, and pet smells deter a significant portion of buyers. Remove pets and deep clean before every viewing.", critical: false },
      { id: "ambient", title: "Set the scene before each viewing", detail: "Temperature comfortable, good lighting, fresh smell (not overpowering), tidy and clear surfaces, toilet seats down, beds made. A 15-minute reset routine before each viewing pays dividends.", critical: false },
      { id: "feedback", title: "Request feedback from every viewing", detail: "Ask your agent to collect feedback within 24 hours of each viewing. Patterns in feedback (e.g. 'kitchen feels dated') give you actionable intelligence.", critical: false },
    ],
  },
];

export default function SalePrepChecklist() {
  const [mode, setMode] = useState<"checklist" | "print">("checklist");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [address, setAddress] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const total = SECTIONS.flatMap(s => s.items).length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const critical = SECTIONS.flatMap(s => s.items).filter(i => i.critical);
  const criticalDone = critical.filter(i => checked[i.id]).length;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: absolute; left: 0; top: 0; width: 100%; padding: 28px 36px; background: white; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Home Sale Preparation Checklist</h1>
          <p className="text-navy-200 max-w-2xl">Everything you need to do before listing your home — legal, repairs, staging, pricing, photography, and viewings. Work through each section systematically.</p>
        </div>
      </section>

      <div className="border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-navy-50 rounded-xl p-1">
              {(["checklist", "print"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-800"}`}>
                  {m === "checklist" ? "✏️ Checklist" : "👁 Print view"}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-2 bg-navy-100 rounded-full overflow-hidden">
                <div className="h-full bg-gold-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-semibold text-navy-600">{done}/{total} done</span>
            </div>
          </div>
          <button onClick={() => { setMode("print"); setTimeout(() => window.print(), 200); }}
            className="btn-primary text-sm">🖨️ Print / PDF</button>
        </div>
      </div>

      {mode === "checklist" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-3xl">
            {/* Property details */}
            <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Property Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. 14 Maple Avenue, Derby DE1 2AB"
                    className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Target listing date</label>
                  <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
            </div>

            {/* Critical summary */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-amber-800">⚡ Critical items: {criticalDone}/{critical.length} complete</p>
              <p className="text-xs text-amber-700 mt-0.5">These are the actions that most directly affect whether your sale proceeds, your price, and your legal position.</p>
            </div>

            {SECTIONS.map(section => (
              <div key={section.title} className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
                <h2 className="font-bold text-navy-800 text-base mb-4 flex items-center gap-2">
                  <span>{section.icon}</span> {section.title}
                  <span className="ml-auto text-xs text-navy-400 font-normal">
                    {section.items.filter(i => checked[i.id]).length}/{section.items.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.id} className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${checked[item.id] ? "bg-green-50 border border-green-200" : "bg-navy-50 border border-transparent hover:border-navy-200"}`}
                      onClick={() => toggle(item.id)}>
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${checked[item.id] ? "bg-green-500 border-green-500" : "border-navy-300"}`}>
                        {checked[item.id] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold ${checked[item.id] ? "text-green-800 line-through" : "text-navy-800"}`}>{item.title}</p>
                          {item.critical && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">Critical</span>}
                        </div>
                        <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="p-10" style={{ background: "white", color: "#1a1a1a", fontFamily: "Arial, Helvetica, sans-serif" }}>
              <PrintHeader
                category="Property Sales · Preparation"
                title="Home Sale Preparation Checklist"
                date={new Date().toLocaleDateString("en-GB")}
              />
              {address && <p style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}><strong>Property:</strong> {address}</p>}
              <div style={{ border: "1px solid #e5e7eb", padding: "8px 12px", marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1b36" }}>{pct}% complete</span>
                <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 12 }}>{done}/{total} items</span>
              </div>
              {SECTIONS.map(section => (
                <div key={section.title} style={{ marginBottom: 20 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10, marginBottom: 8 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.08em" }}>{section.icon} {section.title}</p>
                  </div>
                  {section.items.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: 8, marginBottom: 6, pageBreakInside: "avoid" }}>
                      <div style={{ width: 14, height: 14, border: "1.5px solid #0f1b36", borderRadius: 3, flexShrink: 0, marginTop: 2, background: checked[item.id] ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {checked[item.id] && <span style={{ fontSize: 9, color: "white", fontWeight: 800 }}>✓</span>}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: checked[item.id] ? 400 : 600, color: checked[item.id] ? "#6b7280" : "#0f1b36", textDecoration: checked[item.id] ? "line-through" : "none" }}>
                          {item.title}{item.critical ? " ★" : ""}
                        </p>
                        <p style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.5 }}>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <PrintFooter docTitle="Home Sale Preparation Checklist" note="★ Critical item · Not legal or financial advice" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("checklist")} className="btn-outline text-sm">← Back to checklist</button>
              <ShareToolbar docTitle="Sale Preparation Checklist" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}








