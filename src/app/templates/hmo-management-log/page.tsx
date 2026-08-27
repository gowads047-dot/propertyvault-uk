"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";

const COMPLIANCE_ITEMS = [
  { id: "gas", label: "Gas Safety Check (annual)", category: "safety" },
  { id: "eicr", label: "EICR valid (5 yearly)", category: "safety" },
  { id: "fire-alarms", label: "Fire alarms tested", category: "safety" },
  { id: "co-alarms", label: "CO detectors checked", category: "safety" },
  { id: "fire-equip", label: "Fire extinguishers/blankets checked", category: "safety" },
  { id: "emergency-lighting", label: "Emergency lighting tested", category: "safety" },
  { id: "fire-doors", label: "Fire doors closing properly", category: "safety" },
  { id: "epc", label: "EPC rating ≥ E (or exemption registered)", category: "legal" },
  { id: "licence", label: "HMO licence valid & displayed", category: "legal" },
  { id: "right-to-rent", label: "Right to Rent checks current for all tenants", category: "legal" },
  { id: "deposit", label: "All deposits protected & PI served", category: "legal" },
  { id: "common-areas", label: "Common areas clean and unobstructed", category: "property" },
  { id: "bins", label: "Bin storage adequate & accessible", category: "property" },
  { id: "damp-mould", label: "No visible damp or mould", category: "property" },
  { id: "pests", label: "No sign of pests", category: "property" },
  { id: "boiler", label: "Boiler / heating working", category: "property" },
  { id: "hot-water", label: "Hot water adequate in all rooms", category: "property" },
  { id: "locks", label: "All locks/door entry working", category: "property" },
];

type Room = { id: string; occupant: string; rent: string; arrears: string; condition: "good" | "fair" | "poor"; notes: string };

export default function HmoManagementLog() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [licenceExpiry, setLicenceExpiry] = useState("");
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().slice(0, 10));
  const [inspector, setInspector] = useState("");
  const [rooms, setRooms] = useState<Room[]>([
    { id: "r1", occupant: "", rent: "", arrears: "", condition: "good", notes: "" },
    { id: "r2", occupant: "", rent: "", arrears: "", condition: "good", notes: "" },
    { id: "r3", occupant: "", rent: "", arrears: "", condition: "good", notes: "" },
  ]);
  const [compliance, setCompliance] = useState<Record<string, boolean>>({});
  const [complianceNotes, setComplianceNotes] = useState<Record<string, string>>({});
  const [maintenanceItems, setMaintenanceItems] = useState("1. \n2. \n3. ");
  const [overallNotes, setOverallNotes] = useState("");

  const addRoom = () => setRooms(p => [...p, { id: `r${Date.now()}`, occupant: "", rent: "", arrears: "", condition: "good", notes: "" }]);
  const removeRoom = (id: string) => setRooms(p => p.filter(r => r.id !== id));
  const updateRoom = (id: string, field: keyof Room, value: string) => setRooms(p => p.map(r => r.id === id ? { ...r, [field]: value } : r));
  const toggleCompliance = (id: string) => setCompliance(p => ({ ...p, [id]: !p[id] }));

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";
  const categories = [...new Set(COMPLIANCE_ITEMS.map(i => i.category))];
  const catLabel: Record<string, string> = { safety: "Fire & Safety", legal: "Legal Compliance", property: "Property Condition" };

  const passCount = COMPLIANCE_ITEMS.filter(i => compliance[i.id]).length;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: absolute; left: 0; top: 0; width: 100%; padding: 24px 32px; background: white; font-size: 11px; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template · HMO</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">HMO Management Log</h1>
          <p className="text-navy-200 max-w-2xl">Monthly inspection and compliance record for Houses in Multiple Occupation. Track room occupancy, rent, maintenance, and all HMO licence obligations.</p>
        </div>
      </section>

      <div className="border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-navy-50 rounded-xl p-1">
            {(["form", "preview"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-800"}`}>
                {m === "form" ? "✏️ Fill in details" : "👁 Preview log"}
              </button>
            ))}
          </div>
          <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 200); }} className="btn-primary text-sm">🖨️ Print / PDF</button>
        </div>
      </div>

      {mode === "form" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-3xl space-y-6">

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Property & Inspection</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                <input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Full HMO address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">HMO Licence Number</label>
                  <input value={licenceNumber} onChange={e => setLicenceNumber(e.target.value)} placeholder="Licence number" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Licence Expiry</label>
                  <input type="date" value={licenceExpiry} onChange={e => setLicenceExpiry(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Inspection Date</label>
                  <input type="date" value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Inspector Name</label>
                  <input value={inspector} onChange={e => setInspector(e.target.value)} placeholder="Name of person inspecting" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-navy-800">Rooms & Tenants</h2>
                <button onClick={addRoom} className="text-sm text-gold-600 font-semibold hover:text-gold-700">+ Add room</button>
              </div>
              <div className="space-y-4">
                {rooms.map((r, i) => (
                  <div key={r.id} className="border border-navy-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-navy-700">Room {i + 1}</span>
                      {rooms.length > 1 && <button onClick={() => removeRoom(r.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2"><label className="block text-xs font-semibold text-navy-600 mb-1">Tenant name</label>
                        <input value={r.occupant} onChange={e => updateRoom(r.id, "occupant", e.target.value)} placeholder="Occupant" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                      <div><label className="block text-xs font-semibold text-navy-600 mb-1">Weekly rent (£)</label>
                        <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-navy-400 text-xs">£</span>
                          <input value={r.rent} onChange={e => updateRoom(r.id, "rent", e.target.value)} placeholder="0" className="w-full pl-5 pr-2 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                      <div><label className="block text-xs font-semibold text-navy-600 mb-1">Arrears (£)</label>
                        <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-navy-400 text-xs">£</span>
                          <input value={r.arrears} onChange={e => updateRoom(r.id, "arrears", e.target.value)} placeholder="0" className="w-full pl-5 pr-2 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div><label className="block text-xs font-semibold text-navy-600 mb-1">Condition</label>
                        <select value={r.condition} onChange={e => updateRoom(r.id, "condition", e.target.value as "good" | "fair" | "poor")} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor — action needed</option>
                        </select></div>
                      <div><label className="block text-xs font-semibold text-navy-600 mb-1">Notes</label>
                        <input value={r.notes} onChange={e => updateRoom(r.id, "notes", e.target.value)} placeholder="Any issues" className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6">
              <h2 className="font-bold text-navy-800 mb-4">Compliance Checklist</h2>
              <div className="space-y-6">
                {categories.map(cat => (
                  <div key={cat}>
                    <h3 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-3">{catLabel[cat]}</h3>
                    <div className="space-y-2">
                      {COMPLIANCE_ITEMS.filter(i => i.category === cat).map(item => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div onClick={() => toggleCompliance(item.id)}
                            className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 cursor-pointer flex items-center justify-center transition-all ${compliance[item.id] ? "bg-green-500 border-green-500" : "border-navy-300"}`}>
                            {compliance[item.id] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-navy-700">{item.label}</p>
                            <input value={complianceNotes[item.id] || ""} onChange={e => setComplianceNotes(p => ({ ...p, [item.id]: e.target.value }))}
                              placeholder="Notes (optional)" className="mt-1 w-full px-3 py-1.5 border border-navy-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 text-navy-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-navy-50 rounded-xl p-3">
                <p className="text-sm text-navy-600">{passCount}/{COMPLIANCE_ITEMS.length} items confirmed ✓</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Maintenance Actions</h2>
              <textarea value={maintenanceItems} onChange={e => setMaintenanceItems(e.target.value)} rows={5}
                placeholder="List any maintenance items raised during this inspection" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Overall notes / next steps</label>
                <textarea value={overallNotes} onChange={e => setOverallNotes(e.target.value)} rows={3} placeholder="Any other observations" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
            </div>

            <button onClick={() => setMode("preview")} className="w-full btn-gold">Preview Log →</button>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-3xl">
            <div id="print-doc" className="rounded-2xl border border-navy-100 p-8" style={{ background: "white", color: "#1a1a1a", fontFamily: "system-ui, sans-serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #0f1b36" }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>HMO Management Log</p>
                  <h1 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", margin: 0 }}>{propertyAddress || "Property Address"}</h1>
                  {licenceNumber && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Licence: {licenceNumber}{licenceExpiry ? ` (expires ${fmt(licenceExpiry)})` : ""}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#374151", fontWeight: 700 }}>{fmt(inspectionDate)}</p>
                  {inspector && <p style={{ fontSize: 11, color: "#6b7280" }}>{inspector}</p>}
                </div>
              </div>

              {/* Rooms */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Rooms & Occupancy</p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#0f1b36", color: "white" }}>
                      {["Room", "Tenant", "Weekly Rent", "Arrears", "Condition", "Notes"].map(h => (
                        <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((r, i) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 ? "#f8f9fc" : "white" }}>
                        <td style={{ padding: "6px 10px", fontWeight: 600 }}>{i + 1}</td>
                        <td style={{ padding: "6px 10px" }}>{r.occupant || "Vacant"}</td>
                        <td style={{ padding: "6px 10px" }}>{r.rent ? `£${r.rent}` : "—"}</td>
                        <td style={{ padding: "6px 10px", color: r.arrears && parseFloat(r.arrears) > 0 ? "#dc2626" : "#6b7280", fontWeight: r.arrears && parseFloat(r.arrears) > 0 ? 700 : 400 }}>{r.arrears ? `£${r.arrears}` : "—"}</td>
                        <td style={{ padding: "6px 10px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: r.condition === "good" ? "#dcfce7" : r.condition === "fair" ? "#fef9c3" : "#fee2e2", color: r.condition === "good" ? "#15803d" : r.condition === "fair" ? "#ca8a04" : "#dc2626" }}>{r.condition}</span>
                        </td>
                        <td style={{ padding: "6px 10px", color: "#6b7280" }}>{r.notes || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Compliance */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Compliance Checklist</p>
                  <span style={{ fontSize: 11, fontWeight: 700, background: passCount === COMPLIANCE_ITEMS.length ? "#dcfce7" : "#fef9c3", color: passCount === COMPLIANCE_ITEMS.length ? "#15803d" : "#ca8a04", padding: "2px 10px", borderRadius: 10 }}>{passCount}/{COMPLIANCE_ITEMS.length} ✓</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {COMPLIANCE_ITEMS.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 10, padding: "3px 0" }}>
                      <span style={{ color: compliance[item.id] ? "#15803d" : "#dc2626", fontWeight: 800, flexShrink: 0 }}>{compliance[item.id] ? "✓" : "✗"}</span>
                      <div>
                        <span style={{ color: "#374151" }}>{item.label}</span>
                        {complianceNotes[item.id] && <span style={{ color: "#9ca3af", marginLeft: 4 }}>— {complianceNotes[item.id]}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance */}
              {maintenanceItems.trim() && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Maintenance Actions</p>
                  <div style={{ background: "#f5f2ec", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#374151", whiteSpace: "pre-line" }}>{maintenanceItems}</div>
                </div>
              )}

              {overallNotes && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Overall Notes</p>
                  <p style={{ fontSize: 11, color: "#374151" }}>{overallNotes}</p>
                </div>
              )}

              <SignatureBlock
                signerLabel="Inspector signature"
                signerName={inspector}
                witnessLabel="Witness"
                showWitness={true}
                date={inspectionDate}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit</button>
              <ShareToolbar docTitle="HMO Management Log" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}







