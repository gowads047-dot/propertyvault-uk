import { describe, it, expect } from "vitest";
import {
  dedupeKey, normalisePostcode, normaliseListingUrl, normaliseAddress,
  newClaimToken, isValidClaimToken, makeEvidence, evidenceCoverage,
  verified, calculated, estimated, assumed, fromUser, missing,
} from "./property";

describe("postcodes", () => {
  it("normalises to one form", () => {
    expect(normalisePostcode("ng71aa")).toBe("NG7 1AA");
    expect(normalisePostcode(" NG7  1AA ")).toBe("NG7 1AA");
    expect(normalisePostcode("sw1a2aa")).toBe("SW1A 2AA");
  });
  it("rejects non-postcodes", () => {
    for (const bad of ["", "NG7", "NOTAPOST", null, undefined]) {
      expect(normalisePostcode(bad), String(bad)).toBeNull();
    }
  });
});

describe("listing urls", () => {
  // The same listing arrives with tracking params, slugs, and both www forms.
  it("treats the same listing as the same listing", () => {
    const forms = [
      "https://www.rightmove.co.uk/properties/123456789",
      "https://rightmove.co.uk/properties/123456789#/?channel=RES_BUY",
      "https://www.rightmove.co.uk/properties/123456789/?utm_source=x",
      "HTTPS://WWW.RIGHTMOVE.CO.UK/properties/123456789",
    ];
    const keys = new Set(forms.map(f => normaliseListingUrl(f)));
    expect(keys.size, [...keys].join(" | ")).toBe(1);
  });

  it("keeps different listings apart", () => {
    expect(normaliseListingUrl("https://rightmove.co.uk/properties/111111111"))
      .not.toBe(normaliseListingUrl("https://rightmove.co.uk/properties/222222222"));
  });

  it("handles portals without a numeric id by path", () => {
    expect(normaliseListingUrl("https://www.example-agent.co.uk/For-Sale/12-High-St/"))
      .toBe("example-agent.co.uk/for-sale/12-high-st");
  });

  it("rejects anything that is not an http url", () => {
    for (const bad of ["not a url", "javascript:alert(1)", "ftp://x/y", "", null]) {
      expect(normaliseListingUrl(bad), String(bad)).toBeNull();
    }
  });
});

describe("addresses", () => {
  it("collapses the ways people write the same address", () => {
    const a = normaliseAddress("14 Springfield Road");
    expect(normaliseAddress("14 Springfield Rd.")).toBe(a);
    expect(normaliseAddress("  14  SPRINGFIELD ROAD  ")).toBe(a);
  });
  it("keeps different addresses apart", () => {
    expect(normaliseAddress("14 Springfield Road")).not.toBe(normaliseAddress("15 Springfield Road"));
  });
});

describe("dedupe key", () => {
  it("prefers UPRN above everything", () => {
    expect(dedupeKey({
      source: "url", uprn: "100023336956",
      sourceRef: "https://rightmove.co.uk/properties/1", postcode: "NG7 1AA", address: "x",
    })).toBe("uprn:100023336956");
  });

  it("falls to the listing url next", () => {
    expect(dedupeKey({
      source: "url", sourceRef: "https://www.rightmove.co.uk/properties/123456789",
      postcode: "NG7 1AA",
    })).toBe("url:rightmove.co.uk#123456789");
  });

  it("uses address plus postcode when there is no listing", () => {
    const k = dedupeKey({ source: "address", address: "14 Springfield Road", postcode: "ng7 1aa" });
    expect(k).toBe("addr:14 springfield rd|NG7 1AA");
  });

  // Vaulting "NG7 1AA" twice means the same thing both times. A duplicate row
  // would be worse than the collision.
  it("collapses a bare postcode to one record", () => {
    expect(dedupeKey({ source: "postcode", postcode: "NG7 1AA" })).toBe("pc:NG7 1AA");
    expect(dedupeKey({ source: "postcode", postcode: "ng71aa" })).toBe("pc:NG7 1AA");
  });

  // The caller must treat this as "cannot save", not invent an identity.
  it("returns null when there is nothing to key on", () => {
    expect(dedupeKey({ source: "manual" })).toBeNull();
    expect(dedupeKey({ source: "manual", postcode: "nonsense", address: "" })).toBeNull();
  });

  it("re-vaulting the same listing produces the same key", () => {
    const a = dedupeKey({ source: "url", sourceRef: "https://www.rightmove.co.uk/properties/9876543?utm=a" });
    const b = dedupeKey({ source: "url", sourceRef: "https://rightmove.co.uk/properties/9876543/" });
    expect(a).toBe(b);
  });
});

describe("claim tokens", () => {
  // A bearer credential. Math.random would be a real vulnerability here.
  it("is 256 bits of hex and unique across calls", () => {
    const tokens = new Set(Array.from({ length: 200 }, newClaimToken));
    expect(tokens.size).toBe(200);
    for (const t of tokens) expect(t).toMatch(/^[0-9a-f]{64}$/);
  });

  it("validates shape, and rejects the short tokens the database also refuses", () => {
    expect(isValidClaimToken(newClaimToken())).toBe(true);
    for (const bad of ["", "abc", "x".repeat(64), null, undefined, "A".repeat(64)]) {
      expect(isValidClaimToken(bad as string), String(bad)).toBe(false);
    }
  });
});

describe("evidence", () => {
  // The single rule that makes the trust system mean anything.
  it("refuses to mark a figure verified without a source", () => {
    expect(() => makeEvidence({ field: "rent", state: "verified", valueNum: 950 }))
      .toThrow(/verified with no source/);
    expect(() => verified("sold_median", 198_000, "HM Land Registry")).not.toThrow();
  });

  it("refuses to let a missing field carry a value", () => {
    expect(() => makeEvidence({ field: "service_charge", state: "missing", valueNum: 1_200 }))
      .toThrow(/missing but carries a value/);
  });

  it("builds each kind with the right state and source", () => {
    expect(verified("sold", 198_000, "HM Land Registry").state).toBe("verified");
    expect(calculated("sdlt", 11_500, "lib/tax.ts").state).toBe("calculated");
    expect(assumed("running_costs", 266, "28% of rent").source).toBe("PropertyVault default");
    expect(fromUser("refurb", 14_000).state).toBe("user");
    expect(missing("service_charge", "not published").valueNum).toBeUndefined();
  });

  it("stores an estimate as a range and a midpoint", () => {
    const e = estimated("rent", 1_375, 1_450, "3 comparables");
    expect(e.valueLow).toBe(1_375);
    expect(e.valueHigh).toBe(1_450);
    expect(e.valueNum).toBe(1_412.5);
  });
});

describe("coverage", () => {
  const set = [
    verified("sold_median", 198_000, "HM Land Registry"),
    estimated("rent", 900, 1_000, "comparables"),
    calculated("sdlt", 11_500, "lib/tax.ts"),
    assumed("running_costs", 266, "28% of rent"),
    missing("service_charge", "not published"),
  ];

  it("counts what rested on real data rather than defaults", () => {
    const c = evidenceCoverage(set);
    expect(c.total).toBe(5);
    expect(c.grounded).toBe(2);   // verified + estimated
    expect(c.assumed).toBe(1);
    expect(c.missing).toBe(1);
    expect(c.ratio).toBeCloseTo(0.4, 5);
  });

  // Calculated is honest but it is not evidence about this property — it is
  // arithmetic over other fields, so it must not inflate coverage.
  it("does not count our own arithmetic as grounding", () => {
    const onlyCalc = [calculated("sdlt", 11_500, "lib/tax.ts")];
    expect(evidenceCoverage(onlyCalc).ratio).toBe(0);
  });

  it("returns zero rather than NaN for an empty set", () => {
    expect(evidenceCoverage([]).ratio).toBe(0);
  });
});
