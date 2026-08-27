"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter } from "@/components/PrintDoc";

export default function RepairReport() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [firstReported, setFirstReported] = useState("");
  const [urgency, setUrgency] = useState<"emergency" | "urgent" | "routine">("urgent");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [location, setLocation] = useState("");
  const [previousContact, setPreviousContact] = useState("");
  const [requestedAction, setRequestedAction] = useState("Please confirm receipt of this notice and advise when a contractor will be arranged to inspect and carry out the necessary repairs. I request that this is attended to within the timescale required by law.");
  const [deadline, setDeadline] = useState("");

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

  const urgencyConfig = {
    emergency: { label: "🚨 Emergency (24 hrs)", color: "#b91c1c", bg: "#fef2f2", desc: "No hot water, no heating in winter, flooding, gas leak, structural danger, sewage — landlord must act within 24 hours" },
    urgent: { label: "⚠️ Urgent (2–7 days)", color: "#d97706", bg: "#fffbeb", desc: "Broken boiler, serious leak, mould affecting health, broken locks — 2–7 days is typically expected" },
    routine: { label: "ℹ️ Routine (28 days)", color: "#2563eb", bg: "#eff6ff", desc: "Dripping tap, broken window handle, minor damp — landlord has around 28 days to respond" },
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: absolute; left: 0; top: 0; width: 100%; padding: 28px 36px; background: white; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template · Tenant Use</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Repair Report Letter</h1>
          <p className="text-navy-200 max-w-2xl">Formally notify your landlord of a repair issue. Creates a written paper trail — important under Awaab's Law and for any future deposit or legal dispute.</p>
        </div>
      </section>

      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container-max px-4 py-3">
          <p className="text-xs text-blue-800 font-semibold">📋 Awaab's Law (in force 2025): Landlords must investigate hazards within 14 days and start emergency repairs within 24 hours. Always report in writing and keep a copy. If the landlord fails to act, you can contact your local council or the PRS Ombudsman.</p>
        </div>
      </div>

      <div className="border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-navy-50 rounded-xl p-1">
            {(["form", "preview"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-800"}`}>
                {m === "form" ? "✏️ Fill in details" : "👁 Preview letter"}
              </button>
            ))}
          </div>
          <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 200); }} className="btn-primary text-sm">🖨️ Print / PDF</button>
        </div>
      </div>

      {mode === "form" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl space-y-6">

            <div className="bg-white rounded-2xl border border-navy-100 p-6">
              <h2 className="font-bold text-navy-800 mb-3">Urgency Level</h2>
              <div className="space-y-2">
                {(["emergency", "urgent", "routine"] as const).map(u => {
                  const cfg = urgencyConfig[u];
                  return (
                    <div key={u} onClick={() => setUrgency(u)}
                      style={{ borderColor: urgency === u ? cfg.color : undefined, backgroundColor: urgency === u ? cfg.bg : undefined }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${urgency !== u ? "border-navy-100 hover:border-navy-300" : ""}`}>
                      <p style={{ color: urgency === u ? cfg.color : "#0f1b36" }} className="font-bold text-sm mb-1">{cfg.label}</p>
                      <p className={`text-xs ${urgency === u ? "" : "text-navy-400"}`} style={{ color: urgency === u ? cfg.color : undefined, opacity: urgency === u ? 0.75 : 1 }}>{cfg.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Your Details (Tenant)</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Your Full Name *</label>
                <input value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="Your name as on tenancy" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                <textarea value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} rows={2} placeholder="The property where you live" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date of Letter</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Landlord / Agent Details</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord / Agent Name *</label>
                <input value={landlordName} onChange={e => setLandlordName(e.target.value)} placeholder="Landlord or managing agent" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Their Address</label>
                <textarea value={landlordAddress} onChange={e => setLandlordAddress(e.target.value)} rows={2} placeholder="Correspondence address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Repair Details</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Issue title *</label>
                <input value={issueTitle} onChange={e => setIssueTitle(e.target.value)} placeholder="e.g. Boiler not producing hot water" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Location in property</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Main bathroom, kitchen, loft" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Detailed description *</label>
                <textarea value={issueDesc} onChange={e => setIssueDesc(e.target.value)} rows={5} placeholder="Describe the issue in detail — what you can see, smell, or hear. Include when it started and how it is affecting you." className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">When did you first notice this?</label>
                <input type="date" value={firstReported} onChange={e => setFirstReported(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Previous contact with landlord about this issue</label>
                <textarea value={previousContact} onChange={e => setPreviousContact(e.target.value)} rows={2} placeholder="e.g. Reported verbally on 12 June 2025. No action taken." className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Response/repair deadline requested</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">What action you are requesting</label>
                <textarea value={requestedAction} onChange={e => setRequestedAction(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
            </div>

            <button onClick={() => setMode("preview")} className="w-full btn-gold">Preview Letter →</button>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="p-10" style={{ background: "white", color: "#1a1a1a", fontFamily: "Arial, Helvetica, sans-serif" }}>
              <PrintHeader
                category={`Formal Notice · ${urgency.toUpperCase()} Repair Request`}
                title="Notice of Repair Required"
                date={issueDate}
              />

              {/* Letter addresses */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 4 }}>From (Tenant)</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>{tenantName || "_______________"}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{propertyAddress || "_______________"}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{fmt(issueDate)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 4 }}>To (Landlord)</p>
                  <p style={{ fontSize: 12, color: "#374151" }}>{landlordName || "_______________"}</p>
                  {landlordAddress && <p style={{ fontSize: 11, color: "#6b7280", whiteSpace: "pre-line" }}>{landlordAddress}</p>}
                </div>
              </div>

              {/* Urgency band */}
              {(() => {
                const cfg = urgencyConfig[urgency];
                return (
                  <div style={{ border: `1.5px solid ${cfg.color}`, padding: "8px 12px", marginBottom: 16 }}>
                    <p style={{ fontSize: 11.5, fontWeight: 800, color: cfg.color }}>{urgency.toUpperCase()} REPAIR NOTICE — {cfg.desc}</p>
                  </div>
                );
              })()}

              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", marginBottom: 14 }}>
                Re: Notice of Repair Required — {issueTitle || "_______________"}
              </p>

              <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.8, marginBottom: 12 }}>Dear {landlordName || "Sir/Madam"},</p>
              <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.8, marginBottom: 14 }}>I am writing to formally notify you of a repair that is required at the above property, which I occupy as your tenant.</p>

              <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 14 }}>
                <p style={{ fontWeight: 700, color: "#0f1b36", marginBottom: 8, fontSize: 11.5 }}>Details of the issue:</p>
                <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "5px 12px", fontSize: 11 }}>
                  <span style={{ color: "#6b7280" }}>Issue:</span><span style={{ fontWeight: 600 }}>{issueTitle || "—"}</span>
                  {location && <><span style={{ color: "#6b7280" }}>Location:</span><span>{location}</span></>}
                  {firstReported && <><span style={{ color: "#6b7280" }}>First noticed:</span><span>{fmt(firstReported)}</span></>}
                </div>
                {issueDesc && <p style={{ marginTop: 10, color: "#374151", lineHeight: 1.65, fontSize: 11.5 }}>{issueDesc}</p>}
              </div>

              <div style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.8 }}>
                {previousContact && <p style={{ marginBottom: 10 }}><strong>Previous contact:</strong> {previousContact}</p>}
                <p style={{ marginBottom: 10 }}>{requestedAction}</p>
                {deadline && <p style={{ marginBottom: 10 }}>I request a response by <strong>{fmt(deadline)}</strong>. If I do not hear from you by this date, I may contact the local council's housing enforcement team or the Private Rented Sector Ombudsman.</p>}
                <p style={{ marginBottom: 10 }}>As a landlord you have a legal duty to maintain the property in a good state of repair under Section 11 of the Landlord and Tenant Act 1985. Under Awaab's Law (Renters' Rights Act 2025), you are required to investigate and begin remediation of hazards within prescribed timescales.</p>
                <p>I am keeping a copy of this letter for my records.</p>
              </div>

              <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.8, marginTop: 20, marginBottom: 8 }}>Yours faithfully,</p>
              <SignatureBlock
                signerLabel={tenantName || "Tenant"}
                signerName={tenantName}
                showWitness={false}
                date={issueDate}
              />
              <PrintFooter docTitle="Repair Report Notice" note="Landlord and Tenant Act 1985 s.11 · Renters' Rights Act 2025" />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit</button>
              <ShareToolbar docTitle="Repair Report" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}





