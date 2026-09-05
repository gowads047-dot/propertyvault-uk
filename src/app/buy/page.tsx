import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { ServiceCard } from "@/components/services/Readiness";
import { SERVICES } from "@/lib/services";
import { canonical, SITE_URL, siteMetrics } from "@/lib/site";

/**
 * The entry point for someone buying a property.
 *
 * The site had no such page. Everything a buyer needs — the Vault, the agent,
 * twenty-three calculators, area guides, sold prices — existed, scattered
 * across four nav groups organised by what each thing is rather than by what
 * the visitor is trying to do. This page is the missing "I am buying" door.
 */

const TITLE = "Buying a Property — Check It Before You Offer";
const DESCRIPTION =
  "Work out whether a UK property is worth buying. Check sold prices, run the numbers, " +
  "see the risks, and find the most you should offer — with every figure sourced.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/buy/") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/buy/"),
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Buying a property with PropertyVault" }],
  },
};

/**
 * The order a purchase actually happens in. Numbered because it is a real
 * sequence — you cannot sensibly offer before you have checked the evidence.
 */
const STEPS = [
  {
    n: "01",
    title: "Find something worth looking at",
    body: "Search the portals, or start from an area guide if you do not know where yet.",
    links: [
      { href: "/search", label: "Property search" },
      { href: "/areas", label: `${siteMetrics.areaGuides} area guides` },
      { href: "/areas/postcodes", label: "Postcode yields" },
    ],
  },
  {
    n: "02",
    title: "Check what it is really worth",
    body: "What did comparable properties actually sell for? HM Land Registry knows, and it is free.",
    links: [
      { href: "/sold-prices", label: "Sold prices" },
      { href: "/valuation", label: "Valuation estimate" },
    ],
  },
  {
    n: "03",
    title: "Vault it",
    body: "Score the deal against the sold evidence, see the risks, and get the most you should offer — with the source of every figure shown, including the checks that could not be run.",
    links: [
      { href: "/vault", label: "Vault a property" },
      { href: "/ask", label: "Ask about a property" },
    ],
    feature: true,
  },
  {
    n: "04",
    title: "Run your own numbers",
    body: "Stamp duty, yield, cash flow, mortgage costs and the tax position — check the ones the deal turns on.",
    links: [
      { href: "/calculators/deal-analyser", label: "Deal Analyser" },
      { href: "/calculators/stamp-duty", label: "Stamp duty" },
      { href: "/calculators", label: `All ${siteMetrics.calculators} calculators` },
    ],
  },
  {
    n: "05",
    title: "Get the right people in",
    body: "A broker, a solicitor and a surveyor. PropertyVault introduces you; they do the regulated work.",
    links: [
      { href: "/find-agent", label: "Find a professional" },
      { href: "/mortgages", label: "Mortgage guides" },
    ],
  },
];

const buyerServices = SERVICES.filter(s =>
  ["discover", "acquire", "complete"].includes(s.stage),
);

export default function BuyPage() {
  return (
    <>
      <section className="gradient-navy" style={{ padding: "56px 0 48px" }}>
        <div className="container-max px-4">
          <div style={{ maxWidth: 680 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-ink)", marginBottom: 12 }}>
              Buying
            </p>
            <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(30px, 4.4vw, 46px)", fontWeight: 800, color: "white", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 18 }}>
              Check it before you offer
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.62)", lineHeight: 1.6, marginBottom: 28 }}>
              An asking price is an opinion. Sold prices are a record. PropertyVault puts the two
              side by side, runs the numbers, and shows you where every figure came from — including
              the ones it could not find.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/vault" className="btn-gold" style={{ fontSize: 15, padding: "13px 24px" }}>
                Vault a property →
              </Link>
              <Link href="/ask" style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.75)", padding: "13px 22px", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 10, textDecoration: "none" }}>
                Or just ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "36px 0 56px" }}>
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Buying" }]} />

          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "var(--ink)", margin: "28px 0 6px" }}>
            How a purchase goes
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-muted)", marginBottom: 28, maxWidth: 620 }}>
            Every step below is free. Nothing here needs an account.
          </p>

          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {STEPS.map(step => (
              <li
                key={step.n}
                style={{
                  display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "start",
                  background: step.feature ? "var(--card-surface)" : "transparent",
                  border: step.feature ? "1.5px solid var(--gold-ink)" : "1.5px solid var(--hairline)",
                  borderRadius: 14, padding: "18px 20px",
                }}
              >
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, fontWeight: 700, color: "var(--gold-ink)", paddingTop: 2 }}>
                  {step.n}
                </span>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 5 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 12 }}>{step.body}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {step.links.map(l => (
                      <Link
                        key={l.href}
                        href={l.href}
                        style={{
                          fontSize: 13, fontWeight: 600, color: "var(--ink)", textDecoration: "none",
                          padding: "6px 12px", border: "1px solid var(--hairline)",
                          borderRadius: 8, background: "var(--page-surface)",
                        }}
                      >
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ background: "var(--card-surface)", borderTop: "1px solid var(--hairline)", padding: "48px 0" }}>
        <div className="container-max px-4">
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 800, color: "var(--ink)", marginBottom: 6 }}>
            Where we can do the work for you
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 22, maxWidth: 600 }}>
            Each one says plainly whether it is running today.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {buyerServices.map(s => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "32px 0 48px" }}>
        <div className="container-max px-4" style={{ maxWidth: 820 }}>
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}
