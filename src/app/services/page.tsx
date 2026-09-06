import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { ServiceCard } from "@/components/services/Readiness";
import { servicesByStage, SERVICES, READINESS_LABEL, READINESS_MEANING } from "@/lib/services";
import { canonical, SITE_URL } from "@/lib/site";

const TITLE = "Property Services — What PropertyVault Can Do For You";
const DESCRIPTION =
  "Every PropertyVault service, in the order you meet it: finding a property, buying it, " +
  "getting it let, and managing it. Each one says plainly whether it is running today or " +
  "still being built.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/services/") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/services/"),
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "PropertyVault services" }],
  },
};

const liveCount = SERVICES.filter(s => s.readiness === "live" || s.readiness === "request").length;

export default function ServicesPage() {
  return (
    <>
      <section className="gradient-navy" style={{ padding: "56px 0 48px" }}>
        <div className="container-max px-4">
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-ink)", marginBottom: 12 }}>
              Services
            </p>
            <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(30px, 4.4vw, 46px)", fontWeight: 800, color: "white", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 18 }}>
              One place for everything property
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>
              Owning a property is a sequence, not a single decision. These are the points along it
              where PropertyVault can do the work — and the ones where, honestly, it cannot yet.
            </p>
          </div>
        </div>
      </section>

      {/* What each label means. Stated once, up front, so nothing below is
          ambiguous — a waitlist and a running service must never look alike. */}
      <section style={{ background: "var(--page-surface)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="container-max px-4" style={{ padding: "20px 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px", justifyContent: "center" }}>
            {/* Only the states something is actually in. Explaining a label no
                service carries invites the reader to look for it. */}
            {(["live", "request", "partner", "waitlist"] as const)
              .filter(r => SERVICES.some(s => s.readiness === r))
              .map(r => (
              <div key={r} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>{READINESS_LABEL[r]}</span>
                <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{READINESS_MEANING[r]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "40px 0 56px" }}>
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Services" }]} />

          <p style={{ fontSize: 14, color: "var(--ink-muted)", margin: "16px 0 32px", maxWidth: 640 }}>
            {liveCount} of these are running today. The rest are marked as such rather than
            advertised — you will never find a price here for something you cannot buy.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {servicesByStage().map(group => (
              <div key={group.stage}>
                <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 20, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>
                  {group.label}
                </h2>
                <div style={{ height: 2, width: 44, background: "var(--gold-ink)", marginBottom: 18 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {group.services.map(s => <ServiceCard key={s.slug} service={s} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--card-surface)", borderTop: "1px solid var(--hairline)", padding: "48px 0" }}>
        <div className="container-max px-4" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "var(--ink)", marginBottom: 12 }}>
            Not sure which one you need?
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-muted)", maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Start with the property. Vault it, see what the numbers and the sold evidence say,
            and the next step usually picks itself.
          </p>
          <Link href="/vault" className="btn-gold">Vault a property →</Link>
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
