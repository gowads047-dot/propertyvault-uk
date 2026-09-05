import type { Metadata } from "next";
import Link from "next/link";
import ApiForm from "@/components/forms/ApiForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { ReadinessChip } from "@/components/services/Readiness";
import { ReportChecklist } from "@/components/services/ReportChecklist";
import { TrackView } from "@/components/services/TrackView";
import { events } from "@/lib/analytics";
import { coverage } from "@/lib/vaultcheck";
import { findService, READINESS_MEANING } from "@/lib/services";
import { canonical, SITE_URL } from "@/lib/site";

/**
 * VaultCheck Pro, described rather than advertised.
 *
 * This had been the generic waitlist page every unbuilt service gets: a name,
 * a one-line summary and a form. That is the weakest thing we can put in front
 * of somebody — it asks them to register interest in a product nobody has
 * described, and it tells us nothing about whether the product is right.
 *
 * The page now shows the whole report: sixteen questions, each labelled with
 * who answers it. It still takes a name and still charges nothing, because the
 * service is not running and no Stripe price exists for it. What changed is
 * that a visitor can now decide whether they want it.
 */

const FIELD =
  "w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400";

const TITLE = "VaultCheck Pro — A Written Report Before You Offer";
const DESCRIPTION =
  "Sixteen questions a buyer needs answered before offering on a UK property, and who can " +
  "answer each one. Eight come from the free Vault. Six need a person. Two need a professional, " +
  "and we say so.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/services/vaultcheck-pro/") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/services/vaultcheck-pro/"),
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "VaultCheck Pro" }],
  },
};

export default function VaultCheckProPage() {
  const service = findService("vaultcheck-pro")!;
  // Counted from the report definition rather than typed into the copy, so a
  // seventeenth question cannot leave the prose saying sixteen.
  const c = coverage([]);

  return (
    <>
      <TrackView event={events.serviceViewed} params={{ service: service.slug, readiness: service.readiness }} />

      <section className="gradient-navy" style={{ padding: "48px 0 44px" }}>
        <div className="container-max px-4">
          <div style={{ maxWidth: 680 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-ink)", marginBottom: 12 }}>
              Before you offer
            </p>
            <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16 }}>
              VaultCheck Pro
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.62)", lineHeight: 1.6, marginBottom: 20 }}>
              A written report on one property, answering the {c.total} questions below. The free
              Vault already answers {c.byAnswerer.evidence.total} of them from public records and
              your own numbers. {c.byAnswerer.analyst.total} need somebody to do the work.
              The last {c.byAnswerer.professional.total} need a professional, and we will not
              pretend otherwise.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "7px 14px" }}>
              <ReadinessChip readiness={service.readiness} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {READINESS_MEANING[service.readiness]}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "32px 0 20px" }}>
        <div className="container-max px-4" style={{ maxWidth: 760 }}>
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "VaultCheck Pro" }]} />
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "8px 0 48px" }}>
        <div className="container-max px-4" style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>
            What the report answers
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 26, maxWidth: 620 }}>
            Every one is a question, because that is how a buyer thinks about a property. Nothing
            here is a score, and nothing here tells you whether to buy — that decision stays yours,
            made against evidence you can check line by line.
          </p>

          <ReportChecklist />
        </div>
      </section>

      <section style={{ background: "var(--card-surface)", borderTop: "1px solid var(--hairline)", padding: "44px 0" }}>
        <div className="container-max px-4" style={{ maxWidth: 620 }}>
          <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 22, fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>
            It is not running yet
          </h2>
          <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.65, marginBottom: 8 }}>
            There is no price on this page because there is nothing to buy yet. Leave your details
            and we will tell you when there is — and if you say which property you are looking at,
            it helps us work out what the report should lead with.
          </p>
          <p style={{ fontSize: 14, color: "var(--ink-subtle)", lineHeight: 1.6, marginBottom: 22 }}>
            In the meantime, the Vault answers {c.byAnswerer.evidence.total} of these for nothing,
            on as many properties as you like.
          </p>

          <div style={{ background: "var(--page-surface)", border: "1.5px solid var(--hairline)", borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
            <ApiForm
              source="waitlist:vaultcheck-pro"
              submitLabel="Join the waitlist"
              successTitle="You are on the list."
              successBody="We will email you when VaultCheck Pro opens. Nothing else — we will not add you to a newsletter."
              sentEvent={events.waitlistJoined}
              sentParams={{ service: "vaultcheck-pro" }}
              className="space-y-4"
            >
              <input type="hidden" name="subject" value="Waitlist — VaultCheck Pro" />
              <div>
                <label htmlFor="vc-name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Your name</label>
                <input id="vc-name" name="name" type="text" required maxLength={100} autoComplete="name" className={FIELD} />
              </div>
              <div>
                <label htmlFor="vc-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Email</label>
                <input id="vc-email" name="email" type="email" required maxLength={200} autoComplete="email" className={FIELD} />
              </div>
              <div>
                <label htmlFor="vc-msg" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                  Which property, and what worries you about it? <span style={{ fontWeight: 400, color: "var(--ink-subtle)" }}>Optional</span>
                </label>
                <textarea id="vc-msg" name="message" rows={3} maxLength={5000} className={FIELD} />
              </div>
            </ApiForm>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/vault" className="btn-gold">Vault a property free</Link>
            <Link
              href="/services"
              style={{
                fontSize: 14, fontWeight: 600, color: "var(--ink)", padding: "10px 20px",
                border: "1.5px solid var(--hairline)", borderRadius: 10,
                background: "var(--page-surface)", textDecoration: "none",
              }}
            >
              All services
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--page-surface)", padding: "32px 0 48px" }}>
        <div className="container-max px-4" style={{ maxWidth: 760 }}>
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}
