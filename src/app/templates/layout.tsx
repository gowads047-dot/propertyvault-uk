import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free UK Property Templates — 19 Legal & Landlord Documents | PropertyVault",
  description: "Download free UK property templates. AST agreements, Section 8 notices, inventory checklists, inspection records, rent receipts, and 19 more legal documents for landlords.",
  keywords: "free property templates UK, landlord legal templates, free tenancy agreement template, Section 8 notice template, AST template download",
  openGraph: {
    title: "Free UK Property Templates — 19 Legal Documents | PropertyVault",
    description: "Download free UK property templates. 19 legal documents for landlords, tenants, and investors — no sign-up required.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/templates/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Free Property Templates — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free UK Property Templates | PropertyVault", description: "19 free legal documents for UK landlords and property investors." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/templates/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`@media print { .pv-template-disclaimer { display: none !important; } }`}</style>
      <div className="pv-template-disclaimer" style={{
        background: "#fefce8",
        borderBottom: "1px solid #fde047",
        padding: "10px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.516-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" fill="#a16207"/>
        </svg>
        <p style={{ fontSize: 13, color: "#713f12", margin: 0, lineHeight: 1.5 }}>
          <strong>Template — for guidance only.</strong> These documents are starting points, not legal advice. For legally binding agreements or formal notices, have a solicitor review before use. Drafted for England &amp; Wales. Requirements change — verify current requirements before use.
        </p>
      </div>
      {children}
    </>
  );
}
