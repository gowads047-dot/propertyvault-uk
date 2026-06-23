"use client";

import { useState } from "react";
import { SignatureBlock, ShareToolbar } from "@/components/SignatureBlock";

export default function ReferenceRequest() {
  const [mode, setMode] = useState<"form" | "preview">("form");
  const [type, setType] = useState<"employer" | "landlord">("employer");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [landlordEmail, setLandlordEmail] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [applicantDob, setApplicantDob] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [refereeName, setRefereeName] = useState("");
  const [refereeCompany, setRefereeCompany] = useState("");
  const [responseDeadline, setResponseDeadline] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Tenancy Reference Request</h1>
          <p className="text-navy-200 max-w-2xl">Professional reference request letters for employers and previous landlords. Switch between types using the toggle below.</p>
        </div>
      </section>

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
              <h2 className="font-bold text-navy-800 mb-3">Reference Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {([["employer", "👔 Employer Reference", "Confirm employment, income, and job stability"], ["landlord", "🏠 Previous Landlord Reference", "Confirm rental history, conduct, and arrears"]] as const).map(([val, label, desc]) => (
                  <div key={val} onClick={() => setType(val)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${type === val ? "bg-navy-800 border-navy-800" : "border-navy-100 hover:border-navy-300"}`}>
                    <p className={`font-bold text-sm ${type === val ? "text-white" : "text-navy-800"}`}>{label}</p>
                    <p className={`text-xs mt-1 ${type === val ? "text-navy-200" : "text-navy-400"}`}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Your Details (Landlord sending the request)</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Your Name / Agency *</label>
                <input value={landlordName} onChange={e => setLandlordName(e.target.value)} placeholder="Full name or agency name" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Your Address</label>
                <textarea value={landlordAddress} onChange={e => setLandlordAddress(e.target.value)} rows={2} placeholder="Correspondence address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Your Email</label>
                <input type="email" value={landlordEmail} onChange={e => setLandlordEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Referee (Person You Are Writing To)</h2>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Referee Name</label>
                <input value={refereeName} onChange={e => setRefereeName(e.target.value)} placeholder={type === "employer" ? "HR Manager / Line Manager name" : "Previous landlord name"} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">{type === "employer" ? "Company / Organisation" : "Property Management Company / Agency"}</label>
                <input value={refereeCompany} onChange={e => setRefereeCompany(e.target.value)} placeholder={type === "employer" ? "Employer company name" : "Landlord / agency name"} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Response Requested By</label>
                <input type="date" value={responseDeadline} onChange={e => setResponseDeadline(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
            </div>

            <div className="bg-white rounded-2xl border border-navy-100 p-6 space-y-4">
              <h2 className="font-bold text-navy-800">Applicant Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Applicant Full Name *</label>
                  <input value={applicantName} onChange={e => setApplicantName(e.target.value)} placeholder="As on application" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Date of Birth</label>
                  <input type="date" value={applicantDob} onChange={e => setApplicantDob(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-navy-700 mb-1">Property to Let *</label>
                <input value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} placeholder="Full address" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Proposed Move-In Date</label>
                  <input type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rent (£)</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">£</span>
                    <input value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} placeholder="0" className="w-full pl-7 pr-3 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" /></div></div>
              </div>
            </div>

            <button onClick={() => setMode("preview")} className="w-full btn-gold">Preview Letter →</button>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="bg-white rounded-2xl border border-navy-100 p-10" style={{ fontFamily: "Georgia, serif" }}>
              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 12, color: "#374151" }}>{landlordName || "_______________"}</p>
                {landlordAddress && <p style={{ fontSize: 11, color: "#6b7280", whiteSpace: "pre-line" }}>{landlordAddress}</p>}
                {landlordEmail && <p style={{ fontSize: 11, color: "#6b7280" }}>{landlordEmail}</p>}
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>{fmt(issueDate)}</p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 12, color: "#374151" }}>{refereeName || (type === "employer" ? "The HR Manager" : "The Landlord / Managing Agent")}</p>
                {refereeCompany && <p style={{ fontSize: 11, color: "#6b7280" }}>{refereeCompany}</p>}
              </div>

              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f1b36", marginBottom: 16 }}>
                {type === "employer"
                  ? `Re: Employment Reference — ${applicantName || "_______________"}`
                  : `Re: Landlord Reference — ${applicantName || "_______________"}`}
              </p>

              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 14 }}>Dear {refereeName || (type === "employer" ? "Sir/Madam" : "Sir/Madam")},</p>

              {type === "employer" ? (
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
                  <p style={{ marginBottom: 12 }}>I am writing to request an employment reference for <strong>{applicantName || "_______________"}</strong>{applicantDob ? ` (date of birth: ${fmt(applicantDob)})` : ""}, who has applied to rent residential accommodation from me.</p>
                  <p style={{ marginBottom: 12 }}>The property is located at <strong>{propertyAddress || "_______________"}</strong>{monthlyRent ? `, with a monthly rent of £${monthlyRent}` : ""}. The proposed tenancy commencement date is <strong>{fmt(moveInDate)}</strong>.</p>
                  <p style={{ marginBottom: 12 }}>I would be grateful if you could confirm the following information:</p>
                  <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    {[
                      "The applicant's current employment status (full-time/part-time/contract/self-employed)",
                      "The applicant's gross annual salary or equivalent earnings",
                      "Length of current employment",
                      "Whether the position is permanent, fixed-term, or probationary",
                      "Whether there are any concerns about the applicant's financial reliability or character that you believe are relevant",
                      "Whether you would re-employ this person if the opportunity arose",
                    ].map((q, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: "#c9a84c", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                  <p>Please note that the applicant has consented to this reference check. Any information provided will be treated in strict confidence and used solely for the purpose of assessing suitability for the tenancy.</p>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
                  <p style={{ marginBottom: 12 }}>I am writing to request a landlord reference for <strong>{applicantName || "_______________"}</strong>{applicantDob ? ` (date of birth: ${fmt(applicantDob)})` : ""}, who has applied to rent residential accommodation from me at <strong>{propertyAddress || "_______________"}</strong>.</p>
                  <p style={{ marginBottom: 12 }}>I understand the applicant was a tenant in one of your properties. I would be very grateful if you could confirm the following:</p>
                  <div style={{ background: "#f5f2ec", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    {[
                      "The address of the property tenanted and the dates of the tenancy",
                      "Whether rent was paid on time throughout the tenancy",
                      "The amount of any rent arrears — if any — and whether they were resolved",
                      "Whether the property was returned in good condition, and whether any deposit deductions were made",
                      "Whether there were any complaints or reports of antisocial behaviour",
                      "Whether you would rent to this person again",
                    ].map((q, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: "#c9a84c", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                  <p>The applicant has consented to this check. Your response will be treated in the strictest confidence.</p>
                </div>
              )}

              {responseDeadline && (
                <p style={{ fontSize: 12, color: "#374151", marginBottom: 16 }}>
                  I would be grateful to receive your response by <strong>{fmt(responseDeadline)}</strong>. If you prefer to respond by email, please use {landlordEmail || "_______________"}.
                </p>
              )}

              <p style={{ fontSize: 12, color: "#374151", marginBottom: 24 }}>Thank you for your time and assistance.</p>

              <p style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>Yours faithfully,</p>
              <div style={{ borderBottom: "1.5px solid #0f1b36", height: 40, maxWidth: 220, marginBottom: 6 }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36" }}>{landlordName || "_______________"}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit</button>
              <ShareToolbar docTitle="Reference Request" onPrint={() => window.print()} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}





