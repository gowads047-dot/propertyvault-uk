/**
 * The PropertyVault Score.
 *
 * A single 0–100 rating for a residential investment, built so the same number
 * appears on the site and in the content. If a Reel says 74/100 and the deal
 * analyser says 68, the format is dead — so both read from this file.
 *
 * ── Why these five components and not the six originally proposed ──────────
 *
 * The brief asked for YIELD, CASH FLOW, LOCATION, DEMAND, VALUE and RISK, and
 * also required that the methodology be "transparent, defensible and
 * consistent" and never "pretend a subjective score is objective fact". Those
 * two requirements collide on two of the six:
 *
 *   LOCATION — there is no licensed dataset behind any location rating we
 *              could publish. Scoring it would mean inventing it.
 *   DEMAND   — the rental "demand" labels in the postcode lookup are editorial
 *              judgements typed by hand, not an ONS field. ONS publishes rents
 *              by region, not a demand rating, and not by postcode.
 *
 * So neither is scored. What replaces them is RATE RESILIENCE, which is fully
 * computable, is the single thing that kills first deals, and was missing from
 * the previous score entirely despite the stress test already being on screen.
 *
 * VALUE is scored only when HM Land Registry has sold prices for the postcode
 * — real, official, free, citable. When it does not, VALUE is dropped and the
 * remaining components are normalised, so a score is never inflated or
 * deflated by data we did not have. `componentsScored` says which ran.
 *
 * Every anchor below is a stated threshold, not a curve fitted to anything.
 * They are judgements about what a good deal looks like, and they are visible
 * here so anyone can disagree with them specifically.
 */

export type ScoreBand = "STRONG" | "WATCHLIST" | "RISKY" | "PASS";

export interface ScoreComponent {
  key: string;
  label: string;
  /** Points earned, 0..max. */
  score: number;
  max: number;
  /** Plain-English reason, for the breakdown on screen. */
  reason: string;
}

export interface DealScoreInputs {
  /** Net rental yield after all running costs and finance, as a percentage. */
  netYield: number;
  /** Monthly cash flow after everything, in pounds. Negative is allowed. */
  monthlyCashflow: number;
  /** Annual net income as a percentage of cash actually invested. */
  cashOnCash: number;
  /** Monthly cash flow if the mortgage rate rose two points. */
  cashflowAtPlus2: number;
  /** Asking price. */
  purchasePrice: number;
  /**
   * Median sold price for comparable properties in the postcode, from HM Land
   * Registry. Omit when unavailable — VALUE is then excluded rather than guessed.
   */
  areaMedianSoldPrice?: number;
  /**
   * Equity created by a refurbishment: after-refurb value less price less
   * refurb spend. Only meaningful for BRRR and flips — omit for a plain
   * buy-to-let so the component is excluded rather than scored as a zero,
   * which would penalise every deal that was never trying to create equity.
   */
  equityGain?: number;
}

export interface DealScore {
  /** 0–100, normalised across whichever components could be scored. */
  total: number;
  band: ScoreBand;
  components: ScoreComponent[];
  /** Components deliberately not scored, with the reason. */
  excluded: { label: string; reason: string }[];
  /** How many of the five ran. Shown so a score is never overstated. */
  componentsScored: number;
}

/** Linear interpolation between two anchors, clamped to [0, max]. */
function ramp(value: number, atZero: number, atMax: number, max: number): number {
  if (atMax === atZero) return 0;
  const t = (value - atZero) / (atMax - atZero);
  return Math.max(0, Math.min(max, t * max));
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Anchors, stated so they can be argued with rather than reverse-engineered. */
export const ANCHORS = {
  /** The deal analyser's own guidance: 6% net is the floor most investors use. */
  netYieldFull: 7,
  /** £300/month after everything is a deal that pays for its own surprises. */
  cashflowFull: 300,
  /** 10% cash-on-cash — the capital works about as hard as it would elsewhere. */
  cashOnCashFull: 10,
  /** Survives +2% and still clears £200/month. */
  resilienceFull: 200,
  /** Loses more than £100/month at +2% and it is a bet on the rate. */
  resilienceZero: -100,
  /** 10% under the area median earns full marks; 10% over earns none. */
  valueDiscount: 0.10,
} as const;

export function bandFor(total: number): ScoreBand {
  if (total >= 75) return "STRONG";
  if (total >= 55) return "WATCHLIST";
  if (total >= 35) return "RISKY";
  return "PASS";
}

export function scoreDeal(input: DealScoreInputs): DealScore {
  const components: ScoreComponent[] = [];
  const excluded: DealScore["excluded"] = [];

  // ── YIELD /25 ────────────────────────────────────────────────────────────
  const yieldScore = ramp(input.netYield, 0, ANCHORS.netYieldFull, 25);
  components.push({
    key: "yield",
    label: "Yield",
    score: round1(yieldScore),
    max: 25,
    reason: `${round1(input.netYield)}% net yield after costs and finance`,
  });

  // ── CASH FLOW /25 ────────────────────────────────────────────────────────
  const cfScore = ramp(input.monthlyCashflow, 0, ANCHORS.cashflowFull, 25);
  components.push({
    key: "cashflow",
    label: "Cash flow",
    score: round1(cfScore),
    max: 25,
    reason:
      input.monthlyCashflow < 0
        ? `Loses £${Math.abs(Math.round(input.monthlyCashflow))} a month`
        : `£${Math.round(input.monthlyCashflow)} a month after everything`,
  });

  // ── CASH EFFICIENCY /20 ──────────────────────────────────────────────────
  const cocScore = ramp(input.cashOnCash, 0, ANCHORS.cashOnCashFull, 20);
  components.push({
    key: "efficiency",
    label: "Cash efficiency",
    score: round1(cocScore),
    max: 20,
    reason: `${round1(input.cashOnCash)}% return on the cash invested`,
  });

  // ── RATE RESILIENCE /20 ──────────────────────────────────────────────────
  const resScore = ramp(
    input.cashflowAtPlus2,
    ANCHORS.resilienceZero,
    ANCHORS.resilienceFull,
    20,
  );
  components.push({
    key: "resilience",
    label: "Rate resilience",
    score: round1(resScore),
    max: 20,
    reason:
      input.cashflowAtPlus2 < 0
        ? `Goes £${Math.abs(Math.round(input.cashflowAtPlus2))} a month negative at +2%`
        : `Still £${Math.round(input.cashflowAtPlus2)} a month at +2%`,
  });

  // ── VALUE /10, only against real Land Registry sold prices ───────────────
  const median = input.areaMedianSoldPrice;
  if (median && median > 0 && input.purchasePrice > 0) {
    const ratio = input.purchasePrice / median;
    // 0.90 of median -> 10 points, 1.10 of median -> 0 points.
    const valueScore = ramp(ratio, 1 + ANCHORS.valueDiscount, 1 - ANCHORS.valueDiscount, 10);
    const deltaPct = Math.round((ratio - 1) * 100);
    components.push({
      key: "value",
      label: "Value",
      score: round1(valueScore),
      max: 10,
      reason:
        deltaPct === 0
          ? "Priced at the area median"
          : `${Math.abs(deltaPct)}% ${deltaPct > 0 ? "above" : "below"} the area median sold price`,
    });
  } else {
    excluded.push({
      label: "Value",
      reason: "No Land Registry sold prices for this postcode",
    });
  }

  // ── EQUITY UPLIFT /10, only for deals actually creating equity ───────────
  // A plain buy-to-let is not trying to do this, so scoring it zero would mark
  // it down for succeeding at something else. Excluded instead.
  if (input.equityGain !== undefined && input.equityGain !== 0 && input.purchasePrice > 0) {
    // 10% of the purchase price created in equity earns full marks.
    const upliftPct = (input.equityGain / input.purchasePrice) * 100;
    const equityScore = ramp(upliftPct, 0, 10, 10);
    components.push({
      key: "equity",
      label: "Equity uplift",
      score: round1(equityScore),
      max: 10,
      reason:
        input.equityGain < 0
          ? `Refurb costs £${Math.abs(Math.round(input.equityGain)).toLocaleString("en-GB")} more than it adds`
          : `£${Math.round(input.equityGain).toLocaleString("en-GB")} of equity created (${round1(upliftPct)}% of price)`,
    });
  } else {
    excluded.push({
      label: "Equity uplift",
      reason: "No refurbishment uplift — not a BRRR or flip",
    });
  }

  // Never scored, and said so rather than quietly omitted.
  excluded.push(
    { label: "Location", reason: "No licensed dataset — not scored rather than invented" },
    { label: "Demand", reason: "No licensed dataset — not scored rather than invented" },
  );

  const earned = components.reduce((s, c) => s + c.score, 0);
  const available = components.reduce((s, c) => s + c.max, 0);
  const total = available > 0 ? Math.round((earned / available) * 100) : 0;

  return {
    total,
    band: bandFor(total),
    components,
    excluded,
    componentsScored: components.length,
  };
}
