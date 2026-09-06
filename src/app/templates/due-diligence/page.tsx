"use client";

import { useState } from "react";
import {ShareToolbar } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter } from "@/components/PrintDoc";

const SECTIONS = [
  {
    title: "Title & Legal",
    icon: "⚖️",
    items: [
      { id: "title_reg", title: "Confirm property is registered at Land Registry", detail: "Download the title register from gov.uk (£3). Check the registered owner matches the seller. Note any restrictions, charges, or cautions on the title.", critical: true },
      { id: "title_absolute", title: "Title class — confirm 'Absolute' (not Possessory or Qualified)", detail: "Absolute freehold or leasehold title is standard. Possessory or Qualified title indicates a defect in the title history — seek legal advice before proceeding.", critical: true },
      { id: "encumbrances", title: "Check all charges and mortgages registered", detail: "Any outstanding mortgages or legal charges must be discharged on completion. Confirm with the seller's solicitor that all charges will be cleared.", critical: true },
      { id: "restrictive_cov", title: "Review all restrictive covenants", detail: "Covenants may restrict use (e.g. no retail, no alterations, no HMO). Check these against your intended use. Some covenants are unenforceable but require legal opinion. Budget for indemnity insurance if needed.", critical: true },
      { id: "easements", title: "Review easements and rights of way", detail: "Check for rights of way over the property (footpaths, drainage, services). Also confirm you have all necessary rights over adjacent land (access routes, utility connections).", critical: true },
      { id: "boundaries", title: "Verify boundaries match physical reality", detail: "Title plan boundary lines are indicative only. Walk the boundary against the title plan. Disputes with neighbours over boundaries are expensive and slow — identify issues before exchange.", critical: false },
      { id: "searches", title: "Commission all standard legal searches", detail: "Local authority search (planning history, road adoption, enforcement notices), drainage search, environmental search, chancel repair liability search, coal/mining search if relevant. Budget £350–600.", critical: true },
      { id: "s106", title: "Check for Section 106 obligations", detail: "S106 agreements bind the land (not just the current owner). Obligations may include affordable housing contributions, CIL payments, infrastructure bonds, or restrictions on occupation.", critical: false },
    ],
  },
  {
    title: "Planning & Permitted Use",
    icon: "🏗️",
    items: [
      { id: "planning_use", title: "Confirm current lawful use class", detail: "Check the planning use class (Use Classes Order 2020): C3 (dwelling), E (commercial/office/retail), C4 (HMO), Sui Generis. Any use outside the lawful class requires planning permission.", critical: true },
      { id: "planning_history", title: "Review full planning history on LPA website", detail: "Access via the local planning authority's online planning portal. Look for refused applications, enforcement notices, Article 4 directions, and conditions on any permissions granted.", critical: true },
      { id: "article4", title: "Check for Article 4 Directions restricting PD rights", detail: "Article 4 Directions remove permitted development rights. Common in conservation areas and some residential areas (removing rights to convert to HMO). Check with the LPA.", critical: true },
      { id: "conservation", title: "Check conservation area / listed building status", detail: "Works requiring consent are far broader in conservation areas and on listed buildings. Budget for specialist architects and higher costs. Check Historic England's National Heritage List.", critical: false },
      { id: "future_plans", title: "Review local plan for surrounding area", detail: "Check the local development plan for major infrastructure projects, rezoning, road schemes, or allocated development sites near the property. Access via the LPA website.", critical: false },
      { id: "planning_permission", title: "Verify any consents granted have been lawfully implemented", detail: "Planning permissions that have not been commenced within their time limit have lapsed. Check commencement and completion of any extensions, conversions, or changes of use.", critical: true },
    ],
  },
  {
    title: "Environmental",
    icon: "🌱",
    items: [
      { id: "contamination", title: "Commission Phase 1 Environmental Assessment", detail: "A desktop study of the site history, historical maps, and nearby land uses. Required by most commercial lenders. If risk is identified, commission a Phase 2 (intrusive) investigation. Budget £800–2,500 for Phase 1.", critical: true },
      { id: "flood_risk", title: "Check flood zone and flood risk", detail: "Search Environment Agency flood map (flood-map-for-planning.service.gov.uk). Zone 2 or 3 properties require a flood risk assessment before planning. Check whether current insurance is available and at what cost.", critical: true },
      { id: "ground_stability", title: "Check for mining, subsidence, or ground instability", detail: "Coal Authority interactive map for mining risk. British Geological Survey for natural subsidence risk (particularly in clay-heavy areas). Historic brickworks or other extractive industries can create voids.", critical: false },
      { id: "asbestos", title: "Asbestos survey for pre-2000 buildings", detail: "Any commercial building built before 2000 may contain asbestos. A Management Survey is required by law. A Refurbishment/Demolition Survey is required before any structural works.", critical: true },
      { id: "epc_comm", title: "Check EPC rating and MEES compliance", detail: "Commercial properties must have an EPC rating of E or above to be let (MEES regulations). Planned increase to B by 2030. Factor EPC improvement costs into your budget.", critical: true },
    ],
  },
  {
    title: "Physical Condition",
    icon: "🔨",
    items: [
      { id: "structural_survey", title: "Commission a full structural survey", detail: "For commercial property, instruct a chartered building surveyor (RICS). A full building survey identifies all structural defects, maintenance issues, and potential liabilities. Budget £1,500–5,000 depending on size.", critical: true },
      { id: "roof_condition", title: "Inspect roof covering, drainage, and parapet walls", detail: "Flat roofs, parapet walls, and gutters are common problem areas. Get a roofer's report if the surveyor flags concerns. A roof replacement on a commercial property can cost £30,000–200,000+.", critical: true },
      { id: "services", title: "Verify all services connections (gas, electric, water, drainage)", detail: "Confirm all services are connected, legally adopted, and adequate for your intended use. Obtain connection sizes — undersized services may need upgrading at significant cost.", critical: true },
      { id: "eicr_comm", title: "Electrical Installation Condition Report (EICR)", detail: "Required before any commercial letting. Identifies remedial electrical work needed. Budget £400–2,000 depending on building size and complexity.", critical: true },
      { id: "fire_safety", title: "Fire risk assessment and fire safety compliance", detail: "All commercial buildings require a fire risk assessment by a competent person. Check adequacy of fire detection, suppression, escape routes, and signage against the Regulatory Reform (Fire Safety) Order 2005.", critical: true },
      { id: "accessibility", title: "Equality Act / DDA accessibility compliance", detail: "Under the Equality Act 2010, reasonable adjustments must be made for disabled access. Assess compliance and budget for any required works — step-free access, hearing loops, accessible facilities.", critical: false },
    ],
  },
  {
    title: "Financial & Tenancy",
    icon: "💷",
    items: [
      { id: "rent_roll", title: "Obtain and verify current rent roll", detail: "Get a schedule of all tenants, lease terms, rents, rent-free periods, and break clauses. Verify against actual signed leases — not just what the agent says.", critical: true },
      { id: "lease_terms", title: "Review all leases in full", detail: "Check: term length, break clauses, rent review mechanism (upward only? RPI? Open market?), service charge obligations, repairing obligations, alienation restrictions, permitted use.", critical: true },
      { id: "tenant_covenants", title: "Assess tenant covenant strength", detail: "Research each tenant's financial health. Check Companies House filings, credit ratings, turnover, and profit. A property let to a financially weak tenant is worth less — and risks void periods.", critical: true },
      { id: "service_charge", title: "Review service charge accounts (3 years)", detail: "Get 3 years of service charge accounts. Check for large one-off expenditures, sinking fund balance, and whether charges are recoverable under the leases. Unexplained deficits are a red flag.", critical: false },
      { id: "arrears", title: "Confirm rent arrears position", detail: "Request a rent arrears schedule. Any arrears at completion become your problem. Negotiate a reduction in price or a rent deposit/retention to cover outstanding amounts.", critical: true },
      { id: "capex", title: "Estimate capital expenditure requirements in years 1–5", detail: "Based on the building survey and service charge history, estimate major capital works required in the short term (roof, boiler, lift, cladding). Factor these into your offer price.", critical: true },
      { id: "vat", title: "Check VAT position on the property", detail: "If the seller has opted to tax the property for VAT, the sale is subject to 20% VAT — unless it qualifies as a Transfer of a Going Concern (TOGC). Take specialist advice immediately if VAT is an issue.", critical: true },
    ],
  },
  {
    title: "Exit Strategy",
    icon: "🚪",
    items: [
      { id: "comparable_sales", title: "Research comparable investment sales", detail: "Obtain comparable evidence of similar properties sold (by yield and capital value per sq ft) in the last 12 months. CoStar, EGi, or a commercial agent can assist. Validates your entry price.", critical: true },
      { id: "rental_demand", title: "Assess local rental demand for the use class", detail: "What is the void rate for this type of property in this location? Talk to 2–3 local commercial agents. A property with long void risk needs a much higher yield to compensate.", critical: true },
      { id: "planning_potential", title: "Consider permitted development / planning uplift potential", detail: "Is there an angle for permitted development conversion (office to residential, commercial to mixed-use)? Planning uplift can significantly increase exit value if pursued correctly.", critical: false },
      { id: "financing", title: "Confirm lender appetite before exchange", detail: "Get a credit-approved DIP from your lender before exchanging contracts. Commercial lenders frequently decline or change terms at offer stage based on survey and legal findings.", critical: true },
    ],
  },
];

export default function DueDiligenceTemplate() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"checklist" | "print">("checklist");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [solicitor, setSolicitor] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));

  const all = SECTIONS.flatMap(s => s.items);
  const total = all.length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  const criticals = all.filter(i => i.critical);
  const critDone = criticals.filter(i => checked[i.id]).length;

  const statusColor = pct < 40 ? "#ef4444" : pct < 80 ? "#f59e0b" : "#22c55e";

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Commercial Property Due Diligence</h1>
          <p className="text-navy-200 max-w-2xl">A comprehensive pre-purchase checklist for commercial property investors. Covers legal, planning, environmental, structural, financial, and exit strategy — {total} items across 6 categories.</p>
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
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-28 h-2 bg-navy-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: statusColor }} />
              </div>
              <span className="text-sm font-semibold text-navy-600">{done}/{total}</span>
            </div>
          </div>
          <button onClick={() => { setMode("print"); setTimeout(() => window.print(), 200); }}
            className="btn-primary text-sm">🖨️ Print / PDF</button>
        </div>
      </div>

      {mode === "checklist" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-3xl">
            {/* Deal details */}
            <div className="bg-white rounded-2xl border border-navy-100 p-6 mb-6">
              <h2 className="font-bold text-navy-800 text-sm mb-4 uppercase tracking-wide">Deal Details</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="duediligence-property-address" className="block text-sm font-semibold text-navy-700 mb-1">Property Address</label>
                  <input id="duediligence-property-address" type="text" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)}
                    placeholder="Commercial property address"
                    className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Purchase Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">£</span>
                    <input aria-label="Purchase price in pounds" type="text" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)}
                      placeholder="500,000"
                      className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="duediligence-solicitor-surveyor" className="block text-sm font-semibold text-navy-700 mb-1">Solicitor / Surveyor</label>
                <input id="duediligence-solicitor-surveyor" type="text" value={solicitor} onChange={e => setSolicitor(e.target.value)}
                  placeholder="Firm name"
                  className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
            </div>

            {/* Critical warning */}
            {critDone < criticals.length && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-red-800">🚨 Do not exchange contracts until all critical items are resolved</p>
                <p className="text-xs text-red-700 mt-0.5">{criticals.length - critDone} critical item{criticals.length - critDone !== 1 ? "s" : ""} outstanding. Critical items are marked with a red border.</p>
              </div>
            )}

            {SECTIONS.map(section => {
              const secDone = section.items.filter(i => checked[i.id]).length;
              return (
                <div key={section.title} className="bg-white rounded-2xl border border-navy-100 p-6 mb-4">
                  <h2 className="font-bold text-navy-800 text-base mb-4 flex items-center gap-2">
                    <span>{section.icon}</span> {section.title}
                    <span className="ml-auto text-xs text-navy-400 font-normal">{secDone}/{section.items.length}</span>
                  </h2>
                  <div className="space-y-3">
                    {section.items.map(item => (
                      <div key={item.id} className={`rounded-xl border transition-colors ${checked[item.id] ? "bg-green-50 border-green-200" : item.critical ? "bg-red-50/40 border-red-200" : "bg-navy-50 border-transparent hover:border-navy-200"}`}>
                        <div className="flex gap-3 p-3 cursor-pointer" onClick={() => toggle(item.id)}>
                          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${checked[item.id] ? "bg-green-500 border-green-500" : item.critical ? "border-red-400" : "border-navy-300"}`}>
                            {checked[item.id] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-semibold ${checked[item.id] ? "text-green-800 line-through" : "text-navy-800"}`}>{item.title}</p>
                              {item.critical && !checked[item.id] && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">Critical</span>}
                            </div>
                            <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">{item.detail}</p>
                          </div>
                        </div>
                        <div className="px-3 pb-2">
                          <button onClick={() => setShowNotes(p => ({ ...p, [item.id]: !p[item.id] }))}
                            className="text-xs text-navy-400 hover:text-navy-700 transition-colors">
                            {showNotes[item.id] ? "▲ Hide notes" : "▼ Add note"}
                          </button>
                          {showNotes[item.id] && (
                            <textarea aria-label="Add notes, costs, contacts, or outstanding actions" value={notes[item.id] || ""} onChange={e => setNotes(p => ({ ...p, [item.id]: e.target.value }))}
                              placeholder="Add notes, costs, contacts, or outstanding actions..."
                              className="w-full mt-1 px-3 py-2 border border-navy-200 rounded-lg text-xs text-navy-700 focus:outline-none focus:ring-1 focus:ring-gold-400 resize-none"
                              rows={2} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="p-10" style={{ background: "white", color: "#1a1a1a", fontFamily: "Arial, Helvetica, sans-serif" }}>
              <PrintHeader
                category="Investment Due Diligence"
                title="Commercial Due Diligence Checklist"
                date={new Date().toLocaleDateString("en-GB")}
              />
              {propertyAddress && <p style={{ fontSize: 11, color: "#374151", marginBottom: 4 }}><strong>Property:</strong> {propertyAddress}</p>}
              {purchasePrice && <p style={{ fontSize: 11, color: "#374151", marginBottom: 16 }}><strong>Purchase price:</strong> £{purchasePrice}</p>}
              <div style={{ border: "1px solid #e5e7eb", padding: "10px 14px", marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{pct}% complete</span>
                <span style={{ fontSize: 10, color: "#6b7280", marginLeft: 12 }}>{done}/{total} items</span>
              </div>

              {SECTIONS.map(section => (
                <div key={section.title} style={{ marginBottom: 18, breakInside: "avoid" }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10, marginBottom: 8 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.08em" }}>{section.title}</p>
                  </div>
                  <div style={{ border: "1px solid #e5e7eb", borderTop: "none" }}>
                    {section.items.map((item) => (
                      <div key={item.id} style={{ display: "flex", gap: 10, padding: "7px 12px", borderBottom: "1px solid #f1f5f9", background: checked[item.id] ? "#f0fdf4" : "white" }}>
                        <div style={{ width: 13, height: 13, border: `1.5px solid ${item.critical && !checked[item.id] ? "#ef4444" : "#0f1b36"}`, flexShrink: 0, marginTop: 2, background: checked[item.id] ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {checked[item.id] && <span style={{ fontSize: 8, color: "white", fontWeight: 800 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 11, color: checked[item.id] ? "#6b7280" : "#0f1b36" }}>
                            {item.title}{item.critical ? " ★" : ""}
                          </p>
                          {notes[item.id] && <p style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>Note: {notes[item.id]}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <PrintFooter docTitle="Commercial Due Diligence Checklist" note="★ Critical — do not exchange until resolved · Not legal or financial advice" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("checklist")} className="btn-outline text-sm">← Back</button>
              <ShareToolbar docTitle="Property Due Diligence Report" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}








