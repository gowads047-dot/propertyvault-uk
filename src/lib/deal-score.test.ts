import { describe, it, expect } from "vitest";
import { scoreDeal, bandFor, ANCHORS, type DealScoreInputs } from "./deal-score";

/** A deal that clears every anchor. */
const strong: DealScoreInputs = {
  netYield: 7,
  monthlyCashflow: 300,
  cashOnCash: 10,
  cashflowAtPlus2: 200,
  purchasePrice: 180_000,
};

describe("bands", () => {
  it("maps totals to the four verdicts", () => {
    expect(bandFor(100)).toBe("STRONG");
    expect(bandFor(75)).toBe("STRONG");
    expect(bandFor(74)).toBe("WATCHLIST");
    expect(bandFor(55)).toBe("WATCHLIST");
    expect(bandFor(54)).toBe("RISKY");
    expect(bandFor(35)).toBe("RISKY");
    expect(bandFor(34)).toBe("PASS");
    expect(bandFor(0)).toBe("PASS");
  });
});

describe("scoreDeal", () => {
  it("awards 100 to a deal sitting on every anchor", () => {
    expect(scoreDeal(strong).total).toBe(100);
    expect(scoreDeal(strong).band).toBe("STRONG");
  });

  it("awards 0 to a deal that fails every anchor", () => {
    const s = scoreDeal({
      netYield: 0,
      monthlyCashflow: 0,
      cashOnCash: 0,
      cashflowAtPlus2: ANCHORS.resilienceZero,
      purchasePrice: 180_000,
    });
    expect(s.total).toBe(0);
    expect(s.band).toBe("PASS");
  });

  it("never goes outside 0–100, however extreme the inputs", () => {
    const wild = scoreDeal({
      netYield: 900,
      monthlyCashflow: 99_999,
      cashOnCash: 500,
      cashflowAtPlus2: 50_000,
      purchasePrice: 1,
      areaMedianSoldPrice: 10_000_000,
    });
    expect(wild.total).toBeLessThanOrEqual(100);

    const dire = scoreDeal({
      netYield: -50,
      monthlyCashflow: -5_000,
      cashOnCash: -80,
      cashflowAtPlus2: -9_000,
      purchasePrice: 10_000_000,
      areaMedianSoldPrice: 100_000,
    });
    expect(dire.total).toBeGreaterThanOrEqual(0);
  });

  it("is deterministic — the same inputs always give the same score", () => {
    expect(scoreDeal(strong)).toEqual(scoreDeal(strong));
  });

  // The point of the format: the breakdown has to be sayable out loud.
  it("gives every component a plain-English reason", () => {
    for (const c of scoreDeal(strong).components) {
      expect(c.reason.length, c.key).toBeGreaterThan(10);
      expect(c.score, c.key).toBeLessThanOrEqual(c.max);
      expect(c.score, c.key).toBeGreaterThanOrEqual(0);
    }
  });

  it("says a negative cash flow is a loss rather than dressing it up", () => {
    const s = scoreDeal({ ...strong, monthlyCashflow: -160 });
    const cf = s.components.find(c => c.key === "cashflow")!;
    expect(cf.score).toBe(0);
    expect(cf.reason).toContain("Loses £160");
  });

  it("punishes a deal that only works at today's rate", () => {
    const fragile = scoreDeal({ ...strong, cashflowAtPlus2: -100 });
    const resilient = scoreDeal(strong);
    expect(fragile.total).toBeLessThan(resilient.total);
    expect(fragile.components.find(c => c.key === "resilience")!.score).toBe(0);
    expect(fragile.components.find(c => c.key === "resilience")!.reason).toContain("negative at +2%");
  });
});

describe("what it refuses to score", () => {
  // The whole reason this file exists rather than the six-category version.
  it("never scores location or demand, and says why", () => {
    const s = scoreDeal(strong);
    expect(s.components.map(c => c.key)).not.toContain("location");
    expect(s.components.map(c => c.key)).not.toContain("demand");

    const labels = s.excluded.map(e => e.label);
    expect(labels).toContain("Location");
    expect(labels).toContain("Demand");
    for (const e of s.excluded) {
      expect(e.reason.length, e.label).toBeGreaterThan(10);
    }
  });

  it("drops Value rather than guessing when Land Registry has nothing", () => {
    const s = scoreDeal(strong);
    expect(s.componentsScored).toBe(4);
    expect(s.excluded.map(e => e.label)).toContain("Value");
  });

  it("scores Value when real sold prices are available", () => {
    const s = scoreDeal({ ...strong, areaMedianSoldPrice: 200_000 });
    expect(s.componentsScored).toBe(5);
    const v = s.components.find(c => c.key === "value")!;
    expect(v.reason).toContain("below the area median");
  });

  // Missing data must not quietly inflate or deflate a score, or two properties
  // become uncomparable and the format loses its meaning.
  it("normalises so a missing component neither inflates nor deflates", () => {
    const withoutData = scoreDeal(strong);
    const atMedian = scoreDeal({ ...strong, areaMedianSoldPrice: strong.purchasePrice });
    // Sitting exactly on the median earns half of Value; a deal perfect on the
    // other four should still not be dragged below WATCHLIST by that alone.
    expect(withoutData.total).toBe(100);
    expect(atMedian.total).toBeLessThan(100);
    expect(atMedian.band).toBe("STRONG");
  });

  it("rewards buying under the area median", () => {
    const under = scoreDeal({ ...strong, purchasePrice: 180_000, areaMedianSoldPrice: 200_000 });
    const over = scoreDeal({ ...strong, purchasePrice: 220_000, areaMedianSoldPrice: 200_000 });
    expect(under.total).toBeGreaterThan(over.total);
  });
});

describe("equity uplift", () => {
  // A plain BTL is not trying to create equity. Scoring it zero would mark it
  // down for succeeding at something it never attempted.
  it("is excluded for a buy-to-let, not scored as zero", () => {
    const s = scoreDeal(strong);
    expect(s.components.map(c => c.key)).not.toContain("equity");
    expect(s.excluded.map(e => e.label)).toContain("Equity uplift");
    expect(s.total).toBe(100);
  });

  it("is scored when a refurb actually creates equity", () => {
    const s = scoreDeal({ ...strong, equityGain: 18_000 });
    const e = s.components.find(c => c.key === "equity")!;
    expect(e.score).toBe(10);
    expect(e.reason).toContain("£18,000");
    expect(s.total).toBe(100);
  });

  it("marks down a refurb that costs more than it adds", () => {
    const s = scoreDeal({ ...strong, equityGain: -5_000 });
    const e = s.components.find(c => c.key === "equity")!;
    expect(e.score).toBe(0);
    expect(e.reason).toContain("more than it adds");
    expect(s.total).toBeLessThan(100);
  });

  // The reason both optional components exist at all.
  it("keeps a BTL and a BRRR comparable on the same 0-100 scale", () => {
    const btl = scoreDeal(strong);
    const brrr = scoreDeal({ ...strong, equityGain: 18_000 });
    expect(btl.total).toBe(brrr.total);
    expect(btl.componentsScored).toBe(4);
    expect(brrr.componentsScored).toBe(5);
  });
});
