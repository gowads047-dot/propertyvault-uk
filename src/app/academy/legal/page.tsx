import Link from "next/link";

export default function LegalHubPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>DSA</Link>
        {[["Dashboard", "/academy/dashboard"], ["Courses", "/academy/courses"], ["Playbooks", "/academy/playbooks"], ["Downloads", "/academy/downloads"]].map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 36, fontSize: 13, color: "rgba(239,68,68,0.9)", lineHeight: 1.5 }}>
          ⚠️ <strong>Educational Content Only.</strong> This hub provides general information about the regulatory landscape for property deal sourcers in England & Wales. It does not constitute legal advice. Always consult a qualified solicitor or compliance professional before operating commercially.
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 6, fontFamily: "var(--font-family-heading)" }}>Legal & Compliance Hub</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>Plain-English guidance on what you need to know before you start sourcing.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {[
            {
              title: "What is Deal Sourcing Legally?",
              icon: "📋",
              content: [
                "Deal sourcing (also called property sourcing or below-market value sourcing) involves finding investment properties on behalf of third-party investors and charging a fee for this service.",
                "In the UK, this activity sits in a complex regulatory space. The rules you need to understand depend on exactly how you operate — whether you take fees, hold money, arrange finance, or act as an agent.",
                "This module gives you an overview. It is not a substitute for qualified legal advice.",
              ],
            },
            {
              title: "FCA Regulation — What You Need to Know",
              icon: "🏛️",
              content: [
                "The Financial Conduct Authority (FCA) regulates certain activities related to property investment. If you are 'arranging deals in investments' (which can include some forms of deal sourcing), you may require FCA authorisation — or need to operate as an Appointed Representative of an FCA-authorised firm.",
                "Key principle: If you are introducing investors to investment opportunities AND receiving a fee, this can constitute a regulated activity depending on how it is structured.",
                "Most deal sourcers who operate professionally either: (1) ensure their activity falls outside the regulated perimeter, or (2) become an Appointed Representative of an FCA-authorised firm.",
                "Action: Research 'FCA property sourcing' and speak to a compliance specialist before taking your first fee. The FCA website has a Financial Services Register where you can check if a firm is authorised.",
              ],
            },
            {
              title: "Property Redress Schemes",
              icon: "⚖️",
              content: [
                "If you are operating as a property agent (which deal sourcers often are), you are legally required to register with a government-approved Property Redress Scheme.",
                "The two approved schemes are: The Property Ombudsman (TPO) and The Property Redress Scheme (PRS).",
                "Registration typically costs £150-£350/year and gives your clients a route to complain if something goes wrong. It also signals to investors and sellers that you are operating professionally.",
                "Not being registered when required is a criminal offence under the Redress Scheme for Lettings Agency Work and Property Management Work (Requirement to Belong to a Scheme) (England) Order 2014.",
              ],
            },
            {
              title: "Anti-Money Laundering (AML)",
              icon: "🔍",
              content: [
                "If you handle client money or act as an estate agent (which can include facilitating property sales), you may be subject to the Money Laundering Regulations 2017.",
                "This means you may need to: register with HMRC as a supervised business, conduct Customer Due Diligence (CDD) checks on clients and sellers, keep records of identity verification, and report suspicious activity.",
                "At a minimum, you should be collecting proof of identity and proof of address for all clients. Use the KYC Checklist in the Downloads section.",
              ],
            },
            {
              title: "Know Your Customer (KYC)",
              icon: "👤",
              content: [
                "KYC is the process of verifying who your clients are before entering into a business relationship.",
                "For deal sourcers, this typically means collecting from investors and sellers: Government-issued photo ID (passport or driving licence), Proof of address dated within 3 months (utility bill or bank statement), Source of funds declaration for large transactions.",
                "Use the KYC checklist template in Downloads. Keep records for 5 years.",
              ],
            },
            {
              title: "GDPR & Data Protection",
              icon: "🔒",
              content: [
                "When you collect contact details from investors, sellers, and agents, you are processing personal data under the UK GDPR.",
                "You must: have a lawful basis for processing (usually 'legitimate interests' or 'consent'), have a privacy notice that explains how you use data, respond to subject access requests within 30 days, not share data with third parties without a lawful basis.",
                "You do not need to register with the ICO if you are a sole trader processing data only for your own business — but it is good practice to check on ico.org.uk.",
                "Use the GDPR Privacy Notice Template in Downloads as a starting point.",
              ],
            },
            {
              title: "Your Sourcing Contract",
              icon: "📝",
              content: [
                "Before presenting any deal to an investor, you should have a signed sourcing agreement in place. This protects you, clarifies your fee, and sets expectations.",
                "A basic sourcing agreement should cover: the property being sourced, your fee amount and when it is payable, what happens if the deal falls through, confidentiality obligations, and jurisdiction (England & Wales).",
                "The Sourcing Fee Agreement template in Downloads is a starting point. Always have any agreement reviewed by a qualified solicitor before use.",
              ],
            },
            {
              title: "Consumer Protection",
              icon: "🛡️",
              content: [
                "Consumer protection law (Consumer Rights Act 2015, Consumer Protection from Unfair Trading Regulations 2008) applies to how you advertise and describe deals.",
                "You must not: make misleading claims about returns or yields, use high-pressure sales tactics, make guarantees about future property values or rental income.",
                "Always include appropriate caveats: 'Past performance is not indicative of future results', 'Rental income is not guaranteed', 'Property values can go down as well as up.'",
              ],
            },
          ].map(section => (
            <div key={section.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 24 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>{section.icon}</span>
                <h2 style={{ fontWeight: 800, fontSize: 18, fontFamily: "var(--font-family-heading)" }}>{section.title}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {section.content.map((para, i) => (
                  <p key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{para}</p>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
            <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Compliance Templates</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>KYC checklist, sourcing agreement, GDPR notice, and reservation agreement template — all in the Downloads section.</p>
            <Link href="/academy/downloads" style={{ background: "#d4af37", color: "#0a0f1e", fontWeight: 700, padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>View Downloads →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
