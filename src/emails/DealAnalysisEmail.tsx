import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

interface DealData {
  address?: string;
  purchasePrice: number;
  monthlyRent: number;
  grossYield: number;
  netYield: number;
  monthlyCF: number;
  cashOnCash: number;
  dealScore: number;
  totalCashIn: number;
  netIncome: number;
  strategy: string;
}

interface Props {
  deal: DealData;
  fmt: (n: number) => string;
}

const BASE = "https://www.propertyvaultuk.co.uk";
const GOLD = "#c9a84c";
const NAVY = "#0f1b36";
const GREY_BG = "#f4f6f9";
const MUTED = "#6b7280";

const scoreColor = (s: number) => (s >= 70 ? "#16a34a" : s >= 45 ? "#c9a84c" : "#dc2626");
const scoreLabel = (s: number) => (s >= 70 ? "Strong" : s >= 55 ? "Decent" : s >= 40 ? "Marginal" : "Weak");
const cfColor = (n: number) => (n >= 200 ? "#16a34a" : n >= 0 ? "#c9a84c" : "#dc2626");

export default function DealAnalysisEmail({ deal, fmt }: Props) {
  const title = deal.address ? `Deal Analysis — ${deal.address}` : `Deal Analysis — ${fmt(deal.purchasePrice)} property`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{`Deal score ${deal.dealScore}/100 · ${deal.grossYield.toFixed(1)}% gross yield · ${fmt(deal.monthlyCF)}/mo cash flow`}</Preview>
      <Body style={{ backgroundColor: GREY_BG, fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>

        {/* Header */}
        <Section style={{ backgroundColor: NAVY, padding: "24px 0 0" }}>
          <Container style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
            <Text style={{ color: GOLD, fontSize: 20, fontWeight: 700, margin: "0 0 20px", letterSpacing: "-0.5px" }}>
              PropertyVault <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: 13 }}>.co.uk</span>
            </Text>
            <Text style={{ color: GOLD, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>
              Property Deal Analysis
            </Text>
            <Heading as="h1" style={{ color: "#ffffff", fontSize: 24, fontWeight: 800, lineHeight: 1.2, margin: "0 0 20px" }}>
              {title}
            </Heading>
          </Container>
          <div style={{ height: 4, backgroundColor: GOLD }} />
        </Section>

        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>

          {/* Deal Score */}
          <Section style={{ padding: "28px 0 8px" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: 12, border: `2px solid ${scoreColor(deal.dealScore)}`, padding: "20px 24px", textAlign: "center" as const }}>
              <Text style={{ color: MUTED, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 4px" }}>
                Deal Score
              </Text>
              <Text style={{ color: scoreColor(deal.dealScore), fontSize: 56, fontWeight: 800, margin: "0 0 4px", lineHeight: 1 }}>
                {deal.dealScore}
              </Text>
              <Text style={{ color: MUTED, fontSize: 14, margin: "0 0 8px" }}>out of 100</Text>
              <Text style={{ color: scoreColor(deal.dealScore), fontSize: 16, fontWeight: 700, margin: 0 }}>
                {scoreLabel(deal.dealScore)}
              </Text>
            </div>
          </Section>

          {/* Key Metrics */}
          <Section style={{ padding: "16px 0" }}>
            <Heading as="h2" style={{ color: NAVY, fontSize: 16, fontWeight: 800, margin: "0 0 12px" }}>
              Key Metrics
            </Heading>
            <Row>
              <Column style={{ width: "50%", paddingRight: 6 }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "14px 16px", marginBottom: 8 }}>
                  <Text style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Gross Yield</Text>
                  <Text style={{ color: NAVY, fontSize: 24, fontWeight: 800, margin: 0 }}>{deal.grossYield.toFixed(1)}%</Text>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "2px 0 0" }}>Rent / purchase price</Text>
                </div>
              </Column>
              <Column style={{ width: "50%", paddingLeft: 6 }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "14px 16px", marginBottom: 8 }}>
                  <Text style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Net Yield</Text>
                  <Text style={{ color: deal.netYield >= 4 ? "#16a34a" : deal.netYield >= 2 ? "#c9a84c" : "#dc2626", fontSize: 24, fontWeight: 800, margin: 0 }}>{deal.netYield.toFixed(1)}%</Text>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "2px 0 0" }}>After all costs</Text>
                </div>
              </Column>
            </Row>
            <Row>
              <Column style={{ width: "50%", paddingRight: 6 }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "14px 16px" }}>
                  <Text style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Monthly Cash Flow</Text>
                  <Text style={{ color: cfColor(deal.monthlyCF), fontSize: 24, fontWeight: 800, margin: 0 }}>{fmt(deal.monthlyCF)}</Text>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "2px 0 0" }}>Net income / month</Text>
                </div>
              </Column>
              <Column style={{ width: "50%", paddingLeft: 6 }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #e5e7eb", padding: "14px 16px" }}>
                  <Text style={{ color: MUTED, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>Cash-on-Cash</Text>
                  <Text style={{ color: deal.cashOnCash >= 8 ? "#16a34a" : deal.cashOnCash >= 4 ? "#c9a84c" : "#dc2626", fontSize: 24, fontWeight: 800, margin: 0 }}>{deal.cashOnCash.toFixed(1)}%</Text>
                  <Text style={{ color: MUTED, fontSize: 11, margin: "2px 0 0" }}>Return on cash invested</Text>
                </div>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "8px 0 20px" }} />

          {/* Investment Summary */}
          <Section style={{ padding: "0 0 8px" }}>
            <Heading as="h2" style={{ color: NAVY, fontSize: 16, fontWeight: 800, margin: "0 0 12px" }}>
              Investment Summary
            </Heading>
            {[
              ["Strategy", deal.strategy],
              ["Purchase Price", fmt(deal.purchasePrice)],
              ["Monthly Rent", fmt(deal.monthlyRent)],
              ["Annual Net Income", fmt(deal.netIncome)],
              ["Total Cash Required", fmt(deal.totalCashIn)],
            ].map(([label, value]) => (
              <Row key={label} style={{ borderBottom: "1px solid #f1f5f9", padding: "8px 0" }}>
                <Column><Text style={{ color: MUTED, fontSize: 13, margin: 0 }}>{label}</Text></Column>
                <Column style={{ textAlign: "right" as const }}><Text style={{ color: NAVY, fontSize: 13, fontWeight: 600, margin: 0 }}>{value}</Text></Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />

          {/* CTA */}
          <Section style={{ backgroundColor: NAVY, borderRadius: 12, padding: "24px", textAlign: "center" as const }}>
            <Text style={{ color: GOLD, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 8px" }}>
              Run another analysis
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>
              Analyse any UK property with 8 metrics, AI verdict, and BRRR/HMO/Rent-to-Rent tabs — all free.
            </Text>
            <Button href={`${BASE}/calculators/deal-analyser`}
              style={{ backgroundColor: GOLD, color: NAVY, fontSize: 14, fontWeight: 800, padding: "13px 26px", borderRadius: 10, textDecoration: "none" }}>
              Open Deal Analyser →
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ padding: "24px 0 32px", textAlign: "center" as const }}>
            <Text style={{ color: MUTED, fontSize: 12, margin: "0 0 12px" }}>
              Want guaranteed rent on a Midlands property? A fixed monthly income for 3–5 years, paid whether or not the property is occupied, with day-to-day management handled.
            </Text>
            <Button href={`${BASE}/guaranteed-rent`}
              style={{ backgroundColor: "#ffffff", color: NAVY, border: `1px solid #e5e7eb`, fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
              Get a Free Rent Estimate
            </Button>
            <Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />
            <Text style={{ color: "#9ca3af", fontSize: 11, margin: 0, lineHeight: 1.6 }}>
              PropertyVault UK · propertyvaultuk.co.uk · Midlands, England
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
