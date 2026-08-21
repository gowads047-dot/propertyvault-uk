import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Compliance — Makan",
  description: "How Makan keeps landlords and tenants safe, legal, and protected across all 10 countries. Per-country compliance guides.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/compliance/" },
};

const countries = [
  {
    code: "gb", flag: "🇬🇧", name: "United Kingdom",
    risk: "medium",
    platformNote: "Makan operates as an advertising platform under the Electronic Commerce Regulations 2002 — we are not a letting agent and do not charge fees. Landlords retain full legal responsibility for their tenancies.",
    landlordMust: [
      { req: "Right to Rent check", detail: "Before any tenancy begins, landlords must verify the tenant has a legal right to live in the UK (Immigration Act 2014). Criminal liability for landlords who skip this — up to 5 years imprisonment.", critical: true },
      { req: "EPC Certificate (min grade E)", detail: "An Energy Performance Certificate is legally required for all rentals. Letting below an E rating is a criminal offence (Energy Efficiency Regulations 2018).", critical: true },
      { req: "Gas Safety Certificate", detail: "Annual inspection by a Gas Safe registered engineer. Landlords must provide a copy to tenants before move-in. Criminal offence if missed.", critical: true },
      { req: "Electrical Safety (EICR)", detail: "A full electrical inspection every 5 years by a qualified electrician. Required for all tenancies since April 2021.", critical: true },
      { req: "Deposit Protection Scheme", detail: "All deposits must be held in a government-approved scheme (TDS, DPS, or MyDeposits) within 30 days. Failure is a criminal offence — the court may award the tenant 1–3x the deposit amount.", critical: true },
      { req: "HMO Licence (if applicable)", detail: "Properties with 5+ occupants forming 2+ households require a mandatory HMO licence from the local council. Some areas require a licence for smaller HMOs.", critical: false },
      { req: "Smoke & Carbon Monoxide Alarms", detail: "At least one smoke alarm on each storey and CO alarm in any room with a fixed combustion appliance.", critical: false },
      { req: "Tenant Fees Act 2019", detail: "Landlords cannot charge tenants for referencing, admin, or credit checks. Only permitted payments: rent, deposit (max 5 weeks), holding deposit (max 1 week), early termination, utilities, and default fees.", critical: false },
    ],
    tenantRights: [
      "You have the right to request proof of deposit protection within 30 days of paying",
      "You cannot be charged prohibited fees under the Tenant Fees Act 2019",
      "You have the right to a habitable property — report serious disrepair to your local council",
      "Section 21 'no fault' evictions are abolished — your landlord must use Section 8 with a specific legal ground to seek possession",
    ],
    privacyLaw: "UK GDPR / Data Protection Act 2018 — governed by the ICO",
    foreignBuy: "No restrictions on foreign ownership or renting. Right to Rent checks apply to all tenants.",
  },
  {
    code: "ma", flag: "🇲🇦", name: "Morocco",
    risk: "low",
    platformNote: "Makan is an advertising platform. We are not a licensed real estate agent in Morocco. Moroccan law requires licensed agents (agences immobilières) to be registered with the relevant authority — private landlords listing directly are generally exempt.",
    landlordMust: [
      { req: "Written tenancy agreement (contrat de bail)", detail: "A written lease is strongly recommended and legally enforceable. Oral agreements are legally recognised but create disputes. Register with the tax authority for rental income declaration.", critical: false },
      { req: "Declare rental income", detail: "Rental income is subject to income tax in Morocco. Landlords must declare it annually to the Direction Générale des Impôts. Failure can result in back-taxes and penalties.", critical: false },
      { req: "Repatriation rules for foreign landlords", detail: "If you are a non-resident landlord, proceeds from property sales/rental income can be repatriated but must be processed through an authorised Moroccan bank. Keep all transaction records.", critical: false },
    ],
    tenantRights: [
      "Tenants have strong protections under Moroccan law — eviction requires court order",
      "Landlord must provide a habitable property",
      "Rent increases are regulated — landlord cannot raise rent arbitrarily during a fixed-term lease",
    ],
    privacyLaw: "Law 09-08 on Personal Data Protection — governed by CNDP",
    foreignBuy: "Open to foreign buyers. Funds must be imported via authorised bank. Proceeds can be repatriated.",
  },
  {
    code: "eg", flag: "🇪🇬", name: "Egypt",
    risk: "low",
    platformNote: "Makan is an advertising platform. We are not a licensed real estate broker in Egypt. We facilitate connections between landlords and tenants — all agreements, contracts and due diligence are the responsibility of the parties involved.",
    landlordMust: [
      { req: "Register the tenancy", detail: "Long-term rental contracts should be registered with the Real Estate Registry (Shahr Aqari) for legal enforceability. Unregistered leases still have some legal standing but are harder to enforce.", critical: false },
      { req: "Declare rental income", detail: "Rental income is subject to income tax. The Egyptian Tax Authority requires annual declaration. Non-compliance can result in penalties.", critical: false },
      { req: "Foreign-owned property restrictions", detail: "Foreigners cannot own agricultural land or land in border areas. New developments in protected zones may have additional restrictions. Verify with a local notary.", critical: false },
    ],
    tenantRights: [
      "Egyptian law protects long-term tenants strongly — eviction without cause through courts can take years",
      "For new-law contracts (post-1996), eviction is more straightforward at lease end",
      "Deposits are typically 1-3 months and should be returned within a reasonable period after move-out",
    ],
    privacyLaw: "Personal Data Protection Law No. 151/2020 — one of the first comprehensive data laws in Africa",
    foreignBuy: "Foreign nationals can own most property types. Restrictions apply to agricultural land and border zones.",
  },
  {
    code: "ae", flag: "🇦🇪", name: "UAE",
    risk: "high",
    platformNote: "IMPORTANT: In Dubai, real estate brokerage activity requires a RERA licence (Real Estate Regulatory Authority). Makan is strictly an advertising platform — we do not act as brokers, do not handle transactions, and do not collect commissions. Landlords and tenants must conduct all negotiations directly.",
    landlordMust: [
      { req: "Ejari Registration (Dubai)", detail: "ALL tenancy contracts in Dubai MUST be registered with Ejari before the tenant moves in. Unregistered contracts cannot be enforced. Registration is done via the Dubai Land Department portal.", critical: true },
      { req: "Tawtheeq Registration (Abu Dhabi)", detail: "Abu Dhabi's equivalent of Ejari. All tenancy contracts must be registered with Abu Dhabi Municipality.", critical: true },
      { req: "Rent increases: RERA Rent Calculator", detail: "Dubai landlords CANNOT increase rent beyond the RERA-regulated percentage. Tenants must be given 90 days' written notice of any increase. Check the RERA Rent Index before advertising.", critical: true },
      { req: "Eviction: 12 months' notice required", detail: "To evict a tenant for personal use or demolition/renovation, Dubai landlords must give 12 months' written notice via a notary public. No-fault eviction at lease end requires the same.", critical: true },
      { req: "NOC for subletting", detail: "Tenants subletting require written landlord permission. Landlords cannot withhold permission unreasonably for licensed short-term rentals.", critical: false },
      { req: "DTCM permit for holiday lets (Dubai)", detail: "Short-term holiday lets in Dubai require a permit from the Dubai Tourism and Commerce Marketing authority (DTCM). Illegal short-term letting can result in heavy fines.", critical: true },
    ],
    tenantRights: [
      "Rent increase is capped — use the official RERA Rent Calculator to check if an increase is legal",
      "Landlords cannot evict without proper notice periods through the Rental Dispute Centre",
      "PDC (post-dated cheques) are the standard payment method — do not pay in cash without a receipt",
      "Ejari registration protects your tenancy rights — ensure it is done before moving in",
    ],
    privacyLaw: "UAE Federal Decree-Law No. 45/2021 on Personal Data Protection (PDPL) — applies to all data processing in the UAE",
    foreignBuy: "Full freehold ownership for all nationalities in designated zones. Requires standard KYC. Golden Visa available for investments over AED 2M.",
  },
  {
    code: "sa", flag: "🇸🇦", name: "Saudi Arabia",
    risk: "high",
    platformNote: "Makan is an advertising platform. Real estate activity in Saudi Arabia is regulated by the Real Estate General Authority (REGA). We do not act as agents or brokers. All licensed agents on Makan should hold valid REGA-registered licences.",
    landlordMust: [
      { req: "Ejar Platform Registration", detail: "Saudi Arabia's Ministry of Housing requires all rental contracts to be registered on the Ejar platform. Unregistered contracts cannot be enforced and landlords cannot use legal remedies to recover rent.", critical: true },
      { req: "REGA-licensed agents only", detail: "Real estate brokers must be registered with the Real Estate General Authority (REGA). Using unlicensed brokers is illegal. Landlords listing directly are exempt but should verify agent credentials.", critical: false },
      { req: "No residential ownership for non-GCC foreigners (general rule)", detail: "Foreign nationals other than GCC citizens generally cannot own residential real estate in Saudi Arabia. Exceptions exist in designated investment zones under Vision 2030. This rule is changing — verify current status with REGA.", critical: true },
      { req: "Real Estate Transaction Tax (RETT)", detail: "A 5% RETT applies to all real estate transfers. VAT at 15% applies to commercial real estate transactions.", critical: false },
    ],
    tenantRights: [
      "Ejar-registered contracts give tenants legal protection and enforceability",
      "Landlords cannot evict without proper Ejar process and notice",
      "Discriminatory rental practices are prohibited under Saudi law",
    ],
    privacyLaw: "Saudi Personal Data Protection Law (PDPL) 2021 — enforced by the National Data Management Office (NDMO)",
    foreignBuy: "Non-GCC foreigners generally CANNOT own residential property. Permitted in specific investment zones. Verify with REGA before proceeding.",
  },
  {
    code: "kw", flag: "🇰🇼", name: "Kuwait",
    risk: "high",
    platformNote: "IMPORTANT: Foreign nationals (non-GCC) CANNOT own residential property in Kuwait. Makan shows Kuwait listings for rental purposes only. Ownership enquiries must be directed to a qualified Kuwaiti lawyer.",
    landlordMust: [
      { req: "Written tenancy agreement", detail: "Rental contracts should be written and clearly specify rent, duration, and payment terms. Disputes are handled by the Ministry of Justice's Real Estate Committee.", critical: false },
      { req: "No foreign residential ownership", detail: "Only Kuwaiti nationals and GCC citizens can own residential property in Kuwait. Foreigners can only lease.", critical: true },
      { req: "Property registration", detail: "Property transfers must be registered with the Ministry of Justice Real Estate Registration Department.", critical: false },
    ],
    tenantRights: [
      "Tenants have rights to habitable conditions — report serious issues to the municipality",
      "Lease terms are enforceable in Kuwaiti courts",
      "Expats can rent freely — ownership restrictions do not affect renting",
    ],
    privacyLaw: "Kuwait does not yet have a comprehensive data protection law. Processing of personal data should follow international best practice.",
    foreignBuy: "Foreign nationals CANNOT own residential property. GCC nationals can purchase. Foreigners may rent freely.",
  },
  {
    code: "bh", flag: "🇧🇭", name: "Bahrain",
    risk: "low",
    platformNote: "Bahrain has one of the most open property markets in the Gulf. Real estate brokerage is regulated by RERA Bahrain — brokers must be licensed. Makan is an advertising platform, not a licensed broker.",
    landlordMust: [
      { req: "RERA Bahrain registration (agents only)", detail: "Real estate agents and brokers must hold a valid RERA Bahrain licence. Private landlords listing directly do not require a licence.", critical: false },
      { req: "Written tenancy contract", detail: "Tenancy contracts should be in writing. Long-term leases are governed by Decree Law No. 27 of 2017.", critical: false },
      { req: "No property tax", detail: "Bahrain has no property tax, capital gains tax, or inheritance tax on real estate — a major advantage for investors.", critical: false },
    ],
    tenantRights: [
      "Tenants have legal protections under Bahraini tenancy law",
      "Rent increases must be notified in advance as specified in the contract",
      "Disputes are handled by the Real Estate Dispute Settlement Centre",
    ],
    privacyLaw: "Bahrain Personal Data Protection Law (PDPL 2018) — one of the first in the GCC",
    foreignBuy: "Full freehold ownership for all nationalities — no restrictions. No property tax.",
  },
  {
    code: "qa", flag: "🇶🇦", name: "Qatar",
    risk: "medium",
    platformNote: "Real estate brokerage in Qatar requires a licence from the Real Estate Regulatory Authority (RERA Qatar). Makan is an advertising platform — we do not broker transactions.",
    landlordMust: [
      { req: "Rent Registration", detail: "Tenancy contracts should be registered with the Ministry of Municipality. Registration provides legal enforceability.", critical: false },
      { req: "RERA Qatar compliance (for agents)", detail: "All real estate brokers and agents must be licensed by RERA Qatar. Landlords listing directly are generally exempt.", critical: false },
      { req: "Foreign ownership zones", detail: "Non-Qatari nationals can only purchase property in designated freehold or leasehold zones (as per Law No. 16 of 2018). A residence permit is granted with qualifying purchases.", critical: false },
      { req: "Rental laws", detail: "Landlords cannot increase rent more than once per lease term unless agreed otherwise. Evictions require proper notice through legal channels.", critical: false },
    ],
    tenantRights: [
      "Tenants cannot be evicted mid-lease without cause",
      "Rent increases are regulated during the lease period",
      "Work Accommodation Standards apply to properties housing workers",
    ],
    privacyLaw: "Qatar Personal Data Privacy Protection Law No. 13/2016",
    foreignBuy: "Foreigners can own freehold in designated zones (The Pearl, West Bay Lagoon, Lusail, and others). Residence permit linked to purchase above QAR 730,000.",
  },
  {
    code: "om", flag: "🇴🇲", name: "Oman",
    risk: "medium",
    platformNote: "Real estate brokerage in Oman requires a licence under Ministerial Decision 122/2017. Makan is an advertising platform — we do not act as a licensed broker. Foreign buyers must purchase in designated ITCs.",
    landlordMust: [
      { req: "Licensed brokers only", detail: "Real estate brokerage requires a licence from the Ministry of Housing and Urban Planning. Private landlords listing directly are generally exempt.", critical: false },
      { req: "ITC only for foreign buyers", detail: "Foreigners can only purchase property within designated Integrated Tourism Complexes (ITCs) — e.g. The Wave Muscat, Muscat Hills, Almouj. Purchases outside ITCs are not permitted for non-Omanis.", critical: true },
      { req: "Residence Visa linked to ITC purchase", detail: "Foreign buyers in ITCs receive a residence visa valid for the duration of their ownership. The visa is renewable.", critical: false },
    ],
    tenantRights: [
      "Tenancy disputes are handled by the Rental Disputes Committee at the Ministry of Housing",
      "Standard protections apply — landlords cannot evict without notice",
    ],
    privacyLaw: "Oman Cybercrime Law (Royal Decree 12/2011) covers some data aspects. A comprehensive PDPL is in development.",
    foreignBuy: "Foreigners can own freehold ONLY in designated ITCs. Residence visa included. No ownership outside ITCs for non-Omanis.",
  },
  {
    code: "jo", flag: "🇯🇴", name: "Jordan",
    risk: "medium",
    platformNote: "Real estate agents in Jordan must be licensed by the Jordanian Real Estate Agents Association. Makan is an advertising platform — we do not act as a licensed agent.",
    landlordMust: [
      { req: "Rental income declaration", detail: "Rental income is subject to Jordanian income tax. Landlords must declare rental income to the Income and Sales Tax Department.", critical: false },
      { req: "Written tenancy agreement", detail: "A written lease is legally recommended. Disputes are handled through Jordanian courts.", critical: false },
      { req: "Foreign ownership restrictions", detail: "Foreign ownership is governed by Law No. 47 of 2006. Foreigners from non-reciprocal countries face restrictions on property size and location. Aqaba (ASEZA) has its own more open rules.", critical: false },
      { req: "Residency for investors", detail: "Foreigners investing JOD 25,000+ in real estate can apply for a Jordanian residency permit.", critical: false },
    ],
    tenantRights: [
      "Tenants have strong protections under Jordanian rental law — eviction without cause is difficult",
      "Rent increases require advance notice as specified in the lease",
      "Disputes are handled by local courts or mediation",
    ],
    privacyLaw: "Jordan does not yet have a comprehensive data protection law. The Electronic Transactions Law (No. 15/2015) covers some aspects.",
    foreignBuy: "Foreigners can buy with restrictions based on nationality and location. Aqaba is more open. Residency available for investors.",
  },
];

const riskColor = (risk: string) => {
  if (risk === "high") return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", badge: "#dc2626" };
  if (risk === "medium") return { bg: "#fffbeb", border: "#fde68a", text: "#92400e", badge: "#d97706" };
  return { bg: "#f0fdf4", border: "#bbf7d0", text: "#14532d", badge: "#16a34a" };
};

export default function CompliancePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16" style={{ background: "var(--h-surface)" }}>
        <div className="h-container max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-semibold" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
            Legal & Compliance
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: "var(--h-text)" }}>
            Staying legal in every market
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--h-muted)" }}>
            Makan operates across 10 countries, each with its own property laws. This guide explains what landlords must do, what tenants are entitled to, and how we keep the platform compliant — in every market we serve.
          </p>
        </div>
      </section>

      {/* What Makan is — and isn't */}
      <section className="py-12" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--h-text)" }}>What Makan is — and isn&apos;t</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <p className="font-bold mb-3" style={{ color: "var(--h-green)" }}>✓ What we are</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--h-muted)" }}>
                <li>An advertising platform — we display landlord listings</li>
                <li>A communication facilitator — we connect parties directly</li>
                <li>A hosting service — covered by platform liability exemptions in most jurisdictions</li>
                <li>Free — we charge no fees to landlords or tenants</li>
              </ul>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <p className="font-bold mb-3" style={{ color: "#dc2626" }}>✗ What we are not</p>
              <ul className="space-y-2 text-sm" style={{ color: "var(--h-muted)" }}>
                <li>A licensed real estate broker or agent in any country</li>
                <li>A party to any tenancy or sale agreement</li>
                <li>Responsible for the accuracy of individual listings</li>
                <li>A financial service — we don&apos;t handle money or deposits</li>
              </ul>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ background: "var(--h-accent-light)", border: "1px solid var(--h-border)" }}>
            <p className="text-sm" style={{ color: "var(--h-text)" }}>
              <strong>Platform liability:</strong> Makan operates under the hosting exemptions available in most countries (equivalent to the EU E-Commerce Directive / UK Electronic Commerce Regulations 2002 / GCC e-commerce frameworks). We are not liable for the content of listings we host, provided we act on valid takedown notices promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Our platform safeguards */}
      <section className="py-12" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>How we protect users</h2>
          <p className="text-sm mb-8" style={{ color: "var(--h-muted)" }}>These measures are live on Makan today or in our immediate roadmap.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🔐", title: "Auth-gated contact", desc: "Phone/WhatsApp is required at signup. No anonymous contact with landlords — every user is identifiable." },
              { icon: "📸", title: "Photo verification", desc: "Minimum 3 photos required per listing. Listings without real photos are not approved. No stock image listings." },
              { icon: "✍️", title: "Listing review", desc: "All listings are submitted as 'pending' and reviewed before going live. Misleading or fraudulent listings are removed." },
              { icon: "🚩", title: "Report system", desc: "Any listing can be reported. Reports are reviewed within 24 hours. Repeat offenders are banned." },
              { icon: "🌍", title: "Country-specific disclaimers", desc: "Listings include country-relevant legal notices — e.g. Right to Rent warnings for UK, foreign ownership restrictions for UAE/Kuwait/Saudi." },
              { icon: "📋", title: "Landlord checklist", desc: "UK landlords see a legal checklist before their listing goes live — EPC, gas safety, deposit protection, Right to Rent." },
              { icon: "🔒", title: "Data minimisation", desc: "We collect only what is needed. Phone numbers are stored securely and only shared between matched parties after both have authenticated." },
              { icon: "⚖️", title: "Clear ToS", desc: "Our Terms of Service clearly states that Makan is an advertising platform, not an agent, and that all legal obligations rest with the parties." },
            ].map(item => (
              <div key={item.title} className="rounded-xl p-5 flex gap-4" style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)" }}>
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--h-text)" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--h-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Per-country guides */}
      <section className="py-12" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Country-by-country legal guide</h2>
          <p className="text-sm mb-8" style={{ color: "var(--h-muted)" }}>Compiled from current legislation as of 2025–2026. Always verify with a local solicitor before signing a contract.</p>

          <div className="space-y-6">
            {countries.map(c => {
              const colors = riskColor(c.risk);
              return (
                <div key={c.code} className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--h-border)" }}>
                  {/* Header */}
                  <div className="p-5 flex items-start justify-between gap-4" style={{ background: "var(--h-surface)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{c.flag}</span>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: "var(--h-text)" }}>{c.name}</h3>
                        <p className="text-xs" style={{ color: "var(--h-muted)" }}>{c.privacyLaw}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex-shrink-0" style={{ background: colors.bg, color: colors.badge, border: `1px solid ${colors.border}` }}>
                      {c.risk === "high" ? "⚠ High attention" : c.risk === "medium" ? "ℹ Medium" : "✓ Low risk"}
                    </span>
                  </div>

                  {/* Platform note */}
                  <div className="px-5 py-3 text-sm" style={{ background: colors.bg, borderTop: `1px solid ${colors.border}`, color: colors.text }}>
                    <strong>Platform note:</strong> {c.platformNote}
                  </div>

                  {/* Body */}
                  <div className="p-5" style={{ background: "var(--h-bg)" }}>
                    {/* Foreign buy note */}
                    <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                      <span className="font-semibold" style={{ color: "var(--h-text)" }}>Foreign buyers/renters: </span>
                      <span style={{ color: "var(--h-muted)" }}>{c.foreignBuy}</span>
                    </div>

                    {/* Landlord requirements */}
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--h-subtle)" }}>Landlord legal obligations</p>
                    <div className="space-y-3 mb-5">
                      {c.landlordMust.map(req => (
                        <div key={req.req} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold" style={{ background: req.critical ? "#dc2626" : "var(--h-green)", color: "white" }}>
                            {req.critical ? "!" : "✓"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--h-text)" }}>{req.req}</p>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--h-muted)" }}>{req.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tenant rights */}
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--h-subtle)" }}>Tenant rights</p>
                    <ul className="space-y-1.5">
                      {c.tenantRights.map(right => (
                        <li key={right} className="text-xs flex gap-2" style={{ color: "var(--h-muted)" }}>
                          <span style={{ color: "var(--h-accent)" }}>→</span>
                          {right}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <div className="p-5 rounded-2xl text-sm leading-relaxed" style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)", color: "var(--h-muted)" }}>
            <strong style={{ color: "var(--h-text)" }}>Legal disclaimer:</strong> This guide is for informational purposes only and does not constitute legal advice. Laws change frequently and vary by jurisdiction, city, and specific circumstances. Makan is not a law firm. Always consult a qualified local solicitor or legal professional before signing any property contract, particularly for cross-border transactions. If you believe a listing on Makan violates local law, please report it and we will review it promptly.
          </div>
          <p className="text-xs text-center mt-4" style={{ color: "var(--h-subtle)" }}>Last reviewed: June 2026 · <a href="mailto:info@propertyvaultuk.co.uk" className="underline" style={{ color: "var(--h-accent)" }}>Report a legal concern</a></p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12" style={{ background: "var(--h-slate)" }}>
        <div className="h-container max-w-xl text-center">
          <p className="text-white font-bold text-xl mb-2">Questions about compliance?</p>
          <p className="mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>We take legal compliance seriously in every market. Contact us if you have concerns.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:info@propertyvaultuk.co.uk" className="h-btn h-btn-primary">Contact us</a>
            <Link href="/makan" className="h-btn" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>Back to Makan</Link>
          </div>
        </div>
      </section>
    </>
  );
}
