import { describe, it, expect } from "vitest";
import { compare, money, DEFAULT_ASSUMPTIONS, ESTIMATOR_CITIES } from "./guaranteed-rent-model";
import { guaranteedRentCities } from "./site";

/**
 * The guaranteed-rent illustration has to add up, and has to keep adding up
 * when somebody edits an assumption.
 *
 * The published version did not. Its "Self-Managing" column deducted a
 * letting agent's 10%; its void row said three weeks while the note beneath
 * said 2.7; and it charged a £500 tenant-find fee in full every year while
 * describing it as spread over an eighteen-month tenancy. The totals were
 * internally consistent, which is what made it hard to spot — the arithmetic
 * was right and the model was wrong.
 */

describe("the comparison adds up", () => {
  const c = compare();

  it("uses a 52-week year for voids, not twelve four-week months", () => {
    // The widget used monthlyRent / 4 * weeks, which makes a year 48 weeks and
    // overstates a three-week void by 8.3%: £750 against £692.
    expect(c.voidCost).toBeCloseTo((12000 / 52) * 3, 6);
    expect(Math.round(c.voidCost)).toBe(692);
    expect(Math.round(c.voidCost)).not.toBe(750);
  });

  it("spreads the tenant-find fee over the tenancy", () => {
    // £500 over 1.5 years is £333 a year, not £500 a year.
    expect(c.tenantFindPerYear).toBeCloseTo(500 / 1.5, 6);
    expect(Math.round(c.tenantFindPerYear)).toBe(333);
  });

  it("keeps agent fees out of the self-managing column", () => {
    expect(c.lettingAgentNet).toBeCloseTo(c.selfManagingNet - c.agentFees, 6);
    expect(c.selfManagingNet).toBeGreaterThan(c.lettingAgentNet);
  });

  it("nets to the sum of its own rows", () => {
    const deductions = c.voidCost + c.maintenance + c.compliance + c.tenantFindPerYear;
    expect(c.selfManagingNet).toBeCloseTo(c.annualMarketRent - deductions, 6);
    expect(c.lettingAgentNet).toBeCloseTo(c.annualMarketRent - deductions - c.agentFees, 6);
  });

  it("states the difference in both directions consistently", () => {
    expect(c.vsSelfManaging).toBeCloseTo(c.annualGuaranteedRent - c.selfManagingNet, 6);
    expect(c.vsLettingAgent).toBeCloseTo(c.annualGuaranteedRent - c.lettingAgentNet, 6);
    // Guaranteed rent must beat the agent case by more than the self-managed
    // one, because self-managing avoids the fee. If this ever inverts, the
    // model is wrong rather than the market being surprising.
    expect(c.vsLettingAgent).toBeGreaterThan(c.vsSelfManaging);
  });

  it("is honest that self-managing is the closer call", () => {
    // On the default assumptions guaranteed rent beats self-managing by about
    // £126 a year, not the £1,492 the old table claimed. The old figure came
    // from charging a self-manager a letting agent's fee.
    expect(Math.round(c.vsSelfManaging)).toBe(126);
    expect(Math.round(c.vsLettingAgent)).toBe(1326);
  });
});

describe("edge cases", () => {
  it("survives a zero-void, zero-cost property", () => {
    const c = compare({
      ...DEFAULT_ASSUMPTIONS,
      voidWeeks: 0, maintenance: 0, compliance: 0, tenantFindFee: 0,
    });
    expect(c.selfManagingNet).toBe(c.annualMarketRent);
    // With no costs at all, an 85% offer must lose to self-managing. A model
    // that still claimed a win here would be arithmetically impossible.
    expect(c.vsSelfManaging).toBeLessThan(0);
  });

  it("does not divide by zero on a nil tenancy length", () => {
    const c = compare({ ...DEFAULT_ASSUMPTIONS, tenancyYears: 0 });
    expect(Number.isFinite(c.tenantFindPerYear)).toBe(false);
    // Documented rather than silently guarded: tenancyYears is a constant in
    // this repo, and a NaN in the table is far easier to notice than a wrong
    // number. If it ever becomes user input, guard it at the input.
  });

  it("handles a full year of voids without going negative on rent", () => {
    const c = compare({ ...DEFAULT_ASSUMPTIONS, voidWeeks: 52 });
    expect(Math.round(c.voidCost)).toBe(c.annualMarketRent);
    expect(c.selfManagingNet).toBeLessThan(0);
  });

  it("scales linearly with rent", () => {
    const a = compare({ ...DEFAULT_ASSUMPTIONS, monthlyMarketRent: 1000 });
    const b = compare({ ...DEFAULT_ASSUMPTIONS, monthlyMarketRent: 2000 });
    expect(b.voidCost).toBeCloseTo(a.voidCost * 2, 6);
    expect(b.agentFees).toBeCloseTo(a.agentFees * 2, 6);
    // Fixed costs must not double.
    expect(b.maintenance).toBe(a.maintenance);
    expect(b.compliance).toBe(a.compliance);
  });

  it("formats negatives with a real minus sign, not a hyphen", () => {
    expect(money(1234.4)).toBe("£1,234");
    expect(money(-692.31)).toBe("−£692");
    expect(money(0)).toBe("£0");
  });
});

describe("estimator coverage is a subset of where we operate", () => {
  it("never offers an instant estimate for a city we do not serve", () => {
    const served = new Set(guaranteedRentCities.map(c => c.slug));
    for (const slug of ESTIMATOR_CITIES) {
      expect(served.has(slug), `${slug} has rates but is not a service city`).toBe(true);
    }
  });

  it("has fewer estimator cities than service cities, so the gap must be explained", () => {
    // If these ever match, the copy saying "three of our six cities" is wrong.
    // This is a reminder to update the page, not a rule that the gap is good.
    expect(ESTIMATOR_CITIES.length).toBeLessThan(guaranteedRentCities.length);
    expect(ESTIMATOR_CITIES.length).toBe(3);
    expect(guaranteedRentCities.length).toBe(6);
  });
});
