import type { MaximumOffer } from "@/lib/max-offer";

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

/**
 * The Maximum Offer.
 *
 * The visual job here is a single comparison: what they are asking, against
 * what the deal supports. Everything else is subordinate to that gap, because
 * the gap is the negotiating position and the reason someone came to the site.
 *
 * When no price works the card must not fall back to showing a number anyway.
 * It states that the income is the problem, which is a different conversation
 * and a more useful one than a discount.
 */
export function MaxOfferCard({ offer, explanation }: { offer: MaximumOffer; explanation: string }) {
  const impossible = offer.maxOffer === null;

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
      <p
        style={{
          fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--ink-subtle)", margin: 0,
        }}
      >
        What to offer
      </p>

      {impossible ? (
        <p style={{ color: "var(--state-missing)", fontWeight: 600, margin: 0 }}>{explanation}</p>
      ) : (
        <>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "baseline" }}>
            <Figure label="Asking" value={gbp(offer.askingPrice)} muted />
            <Figure
              label="PropertyVault maximum"
              value={gbp(offer.maxOffer!)}
              emphasis
            />
            {offer.openingOffer !== null && (
              <Figure label="Opening offer" value={gbp(offer.openingOffer)} muted />
            )}
          </div>

          {offer.discount > 0 && (
            <p
              style={{
                margin: 0, fontWeight: 700, color: "var(--danger)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              −{gbp(offer.discount)} · {offer.discountPct}% below asking
            </p>
          )}

          <p style={{ margin: 0, color: "var(--ink-muted)", fontSize: "0.9rem" }}>{explanation}</p>

          {offer.atMax && (
            <p style={{ margin: 0, color: "var(--ink-subtle)", fontSize: "0.8125rem" }}>
              At {gbp(offer.maxOffer!)}: {gbp(offer.atMax.monthlyCashflow)}/mo cash flow,{" "}
              {offer.atMax.netYieldPct}% net yield, score {offer.atMax.score} {offer.atMax.band}.
              Cash needed {gbp(offer.atMax.cashRequired)}.
            </p>
          )}
        </>
      )}
    </section>
  );
}

function Figure({
  label, value, emphasis, muted,
}: { label: string; value: string; emphasis?: boolean; muted?: boolean }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
      <span style={{ fontSize: "0.72rem", color: "var(--ink-subtle)", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: emphasis ? "2rem" : "1.15rem",
          fontWeight: emphasis ? 800 : 600,
          lineHeight: 1.1,
          color: emphasis ? "var(--ink)" : muted ? "var(--ink-muted)" : "var(--ink)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </span>
  );
}
