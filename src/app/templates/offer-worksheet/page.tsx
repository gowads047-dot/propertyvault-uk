"use client";
import { useState, useMemo } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter, PrintSection, PrintRow } from "@/components/PrintDoc";
import Link from "next/link";

const fmt = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

export default function OfferWorksheetTemplate() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  // Property
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [condition, setCondition] = useState("");
  const [asking, setAsking] = useState(180000);
  // Comparables
  const [comp1Addr, setComp1Addr]   = useState(""); const [comp1Price, setComp1Price] = useState(0);
  const [comp2Addr, setComp2Addr]   = useState(""); const [comp2Price, setComp2Price] = useState(0);
  const [comp3Addr, setComp3Addr]   = useState(""); const [comp3Price, setComp3Price] = useState(0);
  // Refurb
  const [refurbCost, setRefurbCost] = useState(0);
  const [targetYield, setTargetYield] = useState(6.5);
  const [estMonthlyRent, setEstMonthlyRent] = useState(0);
  // Offer strategy
  const [offerPct, setOfferPct]     = useState(94);
  const [offerNote, setOfferNote]   = useState("");
  const [buyerName, setBuyerName]   = useState("");
  const [offerDate, setOfferDate]   = useState("");

  const comps = [
    { addr: comp1Addr, price: comp1Price },
    { addr: comp2Addr, price: comp2Price },
    { addr: comp3Addr, price: comp3Price },
  ].filter(c => c.price > 0);

  const avgComp = comps.length ? Math.round(comps.reduce((s, c) => s + c.price, 0) / comps.length) : 0;
  const offerPrice = Math.round(asking * offerPct / 100);
  const yieldBasedMax = estMonthlyRent > 0 ? Math.round((estMonthlyRent * 12 / (targetYield / 100))) : 0;
  const saving = asking - offerPrice;

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const refNum = `PV-OW-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

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
              <p style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>📝 Buyer Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Offer Preparation Worksheet</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Research your comparables, set your max price, and make a confident offer</p>
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
          <div className="container-max px-4" style={{ maxWidth: 720 }}>

            {/* Property */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>The Property</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {[
                  { l: "Address", v: address, s: setAddress, ph: "Full address" },
                  { l: "Property type", v: propertyType, s: setPropertyType, ph: "Terraced / Semi / Detached / Flat" },
                  { l: "Bedrooms", v: beds, s: setBeds, ph: "e.g. 3" },
                  { l: "Condition", v: condition, s: setCondition, ph: "Good / Needs work / Full refurb" },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.l}</label>
                    <input value={f.v} onChange={e => (f.s as (v: string) => void)(e.target.value)} placeholder={f.ph}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Asking price (£)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <input type="range" min={50000} max={800000} step={1000} value={asking} onChange={e => setAsking(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#c9a84c", cursor: "pointer" }} />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0f1b36", minWidth: 100 }}>{fmt(asking)}</span>
                </div>
              </div>
            </div>

            {/* Comparables */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 6 }}>Comparable Sales</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>Find 2-3 similar properties sold recently nearby. Check Rightmove Sold Prices or the Land Registry.</p>
              {([[comp1Addr, setComp1Addr, comp1Price, setComp1Price],[comp2Addr, setComp2Addr, comp2Price, setComp2Price],[comp3Addr, setComp3Addr, comp3Price, setComp3Price]] as const).map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <input value={row[0] as string} onChange={e => (row[1] as (v: string) => void)(e.target.value)} placeholder={`Comparable ${i + 1} address`}
                    style={{ flex: 2, padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>£</span>
                    <input type="number" value={(row[2] as number) || ""} onChange={e => (row[3] as (v: number) => void)(Number(e.target.value))} placeholder="Price"
                      style={{ flex: 1, padding: "9px 10px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                  </div>
                </div>
              ))}
              {avgComp > 0 && (
                <div style={{ padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, marginTop: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Average comparable price: {fmt(avgComp)}</p>
                  {avgComp < asking && <p style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>Asking price is {fmt(asking - avgComp)} ({(((asking - avgComp) / avgComp) * 100).toFixed(1)}%) above comparable average.</p>}
                </div>
              )}
            </div>

            {/* BTL Analysis */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 6 }}>Investment Analysis (BTL)</h2>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>Optional — fill in if buying as investment to calculate yield-based max price.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { l: "Est. monthly rent (£)", v: estMonthlyRent, s: setEstMonthlyRent, ph: "e.g. 950" },
                  { l: "Target gross yield (%)", v: targetYield, s: setTargetYield, ph: "e.g. 6.5" },
                  { l: "Refurb cost (£)", v: refurbCost, s: setRefurbCost, ph: "e.g. 5000" },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.l}</label>
                    <input type="number" value={f.v || ""} onChange={e => (f.s as (v: number) => void)(Number(e.target.value))} placeholder={f.ph}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Offer */}
            <div style={{ background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 24, marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>Your Offer Strategy</h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Offer at {offerPct}% of asking price</label>
                <input type="range" min={75} max={100} step={0.5} value={offerPct} onChange={e => setOfferPct(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#c9a84c", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>75% (aggressive)</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0f1b36" }}>{fmt(offerPrice)} — saving {fmt(saving)}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>100% (full asking)</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Your name</label>
                  <input value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Full name"
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Offer date</label>
                  <input type="date" value={offerDate} onChange={e => setOfferDate(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Offer conditions / notes</label>
                <textarea value={offerNote} onChange={e => setOfferNote(e.target.value)} rows={3} placeholder="e.g. Subject to survey. Mortgage agreed in principle. Can complete in 8 weeks."
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
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
              category="Investment Research · Offer Strategy"
              title="Offer Preparation Worksheet"
              reference={refNum}
              date={today}
            />
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 20 }}>Property research, comparable analysis, and offer strategy</p>

              {/* Property summary */}
              <DocSection title="1. Property Details">
                <DocRow label="Address" value={address || "—"} />
                <DocRow label="Type" value={[propertyType, beds ? beds + " bed" : "", condition].filter(Boolean).join(" · ") || "—"} />
                <DocRow label="Asking Price" value={fmt(asking)} />
              </DocSection>

              {/* Comparables */}
              <DocSection title="2. Comparable Evidence">
                {comps.length > 0 ? comps.map((c, i) => (
                  <DocRow key={i} label={`Comparable ${i + 1}`} value={`${c.addr || "—"} — ${fmt(c.price)}`} />
                )) : <p style={{ fontSize: 11, color: "#94a3b8", padding: "8px 14px" }}>No comparables entered.</p>}
                {avgComp > 0 && <DocRow label="Average comparable" value={fmt(avgComp)} />}
                {avgComp > 0 && <DocRow label="vs asking price" value={`${asking > avgComp ? "+" : ""}${fmt(asking - avgComp)} (${(((asking - avgComp) / avgComp) * 100).toFixed(1)}%)`} />}
              </DocSection>

              {/* Investment */}
              {estMonthlyRent > 0 && (
                <DocSection title="3. Investment Analysis">
                  <DocRow label="Est. monthly rent" value={fmt(estMonthlyRent) + "/mo"} />
                  <DocRow label="Annual rent" value={fmt(estMonthlyRent * 12)} />
                  <DocRow label="Gross yield at asking" value={((estMonthlyRent * 12 / asking) * 100).toFixed(2) + "%"} />
                  <DocRow label="Target yield" value={targetYield + "%"} />
                  {yieldBasedMax > 0 && <DocRow label="Max price for target yield" value={fmt(yieldBasedMax)} />}
                  {refurbCost > 0 && <DocRow label="Refurb budget" value={fmt(refurbCost)} />}
                  {refurbCost > 0 && estMonthlyRent > 0 && <DocRow label="Gross yield all-in" value={((estMonthlyRent * 12 / (offerPrice + refurbCost)) * 100).toFixed(2) + "% (at offer price + refurb)"} />}
                </DocSection>
              )}

              {/* Offer */}
              <DocSection title={estMonthlyRent > 0 ? "4. Offer Strategy" : "3. Offer Strategy"}>
                <DocRow label="Asking price" value={fmt(asking)} />
                <DocRow label="Offer amount" value={fmt(offerPrice)} />
                <DocRow label="Offer (%)" value={offerPct + "% of asking"} />
                <DocRow label="Saving vs asking" value={fmt(saving)} />
                {avgComp > 0 && <DocRow label="vs comparables" value={`${offerPrice <= avgComp ? "✓ At or below" : "Above"} comparable average (${fmt(avgComp)})`} />}
                {offerNote && <DocRow label="Conditions" value={offerNote} />}
              </DocSection>

              <div style={{ border: "1px solid #e5e7eb", padding: 14, background: "#f8f9fc", marginTop: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", marginBottom: 4 }}>OFFER SUMMARY</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: "#0f1b36", fontFamily: "ui-monospace, monospace" }}>{fmt(offerPrice)}</p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>{offerPct}% of asking · saving {fmt(saving)}</p>
                {avgComp > 0 && <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>Comparable average: {fmt(avgComp)}</p>}
              </div>
              <SignatureBlock signerLabel="Signed (Buyer)" signerName={buyerName} showWitness={false} />
              <PrintFooter docTitle="Offer Preparation Worksheet" note="Personal research only — not financial or legal advice" />
          </div>
        </section>
      )}
    </>
  );
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10 }}><p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      </div>
      <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>{children}</div>
    </div>
  );
}
function DocRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ width: "38%", padding: "6px 12px", background: "#f8f9fc" }}><p style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}>{label}</p></div>
      <div style={{ flex: 1, padding: "6px 12px" }}><p style={{ fontSize: 11, color: "#1a1a1a", whiteSpace: "pre-wrap" }}>{value}</p></div>
    </div>
  );
}






