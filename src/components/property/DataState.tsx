import type { EvidenceState } from "@/lib/property";

/**
 * Where a figure came from, shown next to the figure.
 *
 * This is the differentiator made visible. A model can read a listing; it
 * cannot tell you which of its numbers came from an official register and
 * which it assumed. Every figure PropertyVault shows carries one of these.
 *
 * Colour is never the only signal — each chip carries its label, and the
 * source and method are in the title attribute — so the meaning survives
 * greyscale, colour blindness and a screen reader.
 */

const LABEL: Record<EvidenceState, string> = {
  verified: "Verified",
  estimated: "Estimated",
  calculated: "Calculated",
  assumed: "Assumed",
  user: "You",
  missing: "Not checked",
};

/**
 * A one-line explanation of what each state means, shown on hover and read by
 * assistive technology. Written for someone who has never seen the product.
 */
const MEANING: Record<EvidenceState, string> = {
  verified: "From an official register, on the date shown",
  estimated: "Derived from comparable properties, as a range",
  calculated: "Worked out by PropertyVault from the figures above",
  assumed: "A default you can change",
  user: "A figure you provided",
  missing: "Not available — this has not been checked",
};

/** A short glyph per state. Redundant with the label, never a replacement. */
const GLYPH: Record<EvidenceState, string> = {
  verified: "✓", estimated: "≈", calculated: "=", assumed: "·", user: "✎", missing: "—",
};

export function DataState({
  state,
  source,
  method,
  checkedAt,
}: {
  state: EvidenceState;
  source?: string | null;
  method?: string | null;
  checkedAt?: string | null;
}) {
  const detail = [
    MEANING[state],
    source ? `Source: ${source}` : null,
    method ? `Method: ${method}` : null,
    checkedAt ? `Checked: ${checkedAt}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <span
      title={detail}
      aria-label={`${LABEL[state]}. ${detail}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        fontSize: "0.6875rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "0.1rem 0.4rem",
        borderRadius: "3px",
        whiteSpace: "nowrap",
        color: `var(--state-${state})`,
        background: `color-mix(in srgb, var(--state-${state}) 13%, transparent)`,
      }}
    >
      <span aria-hidden="true">{GLYPH[state]}</span>
      {LABEL[state]}
    </span>
  );
}

/** One figure with its provenance. The atom the whole evidence view is built from. */
export function EvidenceRow({
  label,
  value,
  state,
  source,
  method,
}: {
  label: string;
  value: string;
  state: EvidenceState;
  source?: string | null;
  method?: string | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.55rem 0",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <span style={{ color: "var(--ink-muted)", fontSize: "0.875rem" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            fontWeight: 700,
            color: state === "missing" ? "var(--ink-subtle)" : "var(--ink)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {state === "missing" ? "—" : value}
        </span>
        <DataState state={state} source={source} method={method} />
      </span>
    </div>
  );
}
