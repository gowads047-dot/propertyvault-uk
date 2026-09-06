import Link from "next/link";
import type { Readiness, Service } from "@/lib/services";
import { READINESS_LABEL, READINESS_MEANING } from "@/lib/services";

/**
 * What a visitor actually gets if they click, shown next to the service.
 *
 * Modelled on DataState, and for the same reason. That chip stops an estimate
 * being mistaken for a verified fact; this one stops a waitlist being mistaken
 * for a service you can buy. Colour is never the only signal — the label says
 * it, and the meaning is in the title for hover and assistive technology.
 */

const TONE: Record<Readiness, { fg: string; bg: string }> = {
  live:     { fg: "var(--state-verified)",  bg: "color-mix(in srgb, var(--state-verified) 13%, transparent)" },
  request:  { fg: "var(--state-calculated)", bg: "color-mix(in srgb, var(--state-calculated) 13%, transparent)" },
  waitlist: { fg: "var(--ink-subtle)",       bg: "color-mix(in srgb, var(--ink-subtle) 13%, transparent)" },
};

export function ReadinessChip({ readiness }: { readiness: Readiness }) {
  const tone = TONE[readiness];
  return (
    <span
      title={READINESS_MEANING[readiness]}
      aria-label={`${READINESS_LABEL[readiness]}. ${READINESS_MEANING[readiness]}`}
      style={{
        display: "inline-flex", alignItems: "center",
        fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.03em",
        padding: "0.1rem 0.45rem", borderRadius: 3, whiteSpace: "nowrap",
        color: tone.fg, background: tone.bg,
      }}
    >
      {READINESS_LABEL[readiness]}
    </span>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={service.href}
      style={{
        display: "flex", flexDirection: "column", gap: 10,
        background: "var(--card-surface)", border: "1.5px solid var(--hairline)",
        borderRadius: 14, padding: "20px 22px", textDecoration: "none", height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{service.name}</span>
        <ReadinessChip readiness={service.readiness} />
      </div>

      <p style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.55, margin: 0, flex: 1 }}>
        {service.summary}
      </p>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold-ink)" }}>{service.cta} →</span>
        {/* Only a live service carries a price. services.test.ts enforces it. */}
        {service.price ? (
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
            {service.price}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
