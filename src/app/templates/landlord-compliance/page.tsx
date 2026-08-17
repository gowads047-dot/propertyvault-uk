"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter, PrintSection, PrintRow } from "@/components/PrintDoc";
import Link from "next/link";

interface ComplianceItem {
  id: string;
  title: string;
  law: string;
  freq: string;
  critical: boolean;
  detail: string;
  dateField?: string;
  dateLabel?: string;
}

const SECTIONS: { title: string; icon: string; items: ComplianceItem[] }[] = [
  {
    title: "Safety Certificates",
    icon: "🔒",
    items: [
      { id: "gas", title: "Gas Safety Certificate", law: "Gas Safety (Installation & Use) Regs 1998", freq: "Annual", critical: true, detail: "Must be carried out by a Gas Safe registered engineer. Provide a copy to new tenants before move-in and to existing tenants within 28 days of renewal.", dateField: "gasDate", dateLabel: "Certificate date" },
      { id: "eicr", title: "Electrical Installation Condition Report (EICR)", law: "Electrical Safety Standards in the PRS (England) Regs 2020", freq: "Every 5 years", critical: true, detail: "Must be carried out by a qualified electrician. Provide to tenants within 28 days. Remedial work required within 28 days of report.", dateField: "eicrDate", dateLabel: "Report date" },
      { id: "pat", title: "PAT Testing (portable appliances)", law: "Landlord & Tenant Act 1985", freq: "Recommended annual", critical: false, detail: "No fixed legal requirement for frequency, but all electrical appliances you supply must be safe. Keep records.", dateField: "patDate", dateLabel: "Last PAT date" },
    ],
  },
  {
    title: "Fire Safety",
    icon: "🔥",
    items: [
      { id: "smoke", title: "Smoke alarms on every storey", law: "Smoke and Carbon Monoxide Alarm (England) Regs 2015", freq: "Start of each tenancy", critical: true, detail: "At least one smoke alarm on each storey used as living accommodation. Must be tested at start of each new tenancy.", dateField: "smokeDate", dateLabel: "Last tested" },
      { id: "co", title: "Carbon monoxide alarm (rooms with combustion appliances)", law: "Smoke and Carbon Monoxide Alarm (Amendment) Regs 2022", freq: "Start of each tenancy", critical: true, detail: "Required in any room with a fixed combustion appliance (including gas boiler) since Oct 2022. Also required in rooms with solid fuel appliances.", dateField: "coDate", dateLabel: "Last tested" },
      { id: "fire_escape", title: "Adequate fire escape routes", law: "Housing Act 2004 / HHSRS", freq: "Ongoing", critical: true, detail: "Clear, unobstructed escape routes at all times. HMOs require additional fire safety measures — contact your council.", dateField: "", dateLabel: "" },
      { id: "fire_furniture", title: "Furniture fire safety compliance", law: "Furniture & Furnishings (Fire Safety) Regs 1988", freq: "Before tenancy", critical: false, detail: "All upholstered furniture supplied by the landlord must carry the required fire-safety label and meet flammability standards.", dateField: "", dateLabel: "" },
    ],
  },
  {
    title: "Energy & Environment",
    icon: "⚡",
    items: [
      { id: "epc", title: "Energy Performance Certificate (EPC) minimum E rating", law: "Energy Efficiency (Private Rented Property) Regs 2015", freq: "Every 10 years", critical: true, detail: "EPC rating of E or above required to legally let the property. F/G-rated properties cannot be let unless an exemption applies. EPC C required by 2030 — plan upgrades now to avoid last-minute cost spikes.", dateField: "epcDate", dateLabel: "EPC date" },
      { id: "epc_provided", title: "EPC provided to tenant before tenancy", law: "Energy Performance of Buildings Regs 2012", freq: "Per tenancy", critical: true, detail: "Provide the EPC (or email it) before or at the time a new tenancy begins.", dateField: "", dateLabel: "" },
    ],
  },
  {
    title: "Right to Rent",
    icon: "🪪",
    items: [
      { id: "rtr", title: "Right to Rent check carried out", law: "Immigration Act 2014 (England only)", freq: "Before each tenancy", critical: true, detail: "Check all adult occupants have a legal right to rent in the UK. Retain copies of documents. Use the Home Office online checker for BRP/eVisa holders. Repeat check for time-limited permission.", dateField: "rtrDate", dateLabel: "Date checked" },
      { id: "rtr_records", title: "Right to Rent records retained (1 year after tenancy)", law: "Immigration Act 2014", freq: "Ongoing", critical: true, detail: "Keep copies of all Right to Rent documents for the duration of the tenancy plus 1 year.", dateField: "", dateLabel: "" },
    ],
  },
  {
    title: "Tenancy Documents",
    icon: "📄",
    items: [
      { id: "ast", title: "Written tenancy agreement (AST) provided", law: "Renters' Rights Act 2025 / Landlord & Tenant Act 1985", freq: "Per tenancy", critical: true, detail: "A written tenancy agreement is strongly recommended for all tenancies and protects both parties. Note: Section 21 'no-fault' evictions are abolished under the Renters' Rights Act 2025 — all possession claims must now cite a statutory ground under Schedule 2 of the Housing Act 1988 (as amended).", dateField: "", dateLabel: "" },
      { id: "how_to_rent", title: "'How to Rent' guide provided", law: "Renters' Rights Act 2025 / Deregulation Act 2015", freq: "Per tenancy (latest version)", critical: true, detail: "Must provide the current version of the government's 'How to Rent' booklet at the start of each tenancy. This remains a statutory obligation under current landlord law.", dateField: "htrDate", dateLabel: "Date provided" },
      { id: "deposit_protect", title: "Deposit protected within 30 days", law: "Housing Act 2004 (as amended)", freq: "Within 30 days of receipt", critical: true, detail: "Must be protected in a government-approved scheme (DPS, MyDeposits, or TDS). Prescribed information must be given to tenants within 30 days.", dateField: "depositDate", dateLabel: "Date protected" },
      { id: "prescribed_info", title: "Prescribed deposit information provided to tenant", law: "Housing Act 2004", freq: "Within 30 days of receipt", critical: true, detail: "Tenants must receive specific prescribed information about their deposit scheme within 30 days of the deposit being received.", dateField: "", dateLabel: "" },
    ],
  },
  {
    title: "Landlord Registration & Licensing",
    icon: "🏛️",
    items: [
      { id: "hmo_licence", title: "HMO licence (if applicable)", law: "Housing Act 2004", freq: "Every 5 years", critical: true, detail: "Mandatory HMO licence required if property has 5+ occupants from 2+ households. Some local councils require licences for smaller HMOs — check with your council.", dateField: "hmoDate", dateLabel: "Licence expiry" },
      { id: "selective_licence", title: "Selective licensing (if local area requires)", law: "Housing Act 2004 (Part 3)", freq: "Check with your council", critical: false, detail: "Many councils have introduced selective licensing for all private rentals in certain areas. Check gov.uk or your local council's website.", dateField: "", dateLabel: "" },
    ],
  },
  {
    title: "Property Standards",
    icon: "🏠",
    items: [
      { id: "hhsrs", title: "Property free of Category 1 HHSRS hazards", law: "Housing Act 2004 / HHSRS", freq: "Ongoing", critical: true, detail: "Councils can take enforcement action for serious hazards. Common ones: excessive cold, damp & mould, falls, fire, electrical hazards.", dateField: "", dateLabel: "" },
      { id: "repairs", title: "Section 11 repair obligations met", law: "Landlord & Tenant Act 1985 s.11", freq: "Ongoing", critical: true, detail: "Landlords must keep structure, exterior, and installations for water/gas/electricity/heating/sanitation in good repair and proper working order.", dateField: "", dateLabel: "" },
      { id: "water_safe", title: "Water supply safe (Legionella risk assessment)", law: "Health & Safety at Work Act 1974", freq: "At start + when changes made", critical: false, detail: "Landlords must assess the risk of Legionella. For most domestic lets, a simple written assessment noting low risk is sufficient — no specialist is required for basic properties.", dateField: "legDate", dateLabel: "Assessment date" },
    ],
  },
];

interface Dates {
  gasDate: string; eicrDate: string; patDate: string; smokeDate: string; coDate: string;
  epcDate: string; rtrDate: string; htrDate: string; depositDate: string; hmoDate: string; legDate: string;
}

export default function LandlordComplianceTemplate() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [landlordName, setLandlordName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [checkDate, setCheckDate] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenancyStart, setTenancyStart] = useState("");
  const [hmoProperty, setHmoProperty] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [dates, setDates] = useState<Dates>({
    gasDate: "", eicrDate: "", patDate: "", smokeDate: "", coDate: "",
    epcDate: "", rtrDate: "", htrDate: "", depositDate: "", hmoDate: "", legDate: "",
  });
  const [notes, setNotes] = useState("");

  const totalItems = SECTIONS.flatMap(s => s.items).length;
  const criticalItems = SECTIONS.flatMap(s => s.items).filter(i => i.critical).length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const criticalChecked = SECTIONS.flatMap(s => s.items).filter(i => i.critical && checked[i.id]).length;

  const toggleCheck = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const [refNum] = useState(() => `PV-LC-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`);

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: absolute; left: 0; top: 0; width: 100%; overflow: auto; padding: 0; background: white; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <section className="no-print" style={{ background: "#0f1b36", padding: "32px 0 24px" }}>
        <div className="container-max px-4" style={{ maxWidth: 900 }}>
          <Link href="/templates" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>← All templates</Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>✅ Essential Landlord Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Landlord Compliance Checklist</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                {criticalChecked}/{criticalItems} critical items · {checkedCount}/{totalItems} total
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setMode("form")} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: mode === "form" ? "white" : "transparent", color: mode === "form" ? "#0f1b36" : "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)" }}>✏️ Checklist</button>
              <button onClick={() => setMode("preview")} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: mode === "preview" ? "white" : "transparent", color: mode === "preview" ? "#0f1b36" : "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)" }}>👁 Preview</button>
              <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 100); }} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#c9a84c", color: "#0f1b36", border: "none" }}>🖨 Print / PDF</button>
            </div>
          </div>
        </div>
      </section>

      {mode === "form" && (
        <section className="no-print" style={{ background: "#f8f9fc", padding: "40px 0 80px" }}>
          <div className="container-max px-4" style={{ maxWidth: 800 }}>

            {/* Progress bar */}
            <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #e2e8f0", padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36" }}>Completion</span>
                <span style={{ fontSize: 13, color: "#64748b" }}>{checkedCount}/{totalItems} items · {criticalChecked}/{criticalItems} critical</span>
              </div>
              <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${(checkedCount / totalItems) * 100}%`, background: criticalChecked === criticalItems ? "#16a34a" : "#c9a84c", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              {criticalChecked < criticalItems && (
                <p style={{ fontSize: 11, color: "#dc2626" }}>⚠ {criticalItems - criticalChecked} critical item{criticalItems - criticalChecked !== 1 ? "s" : ""} remaining</p>
              )}
              {criticalChecked === criticalItems && criticalItems > 0 && (
                <p style={{ fontSize: 11, color: "#16a34a" }}>✓ All critical items complete</p>
              )}
            </div>

            {/* Property details card */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "24px", marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Property & Tenancy Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {([
                  { label: "Landlord name", val: landlordName, set: setLandlordName, ph: "Full name" },
                  { label: "Property address", val: propertyAddress, set: setPropertyAddress, ph: "Full address" },
                  { label: "Tenant name", val: tenantName, set: setTenantName, ph: "Tenant(s) full name" },
                  { label: "Tenancy start date", val: tenancyStart, set: setTenancyStart, ph: "", type: "date" },
                  { label: "Date of this check", val: checkDate, set: setCheckDate, ph: "", type: "date" },
                ] as const).map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.label}</label>
                    <input type={(f as { type?: string }).type ?? "text"} value={f.val} onChange={e => (f.set as (v: string) => void)(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={hmoProperty} onChange={e => setHmoProperty(e.target.checked)} style={{ width: 18, height: 18 }} />
                <span style={{ fontSize: 13, color: "#374151" }}>This is an HMO (House in Multiple Occupation)</span>
              </label>
            </div>

            {/* Compliance sections */}
            {SECTIONS.map((sec, si) => (
              <div key={si} style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", marginBottom: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: "#f8f9fc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36" }}>{sec.icon} {sec.title}</h3>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{sec.items.filter(i => checked[i.id]).length}/{sec.items.length}</span>
                </div>
                <div>
                  {sec.items.map(item => (
                    <div key={item.id} style={{ borderBottom: "1px solid #f1f5f9", background: checked[item.id] ? "#f0fdf4" : "white" }}>
                      <label onClick={() => toggleCheck(item.id)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 20px", cursor: "pointer" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: checked[item.id] ? "none" : "2px solid #cbd5e1", background: checked[item.id] ? "#16a34a" : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                          {checked[item.id] && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: checked[item.id] ? "#15803d" : "#0f1b36" }}>{item.title}</span>
                            {item.critical && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#fee2e2", color: "#dc2626" }}>Legal requirement</span>}
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.freq}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{item.detail}</p>
                          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, fontStyle: "italic" }}>{item.law}</p>
                        </div>
                      </label>
                      {item.dateField && (
                        <div style={{ padding: "0 20px 14px 54px", display: "flex", alignItems: "center", gap: 10 }}>
                          <label style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{item.dateLabel}:</label>
                          <input type="date" value={dates[item.dateField as keyof Dates]} onChange={e => setDates(p => ({ ...p, [item.dateField!]: e.target.value }))}
                            style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, outline: "none" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", display: "block", marginBottom: 10 }}>Notes & Action Points</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any outstanding actions, upcoming renewals, or notes…" rows={4}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <button onClick={() => setMode("preview")} style={{ width: "100%", padding: 13, background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Preview Document →
            </button>
          </div>
        </section>
      )}

      {mode === "preview" && (
        <section style={{ background: "#e8ecf0", padding: "32px 16px 64px" }}>
          <div className="no-print" style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setMode("form")} style={{ fontSize: 13, fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>← Back to checklist</button>
            <button onClick={() => window.print()} style={{ padding: "10px 24px", background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🖨 Print / Save as PDF</button>
          </div>

          <div id="print-doc" style={{ maxWidth: 800, margin: "0 auto", background: "white", fontFamily: "Arial, sans-serif", color: "#1a1a1a", padding: "40px" }}>
            <PrintHeader
              category="Property Management · Regulatory"
              title="Landlord Compliance Checklist"
              reference={refNum}
              date={today}
            />
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>England &amp; Wales · Updated to reflect April 2025 legislation</p>

              {/* Summary box */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 24, padding: "14px", background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                {[
                  { label: "Landlord", value: landlordName || "—" },
                  { label: "Property", value: propertyAddress || "—" },
                  { label: "Tenant(s)", value: tenantName || "—" },
                  { label: "Tenancy Start", value: fmtDate(tenancyStart) },
                  { label: "Check Date", value: checkDate ? fmtDate(checkDate) : today },
                  { label: "Completion", value: `${checkedCount}/${totalItems}` },
                  { label: "Critical Items", value: `${criticalChecked}/${criticalItems}` },
                  { label: "Property Type", value: hmoProperty ? "HMO" : "Single let" },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36", marginTop: 2 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 14, background: "#16a34a", borderRadius: 3 }} /><p style={{ fontSize: 10, color: "#374151" }}>Complete</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 14, border: "1.5px solid #cbd5e1", borderRadius: 3 }} /><p style={{ fontSize: 10, color: "#374151" }}>Not yet complete</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", background: "#fee2e2", color: "#dc2626", borderRadius: 3 }}>L</span><p style={{ fontSize: 10, color: "#374151" }}>Legal requirement</p>
                </div>
              </div>

              {/* Sections */}
              {SECTIONS.map((sec, si) => (
                <div key={si} style={{ marginBottom: 18 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sec.icon} {sec.title}</p>
                    <p style={{ fontSize: 10, color: "#c9a84c" }}>{sec.items.filter(i => checked[i.id]).length}/{sec.items.length}</p>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                    {sec.items.map((item, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 10, padding: "8px 12px", borderBottom: "1px solid #f1f5f9", background: checked[item.id] ? "#f0fdf4" : "white", alignItems: "flex-start" }}>
                        <div style={{ width: 14, height: 14, border: checked[item.id] ? "none" : "1.5px solid #cbd5e1", background: checked[item.id] ? "#16a34a" : "white", borderRadius: 3, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                          {checked[item.id] && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: checked[item.id] ? "#15803d" : "#0f1b36" }}>{item.title}</p>
                            {item.critical && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", background: "#fee2e2", color: "#dc2626", borderRadius: 3 }}>L</span>}
                            <p style={{ fontSize: 9, color: "#94a3b8" }}>{item.freq}</p>
                            {item.dateField && dates[item.dateField as keyof Dates] && (
                              <p style={{ fontSize: 9, color: "#0f1b36", fontWeight: 600 }}>📅 {fmtDate(dates[item.dateField as keyof Dates])}</p>
                            )}
                          </div>
                          <p style={{ fontSize: 9, color: "#64748b", fontStyle: "italic" }}>{item.law}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notes */}
              {notes && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes & Action Points</p>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none", padding: 12 }}>
                    <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{notes}</p>
                  </div>
                </div>
              )}

              <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 16, background: criticalChecked === criticalItems ? "#f0fdf4" : "#fff7ed" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", marginBottom: 4 }}>COMPLIANCE STATUS</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: criticalChecked === criticalItems ? "#16a34a" : "#d97706" }}>
                  {criticalChecked === criticalItems ? "COMPLIANT" : `${criticalItems - criticalChecked} CRITICAL ITEMS OUTSTANDING`}
                </p>
                <p style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>{checkedCount}/{totalItems} items complete · {criticalChecked}/{criticalItems} critical items complete</p>
              </div>
              <SignatureBlock signerLabel="Signed (Landlord)" signerName={landlordName} showWitness={false} />
              <PrintFooter docTitle="Landlord Compliance Checklist" note="Guidance only — verify current requirements with a qualified solicitor" />
          </div>
        </section>
      )}
    </>
  );
}






