/**
 * The claims a caption is not allowed to make.
 *
 * The standing rule for everything this account publishes is: no guarantee,
 * no testimonial, no market average, no prediction. The calendar test has
 * enforced that since the first video. The publisher now runs the same check
 * on every row before it goes out — including rows a person typed by hand into
 * the queue, which the calendar test never sees.
 *
 * One list, imported by both, so the two can never disagree about what a
 * banned claim is.
 */

export const BANNED_CLAIMS: readonly RegExp[] = [
  // "Guaranteed rent" is the name of a product and may be described.
  // "Guaranteed" anything else is a promise, and is not allowed.
  /\bguaranteed\b(?!\s+rent)/i,
  /\bguarantees\b/i,
  /\btestimonial/i,
  /\bclients? (?:have|has)\b/i,
  /\baverage (?:yield|return|rent|price)\b/i,
  /\bwill (?:rise|fall|grow|increase|double)\b/i,
  /\brisk[- ]free\b/i,
  /\bbest (?:area|investment|deal)\b/i,
];

/** Every banned pattern the text matches, as source strings. Empty is clean. */
export function findBannedClaims(text: string): string[] {
  return BANNED_CLAIMS.filter(re => re.test(text)).map(re => re.source);
}
