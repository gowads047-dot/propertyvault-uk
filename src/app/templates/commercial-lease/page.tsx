"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SignatureBlock } from "@/components/SignatureBlock";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "type" | "questionnaire" | "risks" | "output";

interface FormData {
  // Phase 1
  leaseType: string;

  // Property
  propertyAddress: string;
  titleNumber: string;
  wholeOrPart: string;
  floorArea: string;
  propertyType: string;
  epcRating: string;
  useClass: string;

  // Landlord
  landlordName: string;
  landlordCompany: string;
  landlordRegistered: string;
  landlordContact: string;

  // Tenant
  tenantName: string;
  tenantCompany: string;
  tenantRegistered: string;
  tenantContact: string;

  // Guarantor
  guarantorRequired: string;
  guarantorName: string;
  guarantorCompany: string;
  guarantorAddress: string;

  // Term
  commencementDate: string;
  contractualTerm: string;
  expiryDate: string;
  rentFreePeriod: string;
  fitOutPeriod: string;

  // Rent
  annualRent: string;
  paymentFrequency: string;
  vatApplicable: string;
  depositAmount: string;

  // Rent Review
  reviewType: string;
  reviewDates: string;
  reviewDirection: string;

  // Repair
  repairingObligation: string;
  scheduleOfCondition: string;

  // Insurance
  insuranceObligation: string;
  insuredRisks: string;

  // Service Charge
  serviceChargeApplicable: string;
  servicesIncluded: string;
  serviceChargeCap: string;
  excludedCosts: string;

  // Use
  permittedUse: string;

  // Alterations
  alterationsAllowed: string;

  // Alienation
  assignmentRights: string;
  sublettingRights: string;

  // Break
  tenantBreak: string;
  landlordBreak: string;
  mutualBreak: string;
  breakConditions: string;
  breakDate: string;

  // Security of Tenure
  insideAct1954: string;

  // Special
  specialClauses: string;

  // Document
  documentDate: string;
}

const EMPTY: FormData = {
  leaseType: "",
  propertyAddress: "", titleNumber: "", wholeOrPart: "whole", floorArea: "", propertyType: "", epcRating: "", useClass: "",
  landlordName: "", landlordCompany: "", landlordRegistered: "", landlordContact: "",
  tenantName: "", tenantCompany: "", tenantRegistered: "", tenantContact: "",
  guarantorRequired: "no", guarantorName: "", guarantorCompany: "", guarantorAddress: "",
  commencementDate: "", contractualTerm: "", expiryDate: "", rentFreePeriod: "", fitOutPeriod: "",
  annualRent: "", paymentFrequency: "quarterly", vatApplicable: "no", depositAmount: "",
  reviewType: "open market", reviewDates: "", reviewDirection: "upward only",
  repairingObligation: "full repairing", scheduleOfCondition: "no",
  insuranceObligation: "landlord insures", insuredRisks: "",
  serviceChargeApplicable: "no", servicesIncluded: "", serviceChargeCap: "", excludedCosts: "",
  permittedUse: "",
  alterationsAllowed: "internal only",
  assignmentRights: "with consent", sublettingRights: "with consent",
  tenantBreak: "no", landlordBreak: "no", mutualBreak: "no", breakConditions: "", breakDate: "",
  insideAct1954: "yes",
  specialClauses: "",
  documentDate: "",
};

const LEASE_TYPES = [
  { id: "FRI", label: "Full Repairing & Insuring Lease (FRI)", icon: "🏢" },
  { id: "IRI", label: "Internal Repairing Lease (IRI)", icon: "🏗️" },
  { id: "Office", label: "Office Lease", icon: "💼" },
  { id: "Retail", label: "Retail Lease", icon: "🛍️" },
  { id: "Industrial", label: "Industrial / Warehouse Lease", icon: "🏭" },
  { id: "Restaurant", label: "Restaurant / Café Lease", icon: "🍽️" },
  { id: "Licence", label: "Licence to Occupy", icon: "📋" },
  { id: "Tenancy at Will", label: "Tenancy at Will", icon: "🤝" },
  { id: "Agreement for Lease", label: "Agreement for Lease", icon: "✍️" },
  { id: "Underlease", label: "Underlease / Sublease", icon: "🔗" },
  { id: "Ground Lease", label: "Ground Lease", icon: "🌿" },
  { id: "Development Lease", label: "Development Lease", icon: "🏗️" },
  { id: "Contracted-Out", label: "Contracted-Out Lease (1954 Act excluded)", icon: "📝" },
  { id: "Protected", label: "Protected Lease (1954 Act)", icon: "🛡️" },
  { id: "Other", label: "Other Commercial Occupation Arrangement", icon: "📄" },
];

const SECTION_STEPS = [
  "Property",
  "Landlord",
  "Tenant",
  "Guarantor",
  "Lease Term",
  "Rent",
  "Rent Review",
  "Repairs",
  "Insurance",
  "Service Charge",
  "Permitted Use",
  "Alterations & Alienation",
  "Break Rights",
  "Security of Tenure",
  "Special Clauses",
];

// ─── Helper components ────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    // The label wraps the control rather than sitting beside it. As siblings
    // with no htmlFor nothing tied them together, so every field this helper
    // renders was announced with no name. The hint goes inside too: it becomes
    // part of the accessible name, which is more information rather than less.
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f1b36", marginBottom: 4 }}>{label}</span>
      {hint && <span style={{ display: "block", fontSize: 11, color: "#475569", marginBottom: 4 }}>{hint}</span>}
      {children}
    </label>
  );
}

const inputCls: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const selectCls: React.CSSProperties = { ...inputCls, background: "white" };

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputCls} />;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={selectCls}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputCls, resize: "vertical" }} />;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1.5px solid #e8eaf0", borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f1b36", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</h3>
      <div style={{ display: "grid", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Risk Analysis Generator ──────────────────────────────────────────────────

function generateRisks(f: FormData) {
  const high: string[] = [];
  const medium: string[] = [];
  const low: string[] = [];

  if (!f.titleNumber) medium.push("Title number not provided — title verification required before completion.");
  if (!f.epcRating) medium.push("EPC rating unknown — properties with EPC rating below E cannot be lawfully let (MEES Regulations 2018).");
  if (f.insideAct1954 === "no" || f.leaseType === "Contracted-Out") high.push("Lease excludes Landlord and Tenant Act 1954 security of tenure — contracting-out notice and statutory declaration required.");
  if (!f.permittedUse) high.push("Permitted use clause not defined — critical for planning, licensing, and insurance purposes.");
  if (f.guarantorRequired === "yes" && !f.guarantorName) medium.push("Guarantor required but details not provided — AML checks and solvency assessment required.");
  if (f.depositAmount && Number(f.depositAmount.replace(/[^0-9.]/g, "")) > 0) low.push("Deposit received — consider whether deposit protection or trust arrangements are required.");
  if (f.vatApplicable === "yes") medium.push("VAT applicable — confirm option to tax has been exercised on the property and advise tenant accordingly.");
  if (f.repairingObligation === "full repairing" && f.scheduleOfCondition === "no") high.push("Full repairing lease with no schedule of condition — tenant exposed to full dilapidations liability at lease end.");
  if (f.tenantBreak === "yes" || f.landlordBreak === "yes") medium.push("Break clause included — break conditions must be strictly complied with. Pre-break checklist essential.");
  if (f.leaseType === "Restaurant" || f.permittedUse?.toLowerCase().includes("restaurant") || f.permittedUse?.toLowerCase().includes("food")) {
    high.push("Food/restaurant use — requires planning consent (if change of use), environmental health registration, food hygiene compliance, and extraction/ventilation assessment.");
  }
  if (!f.serviceChargeApplicable || f.serviceChargeApplicable === "no") low.push("No service charge provisions — confirm landlord costs for common areas and building services are otherwise addressed.");
  if (Number(f.contractualTerm?.replace(/[^0-9.]/g, "")) >= 7) medium.push("Term of 7 years or more — Land Registry registration is mandatory. SDLT likely applies.");
  if (f.assignmentRights === "free") medium.push("Assignment permitted without consent — consider requiring minimum financial covenant test.");
  if (f.sublettingRights === "permitted") medium.push("Subletting permitted without consent — consider restrictions on type of undertenant and rent levels.");
  if (!f.insuredRisks) low.push("Insured risks not specified — define clearly to avoid gap in cover.");
  if (f.leaseType === "Ground Lease") high.push("Ground lease — title structure, development obligations, and rent review provisions require specialist solicitor input.");
  if (f.leaseType === "Agreement for Lease") medium.push("Agreement for lease — conditional completion provisions, longstop dates, and planning conditions must be carefully drafted.");

  return { high, medium, low };
}

// ─── Document Generators ─────────────────────────────────────────────────────

function genHeadsOfTerms(f: FormData): string {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `HEADS OF TERMS
Strictly Subject to Contract and Without Prejudice
Prepared: ${today}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PROPERTY

Address:           ${f.propertyAddress || "[ADDRESS TO BE CONFIRMED]"}
Title Number:      ${f.titleNumber || "[TO BE CONFIRMED]"}
Extent:            ${f.wholeOrPart === "whole" ? "Whole of the property" : "Part of the property as edged red on the plan"}
Floor Area:        ${f.floorArea || "[TO BE MEASURED AND CONFIRMED]"}
Property Type:     ${f.propertyType || "[TO BE CONFIRMED]"}
EPC Rating:        ${f.epcRating || "[TO BE CONFIRMED — MEES COMPLIANCE REQUIRED]"}
Existing Use:      ${f.useClass || "[TO BE CONFIRMED]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. PARTIES

LANDLORD:          ${f.landlordName || "[LANDLORD NAME]"}
                   ${f.landlordCompany ? `Company No: ${f.landlordCompany}` : ""}
                   ${f.landlordRegistered || "[REGISTERED OFFICE / ADDRESS]"}

TENANT:            ${f.tenantName || "[TENANT NAME]"}
                   ${f.tenantCompany ? `Company No: ${f.tenantCompany}` : ""}
                   ${f.tenantRegistered || "[REGISTERED OFFICE / ADDRESS]"}

GUARANTOR:         ${f.guarantorRequired === "yes" ? (f.guarantorName || "[GUARANTOR NAME — DETAILS TO BE PROVIDED]") : "None required"}
${f.guarantorRequired === "yes" ? `                   ${f.guarantorAddress || "[GUARANTOR ADDRESS]"}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. TERM

Document Type:     ${f.leaseType}
Commencement:      ${f.commencementDate ? new Date(f.commencementDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[TO BE AGREED]"}
Term:              ${f.contractualTerm || "[TO BE AGREED]"}
Expiry:            ${f.expiryDate ? new Date(f.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[TO BE CONFIRMED]"}
${f.rentFreePeriod ? `Rent-Free Period:  ${f.rentFreePeriod} (from commencement)` : ""}
${f.fitOutPeriod ? `Fit-Out Period:    ${f.fitOutPeriod} (during which no rent is payable)` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. RENT

Annual Rent:       ${f.annualRent ? `£${Number(f.annualRent.replace(/[^0-9.]/g, "")).toLocaleString("en-GB")} per annum exclusive` : "[TO BE AGREED]"}
Payment:           Payable ${f.paymentFrequency} in advance
VAT:               ${f.vatApplicable === "yes" ? "VAT is applicable — option to tax exercised" : "No VAT (subject to confirmation)"}
Deposit:           ${f.depositAmount ? `£${Number(f.depositAmount.replace(/[^0-9.]/g, "")).toLocaleString("en-GB")}` : "None / [TO BE AGREED]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. RENT REVIEW

Review Type:       ${f.reviewType}
Direction:         ${f.reviewDirection}
Review Dates:      ${f.reviewDates || "[TO BE SPECIFIED]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. REPAIRING OBLIGATIONS

Obligation:        ${f.repairingObligation}
Schedule of Condition: ${f.scheduleOfCondition === "yes" ? "Schedule of condition to be annexed — Tenant's liability limited accordingly" : "No schedule of condition — full liability applies"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. INSURANCE

Arrangement:       ${f.insuranceObligation}
${f.insuredRisks ? `Insured Risks:     ${f.insuredRisks}` : "Insured Risks:     [TO BE SPECIFIED]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. SERVICE CHARGE

Applicable:        ${f.serviceChargeApplicable === "yes" ? "Yes" : "No"}
${f.serviceChargeApplicable === "yes" ? `Services:          ${f.servicesIncluded || "[TO BE SPECIFIED]"}
Cap:               ${f.serviceChargeCap || "No cap agreed"}
Excluded Costs:    ${f.excludedCosts || "None specified"}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. PERMITTED USE

${f.permittedUse || "[LEGAL REVIEW REQUIRED — Permitted use must be precisely defined]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. ALTERATIONS

${f.alterationsAllowed === "none" ? "No alterations permitted without Landlord's written consent."
  : f.alterationsAllowed === "internal only" ? "Internal non-structural alterations permitted with Landlord's written consent. No structural alterations."
  : f.alterationsAllowed === "non-structural" ? "Non-structural alterations permitted with Landlord's written consent."
  : "Structural and non-structural alterations permitted with Landlord's written consent. Structural alterations subject to licence."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. ALIENATION

Assignment:        ${f.assignmentRights === "prohibited" ? "Prohibited" : f.assignmentRights === "with consent" ? "Permitted with Landlord's consent (not to be unreasonably withheld)" : "Permitted freely"}
Subletting:        ${f.sublettingRights === "prohibited" ? "Prohibited" : f.sublettingRights === "with consent" ? "Permitted with Landlord's consent (not to be unreasonably withheld)" : "Permitted freely"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. BREAK RIGHTS

Tenant Break:      ${f.tenantBreak === "yes" ? `Yes${f.breakDate ? ` — ${new Date(f.breakDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : " — [DATE TO BE AGREED]"}` : "None"}
Landlord Break:    ${f.landlordBreak === "yes" ? "Yes — [DATE TO BE AGREED]" : "None"}
Mutual Break:      ${f.mutualBreak === "yes" ? "Yes — [DATE TO BE AGREED]" : "None"}
${(f.tenantBreak === "yes" || f.landlordBreak === "yes" || f.mutualBreak === "yes") ? `Break Conditions:  ${f.breakConditions || "Full compliance with lease covenants, vacant possession, no arrears"}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. SECURITY OF TENURE

1954 Act:          ${f.insideAct1954 === "yes" ? "Lease included within the Landlord and Tenant Act 1954 — Tenant has statutory renewal rights" : "Lease contracted out of the Landlord and Tenant Act 1954 — statutory notice and declaration required"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. SPECIAL TERMS

${f.specialClauses || "None specified."}

`;
}

function genLease(f: FormData): string {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const annualRentFormatted = f.annualRent ? `£${Number(f.annualRent.replace(/[^0-9.]/g, "")).toLocaleString("en-GB")}` : "[ANNUAL RENT]";
  const rentWords = f.annualRent ? "(see Definitions)" : "[AMOUNT IN WORDS]";

  return `THIS ${f.leaseType?.toUpperCase() || "LEASE"} is dated ${today}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTIES

(1) ${f.landlordName || "[LANDLORD FULL LEGAL NAME]"}${f.landlordCompany ? ` (Company Number ${f.landlordCompany})` : ""} whose registered office is at ${f.landlordRegistered || "[REGISTERED OFFICE]"} ("the Landlord")

(2) ${f.tenantName || "[TENANT FULL LEGAL NAME]"}${f.tenantCompany ? ` (Company Number ${f.tenantCompany})` : ""} whose registered office is at ${f.tenantRegistered || "[REGISTERED OFFICE]"} ("the Tenant")
${f.guarantorRequired === "yes" ? `
(3) ${f.guarantorName || "[GUARANTOR FULL LEGAL NAME]"}${f.guarantorCompany ? ` (Company Number ${f.guarantorCompany})` : ""} of ${f.guarantorAddress || "[ADDRESS]"} ("the Guarantor")` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DEFINITIONS AND INTERPRETATION

1.1 In this Lease the following expressions have the following meanings:

"Break Date" means ${f.tenantBreak === "yes" && f.breakDate ? new Date(f.breakDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[NOT APPLICABLE / DATE]"};

"Commencement Date" means ${f.commencementDate ? new Date(f.commencementDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[DATE]"};

"Contractual Term" means ${f.contractualTerm || "[TERM]"} from the Commencement Date;

"Expiry Date" means ${f.expiryDate ? new Date(f.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[DATE]"};

"Insurance Rent" means the amount payable by the Tenant pursuant to clause 6;

"Permitted Use" means ${f.permittedUse || "[LEGAL REVIEW REQUIRED — define precisely]"};

"Property" means the property known as ${f.propertyAddress || "[ADDRESS]"}${f.titleNumber ? ` registered at HM Land Registry under title number ${f.titleNumber}` : ""};

"Rent" means the sum of ${annualRentFormatted} per annum (${rentWords}) or such revised sum as may be ascertained in accordance with Schedule [X] (Rent Review);

"Rent Payment Days" means the [first] day of [January / each quarter] in each year during the Term;

"Term" means the Contractual Term together with any statutory continuation thereof under the Landlord and Tenant Act 1954 (if applicable);

"VAT" means value added tax chargeable under the Value Added Tax Act 1994;

1.2 In this Lease, unless the context otherwise requires:
(a) references to a statute or statutory provision include any consolidation, amendment or re-enactment thereof;
(b) words importing the singular include the plural and vice versa;
(c) references to a "person" include an individual, company, partnership, or unincorporated body;
(d) any obligation not to do something includes an obligation not to allow or permit it to be done;
(e) headings are for convenience only and shall not affect interpretation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. DEMISE

The Landlord demises the Property to the Tenant for the Contractual Term from and including the Commencement Date TOGETHER WITH the rights set out in Schedule 1 (Tenant's Rights) but EXCEPTING AND RESERVING to the Landlord the rights set out in Schedule 2 (Landlord's Reservations) YIELDING AND PAYING the Rent and all other sums payable under this Lease.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. RENT

3.1 The Tenant shall pay the Rent ${f.paymentFrequency === "monthly" ? "monthly" : "quarterly"} in advance on the Rent Payment Days without any deduction, counterclaim, or set-off.

3.2 The first payment of Rent (or a proportionate part thereof for any broken period) shall be made on the Commencement Date${f.rentFreePeriod ? ` provided that no Rent shall be payable during the Rent-Free Period of ${f.rentFreePeriod} from the Commencement Date` : ""}.

${f.fitOutPeriod ? `3.3 No Rent shall be payable during the Fit-Out Period of ${f.fitOutPeriod} from the Commencement Date during which time the Tenant is permitted to carry out fitting-out works.` : ""}

3.4 The Tenant shall pay interest at the rate of four per cent above the base lending rate from time to time of [Bank] on any sum payable under this Lease which is not paid within [14] days of becoming due, such interest to accrue on a daily basis from the due date until the date of actual payment.

3.5 The Landlord shall be entitled to apply any payment received from the Tenant in or towards satisfaction of any sums due under this Lease in such order as the Landlord may in its absolute discretion determine.

3.6 All sums payable under this Lease are expressed exclusive of VAT. ${f.vatApplicable === "yes" ? "The Landlord has opted to tax the Property and VAT at the prevailing rate shall be payable in addition to all sums due." : "If the Landlord exercises an option to tax, all sums shall become payable with VAT at the prevailing rate."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. TENANT'S COVENANTS

The Tenant covenants with the Landlord as follows:

4.1 PAYMENT OF RENT
To pay the Rent and all other monies payable under this Lease on the days and in the manner specified herein.

4.2 RATES AND OUTGOINGS
To pay all existing and future rates, taxes, charges, assessments, and outgoings in respect of the Property (save as expressly reserved to the Landlord) including business rates, water rates, and utilities.

4.3 REPAIR
${f.repairingObligation === "full repairing"
  ? `To repair, maintain, and keep the Property (including all fixtures and fittings and all plant and machinery therein) in good and substantial repair and condition throughout the Term and to deliver up the Property in such repair and condition at the expiry or sooner determination of the Term.${f.scheduleOfCondition === "yes" ? " The Tenant's repairing liability shall be limited to the state of repair evidenced by the Schedule of Condition annexed hereto." : ""}`
  : `To keep the interior of the Property (including all interior fixtures and fittings) in good repair and condition throughout the Term and to deliver up the interior in such repair at the expiry or sooner determination of the Term. The Landlord shall be responsible for the repair and maintenance of the structure, exterior, and roof of the building.`}

4.4 DECORATION
To redecorate the Property internally [in the last year of the Term and] in every [fifth] year of the Term using good quality materials in colours approved by the Landlord.

4.5 ALTERATIONS
${f.alterationsAllowed === "none"
  ? "Not to make any alterations, additions, or improvements to the Property without the prior written consent of the Landlord."
  : f.alterationsAllowed === "internal only"
  ? "Not to make any structural alterations or additions to the Property. Not to carry out any internal alterations or additions without the prior written consent of the Landlord (such consent not to be unreasonably withheld or delayed in respect of internal non-structural alterations)."
  : f.alterationsAllowed === "non-structural"
  ? "Not to make any structural alterations to the Property. The Tenant may carry out non-structural internal alterations with the prior written consent of the Landlord (not to be unreasonably withheld or delayed)."
  : "Not to carry out any alterations, additions, or improvements (whether structural or non-structural) to the Property without the prior written consent of the Landlord (not to be unreasonably withheld or delayed in respect of internal non-structural alterations). Any structural alterations shall require a licence for alterations in an appropriate form."}

At the expiry or sooner determination of the Term, the Tenant shall if required by the Landlord reinstate any alterations, additions, or improvements carried out during the Term at the Tenant's expense.

4.6 PERMITTED USE
Not to use the Property or any part thereof otherwise than for the Permitted Use: ${f.permittedUse || "[LEGAL REVIEW REQUIRED]"}. Not to use the Property for any purpose which is illegal, immoral, or a nuisance or annoyance to the Landlord or occupiers of neighbouring properties.

4.7 PLANNING
Not to make any application for planning permission relating to the Property without the Landlord's prior written consent. To comply at all times with all requirements of planning legislation and all conditions attached to any planning permissions relating to the Property.

4.8 COMPLIANCE WITH STATUTE
To comply with all statutory requirements, notices, orders, regulations, and bye-laws affecting the Property or the Permitted Use including (without limitation) the Regulatory Reform (Fire Safety) Order 2005, the Health and Safety at Work etc. Act 1974, the Equality Act 2010, and the Environmental Protection Act 1990.

4.9 ALIENATION
${f.assignmentRights === "prohibited"
  ? "Not to assign, charge, or otherwise deal with the whole or any part of the Property or this Lease."
  : f.assignmentRights === "with consent"
  ? "Not to assign the whole of this Lease without the prior written consent of the Landlord (such consent not to be unreasonably withheld or delayed provided the proposed assignee satisfies the Landlord's reasonable covenant tests). Not in any circumstances to assign part only of the Property."
  : "The Tenant may assign the whole of this Lease upon giving the Landlord [28] days' prior written notice."}

${f.sublettingRights === "prohibited"
  ? "Not to sublet the whole or any part of the Property."
  : f.sublettingRights === "with consent"
  ? "Not to sublet the whole or any part of the Property without the prior written consent of the Landlord (such consent not to be unreasonably withheld or delayed). Any sublease shall: (a) be at a rent not less than the open market rent; (b) be contracted out of the Landlord and Tenant Act 1954 (unless the Landlord otherwise agrees); (c) contain provisions mirroring those in this Lease."
  : "The Tenant may sublet the whole or any part of the Property at a rent not less than the open market rent for the relevant part."}

4.10 NOTIFICATION
To notify the Landlord in writing within [14] days of receiving any notice, order, or proposal from any authority or third party affecting the Property.

4.11 ACCESS
To permit the Landlord and its agents at all reasonable times (and at any time in an emergency) upon [48] hours' prior written notice (except in emergency) to enter the Property to inspect its condition and state of repair, to carry out works required under this Lease or on neighbouring property, and for any other reasonable purpose.

4.12 YIELDING UP
At the expiry or sooner determination of the Term to yield up the Property in the condition required by this Lease and to return all keys.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. LANDLORD'S COVENANTS

The Landlord covenants with the Tenant as follows:

5.1 QUIET ENJOYMENT
The Tenant paying the Rent and performing and observing the Tenant's covenants in this Lease shall peaceably hold and enjoy the Property during the Term without any interruption by the Landlord or any person claiming under or in trust for the Landlord.

5.2 LANDLORD'S REPAIR
${f.repairingObligation === "internal repairing" ? "To keep in repair and condition the structure, exterior, and roof of the building of which the Property forms part." : "The Landlord's repairing obligations are limited as set out in this Lease. [LEGAL REVIEW REQUIRED — confirm landlord's repair obligations]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. INSURANCE

6.1 ${f.insuranceObligation === "landlord insures"
  ? "The Landlord shall insure and keep insured the Property against loss or damage by fire and such other risks as are commonly insured against from time to time for the full reinstatement value."
  : f.insuranceObligation === "tenant reimburses"
  ? "The Landlord shall insure the Property and the Tenant shall pay to the Landlord on demand a sum equal to the insurance premium (or a fair proportion thereof) attributable to the Property."
  : "The Tenant shall insure and keep insured the Property against loss or damage by fire and such other risks as the Landlord may from time to time reasonably require for the full reinstatement value with an insurer approved by the Landlord."}

6.2 ${f.insuredRisks ? `The insured risks shall include: ${f.insuredRisks}.` : "The insured risks shall include fire, lightning, explosion, storm, flood, aircraft, riot, malicious damage, impact, and such other risks as [LEGAL REVIEW REQUIRED — specify]."}

6.3 If the Property is destroyed or damaged by an insured risk so as to render it unfit for use and occupation, the rent shall be suspended until the Property has been reinstated or until the insurance monies are exhausted whichever is the earlier.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. RENT REVIEW

[LEGAL REVIEW REQUIRED — Full rent review provisions to be drafted based on agreed basis]

7.1 The Rent shall be reviewed on the following dates: ${f.reviewDates || "[REVIEW DATES TO BE SPECIFIED]"}.

7.2 Review Basis: ${f.reviewType} (${f.reviewDirection}).

7.3 [FULL RENT REVIEW PROVISIONS TO BE INSERTED BY SOLICITOR — including dispute resolution mechanism, time of the essence provisions, and hypothetical letting assumptions appropriate for ${f.reviewType} review]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${f.serviceChargeApplicable === "yes" ? `8. SERVICE CHARGE

8.1 The Tenant shall pay a fair and reasonable proportion of the costs, expenses, and outgoings properly incurred by the Landlord in providing the following services: ${f.servicesIncluded || "[SERVICES TO BE SPECIFIED]"}.

8.2 ${f.serviceChargeCap ? `The Tenant's liability for service charge shall be capped at ${f.serviceChargeCap} per annum (indexed to [CPI/RPI] from the Commencement Date).` : "There is no agreed cap on service charge."}

8.3 The following costs shall be excluded from the service charge: ${f.excludedCosts || "[TO BE SPECIFIED — consider excluding capital expenditure, pre-existing defects, and landlord's management costs above [X]%]"}.

8.4 The Landlord shall provide certified accounts within [6] months of each service charge year end.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` : ""}${(f.tenantBreak === "yes" || f.landlordBreak === "yes" || f.mutualBreak === "yes") ? `${f.serviceChargeApplicable === "yes" ? "9" : "8"}. BREAK CLAUSES

${f.tenantBreak === "yes" ? `TENANT'S BREAK
The Tenant may determine this Lease on ${f.breakDate ? new Date(f.breakDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[BREAK DATE]"} ("the Break Date") by giving the Landlord not less than [6] months' prior written notice expiring on the Break Date, provided that on the Break Date:
(a) the Tenant has paid all Rent and other monies due under this Lease;
(b) the Tenant gives vacant possession of the whole of the Property;
${f.breakConditions ? `(c) ${f.breakConditions};` : "(c) the Tenant has materially complied with its repairing and decorating obligations;"}
(d) the Tenant has removed all its belongings and reinstated all alterations.

[LEGAL REVIEW REQUIRED — break clause conditions must be precisely drafted — time is of the essence]` : ""}

${f.landlordBreak === "yes" ? `LANDLORD'S BREAK
The Landlord may determine this Lease on [DATE] by giving the Tenant not less than [6] months' prior written notice expiring on such date.
[LEGAL REVIEW REQUIRED — landlord break conditions to be agreed]` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` : ""}${f.depositAmount ? `DEPOSIT

${Number(f.depositAmount.replace(/[^0-9.]/g, "")) > 0 ? `The Tenant shall on the date of this Lease pay to the Landlord a deposit of £${Number(f.depositAmount.replace(/[^0-9.]/g, "")).toLocaleString("en-GB")} as security for the performance of the Tenant's obligations. The Landlord shall hold the deposit [in a designated client account / [LEGAL REVIEW REQUIRED — confirm deposit treatment, interest, draw-down events, and repayment provisions]].` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` : ""}${f.guarantorRequired === "yes" ? `GUARANTOR PROVISIONS

In consideration of the Landlord entering into this Lease at the Guarantor's request, the Guarantor covenants with the Landlord as follows:

(a) The Guarantor guarantees to the Landlord that the Tenant will duly perform and observe all the Tenant's obligations in this Lease.

(b) The Guarantor shall pay to the Landlord on demand all losses, costs, and expenses suffered by the Landlord as a result of any breach by the Tenant of its obligations in this Lease.

(c) As a separate obligation, the Guarantor covenants as principal debtor to pay to the Landlord on demand all sums which the Tenant is obliged to pay under this Lease and which remain unpaid.

(d) [LEGAL REVIEW REQUIRED — guarantee provisions, including authorised guarantee agreement (AGA) requirements on assignment, anti-avoidance provisions under the Landlord and Tenant (Covenants) Act 1995, and Sch.4 undertaking for new tenancies]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` : ""}${f.insideAct1954 === "no" ? `SECURITY OF TENURE — CONTRACTED OUT

IMPORTANT: THIS LEASE IS CONTRACTED OUT OF THE LANDLORD AND TENANT ACT 1954

The Tenant confirms receipt of a notice from the Landlord pursuant to section 38A(3)(a) of the Landlord and Tenant Act 1954 before the Tenant entered into this Lease (or became contractually bound to do so).

[LEGAL REVIEW REQUIRED — contracting-out procedure must be strictly followed. Statutory notice must be served and statutory declaration (or simple declaration) made before the tenant enters into the lease or becomes contractually bound. Failure renders the contracting-out void.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

` : ""}DEFAULT AND REMEDIES

The Landlord may re-enter the Property and determine this Lease if:
(a) the Rent or any other monies payable under this Lease remain unpaid for [21] days after becoming due (whether formally demanded or not);
(b) the Tenant commits or permits any breach of the Tenant's covenants;
(c) the Tenant becomes insolvent, enters into administration, receivership, or any analogous process.

[LEGAL REVIEW REQUIRED — forfeiture provisions must comply with the Law of Property Act 1925 s.146 requirements and any applicable limitations on re-entry for non-payment]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTICES

Any notice under this Lease shall be in writing and may be served by hand delivery, first-class post, or email (with read receipt) to the addresses set out in this Lease. Notices sent by first-class post shall be deemed received [2] business days after posting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLIANCE PROVISIONS

Data Protection: The parties shall comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 in connection with any personal data processed in connection with this Lease.

Anti-Bribery: The parties shall comply with the Bribery Act 2010 and shall not engage in any conduct that would constitute a bribery offence.

Anti-Money Laundering: The parties acknowledge their obligations under the Proceeds of Crime Act 2002 and the Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017.

ESG / Energy: [LEGAL REVIEW REQUIRED — consider green lease clauses, EPC improvement obligations, energy reporting requirements, and net zero commitments as applicable]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION

[LEGAL REVIEW REQUIRED — execution formalities depend on the nature of the parties. Deeds executed by companies must comply with the Companies Act 2006 s.44 (two authorised signatories or one director + company seal). Individual signatories require witness attestation. Confirm correct form with your solicitor before execution.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION — LANDLORD (Company)

EXECUTED as a DEED by                    )
${f.landlordName || "[LANDLORD FULL NAME]"}  )
(Company No: ${f.landlordCompany || "[     ]"})               )
acting by two directors / a director     )
and the company secretary:               )

Director signature: _______________________________

Print name: _______________________________________

Director/Secretary signature: _____________________

Print name: _______________________________________

Date: ____________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION — LANDLORD (Individual — if applicable)

SIGNED as a DEED by                      )
${f.landlordName || "[LANDLORD FULL NAME]"}  )
in the presence of:                      )

Signature: _______________________________________

Print name: ______________________________________

Date: ___________________________________________

WITNESS

Witness signature: _______________________________

Witness print name: ______________________________

Witness address: _________________________________

________________________________________________

Witness occupation: ______________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION — TENANT (Company)

EXECUTED as a DEED by                    )
${f.tenantName || "[TENANT FULL NAME]"}      )
(Company No: ${f.tenantCompany || "[     ]"})               )
acting by two directors / a director     )
and the company secretary:               )

Director signature: _______________________________

Print name: _______________________________________

Director/Secretary signature: _____________________

Print name: _______________________________________

Date: ____________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION — TENANT (Individual — if applicable)

SIGNED as a DEED by                      )
${f.tenantName || "[TENANT FULL NAME]"}      )
in the presence of:                      )

Signature: _______________________________________

Print name: ______________________________________

Date: ___________________________________________

WITNESS

Witness signature: _______________________________

Witness print name: ______________________________

Witness address: _________________________________

________________________________________________

Witness occupation: ______________________________

${f.guarantorRequired === "yes" ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION — GUARANTOR (Company)

EXECUTED as a DEED by                    )
${f.guarantorName || "[GUARANTOR FULL NAME]"}  )
(Company No: ${f.guarantorCompany || "[     ]"})             )
acting by two directors / a director     )
and the company secretary:               )

Director signature: _______________________________

Print name: _______________________________________

Director/Secretary signature: _____________________

Print name: _______________________________________

Date: ____________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION — GUARANTOR (Individual — if applicable)

SIGNED as a DEED by                      )
${f.guarantorName || "[GUARANTOR FULL NAME]"}  )
in the presence of:                      )

Signature: _______________________________________

Print name: ______________________________________

Date: ___________________________________________

WITNESS

Witness signature: _______________________________

Witness print name: ______________________________

Witness address: _________________________________

________________________________________________

Witness occupation: ______________________________
` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCHEDULES

Schedule 1: Tenant's Rights [LEGAL REVIEW REQUIRED]
Schedule 2: Landlord's Reservations [LEGAL REVIEW REQUIRED]
${f.serviceChargeApplicable === "yes" ? "Schedule 3: Service Charge Provisions [LEGAL REVIEW REQUIRED]\n" : ""}${f.reviewType ? "Schedule 4: Rent Review [LEGAL REVIEW REQUIRED]\n" : ""}${f.scheduleOfCondition === "yes" ? "Schedule 5: Schedule of Condition [TO BE PREPARED BY SURVEYOR]\n" : ""}
`;
}

function genCompletionChecklist(f: FormData): string {
  return `COMPLETION CHECKLIST — ${f.leaseType || "COMMERCIAL LEASE"}
Property: ${f.propertyAddress || "[ADDRESS]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE COMPLETION
□  Title verification — obtain official copies from HM Land Registry
□  Landlord AML checks — verify Landlord's identity under MLR 2017
□  Tenant AML checks — verify Tenant's identity and source of funds
${f.guarantorRequired === "yes" ? "□  Guarantor AML checks — verify Guarantor's identity and financial standing\n" : ""}□  Company searches — Companies House search on Landlord${f.tenantCompany ? " and Tenant" : ""}
□  Insolvency searches — bankruptcy / winding up searches
□  EPC — confirm rating and MEES compliance (minimum Band E for lettings)
□  Planning — confirm existing use class and any conditions
□  Licensing — confirm any required licences (food, alcohol, etc.)
□  Building regulations — confirm compliance for any existing alterations
□  Environmental search — drainage, flood risk, contaminated land
□  Local authority search — confirm planning history and highway matters
□  Landlord's title — confirm power to grant the lease
${f.insideAct1954 === "no" ? "□  Contracting-out — confirm notice served and statutory declaration executed BEFORE lease execution\n" : ""}□  Insurance — confirm building insurance in place from Completion
□  Rent deposit — prepare rent deposit deed if deposit payable
□  Lease — final agreed form approved by both parties' solicitors
□  Engrossment — prepare final engrossment for execution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ON COMPLETION

□  Lease executed as a deed by Landlord
□  Lease executed as a deed by Tenant
${f.guarantorRequired === "yes" ? "□  Lease executed as a deed by Guarantor\n" : ""}□  Counterpart lease executed and exchanged
□  Deposit paid and receipt issued (if applicable)
□  First rental payment received
□  Keys handed over to Tenant
${f.rentFreePeriod ? `□  Rent-free period confirmed in writing: ${f.rentFreePeriod}\n` : ""}${f.fitOutPeriod ? `□  Fit-out period confirmed in writing: ${f.fitOutPeriod}\n` : ""}□  Completed copy of lease issued to Tenant

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST-COMPLETION

□  SDLT — file SDLT1 return and pay any tax due within 14 days of completion
${Number(f.contractualTerm?.replace(/[^0-9.]/g, "") || "0") >= 7 ? "□  Land Registry — apply for registration of the lease (AP1 / AP2 as applicable) — MANDATORY for leases of 7+ years\n" : "□  Land Registry — consider whether voluntary registration is appropriate\n"}□  Notice of lease — serve notice of lease on Landlord's mortgagee (if required by title)
□  Duplicate lease — register duplicate with relevant authority if required
${f.serviceChargeApplicable === "yes" ? "□  Service charge — set up service charge year and notify Tenant of first budget\n" : ""}□  Insurance — add Tenant to interest noted on Landlord's policy
□  Compliance calendar — set up reminders for rent review dates, break dates, lease expiry
□  Dilapidations — commission photographic schedule of condition on access
□  Deposit — deposit deed executed and deposit funds held in accordance with agreed terms
`;
}

function genSDLT(f: FormData): string {
  const term = Number(f.contractualTerm?.replace(/[^0-9.]/g, "") || "0");
  const rent = Number(f.annualRent?.replace(/[^0-9.]/g, "") || "0");
  const npv = rent * term * 0.9; // crude approximation for illustration only

  return `STAMP DUTY LAND TAX (SDLT) ANALYSIS
[LEGAL REVIEW REQUIRED — SDLT calculation requires professional advice]

Property: ${f.propertyAddress || "[ADDRESS]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERVIEW

SDLT applies to the grant of a commercial lease in England if:
(a) the Net Present Value (NPV) of the rent exceeds £150,000; or
(b) any premium is paid on grant.

INFORMATION PROVIDED

Annual Rent:    ${rent > 0 ? `£${rent.toLocaleString("en-GB")} per annum` : "[NOT PROVIDED]"}
Term:           ${term > 0 ? `${term} years` : "[NOT PROVIDED]"}
Premium:        [NOT PROVIDED — confirm whether any premium is payable]
VAT:            ${f.vatApplicable === "yes" ? "VAT applicable — include VAT in SDLT calculation if option to tax exercised" : "No VAT confirmed"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ILLUSTRATIVE SDLT POSITION

[LEGAL REVIEW REQUIRED — the following is illustrative only and must be verified by a solicitor or tax adviser]

${rent > 0 && term > 0
  ? `Indicative NPV (approximate, not discounted): £${npv.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
Note: Actual NPV must be calculated using HMRC's prescribed 3.5% discount rate.

SDLT RATE ON RENT (non-residential):
• First £150,000: 0%
• £150,001 – £5,000,000: 1%
• Above £5,000,000: 2%

[A solicitor or tax adviser must calculate the actual NPV and SDLT using HMRC's online calculator or professional software]`
  : "Insufficient information to calculate NPV — provide annual rent and term."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILING REQUIREMENT

• SDLT1 return must be filed within 14 days of the effective date (usually completion)
• SDLT must be paid within 14 days of the effective date
• Failure to file or pay on time results in automatic penalties and interest
• Filing is the responsibility of the Tenant's solicitor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADDITIONAL POINTS

□  Confirm whether any relief applies (charity relief, group relief, etc.)
□  Confirm whether SDLT was paid on any Agreement for Lease
□  Confirm VAT position — VAT-inclusive rent increases SDLT liability
□  Obtain SDLT advice before completion
`;
}

function genLandRegistry(f: FormData): string {
  const term = Number(f.contractualTerm?.replace(/[^0-9.]/g, "") || "0");
  const mandatory = term >= 7;

  return `LAND REGISTRY ANALYSIS
Property: ${f.propertyAddress || "[ADDRESS]"}
Title: ${f.titleNumber || "[TITLE NUMBER REQUIRED]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGISTRATION REQUIREMENT

Term:                 ${term > 0 ? `${term} years` : "[NOT PROVIDED]"}
Registration:         ${mandatory ? "MANDATORY — leases of 7 years or more must be registered at HM Land Registry" : term > 0 ? "Not mandatory (term under 7 years) — voluntary registration may be considered" : "[CONFIRM TERM — mandatory if 7+ years]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${mandatory ? `REGISTRATION PROCEDURE

Deadline:         Within 2 months of completion (s.6 Land Registration Act 2002). If not registered within 2 months the legal estate does not pass — the lease operates in equity only.

Forms Required:
□  AP1 — Application to Change the Register
□  TP1 or TR1 — if arising from a transfer (confirm)
□  A certified copy of the Lease (duplicate)
□  Form RX1 — if registering any restrictions
□  Form DI — Disclosable Overriding Interests (if applicable)
□  SDLT5 Certificate — proof of SDLT filing (must accompany application)
□  Form ID1/ID2 — identity verification (if required)
□  Certified copy of title deeds (if Landlord's title also being dealt with)

Land Registry Fees:  Based on rent/value — current fee scale to be confirmed at time of application

Landlord's Title:
${f.titleNumber ? `Title number confirmed: ${f.titleNumber}` : "[LEGAL REVIEW REQUIRED — confirm Landlord's title is registered and free from restrictions on letting]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTICE OF LEASE

If the Landlord's title is registered and the lease is not compulsorily registrable, the Tenant should protect its interest by registering a notice at HM Land Registry using Form AN1 or UN1.` : `VOLUNTARY REGISTRATION

Although registration is not mandatory for a lease of ${term > 0 ? `${term} years` : "this term"}, the Tenant should consider:
□  Registering a notice on the Landlord's title (Form AN1) to protect the leasehold interest
□  Whether voluntary first registration is appropriate

[LEGAL REVIEW REQUIRED]`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRACTICAL STEPS

□  Obtain official copy of Landlord's title before completion
□  Check for charges, restrictions, and other encumbrances on Landlord's title
□  Confirm freehold/headlease terms do not prevent the letting
□  Prepare Land Registry application immediately after completion
□  File SDLT return and obtain SDLT5 before submitting to Land Registry
`;
}

function genLandlordRisk(f: FormData): string {
  return `LANDLORD RISK REPORT
Property: ${f.propertyAddress || "[ADDRESS]"}
Tenant: ${f.tenantName || "[TENANT]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMMERCIAL RISKS

${f.guarantorRequired === "no" ? "⚠️  HIGH — No guarantor. If the Tenant defaults, the Landlord has no secondary recourse. Consider requiring a rent deposit or personal guarantee." : "✓  Guarantor in place — provides secondary recourse on Tenant default."}

Covenant Strength: [MEDIUM — Tenant covenant strength must be independently assessed. Obtain latest filed accounts and credit report before completion.]

${f.repairingObligation === "full repairing" && f.scheduleOfCondition === "no" ? "✓  LOW — Full repairing lease without schedule of condition gives Landlord maximum dilapidations recovery at lease end." : f.scheduleOfCondition === "yes" ? "⚠️  MEDIUM — Schedule of condition limits Landlord's dilapidations recovery to the state of repair shown in the schedule." : ""}

${f.tenantBreak === "yes" ? "⚠️  MEDIUM — Tenant break right reduces income security. Landlord should maximise break conditions (vacant possession, full compliance, no arrears)." : "✓  LOW — No tenant break right — full term income security."}

Void Period Risk: ${f.tenantBreak === "yes" ? "MEDIUM — void period possible on break exercise" : "LOW — no break right"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEGAL RISKS

${f.insideAct1954 === "yes" ? "⚠️  MEDIUM — Lease protected by Landlord and Tenant Act 1954. Landlord cannot recover possession at expiry without establishing a statutory ground (ss.30-31 LTA 1954). Planning to sell or redevelop? Seek advice." : "✓  LOW — Lease contracted out of LTA 1954. Landlord can recover possession at expiry without statutory justification. [SUBJECT TO CORRECT CONTRACTING-OUT PROCEDURE]"}

${f.vatApplicable === "yes" ? "⚠️  MEDIUM — Option to tax exercised. Landlord must maintain option to tax and comply with HMRC partial exemption rules. Seek VAT advice." : "LOW — No VAT applicable at present."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENFORCEMENT RISKS

Rent Arrears: MEDIUM — Commercial rent arrears recovery (CRAR) available for unpaid rent but limited to goods on the premises. Forfeiture available but subject to s.146 LPA 1925 notice and potential relief.

Insolvency: HIGH — If Tenant becomes insolvent, administrator/liquidator may disclaim the lease. ${f.guarantorRequired === "yes" ? "Guarantor recourse available." : "No guarantor — limited recourse."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERALL LANDLORD RISK RATING: ${f.guarantorRequired === "no" && f.insideAct1954 === "yes" ? "MEDIUM-HIGH" : f.guarantorRequired === "yes" ? "MEDIUM" : "MEDIUM"}

[LEGAL REVIEW REQUIRED — full risk assessment by specialist solicitor recommended]
`;
}

function genTenantRisk(f: FormData): string {
  return `TENANT RISK REPORT
Property: ${f.propertyAddress || "[ADDRESS]"}
Landlord: ${f.landlordName || "[LANDLORD]"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REPAIR & DILAPIDATIONS EXPOSURE

Obligation: ${f.repairingObligation}
${f.repairingObligation === "full repairing" && f.scheduleOfCondition === "no"
  ? "⚠️  HIGH — Full repairing lease without schedule of condition. Tenant is liable to put the property into full repair even if it was in poor condition at the start. Commission an independent survey before signing. Consider insisting on a schedule of condition."
  : f.scheduleOfCondition === "yes"
  ? "✓  LOW/MEDIUM — Schedule of condition limits liability to state of repair recorded at commencement."
  : "MEDIUM — Internal repairing obligation. Tenant is not responsible for structure or exterior but must maintain interior in good repair."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RENT REVIEW EXPOSURE

Review Type: ${f.reviewType} / ${f.reviewDirection}
${f.reviewDirection === "upward only" ? "⚠️  MEDIUM — Upward-only review. Rent will never reduce even if market falls." : "✓  LOW — Upward/downward or fixed review provides greater certainty."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BREAK CLAUSE RISKS

${f.tenantBreak === "yes"
  ? `⚠️  HIGH — Break clauses are heavily litigated. The Tenant must strictly comply with all break conditions. Time is of the essence for notice. Failure to comply with even minor conditions (such as outstanding dilapidations) can invalidate the break.
Break Date: ${f.breakDate ? new Date(f.breakDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[TO BE CONFIRMED]"}
Break Conditions: ${f.breakConditions || "Full compliance with covenants, vacant possession, no arrears"}
Action: Instruct solicitor to review break conditions carefully. Set calendar reminders 12 and 6 months before Break Date.`
  : "No tenant break right — Tenant is committed to the full term."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALIENATION RISKS

Assignment: ${f.assignmentRights}
Subletting: ${f.sublettingRights}
${f.assignmentRights === "prohibited" ? "⚠️  HIGH — No assignment permitted. Tenant cannot exit the lease by assignment. Full liability for the term." : "MEDIUM — Assignment permitted with consent. Landlord can refuse if reasonable grounds exist."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLIANCE RISKS

${!f.epcRating || f.epcRating < "E" ? "⚠️  MEDIUM — EPC rating unknown or below E. MEES Regulations 2018 may prohibit lawful occupation. Verify EPC before completion." : "✓  EPC rating confirmed."}
${f.permittedUse ? "✓  Permitted use defined." : "⚠️  HIGH — Permitted use not defined. Risk of planning breach and lease forfeiture."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERALL TENANT RISK RATING: ${f.repairingObligation === "full repairing" && f.scheduleOfCondition === "no" ? "HIGH" : f.tenantBreak === "yes" ? "MEDIUM-HIGH" : "MEDIUM"}

[LEGAL REVIEW REQUIRED — full risk assessment by specialist solicitor recommended before execution]
`;
}

function genNegotiationMatrix(): string {
  return `NEGOTIATION MATRIX — COMMERCIAL LEASE TERMS
England & Wales — Market Practice Reference

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ CLAUSE              │ MARKET STANDARD      │ LANDLORD FRIENDLY    │ TENANT FRIENDLY      │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Rent Review         │ Open market, upward  │ Upward only, 5-yr    │ CPI-linked, cap/      │
│                     │ only, 5-year cycle   │ cycle, no cap         │ collar, upward/down  │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Repairs             │ FRI for 10yr+ leases │ Full FRI, no         │ IRI only, schedule    │
│                     │ IRI for shorter terms│ schedule of cond.    │ of condition annexed │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Service Charge      │ No cap (institutional│ Unlimited, wide      │ Fixed cap, detailed   │
│                     │ landlords)           │ basket of services   │ exclusions schedule  │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Break Rights        │ No break (landlord   │ Landlord break only  │ Tenant break, few    │
│                     │ standard), or tenant │ at landlord's        │ conditions, long     │
│                     │ break with conditions│ discretion           │ notice period        │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Assignment          │ With consent, not    │ Prohibited; or many  │ Freely assignable;    │
│                     │ unreasonably withheld│ conditions           │ landlord consent only│
│                     │                      │                      │ on narrow grounds    │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Subletting          │ With consent, not    │ Prohibited; or at    │ Permitted freely or   │
│                     │ unreasonably withheld│ market rent only     │ at/above passing rent│
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Alterations         │ Internal non-struct. │ Landlord consent for │ Permitted as of right │
│                     │ with consent         │ all alterations;     │ for internal work;   │
│                     │                      │ full reinstatement   │ no reinstatement     │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Guarantor           │ Required for weaker  │ Parent company +     │ No guarantor; or      │
│                     │ covenants            │ director guarantee   │ burn-down provision  │
│                     │                      │ + AGA on assignment  │ after 2 years        │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ 1954 Act            │ Inside Act for 5yr+  │ Contracted out:      │ Inside Act: full      │
│ Security            │ Protected leases     │ no renewal rights    │ security of tenure   │
├─────────────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Deposit             │ 3–6 months' rent     │ 6–12 months' rent;   │ No deposit; or 1–3    │
│                     │                      │ no interest; draw-   │ months; interest paid│
│                     │                      │ down on any breach   │ to tenant            │
└─────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘

[LEGAL REVIEW REQUIRED — market practice varies by location, sector, property type, and bargaining position]
`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommercialLeasePage() {
  const [phase, setPhase] = useState<Phase>("type");
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormData>(EMPTY);
  const [acknowledged, setAcknowledged] = useState(false);
  const [activeDoc, setActiveDoc] = useState(0);

  const set = (key: keyof FormData) => (val: string) => setF(prev => ({ ...prev, [key]: val }));

  const risks = phase === "risks" || phase === "output" ? generateRisks(f) : { high: [], medium: [], low: [] };

  const renderLegalDoc = (text: string) => {
    const lines = text.split("\n");
    const els: React.ReactNode[] = [];
    let k = 0;
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const t = raw.trim();
      // Divider rule
      if (t.match(/^━{5,}/)) {
        els.push(<hr key={k++} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "18px 0 14px" }} />);
        continue;
      }
      // Empty
      if (t === "") { els.push(<div key={k++} style={{ height: 6 }} />); continue; }
      // Legal flag highlight
      if (t.includes("[LEGAL REVIEW REQUIRED") || t.includes("[TO BE AGREED]") || t.includes("[TO BE CONFIRMED") || t.includes("[TO BE SPECIFIED") || t.includes("[NOT PROVIDED")) {
        els.push(<p key={k++} style={{ fontSize: 11.5, color: "#92400e", background: "#fef3c7", borderLeft: "3px solid #f59e0b", padding: "5px 10px", borderRadius: "0 6px 6px 0", fontFamily: "Georgia,serif", lineHeight: 1.65, margin: "3px 0" }}>{t}</p>);
        continue;
      }
      // Document title (first line, ALL CAPS)
      if (i === 0) {
        els.push(<h2 key={k++} style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", textAlign: "center", letterSpacing: "0.06em", margin: "0 0 4px", fontFamily: "Georgia,serif" }}>{t}</h2>);
        continue;
      }
      // Subtitle / meta (first 4 lines, non-numeric)
      if (i <= 3 && !t.match(/^\d/) && t.length > 5) {
        els.push(<p key={k++} style={{ fontSize: 11, color: "#475569", textAlign: "center", fontStyle: "italic", margin: "2px 0", fontFamily: "Georgia,serif" }}>{t}</p>);
        continue;
      }
      // Numbered section heading: "1. PROPERTY" style (all caps)
      if (t.match(/^\d+\.[\s\t]+[A-Z][A-Z\s&(),\-/]+$/) && t.length < 70) {
        els.push(
          <div key={k++} style={{ marginTop: 22, marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{t}</p>
            <div style={{ height: 2, width: 48, background: "#c9a84c", marginTop: 5 }} />
          </div>
        );
        continue;
      }
      // Sub-clause heading: "1.1 Something that starts with capital"
      if (t.match(/^\d+\.\d+\s+[A-Z]/)) {
        els.push(<p key={k++} style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", margin: "10px 0 3px", fontFamily: "Georgia,serif" }}>{t}</p>);
        continue;
      }
      // Checkbox items □
      if (t.startsWith("□")) {
        els.push(<p key={k++} style={{ fontSize: 12, color: "#1e293b", fontFamily: "Georgia,serif", lineHeight: 1.7, margin: "3px 0", paddingLeft: 4 }}>{t}</p>);
        continue;
      }
      // Key-value pair: "Key Label:   value" (2+ spaces after colon)
      const kv = t.match(/^([A-Za-z][^:]{1,40}):\s{2,}(.*)/);
      if (kv) {
        els.push(
          <div key={k++} style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 10, marginBottom: 5, alignItems: "start" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.5, paddingTop: 1 }}>{kv[1]}</span>
            <span style={{ fontSize: 12, color: "#1e293b", fontFamily: "Georgia,serif", lineHeight: 1.65 }}>{kv[2] || "—"}</span>
          </div>
        );
        continue;
      }
      // Default: paragraph text
      els.push(<p key={k++} style={{ fontSize: 12, color: "#1e293b", fontFamily: "Georgia,serif", lineHeight: 1.75, margin: "3px 0" }}>{t}</p>);
    }
    return <div>{els}</div>;
  };

  const DOCS = [
    { label: "Heads of Terms", fn: genHeadsOfTerms },
    { label: "Full Lease Draft", fn: genLease },
    { label: "Completion Checklist", fn: genCompletionChecklist },
    { label: "SDLT Analysis", fn: genSDLT },
    { label: "Land Registry", fn: genLandRegistry },
    { label: "Landlord Risk", fn: genLandlordRisk },
    { label: "Tenant Risk", fn: genTenantRisk },
    { label: "Negotiation Matrix", fn: genNegotiationMatrix },
  ];

  const sectionContent = [
    // 0 — Property
    <SectionCard key="property" title="Property Information">
      <Field label="Property Address *"><Input value={f.propertyAddress} onChange={set("propertyAddress")} placeholder="Full address including postcode" /></Field>
      <Field label="Title Number" hint="Available from HM Land Registry — leave blank if unknown"><Input value={f.titleNumber} onChange={set("titleNumber")} placeholder="e.g. WM123456" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Whole or Part">
          <Select value={f.wholeOrPart} onChange={set("wholeOrPart")} options={["whole", "part"]} />
        </Field>
        <Field label="Floor Area (sq ft / sq m)"><Input value={f.floorArea} onChange={set("floorArea")} placeholder="e.g. 1,200 sq ft" /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Property Type"><Input value={f.propertyType} onChange={set("propertyType")} placeholder="e.g. Office, Retail, Warehouse" /></Field>
        <Field label="EPC Rating"><Input value={f.epcRating} onChange={set("epcRating")} placeholder="e.g. C" /></Field>
      </div>
      <Field label="Existing Use Class" hint="e.g. E(a) retail, E(b) café, E(g)(i) office, B2 industrial"><Input value={f.useClass} onChange={set("useClass")} placeholder="e.g. E(g)(i)" /></Field>
    </SectionCard>,

    // 1 — Landlord
    <SectionCard key="landlord" title="Landlord Details">
      <Field label="Full Legal Name *"><Input value={f.landlordName} onChange={set("landlordName")} placeholder="As it appears on the title register" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Company Number (if applicable)"><Input value={f.landlordCompany} onChange={set("landlordCompany")} placeholder="e.g. 12345678" /></Field>
        <Field label="Contact Details"><Input value={f.landlordContact} onChange={set("landlordContact")} placeholder="Email or phone" /></Field>
      </div>
      <Field label="Registered Office / Address"><Textarea value={f.landlordRegistered} onChange={set("landlordRegistered")} placeholder="Full registered address" rows={2} /></Field>
    </SectionCard>,

    // 2 — Tenant
    <SectionCard key="tenant" title="Tenant Details">
      <Field label="Full Legal Name *"><Input value={f.tenantName} onChange={set("tenantName")} placeholder="As it will appear on the lease" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Company Number (if applicable)"><Input value={f.tenantCompany} onChange={set("tenantCompany")} placeholder="e.g. 12345678" /></Field>
        <Field label="Contact Details"><Input value={f.tenantContact} onChange={set("tenantContact")} placeholder="Email or phone" /></Field>
      </div>
      <Field label="Registered Office / Address"><Textarea value={f.tenantRegistered} onChange={set("tenantRegistered")} placeholder="Full registered address" rows={2} /></Field>
    </SectionCard>,

    // 3 — Guarantor
    <SectionCard key="guarantor" title="Guarantor">
      <Field label="Guarantor Required?">
        <Select value={f.guarantorRequired} onChange={set("guarantorRequired")} options={["no", "yes"]} />
      </Field>
      {f.guarantorRequired === "yes" && <>
        <Field label="Full Legal Name"><Input value={f.guarantorName} onChange={set("guarantorName")} placeholder="Individual or company name" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Company Number"><Input value={f.guarantorCompany} onChange={set("guarantorCompany")} placeholder="If a company" /></Field>
          <Field label="Address"><Input value={f.guarantorAddress} onChange={set("guarantorAddress")} placeholder="Full address" /></Field>
        </div>
      </>}
    </SectionCard>,

    // 4 — Lease Term
    <SectionCard key="term" title="Lease Term">
      <Field label="Document Date" hint="The date this document is prepared — will appear on the printed document">
        <Input type="date" value={f.documentDate} onChange={set("documentDate")} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Commencement Date *"><Input type="date" value={f.commencementDate} onChange={set("commencementDate")} /></Field>
        <Field label="Contractual Term *" hint="e.g. 5 years, 10 years"><Input value={f.contractualTerm} onChange={set("contractualTerm")} placeholder="e.g. 5 years" /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Expiry Date"><Input type="date" value={f.expiryDate} onChange={set("expiryDate")} /></Field>
        <Field label="Rent-Free Period" hint="Period of nil rent at lease start"><Input value={f.rentFreePeriod} onChange={set("rentFreePeriod")} placeholder="e.g. 3 months, or leave blank" /></Field>
      </div>
      <Field label="Fit-Out Period" hint="Period for works before trading commences"><Input value={f.fitOutPeriod} onChange={set("fitOutPeriod")} placeholder="e.g. 6 weeks, or leave blank" /></Field>
    </SectionCard>,

    // 5 — Rent
    <SectionCard key="rent" title="Rent">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Annual Rent (£) *"><Input value={f.annualRent} onChange={set("annualRent")} placeholder="e.g. 24000" /></Field>
        <Field label="Payment Frequency">
          <Select value={f.paymentFrequency} onChange={set("paymentFrequency")} options={["quarterly", "monthly"]} />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="VAT Applicable?">
          <Select value={f.vatApplicable} onChange={set("vatApplicable")} options={["no", "yes"]} />
        </Field>
        <Field label="Deposit Amount (£)"><Input value={f.depositAmount} onChange={set("depositAmount")} placeholder="e.g. 6000 or leave blank" /></Field>
      </div>
    </SectionCard>,

    // 6 — Rent Review
    <SectionCard key="review" title="Rent Review">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Review Type">
          <Select value={f.reviewType} onChange={set("reviewType")} options={["open market", "RPI", "CPI", "fixed increase", "no review"]} />
        </Field>
        <Field label="Review Direction">
          <Select value={f.reviewDirection} onChange={set("reviewDirection")} options={["upward only", "upward/downward"]} />
        </Field>
      </div>
      <Field label="Review Dates" hint="e.g. 5th anniversary, or specific dates"><Input value={f.reviewDates} onChange={set("reviewDates")} placeholder="e.g. Every 5 years from commencement" /></Field>
    </SectionCard>,

    // 7 — Repairs
    <SectionCard key="repair" title="Repairing Obligations">
      <Field label="Repairing Obligation *">
        <Select value={f.repairingObligation} onChange={set("repairingObligation")} options={["full repairing", "internal repairing"]} />
      </Field>
      <Field label="Schedule of Condition?" hint="Limits Tenant's liability to the state of the property at commencement">
        <Select value={f.scheduleOfCondition} onChange={set("scheduleOfCondition")} options={["no", "yes"]} />
      </Field>
      {f.scheduleOfCondition === "yes" && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: 10, fontSize: 12, color: "#92400e" }}>
          A professional schedule of condition should be prepared by a chartered surveyor before lease commencement.
        </div>
      )}
    </SectionCard>,

    // 8 — Insurance
    <SectionCard key="insurance" title="Insurance">
      <Field label="Insurance Arrangement *">
        <Select value={f.insuranceObligation} onChange={set("insuranceObligation")} options={["landlord insures", "tenant reimburses", "tenant insures directly"]} />
      </Field>
      <Field label="Insured Risks" hint="List the specific risks to be covered"><Textarea value={f.insuredRisks} onChange={set("insuredRisks")} placeholder="e.g. Fire, lightning, explosion, flood, storm, impact, malicious damage, public liability..." rows={2} /></Field>
    </SectionCard>,

    // 9 — Service Charge
    <SectionCard key="sc" title="Service Charge">
      <Field label="Service Charge Applicable?">
        <Select value={f.serviceChargeApplicable} onChange={set("serviceChargeApplicable")} options={["no", "yes"]} />
      </Field>
      {f.serviceChargeApplicable === "yes" && <>
        <Field label="Services Included"><Textarea value={f.servicesIncluded} onChange={set("servicesIncluded")} placeholder="e.g. Common area maintenance, cleaning, landscaping, building management..." rows={2} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Service Charge Cap" hint="Annual maximum — leave blank if none"><Input value={f.serviceChargeCap} onChange={set("serviceChargeCap")} placeholder="e.g. £5,000/year" /></Field>
          <Field label="Excluded Costs"><Input value={f.excludedCosts} onChange={set("excludedCosts")} placeholder="e.g. Capital expenditure, pre-existing defects" /></Field>
        </div>
      </>}
    </SectionCard>,

    // 10 — Permitted Use
    <SectionCard key="use" title="Permitted Use">
      <Field label="Permitted Use *" hint="Be precise — this limits what the Tenant can do with the property">
        <Textarea value={f.permittedUse} onChange={set("permittedUse")} placeholder="e.g. Use as an office within Class E(g)(i) of the Town and Country Planning (Use Classes) Order 1987 (as amended) and for no other purpose" rows={3} />
      </Field>
    </SectionCard>,

    // 11 — Alterations & Alienation
    <SectionCard key="alienation" title="Alterations & Alienation">
      <Field label="Alterations Permitted">
        <Select value={f.alterationsAllowed} onChange={set("alterationsAllowed")} options={["none", "internal only", "non-structural", "structural with consent"]} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Assignment">
          <Select value={f.assignmentRights} onChange={set("assignmentRights")} options={["with consent", "prohibited", "free"]} />
        </Field>
        <Field label="Subletting">
          <Select value={f.sublettingRights} onChange={set("sublettingRights")} options={["with consent", "prohibited", "permitted"]} />
        </Field>
      </div>
    </SectionCard>,

    // 12 — Break Rights
    <SectionCard key="break" title="Break Rights">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Tenant Break?">
          <Select value={f.tenantBreak} onChange={set("tenantBreak")} options={["no", "yes"]} />
        </Field>
        <Field label="Landlord Break?">
          <Select value={f.landlordBreak} onChange={set("landlordBreak")} options={["no", "yes"]} />
        </Field>
        <Field label="Mutual Break?">
          <Select value={f.mutualBreak} onChange={set("mutualBreak")} options={["no", "yes"]} />
        </Field>
      </div>
      {(f.tenantBreak === "yes" || f.landlordBreak === "yes" || f.mutualBreak === "yes") && <>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Break Date"><Input type="date" value={f.breakDate} onChange={set("breakDate")} /></Field>
          <Field label="Break Conditions"><Input value={f.breakConditions} onChange={set("breakConditions")} placeholder="e.g. No arrears, vacant possession" /></Field>
        </div>
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 8, padding: 10, fontSize: 12, color: "#92400e" }}>
          Break clauses are heavily litigated. Time is strictly of the essence. Conditions must be precisely drafted — seek legal advice.
        </div>
      </>}
    </SectionCard>,

    // 13 — Security of Tenure
    <SectionCard key="tenure" title="Security of Tenure (Landlord & Tenant Act 1954)">
      <Field label="Inside Landlord and Tenant Act 1954?" hint="'Yes' gives the Tenant statutory renewal rights at lease end. 'No' requires contracting-out procedure.">
        <Select value={f.insideAct1954} onChange={set("insideAct1954")} options={["yes", "no"]} />
      </Field>
      {f.insideAct1954 === "no" && (
        <div style={{ background: "#fee2e2", border: "1px solid #ef4444", borderRadius: 8, padding: 12, fontSize: 12, color: "#991b1b" }}>
          <strong>IMPORTANT:</strong> Contracting-out requires a statutory notice served on the Tenant BEFORE the Tenant enters into the lease (or becomes contractually bound). The Tenant must then make a statutory declaration (or simple declaration for 14+ days). Failure renders the contracting-out void. Solicitor involvement is essential.
        </div>
      )}
    </SectionCard>,

    // 14 — Special Clauses
    <SectionCard key="special" title="Special Clauses">
      <Field label="Bespoke Commercial Terms" hint="List any additional or non-standard provisions agreed between the parties">
        <Textarea value={f.specialClauses} onChange={set("specialClauses")} placeholder="e.g. Landlord to carry out specified works before Commencement Date; option to renew; right of first refusal to purchase..." rows={5} />
      </Field>
    </SectionCard>,
  ];

  const navBarStyle: React.CSSProperties = {
    position: "sticky", top: 0, zIndex: 10, background: "white",
    borderBottom: "1px solid #e8eaf0", padding: "12px 0",
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            padding: 18mm 20mm;
            background: white;
            font-family: Georgia, serif;
            font-size: 11pt;
          }
          @page { size: A4; margin: 0; }
          #print-area h2 { font-size: 16pt; }
          #print-area h3, #print-area .section-heading { font-size: 10pt; }
          #print-area p, #print-area span { font-size: 10.5pt; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ background: "#0f1b36", padding: "64px 0 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div className="container-max px-4" style={{ position: "relative", zIndex: 1 }}>
          <Breadcrumbs items={[{ label: "Templates", href: "/templates" }, { label: "Commercial Lease" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Commercial Templates · England & Wales</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(30px, 4.5vw, 52px)", fontWeight: 800, color: "white", lineHeight: 1.05, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Commercial Lease<br /><em style={{ fontStyle: "normal", color: "var(--gold-ink)" }}>Document Assembly</em>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.65, marginBottom: 24 }}>
            Generate solicitor-review-ready commercial lease documents — Heads of Terms, full lease, SDLT analysis, Land Registry guidance, risk reports, and negotiation matrix — from a structured questionnaire.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Heads of Terms", "Full FRI/IRI Lease", "SDLT Analysis", "Land Registry", "Risk Reports", "Negotiation Matrix"].map(t => (
              <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20, background: "rgba(201,168,76,0.12)", color: "var(--gold-ink)", border: "1px solid rgba(201,168,76,0.2)" }}>{t}</span>
            ))}
          </div>
          <div style={{ marginTop: 20, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 16px", maxWidth: 640 }}>
            <p style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}>
              <strong style={{ color: "#f87171" }}>Legal Notice:</strong> Documents generated are for discussion and solicitor review only. They are not a substitute for legal advice. Always instruct qualified solicitors before executing any commercial lease.
            </p>
          </div>
        </div>
      </section>

      {/* Phase: Select Document Type */}
      {phase === "type" && (
        <section style={{ background: "#f8f9fc", padding: "48px 0 80px" }}>
          <div className="container-max px-4" style={{ maxWidth: 900 }}>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 24, fontWeight: 800, color: "#0f1b36", marginBottom: 8 }}>Phase 1 — Select Document Type</h2>
            <p style={{ fontSize: 14, color: "#475569", marginBottom: 32 }}>What type of commercial occupation arrangement is required?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {LEASE_TYPES.map(lt => (
                <button key={lt.id} onClick={() => { set("leaseType")(lt.label); setPhase("questionnaire"); setStep(0); }}
                  style={{ background: "white", border: "1.5px solid #e8eaf0", borderRadius: 14, padding: "18px 20px", textAlign: "left", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{lt.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1b36", lineHeight: 1.35 }}>{lt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Phase: Questionnaire */}
      {phase === "questionnaire" && (
        <>
          <div style={navBarStyle}>
            <div className="container-max px-4" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => setPhase("type")} style={{ fontSize: 12, color: "#475569", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                ← Change type
              </button>
              <div style={{ flex: 1, display: "flex", gap: 4, flexWrap: "nowrap", overflowX: "auto" }}>
                {SECTION_STEPS.map((s, i) => (
                  <button key={s} onClick={() => setStep(i)}
                    style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, flexShrink: 0, cursor: "pointer", border: "none", background: i === step ? "#0f1b36" : i < step ? "#c9a84c" : "#f1f5f9", color: i === step ? "white" : i < step ? "#0f1b36" : "#475569" }}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#475569", flexShrink: 0 }}>{step + 1}/{SECTION_STEPS.length}</span>
            </div>
          </div>
          <section style={{ background: "#f8f9fc", padding: "40px 0 80px" }}>
            <div className="container-max px-4" style={{ maxWidth: 720 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Phase 2 — Questionnaire</p>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 22, fontWeight: 800, color: "#0f1b36", marginBottom: 4 }}>
                {SECTION_STEPS[step]}
              </h2>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>
                {f.leaseType}
              </p>
              {sectionContent[step]}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8 }}>
                <button onClick={() => step > 0 ? setStep(step - 1) : setPhase("type")}
                  style={{ fontSize: 13, fontWeight: 600, padding: "11px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", color: "#0f1b36", cursor: "pointer" }}>
                  ← Back
                </button>
                {step < SECTION_STEPS.length - 1 ? (
                  <button onClick={() => setStep(step + 1)}
                    style={{ fontSize: 13, fontWeight: 700, padding: "11px 28px", borderRadius: 10, background: "#0f1b36", color: "white", border: "none", cursor: "pointer" }}>
                    Next →
                  </button>
                ) : (
                  <button onClick={() => setPhase("risks")}
                    style={{ fontSize: 13, fontWeight: 700, padding: "11px 28px", borderRadius: 10, background: "#c9a84c", color: "#0f1b36", border: "none", cursor: "pointer" }}>
                    Review Risks →
                  </button>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Phase: Risk Review */}
      {phase === "risks" && (
        <section style={{ background: "#f8f9fc", padding: "48px 0 80px" }}>
          <div className="container-max px-4" style={{ maxWidth: 800 }}>
            <button onClick={() => setPhase("questionnaire")} style={{ fontSize: 12, color: "#475569", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}>← Back to questionnaire</button>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Phase 3 — Legal Risk Identification</p>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 24, fontWeight: 800, color: "#0f1b36", marginBottom: 24 }}>Pre-Drafting Risk Assessment</h2>

            {risks.high.length > 0 && (
              <div style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#be123c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🔴 High Risk — Solicitor Action Required</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {risks.high.map((r, i) => <li key={i} style={{ fontSize: 13, color: "#9f1239", lineHeight: 1.5 }}>• {r}</li>)}
                </ul>
              </div>
            )}
            {risks.medium.length > 0 && (
              <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🟡 Medium Risk — Review Recommended</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {risks.medium.map((r, i) => <li key={i} style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>• {r}</li>)}
                </ul>
              </div>
            )}
            {risks.low.length > 0 && (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#166534", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🟢 Low Risk — Note for Solicitor</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {risks.low.map((r, i) => <li key={i} style={{ fontSize: 13, color: "#14532d", lineHeight: 1.5 }}>• {r}</li>)}
                </ul>
              </div>
            )}
            {risks.high.length === 0 && risks.medium.length === 0 && risks.low.length === 0 && (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "#14532d" }}>No major risk flags identified based on information provided. Proceed to document generation — solicitor review still required before execution.</p>
              </div>
            )}

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button onClick={() => setPhase("questionnaire")}
                style={{ fontSize: 13, fontWeight: 600, padding: "11px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", color: "#0f1b36", cursor: "pointer" }}>
                ← Edit Details
              </button>
              <button onClick={() => setPhase("output")}
                style={{ fontSize: 13, fontWeight: 700, padding: "11px 28px", borderRadius: 10, background: "#c9a84c", color: "#0f1b36", border: "none", cursor: "pointer" }}>
                Generate Documents →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Phase: Output */}
      {phase === "output" && (
        <>
          <div style={navBarStyle}>
            <div className="container-max px-4" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setPhase("risks")} style={{ fontSize: 12, color: "#475569", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
              <div style={{ flex: 1, display: "flex", gap: 6, flexWrap: "nowrap", overflowX: "auto" }}>
                {DOCS.map((d, i) => (
                  <button key={d.label} onClick={() => setActiveDoc(i)}
                    style={{ fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20, flexShrink: 0, cursor: "pointer", border: "none", background: i === activeDoc ? "#0f1b36" : "#f1f5f9", color: i === activeDoc ? "white" : "#475569", whiteSpace: "nowrap" }}>
                    {d.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => acknowledged && window.print()}
                disabled={!acknowledged}
                title={!acknowledged ? "You must acknowledge the legal notice below before printing" : "Print document"}
                style={{ fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 10, background: acknowledged ? "#0f1b36" : "#cbd5e1", color: "white", border: "none", cursor: acknowledged ? "pointer" : "not-allowed", flexShrink: 0, transition: "background 0.2s" }}>
                🖨️ Print
              </button>
            </div>
          </div>
          <section style={{ background: "#f8f9fc", padding: "40px 0 80px" }}>
            <div className="container-max px-4" style={{ maxWidth: 900 }}>
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 12, color: "#92400e" }}>
                <strong>Phase 5 — Document Package</strong> · All documents require solicitor review before use · [LEGAL REVIEW REQUIRED] tags mark matters needing professional attention
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {DOCS.map((d, i) => (
                  <button key={d.label} onClick={() => setActiveDoc(i)}
                    style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, cursor: "pointer", border: "1.5px solid", borderColor: i === activeDoc ? "#0f1b36" : "#e2e8f0", background: i === activeDoc ? "#0f1b36" : "white", color: i === activeDoc ? "white" : "#475569" }}>
                    {i + 1}. {d.label}
                  </button>
                ))}
              </div>

              <div id="print-area" style={{ background: "white", border: "1.5px solid #e8eaf0", borderRadius: 16, padding: "40px 48px", boxShadow: "0 4px 24px rgba(15,27,54,0.07)" }}>
                {/* Professional document letterhead */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, borderBottom: "2.5px solid #0f1b36" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", letterSpacing: "0.06em", margin: 0, textTransform: "uppercase" }}>England &amp; Wales</p>
                      <p style={{ fontSize: 9, color: "#475569", margin: 0 }}>Commercial Property — For Solicitor Review</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 9, color: "#475569", margin: 0 }}>
                        {f.documentDate
                          ? new Date(f.documentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                          : "Date: _______________"}
                      </p>
                    </div>
                  </div>
                  <div style={{ height: 3, background: "linear-gradient(90deg, #c9a84c 0%, rgba(201,168,76,0.15) 100%)", margin: "0 0 18px" }} />
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 5px" }}>
                      {f.leaseType}{f.propertyAddress ? ` · ${f.propertyAddress}` : ""}
                    </p>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f1b36", margin: 0, fontFamily: "Georgia, serif", letterSpacing: "-0.01em" }}>
                      {DOCS[activeDoc].label}
                    </h1>
                  </div>
                </div>

                {/* Formatted document body */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                  {renderLegalDoc(DOCS[activeDoc].fn(f))}
                </div>

                {/* Signature Section */}
                <div style={{ marginTop: 40, paddingTop: 24, borderTop: "2px solid #0f1b36" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 24px" }}>Execution</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                    <SignatureBlock
                      signerLabel="Signed by the Landlord"
                      signerName={f.landlordName || "Landlord"}
                      witnessLabel="Witness (Landlord)"
                      showWitness={true}
                      date={f.documentDate}
                    />
                    <SignatureBlock
                      signerLabel="Signed by the Tenant"
                      signerName={f.tenantName || "Tenant"}
                      witnessLabel="Witness (Tenant)"
                      showWitness={true}
                      date={f.documentDate}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: 36, paddingTop: 14, borderTop: "1px solid #e2e8f0" }}>
                  <p style={{ fontSize: 9.5, color: "#475569", margin: 0, lineHeight: 1.5 }}>
                    Strictly subject to contract and without prejudice. Both parties should instruct their own independent legal representation before execution.
                  </p>
                </div>
              </div>

              {/* Acknowledgement checkbox — must tick before printing */}
              <div style={{ marginTop: 20, background: "white", border: `2px solid ${acknowledged ? "#15803d" : "#e2e8f0"}`, borderRadius: 14, padding: 20, transition: "border-color 0.2s" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f1b36", marginBottom: 10 }}>Legal Acknowledgement — Required Before Printing</p>
                <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.65, marginBottom: 16 }}>
                  This document has been automatically generated by the PropertyVault Commercial Lease Assembly System for discussion and solicitor review purposes only. It does not constitute a binding legal document, legal advice, or a completed lease. It must be reviewed and approved by a qualified commercial property solicitor (England &amp; Wales) before execution. Where <strong>[LEGAL REVIEW REQUIRED]</strong> appears in the text, that matter must be specifically addressed by a solicitor before signing. Both parties should instruct their own independent legal representation. PropertyVault UK accepts no liability arising from the use of this document.
                </p>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={e => setAcknowledged(e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: "pointer", accentColor: "#0f1b36" }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0f1b36", lineHeight: 1.5 }}>
                    I understand this is a draft document for discussion only. I will instruct a qualified solicitor to review and approve it before any party signs.
                  </span>
                </label>
                {acknowledged && (
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => window.print()}
                      style={{ fontSize: 13, fontWeight: 700, padding: "10px 24px", borderRadius: 10, background: "#0f1b36", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                      🖨️ Print / Save as PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Solicitor review summary */}
              {(risks.high.length > 0 || risks.medium.length > 0) && (
                <div style={{ marginTop: 24, background: "white", border: "1.5px solid #e8eaf0", borderRadius: 14, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f1b36", marginBottom: 16 }}>Matters Requiring Solicitor Review</h3>
                  {risks.high.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "8px 12px", background: "#fff1f2", borderRadius: 8 }}>
                      <span style={{ color: "#b91c1c", fontSize: 12, flexShrink: 0 }}>HIGH</span>
                      <p style={{ fontSize: 12, color: "#9f1239", lineHeight: 1.5 }}>{r}</p>
                    </div>
                  ))}
                  {risks.medium.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, padding: "8px 12px", background: "#fffbeb", borderRadius: 8 }}>
                      <span style={{ color: "#d97706", fontSize: 12, flexShrink: 0 }}>MED</span>
                      <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>{r}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
