import {
  dedupeKey, newClaimToken, isValidClaimToken, normalisePostcode,
  type Evidence, type EvidenceState, type PropertyInput,
} from "./property";

/**
 * Turning a vault request into the rows to write.
 *
 * The tables, their constraints and their RLS have been live since the schema
 * migration; nothing wrote to them, so "Vault it" analysed a property and
 * threw the result away. This is the missing half.
 *
 * All of the judgement lives here rather than in the route, because the route
 * is I/O and this is where the decisions are: what identifies a property, who
 * owns it, and which evidence is allowed through. Two rules matter enough to
 * state:
 *
 *   1. The dedupe key is computed here, never accepted from the caller. It is
 *      what decides whether a save updates an existing property or creates a
 *      new one, so letting a client supply it would let a client overwrite a
 *      row it does not own.
 *
 *   2. Evidence marked verified without a source is rejected, not repaired.
 *      The database enforces the same rule, but a 400 that says which field is
 *      wrong beats a 500 from a constraint violation.
 */

const STATES: EvidenceState[] = ["verified", "estimated", "calculated", "assumed", "user", "missing"];
const SOURCES: PropertyInput["source"][] = ["url", "postcode", "address", "manual"];

/** Bounds that keep a save small enough to be cheap and boring. */
export const LIMITS = {
  evidenceRows: 60,
  text: 300,
  address: 300,
  sourceRef: 2_000,
  askingPrice: 50_000_000,
  analysisJsonChars: 40_000,
};

export interface SaveRequest {
  property: PropertyInput;
  evidence: Evidence[];
  analysis?: {
    inputs: unknown;
    computed: unknown;
    score?: number | null;
    band?: string | null;
    componentsScored?: number | null;
  };
  claimToken?: string | null;
}

export interface PropertyRow {
  claim_token: string;
  source: string;
  source_ref: string | null;
  address: string | null;
  postcode: string | null;
  uprn: string | null;
  property_type: string | null;
  bedrooms: number | null;
  asking_price: number | null;
  dedupe_key: string;
  updated_at: string;
}

export interface EvidenceRow {
  field: string;
  value_num: number | null;
  value_text: string | null;
  value_low: number | null;
  value_high: number | null;
  state: EvidenceState;
  source: string | null;
  source_url: string | null;
  method: string | null;
}

export interface AnalysisRow {
  inputs: unknown;
  computed: unknown;
  score: number | null;
  band: string | null;
  components_scored: number | null;
}

export interface BuiltSave {
  claimToken: string;
  /** True when the caller arrived without one, so the client must store it. */
  claimTokenIsNew: boolean;
  property: PropertyRow;
  evidence: EvidenceRow[];
  analysis: AnalysisRow | null;
}

export type BuildResult = { ok: true; value: BuiltSave } | { ok: false; error: string };

const BANDS = ["STRONG", "WATCHLIST", "RISKY", "PASS"];

function text(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length > 0 ? t : null;
}

function number(v: unknown, min: number, max: number): number | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return v >= min && v <= max ? v : null;
}

export function buildSave(body: unknown, now = new Date()): BuildResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request." };
  const b = body as Partial<SaveRequest>;

  // ── who owns it ──────────────────────────────────────────────────────────
  // A malformed token is refused rather than replaced: silently minting a new
  // one would strand every property the caller had already saved.
  let claimTokenIsNew = false;
  let claimToken: string;
  if (b.claimToken == null || b.claimToken === "") {
    claimToken = newClaimToken();
    claimTokenIsNew = true;
  } else if (isValidClaimToken(b.claimToken)) {
    claimToken = b.claimToken;
  } else {
    return { ok: false, error: "That vault token is not valid." };
  }

  // ── what it is ───────────────────────────────────────────────────────────
  const p = (b.property ?? {}) as Partial<PropertyInput>;
  const source = SOURCES.find(s => s === p.source);
  if (!source) return { ok: false, error: "Expected a source of url, postcode, address or manual." };

  const input: PropertyInput = {
    source,
    sourceRef: text(p.sourceRef, LIMITS.sourceRef),
    address: text(p.address, LIMITS.address),
    postcode: text(p.postcode, 12),
    uprn: text(p.uprn, 12),
    propertyType: text(p.propertyType, 60),
    bedrooms: number(p.bedrooms, 0, 50),
    askingPrice: number(p.askingPrice, 0, LIMITS.askingPrice),
  };

  const key = dedupeKey(input);
  if (!key) {
    return {
      ok: false,
      error: "Nothing here identifies a property. Give a postcode, an address or a listing link.",
    };
  }

  // ── the evidence ─────────────────────────────────────────────────────────
  if (!Array.isArray(b.evidence)) return { ok: false, error: "Expected an evidence array." };
  if (b.evidence.length > LIMITS.evidenceRows) {
    return { ok: false, error: `That is more than ${LIMITS.evidenceRows} pieces of evidence.` };
  }

  const evidence: EvidenceRow[] = [];
  const seen = new Set<string>();
  for (const raw of b.evidence) {
    const e = (raw ?? {}) as Partial<Evidence>;
    const field = text(e.field, 80);
    const state = STATES.find(s => s === e.state);
    if (!field || !state) return { ok: false, error: "Each piece of evidence needs a field and a state." };

    if (state === "verified" && !text(e.source, LIMITS.text)) {
      return { ok: false, error: `"${field}" is marked verified with no source.` };
    }
    // The unique index is (property_id, field); a duplicate would make the
    // upsert order decide which one wins, which is not a decision to leave to
    // whatever order the client happened to send.
    if (seen.has(field)) return { ok: false, error: `Evidence for "${field}" was sent twice.` };
    seen.add(field);

    const isMissing = state === "missing";
    evidence.push({
      field,
      // A row that says "not checked" must not carry a value, or the UI can
      // render a figure under a chip that says there isn't one.
      value_num: isMissing ? null : number(e.valueNum, -1e12, 1e12),
      value_text: isMissing ? null : text(e.valueText, LIMITS.text),
      value_low: isMissing ? null : number(e.valueLow, -1e12, 1e12),
      value_high: isMissing ? null : number(e.valueHigh, -1e12, 1e12),
      state,
      source: text(e.source, LIMITS.text),
      source_url: text(e.sourceUrl, LIMITS.sourceRef),
      method: text(e.method, LIMITS.text),
    });
  }

  // ── the analysis snapshot ────────────────────────────────────────────────
  let analysis: AnalysisRow | null = null;
  if (b.analysis) {
    const a = b.analysis;
    const size = JSON.stringify({ i: a.inputs ?? null, c: a.computed ?? null }).length;
    if (size > LIMITS.analysisJsonChars) return { ok: false, error: "That analysis is too large to store." };

    const score = number(a.score, 0, 100);
    analysis = {
      inputs: a.inputs ?? {},
      computed: a.computed ?? {},
      score: score == null ? null : Math.round(score),
      band: BANDS.find(x => x === a.band) ?? null,
      components_scored: (() => {
        const n = number(a.componentsScored, 0, 100);
        return n == null ? null : Math.round(n);
      })(),
    };
  }

  return {
    ok: true,
    value: {
      claimToken,
      claimTokenIsNew,
      property: {
        claim_token: claimToken,
        source,
        source_ref: input.sourceRef ?? null,
        address: input.address ?? null,
        // Stored normalised so two spellings of one postcode read as one place.
        postcode: normalisePostcode(input.postcode) ?? input.postcode ?? null,
        uprn: input.uprn ?? null,
        property_type: input.propertyType ?? null,
        bedrooms: input.bedrooms ?? null,
        asking_price: input.askingPrice ?? null,
        dedupe_key: key,
        updated_at: now.toISOString(),
      },
      evidence,
      analysis,
    },
  };
}
