"use client";

import { useState } from "react";

interface Sale { date: string; price: number; type: string; tenure: string; address: string; newBuild: boolean; }
interface AreaData {
  postcode: string; region: string; district: string;
  crime: { total: number; level: string; color: string; month: string; topCategories: { label: string; count: number }[] };
  sales: { recent: Sale[]; avgPrice: number };
}

const fmt = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

export function AreaSoldPricesWidget({ defaultPostcode = "" }: { defaultPostcode?: string }) {
  const [postcode, setPostcode] = useState(defaultPostcode);
  const [input,    setInput]    = useState(defaultPostcode);
  const [loading,  setLoading]  = useState(false);
  const [data,     setData]     = useState<AreaData | null>(null);
  const [error,    setError]    = useState("");

  async function lookup(pc: string = input) {
    const q = pc.trim();
    if (!q) return;
    setLoading(true); setError(""); setData(null); setPostcode(q);
    try {
      const res  = await fetch(`/api/postcode-lookup?postcode=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Lookup failed"); return; }
      setData(json);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 20, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#0f1b36", padding: "20px 24px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
          Live data · Land Registry
        </p>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "white", marginBottom: 3 }}>Sold Prices & Crime Data</h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Enter any postcode to see recent sold prices and crime stats.</p>
      </div>

      {/* Search */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && lookup()}
            placeholder="e.g. B12 8QX or NG7 2PH"
            style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "monospace", textTransform: "uppercase" }} />
          <button onClick={() => lookup()} disabled={loading}
            style={{ padding: "10px 20px", background: loading ? "#e2e8f0" : "#0f1b36", color: loading ? "#94a3b8" : "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {loading ? "Looking up…" : "Look up"}
          </button>
        </div>
        {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 8 }}>{error}</p>}
      </div>

      {/* Results */}
      {data && (
        <div style={{ padding: "20px 24px" }}>
          {/* Location summary */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginBottom: 20, padding: "12px 16px", background: "#f8f9fc", borderRadius: 12 }}>
            {[
              { l: "Postcode",    v: data.postcode },
              { l: "District",    v: data.district || "—" },
              { l: "Region",      v: data.region || "—" },
            ].map(s => (
              <div key={s.l}>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.l}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36" }}>{s.v}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {/* Sold prices */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>Recent sold prices</p>
              {data.sales.recent.length > 0 ? (
                <>
                  {data.sales.avgPrice > 0 && (
                    <div style={{ padding: "10px 14px", background: "#0f1b36", borderRadius: 10, marginBottom: 10 }}>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Average</p>
                      <p style={{ fontSize: 20, fontWeight: 800, color: "#c9a84c" }}>{fmt(data.sales.avgPrice)}</p>
                    </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {data.sales.recent.slice(0, 6).map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 10px", background: "#f8f9fc", borderRadius: 8 }}>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "#0f1b36" }}>{s.address || "—"}</p>
                          <p style={{ fontSize: 10, color: "#94a3b8" }}>{s.type} · {s.tenure} {s.newBuild ? "· New build" : ""}</p>
                          <p style={{ fontSize: 10, color: "#94a3b8" }}>{s.date}</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: "#0f1b36", whiteSpace: "nowrap", paddingLeft: 8 }}>{fmt(s.price)}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No recent sales found for this postcode. Try a nearby postcode for more results.</p>
              )}
            </div>

            {/* Crime data */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>Crime ({data.crime.month})</p>
              {data.crime.total > 0 ? (
                <>
                  <div style={{ padding: "10px 14px", background: "#f8f9fc", borderRadius: 10, marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Level</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: data.crime.color }}>{data.crime.level}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Incidents</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36" }}>{data.crime.total}</p>
                    </div>
                  </div>
                  {data.crime.topCategories.map((c, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: "#374151" }}>{c.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1b36" }}>{c.count}</span>
                      </div>
                      <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min((c.count / data.crime.total) * 100 * 2, 100)}%`, background: "#c9a84c", borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 8 }}>Source: data.police.uk · 1 mile radius</p>
                </>
              ) : (
                <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No crime data available for this period.</p>
              )}
            </div>
          </div>

          <p style={{ fontSize: 11, color: "#94a3b8" }}>
            Sold prices: HM Land Registry. Crime: data.police.uk. For research purposes only.
          </p>
        </div>
      )}

      {!data && !loading && (
        <div style={{ padding: "32px 24px", textAlign: "center", color: "#94a3b8" }}>
          <p style={{ fontSize: 13 }}>Enter a postcode above to see live sold prices and crime data for any UK address.</p>
        </div>
      )}
    </div>
  );
}
