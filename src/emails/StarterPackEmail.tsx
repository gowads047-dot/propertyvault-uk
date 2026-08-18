import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface StarterPackEmailProps {
  name: string;
  userType?: string | null;
}

const BASE = "https://propertyvaultuk.co.uk";
const GOLD = "#c9a84c";
const NAVY = "#0f1b36";
const GREY_BG = "#f4f6f9";
const TEXT = "#374151";
const MUTED = "#6b7280";

const CALCULATORS = [
  { label: "BTL Mortgage Stress Test", desc: "Will your deal pass the lender's ICR test?", href: `${BASE}/calculators/btl-mortgage` },
  { label: "Rental Yield Calculator", desc: "Gross and net yield on any property in seconds", href: `${BASE}/calculators/rental-yield` },
  { label: "Stamp Duty Calculator", desc: "Exact SDLT for standard, BTL, and first-time buyers", href: `${BASE}/calculators/stamp-duty` },
  { label: "Monthly Cash Flow", desc: "Full P&L after mortgage, voids, fees and costs", href: `${BASE}/calculators/monthly-cashflow` },
  { label: "Void Period Cost", desc: "See exactly what empty months are costing you", href: `${BASE}/calculators/void-period` },
];

const GUIDES = [
  { label: "Renters' Rights Act 2025 — Landlord Checklist", href: `${BASE}/blog/renters-reform-act-landlord-checklist` },
  { label: "Section 24 Explained — How It Affects Your Tax Bill", href: `${BASE}/blog/section-24-explained` },
  { label: "How to Pass the BTL Mortgage Stress Test", href: `${BASE}/blog/how-to-pass-btl-mortgage-stress-test` },
  { label: "BRRR Strategy Explained", href: `${BASE}/blog/brrr-strategy-explained` },
  { label: "Guaranteed Rent vs Traditional Letting", href: `${BASE}/blog/guaranteed-rent-vs-traditional-letting` },
];

const CHECKLIST = [
  { n: "1", text: "Stop using Section 21 — it is now abolished. Use Section 8 with a specific ground." },
  { n: "2", text: "Update your tenancy agreement — fixed-term ASTs are no longer valid for new tenancies." },
  { n: "3", text: "Set up Section 13 rent review process — the only legal way to increase rent." },
  { n: "4", text: "Register with the PRS Ombudsman — fines up to £40,000 for non-compliance." },
  { n: "5", text: "Join the national Property Portal (Landlord Register) — phasing in through 2025–2026." },
  { n: "6", text: "Respond to repair requests within 14 days — Awaab's Law now applies to private rentals." },
  { n: "7", text: "Create a pet policy — you must respond to pet requests in writing within 28 days." },
];

export default function StarterPackEmail({ name, userType }: StarterPackEmailProps) {
  const firstName = name.split(" ")[0];

  return (
    <Html lang="en">
      <Head />
      <Preview>Your free property starter pack from PropertyVault UK — calculators, guides, and your 2025 compliance checklist.</Preview>
      <Body style={{ backgroundColor: GREY_BG, fontFamily: "Georgia, 'Times New Roman', serif", margin: 0, padding: 0 }}>

        {/* ── HEADER ── */}
        <Section style={{ backgroundColor: NAVY, padding: "24px 0 0" }}>
          <Container style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <Row>
              <Column>
                <Text style={{ color: GOLD, fontFamily: "Arial, sans-serif", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
                  PropertyVault <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 14 }}>.co.uk</span>
                </Text>
              </Column>
            </Row>

            <Section style={{ paddingTop: 28, paddingBottom: 36 }}>
              <Text style={{ color: GOLD, fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 10px" }}>
                Free Property Starter Pack
              </Text>
              <Heading as="h1" style={{ color: "#ffffff", fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
                Everything you need to make smarter property decisions.
              </Heading>
              <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
                Hi {firstName} — here is your starter pack. Bookmark it, share it with your accountant, come back to it whenever you need it. Everything below is free.
              </Text>
            </Section>
          </Container>

          {/* Gold divider line */}
          <div style={{ height: 4, backgroundColor: GOLD }} />
        </Section>

        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>

          {/* ── INTRO NOTE ── */}
          <Section style={{ padding: "32px 0 8px" }}>
            <Text style={{ color: TEXT, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              I put this together because most landlord resources online are either too vague or trying to sell you something. These tools are genuinely free, no upsell. Use the calculators before every deal, and read the compliance guide before your next tenancy starts — the rules changed significantly in 2025.
            </Text>
            <Text style={{ color: MUTED, fontSize: 13, margin: "12px 0 0", fontStyle: "italic" }}>
              — Nass, PropertyVault UK
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* ── CALCULATORS ── */}
          <Section style={{ padding: "8px 0" }}>
            <Text style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>
              Section 1
            </Text>
            <Heading as="h2" style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
              🧮 Free Calculators
            </Heading>
            <Text style={{ color: MUTED, fontSize: 13, margin: "0 0 20px" }}>
              Run the numbers before you make any decision. These are the 5 we recommend landlords bookmark.
            </Text>

            {CALCULATORS.map((calc) => (
              <Section key={calc.href} style={{ backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid #e5e7eb", padding: "14px 18px", marginBottom: 8 }}>
                <Row>
                  <Column style={{ verticalAlign: "middle" }}>
                    <Text style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{calc.label}</Text>
                    <Text style={{ color: MUTED, fontSize: 12, margin: 0 }}>{calc.desc}</Text>
                  </Column>
                  <Column style={{ width: 80, textAlign: "right", verticalAlign: "middle" }}>
                    <Link href={calc.href} style={{ color: GOLD, fontFamily: "Arial, sans-serif", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                      Open →
                    </Link>
                  </Column>
                </Row>
              </Section>
            ))}
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "28px 0" }} />

          {/* ── GUIDES ── */}
          <Section style={{ padding: "8px 0" }}>
            <Text style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>
              Section 2
            </Text>
            <Heading as="h2" style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
              📚 Essential Reading
            </Heading>
            <Text style={{ color: MUTED, fontSize: 13, margin: "0 0 20px" }}>
              Five guides every landlord should have read by now.
            </Text>

            {GUIDES.map((g, i) => (
              <Row key={g.href} style={{ marginBottom: 12 }}>
                <Column style={{ width: 28, verticalAlign: "top" }}>
                  <Text style={{ color: GOLD, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 13, margin: "2px 0 0" }}>{i + 1}.</Text>
                </Column>
                <Column style={{ verticalAlign: "top" }}>
                  <Link href={g.href} style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "underline", textDecorationColor: GOLD }}>
                    {g.label}
                  </Link>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "28px 0" }} />

          {/* ── COMPLIANCE CHECKLIST ── */}
          <Section style={{ backgroundColor: "#fff8ed", borderRadius: 12, border: `2px solid ${GOLD}`, padding: "24px 24px 16px" }}>
            <Text style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>
              Section 3
            </Text>
            <Heading as="h2" style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
              ✅ 2025 Compliance Checklist
            </Heading>
            <Text style={{ color: TEXT, fontSize: 13, margin: "0 0 20px", lineHeight: 1.6 }}>
              The Renters' Rights Act is live. These are the 7 things that carry the biggest fines if you ignore them. Tick them off now.
            </Text>

            {CHECKLIST.map((item) => (
              <Row key={item.n} style={{ marginBottom: 12 }}>
                <Column style={{ width: 28, verticalAlign: "top" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${GOLD}`, display: "inline-block", marginTop: 1 }} />
                </Column>
                <Column style={{ verticalAlign: "top" }}>
                  <Text style={{ color: TEXT, fontSize: 13, lineHeight: 1.55, margin: 0 }}>
                    <span style={{ fontWeight: 700, fontFamily: "Arial, sans-serif" }}>Item {item.n}. </span>
                    {item.text}
                  </Text>
                </Column>
              </Row>
            ))}

            <Section style={{ paddingTop: 8 }}>
              <Button href={`${BASE}/blog/renters-reform-act-landlord-checklist`}
                style={{ backgroundColor: NAVY, color: "#ffffff", fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>
                Read the full 12-item checklist →
              </Button>
            </Section>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "28px 0" }} />

          {/* ── TEMPLATES ── */}
          <Section style={{ padding: "8px 0" }}>
            <Text style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 6px" }}>
              Section 4
            </Text>
            <Heading as="h2" style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
              📄 Free Legal Templates
            </Heading>
            <Text style={{ color: MUTED, fontSize: 13, margin: "0 0 16px" }}>
              Ready-to-use documents. Fill in, download as PDF, use straight away.
            </Text>

            <Row>
              <Column style={{ paddingRight: 8 }}>
                <Section style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px" }}>
                  <Link href={`${BASE}/templates/ast`} style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Assured Shorthold Tenancy</Link>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "4px 0 0" }}>Updated for 2025 periodic tenancies</Text>
                </Section>
              </Column>
              <Column style={{ paddingLeft: 8 }}>
                <Section style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px" }}>
                  <Link href={`${BASE}/templates/section-8-notice`} style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Section 8 Notice</Link>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "4px 0 0" }}>Replaces Section 21 for possession</Text>
                </Section>
              </Column>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Column style={{ paddingRight: 8 }}>
                <Section style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px" }}>
                  <Link href={`${BASE}/templates/section-13-notice`} style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Section 13 Rent Notice</Link>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "4px 0 0" }}>Only legal route to raise rent</Text>
                </Section>
              </Column>
              <Column style={{ paddingLeft: 8 }}>
                <Section style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px" }}>
                  <Link href={`${BASE}/templates`} style={{ color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View all 19 templates →</Link>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "4px 0 0" }}>Deposit receipts, inventories & more</Text>
                </Section>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "28px 0" }} />

          {/* ── GUARANTEED RENT CTA ── */}
          <Section style={{ backgroundColor: NAVY, borderRadius: 12, padding: "28px 24px", textAlign: "center" as const }}>
            <Text style={{ color: GOLD, fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 10px" }}>
              Serving Birmingham · Nottingham · Derby · Leicester · Coventry · Sheffield
            </Text>
            <Heading as="h2" style={{ color: "#ffffff", fontFamily: "Arial, sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
              Want your rent guaranteed every month?
            </Heading>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.65, margin: "0 0 24px" }}>
              No voids. No tenant management. No arrears chasing. We pay you a fixed amount every month for 3–5 years — whether the property is occupied or not.
            </Text>
            <Button href={`${BASE}/guaranteed-rent`}
              style={{ backgroundColor: GOLD, color: NAVY, fontFamily: "Arial, sans-serif", fontSize: 14, fontWeight: 800, padding: "14px 28px", borderRadius: 10, textDecoration: "none", display: "inline-block" }}>
              Get a Free Rent Estimate →
            </Button>
          </Section>

          {/* ── FOOTER ── */}
          <Section style={{ padding: "28px 0 32px", textAlign: "center" as const }}>
            <Text style={{ color: MUTED, fontSize: 12, margin: "0 0 6px" }}>
              Questions? WhatsApp Nass directly:{" "}
              <Link href="https://wa.me/447415721628" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>07415 721628</Link>
            </Text>
            <Text style={{ color: MUTED, fontSize: 12, margin: "0 0 16px" }}>
              <Link href={BASE} style={{ color: MUTED, textDecoration: "underline" }}>propertyvaultuk.co.uk</Link>
            </Text>
            <Hr style={{ borderColor: "#e5e7eb", margin: "16px 0" }} />
            <Text style={{ color: "#9ca3af", fontSize: 11, margin: 0, lineHeight: 1.6 }}>
              You received this because you signed up at propertyvaultuk.co.uk.{" "}
              No spam — this is the only email we send unless you enquire about a service.{" "}
              PropertyVault UK · Midlands, England
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
