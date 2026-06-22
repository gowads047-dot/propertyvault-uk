"use client";
import { useState } from "react";
import Link from "next/link";

const ROOMS = [
  { id: "entrance", name: "Entrance / Hallway", items: ["Front door — condition, locks, letter box", "Flooring — type and condition", "Walls and ceiling — marks, damage, paint", "Lighting — working", "Smoke alarm present and tested"] },
  { id: "lounge", name: "Living Room", items: ["Flooring — type and condition", "Walls and ceiling", "Windows — glazing, handles, locks", "Light fittings — working", "Fireplace (if present)", "TV aerial point", "Socket count"] },
  { id: "kitchen", name: "Kitchen", items: ["Flooring", "Worktops — condition", "Cupboard doors and handles", "Sink and taps — pressure, drainage", "Oven / hob — condition and working", "Extractor fan — working", "Fridge / freezer (if supplied)", "Dishwasher (if supplied)", "Walls and tiles"] },
  { id: "bed1", name: "Bedroom 1", items: ["Flooring", "Walls and ceiling", "Windows and curtains/blinds", "Built-in wardrobe (if present)", "Sockets and light fitting"] },
  { id: "bed2", name: "Bedroom 2", items: ["Flooring", "Walls and ceiling", "Windows and curtains/blinds", "Built-in wardrobe (if present)", "Sockets and light fitting"] },
  { id: "bed3", name: "Bedroom 3 (if applicable)", items: ["Flooring", "Walls and ceiling", "Windows", "Sockets and light fitting"] },
  { id: "bathroom", name: "Bathroom", items: ["Bath / shower — condition and pressure", "WC — flush and seat", "Basin — condition and taps", "Tiling — condition", "Mirror (if supplied)", "Extractor fan — working", "Heated towel rail (if present)"] },
  { id: "exterior", name: "Exterior & Garden", items: ["Front door — condition", "Rear garden — condition", "Fencing and gates — condition", "Driveway / parking", "Bin storage", "Shed (if present)"] },
  { id: "utilities", name: "Utilities & Meters", items: ["Gas meter reading recorded", "Electricity meter reading recorded", "Water meter (if present)", "Boiler — age and condition", "Stop cock location noted", "Fuse box — RCDs working"] },
];

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

export default function InventoryChecklistTemplate() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [address, setAddress] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [keyCount, setKeyCount] = useState("");
  const [meterGas, setMeterGas] = useState("");
  const [meterElec, setMeterElec] = useState("");
  const [conditions, setConditions] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [generalNotes, setGeneralNotes] = useState("");

  const setCondition = (key: string, val: string) => setConditions(p => ({ ...p, [key]: val }));
  const setNote = (key: string, val: string) => setNotes(p => ({ ...p, [key]: val }));
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const refNum = `PV-INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  return (
    <>
      <style>{`@media print { body * { visibility: hidden !important; } #print-doc, #print-doc * { visibility: visible !important; } #print-doc { position: fixed; inset: 0; overflow: auto; background: white; padding: 0; } .no-print { display: none !important; } }`}</style>

      <section className="no-print" style={{ background: "#0f1b36", padding: "32px 0 24px" }}>
        <div className="container-max px-4" style={{ maxWidth: 900 }}>
          <Link href="/templates" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>← All templates</Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>📋 Landlord Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Property Inventory Checklist</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Room-by-room condition report — essential for deposit protection</p>
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
            {/* Property details */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Property & Tenancy Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { label: "Property address", val: address, set: setAddress, ph: "Full address" },
                  { label: "Check-in date", val: checkInDate, set: setCheckInDate, ph: "", type: "date" },
                  { label: "Landlord name", val: landlordName, set: setLandlordName, ph: "" },
                  { label: "Tenant name(s)", val: tenantName, set: setTenantName, ph: "" },
                  { label: "Agent name (if any)", val: agentName, set: setAgentName, ph: "" },
                  { label: "Number of keys issued", val: keyCount, set: setKeyCount, ph: "e.g. 2 front door, 1 back" },
                  { label: "Gas meter reading", val: meterGas, set: setMeterGas, ph: "" },
                  { label: "Electricity meter reading", val: meterElec, set: setMeterElec, ph: "" },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.label}</label>
                    <input type={(f as { type?: string }).type || "text"} value={f.val} onChange={e => (f.set as (v: string) => void)(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            {ROOMS.map(room => (
              <div key={room.id} style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", marginBottom: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: "#f8f9fc", borderBottom: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36" }}>{room.name}</h3>
                </div>
                <div style={{ padding: "16px 20px" }}>
                  {room.items.map(item => {
                    const key = `${room.id}-${item}`;
                    return (
                      <div key={key} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontSize: 13, color: "#374151", flex: "1 1 200px" }}>{item}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            {CONDITIONS.map(c => (
                              <button key={c} onClick={() => setCondition(key, c)}
                                style={{ padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none",
                                  background: conditions[key] === c
                                    ? c === "Excellent" ? "#16a34a" : c === "Good" ? "#2563eb" : c === "Fair" ? "#d97706" : "#dc2626"
                                    : "#f1f5f9",
                                  color: conditions[key] === c ? "white" : "#64748b" }}>
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                        {conditions[key] && conditions[key] !== "Excellent" && (
                          <input value={notes[key] || ""} onChange={e => setNote(key, e.target.value)} placeholder="Add note..."
                            style={{ marginTop: 6, width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* General notes */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", display: "block", marginBottom: 10 }}>General Notes & Observations</label>
              <textarea value={generalNotes} onChange={e => setGeneralNotes(e.target.value)} rows={4} placeholder="Any additional observations, pre-existing damage, items agreed to fix before move-in…"
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
            <button onClick={() => setMode("form")} style={{ fontSize: 13, fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>← Back to form</button>
            <button onClick={() => window.print()} style={{ padding: "10px 24px", background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🖨 Print / Save as PDF</button>
          </div>

          <div id="print-doc" style={{ maxWidth: 800, margin: "0 auto", background: "white", boxShadow: "0 4px 40px rgba(0,0,0,0.15)", fontFamily: "Arial, sans-serif", color: "#1a1a1a" }}>
            <div style={{ background: "#0f1b36", padding: "24px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: "white" }}>PropertyVault<span style={{ color: "#c9a84c" }}>.co.uk</span></p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Ref: {refNum} · {today}</p>
              </div>
            </div>
            <div style={{ height: 4, background: "#c9a84c" }} />

            <div style={{ padding: "28px 36px 36px" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>Property Inventory Report</h1>
              <p style={{ fontSize: 11, color: "#64748b", marginBottom: 20 }}>Check-in inventory — condition recorded at start of tenancy</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24, padding: "14px", background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                {[
                  { l: "Property", v: address || "—" },
                  { l: "Check-in Date", v: checkInDate ? new Date(checkInDate).toLocaleDateString("en-GB") : today },
                  { l: "Landlord", v: landlordName || "—" },
                  { l: "Tenant(s)", v: tenantName || "—" },
                  { l: "Keys Issued", v: keyCount || "—" },
                  { l: "Agent", v: agentName || "—" },
                  { l: "Gas Meter", v: meterGas || "—" },
                  { l: "Elec Meter", v: meterElec || "—" },
                  { l: "Ref", v: refNum },
                ].map(s => (
                  <div key={s.l}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36", marginTop: 2 }}>{s.v}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                {[["Excellent","#16a34a"],["Good","#2563eb"],["Fair","#d97706"],["Poor","#dc2626"]].map(([c,col]) => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: col as string }} />
                    <p style={{ fontSize: 9, color: "#374151" }}>{c}</p>
                  </div>
                ))}
              </div>

              {ROOMS.map(room => {
                const roomItems = room.items.filter(item => conditions[`${room.id}-${item}`]);
                return (
                  <div key={room.id} style={{ marginBottom: 16 }}>
                    <div style={{ background: "#0f1b36", padding: "5px 12px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>{room.name}</p>
                    </div>
                    <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                      {room.items.map((item, ii) => {
                        const key = `${room.id}-${item}`;
                        const cond = conditions[key];
                        const note = notes[key];
                        const col = cond === "Excellent" ? "#16a34a" : cond === "Good" ? "#2563eb" : cond === "Fair" ? "#d97706" : cond === "Poor" ? "#dc2626" : "#94a3b8";
                        return (
                          <div key={ii} style={{ display: "flex", padding: "6px 12px", borderBottom: "1px solid #f8f9fc", alignItems: "flex-start", gap: 10 }}>
                            <p style={{ fontSize: 10, flex: 1, color: "#374151" }}>{item}</p>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              {cond ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", background: col + "20", color: col, borderRadius: 3 }}>{cond}</span>
                                    : <span style={{ fontSize: 9, color: "#cbd5e1" }}>—</span>}
                              {note && <p style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {generalNotes && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ background: "#0f1b36", padding: "5px 12px" }}><p style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase" }}>General Notes</p></div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none", padding: 12 }}><p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{generalNotes}</p></div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
                {[{ l: "Landlord / Agent", n: landlordName }, { l: "Tenant", n: tenantName }].map(s => (
                  <div key={s.l} style={{ border: "1px solid #e2e8f0", padding: 14 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", marginBottom: 20 }}>SIGNED: {s.l.toUpperCase()}</p>
                    <div style={{ borderBottom: "1px solid #1a1a1a", marginBottom: 4 }} />
                    <p style={{ fontSize: 9, color: "#64748b" }}>{s.n || "Name: ___________________________"}</p>
                    <p style={{ fontSize: 9, color: "#64748b", marginTop: 4 }}>Date: ___________________________</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 8, color: "#94a3b8", marginTop: 24, lineHeight: 1.5 }}>
                This inventory was produced at check-in and records the condition of the property at the start of the tenancy. Both parties should sign to confirm accuracy. Generated by PropertyVault UK. Ref: {refNum}. © {new Date().getFullYear()} PropertyVault UK.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
