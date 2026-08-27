"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

const AREA_DATA: Record<string, {
  region: string; avgPrice: number; avgRent: number; yield: number; demand: string; trend: string;
  hmoViable: boolean; brrrViable: boolean; packagingViable: boolean;
  avgDiscount: string; refurbCost: string; agentCount: number; notes: string;
  postcodes: string[];
}> = {
  "Birmingham": {
    region: "West Midlands", avgPrice: 215000, avgRent: 900, yield: 5.0, demand: "Very High", trend: "+4.5% YoY",
    hmoViable: true, brrrViable: true, packagingViable: true,
    avgDiscount: "8–14%", refurbCost: "£18k–£35k", agentCount: 60,
    notes: "Strong investor demand. High HMO licensing activity. Focus on B suburbs (Bournville, Bearwood, Handsworth) for best BRRR deals. Article 4 applies in city centre — check before packaging HMOs.",
    postcodes: ["B1", "B3", "B11", "B12", "B21"],
  },
  "Nottingham": {
    region: "East Midlands", avgPrice: 185000, avgRent: 825, yield: 5.3, demand: "High", trend: "+3.8% YoY",
    hmoViable: true, brrrViable: true, packagingViable: true,
    avgDiscount: "10–16%", refurbCost: "£15k–£28k", agentCount: 35,
    notes: "Large student and young professional population. HMO demand is strong near Trent University. Some of the best BRRR numbers in the East Midlands. Avoid flood risk zones (check Environment Agency).",
    postcodes: ["NG1", "NG3", "NG5", "NG7", "NG9"],
  },
  "Derby": {
    region: "East Midlands", avgPrice: 175000, avgRent: 775, yield: 5.3, demand: "High", trend: "+3.2% YoY",
    hmoViable: true, brrrViable: true, packagingViable: true,
    avgDiscount: "10–18%", refurbCost: "£14k–£26k", agentCount: 28,
    notes: "Lower entry prices than Nottingham. Rolls-Royce and Toyota employment base drives strong rental demand. Less competition from other sourcers. Good area for beginners to source their first deal.",
    postcodes: ["DE1", "DE3", "DE22", "DE23", "DE24"],
  },
  "Wolverhampton": {
    region: "West Midlands", avgPrice: 165000, avgRent: 750, yield: 5.5, demand: "High", trend: "+4.1% YoY",
    hmoViable: false, brrrViable: true, packagingViable: true,
    avgDiscount: "12–20%", refurbCost: "£16k–£30k", agentCount: 22,
    notes: "Excellent BRRR numbers. More motivated sellers than Birmingham due to market conditions. Lower GDVs but also lower entry cost. Avoid WV10 for HMOs — enforcement is active.",
    postcodes: ["WV1", "WV2", "WV4", "WV10", "WV11"],
  },
  "Leicester": {
    region: "East Midlands", avgPrice: 210000, avgRent: 875, yield: 5.0, demand: "High", trend: "+3.5% YoY",
    hmoViable: true, brrrViable: true, packagingViable: true,
    avgDiscount: "8–13%", refurbCost: "£17k–£32k", agentCount: 30,
    notes: "Growing tech sector driving rental demand. Strong mix of student and professional renters. LE2 and LE3 are best for BRRR. HMO demand strong near De Montfort University.",
    postcodes: ["LE1", "LE2", "LE3", "LE4", "LE5"],
  },
  "Sheffield": {
    region: "Yorkshire", avgPrice: 195000, avgRent: 825, yield: 5.1, demand: "High", trend: "+3.9% YoY",
    hmoViable: true, brrrViable: true, packagingViable: true,
    avgDiscount: "9–15%", refurbCost: "£16k–£30k", agentCount: 40,
    notes: "Two large universities create massive HMO demand. S10 and S11 are student-heavy — great for HMO. City-wide regeneration ongoing. Steelworks regeneration areas to watch for future capital growth.",
    postcodes: ["S1", "S3", "S10", "S11", "S13"],
  },
  "Manchester": {
    region: "North West", avgPrice: 255000, avgRent: 1100, yield: 5.2, demand: "Very High", trend: "+5.1% YoY",
    hmoViable: true, brrrViable: false, packagingViable: true,
    avgDiscount: "5–10%", refurbCost: "£20k–£45k", agentCount: 80,
    notes: "High demand but also high competition. BRRR is harder due to strong prices and limited below-market deals. Better as a packaging market. Salford and parts of Oldham offer better numbers than city centre.",
    postcodes: ["M1", "M4", "M14", "M15", "M21"],
  },
};

const AREAS = Object.keys(AREA_DATA);

const STRATEGY_TAGS = [
  { key: "brrrViable", label: "BRRR", color: "#6366f1" },
  { key: "hmoViable", label: "HMO", color: "#0891b2" },
  { key: "packagingViable", label: "Packaging", color: "#d4af37" },
];

export default function AcademyAreaResearchPage() {
  const [selected, setSelected] = useState<string>("Birmingham");
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookupData, setLookupData] = useState<Record<string, unknown> | null>(null);
  const [lookupError, setLookupError] = useState("");

  const area = AREA_DATA[selected];

  async function lookup() {
    if (!postcode.trim()) return;
    setLoading(true); setLookupError(""); setLookupData(null);
    try {
      const res = await fetch(`/api/postcode-lookup?postcode=${encodeURIComponent(postcode.trim())}`);
      const data = await res.json();
      if (data.error) setLookupError(data.error);
      else setLookupData(data);
    } catch {
      setLookupError("Lookup failed. Try again.");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only Tool</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Area Research Tool</h1>
        <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, marginBottom: 28 }}>
          Sourcer-focused market intelligence. Which areas work for which strategy — and why.
        </p>

        {/* Area selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {AREAS.map(a => (
            <button key={a} onClick={() => setSelected(a)} style={{ padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: selected === a ? "#d4af37" : "rgba(255,255,255,0.07)", color: selected === a ? "#0a0f1e" : "rgba(255,255,255,0.6)" }}>
              {a}
            </button>
          ))}
        </div>

        {/* Area card */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          {/* Key stats */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>{selected}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)" }}>{area.region}</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {STRATEGY_TAGS.map(t => area[t.key as keyof typeof area] && (
                  <span key={t.key} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: t.color + "22", color: t.color }}>{t.label} ✓</span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Avg Price", value: "£" + area.avgPrice.toLocaleString() },
                { label: "Avg Monthly Rent", value: "£" + area.avgRent.toLocaleString() },
                { label: "Gross Yield", value: area.yield.toFixed(1) + "%" },
                { label: "Rental Demand", value: area.demand },
                { label: "Price Trend", value: area.trend },
                { label: "Avg BMV Discount", value: area.avgDiscount },
                { label: "Typical Refurb", value: area.refurbCost },
                { label: "Active Agents", value: area.agentCount + "+" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.58)", marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#d4af37" }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcer notes + postcodes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: 20, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#d4af37", marginBottom: 10 }}>📍 Sourcer Intelligence</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{area.notes}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>TARGET POSTCODES</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {area.postcodes.map(p => (
                  <span key={p} style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Postcode lookup */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Postcode Deep Dive</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 16 }}>Enter a specific postcode to see sold prices, rental data, and crime stats.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="text" placeholder="e.g. B21 9BB" value={postcode} onChange={e => setPostcode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              style={{ flex: 1, minWidth: 160, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
            <button onClick={lookup} disabled={loading} style={{ background: "#d4af37", color: "#0a0f1e", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Loading…" : "Look Up →"}
            </button>
          </div>

          {lookupError && <p style={{ fontSize: 13, color: "#f87171", marginTop: 12 }}>{lookupError}</p>}

          {lookupData && (
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
              {[
                { label: "Area", value: (lookupData as Record<string, unknown>).area as string },
                { label: "Region", value: (lookupData as Record<string, unknown>).region as string },
                { label: "Avg Sold Price", value: (lookupData as Record<string, unknown>).averagePrice ? "£" + ((lookupData as Record<string, unknown>).averagePrice as number).toLocaleString() : "N/A" },
                { label: "Crime Rate", value: (lookupData as Record<string, unknown>).crimeRate as string || "N/A" },
              ].filter(r => r.value).map(r => (
                <div key={r.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.58)", marginBottom: 3 }}>{r.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#d4af37" }}>{r.value}</p>
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <Link href="/calculators/deal-analyser" style={{ fontSize: 13, fontWeight: 700, color: "#d4af37", textDecoration: "none" }}>
                  Run a full deal analysis for this area →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
