"use client";

import { useState } from "react";
import Link from "next/link";

export default function RentersRightsNotice() {
  const [landlordName, setLandlordName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenancyStart, setTenancyStart] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [monthlyRent, setMonthlyRent] = useState("");
  const [depositScheme, setDepositScheme] = useState("DPS");
  const [depositRef, setDepositRef] = useState("");
  const [ombudsmanRef, setOmbudsmanRef] = useState("");
  const [mode, setMode] = useState<"form" | "preview">("form");

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "_______________";

  const DocSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ background: "#0f1b36", color: "white", padding: "6px 12px", borderRadius: 4, marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</p>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: "#6b7280", minWidth: 180, flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#0f1b36", borderBottom: "1px solid #e5e7eb", flex: 1 }}>{value || "—"}</span>
    </div>
  );

  const Right = ({ n, title, body }: { n: string; title: string; body: string }) => (
    <div style={{ display: "flex", gap: 12, marginBottom: 14, pageBreakInside: "avoid" }}>
      <div style={{ width: 24, height: 24, background: "#c9a84c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#0f1b36" }}>{n}</span>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", marginBottom: 2 }}>{title}</p>
        <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{body}</p>
      </div>
    </div>
  );

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
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Template</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Tenant Rights Notice</h1>
          <p className="text-navy-200 max-w-2xl">A formal notice landlords issue to tenants explaining their key rights under the Renters' Rights Act 2025. Fill in the details, preview, and print.</p>
        </div>
      </section>

      {/* Mode toggle */}
      <div className="border-b border-navy-100 bg-white sticky top-0 z-10">
        <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-navy-50 rounded-xl p-1">
            {(["form", "preview"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-800"}`}>
                {m === "form" ? "✏️ Fill in details" : "👁 Preview document"}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 200); }}
              className="btn-primary text-sm">🖨️ Print / Save PDF</button>
          </div>
        </div>
      </div>

      {mode === "form" ? (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div className="bg-white rounded-2xl border border-navy-100 p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-800 mb-4">Property & Tenancy Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-1">Property Address *</label>
                    <input type="text" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)}
                      placeholder="e.g. 12 Oak Street, Birmingham, B1 2AB"
                      className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-700 mb-1">Tenancy Start Date *</label>
                      <input type="date" value={tenancyStart} onChange={e => setTenancyStart(e.target.value)}
                        className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-700 mb-1">Notice Issue Date *</label>
                      <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)}
                        className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-1">Monthly Rent (£)</label>
                    <input type="text" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)}
                      placeholder="e.g. 950"
                      className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-navy-800 mb-4">Landlord Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Landlord / Agent Name *</label>
                  <input type="text" value={landlordName} onChange={e => setLandlordName(e.target.value)}
                    placeholder="Your full name or company name"
                    className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-navy-700 mb-1">PRS Ombudsman Reference (if registered)</label>
                  <input type="text" value={ombudsmanRef} onChange={e => setOmbudsmanRef(e.target.value)}
                    placeholder="e.g. PRO-2025-XXXXX"
                    className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-navy-800 mb-4">Tenant Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Tenant Name(s) *</label>
                  <input type="text" value={tenantName} onChange={e => setTenantName(e.target.value)}
                    placeholder="Full name(s) of all tenants"
                    className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-navy-800 mb-4">Deposit Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-1">Deposit Scheme</label>
                    <select value={depositScheme} onChange={e => setDepositScheme(e.target.value)}
                      className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white">
                      <option>DPS</option>
                      <option>MyDeposits</option>
                      <option>TDS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-1">Deposit Reference Number</label>
                    <input type="text" value={depositRef} onChange={e => setDepositRef(e.target.value)}
                      placeholder="Scheme reference"
                      className="w-full px-4 py-3 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                </div>
              </div>

              <button onClick={() => setMode("preview")} className="w-full btn-gold">
                Preview Document →
              </button>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">📋 What this document covers</p>
              <p>This notice summarises the tenant's key rights under the Renters' Rights Act 2025: security of tenure, rent increase rules, repair timescales, pet ownership, deposit protection, the PRS Ombudsman, and how to raise a complaint. It is best practice to issue this at the start of every tenancy.</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-cream">
          <div className="container-max max-w-2xl">
            <div id="print-doc" className="bg-white rounded-2xl border border-navy-100 p-10" style={{ fontFamily: "Georgia, serif" }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #0f1b36" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Official Notice</p>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f1b36", lineHeight: 1.1, margin: 0, fontFamily: "Georgia, serif" }}>
                    Tenant Rights Notice
                  </h1>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Renters' Rights Act 2025 — England</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>Date issued</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36" }}>{fmt(issueDate)}</p>
                </div>
              </div>

              {/* Parties */}
              <DocSection title="Property & Tenancy">
                <Row label="Property address" value={propertyAddress} />
                <Row label="Tenant(s)" value={tenantName} />
                <Row label="Landlord / Agent" value={landlordName} />
                <Row label="Tenancy start date" value={fmt(tenancyStart)} />
                {monthlyRent && <Row label="Monthly rent" value={`£${monthlyRent}`} />}
                {ombudsmanRef && <Row label="PRS Ombudsman ref." value={ombudsmanRef} />}
              </DocSection>

              {/* Intro */}
              <div style={{ background: "#f5f2ec", borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
                This notice is issued to confirm your rights as a tenant under the <strong>Renters' Rights Act 2025</strong>. This Act significantly strengthened the protections available to tenants in the private rented sector in England. Please read this notice carefully and keep it for your records.
              </div>

              {/* Your Rights */}
              <DocSection title="Your Rights Under the Renters' Rights Act 2025">
                <Right n="1" title="Security of Tenure — No More No-Fault Evictions"
                  body="Your landlord cannot ask you to leave simply because they want the property back. Section 21 'no-fault' eviction notices have been abolished. Your landlord can only seek possession using Section 8, which requires a specific legal reason (such as significant rent arrears or antisocial behaviour). You have the right to remain in your home as long as you meet your obligations under the tenancy." />

                <Right n="2" title="Rolling Periodic Tenancy — No Fixed Term"
                  body="Your tenancy has no fixed end date. It continues on a rolling month-to-month basis unless you choose to end it or your landlord successfully obtains a court order for possession. You may end your tenancy at any time by giving your landlord 2 months' written notice." />

                <Right n="3" title="Rent Increases — Maximum Once Per Year"
                  body="Your landlord may only increase your rent once in any 12-month period. Any increase must be proposed using a formal Section 13 notice, with at least 2 months' written notice before it takes effect. The increase must reflect open market rents. You have the right to challenge any proposed rent increase through the First-tier Tribunal (Property Chamber) if you believe it is above the market rate." />

                <Right n="4" title="No Rental Bidding Wars"
                  body="Your landlord and any letting agent are prohibited from inviting or accepting offers above the advertised asking rent. The rent stated in your tenancy agreement must be the rent as advertised. You cannot be asked to outbid other applicants." />

                <Right n="5" title="Right to Request a Pet"
                  body="You have the right to request permission to keep a pet at the property. Your landlord must respond to your request in writing within 28 days. They may only refuse on reasonable grounds. A blanket 'no pets' policy is no longer enforceable. If permitted, your landlord may require you to take out pet damage insurance as a condition." />

                <Right n="6" title="Right to Prompt Repairs"
                  body="Under Awaab's Law (extended to private rented properties), your landlord must investigate and begin fixing any reported hazard — including damp, mould, or heating failure — within set timescales. Emergency hazards must be addressed within 24 hours. Non-emergency hazards must be investigated within 14 days. You should always report repairs in writing and keep copies." />

                <Right n="7" title="Deposit Protection"
                  body={`Your deposit is protected in a government-approved scheme: ${depositScheme}${depositRef ? ` (reference: ${depositRef})` : ""}. You have the right to receive your full deposit back at the end of the tenancy, minus any deductions agreed in writing or ruled by an adjudicator. You can challenge any unfair deductions through your deposit scheme's free dispute resolution service.`} />

                <Right n="8" title="Maximum Deposit — 5 Weeks' Rent"
                  body="Your landlord cannot hold a deposit of more than 5 weeks' rent (or 6 weeks where annual rent exceeds £50,000). Any deposit held above this cap must be returned to you." />

                <Right n="9" title="Advance Rent — Maximum One Month"
                  body="Your landlord was not permitted to require more than one month's rent in advance before this tenancy began. If you were asked to pay more than one month's advance rent, you may have grounds to recover the overpayment." />

                <Right n="10" title="Right to Complain to the PRS Ombudsman"
                  body="Your landlord is required by law to be a member of the Private Rented Sector Ombudsman. If you have a complaint about your landlord that cannot be resolved directly, you have the right to refer it to the Ombudsman free of charge. The Ombudsman can require your landlord to take action and may award you compensation." />
              </DocSection>

              {/* How to raise issues */}
              <DocSection title="How to Raise a Complaint or Dispute">
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
                  <p style={{ marginBottom: 8 }}><strong>Step 1 — Contact your landlord in writing:</strong> Always put complaints and repair requests in writing (email is acceptable). Keep copies of all correspondence.</p>
                  <p style={{ marginBottom: 8 }}><strong>Step 2 — If unresolved, contact the PRS Ombudsman:</strong> If your landlord does not respond or resolve the issue within a reasonable time, you can refer your complaint to the PRS Ombudsman at <strong>www.prsombudsman.gov.uk</strong>.</p>
                  <p style={{ marginBottom: 8 }}><strong>Step 3 — Contact your local council:</strong> Your local council's housing enforcement team can inspect the property and take enforcement action against your landlord if there are serious hazards or legal breaches.</p>
                  <p><strong>Rent disputes:</strong> If you wish to challenge a rent increase, apply to the First-tier Tribunal (Property Chamber) at <strong>www.gov.uk/find-a-tribunal</strong> before the increase takes effect.</p>
                </div>
              </DocSection>

              {/* Key contacts */}
              <DocSection title="Useful Contacts">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  {[
                    ["PRS Ombudsman", "www.prsombudsman.gov.uk"],
                    ["Deposit Protection Service (DPS)", "www.depositprotection.com"],
                    ["MyDeposits", "www.mydeposits.co.uk"],
                    ["Tenancy Deposit Scheme (TDS)", "www.tenancydepositscheme.com"],
                    ["First-tier Tribunal (rent disputes)", "www.gov.uk/find-a-tribunal"],
                    ["Citizens Advice (housing)", "www.citizensadvice.org.uk"],
                    ["Shelter (housing charity)", "www.shelter.org.uk / 0808 800 4444"],
                    ["Gov.uk renter guidance", "www.gov.uk/private-renting"],
                  ].map(([label, val]) => (
                    <div key={label as string} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <p style={{ color: "#6b7280", fontSize: 11 }}>{label}</p>
                      <p style={{ color: "#0f1b36", fontWeight: 600 }}>{val}</p>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* Signature */}
              <DocSection title="Confirmation">
                <p style={{ fontSize: 12, color: "#374151", marginBottom: 20, lineHeight: 1.7 }}>
                  By signing below, both parties confirm that this notice has been provided to the tenant(s) at the commencement of the tenancy and that its contents have been explained or made available for review.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Landlord / Agent signature</p>
                    <div style={{ borderBottom: "1.5px solid #0f1b36", height: 36, marginBottom: 6 }} />
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36" }}>{landlordName || "_______________"}</p>
                    <p style={{ fontSize: 11, color: "#6b7280" }}>Date: {fmt(issueDate)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Tenant signature</p>
                    <div style={{ borderBottom: "1.5px solid #0f1b36", height: 36, marginBottom: 6 }} />
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0f1b36" }}>{tenantName || "_______________"}</p>
                    <p style={{ fontSize: 11, color: "#6b7280" }}>Date: _______________</p>
                  </div>
                </div>
              </DocSection>

              {/* Footer */}
              <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 10, color: "#9ca3af" }}>Generated via PropertyVault UK · propertyplatform.vercel.app</p>
                <p style={{ fontSize: 10, color: "#9ca3af" }}>Renters' Rights Act 2025 · England only · For information purposes</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setMode("form")} className="btn-outline text-sm">← Edit details</button>
              <button onClick={() => window.print()} className="btn-primary text-sm">🖨️ Print / Save as PDF</button>
              <Link href="/blog/renters-rights-act" className="btn-secondary text-sm">Read the full guide →</Link>
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Note:</strong> This document is a summary for informational purposes. It does not constitute legal advice. The Renters' Rights Act 2025 is subject to ongoing secondary legislation. Always verify current requirements at gov.uk and seek professional legal advice for specific situations.
            </div>
          </div>
        </section>
      )}
    </>
  );
}
