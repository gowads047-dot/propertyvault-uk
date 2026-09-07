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

/**
 * ── Why the list is wider than it looks ────────────────────────────────────
 *
 * A caption that trips one of these does not get suppressed silently: qc.ts
 * fails the check, the publisher holds the row and emails a person. So a false
 * positive costs somebody thirty seconds, and a false negative is a false
 * claim published under the business's name to an audience. That asymmetry is
 * the reason several of these are broader than strictly necessary.
 *
 * The second block was added after checking this list against the claims the
 * website itself had to stop making. All nine passed — "vetted tradespeople",
 * "industry average 2.7 weeks", "trusted by UK property investors", "RICS
 * estimate", "not a single void month in two years". vetting-claims.test.ts
 * forbids that language across every page; there is no reading on which the
 * same sentence is unacceptable on /trades and fine in a Reel caption.
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

  // ── Vetting we do not do ────────────────────────────────────────────────
  // Mirrors vetting-claims.test.ts. PropertyVault accredits nobody and has no
  // verification standard, which is why /find-agent and /trades were rewritten.
  /\b(?:we|propertyvault)\s+(?:vet|vets|vetted|verify|verifies|verified|approve|approves|approved|accredit|accredits|accredited)\b/i,
  /\b(?:our|propertyvault(?:['’]s)?)\s+(?:vetted|verified|approved|trusted|accredited)\b/i,
  /\b(?:vetted|pre-?screened|hand-?picked|background-?checked)\s+(?:trade|trades|tradespeople|tradesperson|professional|professionals|agent|agents|solicitor|solicitors|surveyor|surveyors|broker|brokers|contractor|contractors|partner|partners|provider|providers|plumber|plumbers|electrician|electricians|builder|builders|engineer|engineers|community)\b/i,
  /\btrusted by\b/i,

  // ── Averages nobody sourced ─────────────────────────────────────────────
  // The existing rule covered yield, return, rent and price. The figure that
  // actually shipped wrong was a void average, quoted as an industry number.
  /\b(?:industry|uk|national|market)\s+average\b/i,
  /\baverage\s+(?:void|voids|occupancy|arrears|tenancy)\b/i,

  // ── Results with nobody's name on them ──────────────────────────────────
  // "Not a single void month in two years" was set as a landlord's words on
  // the home page with no landlord attached to it.
  /\bnot a single\b/i,
  /\bmost (?:landlords|investors|customers|clients)\b/i,

  // ── Borrowed authority ──────────────────────────────────────────────────
  // "RICS estimate avg £600 a year" put a professional body's name on a
  // number this project cannot evidence.
  /\b(?:RICS|ARLA|Propertymark|NAEA|SRA|FCA|ICAEW|ACCA)\s+(?:estimate|estimates|say|says|data|figures?|research|report)\b/i,
];

/** Every banned pattern the text matches, as source strings. Empty is clean. */
export function findBannedClaims(text: string): string[] {
  return BANNED_CLAIMS.filter(re => re.test(text)).map(re => re.source);
}
