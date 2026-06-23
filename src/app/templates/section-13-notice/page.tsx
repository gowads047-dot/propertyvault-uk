"use client";

import { useState } from "react";

export default function Section13Notice() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [currentRent, setCurrentRent] = useState("");
  const [proposedRent, setProposedRent] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [rentPeriod, setRentPeriod] = useState<"monthly" | "weekly">("monthly");

  const effectiveDate = () => {
    if (!issueDate) return "_______________";
    const d = new Date(issueDate);
    d.setDate(d.getDate() + 62); // 2 months + 2 days buffer
    // Round to first of next month after notice period
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

  const increase = currentRent && proposedRent
    ? (parseFloat(proposedRent) - parseFloat(currentRent)).toFixed(2)
    : null;
  const increasePct = currentRent && proposedRent
    ? (((parseFloat(proposedRent) - parseFloat(currentRent)) / parseFloat(currentRent)) * 100).toFixed(1)
    : null;

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: fixed; inset: 0; padding: 28px 36px; background: white; }
          @page { size: A4; margin: 20mm; }
        }
      `}</style>

      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template · Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Section 13 Rent Increase Notice</h1>
          <p className="text-navy-200 max-w-2xl">The only lawful way to increase rent under the Renters' Rights Act 2025. Landlords must use this prescribed process — informal rent increase requests are not valid.</p>
        </div>
      </section>

      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container-max px-4 py-3">
          <p className="text-xs text-blue-800 font-semibold">ℹ️ Under the Renters' Rights Act 2025: Rent can only be increased once per 12 months. You must give at least 2 months' written notice. Tenants can challenge the increase at the First-tier Tribunal. Any rent review clause in the tenancy agreement is void — this process is mandatory.</p>
        </div>
      </div>

      <div className="border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-navy-50 rounded-xl p-1">
            {(["form", "preview"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-800"}`}>
                {m === "form" ? "✏️ Fill in details" : "👁 Preview notice"}
              </button>
            ))}
          </div>
          <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 200); }} className="btn-primary text-sm">🖨️ Print / PDF</button>
        </div>
      </div>

      {mode === "form" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Parties & Property</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord / Agent Name *</label>
                <input value={landlordName} onChange={e => setLandlordName(e.target.value)} placeholder="Full name or company" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord Address</label>
                <textarea value={landlordAddress} onChange={e => setLandlordAddress(e.target.value)} rows={2} placeholder="Correspondence address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Tenant(s) Name(s) *</label>
                <input value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="All named tenants" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                <textarea value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} rows={2} placeholder="Full address of the property" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Rent Details</h2>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-2">Rent period</label>
                <div className="flex gap-2">
                  {(["monthly", "weekly"] as const).map(p => (
                    <button key={p} onClick={() => setRentPeriod(p)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${rentPeriod === p ? "bg-navy-800 text-white border-navy-800" : "border-navy-200 text-navy-600 hover:border-navy-400"}`}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Current Rent (£/{rentPeriod === "monthly" ? "mo" : "wk"}) *</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                    <input type="number" value={currentRent} onChange={e => setCurrentRent(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Proposed New Rent (£/{rentPeriod === "monthly" ? "mo" : "wk"}) *</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                    <input type="number" value={proposedRent} onChange={e => setProposedRent(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>
              {increase && (
                <div className="bg-navy-50 rounded-xl p-4 text-sm">
                  <p className="text-navy-600">Increase: <strong className="text-navy-800">£{increase}/{rentPeriod === "monthly" ? "mo"  : "wk"}</strong> ({increasePct}%)</p>
                </div>
              )}
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date of Notice *</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            {issueDate && proposedRent && (
              <div className="bg-navy-800 rounded-2xl p-5 text-white">
                <p className="text-sm font-bold text-gold-400 mb-1">New rent effective from approximately:</p>
                <p className="text-xl font-bold">{effectiveDate()}</p>
                <p className="text-xs text-navy-300 mt-1">This is the first rent day at least 2 full months after the notice date. Verify the exact date with your tenancy start day.</p>
              </div>
            )}

            <button onClick={() => setMode("preview")} className="w-full btn-gold">Preview Notice →</button>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="bg-white rounded-2xl border border-navy-100 p-10" style={{ fontFamily: "Georgia, serif" }}>
              <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #0f1b36" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Housing Act 1988, Section 13 (as amended)</p>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f1b36", margin: "0 0 4px" }}>Notice of Rent Increase</h1>
                <p style={{ fontSize: 12, color: "#6b7280" }}>Assured Periodic Tenancy — Private Rented Sector</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, fontSize: 12 }}>
                <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>To (Tenant)</p>
                  <p style={{ fontWeight: 700, color: "#0f1b36" }}>{tenantName || "_______________"}</p>
                  <p style={{ color: "#374151", marginTop: 4, fontSize: 11 }}>{propertyAddress || "_______________"}</p>
                </div>
                <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>From (Landlord / Agent)</p>
                  <p style={{ fontWeight: 700, color: "#0f1b36" }}>{landlordName || "_______________"}</p>
                  {landlordAddress && <p style={{ color: "#374151", marginTop: 4, fontSize: 11 }}>{landlordAddress}</p>}
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
                I/We, the landlord of the above property, give you notice that the rent for the above property will be increased as follows, pursuant to Section 13 of the Housing Act 1988.
              </p>

              <div style={{ background: "#0f1b36", color: "white", borderRadius: 12, padding: 20, marginBottom: 20, textAlign: "center" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Current Rent</p>
                    <p style={{ fontSize: 28, fontWeight: 800, fontFamily: "ui-monospace, monospace" }}>£{currentRent || "—"}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>per {rentPeriod}</p>
                  </div>
                  <div style={{ fontSize: 24, color: "#c9a84c" }}>→</div>
                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>New Rent</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#c9a84c", fontFamily: "ui-monospace, monospace" }}>£{proposedRent || "—"}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>per {rentPeriod}</p>
                  </div>
                </div>
                {increase && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>Increase of £{increase}/{rentPeriod} ({increasePct}%)</p>}
              </div>

              <div style={{ background: "#fef9ec", border: "1px solid #c9a84c", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 12 }}>
                <p style={{ fontWeight: 700, color: "#0f1b36", marginBottom: 4 }}>Notice date: {fmt(issueDate)}</p>
                <p style={{ color: "#374151" }}>The new rent will take effect from: <strong>{effectiveDate()}</strong></p>
                <p style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>This is the first rent payment date falling at least two months after the date of this notice.</p>
              </div>

              <div style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
                <p><strong>Your right to challenge this increase:</strong> If you believe the proposed rent is above the open market rate for similar properties in the area, you may refer this notice to the First-tier Tribunal (Property Chamber) for a determination. You must do so before the effective date of the increase. The Tribunal may set a rent equal to or lower than the proposed amount — it cannot award a higher rent than proposed.</p>
                <p style={{ marginTop: 8 }}>To refer to the Tribunal, visit: <strong>www.gov.uk/find-a-tribunal</strong> or call 0300 123 1024.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 24 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Signed (Landlord / Agent)</p>
                  <div style={{ borderBottom: "1.5px solid #0f1b36", height: 36, marginBottom: 6 }} />
                  <p style={{ fontSize: 11, fontWeight: 600 }}>{landlordName || "_______________"}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>Date: {fmt(issueDate)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Tenant acknowledgement (optional)</p>
                  <div style={{ borderBottom: "1.5px solid #0f1b36", height: 36, marginBottom: 6 }} />
                  <p style={{ fontSize: 11, color: "#6b7280" }}>Date: _______________</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit</button>
              <button onClick={() => window.print()} className="btn-primary text-sm">🖨️ Print / PDF</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
