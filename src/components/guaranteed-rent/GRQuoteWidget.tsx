"use client";

import { useState } from "react";

// ── Market rate benchmarks by city & bedrooms ────────────────────────────────
// GR offer = 82–88% of market rate. Ranges shown to visitor.
const MARKET_RATES: Record<string, Record<number, number>> = {
  birmingham:  { 1: 700,  2: 875,  3: 1050, 4: 1300, 5: 1600, 6: 1900 },
  nottingham:  { 1: 700,  2: 800,  3: 950,  4: 1100, 5: 1350, 6: 1600 },
  derby:       { 1: 650,  2: 750,  3: 900,  4: 1050, 5: 1300, 6: 1550 },
};

// What self-managing costs per year (used in comparison)
const SELF_MANAGE_DEDUCTIONS = {
  agentFees:   0.10,  // 10% management
  voidWeeks:   3,     // average void weeks per year
  maintenance: 600,   // annual maintenance estimate
  compliance:  300,   // gas cert, EICR amortised
};

const fmt = (n: number) =>
  "£" + Math.round(n).toLocaleString("en-GB");

export function GRQuoteWidget() {
  const [city, setCity] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [shown, setShown] = useState(false);

  const marketRent = city && bedrooms ? (MARKET_RATES[city]?.[bedrooms] ?? 0) : 0;
  const grLow  = Math.round(marketRent * 0.82);
  const grHigh = Math.round(marketRent * 0.88);

  // Self-managing annual net
  const selfManageGross = marketRent * 12;
  const agentCut  = selfManageGross * SELF_MANAGE_DEDUCTIONS.agentFees;
  const voidLoss  = (marketRent / 4) * SELF_MANAGE_DEDUCTIONS.voidWeeks;
  const selfNet   = selfManageGross - agentCut - voidLoss - SELF_MANAGE_DEDUCTIONS.maintenance - SELF_MANAGE_DEDUCTIONS.compliance;

  const grMidAnnual  = ((grLow + grHigh) / 2) * 12;
  const annualDiff   = grMidAnnual - selfNet;

  const canShow = city && bedrooms > 0;

  return (
    <div style={{ background: "white", border: "2px solid #e2e8f0", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(15,27,54,0.06)" }}>

      {/* Widget header */}
      <div style={{ background: "#0f1b36", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c9a84c", animation: "pulse 2s infinite" }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em" }}>Instant estimate</p>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", marginTop: 4 }}>What would we pay you?</h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>Answer 2 questions — see your estimated guaranteed rent in seconds.</p>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>

          {/* City */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>City</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { id: "birmingham", label: "Birmingham" },
                { id: "nottingham", label: "Nottingham" },
                { id: "derby",      label: "Derby" },
              ].map(c => (
                <button key={c.id} onClick={() => { setCity(c.id); setShown(false); }}
                  style={{ padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left",
                    background: city === c.id ? "#0f1b36" : "#f8f9fc",
                    color: city === c.id ? "white" : "#374151",
                    border: city === c.id ? "none" : "1.5px solid #e2e8f0",
                    transition: "all 0.15s" }}>
                  {city === c.id && <span style={{ color: "#c9a84c", marginRight: 6 }}>✓</span>}
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Bedrooms</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[1, 2, 3, 4, 5, 6].map(b => (
                <button key={b} onClick={() => { setBedrooms(b); setShown(false); }}
                  style={{ padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "center",
                    background: bedrooms === b ? "#0f1b36" : "#f8f9fc",
                    color: bedrooms === b ? "white" : "#374151",
                    border: bedrooms === b ? "none" : "1.5px solid #e2e8f0",
                    transition: "all 0.15s" }}>
                  {b}{b === 6 ? "+" : ""}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, lineHeight: 1.4 }}>
              Based on typical Birmingham, Nottingham & Derby market rents. Your actual offer depends on property condition, location, and a free valuation visit.
            </p>
          </div>
        </div>

        {/* CTA to show estimate */}
        {!shown && (
          <button onClick={() => { if (canShow) setShown(true); }}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: canShow ? "pointer" : "not-allowed", fontWeight: 800, fontSize: 15,
              background: canShow ? "#c9a84c" : "#e2e8f0",
              color: canShow ? "#0f1b36" : "#94a3b8",
              transition: "all 0.15s" }}>
            {canShow ? "Show my estimated rent →" : "Select city and bedrooms above"}
          </button>
        )}

        {/* ── Result ── */}
        {shown && canShow && (
          <div style={{ marginTop: 4 }}>

            {/* Main figure */}
            <div style={{ background: "linear-gradient(135deg, #0f1b36 0%, #1a2d5a 100%)", borderRadius: 16, padding: "24px 20px", textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Your estimated guaranteed rent
              </p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                {bedrooms}-bedroom in {city.charAt(0).toUpperCase() + city.slice(1)}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, margin: "12px 0" }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: "#c9a84c", letterSpacing: "-0.02em" }}>{fmt(grLow)}–{fmt(grHigh)}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>per month · guaranteed · every month</p>

              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Even if empty</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "white" }}>Still paid</p>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Management fees</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "white" }}>£0</p>
                </div>
                <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Lease length</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "white" }}>3–5 yrs</p>
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <div style={{ background: "#f8f9fc", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>Annual income comparison</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Gross market rent", self: fmt(selfManageGross), gr: "—", selfColor: "#374151", grColor: "#94a3b8" },
                  { label: "Agent fees (10%)", self: `−${fmt(agentCut)}`, gr: "£0", selfColor: "#dc2626", grColor: "#16a34a" },
                  { label: `Void periods (${SELF_MANAGE_DEDUCTIONS.voidWeeks} wks)`, self: `−${fmt(voidLoss)}`, gr: "£0", selfColor: "#dc2626", grColor: "#16a34a" },
                  { label: "Maintenance & compliance", self: `−${fmt(SELF_MANAGE_DEDUCTIONS.maintenance + SELF_MANAGE_DEDUCTIONS.compliance)}`, gr: "£0", selfColor: "#dc2626", grColor: "#16a34a" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: "#64748b" }}>{r.label}</span>
                    <div style={{ display: "flex", gap: 24 }}>
                      <span style={{ fontWeight: 700, color: r.selfColor, minWidth: 80, textAlign: "right" }}>{r.self}</span>
                      <span style={{ fontWeight: 700, color: r.grColor, minWidth: 80, textAlign: "right" }}>{r.gr}</span>
                    </div>
                  </div>
                ))}
                {/* Totals */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36" }}>Your annual net income</span>
                  <div style={{ display: "flex", gap: 24 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0f1b36", minWidth: 80, textAlign: "right" }}>{fmt(selfNet)}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", minWidth: 80, textAlign: "right" }}>{fmt(grMidAnnual)}</span>
                  </div>
                </div>
                {annualDiff > 0 && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginTop: 4 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>
                      ✓ With guaranteed rent you could earn {fmt(annualDiff)} more per year — with zero effort.
                    </p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 10 }}>
                Illustrative. Self-managing figures assume 10% agent fees, 3 void weeks, £{SELF_MANAGE_DEDUCTIONS.maintenance + SELF_MANAGE_DEDUCTIONS.compliance} annual maintenance & compliance.
                Your GR columns show {fmt(grLow)}–{fmt(grHigh)}/mo mid-point annualised.
              </p>
            </div>

            {/* Column headers for comparison */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, marginBottom: 4, paddingRight: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", minWidth: 80, textAlign: "right" }}>Self-manage</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#15803d", minWidth: 80, textAlign: "right" }}>Guaranteed rent</span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="https://calendly.com/gowads047/30min" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: "#0f1b36", color: "white", borderRadius: 12, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                Book a Free 15-Min Call →
              </a>
              <a href="#enquiry" style={{ display: "block", padding: "12px", background: "rgba(15,27,54,0.08)", color: "#0f1b36", borderRadius: 12, fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none", border: "1.5px solid #e2e8f0" }}>
                Get my exact offer (form) →
              </a>
              <a href="https://wa.me/447415721628?text=Hi%2C%20I%20used%20the%20quote%20tool%20and%20I%27d%20like%20to%20discuss%20guaranteed%20rent%20for%20my%20property." target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", background: "#22c55e", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Or WhatsApp us
              </a>
            </div>
            <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 10 }}>
              No obligation · We respond within 2 hours · Free property valuation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
