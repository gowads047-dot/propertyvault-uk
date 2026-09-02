import type { ScoreBand } from "@/lib/deal-score";

/**
 * The PropertyVault Score, given the treatment it earns.
 *
 * The score already existed as a small gauge tucked into a hero. It is the
 * signature metric — the thing a viewer should recognise before they read the
 * username — so it gets the space, and it always shows its workings.
 *
 * A score with no breakdown is a credit score: a number to be trusted or not.
 * A score that says "cash flow 5.4 of 25, because it clears £65 a month" is an
 * argument, which is the difference this product is selling.
 */

const BAND_COLOUR: Record<ScoreBand, string> = {
  STRONG: "var(--ok)",
  WATCHLIST: "var(--gold-ink)",
  RISKY: "var(--state-estimated)",
  PASS: "var(--danger)",
};

const BAND_MEANING: Record<ScoreBand, string> = {
  STRONG: "Worth pursuing on these numbers",
  WATCHLIST: "Workable, but not at this price",
  RISKY: "Thin, and sensitive to rates",
  PASS: "The numbers do not support it",
};

export interface ScoreComponentView {
  key: string;
  label: string;
  score: number;
  max: number;
  reason: string;
}

export function PVScore({
  total,
  band,
  components,
  excluded,
}: {
  total: number;
  band: ScoreBand;
  components: ScoreComponentView[];
  excluded?: { label: string; reason: string }[];
}) {
  const colour = BAND_COLOUR[band];

  return (
    <section
      style={{
        background: "var(--card-surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "8px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.9rem", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            lineHeight: 1,
            color: colour,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {total}
        </span>
        <span style={{ color: "var(--ink-subtle)", fontSize: "1rem" }}>/ 100</span>
        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.15rem",
          }}
        >
          <strong style={{ color: colour, letterSpacing: "0.06em", fontSize: "0.9rem" }}>{band}</strong>
          <span style={{ color: "var(--ink-subtle)", fontSize: "0.78rem" }}>{BAND_MEANING[band]}</span>
        </span>
      </div>

      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-subtle)",
          margin: 0,
        }}
      >
        Why {total}
      </p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {components.map(c => (
          <div
            key={c.key}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "1rem",
              padding: "0.5rem 0",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <span style={{ minWidth: 0 }}>
              <strong style={{ color: "var(--ink)", fontSize: "0.875rem" }}>{c.label}</strong>
              <span style={{ color: "var(--ink-muted)", fontSize: "0.8125rem" }}> — {c.reason}</span>
            </span>
            <span
              style={{
                fontWeight: 700,
                color: "var(--ink)",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {c.score}/{c.max}
            </span>
          </div>
        ))}
      </div>

      {/* What was not scored, and why. Silence here would read as "all fine". */}
      {excluded && excluded.length > 0 && (
        <div
          style={{
            borderTop: "1px solid var(--hairline)",
            paddingTop: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "var(--ink-subtle)", margin: 0 }}>
            Not scored, and not guessed:
          </p>
          {excluded.map(e => (
            <p key={e.label} style={{ fontSize: "0.78rem", color: "var(--ink-muted)", margin: 0 }}>
              <strong>{e.label}</strong> — {e.reason}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
