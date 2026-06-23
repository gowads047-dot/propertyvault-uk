"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";
import Link from "next/link";

const SECTIONS = [
  {
    title: "Exterior & Kerb Appeal",
    items: [
      "Roof — condition of tiles/slates, any sagging or visible damage",
      "Gutters & downpipes — blockages, rust, or missing sections",
      "External walls — cracks, pointing, damp staining, or render issues",
      "Windows — condition of frames, double glazing intact, opening smoothly",
      "Front door — condition, security, letter box",
      "Garage / outbuildings — condition and size",
      "Driveway / parking — condition, space for your vehicles",
      "Garden — size, condition, overgrowth, boundary fences/walls",
    ],
  },
  {
    title: "Entry & Common Areas",
    items: [
      "Front door security — deadbolt, chain, multi-point lock",
      "Hallway — space, light, condition of walls and flooring",
      "Stairs — condition, creaking, handrail secure",
      "Natural light throughout",
      "Mobile signal in property",
      "Broadband connection availability",
    ],
  },
  {
    title: "Kitchen",
    items: [
      "Size — adequate for your needs",
      "Storage — cupboard space sufficient",
      "Worktop condition",
      "Sink and taps — pressure and drainage",
      "Integrated appliances included",
      "Boiler / hot water cylinder — location and age",
      "Ventilation — extractor fan working",
      "Signs of damp or mould",
    ],
  },
  {
    title: "Living Room",
    items: [
      "Size — fits your furniture comfortably",
      "Natural light",
      "Condition of walls, ceiling, flooring",
      "Number and location of plug sockets",
      "TV/broadband points",
      "Fireplace — working or decorative",
    ],
  },
  {
    title: "Bedrooms",
    items: [
      "Bedroom 1 — size (double/king), wardrobe space, natural light",
      "Bedroom 2 — size and light",
      "Bedroom 3+ — size and light",
      "Storage / wardrobe space throughout",
      "Loft access and usability",
    ],
  },
  {
    title: "Bathrooms",
    items: [
      "Number of bathrooms/WCs",
      "Shower/bath — pressure and drainage",
      "Tiling condition",
      "Ventilation / extractor fan",
      "Signs of mould or damp around bath/shower",
      "En-suite availability",
    ],
  },
  {
    title: "Structure & Systems",
    items: [
      "Damp — smell, stains, cold patches on walls",
      "Rising damp — dark marks at floor level",
      "Condensation — misting on windows, black mould in corners",
      "Central heating — radiators in every room, age of boiler",
      "Radiators — heat up when tested",
      "Electrics — fuse box condition, RCD protection",
      "Water pressure throughout",
      "Insulation — walls, roof, floor",
      "EPC rating (aim for C or above)",
    ],
  },
  {
    title: "Location & Neighbourhood",
    items: [
      "Transport links — bus stops, train station, distance",
      "Nearby amenities — shops, schools, GP",
      "Noise levels — road, rail, flight path, neighbours",
      "Crime rate — check data.police.uk",
      "Flood risk — check Environment Agency map",
      "Parking availability on street",
      "Planned developments nearby",
    ],
  },
  {
    title: "Investment Metrics (BTL)",
    items: [
      "Gross yield calculated (annual rent ÷ purchase price × 100)",
      "Net yield after all costs",
      "Monthly cash flow positive after mortgage",
      "Comparable rents in the area checked",
      "Comparable sold prices checked",
      "Rental demand in the area (vacancy rates)",
      "HMO potential (if applicable)",
    ],
  },
  {
    title: "Legal & Compliance",
    items: [
      "Tenure — freehold or leasehold (if leasehold: years remaining)",
      "Service charge / ground rent (if leasehold)",
      "Planning restrictions",
      "Listed building status",
      "Gas Safety Certificate available",
      "EICR available",
      "Ask about history of Japanese knotweed",
    ],
  },
];

interface State {
  address: string;
  viewingDate: string;
  agent: string;
  askingPrice: string;
  estRent: string;
  notes: string;
  checks: Record<string, boolean>;
}

export default function ViewingChecklistTemplate() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [f, setF] = useState<State>({
    address: "", viewingDate: "", agent: "", askingPrice: "", estRent: "", notes: "",
    checks: {},
  });

  const toggle = (item: string) => setF(p => ({ ...p, checks: { ...p.checks, [item]: !p.checks[item] } }));
  const checked = Object.values(f.checks).filter(Boolean).length;
  const total = SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const refNum = `PV-VC-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: fixed; inset: 0; overflow: auto; padding: 0; background: white; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* Header */}
      <section className="no-print" style={{ background: "#0f1b36", padding: "32px 0 24px" }}>
        <div className="container-max px-4" style={{ maxWidth: 900 }}>
          <Link href="/templates" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 16, display: "inline-block" }}>← All templates</Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>🔍 Buyer / Investor Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Property Viewing Checklist</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{checked} of {total} items checked</p>
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

            {/* Property info card */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "24px", marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Property Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { label: "Property address", key: "address" as keyof State, placeholder: "Full address", type: "text" },
                  { label: "Viewing date", key: "viewingDate" as keyof State, placeholder: "", type: "date" },
                  { label: "Agent / vendor name", key: "agent" as keyof State, placeholder: "Who showed you around", type: "text" },
                  { label: "Asking price (£)", key: "askingPrice" as keyof State, placeholder: "e.g. 180000", type: "text" },
                  { label: "Estimated monthly rent", key: "estRent" as keyof State, placeholder: "e.g. 950", type: "text" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{field.label}</label>
                    <input type={field.type} value={f[field.key] as string} onChange={e => setF(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: "white", borderRadius: 12, border: "1.5px solid #e2e8f0", padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(checked / total) * 100}%`, background: checked === total ? "#16a34a" : "#c9a84c", borderRadius: 4, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", whiteSpace: "nowrap" }}>{checked} / {total}</span>
            </div>

            {/* Checklist sections */}
            {SECTIONS.map((sec, si) => (
              <div key={si} style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", marginBottom: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: "#f8f9fc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36" }}>{sec.title}</h3>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    {sec.items.filter(i => f.checks[i]).length}/{sec.items.length}
                  </span>
                </div>
                <div style={{ padding: "4px 0" }}>
                  {sec.items.map(item => (
                    <label key={item} onClick={() => toggle(item)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid #f8f9fc", background: f.checks[item] ? "#f0fdf4" : "white", transition: "background 0.1s" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, border: f.checks[item] ? "none" : "2px solid #cbd5e1", background: f.checks[item] ? "#16a34a" : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, transition: "all 0.15s" }}>
                        {f.checks[item] && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize: 13, color: f.checks[item] ? "#15803d" : "#374151", textDecoration: f.checks[item] ? "line-through" : "none", lineHeight: 1.5 }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Notes */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", display: "block", marginBottom: 10 }}>Overall Notes & Observations</label>
              <textarea value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} placeholder="Any concerns, highlights, or additional observations…" rows={4}
                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <button onClick={() => setMode("preview")} style={{ width: "100%", padding: "13px", background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
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

          <div id="print-doc" style={{ maxWidth: 800, margin: "0 auto", background: "white", boxShadow: "0 4px 40px rgba(0,0,0,0.15)", fontFamily: "Arial, sans-serif", color: "#1a1a1a" }}>
            {/* Letterhead */}
            <div style={{ background: "#0f1b36", padding: "24px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: "white" }}>PropertyVault<span style={{ color: "#c9a84c" }}>.co.uk</span></p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Free Property Tools for UK Investors & Buyers</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Ref: {refNum}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Date: {today}</p>
              </div>
            </div>
            <div style={{ height: 4, background: "#c9a84c" }} />

            <div style={{ padding: "28px 36px 36px" }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>Property Viewing Checklist</h1>

              {/* Summary box */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24, padding: "14px", background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                {[
                  { label: "Property", value: f.address || "—" },
                  { label: "Viewing Date", value: f.viewingDate ? new Date(f.viewingDate).toLocaleDateString("en-GB") : "—" },
                  { label: "Agent / Vendor", value: f.agent || "—" },
                  { label: "Asking Price", value: f.askingPrice ? `£${parseInt(f.askingPrice).toLocaleString()}` : "—" },
                  { label: "Est. Monthly Rent", value: f.estRent ? `£${parseInt(f.estRent).toLocaleString()}/mo` : "—" },
                  { label: "Completion", value: `${checked}/${total} items` },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#0f1b36", marginTop: 2 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Checklist sections */}
              {SECTIONS.map((sec, si) => (
                <div key={si} style={{ marginBottom: 20 }}>
                  <div style={{ background: "#0f1b36", padding: "5px 12px", display: "flex", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sec.title}</p>
                    <p style={{ fontSize: 10, color: "#c9a84c" }}>{sec.items.filter(i => f.checks[i]).length}/{sec.items.length}</p>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                    {sec.items.map((item, ii) => (
                      <div key={ii} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", borderBottom: "1px solid #f1f5f9", background: f.checks[item] ? "#f0fdf4" : "white" }}>
                        <div style={{ width: 14, height: 14, border: f.checks[item] ? "none" : "1.5px solid #cbd5e1", background: f.checks[item] ? "#16a34a" : "white", borderRadius: 3, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {f.checks[item] && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
                        </div>
                        <p style={{ fontSize: 10, color: f.checks[item] ? "#15803d" : "#374151", textDecoration: f.checks[item] ? "line-through" : "none" }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notes */}
              {f.notes && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ background: "#0f1b36", padding: "5px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes & Observations</p>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none", padding: "12px" }}>
                    <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{f.notes}</p>
                  </div>
                </div>
              )}

              {/* Overall verdict box */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
                <div style={{ border: "1px solid #e2e8f0", padding: "14px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", marginBottom: 8 }}>OVERALL ASSESSMENT</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Strong Buy", "Consider", "Pass"].map(v => (
                      <div key={v} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 12, height: 12, border: "1px solid #94a3b8", borderRadius: 2 }} />
                        <p style={{ fontSize: 10, color: "#374151" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ border: "1px solid #e2e8f0", padding: "14px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>SIGNATURE</p>
                  <div style={{ borderBottom: "1px solid #1a1a1a", marginBottom: 4 }} />
                  <p style={{ fontSize: 9, color: "#64748b" }}>Signed: ___________________________ Date: ___________</p>
                </div>
              </div>

              <p style={{ fontSize: 8, color: "#94a3b8", marginTop: 24, lineHeight: 1.5 }}>Generated by PropertyVault UK (propertyvaultuk.co.uk). For informational purposes only. Not financial or legal advice. © {new Date().getFullYear()} PropertyVault UK. Ref: {refNum}</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}



