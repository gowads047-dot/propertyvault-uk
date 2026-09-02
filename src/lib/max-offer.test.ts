import { describe, it, expect } from "vitest";
import { calculateMaximumOffer, metricsAt, explainBinding, type OfferDeal } from "./max-offer";

/** The deal from the live agent run: £185k asking, £1,050 rent, NG7. */
const deal: OfferDeal = { askingPrice: 185_000, monthlyRent: 1_050 };

describe("the monotonicity the search depends on", () => {
  // The binary search is only valid because every metric improves as the price
  // falls. If that ever stopped being true the search would return nonsense,
  // so it is asserted rather than assumed.
  it("improves every metric as the price drops", () => {
    let prev = metricsAt(deal, 30_000);
    for (let p = 35_000; p <= 400_000; p += 5_000) {
      const m = metricsAt(deal, p);
      expect(m.monthlyCashflow, `cashflow at ${p}`).toBeLessThanOrEqual(prev.monthlyCashflow);
      expect(m.netYieldPct, `net yield at ${p}`).toBeLessThanOrEqual(prev.netYieldPct);
      expect(m.cashOnCashPct, `CoC at ${p}`).toBeLessThanOrEqual(prev.cashOnCashPct);
      expect(m.cashflowAtPlus2, `+2% at ${p}`).toBeLessThanOrEqual(prev.cashflowAtPlus2);
      expect(m.score, `score at ${p}`).toBeLessThanOrEqual(prev.score);
      prev = m;
    }
  });

  it("holds when an area median is in play", () => {
    const d = { ...deal, areaMedianSoldPrice: 200_000 };
    let prev = metricsAt(d, 50_000);
    for (let p = 60_000; p <= 300_000; p += 10_000) {
      const m = metricsAt(d, p);
      expect(m.score, `score at ${p}`).toBeLessThanOrEqual(prev.score);
      prev = m;
    }
  });
});

describe("solving for the offer", () => {
  it("finds a price that meets the target when asking does not", () => {
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    expect(o.worksAtAsking).toBe(false);
    expect(o.maxOffer).not.toBeNull();
    expect(o.maxOffer!).toBeLessThan(deal.askingPrice);
    expect(metricsAt(deal, o.maxOffer!).monthlyCashflow).toBeGreaterThanOrEqual(250);
  });

  // The definition of "maximum": one step higher must fail.
  it("returns the highest price that works, not merely a price that works", () => {
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    expect(metricsAt(deal, o.maxOffer! + 500).monthlyCashflow).toBeLessThan(250);
  });

  it("rounds to £500, because that is how offers are made", () => {
    for (const t of [100, 200, 300, 400]) {
      const o = calculateMaximumOffer(deal, { minMonthlyCashflow: t });
      expect(o.maxOffer! % 500, `target ${t}`).toBe(0);
    }
  });

  it("reports the discount in pounds and percent", () => {
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    expect(o.discount).toBe(185_000 - o.maxOffer!);
    expect(o.discountPct).toBeCloseTo((o.discount / 185_000) * 100, 1);
  });

  it("suggests an opening offer below the maximum", () => {
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    expect(o.openingOffer!).toBeLessThan(o.maxOffer!);
    expect(o.openingOffer! % 500).toBe(0);
  });

  it("a tougher target produces a lower offer", () => {
    const soft = calculateMaximumOffer(deal, { minMonthlyCashflow: 100 });
    const hard = calculateMaximumOffer(deal, { minMonthlyCashflow: 400 });
    expect(hard.maxOffer!).toBeLessThan(soft.maxOffer!);
  });
});

describe("when the asking price already works", () => {
  // Never invite a bid over asking to "use up" headroom.
  it("returns the asking price and never more", () => {
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: -500 });
    expect(o.worksAtAsking).toBe(true);
    expect(o.maxOffer).toBe(deal.askingPrice);
    expect(o.discount).toBe(0);
    expect(o.bindingTarget).toBeNull();
  });

  it("never returns an offer above asking under any target", () => {
    for (const t of [-1000, -100, 0, 50, 100, 250, 500]) {
      const o = calculateMaximumOffer(deal, { minMonthlyCashflow: t });
      if (o.maxOffer !== null) {
        expect(o.maxOffer, `target ${t}`).toBeLessThanOrEqual(deal.askingPrice);
      }
    }
  });
});

describe("when no offer works", () => {
  // The rent is the problem, not the price. Saying so is more useful than a
  // number that implies negotiation could fix it.
  it("returns null and explains that the income is the issue", () => {
    const thin: OfferDeal = { askingPrice: 200_000, monthlyRent: 300 };
    const o = calculateMaximumOffer(thin, { minMonthlyCashflow: 500 });
    expect(o.maxOffer).toBeNull();
    expect(o.openingOffer).toBeNull();
    expect(o.reason).toContain("the income, not the price");
  });

  it("says so when the running costs alone exceed the rent", () => {
    // No price helps here: even at zero the property loses money every month,
    // because the costs are larger than the income.
    const underwater: OfferDeal = {
      askingPrice: 200_000, monthlyRent: 400, runningCostsMonthly: 550,
    };
    const o = calculateMaximumOffer(underwater, { minMonthlyCashflow: 0 });
    expect(o.maxOffer).toBeNull();
    expect(o.atMax).toBeNull();
    expect(o.reason).toContain("the income, not the price");
  });

  // Worth pinning down, because it looks wrong at a glance and is not: with a
  // tiny purchase price the cash invested is tiny too, so a high percentage
  // return is reachable on a trivial rent. The percentage is real; the deal is
  // absurd for other reasons the score picks up.
  it("still finds a price when a percentage target is met by a small denominator", () => {
    const o = calculateMaximumOffer({ askingPrice: 200_000, monthlyRent: 100 }, { minCashOnCash: 15 });
    expect(o.maxOffer).not.toBeNull();
    expect(metricsAt({ askingPrice: 200_000, monthlyRent: 100 }, o.maxOffer!).cashOnCashPct)
      .toBeGreaterThanOrEqual(15);
  });
});

describe("which target is binding", () => {
  it("names the target that stops the price going higher", () => {
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    expect(o.bindingTarget).toBe("minMonthlyCashflow");
  });

  it("picks the tightest when several are set", () => {
    // A very high cash-flow bar alongside a trivially met yield bar.
    const o = calculateMaximumOffer(deal, { minMonthlyCashflow: 400, minNetYield: 0.1 });
    expect(o.bindingTarget).toBe("minMonthlyCashflow");
  });

  it("can be bound by the score", () => {
    const o = calculateMaximumOffer(deal, { minScore: 60 });
    expect(o.maxOffer).not.toBeNull();
    expect(metricsAt(deal, o.maxOffer!).score).toBeGreaterThanOrEqual(60);
  });

  it("can be bound by rate resilience", () => {
    const o = calculateMaximumOffer(deal, { minCashflowAtPlus2: 0 });
    expect(o.maxOffer).not.toBeNull();
    expect(metricsAt(deal, o.maxOffer!).cashflowAtPlus2).toBeGreaterThanOrEqual(0);
  });
});

describe("explaining it", () => {
  it("says why in a sentence a person would say", () => {
    const t = { minMonthlyCashflow: 250 };
    const o = calculateMaximumOffer(deal, t);
    const s = explainBinding(o, t);
    expect(s).toContain("£250 a month");
    expect(s).toContain("cash flow");
    expect(s).toMatch(/£\d{2,3},\d{3}/);
  });

  it("says plainly when the asking price already works", () => {
    const t = { minMonthlyCashflow: -500 };
    expect(explainBinding(calculateMaximumOffer(deal, t), t)).toContain("already meets");
  });

  it("passes the reason through when nothing works", () => {
    const t = { minMonthlyCashflow: 500 };
    const o = calculateMaximumOffer({ askingPrice: 200_000, monthlyRent: 300 }, t);
    expect(explainBinding(o, t)).toContain("the income, not the price");
  });
});

describe("edge cases", () => {
  it("does nothing useful, and says so, when no target is set", () => {
    const o = calculateMaximumOffer(deal, {});
    expect(o.maxOffer).toBe(deal.askingPrice);
    expect(o.reason).toContain("nothing to solve for");
  });

  it("is deterministic", () => {
    const a = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    const b = calculateMaximumOffer(deal, { minMonthlyCashflow: 250 });
    expect(a).toEqual(b);
  });

  it("accounts for stamp duty bands moving as the price falls", () => {
    // Crossing £250k changes the additional-property rate, so cash required
    // must fall faster than the price alone would suggest.
    const big: OfferDeal = { askingPrice: 300_000, monthlyRent: 1_600 };
    const above = metricsAt(big, 260_000);
    const below = metricsAt(big, 240_000);
    expect(below.stampDuty).toBeLessThan(above.stampDuty);
    expect(above.stampDuty - below.stampDuty).toBeGreaterThan(20_000 * 0.05);
  });

  it("handles a cash purchase, where there is no mortgage to shrink", () => {
    const cash: OfferDeal = { askingPrice: 185_000, monthlyRent: 1_050, depositPct: 100, mortgageRate: 0 };
    const o = calculateMaximumOffer(cash, { minCashOnCash: 6 });
    expect(o.maxOffer).not.toBeNull();
    expect(metricsAt(cash, o.maxOffer!).cashOnCashPct).toBeGreaterThanOrEqual(6);
  });
});

describe("the binding target is always identified", () => {
  // Searching in pounds and rounding afterwards left maxOffer below the last
  // tested price, so one step above it could still pass and the binding target
  // came back null — the explanation then fell through to a generic sentence.
  it("names a binding target for every reachable single target", () => {
    const cases: [string, Parameters<typeof calculateMaximumOffer>[1]][] = [
      ["cashflow", { minMonthlyCashflow: 250 }],
      ["cash-on-cash", { minCashOnCash: 8 }],
      ["net yield", { minNetYield: 3 }],
      ["score", { minScore: 70 }],
      ["resilience", { minCashflowAtPlus2: 0 }],
    ];
    for (const [label, t] of cases) {
      const o = calculateMaximumOffer(deal, t);
      expect(o.maxOffer, label).not.toBeNull();
      expect(o.bindingTarget, label).not.toBeNull();
      expect(explainBinding(o, t), label).not.toContain("is the most this deal supports");
    }
  });

  it("puts the maximum exactly one step below the first failing price", () => {
    for (const t of [{ minMonthlyCashflow: 250 }, { minScore: 70 }, { minCashOnCash: 8 }]) {
      const o = calculateMaximumOffer(deal, t);
      const passes = (p: number) => {
        const m = metricsAt(deal, p);
        if ("minMonthlyCashflow" in t) return m.monthlyCashflow >= t.minMonthlyCashflow!;
        if ("minScore" in t) return m.score >= t.minScore!;
        return m.cashOnCashPct >= t.minCashOnCash!;
      };
      expect(passes(o.maxOffer!), `${JSON.stringify(t)} at max`).toBe(true);
      expect(passes(o.maxOffer! + 500), `${JSON.stringify(t)} one step up`).toBe(false);
    }
  });
});
