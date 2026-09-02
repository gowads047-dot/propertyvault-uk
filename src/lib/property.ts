/**
 * The property object.
 *
 * Until this existed the deal analyser computed a full analysis and threw it
 * away on refresh, and nothing in the product could remember, compare or
 * monitor anything. The schema lives in supabase/pv-property-schema.sql; this
 * file holds the rules that decide identity and provenance, kept in TypeScript
 * so they sit next to their tests rather than inside a trigger.
 */

export type PropertySource = "url" | "postcode" | "address" | "manual";

export type DealStage =
  | "screening" | "analysing" | "viewing" | "offer" | "negotiating"
  | "under_offer" | "due_diligence" | "purchased" | "rejected" | "archived";

/** Where a figure came from. The visual trust language maps one-to-one onto this. */
export type EvidenceState =
  | "verified"    // an official register said so, on a date
  | "estimated"   // derived from comparables, with a range
  | "calculated"  // our own deterministic code
  | "assumed"     // a default the user can change
  | "user"        // they typed it
  | "missing";    // unavailable, and never silently filled

export interface PropertyInput {
  source: PropertySource;
  sourceRef?: string | null;
  address?: string | null;
  postcode?: string | null;
  uprn?: string | null;
  propertyType?: string | null;
  bedrooms?: number | null;
  askingPrice?: number | null;
}

export interface Evidence {
  field: string;
  state: EvidenceState;
  valueNum?: number | null;
  valueText?: string | null;
  valueLow?: number | null;
  valueHigh?: number | null;
  source?: string | null;
  sourceUrl?: string | null;
  method?: string | null;
}

/** Normalised UK postcode, or null. Format only — not an assertion it exists. */
export function normalisePostcode(v: string | null | undefined): string | null {
  if (!v) return null;
  const c = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/.test(c)) return null;
  return `${c.slice(0, -3)} ${c.slice(-3)}`;
}

/**
 * A listing URL reduced to the thing that identifies it.
 *
 * Portal URLs carry tracking parameters, trailing slugs and both www and
 * non-www forms, so the same listing arrives looking like several. Where a
 * numeric listing id is present that alone is the identity; otherwise the
 * origin and path are used.
 */
export function normaliseListingUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;

  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  const id = u.pathname.match(/(?:properties|property|details)\/(\d{5,})/i)?.[1]
    ?? u.pathname.match(/\/(\d{7,})/)?.[1];
  if (id) return `${host}#${id}`;

  const path = u.pathname.replace(/\/+$/, "").toLowerCase();
  return `${host}${path}`;
}

/** Address reduced for comparison: lowercase, punctuation and filler removed. */
export function normaliseAddress(v: string | null | undefined): string | null {
  if (!v) return null;
  const c = v
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(flat|apartment|apt)\b/g, "flat")
    .replace(/\b(road)\b/g, "rd")
    .replace(/\b(street)\b/g, "st")
    .replace(/\b(avenue)\b/g, "ave")
    .replace(/\s+/g, " ")
    .trim();
  return c.length > 0 ? c : null;
}

/**
 * The key that decides "is this the same property".
 *
 * Ordered by how reliable each identifier is. A UPRN is definitive. A listing
 * id identifies a listing rather than a building, which is close enough and
 * far better than nothing. Address plus postcode is next. A bare postcode is
 * the weakest — it deliberately collapses everything in the postcode into one
 * record, because a user who vaults "NG7 1AA" twice means the same thing both
 * times, and a duplicate would be worse than a collision.
 *
 * Returns null when there is nothing to key on, which the caller must treat as
 * "cannot save this" rather than inventing an identity.
 */
export function dedupeKey(input: PropertyInput): string | null {
  if (input.uprn && /^\d{1,12}$/.test(input.uprn)) return `uprn:${input.uprn}`;

  const url = normaliseListingUrl(input.sourceRef);
  if (url) return `url:${url}`;

  const pc = normalisePostcode(input.postcode);
  const addr = normaliseAddress(input.address);
  if (pc && addr) return `addr:${addr}|${pc}`;
  if (pc) return `pc:${pc}`;
  if (addr) return `addr:${addr}`;

  return null;
}

/**
 * A claim token for an anonymous owner.
 *
 * This is a bearer credential — whoever holds it owns the properties — so it
 * uses the platform CSPRNG, not Math.random. The database refuses anything
 * under 20 characters.
 */
export function newClaimToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export function isValidClaimToken(v: string | null | undefined): boolean {
  return typeof v === "string" && /^[0-9a-f]{64}$/.test(v);
}

/**
 * Evidence, with the one rule that makes the whole trust system mean anything:
 * a figure may only be called verified if it says where it came from.
 */
export function makeEvidence(e: Evidence): Evidence {
  if (e.state === "verified" && !e.source) {
    throw new Error(`Evidence for "${e.field}" is marked verified with no source.`);
  }
  if (e.state === "missing" && (e.valueNum != null || e.valueText != null)) {
    throw new Error(`Evidence for "${e.field}" is marked missing but carries a value.`);
  }
  return e;
}

/** Shorthands, so call sites read as what they are. */
export const verified = (field: string, valueNum: number | null, source: string, extra: Partial<Evidence> = {}) =>
  makeEvidence({ field, state: "verified", valueNum, source, ...extra });

export const calculated = (field: string, valueNum: number, source: string, method?: string) =>
  makeEvidence({ field, state: "calculated", valueNum, source, method });

export const estimated = (field: string, low: number, high: number, source: string, method?: string) =>
  makeEvidence({ field, state: "estimated", valueLow: low, valueHigh: high, valueNum: (low + high) / 2, source, method });

export const assumed = (field: string, valueNum: number, method: string) =>
  makeEvidence({ field, state: "assumed", valueNum, source: "PropertyVault default", method });

export const fromUser = (field: string, valueNum: number) =>
  makeEvidence({ field, state: "user", valueNum, source: "user" });

export const missing = (field: string, method: string) =>
  makeEvidence({ field, state: "missing", method });

/**
 * How much of an analysis rested on real data.
 *
 * Deliberately not called confidence. Confidence needs a method over data
 * coverage — how many comparables, how recent, how close — and that is blocked
 * on having comparables at all. This is the honest version available today:
 * the share of fields that came from a register or a comparable rather than a
 * default. Showing this as a percentage labelled "confidence" would be exactly
 * the invented-number failure the whole trust system exists to avoid.
 */
export function evidenceCoverage(evidence: Evidence[]): {
  total: number; grounded: number; assumed: number; missing: number; ratio: number;
} {
  const total = evidence.length;
  const grounded = evidence.filter(e => e.state === "verified" || e.state === "estimated").length;
  const assumedCount = evidence.filter(e => e.state === "assumed").length;
  const missingCount = evidence.filter(e => e.state === "missing").length;
  return {
    total,
    grounded,
    assumed: assumedCount,
    missing: missingCount,
    ratio: total === 0 ? 0 : grounded / total,
  };
}
