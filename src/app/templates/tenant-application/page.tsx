"use client";

import { useState } from "react";
import { SignatureBlock } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter } from "@/components/PrintDoc";
import Link from "next/link";

// ── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 5 }}>{hint}</p>}
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "white", fontFamily: "inherit" }} />;
}
function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "white", fontFamily: "inherit", resize: "vertical" }} />;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", background: "white", fontFamily: "inherit" }}>
      <option value="">— Select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "0 16px" }}>{children}</div>;
}

// ── State type ────────────────────────────────────────────────────────────────
interface F {
  // Property
  propertyAddress: string; tenancyStart: string; tenancyLength: string; numOccupants: string; monthlyRent: string;
  // Applicant
  fullName: string; dob: string; email: string; phone: string; niNumber: string;
  currentAddress: string; timeAtAddress: string; currentLandlord: string; currentLandlordPhone: string; reasonMoving: string;
  // Employment
  employmentStatus: string; employerName: string; jobTitle: string; employmentStart: string; annualSalary: string; employerAddress: string; employerPhone: string;
  // References
  ref1Name: string; ref1Rel: string; ref1Phone: string; ref1Email: string;
  ref2Name: string; ref2Rel: string; ref2Phone: string; ref2Email: string;
  // Right to Rent
  nationality: string; rtrDocument: string; additionalNotes: string;
}

const EMPTY: F = {
  propertyAddress: "", tenancyStart: "", tenancyLength: "", numOccupants: "", monthlyRent: "",
  fullName: "", dob: "", email: "", phone: "", niNumber: "",
  currentAddress: "", timeAtAddress: "", currentLandlord: "", currentLandlordPhone: "", reasonMoving: "",
  employmentStatus: "", employerName: "", jobTitle: "", employmentStart: "", annualSalary: "", employerAddress: "", employerPhone: "",
  ref1Name: "", ref1Rel: "", ref1Phone: "", ref1Email: "",
  ref2Name: "", ref2Rel: "", ref2Phone: "", ref2Email: "",
  nationality: "", rtrDocument: "", additionalNotes: "",
};

const STEPS = ["Property", "Personal", "Employment", "References", "Declaration"];

export default function TenantApplicationTemplate() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<F>(EMPTY);
  const [mode, setMode] = useState<"form" | "preview">("form");

  const set = (k: keyof F) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const [refNum] = useState(() => `PV-TA-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`);

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-doc, #print-doc * { visibility: visible !important; }
          #print-doc { position: absolute; left: 0; top: 0; width: 100%; padding: 0; background: white; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <section className="no-print" style={{ background: "#0f1b36", padding: "32px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-max px-4" style={{ maxWidth: 900 }}>
          <Link href="/templates" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            ← All templates
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: "var(--gold-ink)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>👤 Landlord Template</p>
              <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, color: "white", margin: "4px 0" }}>Tenant Application Form</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Fill in the form · Preview the document · Print to PDF</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setMode("form"); }} className="no-print"
                style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: mode === "form" ? "white" : "transparent", color: mode === "form" ? "#0f1b36" : "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)", transition: "all 0.15s" }}>
                ✏️ Form
              </button>
              <button onClick={() => { setMode("preview"); }}
                style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: mode === "preview" ? "white" : "transparent", color: mode === "preview" ? "#0f1b36" : "rgba(255,255,255,0.6)", border: "1.5px solid rgba(255,255,255,0.2)", transition: "all 0.15s" }}>
                👁 Preview
              </button>
              <button onClick={() => { setMode("preview"); setTimeout(() => window.print(), 100); }}
                style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#c9a84c", color: "#0f1b36", border: "none", transition: "opacity 0.15s" }}>
                🖨 Print / PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM MODE ── */}
      {mode === "form" && (
        <section className="no-print" style={{ background: "#f8f9fc", padding: "40px 0 80px" }}>
          <div className="container-max px-4" style={{ maxWidth: 720 }}>

            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: 32, alignItems: "center" }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, flex: i < STEPS.length - 1 ? "1 1 auto" : "0 0 auto" }}>
                  <button onClick={() => setStep(i)}
                    style={{ width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, flexShrink: 0,
                      background: i < step ? "#16a34a" : i === step ? "#0f1b36" : "#e2e8f0",
                      color: i <= step ? "white" : "#94a3b8" }}>
                    {i < step ? "✓" : i + 1}
                  </button>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? "#16a34a" : "#e2e8f0", borderRadius: 2 }} />}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 24 }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>

            <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #e2e8f0", padding: "32px 28px" }}>

              {/* Step 0: Property */}
              {step === 0 && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>Property Details</h2>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>The property this application is for.</p>
                  <Field label="Property address *"><Textarea value={f.propertyAddress} onChange={set("propertyAddress")} placeholder="Full address including postcode" rows={2} /></Field>
                  <Grid>
                    <Field label="Proposed tenancy start *"><Input type="date" value={f.tenancyStart} onChange={set("tenancyStart")} /></Field>
                    <Field label="Tenancy length"><Select value={f.tenancyLength} onChange={set("tenancyLength")} options={["6 months", "12 months", "18 months", "24 months", "Rolling monthly"]} /></Field>
                    <Field label="Monthly rent (£) *"><Input value={f.monthlyRent} onChange={set("monthlyRent")} placeholder="e.g. 850" /></Field>
                    <Field label="Number of occupants *"><Input value={f.numOccupants} onChange={set("numOccupants")} placeholder="Including applicant" /></Field>
                  </Grid>
                </div>
              )}

              {/* Step 1: Personal */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>Personal Details</h2>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Applicant's personal information.</p>
                  <Grid>
                    <Field label="Full legal name *"><Input value={f.fullName} onChange={set("fullName")} placeholder="As on passport/ID" /></Field>
                    <Field label="Date of birth *"><Input type="date" value={f.dob} onChange={set("dob")} /></Field>
                    <Field label="Email address *"><Input type="email" value={f.email} onChange={set("email")} placeholder="your@email.com" /></Field>
                    <Field label="Mobile number *"><Input type="tel" value={f.phone} onChange={set("phone")} placeholder="+44 7..." /></Field>
                  </Grid>
                  <Field label="National Insurance number" hint="Used for referencing purposes only"><Input value={f.niNumber} onChange={set("niNumber")} placeholder="AB 12 34 56 C" /></Field>
                  <Field label="Current address *"><Textarea value={f.currentAddress} onChange={set("currentAddress")} placeholder="Full address including postcode" rows={2} /></Field>
                  <Grid>
                    <Field label="Time at current address"><Input value={f.timeAtAddress} onChange={set("timeAtAddress")} placeholder="e.g. 2 years 4 months" /></Field>
                    <Field label="Current landlord / agent"><Input value={f.currentLandlord} onChange={set("currentLandlord")} placeholder="Name" /></Field>
                    <Field label="Landlord phone"><Input type="tel" value={f.currentLandlordPhone} onChange={set("currentLandlordPhone")} placeholder="+44..." /></Field>
                    <Field label="Reason for moving"><Input value={f.reasonMoving} onChange={set("reasonMoving")} placeholder="Brief reason" /></Field>
                  </Grid>
                </div>
              )}

              {/* Step 2: Employment */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>Employment & Income</h2>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Your current employment situation.</p>
                  <Field label="Employment status *">
                    <Select value={f.employmentStatus} onChange={set("employmentStatus")} options={["Employed full-time", "Employed part-time", "Self-employed", "Director / Company owner", "Retired", "Student", "Unemployed", "Other"]} />
                  </Field>
                  <Grid>
                    <Field label="Employer / Company name"><Input value={f.employerName} onChange={set("employerName")} placeholder="Current employer" /></Field>
                    <Field label="Job title"><Input value={f.jobTitle} onChange={set("jobTitle")} placeholder="Your role" /></Field>
                    <Field label="Employment start date"><Input type="date" value={f.employmentStart} onChange={set("employmentStart")} /></Field>
                    <Field label="Annual gross salary (£)"><Input value={f.annualSalary} onChange={set("annualSalary")} placeholder="Before tax" /></Field>
                  </Grid>
                  <Field label="Employer address"><Textarea value={f.employerAddress} onChange={set("employerAddress")} placeholder="Company address" rows={2} /></Field>
                  <Field label="Employer phone / HR contact"><Input type="tel" value={f.employerPhone} onChange={set("employerPhone")} placeholder="For reference checks" /></Field>
                </div>
              )}

              {/* Step 3: References */}
              {step === 3 && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>References</h2>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Two references are required. At least one should be a previous landlord or employer.</p>
                  <div style={{ padding: "16px", background: "#f8f9fc", borderRadius: 12, marginBottom: 20 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>Reference 1</p>
                    <Grid>
                      <Field label="Full name *"><Input value={f.ref1Name} onChange={set("ref1Name")} placeholder="Reference name" /></Field>
                      <Field label="Relationship"><Input value={f.ref1Rel} onChange={set("ref1Rel")} placeholder="e.g. Previous landlord" /></Field>
                      <Field label="Phone"><Input type="tel" value={f.ref1Phone} onChange={set("ref1Phone")} /></Field>
                      <Field label="Email"><Input type="email" value={f.ref1Email} onChange={set("ref1Email")} /></Field>
                    </Grid>
                  </div>
                  <div style={{ padding: "16px", background: "#f8f9fc", borderRadius: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>Reference 2</p>
                    <Grid>
                      <Field label="Full name *"><Input value={f.ref2Name} onChange={set("ref2Name")} placeholder="Reference name" /></Field>
                      <Field label="Relationship"><Input value={f.ref2Rel} onChange={set("ref2Rel")} placeholder="e.g. Employer" /></Field>
                      <Field label="Phone"><Input type="tel" value={f.ref2Phone} onChange={set("ref2Phone")} /></Field>
                      <Field label="Email"><Input type="email" value={f.ref2Email} onChange={set("ref2Email")} /></Field>
                    </Grid>
                  </div>
                </div>
              )}

              {/* Step 4: Declaration */}
              {step === 4 && (
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>Right to Rent & Declaration</h2>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Right to Rent checks are a legal requirement under the Immigration Act 2014.</p>
                  <Grid>
                    <Field label="Nationality"><Input value={f.nationality} onChange={set("nationality")} placeholder="Country of citizenship" /></Field>
                    <Field label="Right to Rent document">
                      <Select value={f.rtrDocument} onChange={set("rtrDocument")} options={["UK/Irish Passport", "EU Settlement Scheme (settled)", "EU Settlement Scheme (pre-settled)", "Biometric Residence Permit (BRP)", "Visa / entry clearance", "Home Office digital share code", "Other"]} />
                    </Field>
                  </Grid>
                  <Field label="Additional notes or special circumstances" hint="Optional">
                    <Textarea value={f.additionalNotes} onChange={set("additionalNotes")} placeholder="Any other information the landlord should know" />
                  </Field>
                  <div style={{ padding: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, marginTop: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>Declaration</p>
                    <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
                      By proceeding, the applicant declares that all information provided is true and accurate to the best of their knowledge. The applicant consents to the landlord conducting credit, employment, and reference checks and contacting the references provided. The applicant understands that providing false information may result in the application being rejected or, if a tenancy has commenced, constitute grounds for possession.
                    </p>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>A signature line is included in the printed document. Click "Preview" then "Print / PDF" to generate.</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button onClick={() => step > 0 ? setStep(s => s - 1) : undefined}
                style={{ padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: step === 0 ? "not-allowed" : "pointer", background: step === 0 ? "#f1f5f9" : "white", color: step === 0 ? "#94a3b8" : "#0f1b36", border: "1.5px solid #e2e8f0" }}>
                ← Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)}
                  style={{ padding: "10px 28px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#0f1b36", color: "white", border: "none" }}>
                  Next →
                </button>
              ) : (
                <button onClick={() => setMode("preview")}
                  style={{ padding: "10px 28px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#c9a84c", color: "#0f1b36", border: "none" }}>
                  Preview Document →
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── DOCUMENT PREVIEW ── */}
      {mode === "preview" && (
        <section style={{ background: "#e8ecf0", padding: "32px 16px 64px" }}>
          <div className="no-print" style={{ maxWidth: 800, margin: "0 auto 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setMode("form")} style={{ fontSize: 13, fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>← Edit form</button>
            <button onClick={() => window.print()} style={{ padding: "10px 24px", background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              🖨 Print / Save as PDF
            </button>
          </div>

          {/* The actual document */}
          <div id="print-doc" style={{ maxWidth: 800, margin: "0 auto", background: "white", fontFamily: "Arial, Helvetica, sans-serif", color: "#1a1a1a", lineHeight: 1.6, padding: "40px" }}>
            <PrintHeader
              category="Tenancy Administration · Residential Tenancy"
              title="Tenant Application Form"
              reference={refNum}
              date={today}
            />
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>This form must be completed in full. All information will be treated in confidence and used solely for the purpose of assessing this application.</p>

            <div style={{ padding: "0 40px 40px" }}>

              {/* Section 1: Property */}
              <DocSection title="1. Property Details">
                <DocRow label="Property Address" value={f.propertyAddress || "—"} />
                <DocRow label="Proposed Tenancy Start" value={f.tenancyStart ? new Date(f.tenancyStart).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"} />
                <DocRow label="Tenancy Length" value={f.tenancyLength || "—"} />
                <DocRow label="Monthly Rent" value={f.monthlyRent ? `£${parseInt(f.monthlyRent).toLocaleString()}` : "—"} />
                <DocRow label="Number of Occupants" value={f.numOccupants || "—"} />
              </DocSection>

              {/* Section 2: Personal */}
              <DocSection title="2. Applicant Personal Details">
                <DocRow label="Full Legal Name" value={f.fullName || "—"} />
                <DocRow label="Date of Birth" value={f.dob ? new Date(f.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"} />
                <DocRow label="Email Address" value={f.email || "—"} />
                <DocRow label="Mobile Number" value={f.phone || "—"} />
                <DocRow label="National Insurance No." value={f.niNumber || "—"} />
                <DocRow label="Current Address" value={f.currentAddress || "—"} />
                <DocRow label="Time at Current Address" value={f.timeAtAddress || "—"} />
                <DocRow label="Current Landlord / Agent" value={f.currentLandlord || "—"} />
                <DocRow label="Landlord Contact" value={f.currentLandlordPhone || "—"} />
                <DocRow label="Reason for Moving" value={f.reasonMoving || "—"} />
              </DocSection>

              {/* Section 3: Employment */}
              <DocSection title="3. Employment & Income">
                <DocRow label="Employment Status" value={f.employmentStatus || "—"} />
                <DocRow label="Employer / Company" value={f.employerName || "—"} />
                <DocRow label="Job Title" value={f.jobTitle || "—"} />
                <DocRow label="Employment Start Date" value={f.employmentStart ? new Date(f.employmentStart).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"} />
                <DocRow label="Annual Gross Salary" value={f.annualSalary ? `£${parseInt(f.annualSalary).toLocaleString()}` : "—"} />
                <DocRow label="Employer Address" value={f.employerAddress || "—"} />
                <DocRow label="Employer Phone" value={f.employerPhone || "—"} />
              </DocSection>

              {/* Section 4: References */}
              <DocSection title="4. References">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                  <div>
                    <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, marginTop: 12 }}>Reference 1</p>
                    <DocRow label="Name" value={f.ref1Name || "—"} />
                    <DocRow label="Relationship" value={f.ref1Rel || "—"} />
                    <DocRow label="Phone" value={f.ref1Phone || "—"} />
                    <DocRow label="Email" value={f.ref1Email || "—"} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, marginTop: 12 }}>Reference 2</p>
                    <DocRow label="Name" value={f.ref2Name || "—"} />
                    <DocRow label="Relationship" value={f.ref2Rel || "—"} />
                    <DocRow label="Phone" value={f.ref2Phone || "—"} />
                    <DocRow label="Email" value={f.ref2Email || "—"} />
                  </div>
                </div>
              </DocSection>

              {/* Section 5: Right to Rent */}
              <DocSection title="5. Right to Rent">
                <DocRow label="Nationality" value={f.nationality || "—"} />
                <DocRow label="Document Provided" value={f.rtrDocument || "—"} />
                {f.additionalNotes && <DocRow label="Additional Notes" value={f.additionalNotes} />}
              </DocSection>

              {/* Declaration & Signature */}
              <div style={{ marginTop: 28, padding: "20px", border: "1px solid #e2e8f0", borderRadius: 4 }}>
                <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, color: "#0f1b36", marginBottom: 8 }}>DECLARATION</p>
                <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, color: "#374151", lineHeight: 1.65, marginBottom: 20 }}>
                  I declare that all information provided in this application is true, complete, and accurate to the best of my knowledge and belief. I understand that any false or misleading information may result in the rejection of this application or termination of any tenancy. I consent to the landlord/agent conducting credit and reference checks and contacting the persons named as references. I understand this application does not constitute an offer or agreement to let the property.
                </p>
                <SignatureBlock
                  signerLabel="Applicant Signature"
                  signerName={f.fullName}
                  witnessLabel="Witness"
                  showWitness={true}
                />
              </div>
              <PrintFooter docTitle="Tenant Application Form" note="Confidential · Data processed under UK GDPR" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ── Document sub-components ───────────────────────────────────────────────────
function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24, breakInside: "avoid" }}>
      <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10, marginBottom: 0 }}>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div style={{ border: "1px solid #e2e8f0", borderTop: "2px solid #0f1b36", padding: "4px 0" }}>
        {children}
      </div>
    </div>
  );
}

function DocRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ width: "38%", padding: "7px 14px", background: "#f8f9fc", flexShrink: 0 }}>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 600, color: "#374151" }}>{label}</p>
      </div>
      <div style={{ flex: 1, padding: "7px 14px" }}>
        <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#1a1a1a", whiteSpace: "pre-wrap" }}>{value}</p>
      </div>
    </div>
  );
}





