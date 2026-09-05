import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApiForm from "@/components/forms/ApiForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { ReadinessChip } from "@/components/services/Readiness";
import { TrackView } from "@/components/services/TrackView";
import { events } from "@/lib/analytics";
import { SERVICES, findService, READINESS_MEANING, STAGE_LABEL } from "@/lib/services";
import { canonical, SITE_URL } from "@/lib/site";

/**
 * A page per service.
 *
 * Every service in the catalogue needs a real destination, because a card that
 * links nowhere is the placeholder-button problem in a different coat. For a
 * service that is not running, the honest destination is a page that says so
 * and takes a name — not a page that describes a product as though you could
 * order it.
 */

type Params = { params: Promise<{ service: string }> };

export function generateStaticParams() {
  // Only the services whose href is actually under /services/. Guaranteed
  // Rent, Rentura, Vault and the professionals directory all live at their
  // own established URLs and keep them.
  //
  // And not the ones that have outgrown this page. A service described well
  // enough to need its own file gets a directory under /services, and Next
  // serves that in preference — but this route would still prerender a second
  // copy that nothing can reach, which shows up in the build output as the
  // same URL twice. Read from disk rather than a flag on the service, so the
  // two cannot disagree.
  const own = new Set(
    readdirSync(join(process.cwd(), "src", "app", "services"), { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith("["))
      .map(e => e.name),
  );

  return SERVICES
    .filter(s => s.href.startsWith("/services/"))
    .filter(s => !own.has(s.slug))
    .map(s => ({ service: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service) return {};

  const title = `${service.name} — PropertyVault`;
  const url = canonical(`/services/${slug}/`);
  return {
    title,
    description: service.summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: service.summary,
      url,
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: service.name }],
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { service: slug } = await params;
  const service = findService(slug);
  if (!service || !service.href.startsWith("/services/")) notFound();

  const isWaitlist = service.readiness === "waitlist";

  return (
    <>
      <TrackView event={events.serviceViewed} params={{ service: service.slug, readiness: service.readiness }} />

      <section className="gradient-navy" style={{ padding: "48px 0 44px" }}>
        <div className="container-max px-4">
          <div style={{ maxWidth: 680 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-ink)", marginBottom: 12 }}>
              {STAGE_LABEL[service.stage]}
            </p>
            <h1 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16 }}>
              {service.name}
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.62)", lineHeight: 1.6, marginBottom: 20 }}>
              {service.summary}
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

      <section style={{ background: "var(--page-surface)", padding: "32px 0 56px" }}>
        <div className="container-max px-4" style={{ maxWidth: 720 }}>
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.name }]} />

          {isWaitlist ? (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: 22, fontWeight: 800, color: "var(--ink)", marginBottom: 10 }}>
                This one is not running yet
              </h2>
              <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.65, marginBottom: 8 }}>
                We would rather tell you that than take an enquiry we cannot answer. Leave your
                details and we will get in touch when {service.name} opens — and if you tell us
                about the property, it helps us build the right thing.
              </p>
              <p style={{ fontSize: 14, color: "var(--ink-subtle)", lineHeight: 1.6, marginBottom: 24 }}>
                Nothing to pay, and no obligation when it does open.
              </p>

              <div style={{ background: "var(--card-surface)", border: "1.5px solid var(--hairline)", borderRadius: 14, padding: "22px 24px" }}>
                <ApiForm
                  source={`waitlist:${service.slug}`}
                  submitLabel="Join the waitlist"
                  successTitle="You are on the list."
                  successBody={`We will email you when ${service.name} opens. Nothing else — we will not add you to a newsletter.`}
                  sentEvent={events.waitlistJoined}
                  sentParams={{ service: service.slug }}
                  className="space-y-4"
                >
                  <input type="hidden" name="subject" value={`Waitlist — ${service.name}`} />
                  <div>
                    <label htmlFor="wl-name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Your name</label>
                    <input id="wl-name" name="name" type="text" required maxLength={100} autoComplete="name" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label htmlFor="wl-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Email</label>
                    <input id="wl-email" name="email" type="email" required maxLength={200} autoComplete="email" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label htmlFor="wl-msg" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
                      What would you want it to do? <span style={{ fontWeight: 400, color: "var(--ink-subtle)" }}>Optional</span>
                    </label>
                    <textarea id="wl-msg" name="message" rows={3} maxLength={5000} className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  </div>
                </ApiForm>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.65, marginBottom: 20 }}>
                {READINESS_MEANING[service.readiness]}.
              </p>
              <Link href="/contact" className="btn-gold">{service.cta} →</Link>
            </div>
          )}

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--hairline)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
              In the meantime
            </h3>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 14 }}>
              The free tools do a lot of this work already. Vault the property and you will have
              the numbers, the sold evidence and the risks in front of you today.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/vault" className="btn-gold">Vault a property</Link>
              <Link href="/services" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", padding: "10px 20px", border: "1.5px solid var(--hairline)", borderRadius: 10, background: "var(--page-surface)", textDecoration: "none" }}>
                All services
              </Link>
            </div>
          </div>

          <div style={{ marginTop: 36 }}>
            <Disclaimer type="general" />
          </div>
        </div>
      </section>
    </>
  );
}
