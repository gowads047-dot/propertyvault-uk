"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";

export default function PetPermission() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [decision, setDecision] = useState<"approve" | "approve-conditions" | "refuse">("approve");
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petName, setPetName] = useState("");
  const [conditions, setConditions] = useState("• Tenant is responsible for any damage caused by the pet and agrees to have carpets professionally cleaned at the end of the tenancy.\n• The pet must be kept under control at all times.\n• The landlord must be informed immediately if the pet causes any damage to the property.\n• No additional pets may be kept at the property without prior written consent.");
  const [refusalReason, setRefusalReason] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

  const decisionConfig = {
    approve: { label: "✅ Approve", color: "#16a34a", bg: "#f0fdf4", border: "#86efac", text: "Permission granted" },
    "approve-conditions": { label: "⚠️ Approve with conditions", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", text: "Permission granted with conditions" },
    refuse: { label: "❌ Refuse", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", text: "Permission refused" },
  };

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
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Pet Permission Letter</h1>
          <p className="text-navy-200 max-w-2xl">Respond formally to tenant pet requests. Approve, approve with conditions, or refuse — all in a professionally worded letter.</p>
        </div>
      </section>

      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container-max px-4 py-3">
          <p className="text-xs text-amber-800 font-semibold">ℹ️ Under the Renters' Rights Act 2025: Landlords cannot unreasonably refuse a pet request. If you refuse, you must have a reasonable justification (e.g. property type, lease restrictions, severe allergy). A "no pets" blanket clause in the tenancy is no longer valid grounds for refusal.</p>
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
              <h2 className="font-bold text-navy-800 mb-3">Decision</h2>
              <div className="space-y-2">
                {(["approve", "approve-conditions", "refuse"] as const).map(d => {
                  const cfg = decisionConfig[d];
                  return (
                    <div key={d} onClick={() => setDecision(d)}
                      style={{ borderColor: decision === d ? cfg.color : undefined, backgroundColor: decision === d ? cfg.bg : undefined }}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${decision !== d ? "border-navy-100 hover:border-navy-300" : ""}`}>
                      <p style={{ color: decision === d ? cfg.color : "#0f1b36" }} className="font-bold text-sm">{cfg.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Parties & Property</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Landlord / Agent Name *</label>
                <input value={landlordName} onChange={e => setLandlordName(e.target.value)} placeholder="Your name or agency" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Tenant Name *</label>
                <input value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="Tenant's full name" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                <input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Full address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Pet Details</h2>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Pet type *</label>
                  <input value={petType} onChange={e => setPetType(e.target.value)} placeholder="e.g. Dog" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Breed</label>
                  <input value={petBreed} onChange={e => setPetBreed(e.target.value)} placeholder="e.g. Labrador" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Name</label>
                  <input value={petName} onChange={e => setPetName(e.target.value)} placeholder="e.g. Buddy" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
            </div>

            {decision === "approve-conditions" && (
              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <h2 className="font-bold text-navy-800 mb-1">Conditions</h2>
                <p className="text-xs text-navy-400 mb-3">Edit the conditions as needed — one per line</p>
                <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows={7} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
              </div>
            )}

            {decision === "refuse" && (
              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <h2 className="font-bold text-navy-800 mb-1">Reason for Refusal *</h2>
                <p className="text-xs text-navy-400 mb-3">Under the Renters' Rights Act, refusal must be reasonable and specific</p>
                <textarea value={refusalReason} onChange={e => setRefusalReason(e.target.value)} rows={4}
                  placeholder="e.g. The property is located on the third floor of a purpose-built block of flats. The lease for the building prohibits animals, and this restriction is enforceable by the freeholder..."
                  className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
              </div>
            )}

            <button onClick={() => setMode("preview")} className="w-full btn-gold">Preview Letter →</button>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="bg-white rounded-2xl border border-navy-100 p-10" style={{ fontFamily: "Georgia, serif" }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>{landlordName || "_______________"}</p>
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{fmt(issueDate)}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: "#374151" }}>{tenantName || "_______________"}</p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>{propertyAddress || "_______________"}</p>
              </div>

              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>
                Re: Request to keep a pet at {propertyAddress || "the above property"}
              </p>

              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>Dear {tenantName || "Tenant"},</p>

              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 16 }}>
                Thank you for your request to keep {petName ? `${petName}, ` : ""}a{petBreed ? ` ${petBreed}` : ""} {petType || "pet"} at the above property. I have given this request careful consideration.
              </p>

              {decision === "approve" && (
                <>
                  <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", marginBottom: 4 }}>✅ Permission Granted</p>
                    <p style={{ fontSize: 12, color: "#374151" }}>I am pleased to confirm that you have my permission to keep the above-described pet at the property.</p>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
                    <p style={{ marginBottom: 12 }}>Please note that you remain responsible for any damage caused to the property by the pet, and the property should be returned in the same condition as at the commencement of the tenancy, with allowance only for fair wear and tear.</p>
                    <p>Permission applies to the named pet only. Any additional animals must be approved separately in writing.</p>
                  </div>
                </>
              )}

              {decision === "approve-conditions" && (
                <>
                  <div style={{ background: "#fffbeb", border: "1.5px solid #fcd34d", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#d97706", marginBottom: 4 }}>⚠️ Permission Granted — Subject to Conditions</p>
                    <p style={{ fontSize: 12, color: "#374151" }}>I am prepared to grant permission for the pet, subject to the following conditions which must be observed throughout the tenancy.</p>
                  </div>
                  <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
                    {conditions.split("\n").filter(Boolean).map((c, i) => (
                      <p key={i} style={{ marginBottom: 6 }}>{c}</p>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>Please sign and return a copy of this letter to confirm your agreement to these conditions. Breach of any condition may be treated as a breach of the tenancy agreement.</p>
                </>
              )}

              {decision === "refuse" && (
                <>
                  <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#dc2626", marginBottom: 4 }}>❌ Permission Refused</p>
                    <p style={{ fontSize: 12, color: "#374151" }}>After careful consideration, I am unable to grant permission for the pet at this property. The reason is set out below.</p>
                  </div>
                  <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
                    {refusalReason || "_______________"}
                  </div>
                  <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>If you disagree with this decision, you may refer the matter to the Private Rented Sector Ombudsman or seek independent legal advice. I am willing to reconsider if circumstances change.</p>
                </>
              )}

              <SignatureBlock
                signerLabel="Signed (Landlord / Agent)"
                signerName={landlordName}
                witnessLabel={decision === "approve-conditions" ? "Tenant acknowledgement" : "Witness"}
                showWitness={true}
                date={issueDate}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit</button>
              <ShareToolbar docTitle="Pet Permission Letter" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}





