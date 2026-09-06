"use client";

import { useState, useMemo } from "react";
import { SignatureBlock } from "@/components/SignatureBlock";
import { PrintHeader, PrintFooter } from "@/components/PrintDoc";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface F {
  // Landlord
  landlordName: string;
  landlordAddress: string;
  landlordEmail: string;
  landlordPhone: string;
  landlordType: string; // individual | company
  landlordCompany: string;
  // Agent
  agentManaged: string; // yes | no
  agentName: string;
  agentAddress: string;
  agentEmail: string;
  // Property
  propertyAddress: string;
  propertyType: string;
  furnished: string; // furnished | unfurnished | part-furnished
  parking: string;
  garden: string;
  // Tenants
  tenant1Name: string;
  tenant1DOB: string;
  tenant2Name: string;
  tenant2DOB: string;
  tenant3Name: string;
  additionalOccupants: string;
  maxOccupants: string;
  // Term
  startDate: string;
  fixedMonths: string; // number of months
  rentAmount: string;
  rentFrequency: string; // monthly | weekly
  rentDueDay: string;
  paymentMethod: string; // bank-transfer | standing-order | cheque | cash
  landlordBank: string;
  landlordSortCode: string;
  landlordAccountNo: string;
  // Deposit
  depositAmount: string;
  depositScheme: string; // DPS | MyDeposits | TDS
  depositSchemeRef: string;
  // Bills
  councilTax: string; // tenant | landlord
  electricity: string;
  gas: string;
  water: string;
  broadband: string;
  tvLicence: string;
  // Rules
  petsAllowed: string; // yes | no | on-request
  smokingAllowed: string; // yes | no
  alterationsAllowed: string; // yes | no
  sublettingAllowed: string; // yes | no
  accessNotice: string; // 24 | 48
  // Guarantor
  guarantorRequired: string; // yes | no
  guarantorName: string;
  guarantorAddress: string;
  guarantorEmail: string;
  // Special
  additionalTerms: string;
}

const BLANK: F = {
  landlordName: "", landlordAddress: "", landlordEmail: "", landlordPhone: "",
  landlordType: "individual", landlordCompany: "",
  agentManaged: "no", agentName: "", agentAddress: "", agentEmail: "",
  propertyAddress: "", propertyType: "flat", furnished: "unfurnished",
  parking: "no", garden: "no",
  tenant1Name: "", tenant1DOB: "", tenant2Name: "", tenant2DOB: "",
  tenant3Name: "", additionalOccupants: "", maxOccupants: "2",
  startDate: "", fixedMonths: "12", rentAmount: "", rentFrequency: "monthly",
  rentDueDay: "1", paymentMethod: "bank-transfer",
  landlordBank: "", landlordSortCode: "", landlordAccountNo: "",
  depositAmount: "", depositScheme: "DPS", depositSchemeRef: "",
  councilTax: "tenant", electricity: "tenant", gas: "tenant",
  water: "tenant", broadband: "tenant", tvLicence: "tenant",
  petsAllowed: "no", smokingAllowed: "no", alterationsAllowed: "no",
  sublettingAllowed: "no", accessNotice: "24",
  guarantorRequired: "no", guarantorName: "", guarantorAddress: "", guarantorEmail: "",
  additionalTerms: "",
};

const STEPS = [
  "Landlord", "Property", "Tenants", "Term & Rent",
  "Deposit", "Bills", "Rules", "Guarantor",
];

function endDate(start: string, months: string): string {
  if (!start || !months) return "[END DATE]";
  const d = new Date(start);
  d.setMonth(d.getMonth() + parseInt(months));
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function fmt(s: string) {
  if (!s) return "[    ]";
  return s;
}

function fmtDate(s: string) {
  if (!s) return "[DATE]";
  return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function fmtMoney(s: string) {
  if (!s) return "[AMOUNT]";
  return `£${parseFloat(s).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`;
}

function genAST(f: F): string {
  const tenants = [f.tenant1Name, f.tenant2Name, f.tenant3Name].filter(Boolean);
  const tenantsStr = tenants.length ? tenants.join(" and ") : "[TENANT NAME(S)]";
  const endD = endDate(f.startDate, f.fixedMonths);
  const rentFreq = f.rentFrequency === "weekly" ? "per week" : "per calendar month";
  const rentDue = f.rentFrequency === "weekly"
    ? "every Monday"
    : `on the ${f.rentDueDay || "[DAY]"}${["th","st","nd","rd","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","th","st","nd","rd","th","th","th","th","th","th","th","st"][parseInt(f.rentDueDay || "1") - 1] || "th"} of each month`;

  const paymentInstructions = f.paymentMethod === "bank-transfer" || f.paymentMethod === "standing-order"
    ? `by ${f.paymentMethod === "bank-transfer" ? "bank transfer" : "standing order"} to:
   Bank: ${fmt(f.landlordBank)}
   Sort Code: ${fmt(f.landlordSortCode)}
   Account No: ${fmt(f.landlordAccountNo)}
   Reference: [TENANT SURNAME] RENT`
    : `by ${f.paymentMethod}`;

  const billsWho = (party: string) => party === "tenant" ? "the Tenant" : "the Landlord";

  return `ASSURED SHORTHOLD TENANCY AGREEMENT
[LEGAL REVIEW REQUIRED]

This Agreement is made on ${fmtDate(new Date().toISOString().slice(0,10))}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTIES

LANDLORD:  ${f.landlordType === "company" ? `${fmt(f.landlordCompany)} (company), represented by ${fmt(f.landlordName)}` : fmt(f.landlordName)}
Address:   ${fmt(f.landlordAddress)}
Email:     ${fmt(f.landlordEmail)}
Phone:     ${fmt(f.landlordPhone)}
${f.agentManaged === "yes" ? `
MANAGING AGENT: ${fmt(f.agentName)}
Address:        ${fmt(f.agentAddress)}
Email:          ${fmt(f.agentEmail)}
(All notices, rent payments, and day-to-day management enquiries should be directed to the Managing Agent unless stated otherwise.)
` : ""}
TENANT(S): ${tenantsStr}
${f.tenant1Name ? `${f.tenant1Name}${f.tenant1DOB ? ` (DOB: ${fmtDate(f.tenant1DOB)})` : ""}` : ""}
${f.tenant2Name ? `${f.tenant2Name}${f.tenant2DOB ? ` (DOB: ${fmtDate(f.tenant2DOB)})` : ""}` : ""}
${f.tenant3Name ? `${f.tenant3Name}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  THE PROPERTY

1.1 The Landlord lets and the Tenant takes the following property ("the Property"):

    ${fmt(f.propertyAddress)}

1.2 Property type: ${f.propertyType.charAt(0).toUpperCase() + f.propertyType.slice(1)}
1.3 Furnished status: ${f.furnished.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
1.4 Parking included: ${f.parking === "yes" ? "Yes" : "No"}
1.5 Garden/outdoor space: ${f.garden === "yes" ? "Yes" : "No"}
1.6 Maximum permitted occupants: ${fmt(f.maxOccupants)}
${f.additionalOccupants ? `1.7 Named additional occupants (non-tenants): ${f.additionalOccupants}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2.  TENANCY TERM
    [LEGAL REVIEW REQUIRED — Renters' Rights Act 2025 removes fixed-term ASTs; confirm current legislation before execution]

2.1 The tenancy commences on: ${fmtDate(f.startDate)}
2.2 Initial fixed term of ${fmt(f.fixedMonths)} months, ending on: ${endD}
2.3 After the fixed term, the tenancy will continue as a statutory periodic tenancy on a month-to-month basis until brought to an end in accordance with clause 14 and applicable legislation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.  RENT

3.1 The rent is ${fmtMoney(f.rentAmount)} ${rentFreq}.
3.2 Rent is payable in advance, ${rentDue}.
3.3 Rent shall be paid ${paymentInstructions}
3.4 The Tenant must not withhold rent on account of any complaint or alleged breach by the Landlord without seeking legal advice.
3.5 If rent is more than 14 days late, interest may be charged at 3% above the Bank of England base rate from the date it fell due until the date of payment.
3.6 Rent may only be increased in accordance with Section 13 of the Housing Act 1988 (by serving a valid Section 13 Notice) or by written agreement. [LEGAL REVIEW REQUIRED]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.  DEPOSIT

4.1 A tenancy deposit of ${fmtMoney(f.depositAmount)} is payable before the start of the tenancy.
4.2 The deposit will be protected in a government-approved scheme: ${fmt(f.depositScheme)}
4.3 Scheme reference: ${f.depositSchemeRef || "[TO BE CONFIRMED ON RECEIPT]"}
4.4 The Landlord will serve the prescribed information relating to the deposit within 30 days of receipt.
4.5 The deposit may only be deducted from for: unpaid rent, damage beyond fair wear and tear, cleaning (where the property is left materially less clean than at commencement), and any other breach of this Agreement.
4.6 The deposit does not count as rent.
[LEGAL REVIEW REQUIRED — confirm deposit cap does not exceed 5 weeks' rent under Tenant Fees Act 2019]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.  PERMITTED USE

5.1 The Property shall be used solely as a private residential dwelling by the Tenant(s) named in this Agreement and permitted occupants.
5.2 The Tenant shall not use the Property for any business, trade, or commercial purpose without prior written consent.
5.3 The Tenant shall not carry on any immoral, illegal, or anti-social activity at the Property.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6.  BILLS AND OUTGOINGS

6.1 Council Tax:      ${billsWho(f.councilTax)} is responsible.
6.2 Electricity:      ${billsWho(f.electricity)} is responsible.
6.3 Gas:              ${billsWho(f.gas)} is responsible.
6.4 Water:            ${billsWho(f.water)} is responsible.
6.5 Broadband:        ${billsWho(f.broadband)} is responsible for arranging and paying.
6.6 TV Licence:       ${billsWho(f.tvLicence)} is responsible.
6.7 The Tenant is responsible for registering all accounts in their name and notifying relevant providers of their occupation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7.  TENANT OBLIGATIONS

7.1 PAY RENT on time and in full as specified in clause 3.
7.2 CARE FOR THE PROPERTY — keep the Property and its contents in a clean and good condition, having regard to fair wear and tear.
7.3 REPORT REPAIRS — notify the Landlord or Agent promptly (in writing) of any defects, damage, or disrepair. Failure to report may affect deposit deductions.
7.4 ACCESS FOR REPAIRS — permit the Landlord or Agent access on not less than ${fmt(f.accessNotice)} hours' written notice (except in emergency) to inspect or carry out repairs.
7.5 NO ALTERATIONS — not make any alteration, addition, or improvement to the Property without prior written consent. ${f.alterationsAllowed === "yes" ? "(Consent has been granted for minor decorative changes subject to restoration at end of tenancy.)" : ""}
7.6 NO SUBLETTING — not assign, sublet, or part with possession of the Property or any part without prior written consent. ${f.sublettingAllowed === "yes" ? "(Written consent may be sought.)" : "(Subletting is not permitted under any circumstances.)"}
7.7 SMOKING — smoking ${f.smokingAllowed === "yes" ? "is permitted inside the Property" : "is strictly prohibited inside the Property and within 2 metres of any door or window"}.
7.8 PETS — ${f.petsAllowed === "yes" ? "pets are permitted with prior written approval of the specific animal(s). Additional cleaning deposit may be required." : f.petsAllowed === "on-request" ? "pets may be requested in writing; the Landlord will not unreasonably withhold consent in accordance with the Renters' Rights Act 2025. [LEGAL REVIEW REQUIRED]" : "no pets are permitted without the Landlord's prior written consent."}
7.9 NOT TO CAUSE NUISANCE — not to cause or permit nuisance, annoyance, or disturbance to neighbours or other occupants.
7.10 END OF TENANCY — return the Property and all keys in the same condition as at commencement (fair wear and tear excepted), with all personal belongings removed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8.  LANDLORD OBLIGATIONS

8.1 QUIET ENJOYMENT — allow the Tenant quiet enjoyment of the Property throughout the tenancy.
8.2 REPAIRS — keep in good repair the structure and exterior of the Property; installations for supply of water, gas, electricity, heating, and hot water (s.11 Landlord & Tenant Act 1985).
8.3 LEGAL COMPLIANCE — maintain all required safety certificates (Gas Safety, EICR, EPC) and serve the current How to Rent guide on the Tenant.
8.4 DEPOSIT PROTECTION — protect the deposit within 30 days and serve prescribed information.
8.5 NO HARASSMENT — not interfere with the Tenant's right to quiet enjoyment or engage in unlawful eviction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9.  INVENTORY AND CONDITION

9.1 A property inventory and schedule of condition shall be prepared and signed by both parties at commencement and shall form part of this Agreement.
9.2 The Tenant is strongly advised to photograph the property at the start and end of the tenancy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. INSPECTION AND ACCESS

10.1 The Landlord or Agent may inspect the Property on not less than ${fmt(f.accessNotice)} hours' written notice.
10.2 In an emergency (imminent risk to health, safety, or the property), access may be gained without notice.
10.3 The Tenant shall not unreasonably refuse access.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. ALTERATIONS

11.1 The Tenant shall not carry out any structural, decorative, or other alterations to the Property without the Landlord's prior written consent.
11.2 Any permitted alterations shall, unless otherwise agreed in writing, be restored to original condition at the end of the tenancy at the Tenant's expense.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. CONTENTS AND DAMAGE

12.1 The Tenant is responsible for any damage to the Property or its contents caused by themselves, their household, or any visitors, beyond fair wear and tear.
12.2 The Landlord recommends the Tenant obtains contents insurance for their own belongings.
12.3 The Landlord is responsible for insuring the structure and any contents belonging to the Landlord.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. NOTICES

13.1 Any notice under this Agreement shall be in writing.
13.2 Notices to the Tenant shall be left at or sent to the Property address, or emailed to the Tenant's stated email address.
13.3 Notices to the Landlord shall be sent to the address at clause 1 above, or to the Managing Agent where applicable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. ENDING THE TENANCY
    [LEGAL REVIEW REQUIRED — Section 21 is abolished under the Renters' Rights Act 2025; possession is now only available via Section 8 grounds]

14.1 During the fixed term, neither party may end the tenancy unless a break clause has been agreed in writing and appended to this Agreement.
14.2 After the fixed term (periodic tenancy), the Landlord may only seek possession by serving a valid Section 8 Notice citing applicable grounds under Schedule 2 of the Housing Act 1988 as amended.
14.3 The Tenant may end the periodic tenancy by giving not less than one month's written notice, to expire on a rent payment date.
14.4 The Tenant must not leave the Property during the fixed term without the Landlord's written agreement (surrender).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. DISPUTE RESOLUTION

15.1 The parties agree to attempt to resolve any dispute informally in the first instance.
15.2 Deposit disputes shall be referred to the adjudication service of ${fmt(f.depositScheme)}.
15.3 Either party may refer a dispute to the First-tier Tribunal (Property Chamber) or relevant court.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. GENERAL

16.1 This Agreement constitutes the entire agreement between the parties and supersedes all prior representations and negotiations.
16.2 This Agreement is governed by the law of England and Wales.
16.3 If any provision of this Agreement is found to be unenforceable, the remaining provisions shall remain in full force.
16.4 Each Tenant (if more than one) is jointly and severally liable for all obligations under this Agreement.
${f.additionalTerms ? `
17. ADDITIONAL TERMS / SPECIAL CONDITIONS
    [LEGAL REVIEW REQUIRED — confirm these are enforceable and do not contravene the Tenant Fees Act 2019 or other legislation]

${f.additionalTerms}
` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRESCRIBED DOCUMENTS (to be served at commencement)

☐  How to Rent guide (current edition)
☐  Gas Safety Certificate (CP12)
☐  Energy Performance Certificate (EPC — minimum E rating)
☐  Electrical Installation Condition Report (EICR)
☐  Deposit prescribed information (within 30 days)
☐  Property inventory signed by both parties

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTION

SIGNED AS AN AGREEMENT (not as a deed)

LANDLORD
${f.landlordType === "company" ? `
Signed for and on behalf of ${fmt(f.landlordCompany)}:

Authorised signatory: ___________________________

Name (print):        ___________________________

Position:            ___________________________

Date:                ___________________________
` : `
Signature:    ___________________________

Name (print): ___________________________

Date:         ___________________________
`}

TENANT 1
Signature:    ___________________________

Name (print): ${fmt(f.tenant1Name)}

Date:         ___________________________

${f.tenant2Name ? `TENANT 2
Signature:    ___________________________

Name (print): ${fmt(f.tenant2Name)}

Date:         ___________________________
` : ""}${f.tenant3Name ? `TENANT 3
Signature:    ___________________________

Name (print): ${fmt(f.tenant3Name)}

Date:         ___________________________
` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${f.guarantorRequired === "yes" ? `
GUARANTOR — DEED OF GUARANTEE
[LEGAL REVIEW REQUIRED — guarantor deeds should be executed as a deed (signed, witnessed, and delivered)]

The Guarantor named below agrees to guarantee the performance of the Tenant's obligations under this Agreement, including payment of rent and any costs awarded against the Tenant.

Guarantor:    ${fmt(f.guarantorName)}
Address:      ${fmt(f.guarantorAddress)}
Email:        ${fmt(f.guarantorEmail)}

Signed as a deed by the Guarantor:

Signature:    ___________________________

Name (print): ___________________________

Date:         ___________________________

Witnessed by:
Signature:    ___________________________

Name (print): ___________________________

Address:      ___________________________

Date:         ___________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ""}
Both parties should instruct their own independent legal representation.`;
}

const INPUT = "w-full border border-navy-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 bg-white text-navy-800";
const LABEL = "block text-xs font-semibold text-navy-600 mb-1";
const SELECT = INPUT;

export default function ASTPage() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<F>(BLANK);
  const [phase, setPhase] = useState<"form" | "doc">("form");
  const [acknowledged, setAcknowledged] = useState(false);

  const set = (k: keyof F, v: string) => setF(prev => ({ ...prev, [k]: v }));
  const doc = useMemo(() => genAST(f), [f]);

  const tenants = [f.tenant1Name, f.tenant2Name, f.tenant3Name].filter(Boolean);

  const renderLegalDoc = (text: string) => {
    const lines = text.split("\n");
    const els: React.ReactNode[] = [];
    let k = 0;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.match(/^━{5,}/)) { els.push(<hr key={k++} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "18px 0 14px" }} />); continue; }
      if (t === "") { els.push(<div key={k++} style={{ height: 6 }} />); continue; }
      if (t.includes("[LEGAL REVIEW REQUIRED") || t.includes("[TO BE AGREED]") || t.includes("[TO BE CONFIRMED") || t.includes("[TO BE SPECIFIED") || t.includes("[NOT PROVIDED")) {
        els.push(<p key={k++} style={{ fontSize: 11.5, color: "#92400e", background: "#fef3c7", borderLeft: "3px solid #f59e0b", padding: "5px 10px", borderRadius: "0 6px 6px 0", fontFamily: "Georgia,serif", lineHeight: 1.65, margin: "3px 0" }}>{t}</p>); continue;
      }
      if (i === 0) { els.push(<h2 key={k++} style={{ fontSize: 18, fontWeight: 800, color: "#0f1b36", textAlign: "center", letterSpacing: "0.06em", margin: "0 0 4px", fontFamily: "Georgia,serif" }}>{t}</h2>); continue; }
      if (i <= 3 && !t.match(/^\d/) && t.length > 5) { els.push(<p key={k++} style={{ fontSize: 11, color: "#475569", textAlign: "center", fontStyle: "italic", margin: "2px 0", fontFamily: "Georgia,serif" }}>{t}</p>); continue; }
      if (t.match(/^\d+\.[\s\t]+[A-Z][A-Z\s&(),\-/]+$/) && t.length < 70) {
        els.push(<div key={k++} style={{ marginTop: 22, marginBottom: 10 }}><p style={{ fontSize: 11, fontWeight: 800, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>{t}</p><div style={{ height: 2, width: 48, background: "#c9a84c", marginTop: 5 }} /></div>); continue;
      }
      if (t.match(/^\d+\.\d+\s+[A-Z]/)) { els.push(<p key={k++} style={{ fontSize: 12, fontWeight: 700, color: "#0f1b36", margin: "10px 0 3px", fontFamily: "Georgia,serif" }}>{t}</p>); continue; }
      if (t.startsWith("☐") || t.startsWith("□")) { els.push(<p key={k++} style={{ fontSize: 12, color: "#1e293b", fontFamily: "Georgia,serif", lineHeight: 1.7, margin: "3px 0" }}>{t}</p>); continue; }
      const kv = t.match(/^([A-Za-z][^:]{1,40}):\s{2,}(.*)/);
      if (kv) {
        els.push(<div key={k++} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, marginBottom: 5, alignItems: "start" }}><span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.5, paddingTop: 1 }}>{kv[1]}</span><span style={{ fontSize: 12, color: "#1e293b", fontFamily: "Georgia,serif", lineHeight: 1.65 }}>{kv[2] || "—"}</span></div>); continue;
      }
      els.push(<p key={k++} style={{ fontSize: 12, color: "#1e293b", fontFamily: "Georgia,serif", lineHeight: 1.75, margin: "3px 0" }}>{t}</p>);
    }
    return <div>{els}</div>;
  };

  if (phase === "doc") {
    return (
      <>
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #print-doc, #print-doc * { visibility: visible !important; }
            #print-doc { position: absolute; left: 0; top: 0; width: 100%; padding: 18mm 20mm; background: white; font-family: Georgia, serif; font-size: 11pt; }
            @page { size: A4; margin: 0; }
            #print-doc h2 { font-size: 16pt; }
            #print-doc p, #print-doc span { font-size: 10.5pt; }
            .no-print { display: none !important; }
          }
        `}</style>

        <section className="gradient-navy py-10 px-4 no-print">
          <div className="container-max">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-wider mb-2">FREE TEMPLATE · LANDLORD</p>
            <h1 className="text-2xl font-bold text-white mb-1">Assured Shorthold Tenancy Agreement</h1>
            <p className="text-navy-200 text-sm">{f.propertyAddress || "Draft document"}</p>
          </div>
        </section>

        <div className="bg-amber-50 border-b border-amber-200 no-print">
          <div className="container-max px-4 py-3">
            <p className="text-xs text-amber-800 font-semibold">⚠️ Draft document only — this is not legal advice. Have this agreement reviewed by a qualified solicitor before any party signs. Tenancy law changes frequently and local circumstances vary.</p>
          </div>
        </div>

        <div className="no-print" style={{ borderBottom: "1px solid #e4e8f0", background: "white", position: "sticky", top: 0, zIndex: 10 }}>
          <div className="container-max px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => setPhase("form")}
              style={{ background: "#0f1b36", color: "white", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              ← Edit
            </button>
            <button
              onClick={() => window.print()}
              style={{ background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        <section className="section-padding bg-slate-50">
          <div className="container-max max-w-3xl">
            <div id="print-doc" style={{ background: "white", color: "#1a1a1a", borderRadius: 16, border: "1.5px solid #e4e8f0", padding: 40, fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.7 }}>
              <PrintHeader
                category="Residential Tenancy Agreement · England"
                title="Assured Shorthold Tenancy Agreement"
                date={f.startDate || new Date().toISOString().slice(0, 10)}
              />

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                {renderLegalDoc(doc)}
              </div>

              <SignatureBlock
                signerLabel="Signed (Landlord / Agent)"
                signerName={f.agentManaged === "yes" ? f.agentName : f.landlordName}
                witnessLabel="Witness to Landlord Signature"
                showWitness={true}
                date={f.startDate}
              />

              {tenants.map((name, i) => (
                <SignatureBlock
                  key={i}
                  signerLabel={`Signed (Tenant ${tenants.length > 1 ? i + 1 : ""})`}
                  signerName={name}
                  witnessLabel="Witness to Tenant Signature"
                  showWitness={true}
                  date={f.startDate}
                />
              ))}

              {f.guarantorName && (
                <SignatureBlock
                  signerLabel="Signed (Guarantor)"
                  signerName={f.guarantorName}
                  witnessLabel="Witness to Guarantor Signature"
                  showWitness={true}
                  date={f.startDate}
                />
              )}

              <PrintFooter
                docTitle="Assured Shorthold Tenancy Agreement"
                note="England · Housing Act 1988 (as amended) · Renters' Rights Act 2025"
              />
            </div>

            {/* Acknowledgement gate */}
            <div style={{ marginTop: 24, background: "white", border: acknowledged ? "2px solid #15803d" : "2px solid #e4e8f0", borderRadius: 16, padding: 24 }} className="no-print">
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f1b36", marginBottom: 12 }}>⚠️ Legal Acknowledgement — Required Before Printing</h3>
              <p style={{ fontSize: 13, color: "#374151", marginBottom: 16, lineHeight: 1.6 }}>
                This document has been automatically generated for discussion purposes only. It does not constitute legal advice or a valid tenancy agreement without review by a qualified solicitor. Tenancy law changes frequently — clauses marked <strong>[LEGAL REVIEW REQUIRED]</strong> must be verified before execution. PropertyVault UK accepts no liability arising from use of this document.
              </p>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)}
                  style={{ width: 18, height: 18, marginTop: 2, accentColor: "#15803d", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1b36", lineHeight: 1.5 }}>
                  I understand this is a draft document. I will have it reviewed by a qualified solicitor before any party signs.
                </span>
              </label>
              {acknowledged && (
                <button onClick={() => window.print()}
                  style={{ marginTop: 16, background: "#0f1b36", color: "white", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  🖨️ Print / Save as PDF
                </button>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div style={{ background: "#f5f2ec", minHeight: "100vh" }}>
      {/* Header */}
      <section className="gradient-navy py-12 px-4">
        <div className="container-max">
          <Breadcrumbs items={[{ label: "Templates", href: "/templates" }, { label: "AST" }]} />
          <p className="text-gold-400 font-semibold text-xs uppercase tracking-wider mb-2">FREE TEMPLATE · LANDLORD</p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>
            Assured Shorthold Tenancy
          </h1>
          <p className="text-navy-200 text-sm max-w-xl">Generate a draft AST agreement for residential lettings in England. Updated for the Renters' Rights Act 2025.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Renters' Rights Act 2025", "Deposit Protection", "Section 8 Only", "Guarantor Block"].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container-max px-4 py-3">
          <p className="text-xs text-amber-800 font-semibold">⚠️ Legal document — this generator produces a draft AST for discussion purposes only. Always have a tenancy agreement reviewed by a qualified solicitor before signing. Not legal advice.</p>
        </div>
      </div>

      {/* Step progress */}
      <div className="container-max px-4 py-6">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => setStep(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{ background: i === step ? "#0f1b36" : i < step ? "#e8f5e9" : "#e4e8f0", color: i === step ? "white" : i < step ? "#15803d" : "#475569" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: i === step ? "rgba(255,255,255,0.2)" : i < step ? "#15803d" : "#cbd5e1", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: i < step ? "white" : "inherit" }}>
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 p-6 mt-4">

          {/* Step 0: Landlord */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Landlord Details</h2>
              <div>
                <label htmlFor="ast-landlord-type" className={LABEL}>Landlord type</label>
                <select id="ast-landlord-type" value={f.landlordType} onChange={e => set("landlordType", e.target.value)} className={SELECT}>
                  <option value="individual">Individual (private landlord)</option>
                  <option value="company">Company / Ltd</option>
                </select>
              </div>
              {f.landlordType === "company" && (
                <div>
                  <label htmlFor="ast-company-name" className={LABEL}>Company name *</label>
                  <input id="ast-company-name" value={f.landlordCompany} onChange={e => set("landlordCompany", e.target.value)} placeholder="e.g. Smith Properties Ltd" className={INPUT} />
                </div>
              )}
              <div>
                <label htmlFor="ast-full-name-landlord-director" className={LABEL}>Full name (landlord / director) *</label>
                <input id="ast-full-name-landlord-director" value={f.landlordName} onChange={e => set("landlordName", e.target.value)} placeholder="Full legal name" className={INPUT} />
              </div>
              <div>
                <label htmlFor="ast-landlord-address-for-notices" className={LABEL}>Landlord address (for notices) *</label>
                <input id="ast-landlord-address-for-notices" value={f.landlordAddress} onChange={e => set("landlordAddress", e.target.value)} placeholder="Full address including postcode" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ast-email" className={LABEL}>Email *</label>
                  <input id="ast-email" type="email" value={f.landlordEmail} onChange={e => set("landlordEmail", e.target.value)} placeholder="landlord@email.com" className={INPUT} />
                </div>
                <div>
                  <label htmlFor="ast-phone" className={LABEL}>Phone</label>
                  <input id="ast-phone" value={f.landlordPhone} onChange={e => set("landlordPhone", e.target.value)} placeholder="07700 900000" className={INPUT} />
                </div>
              </div>
              <div>
                <label htmlFor="ast-is-the-property-managed" className={LABEL}>Is the property managed by an agent?</label>
                <select id="ast-is-the-property-managed" value={f.agentManaged} onChange={e => set("agentManaged", e.target.value)} className={SELECT}>
                  <option value="no">No — landlord manages directly</option>
                  <option value="yes">Yes — managed by a letting agent</option>
                </select>
              </div>
              {f.agentManaged === "yes" && (
                <div className="space-y-3 p-4 bg-navy-50 rounded-xl">
                  <p className="text-xs font-semibold text-navy-600 uppercase tracking-wide">Managing Agent Details</p>
                  <input aria-label="Agent / company name" value={f.agentName} onChange={e => set("agentName", e.target.value)} placeholder="Agent / company name" className={INPUT} />
                  <input aria-label="Agent address" value={f.agentAddress} onChange={e => set("agentAddress", e.target.value)} placeholder="Agent address" className={INPUT} />
                  <input aria-label="Agent email" type="email" value={f.agentEmail} onChange={e => set("agentEmail", e.target.value)} placeholder="Agent email" className={INPUT} />
                </div>
              )}
            </div>
          )}

          {/* Step 1: Property */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Property Details</h2>
              <div>
                <label htmlFor="ast-property-address" className={LABEL}>Property address *</label>
                <input id="ast-property-address" value={f.propertyAddress} onChange={e => set("propertyAddress", e.target.value)} placeholder="Full address including postcode" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ast-property-type" className={LABEL}>Property type</label>
                  <select id="ast-property-type" value={f.propertyType} onChange={e => set("propertyType", e.target.value)} className={SELECT}>
                    <option value="flat">Flat / Apartment</option>
                    <option value="house">House</option>
                    <option value="terraced house">Terraced House</option>
                    <option value="semi-detached house">Semi-Detached House</option>
                    <option value="detached house">Detached House</option>
                    <option value="studio">Studio</option>
                    <option value="maisonette">Maisonette</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ast-furnished-status" className={LABEL}>Furnished status</label>
                  <select id="ast-furnished-status" value={f.furnished} onChange={e => set("furnished", e.target.value)} className={SELECT}>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="part-furnished">Part Furnished</option>
                    <option value="furnished">Fully Furnished</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ast-parking-included" className={LABEL}>Parking included?</label>
                  <select id="ast-parking-included" value={f.parking} onChange={e => set("parking", e.target.value)} className={SELECT}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ast-garden-outdoor-space" className={LABEL}>Garden / outdoor space?</label>
                  <select id="ast-garden-outdoor-space" value={f.garden} onChange={e => set("garden", e.target.value)} className={SELECT}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="ast-maximum-permitted-occupants" className={LABEL}>Maximum permitted occupants</label>
                <input id="ast-maximum-permitted-occupants" type="number" min="1" max="10" value={f.maxOccupants} onChange={e => set("maxOccupants", e.target.value)} className={INPUT} />
              </div>
            </div>
          )}

          {/* Step 2: Tenants */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Tenant Details</h2>
              <p className="text-xs text-navy-400">All adults living at the property should be named as tenants (joint &amp; several liability).</p>
              <div className="space-y-3 p-4 bg-navy-50 rounded-xl">
                <p className="text-xs font-semibold text-navy-600 uppercase">Tenant 1 *</p>
                <div className="grid grid-cols-2 gap-3">
                  <input aria-label="Tenant 1 full legal name" value={f.tenant1Name} onChange={e => set("tenant1Name", e.target.value)} placeholder="Full legal name" className={INPUT} />
                  <input aria-label="Tenant 1 date of birth" type="date" value={f.tenant1DOB} onChange={e => set("tenant1DOB", e.target.value)} className={INPUT} />
                </div>
              </div>
              <div className="space-y-3 p-4 bg-navy-50 rounded-xl">
                <p className="text-xs font-semibold text-navy-600 uppercase">Tenant 2 (if applicable)</p>
                <div className="grid grid-cols-2 gap-3">
                  <input aria-label="Tenant 2 full legal name" value={f.tenant2Name} onChange={e => set("tenant2Name", e.target.value)} placeholder="Full legal name" className={INPUT} />
                  <input aria-label="Tenant 2 date of birth" type="date" value={f.tenant2DOB} onChange={e => set("tenant2DOB", e.target.value)} className={INPUT} />
                </div>
              </div>
              <div className="space-y-3 p-4 bg-navy-50 rounded-xl">
                <p className="text-xs font-semibold text-navy-600 uppercase">Tenant 3 (if applicable)</p>
                <input aria-label="Tenant 3 full legal name" value={f.tenant3Name} onChange={e => set("tenant3Name", e.target.value)} placeholder="Full legal name" className={INPUT} />
              </div>
              <div>
                <label htmlFor="ast-additional-permitted-occupants-non" className={LABEL}>Additional permitted occupants (non-tenants, e.g. children)</label>
                <input id="ast-additional-permitted-occupants-non" value={f.additionalOccupants} onChange={e => set("additionalOccupants", e.target.value)} placeholder="e.g. Two children under 18" className={INPUT} />
              </div>
            </div>
          )}

          {/* Step 3: Term & Rent */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Term & Rent</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ast-tenancy-start-date" className={LABEL}>Tenancy start date *</label>
                  <input id="ast-tenancy-start-date" type="date" value={f.startDate} onChange={e => set("startDate", e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label htmlFor="ast-fixed-term-months" className={LABEL}>Fixed term (months)</label>
                  <select id="ast-fixed-term-months" value={f.fixedMonths} onChange={e => set("fixedMonths", e.target.value)} className={SELECT}>
                    {["6","12","18","24","36"].map(m => <option key={m} value={m}>{m} months</option>)}
                  </select>
                </div>
              </div>
              {f.startDate && (
                <div className="bg-gold-50 border border-gold-200 rounded-xl px-4 py-3 text-sm text-navy-700">
                  Fixed term ends: <strong>{endDate(f.startDate, f.fixedMonths)}</strong> — then converts to periodic month-to-month.
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ast-rent-amount" className={LABEL}>Rent amount (£) *</label>
                  <input id="ast-rent-amount" type="number" value={f.rentAmount} onChange={e => set("rentAmount", e.target.value)} placeholder="e.g. 900" className={INPUT} />
                </div>
                <div>
                  <label htmlFor="ast-rent-frequency" className={LABEL}>Rent frequency</label>
                  <select id="ast-rent-frequency" value={f.rentFrequency} onChange={e => set("rentFrequency", e.target.value)} className={SELECT}>
                    <option value="monthly">Monthly (PCM)</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>{f.rentFrequency === "monthly" ? "Rent due day (1–28)" : "Rent due (day of week)"}</label>
                  {f.rentFrequency === "monthly"
                    ? <input type="number" min="1" max="28" value={f.rentDueDay} onChange={e => set("rentDueDay", e.target.value)} className={INPUT} />
                    : <select value={f.rentDueDay} onChange={e => set("rentDueDay", e.target.value)} className={SELECT}>
                        {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => <option key={d}>{d}</option>)}
                      </select>
                  }
                </div>
                <div>
                  <label htmlFor="ast-payment-method" className={LABEL}>Payment method</label>
                  <select id="ast-payment-method" value={f.paymentMethod} onChange={e => set("paymentMethod", e.target.value)} className={SELECT}>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="standing-order">Standing Order</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
              {(f.paymentMethod === "bank-transfer" || f.paymentMethod === "standing-order") && (
                <div className="space-y-3 p-4 bg-navy-50 rounded-xl">
                  <p className="text-xs font-semibold text-navy-600 uppercase">Bank details for payment</p>
                  <input aria-label="Bank name (e.g. Barclays)" value={f.landlordBank} onChange={e => set("landlordBank", e.target.value)} placeholder="Bank name (e.g. Barclays)" className={INPUT} />
                  <div className="grid grid-cols-2 gap-3">
                    <input aria-label="Sort code (XX-XX-XX)" value={f.landlordSortCode} onChange={e => set("landlordSortCode", e.target.value)} placeholder="Sort code (XX-XX-XX)" className={INPUT} />
                    <input aria-label="Account number" value={f.landlordAccountNo} onChange={e => set("landlordAccountNo", e.target.value)} placeholder="Account number" className={INPUT} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Deposit */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Deposit</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                <strong>Tenant Fees Act 2019:</strong> Deposit must not exceed 5 weeks' rent ({f.rentAmount ? `£${(parseFloat(f.rentAmount) * (f.rentFrequency === "weekly" ? 5 : 12 / 52 * 5)).toFixed(0)} max` : "calculate: monthly rent × 12 ÷ 52 × 5"}).
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ast-deposit-amount" className={LABEL}>Deposit amount (£) *</label>
                  <input id="ast-deposit-amount" type="number" value={f.depositAmount} onChange={e => set("depositAmount", e.target.value)} placeholder="e.g. 1038" className={INPUT} />
                </div>
                <div>
                  <label htmlFor="ast-deposit-protection-scheme" className={LABEL}>Deposit protection scheme *</label>
                  <select id="ast-deposit-protection-scheme" value={f.depositScheme} onChange={e => set("depositScheme", e.target.value)} className={SELECT}>
                    <option value="DPS">Deposit Protection Service (DPS)</option>
                    <option value="MyDeposits">MyDeposits</option>
                    <option value="TDS">Tenancy Deposit Scheme (TDS)</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="ast-scheme-reference-if-known" className={LABEL}>Scheme reference (if known)</label>
                <input id="ast-scheme-reference-if-known" value={f.depositSchemeRef} onChange={e => set("depositSchemeRef", e.target.value)} placeholder="Leave blank to confirm later" className={INPUT} />
              </div>
            </div>
          )}

          {/* Step 5: Bills */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Bills & Services</h2>
              <p className="text-xs text-navy-400">Who is responsible for each bill? Most residential tenancies: tenant pays all.</p>
              {([
                ["councilTax", "Council Tax"],
                ["electricity", "Electricity"],
                ["gas", "Gas"],
                ["water", "Water"],
                ["broadband", "Broadband / Internet"],
                ["tvLicence", "TV Licence"],
              ] as [keyof F, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-navy-100">
                  <span className="text-sm font-medium text-navy-700">{label}</span>
                  <select value={f[key] as string} onChange={e => set(key, e.target.value)}
                    className="text-xs font-semibold border border-navy-200 rounded-lg px-3 py-1.5 bg-white text-navy-800 focus:outline-none">
                    <option value="tenant">Tenant pays</option>
                    <option value="landlord">Landlord pays</option>
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Step 6: Rules */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">House Rules</h2>
              {([
                ["petsAllowed", "Pets", [["no","Not permitted"],["on-request","On written request (Renters' Rights Act)"],["yes","Permitted (with approval)"]]],
                ["smokingAllowed", "Smoking indoors", [["no","Not permitted"],["yes","Permitted"]]],
                ["alterationsAllowed", "Alterations / DIY", [["no","Not permitted"],["yes","Minor decorative — with consent"]]],
                ["sublettingAllowed", "Subletting / lodgers", [["no","Not permitted"],["yes","Permitted — with written consent"]]],
                ["accessNotice", "Notice for access", [["24","24 hours' written notice"],["48","48 hours' written notice"]]],
              ] as [keyof F, string, [string, string][]][]).map(([key, label, opts]) => (
                <div key={key}>
                  <label className={LABEL}>{label}</label>
                  <select aria-label={label} value={f[key] as string} onChange={e => set(key, e.target.value)} className={SELECT}>
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label htmlFor="ast-additional-special-terms" className={LABEL}>Additional / special terms</label>
                <textarea id="ast-additional-special-terms" value={f.additionalTerms} onChange={e => set("additionalTerms", e.target.value)}
                  rows={4} placeholder="Any extra clauses or conditions specific to this tenancy..." className={INPUT} />
              </div>
            </div>
          )}

          {/* Step 7: Guarantor */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-navy-800">Guarantor</h2>
              <div>
                <label htmlFor="ast-is-a-guarantor-required" className={LABEL}>Is a guarantor required?</label>
                <select id="ast-is-a-guarantor-required" value={f.guarantorRequired} onChange={e => set("guarantorRequired", e.target.value)} className={SELECT}>
                  <option value="no">No guarantor required</option>
                  <option value="yes">Yes — include deed of guarantee</option>
                </select>
              </div>
              {f.guarantorRequired === "yes" && (
                <div className="space-y-3 p-4 bg-navy-50 rounded-xl">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                    A guarantor deed should be executed as a deed (signed, witnessed, and delivered) and ideally reviewed by the guarantor's own solicitor.
                  </div>
                  <input aria-label="Guarantor full legal name *" value={f.guarantorName} onChange={e => set("guarantorName", e.target.value)} placeholder="Guarantor full legal name *" className={INPUT} />
                  <input aria-label="Guarantor address *" value={f.guarantorAddress} onChange={e => set("guarantorAddress", e.target.value)} placeholder="Guarantor address *" className={INPUT} />
                  <input aria-label="Guarantor email" type="email" value={f.guarantorEmail} onChange={e => set("guarantorEmail", e.target.value)} placeholder="Guarantor email" className={INPUT} />
                </div>
              )}

              {/* Summary before generating */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm">
                <p className="font-bold text-green-800 mb-2">✓ Ready to generate</p>
                <div className="space-y-1 text-green-700 text-xs">
                  <p>Property: {f.propertyAddress || "—"}</p>
                  <p>Tenant(s): {tenants.join(", ") || "—"}</p>
                  <p>Start: {f.startDate ? fmtDate(f.startDate) : "—"} · {f.fixedMonths} months</p>
                  <p>Rent: {f.rentAmount ? fmtMoney(f.rentAmount) : "—"} {f.rentFrequency === "monthly" ? "PCM" : "p/w"}</p>
                  <p>Deposit: {f.depositAmount ? fmtMoney(f.depositAmount) : "—"} · {f.depositScheme}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4" style={{ borderTop: "1px solid #e4e8f0" }}>
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{ background: "white", color: "#0f1b36", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.35 : 1 }}
            >
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                style={{ background: "#0f1b36", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setPhase("doc")}
                style={{ background: "#c9a84c", color: "#0f1b36", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Generate Agreement →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
