// Mortgage and investment-return maths — pure functions, no UI concerns.
//
// These formulas were previously inlined in six calculators. Keeping one copy
// means a fix lands everywhere at once; see lib/tax.ts for the same pattern.
//
// Rates are passed as annual PERCENTAGES (5 means 5%), because that is what the
// inputs collect. Every function guards the 0% case: the standard amortisation
// formula evaluates to 0/0 there, which silently produced NaN in the UI.

/** Monthly payment on a repayment (capital & interest) mortgage. */
export function monthlyRepayment(
  principal: number,
  annualRatePct: number,
  termYears: number,
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = Math.round(termYears * 12);
  const r = annualRatePct / 100 / 12;
  // At 0% the loan is simply repaid in equal slices.
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Monthly payment on an interest-only mortgage. */
export function monthlyInterestOnly(principal: number, annualRatePct: number): number {
  if (principal <= 0) return 0;
  return (principal * (annualRatePct / 100)) / 12;
}

/** Total interest paid across the full term of a repayment mortgage. */
export function totalInterest(
  principal: number,
  annualRatePct: number,
  termYears: number,
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = Math.round(termYears * 12);
  return monthlyRepayment(principal, annualRatePct, termYears) * n - principal;
}

/** Outstanding balance on a repayment mortgage after a number of months. */
export function balanceAfter(
  principal: number,
  annualRatePct: number,
  termYears: number,
  monthsPaid: number,
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = Math.round(termYears * 12);
  const m = Math.min(Math.max(0, Math.round(monthsPaid)), n);
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal * (1 - m / n);
  const pmt = monthlyRepayment(principal, annualRatePct, termYears);
  const grown = Math.pow(1 + r, m);
  return Math.max(0, principal * grown - pmt * ((grown - 1) / r));
}

/** Largest loan whose monthly repayment fits a given budget — inverse of monthlyRepayment. */
export function borrowingFromPayment(
  monthlyBudget: number,
  annualRatePct: number,
  termYears: number,
): number {
  if (monthlyBudget <= 0 || termYears <= 0) return 0;
  const n = Math.round(termYears * 12);
  const r = annualRatePct / 100 / 12;
  if (r === 0) return monthlyBudget * n;
  return (monthlyBudget * (1 - Math.pow(1 + r, -n))) / r;
}

/** Present value of a level annual sum received for n years, discounted at a rate. */
export function pvAnnuity(annualAmount: number, annualRatePct: number, years: number): number {
  if (annualAmount === 0 || years <= 0) return 0;
  const r = annualRatePct / 100;
  if (r === 0) return annualAmount * years;
  return (annualAmount * (1 - Math.pow(1 + r, -years))) / r;
}

/**
 * Discount factor for a sum received `years` from now — (1 + r)^-years.
 * Multiply a future amount, or a pvAnnuity, by this to defer it.
 */
export function discountFactor(annualRatePct: number, years: number): number {
  return Math.pow(1 + annualRatePct / 100, -years);
}

/** Present value of a single lump sum received `years` from now. */
export function pvLumpSum(amount: number, annualRatePct: number, years: number): number {
  return amount * discountFactor(annualRatePct, years);
}

/** Value after compounding at an annual rate for a number of years. */
export function compoundGrowth(value: number, annualRatePct: number, years: number): number {
  return value * Math.pow(1 + annualRatePct / 100, years);
}

/** Gross rental yield as a percentage of purchase price. */
export function grossYield(annualRent: number, price: number): number {
  if (price <= 0) return 0;
  return (annualRent / price) * 100;
}

/** Net rental yield — rent less running costs, as a percentage of price. */
export function netYield(annualRent: number, annualCosts: number, price: number): number {
  if (price <= 0) return 0;
  return ((annualRent - annualCosts) / price) * 100;
}

/** Annual cash return as a percentage of the cash actually invested. */
export function cashOnCash(annualNetCashflow: number, cashInvested: number): number {
  if (cashInvested <= 0) return 0;
  return (annualNetCashflow / cashInvested) * 100;
}

/** Return on investment as a percentage. */
export function roi(profit: number, invested: number): number {
  if (invested <= 0) return 0;
  return (profit / invested) * 100;
}

/**
 * `part` as a percentage of `whole`, returning 0 when `whole` is zero or
 * negative.
 *
 * Calculator inputs are `<input type="number">`, and clearing one yields 0
 * rather than a blank. Dividing by it produced "Infinity%" on screen — the
 * Deal Analyser rendered "Your gross yield of Infinity% beats the Nottingham
 * average" with an empty purchase price. Use this anywhere a user-supplied
 * value is the denominator.
 */
export function pctOf(part: number, whole: number): number {
  if (!Number.isFinite(whole) || whole <= 0) return 0;
  if (!Number.isFinite(part)) return 0;
  return (part / whole) * 100;
}
