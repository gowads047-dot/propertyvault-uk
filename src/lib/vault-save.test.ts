import { describe, it, expect } from "vitest";
import { buildSave, LIMITS } from "./vault-save";
import { newClaimToken } from "./property";

const base = {
  property: { source: "postcode" as const, postcode: "ng7 1aa", askingPrice: 185_000 },
  evidence: [
    { field: "monthly_cashflow", state: "calculated" as const, valueNum: 120, source: "lib/finance.ts" },
    { field: "flood_risk_zone", state: "missing" as const, method: "No record in the register" },
  ],
};

const ok = (body: unknown) => {
  const r = buildSave(body);
  if (!r.ok) throw new Error(`expected ok, got: ${r.error}`);
  return r.value;
};

const err = (body: unknown) => {
  const r = buildSave(body);
  if (r.ok) throw new Error("expected a rejection");
  return r.error;
};

describe("who owns the property", () => {
  it("mints a token for a first save and says it is new", () => {
    const v = ok(base);
    expect(v.claimTokenIsNew).toBe(true);
    expect(v.claimToken).toMatch(/^[0-9a-f]{64}$/);
    expect(v.property.claim_token).toBe(v.claimToken);
  });

  it("reuses a token the caller already holds", () => {
    const token = newClaimToken();
    const v = ok({ ...base, claimToken: token });
    expect(v.claimToken).toBe(token);
    expect(v.claimTokenIsNew).toBe(false);
  });

  // Quietly minting a replacement would strand every property already saved
  // under the token the caller actually has.
  it("refuses a malformed token rather than replacing it", () => {
    expect(err({ ...base, claimToken: "nope" })).toContain("not valid");
    expect(err({ ...base, claimToken: "A".repeat(64) })).toContain("not valid");
  });

  it("never lets the caller name a user", () => {
    const v = ok({ ...base, property: { ...base.property }, userId: "11111111-1111-1111-1111-111111111111" });
    expect(JSON.stringify(v.property)).not.toContain("user_id");
    expect(JSON.stringify(v.property)).not.toContain("11111111");
  });
});

describe("what identifies the property", () => {
  it("derives the dedupe key rather than trusting one that was sent", () => {
    const v = ok({ ...base, property: { ...base.property, dedupe_key: "pc:SOMEWHERE ELSE" } });
    expect(v.property.dedupe_key).toBe("pc:NG7 1AA");
  });

  it("prefers a listing URL over the postcode", () => {
    const v = ok({
      ...base,
      property: { source: "url", sourceRef: "https://www.rightmove.co.uk/properties/123456789#/?x=1", postcode: "NG7 1AA" },
    });
    expect(v.property.dedupe_key).toContain("url:");
    expect(v.property.dedupe_key).not.toContain("pc:");
  });

  it("normalises the postcode so two spellings are one place", () => {
    expect(ok({ ...base, property: { source: "postcode", postcode: "ng71aa" } }).property.postcode).toBe("NG7 1AA");
  });

  // Saving under an invented identity is worse than not saving.
  it("refuses a property with nothing to key on", () => {
    expect(err({ ...base, property: { source: "manual" } })).toContain("identifies a property");
  });

  it("refuses a source it does not recognise", () => {
    expect(err({ ...base, property: { source: "telepathy", postcode: "NG7 1AA" } })).toContain("source");
  });
});

describe("the evidence that is allowed through", () => {
  it("rejects verified with no source instead of repairing it", () => {
    const e = err({
      ...base,
      evidence: [{ field: "sold_median", state: "verified", valueNum: 322_000 }],
    });
    expect(e).toContain("sold_median");
    expect(e).toContain("verified");
  });

  it("accepts verified when it says where it came from", () => {
    const v = ok({
      ...base,
      evidence: [{ field: "sold_median", state: "verified", valueNum: 322_000, source: "HM Land Registry" }],
    });
    expect(v.evidence[0].source).toBe("HM Land Registry");
  });

  // A chip that says "not checked" beside a number is the whole trust system
  // contradicting itself in one row.
  it("strips any value from a row marked missing", () => {
    const v = ok({
      ...base,
      evidence: [{ field: "epc", state: "missing", valueNum: 72, valueText: "C", method: "no key" }],
    });
    expect(v.evidence[0].value_num).toBeNull();
    expect(v.evidence[0].value_text).toBeNull();
    expect(v.evidence[0].method).toBe("no key");
  });

  it("refuses the same field twice rather than letting send order decide", () => {
    expect(err({
      ...base,
      evidence: [
        { field: "rent", state: "user", valueNum: 1050 },
        { field: "rent", state: "assumed", valueNum: 900, source: "x" },
      ],
    })).toContain("twice");
  });

  it("refuses an unknown evidence state", () => {
    expect(err({ ...base, evidence: [{ field: "rent", state: "vibes", valueNum: 1 }] })).toContain("state");
  });

  it("caps how much evidence one save can carry", () => {
    const many = Array.from({ length: LIMITS.evidenceRows + 1 }, (_, i) => ({
      field: `f${i}`, state: "calculated" as const, valueNum: i, source: "x",
    }));
    expect(err({ ...base, evidence: many })).toContain(String(LIMITS.evidenceRows));
  });

  it("requires an evidence array at all", () => {
    expect(err({ property: base.property })).toContain("evidence");
  });
});

describe("the analysis snapshot", () => {
  it("is optional", () => {
    expect(ok(base).analysis).toBeNull();
  });

  it("keeps a score and band the schema will accept", () => {
    const a = ok({ ...base, analysis: { inputs: { p: 1 }, computed: { s: 2 }, score: 63.4, band: "WATCHLIST", componentsScored: 5 } }).analysis!;
    expect(a.score).toBe(63);
    expect(a.band).toBe("WATCHLIST");
    expect(a.components_scored).toBe(5);
  });

  it("drops a band or score the schema would reject, rather than failing the save", () => {
    const a = ok({ ...base, analysis: { inputs: {}, computed: {}, score: 400, band: "AMAZING" } }).analysis!;
    expect(a.score).toBeNull();
    expect(a.band).toBeNull();
  });

  it("refuses an analysis too large to store", () => {
    const big = { inputs: { blob: "x".repeat(LIMITS.analysisJsonChars + 10) }, computed: {} };
    expect(err({ ...base, analysis: big })).toContain("too large");
  });
});

describe("things that are not requests", () => {
  it("refuses anything that is not an object", () => {
    for (const bad of [null, "string", 7, []]) {
      expect(buildSave(bad).ok, String(bad)).toBe(false);
    }
  });

  it("trims oversized text rather than rejecting the whole save", () => {
    const v = ok({
      ...base,
      property: { source: "postcode", postcode: "NG7 1AA", address: "a".repeat(LIMITS.address + 200) },
    });
    expect(v.property.address!.length).toBe(LIMITS.address);
  });
});
