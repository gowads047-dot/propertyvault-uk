/**
 * Validating and sanitising what reaches the AI verdict prompt.
 *
 * The route builds a prompt by interpolating fields straight from the request
 * body. Seven of them are free text — address, postcode, strategy, tax band,
 * city benchmark, crime level, rental demand — and none were checked. Anyone
 * could put instructions in the address field and have them read as part of the
 * prompt.
 *
 * Two defences here, because either alone is thin:
 *
 *   1. Free text is drawn from a fixed set where one exists, and otherwise
 *      stripped to characters that appear in real UK addresses and truncated.
 *      A value that cannot express a sentence cannot express an instruction.
 *
 *   2. Numbers are bounded. Not for the model's sake but for ours: the client
 *      formats them with toLocaleString, and an absurd value produces an
 *      absurd prompt and a wasted call.
 *
 * Nothing here trusts the client. The deal analyser computes its metrics in the
 * browser, so every one of them is attacker-controlled — the point is to keep
 * the request within the shape of a real analysis, not to prove it is one.
 */

export interface VerdictInput {
  purchasePrice: number;
  monthlyRent: number;
  grossYield: number;
  netYield: number;
  monthlyCF: number;
  cashOnCash: number;
  dealScore: number;
  stressRatePlus2: number;
  benchmarkGross: number | null;
  benchmarkNet: number | null;
  bedrooms: number | null;
  cityBenchmark: string | null;
  propertyType: string | null;
  postcode: string | null;
  address: string | null;
  crimeLevel: string | null;
  avgSoldPrice: number | null;
  strategy: string;
  taxBand: string;
}

export type ValidationResult =
  | { ok: true; value: VerdictInput }
  | { ok: false; error: string };

/** Sets the model is allowed to see. Anything else is dropped, not passed on. */
const STRATEGIES = ["btl", "hmo", "r2r", "flip", "sa"] as const;
const TAX_BANDS = ["basic", "higher", "additional", "company"] as const;
const CRIME_LEVELS = ["Low", "Below average", "Average", "Above average", "High"] as const;

/** Bounds. Wide enough for any real UK deal, narrow enough to reject nonsense. */
const LIMITS = {
  purchasePrice: [1_000, 50_000_000],
  monthlyRent: [0, 200_000],
  percent: [-1_000, 1_000],
  monthlyMoney: [-1_000_000, 1_000_000],
  score: [0, 100],
  bedrooms: [0, 50],
} as const;

function num(v: unknown, [min, max]: readonly [number, number]): number | null {
  const n = typeof v === "string" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

/**
 * Free text reduced to something that cannot carry an instruction.
 *
 * Newlines are the important one: the prompt is line-structured, so a value
 * containing them could open what looks like a new section. Colons and angle
 * brackets go for the same reason. What is left is letters, digits, spaces and
 * the punctuation that genuinely appears in UK addresses.
 */
export function sanitiseText(v: unknown, maxLength: number): string | null {
  if (typeof v !== "string") return null;
  const cleaned = v
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^A-Za-z0-9 ,.'&()/-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
  return cleaned.length > 0 ? cleaned : null;
}

/** One of a fixed set, matched case-insensitively, or null. */
export function oneOf<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  if (typeof v !== "string") return null;
  const hit = allowed.find(a => a.toLowerCase() === v.trim().toLowerCase());
  return hit ?? null;
}

/** A UK postcode, or null. Format only — this does not assert it exists. */
export function sanitisePostcode(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const c = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/.test(c)) return null;
  return `${c.slice(0, -3)} ${c.slice(-3)}`;
}

export function validateVerdictInput(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Expected an object." };
  }
  const b = body as Record<string, unknown>;

  // The four the verdict is meaningless without.
  const purchasePrice = num(b.purchasePrice, LIMITS.purchasePrice);
  if (purchasePrice === null) return { ok: false, error: "purchasePrice is missing or out of range." };

  const monthlyRent = num(b.monthlyRent, LIMITS.monthlyRent);
  if (monthlyRent === null) return { ok: false, error: "monthlyRent is missing or out of range." };

  const dealScore = num(b.dealScore, LIMITS.score);
  if (dealScore === null) return { ok: false, error: "dealScore is missing or out of range." };

  const grossYield = num(b.grossYield, LIMITS.percent);
  if (grossYield === null) return { ok: false, error: "grossYield is missing or out of range." };

  return {
    ok: true,
    value: {
      purchasePrice,
      monthlyRent,
      grossYield,
      dealScore,
      netYield: num(b.netYield, LIMITS.percent) ?? 0,
      monthlyCF: num(b.monthlyCF, LIMITS.monthlyMoney) ?? 0,
      cashOnCash: num(b.cashOnCash, LIMITS.percent) ?? 0,
      stressRatePlus2: num(b.stressRatePlus2, LIMITS.monthlyMoney) ?? 0,
      benchmarkGross: num(b.benchmarkGross, LIMITS.percent),
      benchmarkNet: num(b.benchmarkNet, LIMITS.percent),
      bedrooms: num(b.bedrooms, LIMITS.bedrooms),
      avgSoldPrice: num(b.avgSoldPrice, LIMITS.purchasePrice),

      // Fixed sets where one exists — the model never sees an arbitrary value.
      strategy: oneOf(b.strategy, STRATEGIES) ?? "btl",
      taxBand: oneOf(b.taxBand, TAX_BANDS) ?? "higher",
      crimeLevel: oneOf(b.crimeLevel, CRIME_LEVELS),

      // Genuinely free text, reduced to something that cannot carry a sentence.
      cityBenchmark: sanitiseText(b.cityBenchmark, 40),
      propertyType: sanitiseText(b.propertyType, 40),
      address: sanitiseText(b.address, 120),
      postcode: sanitisePostcode(b.postcode),
    },
  };
}
