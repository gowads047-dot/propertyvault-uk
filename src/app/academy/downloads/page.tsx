import Link from "next/link";

const DOWNLOADS = [
  {
    cat: "Deal Analysis",
    items: [
      { name: "Property Deal Analyser", desc: "Full deal analysis spreadsheet — BTL, BRRR, HMO. Calculates yield, cash flow, ROI, and stress tests.", type: "XLSX", pages: "8 tabs" },
      { name: "BRRR Deal Calculator", desc: "Model a full BRRR deal — purchase, refurb, refinance, and equity released. Includes sensitivities.", type: "XLSX", pages: "5 tabs" },
      { name: "HMO Yield Calculator", desc: "Room-by-room HMO income calculator with licensing cost, management, and net yield output.", type: "XLSX", pages: "3 tabs" },
      { name: "Cash Flow Stress Tester", desc: "Stress test any deal at +1%, +2% interest rates and 10%, 20% void scenarios.", type: "XLSX", pages: "2 tabs" },
      { name: "ROI & Yield Quick Calculator", desc: "Instant gross yield, net yield, and ROI. Works for any property type.", type: "XLSX", pages: "1 tab" },
    ],
  },
  {
    cat: "Investor Pack Templates",
    items: [
      { name: "Complete Investor Deal Pack", desc: "8-section investor presentation template. Covers property summary, financials, comps, area research, and exit.", type: "PDF", pages: "12 pages" },
      { name: "Property Summary One-Pager", desc: "Single-page deal overview for WhatsApp and email teasers. Gets investors to request the full pack.", type: "PDF", pages: "1 page" },
      { name: "Financial Breakdown Sheet", desc: "Numbers-only page for investors who want to see the model without the narrative.", type: "PDF", pages: "1 page" },
      { name: "Refurbishment Scope Template", desc: "Room-by-room refurb breakdown with cost estimates, timeline, and contractor notes.", type: "PDF", pages: "2 pages" },
      { name: "Comparable Evidence Page", desc: "Template for presenting 3 sales and 3 rental comparables with source, date, and analysis.", type: "PDF", pages: "1 page" },
      { name: "Deal Pack Canva Template", desc: "Professionally designed investor pack. Edit in Canva — fully brandable.", type: "CANVA", pages: "10 slides" },
      { name: "Deal Pack PowerPoint", desc: "Same pack in PowerPoint format for those who prefer offline editing.", type: "PPTX", pages: "10 slides" },
    ],
  },
  {
    cat: "CRM & Tracking",
    items: [
      { name: "Investor CRM Template", desc: "Track every investor — name, contact, strategy, budget, area, timeline, last contact, status.", type: "XLSX", pages: "1 tab" },
      { name: "Lead Tracker", desc: "Log every deal lead — source, address, asking price, status, next action, and follow-up date.", type: "XLSX", pages: "1 tab" },
      { name: "Deal Pipeline Dashboard", desc: "Track deals from lead to close — stage, investor matched, fee expected, and notes.", type: "XLSX", pages: "2 tabs" },
      { name: "Follow-Up Tracker", desc: "Never lose a lead. Track every email, call, and WhatsApp with dates and responses.", type: "XLSX", pages: "1 tab" },
      { name: "Monthly Income Tracker", desc: "Track deals completed, fees earned, and pipeline value month by month.", type: "XLSX", pages: "1 tab" },
    ],
  },
  {
    cat: "Checklists & Guides",
    items: [
      { name: "Viewing Checklist", desc: "50-point property viewing checklist. Covers structure, layout, condition, and investment metrics.", type: "PDF", pages: "2 pages" },
      { name: "Due Diligence Checklist", desc: "Everything to check before presenting a deal to an investor — legal, planning, title, and searches.", type: "PDF", pages: "2 pages" },
      { name: "Deal Sourcer Compliance Checklist", desc: "Basic compliance steps for operating as a deal sourcer in England & Wales. Educational guide only.", type: "PDF", pages: "2 pages" },
      { name: "HMO Licensing Checklist", desc: "Mandatory and discretionary licensing rules by property size. Local authority variation guide included.", type: "PDF", pages: "2 pages" },
      { name: "Goal & Income Tracker", desc: "Set monthly deal targets, track progress, and monitor your pipeline value.", type: "PDF", pages: "1 page" },
    ],
  },
  {
    cat: "Legal Templates",
    items: [
      { name: "Sourcing Fee Agreement", desc: "Template agreement between sourcer and investor covering fee, deal, and terms. Educational template — always seek legal advice before use.", type: "PDF", pages: "2 pages" },
      { name: "Reservation Agreement Template", desc: "Template reservation agreement to lock in a deal pending due diligence. Educational only.", type: "PDF", pages: "2 pages" },
      { name: "Confidentiality / NDA Template", desc: "Basic NDA for sharing deals with investors before a formal agreement is in place.", type: "PDF", pages: "1 page" },
      { name: "GDPR Privacy Notice Template", desc: "Simple privacy notice for collecting investor and seller contact details.", type: "PDF", pages: "1 page" },
    ],
  },
  {
    cat: "AI Prompts",
    items: [
      { name: "50+ AI Deal Sourcing Prompts", desc: "Ready-to-use prompts for ChatGPT and Claude. Covers deal analysis, investor pack writing, social content, emails, and outreach.", type: "PDF", pages: "8 pages" },
      { name: "AI Investor Pack Generator Workflow", desc: "Step-by-step guide to using AI to draft a full investor pack in under 30 minutes.", type: "PDF", pages: "3 pages" },
      { name: "AI Social Media Content Calendar", desc: "30-day property content calendar with prompts for LinkedIn, Instagram, and Facebook.", type: "PDF", pages: "4 pages" },
    ],
  },
];

export default function DownloadsPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>DSA</Link>
        {[["Dashboard", "/academy/dashboard"], ["Courses", "/academy/courses"], ["Playbooks", "/academy/playbooks"], ["Scripts", "/academy/scripts"]].map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6, fontFamily: "var(--font-family-heading)" }}>Downloads Library</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Every template, calculator, checklist, and tool — ready to use.</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 40 }}>Legal templates are educational only. Always seek independent legal advice before use.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {DOWNLOADS.map(group => (
            <div key={group.cat}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "#d4af37" }}>{group.cat}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                {group.items.map(item => (
                  <div key={item.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{item.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: item.type === "XLSX" ? "#22c55e" : item.type === "CANVA" ? "#a78bfa" : item.type === "PPTX" ? "#f97316" : "#60a5fa", background: item.type === "XLSX" ? "rgba(34,197,94,0.1)" : item.type === "CANVA" ? "rgba(167,139,250,0.1)" : item.type === "PPTX" ? "rgba(249,115,22,0.1)" : "rgba(96,165,250,0.1)", padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap", flexShrink: 0 }}>{item.type}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.4, flexGrow: 1 }}>{item.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{item.pages}</span>
                      <button style={{ fontSize: 12, fontWeight: 700, color: "#d4af37", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 7, padding: "4px 12px", cursor: "pointer" }}>
                        ↓ Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
