// Boundary-value tests for src/lib/finance.ts
// Run with: npm test

import { describe, it, expect } from "vitest";
import {
  monthlyRepayment,
  monthlyInterestOnly,
  totalInterest,
  balanceAfter,
  borrowingFromPayment,
  pvAnnuity,
  compoundGrowth,
  discountFactor,
  pvLumpSum,
  grossYield,
  netYield,
  cashOnCash,
  roi,
} from "./finance";

const p2 = (n: number) => Math.round(n * 100) / 100;

describe("monthlyRepayment", () => {
  it("matches a published figure: £200k, 5%, 25y", () => {
    expect(p2(monthlyRepayment(200_000, 5, 25))).toBe(1169.18);
  });
  it("matches a published figure: £150k, 4.5%, 30y", () => {
    expect(p2(monthlyRepayment(150_000, 4.5, 30))).toBe(760.03);
  });
  // Regression: the amortisation formula is 0/0 at a 0% rate. Five calculators
  // inlined it without a guard and rendered NaN.
  it("repays in equal slices at 0%", () => {
    expect(monthlyRepayment(120_000, 0, 10)).toBe(1_000);
    expect(Number.isNaN(monthlyRepayment(120_000, 0, 10))).toBe(false);
  });
  it("returns 0 for a zero or negative principal", () => {
    expect(monthlyRepayment(0, 5, 25)).toBe(0);
    expect(monthlyRepayment(-1000, 5, 25)).toBe(0);
  });
  it("returns 0 for a zero term", () => expect(monthlyRepayment(200_000, 5, 0)).toBe(0));
  it("costs more per month over a shorter term", () => {
    expect(monthlyRepayment(200_000, 5, 15)).toBeGreaterThan(monthlyRepayment(200_000, 5, 30));
  });
});

describe("monthlyInterestOnly", () => {
  it("is principal × rate ÷ 12", () => {
    expect(monthlyInterestOnly(200_000, 5)).toBe(833.3333333333334);
  });
  it("is 0 at a 0% rate", () => expect(monthlyInterestOnly(200_000, 0)).toBe(0));
  it("is always below the repayment figure", () => {
    expect(monthlyInterestOnly(200_000, 5)).toBeLessThan(monthlyRepayment(200_000, 5, 25));
  });
});

describe("totalInterest", () => {
  it("is payments × term less the principal", () => {
    expect(Math.round(totalInterest(200_000, 5, 25))).toBe(
      Math.round(monthlyRepayment(200_000, 5, 25) * 300 - 200_000),
    );
  });
  it("is 0 at a 0% rate", () => expect(p2(totalInterest(120_000, 0, 10))).toBe(0));
});

describe("balanceAfter", () => {
  it("equals the principal before any payment", () => {
    expect(p2(balanceAfter(200_000, 5, 25, 0))).toBe(200_000);
  });
  it("is cleared at the end of the term", () => {
    expect(p2(balanceAfter(200_000, 5, 25, 300))).toBe(0);
  });
  it("never goes negative past the end of the term", () => {
    expect(balanceAfter(200_000, 5, 25, 400)).toBe(0);
  });
  it("falls straight-line at 0%", () => {
    expect(p2(balanceAfter(120_000, 0, 10, 60))).toBe(60_000);
  });
  it("decreases over time", () => {
    expect(balanceAfter(200_000, 5, 25, 120)).toBeLessThan(balanceAfter(200_000, 5, 25, 60));
  });
});

describe("borrowingFromPayment", () => {
  it("round-trips against monthlyRepayment", () => {
    const loan = borrowingFromPayment(1169.18, 5, 25);
    expect(Math.round(loan / 100) * 100).toBe(200_000);
  });
  it("is budget × months at 0%", () => {
    expect(borrowingFromPayment(1_000, 0, 10)).toBe(120_000);
  });
  it("returns 0 for a zero budget", () => expect(borrowingFromPayment(0, 5, 25)).toBe(0));
});

describe("pvAnnuity", () => {
  it("discounts a level income stream", () => {
    // £250/yr for 10y at 5% → 250 × 7.7217
    expect(p2(pvAnnuity(250, 5, 10))).toBe(1930.43);
  });
  it("is amount × years at a 0% discount rate", () => {
    expect(pvAnnuity(250, 0, 10)).toBe(2_500);
  });
  it("is 0 for a zero amount or term", () => {
    expect(pvAnnuity(0, 5, 10)).toBe(0);
    expect(pvAnnuity(250, 5, 0)).toBe(0);
  });
});

describe("compoundGrowth", () => {
  it("compounds annually", () => expect(p2(compoundGrowth(100_000, 5, 2))).toBe(110_250));
  it("is flat at 0%", () => expect(compoundGrowth(100_000, 0, 10)).toBe(100_000));
  it("is unchanged over zero years", () => expect(compoundGrowth(100_000, 5, 0)).toBe(100_000));
});

describe("yields and returns", () => {
  it("grossYield is rent over price", () => expect(grossYield(12_000, 200_000)).toBe(6));
  it("netYield deducts costs", () => expect(netYield(12_000, 4_000, 200_000)).toBe(4));
  it("cashOnCash is cashflow over cash in", () => expect(cashOnCash(5_000, 50_000)).toBe(10));
  it("roi is profit over invested", () => expect(roi(25_000, 100_000)).toBe(25));
  // Divide-by-zero guards — an empty price field must not render NaN or Infinity.
  it("returns 0 rather than NaN when the denominator is 0", () => {
    expect(grossYield(12_000, 0)).toBe(0);
    expect(netYield(12_000, 4_000, 0)).toBe(0);
    expect(cashOnCash(5_000, 0)).toBe(0);
    expect(roi(25_000, 0)).toBe(0);
  });
  it("allows negative returns", () => {
    expect(netYield(5_000, 9_000, 200_000)).toBe(-2);
    expect(roi(-10_000, 100_000)).toBe(-10);
  });
});

describe("discountFactor / pvLumpSum", () => {
  it("is 1 for a sum received today", () => expect(discountFactor(5, 0)).toBe(1));
  it("halves roughly every 14 years at 5%", () => {
    expect(p2(discountFactor(5, 14))).toBe(0.51);
  });
  it("is unchanged at a 0% rate", () => {
    expect(discountFactor(0, 30)).toBe(1);
    expect(pvLumpSum(100_000, 0, 30)).toBe(100_000);
  });
  it("pvLumpSum discounts a reversion", () => {
    // £300k freehold reverting in 60 years at a 5% deferment rate
    expect(Math.round(pvLumpSum(300_000, 5, 60))).toBe(16_061);
    expect(pvLumpSum(300_000, 5, 60)).toBeCloseTo(300_000 / Math.pow(1.05, 60), 6);
  });
  it("a deferred annuity equals pvAnnuity × discountFactor", () => {
    // £250/yr for 10 years, starting 15 years from now, at 5%.
    // Compared against the closed form rather than rounded constants.
    const deferred = pvAnnuity(250, 5, 10) * discountFactor(5, 15);
    const closedForm = (250 * (1 - Math.pow(1.05, -10))) / 0.05 / Math.pow(1.05, 15);
    expect(deferred).toBeCloseTo(closedForm, 9);
  });
});
