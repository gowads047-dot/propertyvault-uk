import { describe, it, expect } from "vitest";
import { derivePropertyFromSteps, deriveScore, dedupeEvidence } from "./vault-client";
import { calculated, missing, verified } from "./property";

const step = (tool: string, data: Record<string, unknown> | null, ok = true) => ({ tool, ok, data });

describe("which property a conversation was about", () => {
  it("takes the postcode from a lookup the agent actually ran", () => {
    const p = derivePropertyFromSteps([
      step("lookup_area", { found: true, postcode: "NG7 1AA", medianSoldPrice: 322_000 }),
      step("analyse_deal", { purchasePrice: 185_000, monthlyRent: 1_050, pvScore: 28 }),
    ]);
    expect(p).toEqual({ source: "postcode", postcode: "NG7 1AA", askingPrice: 185_000 });
  });

  it("accepts a constraints lookup as identification too", () => {
    const p = derivePropertyFromSteps([step("lookup_constraints", { found: true, postcode: "B29 6LA" })]);
    expect(p?.postcode).toBe("B29 6LA");
    expect(p?.askingPrice).toBeNull();
  });

  it("reads the asking price from a maximum offer run", () => {
    const p = derivePropertyFromSteps([
      step("lookup_area", { postcode: "NG7 1AA" }),
      step("maximum_offer", { askingPrice: 220_000, maxOffer: 178_500 }),
    ]);
    expect(p?.askingPrice).toBe(220_000);
  });

  // Not every question is about a property. Saving one anyway would put rows
  // in someone's vault they never asked for.
  it("returns null when nothing identifies a place", () => {
    expect(derivePropertyFromSteps([
      step("calculate_section_24", { mortgageInterest: 8_400, taxCredit: 1_680 }),
    ])).toBeNull();
  });

  it("returns null for a price with no location", () => {
    expect(derivePropertyFromSteps([
      step("analyse_deal", { purchasePrice: 185_000, monthlyRent: 1_050 }),
    ])).toBeNull();
  });

  it("ignores a step that failed", () => {
    expect(derivePropertyFromSteps([step("lookup_area", { postcode: "NG7 1AA" }, false)])).toBeNull();
  });

  it("ignores a step with no data", () => {
    expect(derivePropertyFromSteps([step("lookup_area", null)])).toBeNull();
  });

  it("takes the last postcode when a conversation moved on", () => {
    const p = derivePropertyFromSteps([
      step("lookup_area", { postcode: "NG7 1AA" }),
      step("lookup_area", { postcode: "B29 6LA" }),
    ]);
    expect(p?.postcode).toBe("B29 6LA");
  });
});

describe("the score of a run", () => {
  it("finds the score and band a scoring tool produced", () => {
    expect(deriveScore([
      step("lookup_area", { postcode: "NG7 1AA" }),
      step("analyse_deal", { pvScore: 28, band: "PASS" }),
    ])).toEqual({ score: 28, band: "PASS" });
  });

  it("reports no score rather than a zero when nothing scored", () => {
    expect(deriveScore([step("calculate_stamp_duty", { total: 10_450 })]))
      .toEqual({ score: null, band: null });
  });
});

describe("evidence on the way to the vault", () => {
  // The API refuses the same field twice, and several tools have something to
  // say about the median sold price.
  it("keeps one row per field, last one winning", () => {
    const out = dedupeEvidence([
      missing("area_median_sold", "no postcode given"),
      verified("area_median_sold", 322_000, "HM Land Registry"),
      calculated("monthly_cashflow", 120, "lib/finance.ts"),
    ]);
    expect(out).toHaveLength(2);
    const median = out.find(e => e.field === "area_median_sold")!;
    expect(median.state).toBe("verified");
    expect(median.valueNum).toBe(322_000);
  });

  it("drops anything with no field rather than sending it", () => {
    expect(dedupeEvidence([{ field: "", state: "calculated" }, calculated("x", 1, "y")])).toHaveLength(1);
  });

  it("leaves a clean list alone", () => {
    const list = [calculated("a", 1, "s"), calculated("b", 2, "s")];
    expect(dedupeEvidence(list)).toHaveLength(2);
  });
});
