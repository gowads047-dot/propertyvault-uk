"use client";
import { useState } from "react";
import { SignatureBlock } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter } from "@/components/PrintDoc";
import Link from "next/link";

const fmt = (n: number) => "£" + n.toFixed(2);

const ROOMS = [
  { id: "entrance", name: "Entrance / Hallway" },
  { id: "lounge",   name: "Living Room" },
  { id: "kitchen",  name: "Kitchen" },
  { id: "bed1",     name: "Bedroom 1" },
  { id: "bed2",     name: "Bedroom 2" },
  { id: "bed3",     name: "Bedroom 3 (if applicable)" },
  { id: "bathroom", name: "Bathroom" },
  { id: "exterior", name: "Exterior & Garden" },
];

const CONDITIONS = ["Same as check-in", "Fair wear & tear", "Tenant damage", "Missing"];

export default function CheckOutReportTemplate() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [address, setAddress] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [depositHeld, setDepositHeld] = useState(0);
  const [depositScheme, setDepositScheme] = useState("");
  const [meterGas, setMeterGas] = useState("");
  const [meterElec, setMeterElec] = useState("");
  const [keysReturned, setKeysReturned] = useState("");
  const [conditions, setConditions] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [deductions, setDeductions] = useState<{ desc: string; amount: number }[]>([
    { desc: "", amount: 0 }, { desc: "", amount: 0 }, { desc: "", amount: 0 }
  ]);
  const [generalNotes, setGeneralNotes] = useState("");

  const totalDeductions = deductions.reduce((s, d) => s + (d.amount || 0), 0);
  const refund = Math.max(0, depositHeld - totalDeductions);
  const today  = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const [refNum] = useState(() => `PV-CO-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`);

  const updateDeduction = (i: number, field: "desc" | "amount", val: string | number) =>
    setDeductions(prev => prev.map((d, j) => j === i ? { ...d, [field]: val } : d));

  return (
    <>
      <style>{`        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; } #print-doc { position: absolute; left: 0; top: 0; width: 100%; overflow: auto; background: white; } .no-print { display: none !important; } }`}</style>

      <section className="no-print" style={{ background: "#0f1b36", padding: "32px 0 24px" }}>
        <div className="container-max px-4" style={{ maxWidth: 900 }}>
          <Link href="/templates" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>← All templates</Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>📋 Landlord Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Check-Out Inspection Report</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>End-of-tenancy condition report with deposit deduction schedule</p>
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
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Property & Tenancy</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { l: "Property address", v: address, s: setAddress, ph: "Full address" },
                  { l: "Check-out date", v: checkOutDate, s: setCheckOutDate, t: "date" },
                  { l: "Tenant name", v: tenantName, s: setTenantName, ph: "" },
                  { l: "Landlord / Agent", v: landlordName, s: setLandlordName, ph: "" },
                  { l: "Deposit scheme", v: depositScheme, s: setDepositScheme, ph: "e.g. DPS, TDS, MyDeposits" },
                  { l: "Keys returned", v: keysReturned, s: setKeysReturned, ph: "e.g. 2 front, 1 back" },
                  { l: "Gas meter reading", v: meterGas, s: setMeterGas, ph: "" },
                  { l: "Electricity meter", v: meterElec, s: setMeterElec, ph: "" },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.l}</label>
                    <input type={f.t || "text"} value={f.v} onChange={e => (f.s as (v: string) => void)(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Deposit held (£)</label>
                  <input type="number" value={depositHeld || ""} onChange={e => setDepositHeld(Number(e.target.value))} placeholder="e.g. 1200"
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>

            {/* Room conditions */}
            {ROOMS.map(room => (
              <div key={room.id} style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", background: "#f8f9fc", borderBottom: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36" }}>{room.name}</h3>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    {CONDITIONS.map(c => {
                      const col = c === "Same as check-in" ? "#16a34a" : c === "Fair wear & tear" ? "#2563eb" : c === "Tenant damage" ? "#dc2626" : "#d97706";
                      return (
                        <button key={c} onClick={() => setConditions(p => ({ ...p, [room.id]: c }))}
                          style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none",
                            background: conditions[room.id] === c ? col : "#f1f5f9",
                            color: conditions[room.id] === c ? "white" : "#64748b" }}>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <textarea value={notes[room.id] || ""} onChange={e => setNotes(p => ({ ...p, [room.id]: e.target.value }))}
                    placeholder="Specific observations for this room..." rows={2}
                    style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 12, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              </div>
            ))}

            {/* Deductions */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Deposit Deduction Schedule</h2>
              {deductions.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <input value={d.desc} onChange={e => updateDeduction(i, "desc", e.target.value)} placeholder={`Deduction ${i + 1} description`}
                    style={{ flex: 3, padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>£</span>
                    <input type="number" value={d.amount || ""} onChange={e => updateDeduction(i, "amount", Number(e.target.value))} placeholder="0.00"
                      style={{ flex: 1, padding: "9px 10px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none" }} />
                  </div>
                </div>
              ))}
              <button onClick={() => setDeductions(p => [...p, { desc: "", amount: 0 }])}
                style={{ fontSize: 13, color: "#c9a84c", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add another deduction</button>

              {depositHeld > 0 && (
                <div style={{ marginTop: 16, padding: "14px", background: "#f8f9fc", borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>Total deposit held</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{fmt(depositHeld)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>Total deductions</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>−{fmt(totalDeductions)}</span>
                  </div>
                  <div style={{ height: 1, background: "#e2e8f0", margin: "8px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36" }}>Refund to tenant</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: refund > 0 ? "#16a34a" : "#94a3b8" }}>{fmt(refund)}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", display: "block", marginBottom: 10 }}>General Notes</label>
              <textarea value={generalNotes} onChange={e => setGeneralNotes(e.target.value)} rows={3}
                placeholder="Any additional notes, agreed actions, evidence references..."
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
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
              category="Property Management · End of Tenancy"
              title="Check-Out Inspection Report"
              reference={refNum}
              date={today}
            />
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 20 }}>End-of-tenancy inspection and deposit deduction schedule</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24, padding: "14px", background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                {[
                  { l: "Property", v: address || "—" },
                  { l: "Check-out date", v: checkOutDate ? new Date(checkOutDate).toLocaleDateString("en-GB") : today },
                  { l: "Tenant", v: tenantName || "—" },
                  { l: "Landlord/Agent", v: landlordName || "—" },
                  { l: "Deposit held", v: depositHeld > 0 ? fmt(depositHeld) : "—" },
                  { l: "Deposit scheme", v: depositScheme || "—" },
                  { l: "Keys returned", v: keysReturned || "—" },
                  { l: "Gas meter", v: meterGas || "—" },
                  { l: "Elec meter", v: meterElec || "—" },
                ].map(s => (
                  <div key={s.l}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{s.l}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36", marginTop: 2 }}>{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Room conditions */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase" }}>Room-by-Room Condition</p></div>
                <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                  {ROOMS.map(room => {
                    const cond = conditions[room.id];
                    const note = notes[room.id];
                    const col = cond === "Same as check-in" ? "#16a34a" : cond === "Fair wear & tear" ? "#2563eb" : cond === "Tenant damage" ? "#dc2626" : cond === "Missing" ? "#d97706" : "#94a3b8";
                    return (
                      <div key={room.id} style={{ display: "flex", borderBottom: "1px solid #f8f9fc", padding: "8px 12px", gap: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: "#374151", flex: 1 }}>{room.name}</p>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {cond ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", background: col + "20", color: col, borderRadius: 3 }}>{cond}</span>
                                : <span style={{ fontSize: 9, color: "#cbd5e1" }}>Not inspected</span>}
                          {note && <p style={{ fontSize: 9, color: "#64748b", marginTop: 2, maxWidth: 220, textAlign: "left" }}>{note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deductions */}
              {depositHeld > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase" }}>Deposit Deduction Schedule</p></div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                    {deductions.filter(d => d.desc || d.amount > 0).map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", borderBottom: "1px solid #f8f9fc" }}>
                        <p style={{ fontSize: 11, color: "#374151" }}>{d.desc || `Deduction ${i + 1}`}</p>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>{fmt(d.amount)}</p>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid #e2e8f0", background: "#fafafa" }}>
                      <p style={{ fontSize: 11, fontWeight: 600 }}>Total deductions</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#dc2626" }}>{fmt(totalDeductions)}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: refund > 0 ? "#f0fdf4" : "#fafafa" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>Refund to tenant</p>
                      <p style={{ fontSize: 14, fontWeight: 800, color: refund > 0 ? "#16a34a" : "#94a3b8" }}>{fmt(refund)}</p>
                    </div>
                  </div>
                </div>
              )}

              {generalNotes && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase" }}>General Notes</p></div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none", padding: 12 }}><p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{generalNotes}</p></div>
                </div>
              )}

              <SignatureBlock
                signerLabel="Signed (Landlord / Agent)"
                signerName={landlordName}
                witnessLabel="Signed (Tenant)"
                showWitness={true}
              />
              <PrintFooter docTitle="Check-Out Inspection Report" note="Tenancy Deposit Scheme compliant · Retain both copies" />
          </div>
        </section>
      )}
    </>
  );
}






