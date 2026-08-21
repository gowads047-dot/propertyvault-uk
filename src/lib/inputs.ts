/**
 * Parsing helpers for the calculator number inputs.
 *
 * Every calculator reads its fields with a bare `Number(e.target.value)` or
 * `+e.target.value`, and none of the inputs carried a `min`. That let a user
 * type a negative purchase price and get a full analysis back — reproduced on
 * the Deal Analyser with -250,000 and a rent of -900, which produced a deal
 * score and a set of figures rather than a complaint.
 *
 * The divide-by-zero guards in finance.ts stop that crashing. They do not stop
 * it being nonsense, which is what these are for.
 */

/**
 * Read a number input, floored at zero.
 *
 * Use for prices, rents, costs, counts, terms and percentages — anything that
 * cannot meaningfully be below zero. An empty field reads as 0, which is what
 * the calculators already assumed.
 */
export function nonNegative(value: string | number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/**
 * Read a number input that may legitimately be negative.
 *
 * Growth and inflation assumptions are the real cases: modelling a falling
 * market is reasonable, and arguably the prudent thing to check.
 */
export function signed(value: string | number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
