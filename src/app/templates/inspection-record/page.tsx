"use client";
import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter, PrintSection, PrintRow } from "@/components/PrintDoc";
import Link from "next/link";

const AREAS = [
  { id: "exterior",  name: "Exterior & Entry",   checks: ["Front door security", "Windows (external) — condition", "Gutters/drainage visible issues", "Garden/communal areas"] },
  { id: "lounge",    name: "Living Areas",        checks: ["Flooring — condition", "Walls/ceiling — damage or damp", "Windows — locks working", "Smoke alarm tested"] },
  { id: "kitchen",   name: "Kitchen",             checks: ["Appliances working", "Sink/taps — leaks", "Ventilation/extractor", "Cleanliness (reasonable)"] },
  { id: "bedrooms",  name: "Bedrooms",            checks: ["Flooring/walls — no damage", "Windows/locks", "No unauthorised occupants visible"] },
  { id: "bathroom",  name: "Bathroom(s)",         checks: ["No leaks around bath/shower", "WC functioning", "Ventilation — mould risk", "Tiling/sealant condition"] },
  { id: "utilities", name: "Utilities",           checks: ["Boiler — no warning lights", "No visible damp or condensation", "CO alarm present and working", "Heating — working (if season)"] },
];

const RATINGS = ["OK", "Monitor", "Action needed", "Urgent"];

export default function InspectionRecordTemplate() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [address, setAddress] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantPresent, setTenantPresent] = useState(true);
  const [inspectionNo, setInspectionNo] = useState("1");
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [actionsRequired, setActionsRequired] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const today  = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const refNum = `PV-INS-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  const urgentCount  = AREAS.flatMap(a => a.checks.map(c => ratings[`${a.id}-${c}`])).filter(r => r === "Urgent").length;
  const actionCount  = AREAS.flatMap(a => a.checks.map(c => ratings[`${a.id}-${c}`])).filter(r => r === "Action needed" || r === "Urgent").length;
  const overallStatus = urgentCount > 0 ? "Urgent issues found" : actionCount > 0 ? "Actions required" : "Satisfactory";
  const overallColor  = urgentCount > 0 ? "#dc2626" : actionCount > 0 ? "#d97706" : "#16a34a";

  return (
    <>
      <style>{`        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; } #print-doc { position: fixed; inset: 0; overflow: auto; background: white; } .no-print { display: none !important; } }`}</style>

      <section className="no-print" style={{ background: "#0f1b36", padding: "32px 0 24px" }}>
        <div className="container-max px-4" style={{ maxWidth: 900 }}>
          <Link href="/templates" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>← All templates</Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>📋 Landlord Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Mid-Tenancy Inspection Record</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Periodic inspection — typically every 3-6 months during tenancy</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setMode("form")} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: mode === "form" ? "white" : "transparent", color: mode === "form" ? "#0f1b36" : "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)" }}>✏️ Fill in</button>
              <button onClick={() => setMode("preview")} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: mode === "preview" ? "white" : "transparent", color: mode === "preview" ? "#0f1b36" : "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)" }}>👁 Preview</button>
              <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 100); }} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#c9a84c", color: "#0f1b36", border: "none" }}>🖨 Print / PDF</button>
            </div>
          </div>
        </div>
      </section>

      {mode === "form" && (
        <section className="no-print" style={{ background: "#f8f9fc", padding: "40px 0 80px" }}>
          <div className="container-max px-4" style={{ maxWidth: 820 }}>

            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Inspection Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { l: "Property address", v: address, s: setAddress, ph: "Full address" },
                  { l: "Inspection date", v: inspectionDate, s: setInspectionDate, t: "date" },
                  { l: "Inspector (landlord/agent)", v: inspectorName, s: setInspectorName, ph: "" },
                  { l: "Tenant name", v: tenantName, s: setTenantName, ph: "" },
                  { l: "Inspection number", v: inspectionNo, s: setInspectionNo, ph: "e.g. 1, 2, 3" },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.l}</label>
                    <input type={f.t || "text"} value={f.v} onChange={e => (f.s as (v: string) => void)(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Tenant present?</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[true, false].map(v => (
                      <button key={String(v)} onClick={() => setTenantPresent(v)}
                        style={{ flex: 1, padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                          background: tenantPresent === v ? "#0f1b36" : "white", color: tenantPresent === v ? "white" : "#374151",
                          borderColor: tenantPresent === v ? "#0f1b36" : "#e2e8f0" }}>
                        {v ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection areas */}
            {AREAS.map(area => (
              <div key={area.id} style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", background: "#f8f9fc", borderBottom: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36" }}>{area.name}</h3>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  {area.checks.map(check => {
                    const key = `${area.id}-${check}`;
                    return (
                      <div key={key} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontSize: 13, color: "#374151", flex: "1 1 180px" }}>{check}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            {RATINGS.map(r => {
                              const col = r === "OK" ? "#16a34a" : r === "Monitor" ? "#2563eb" : r === "Action needed" ? "#d97706" : "#dc2626";
                              return (
                                <button key={r} onClick={() => setRatings(p => ({ ...p, [key]: r }))}
                                  style={{ padding: "5px 8px", borderRadius: 7, fontSize: 10, fontWeight: 600, cursor: "pointer", border: "none",
                                    background: ratings[key] === r ? col : "#f1f5f9",
                                    color: ratings[key] === r ? "white" : "#64748b" }}>
                                  {r}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {ratings[key] && ratings[key] !== "OK" && (
                          <input value={notes[key] || ""} onChange={e => setNotes(p => ({ ...p, [key]: e.target.value }))} placeholder="Note..."
                            style={{ marginTop: 5, width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>Actions Required & Follow-Up</h2>
              <textarea value={actionsRequired} onChange={e => setActionsRequired(e.target.value)} rows={4}
                placeholder="List any actions needed by landlord or tenant, with agreed deadlines..."
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 12 }} />
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Follow-up date (if applicable)</label>
                <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                  style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none" }} />
              </div>
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
            <button onClick={() => setMode("form")} style={{ fontSize: 13, fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>← Back to form</button>
            <button onClick={() => window.print()} style={{ padding: "10px 24px", background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🖨 Print / Save as PDF</button>
          </div>

          <div id="print-doc" style={{ maxWidth: 800, margin: "0 auto", background: "white", fontFamily: "Arial, sans-serif", color: "#1a1a1a", padding: "40px" }}>
            <PrintHeader
              category="Property Management · Mid-Tenancy"
              title="Mid-Tenancy Inspection Record"
              reference={refNum}
              date={today}
            />
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 20 }}>Periodic inspection {inspectionNo ? `#${inspectionNo}` : ""}</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24, padding: "14px", background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                {[
                  { l: "Property", v: address || "—" },
                  { l: "Date", v: inspectionDate ? new Date(inspectionDate).toLocaleDateString("en-GB") : today },
                  { l: "Inspector", v: inspectorName || "—" },
                  { l: "Tenant", v: tenantName || "—" },
                  { l: "Tenant present", v: tenantPresent ? "Yes" : "No" },
                  { l: "Inspection no.", v: inspectionNo || "—" },
                ].map(s => (
                  <div key={s.l}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{s.l}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36", marginTop: 2 }}>{s.v}</p>
                  </div>
                ))}
              </div>

              {AREAS.map(area => (
                <div key={area.id} style={{ marginBottom: 16 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase" }}>{area.name}</p>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                    {area.checks.map((check, ii) => {
                      const key = `${area.id}-${check}`;
                      const r = ratings[key];
                      const n = notes[key];
                      const col = r === "OK" ? "#16a34a" : r === "Monitor" ? "#2563eb" : r === "Action needed" ? "#d97706" : r === "Urgent" ? "#dc2626" : "#94a3b8";
                      return (
                        <div key={ii} style={{ display: "flex", padding: "6px 12px", borderBottom: "1px solid #f8f9fc", alignItems: "flex-start", gap: 10 }}>
                          <p style={{ fontSize: 10, flex: 1, color: "#374151" }}>{check}</p>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            {r ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", background: col + "20", color: col, borderRadius: 3 }}>{r}</span>
                               : <span style={{ fontSize: 9, color: "#cbd5e1" }}>—</span>}
                            {n && <p style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{n}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {actionsRequired && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase" }}>Actions Required</p></div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none", padding: 12 }}>
                    <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{actionsRequired}</p>
                    {followUpDate && <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 8 }}>Follow-up by: {new Date(followUpDate).toLocaleDateString("en-GB")}</p>}
                  </div>
                </div>
              )}

              <SignatureBlock
                signerLabel="Signed (Inspector / Landlord)"
                signerName={inspectorName}
                witnessLabel="Signed (Tenant)"
                showWitness={true}
              />
              <PrintFooter docTitle="Mid-Tenancy Inspection Record" note="24 hrs notice required for entry · Landlord & Tenant Act 1985 s.11" />
          </div>
        </section>
      )}
    </>
  );
}







