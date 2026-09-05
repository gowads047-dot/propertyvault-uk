import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { ServiceCard } from "@/components/services/Readiness";
import { SERVICES } from "@/lib/services";
import { COMPLIANCE_ITEMS, JURISDICTION_NOTE, OBLIGATION_LABEL, OBLIGATION_MEANING } from "@/lib/compliance-items";
import { canonical, SITE_URL, siteMetrics } from "@/lib/site";

/**
 * The landlord entry point, replacing /landlord-hub and /manage.
 *
 * Both are folded in here, but not wholesale. /manage advertised nine services
 * with firm prices — referencing "From £15/tenant", rent collection at "1% of
 * rent collected", inventories "From £10/report" — none of which exist in the
 * codebase and none of which has a Stripe price behind it. It also described
 * generating "Assured Shorthold Tenancy (AST) agreements", two directories
 * away from /landlord-hub correctly explaining that the Renters' Rights Act
 * has removed ASTs for new tenancies. The site was contradicting itself on the
 * biggest change in UK lettings in thirty years.
 *
 * What carries over is what is true: the compliance checklist, the possession
 * position, insurance, and the parts of Rentura that actually run.
 */

const TITLE = "For Landlords — Compliance, Tenancies and Getting Paid";
const DESCRIPTION =
  "What UK landlords have to do, what is optional, and where PropertyVault can take the work " +
  "off you. Compliance checklist for England, the possession position after the Renters' Rights " +
  "Act, and the landlord dashboard.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/landlords/") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/landlords/"),
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "PropertyVault for landlords" }],
  },
};

const OBLIGATION_TONE = {
  legal:       { fg: "var(--state-verified)",  bg: "color-mix(in srgb, var(--state-verified) 13%, transparent)" },
  conditional: { fg: "var(--state-estimated)", bg: "color-mix(in srgb, var(--state-estimated) 13%, transparent)" },
  recommended: { fg: "var(--ink-subtle)",      bg: "color-mix(in srgb, var(--ink-subtle) 13%, transparent)" },
} as const;

const landlordServices = SERVICES.filter(s =>
  ["rent-ready", "let", "manage", "optimise"].includes(s.stage),
);

export default function LandlordsPage() {
  return (
    <>
      <section className="gradient-navy" style={{ padding: "56px 0 48px" }}>
        <div className="container-max px-4">
          <div style={{ maxWidth: 700 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-ink)", marginBottom: 12 }}>
              Landlords
            </p>
            <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(30px, 4.4vw, 46px)", fontWeight: 800, color: "white", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 18 }}>
              Know what you owe, and to whom
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.62)", lineHeight: 1.6, marginBottom: 28 }}>
              Most landlord checklists put every item in one list, so a hard five-yearly legal duty
              and a piece of sensible housekeeping look identical. This one says which is which —
              and admits where the law has moved and we have not had the new position confirmed.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/rentura" className="btn-gold" style={{ fontSize: 15, padding: "13px 24px" }}>
                Try the landlord dashboard →
              </Link>
              <Link href="/guaranteed-rent" style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.75)", padding: "13px 22px", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 10, textDecoration: "none" }}>
                Or hand it over entirely
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "36px 0 12px" }}>
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Landlords" }]} />
        </div>
      </section>

      {/* ── COMPLIANCE ─────────────────────────────────────── */}
      <section style={{ background: "var(--page-surface)", padding: "20px 0 56px" }}>
        <div className="container-max px-4" style={{ maxWidth: 860 }}>
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
            Compliance checklist
          </h2>

          <div
            role="note"
            style={{
              background: "color-mix(in srgb, var(--state-estimated) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--state-estimated) 30%, transparent)",
              borderRadius: 10, padding: "12px 16px", margin: "14px 0 22px",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>
              <strong>England only.</strong> {JURISDICTION_NOTE.replace("This list is for England. ", "")}
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", marginBottom: 20 }}>
            {(["legal", "conditional", "recommended"] as const).map(o => (
              <div key={o} style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", padding: "0.1rem 0.45rem",
                  borderRadius: 3, color: OBLIGATION_TONE[o].fg, background: OBLIGATION_TONE[o].bg,
                }}>
                  {OBLIGATION_LABEL[o]}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-muted)" }}>{OBLIGATION_MEANING[o]}</span>
              </div>
            ))}
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {COMPLIANCE_ITEMS.map(c => (
              <li
                key={c.id}
                style={{
                  background: "var(--card-surface)", border: "1.5px solid var(--hairline)",
                  borderRadius: 12, padding: "16px 18px",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", margin: 0 }}>{c.item}</h3>
                  <span
                    title={OBLIGATION_MEANING[c.obligation]}
                    style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", padding: "0.1rem 0.45rem",
                      borderRadius: 3, whiteSpace: "nowrap",
                      color: OBLIGATION_TONE[c.obligation].fg, background: OBLIGATION_TONE[c.obligation].bg,
                    }}
                  >
                    {OBLIGATION_LABEL[c.obligation]}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-muted)", marginLeft: "auto" }}>
                    {c.frequency}
                  </span>
                </div>

                {c.appliesWhen ? (
                  <p style={{ fontSize: 13, color: "var(--ink)", margin: "0 0 6px", fontWeight: 600 }}>
                    Applies when {c.appliesWhen}.
                  </p>
                ) : null}

                <p style={{ fontSize: 13.5, color: "var(--ink-muted)", lineHeight: 1.6, margin: "0 0 8px" }}>
                  {c.detail}
                </p>

                {c.reviewNote ? (
                  <p style={{
                    fontSize: 12.5, color: "var(--ink)", lineHeight: 1.55, margin: "0 0 8px",
                    padding: "9px 12px", borderRadius: 8,
                    background: "color-mix(in srgb, var(--state-assumed) 10%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--state-assumed) 28%, transparent)",
                  }}>
                    <strong>Under review.</strong> {c.reviewNote}
                  </p>
                ) : null}

                <p style={{ fontSize: 11.5, color: "var(--ink-subtle)", margin: 0 }}>{c.source}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── POSSESSION ─────────────────────────────────────── */}
      <section style={{ background: "var(--card-surface)", borderTop: "1px solid var(--hairline)", padding: "48px 0" }}>
        <div className="container-max px-4" style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 800, color: "var(--ink)", marginBottom: 14 }}>
            Ending a tenancy, after the Renters&apos; Rights Act
          </h2>
          <div style={{ fontSize: 14.5, color: "var(--ink-muted)", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "var(--ink)" }}>Section 21 no-fault possession is gone.</strong>{" "}
              A landlord can no longer end a tenancy without a reason the law recognises. New
              tenancies are periodic — a fixed-term assured shorthold tenancy cannot be granted.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "var(--ink)" }}>Section 8 is the route that remains.</strong>{" "}
              It requires a specific ground: rent arrears, the landlord selling, a family member
              moving in, or antisocial behaviour, among others. Each ground carries its own notice
              period and its own evidential burden.
            </p>
            <p style={{ margin: 0 }}>
              A court can refuse possession even where the ground is made out, if the correct
              procedure was not followed at the start of the tenancy. The prescribed documents and
              the deposit rules are not paperwork — they are what a possession claim rests on.
            </p>
          </div>

          <div
            role="note"
            style={{
              marginTop: 18, padding: "12px 16px", borderRadius: 10,
              background: "color-mix(in srgb, var(--state-assumed) 9%, transparent)",
              border: "1px solid color-mix(in srgb, var(--state-assumed) 28%, transparent)",
            }}
          >
            <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>
              <strong>Awaiting legal review.</strong> Notice periods and the commencement dates for
              individual provisions are being checked with a solicitor before this page states them.
              We would rather leave a gap than fill it from memory. For a live possession matter,
              take advice — this is general information, not advice on your situation.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────── */}
      <section style={{ background: "var(--page-surface)", padding: "48px 0" }}>
        <div className="container-max px-4">
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 800, color: "var(--ink)", marginBottom: 6 }}>
            Where we can take the work off you
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 22, maxWidth: 620 }}>
            Two of these run today. The rest are marked as coming soon rather than sold to you —
            and none of them shows a price until there is one to charge.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {landlordServices.map(s => <ServiceCard key={s.slug} service={s} />)}
          </div>
        </div>
      </section>

      {/* ── INSURANCE + RESOURCES ──────────────────────────── */}
      <section style={{ background: "var(--card-surface)", borderTop: "1px solid var(--hairline)", padding: "48px 0" }}>
        <div className="container-max px-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 20, fontWeight: 800, color: "var(--ink)", marginBottom: 12 }}>
              Insurance worth having
            </h2>
            <dl style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              {[
                ["Buildings", "Covers the structure. Most lenders require it as a condition of the mortgage, so this one is rarely optional in practice."],
                ["Landlord contents", "Your furnishings and fittings, where you let furnished."],
                ["Rent guarantee", "Pays the rent if the tenant defaults, usually up to twelve months plus legal costs."],
                ["Property owners' liability", "Claims from a tenant or visitor injured at the property."],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <dt style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{k}</dt>
                  <dd style={{ margin: "2px 0 0", color: "var(--ink-muted)" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 20, fontWeight: 800, color: "var(--ink)", marginBottom: 12 }}>
              Free to use
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/templates", label: `${siteMetrics.templates} landlord templates`, desc: "Notices, letters and checklists" },
                { href: "/calculators/landlord-tax", label: "Landlord tax calculator", desc: "Section 24 and your real position" },
                { href: "/calculators/rental-yield", label: "Rental yield", desc: "Gross and net, on your numbers" },
                { href: "/hmo-hub", label: "HMO hub", desc: "Licensing, standards and the numbers" },
                { href: "/list-property", label: "List a property", desc: "Put it in front of tenants" },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12,
                    padding: "10px 14px", borderRadius: 10, textDecoration: "none",
                    border: "1px solid var(--hairline)", background: "var(--page-surface)",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{l.label}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-subtle)", textAlign: "right" }}>{l.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "32px 0 48px" }}>
        <div className="container-max px-4" style={{ maxWidth: 820 }}>
          <Disclaimer type="legal" />
        </div>
      </section>
    </>
  );
}
