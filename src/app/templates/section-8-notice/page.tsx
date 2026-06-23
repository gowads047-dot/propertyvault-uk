"use client";

import { useState } from "react";

const GROUNDS = [
  { id: "g8", n: "Ground 8", type: "Mandatory", notice: "4 weeks", title: "Serious Rent Arrears", detail: "At least 2 months' rent is unpaid both at the date of service of this notice AND at the date of the court hearing. The court must grant possession if this ground is made out." },
  { id: "g10", n: "Ground 10", type: "Discretionary", notice: "4 weeks", title: "Some Rent Arrears", detail: "Some rent is unpaid at the date of service and was in arrears at the date that notice was served. Court has discretion — must be reasonable to grant possession." },
  { id: "g11", n: "Ground 11", type: "Discretionary", notice: "4 weeks", title: "Persistent Late Payment", detail: "Tenant has persistently delayed paying rent even if not currently in arrears. Court has discretion." },
  { id: "g12", n: "Ground 12", type: "Discretionary", notice: "2 weeks", title: "Breach of Tenancy Obligation", detail: "Tenant has broken one or more terms of the tenancy agreement (other than rent). Specify the breach in the details below." },
  { id: "g13", n: "Ground 13", type: "Discretionary", notice: "2 weeks", title: "Deterioration of Property", detail: "The condition of the property has deteriorated due to acts of waste or neglect by the tenant or any person living with them." },
  { id: "g14", n: "Ground 14", type: "Discretionary", notice: "Immediate", title: "Nuisance or Antisocial Behaviour", detail: "The tenant or someone living in or visiting the property has been guilty of conduct causing nuisance, annoyance, or illegal/immoral use of the property." },
  { id: "g14a", n: "Ground 14A", type: "Mandatory", notice: "2 weeks", title: "Domestic Abuse", detail: "One of two joint tenants has left because of domestic abuse caused by the other. Mandatory ground for registered social landlords — may also apply to private landlords in certain circumstances." },
  { id: "g15", n: "Ground 15", type: "Discretionary", notice: "2 weeks", title: "Deterioration of Furniture", detail: "The condition of any furniture provided under the tenancy has deteriorated due to ill-treatment by the tenant or someone living with them." },
  { id: "g17", n: "Ground 17", type: "Discretionary", notice: "2 weeks", title: "False Statement", detail: "The tenant or someone acting on their behalf induced the landlord to grant the tenancy by knowingly or recklessly making a false or misleading statement." },
  { id: "g1a", n: "Ground 1A", type: "Mandatory", notice: "4 months", title: "Landlord Intends to Sell", detail: "The landlord requires possession of the property for the purpose of disposing of it with vacant possession. A new ground introduced by the Renters' Rights Act 2025." },
  { id: "g1b", n: "Ground 1B", type: "Mandatory", notice: "4 months", title: "Landlord or Family to Occupy", detail: "The landlord or a member of the landlord's close family requires the property as their only or principal home. A new ground under the Renters' Rights Act 2025." },
];

export default function Section8Notice() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [agentName, setAgentName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedGrounds, setSelectedGrounds] = useState<string[]>([]);
  const [groundDetails, setGroundDetails] = useState<Record<string, string>>({});
  const [arrearAmount, setArrearAmount] = useState("");
  const [arrearWeeks, setArrearWeeks] = useState("");

  const toggleGround = (id: string) => setSelectedGrounds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const chosen = GROUNDS.filter(g => selectedGrounds.includes(g.id));
  const longestNotice = chosen.reduce((acc, g) => {
    const days = g.notice === "Immediate" ? 0 : g.notice === "2 weeks" ? 14 : g.notice === "4 weeks" ? 28 : 120;
    return Math.max(acc, days);
  }, 0);

  const possessionDate = () => {
    if (!issueDate || longestNotice === 0) return "_______________";
    const d = new Date(issueDate);
    d.setDate(d.getDate() + longestNotice);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: fixed; inset: 0; padding: 28px 36px; background: white; }
          @page { size: A4; margin: 18mm 20mm; }
        }
      `}</style>

      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template · Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Section 8 Possession Notice</h1>
          <p className="text-navy-200 max-w-2xl">A Notice Seeking Possession under Section 8 of the Housing Act 1988. Select your grounds, fill in the details, and generate a court-ready notice.</p>
        </div>
      </section>

      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container-max px-4 py-3">
          <p className="text-xs text-amber-800 font-semibold">⚠️ Legal document — Section 21 has been abolished under the Renters' Rights Act 2025. Section 8 is now the only route to possession. Always serve notices correctly — procedural errors can invalidate the notice. Seek legal advice for complex cases.</p>
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
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord Full Name *</label>
                <input value={landlordName} onChange={e => setLandlordName(e.target.value)} placeholder="Full legal name" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord Address *</label>
                <textarea value={landlordAddress} onChange={e => setLandlordAddress(e.target.value)} placeholder="Address for correspondence" rows={2} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Agent Name (if serving on behalf of landlord)</label>
                <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Leave blank if landlord serving directly" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Tenant(s) Full Name(s) *</label>
                <input value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="All named tenants" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                <textarea value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Full address of the let property" rows={2} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date of Notice *</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            {/* Ground selector */}
            <div className="bg-white rounded-2xl border border-navy-100 p-6">
              <h2 className="font-bold text-navy-800 mb-1">Select Ground(s) for Possession *</h2>
              <p className="text-xs text-navy-400 mb-4">You may rely on more than one ground. The longest required notice period will apply.</p>
              <div className="space-y-3">
                {GROUNDS.map(g => (
                  <div key={g.id} onClick={() => toggleGround(g.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedGrounds.includes(g.id) ? "bg-navy-800 border-navy-800" : "border-navy-100 hover:border-navy-300 bg-navy-50"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${selectedGrounds.includes(g.id) ? "bg-gold-400 border-gold-400" : "border-navy-300"}`}>
                        {selectedGrounds.includes(g.id) && <svg className="w-3 h-3 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-sm ${selectedGrounds.includes(g.id) ? "text-white" : "text-navy-800"}`}>{g.n} — {g.title}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${g.type === "Mandatory" ? "bg-red-100 text-red-700" : "bg-navy-100 text-navy-600"} ${selectedGrounds.includes(g.id) ? "!bg-white/20 !text-white" : ""}`}>{g.type}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full bg-navy-100 text-navy-600 ${selectedGrounds.includes(g.id) ? "!bg-white/20 !text-white" : ""}`}>{g.notice} notice</span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${selectedGrounds.includes(g.id) ? "text-navy-200" : "text-navy-500"}`}>{g.detail}</p>
                      </div>
                    </div>
                    {selectedGrounds.includes(g.id) && (
                      <div className="mt-3 ml-8" onClick={e => e.stopPropagation()}>
                        <label className="block text-xs text-navy-200 mb-1">Particulars for this ground (required — describe the specific facts):</label>
                        <textarea value={groundDetails[g.id] || ""} onChange={e => setGroundDetails(p => ({ ...p, [g.id]: e.target.value }))}
                          placeholder={g.id === "g8" || g.id === "g10" || g.id === "g11" ? `e.g. As at ${fmt(issueDate)}, the tenant owes £${arrearAmount || "___"} in rent arrears representing ${arrearWeeks || "___"} weeks/months of unpaid rent...` : "Describe the specific facts that support this ground..."}
                          rows={3} className="w-full px-3 py-2 border border-white/20 rounded-lg text-xs text-white bg-white/10 placeholder-navy-300 focus:outline-none focus:ring-1 focus:ring-gold-400 resize-none" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedGrounds.some(g => ["g8","g10","g11"].includes(g)) && (
              <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
                <h2 className="font-bold text-navy-800">Rent Arrears Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-navy-700 mb-1">Total arrears amount (£)</label>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                      <input value={arrearAmount} onChange={e => setArrearAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
                  <div><label className="block text-sm font-semibold text-navy-700 mb-1">Weeks / months outstanding</label>
                    <input value={arrearWeeks} onChange={e => setArrearWeeks(e.target.value)} placeholder="e.g. 3 months" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                </div>
              </div>
            )}

            {chosen.length > 0 && (
              <div className="bg-navy-800 rounded-2xl p-5 text-white">
                <p className="text-sm font-bold text-gold-400 mb-1">Notice period required: {longestNotice === 0 ? "Immediate (serve and proceed)" : longestNotice === 14 ? "2 weeks" : longestNotice === 28 ? "4 weeks" : "4 months"}</p>
                <p className="text-xs text-navy-200">Earliest possession date: <strong className="text-white">{possessionDate()}</strong></p>
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
                <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Housing Act 1988 (as amended)</p>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f1b36", margin: "0 0 4px" }}>Notice Seeking Possession of a Property</h1>
                <p style={{ fontSize: 13, color: "#6b7280" }}>Section 8 Notice · Assured Periodic Tenancy</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20, fontSize: 12 }}>
                <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>To (Tenant)</p>
                  <p style={{ fontWeight: 700, color: "#0f1b36" }}>{tenantName || "_______________"}</p>
                  <p style={{ color: "#374151", marginTop: 4 }}>{propertyAddress || "_______________"}</p>
                </div>
                <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>From (Landlord{agentName ? "/Agent" : ""})</p>
                  <p style={{ fontWeight: 700, color: "#0f1b36" }}>{agentName || landlordName || "_______________"}</p>
                  {agentName && <p style={{ color: "#374151", fontSize: 11 }}>on behalf of {landlordName}</p>}
                  <p style={{ color: "#374151", marginTop: 4, fontSize: 11 }}>{landlordAddress}</p>
                </div>
              </div>

              <div style={{ background: "#fef9ec", border: "1px solid #c9a84c", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 12 }}>
                <p style={{ fontWeight: 700, color: "#0f1b36", marginBottom: 4 }}>Date of this notice: {fmt(issueDate)}</p>
                <p style={{ color: "#374151" }}>The landlord gives you notice that they intend to apply to the court for an order requiring you to give up possession of the above-named property.</p>
                {longestNotice > 0 && <p style={{ color: "#374151", marginTop: 6 }}>You are required to vacate the property on or before: <strong>{possessionDate()}</strong></p>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ background: "#0f1b36", color: "white", padding: "6px 12px", borderRadius: 4, marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Grounds for Possession</p>
                </div>
                {chosen.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>No grounds selected.</p>
                ) : chosen.map((g, i) => (
                  <div key={g.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < chosen.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                      <span style={{ background: "#0f1b36", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{g.n}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>{g.title}</span>
                      <span style={{ fontSize: 10, color: g.type === "Mandatory" ? "#dc2626" : "#6b7280", fontWeight: 600, marginLeft: "auto" }}>{g.type}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, marginBottom: groundDetails[g.id] ? 6 : 0 }}>{g.detail}</p>
                    {groundDetails[g.id] && (
                      <div style={{ background: "#f5f2ec", borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "#0f1b36" }}>
                        <strong>Particulars:</strong> {groundDetails[g.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 20 }}>
                <p>If you do not leave the property by the date stated above, the landlord will apply to the court for a possession order. If the court grants an order and you still do not leave, bailiffs can be instructed to remove you.</p>
                <p style={{ marginTop: 8 }}>If you need advice about this notice, contact Citizens Advice (0800 144 8848), Shelter (0808 800 4444), or a housing solicitor as soon as possible.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 24 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Signed (Landlord / Agent)</p>
                  <div style={{ borderBottom: "1.5px solid #0f1b36", height: 36, marginBottom: 6 }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36" }}>{agentName || landlordName || "_______________"}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>Date: {fmt(issueDate)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#9ca3af" }}>Service method</p>
                  <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                    {["Hand delivered", "First class post", "Email (if agreed in tenancy)"].map(m => (
                      <div key={m} style={{ display: "flex", gap: 6, fontSize: 11 }}>
                        <div style={{ width: 12, height: 12, border: "1px solid #9ca3af", borderRadius: 2, flexShrink: 0, marginTop: 1 }} />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 10, color: "#991b1b" }}>
                Important: Keep proof of service (certificate of posting, delivery confirmation, or signed receipt). You will need this if the matter proceeds to court.
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
