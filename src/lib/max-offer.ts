import { calcSDLT } from "./tax";
import { grossYield, netYield, cashOnCash, monthlyInterestOnly, monthlyRepayment } from "./finance";
import { scoreDeal, type ScoreBand } from "./deal-score";

/**
 * The Maximum Offer.
 *
 * Every calculator in this repo runs forwards: here is a price, here is what
 * you get. That answers "is this deal good", which is not the question anyone
 * actually has standing in a hallway. The question is "what should I pay".
 *
 * This runs the same maths backwards — the price at which the deal exactly
 * meets the buyer's own targets, and not a pound more. Nothing else in UK
 * property computes it, and it needs no data we do not already hold.
 *
 * ── How ────────────────────────────────────────────────────────────────────
 *
 * By binary search rather than algebra, because stamp duty is a band function
 * and cannot be inverted cleanly. That is sound because every metric improves
 * monotonically as the price falls: a lower price means a smaller deposit, a
 * smaller loan, less interest, less stamp duty, less cash in — so cash flow,
 * yield, cash-on-cash, rate resilience and value all move the same way. The
 * monotonicity is asserted in the tests rather than assumed here.
 *
 * ── What it will not do ────────────────────────────────────────────────────
 *
 * It never returns a price above the asking price. If the deal already clears
 * every target, the answer is the asking price and the honest statement is
 * "this works as advertised", not an invitation to bid over.
 */

export interface OfferTargets {
  /** Pounds per month after everything. */
  minMonthlyCashflow?: number;
  /** Percent, annual net income over cash invested. */
  minCashOnCash?: number;
  /** Percent, after running costs and finance. */
  minNetYield?: number;
  /** 0-100 PropertyVault Score. */
  minScore?: number;
  /** Monthly cash flow that must survive a two point rate rise. */
  minCashflowAtPlus2?: number;
}

export interface OfferDeal {
  askingPrice: number;
  monthlyRent: number;
  depositPct?: number;
  mortgageRate?: number;
  mortgageType?: "interest" | "repayment";
  mortgageTermYears?: number;
  runningCostsMonthly?: number;
  refurbCost?: number;
  isAdditionalProperty?: boolean;
  areaMedianSoldPrice?: number;
}

export interface OfferMetrics {
  price: number;
  deposit: number;
  stampDuty: number;
  cashRequired: number;
  monthlyCashflow: number;
  cashflowAtPlus2: number;
  grossYieldPct: number;
  netYieldPct: number;
  cashOnCashPct: number;
  score: number;
  band: ScoreBand;
}

export interface MaximumOffer {
  askingPrice: number;
  /** Null when no price in range meets the targets. */
  maxOffer: number | null;
  /** A conventional first bid, below the maximum. Null when maxOffer is. */
  openingOffer: number | null;
  /** Pounds and percent below asking. Zero when the deal already works. */
  discount: number;
  discountPct: number;
  /** Which target stops the price going higher. The sentence to say out loud. */
  bindingTarget: keyof OfferTargets | null;
  /** True when the asking price already meets every target. */
  worksAtAsking: boolean;
  atAsking: OfferMetrics;
  atMax: OfferMetrics | null;
  /** Why no offer works, when maxOffer is null. */
  reason?: string;
}

/** Offers are made in round numbers. £500 is the granularity people actually use. */
const OFFER_STEP = 500;
/** A conventional opening bid: 5% under the maximum, floored at a sane number. */
const OPENING_DISCOUNT = 0.05;
/** Legals and survey. An assumption, and flagged as one wherever it surfaces. */
const BUYING_EXTRAS = 2_100;
const DEFAULT_COST_RATIO = 0.28;

export function metricsAt(deal: OfferDeal, price: number): OfferMetrics {
  const pcm = deal.monthlyRent;
  const depositPct = deal.depositPct ?? 25;
  const rate = deal.mortgageRate ?? 5.5;
  const term = deal.mortgageTermYears ?? 25;

  const loan = price * (1 - depositPct / 100);
  const deposit = price - loan;
  const pay = (r: number) => deal.mortgageType === "repayment"
    ? monthlyRepayment(loan, r, term)
    : monthlyInterestOnly(loan, r);

  const running = deal.runningCostsMonthly ?? pcm * DEFAULT_COST_RATIO;
  const cashflow = pcm - running - pay(rate);
  const cashflowAtPlus2 = pcm - running - pay(rate + 2);

  const sdlt = calcSDLT(price, deal.isAdditionalProperty ?? true);
  const cashIn = deposit + sdlt + BUYING_EXTRAS + (deal.refurbCost ?? 0);

  const annualRent = pcm * 12;
  const net = netYield(annualRent, (running + pay(rate)) * 12, price);
  const coc = cashOnCash(cashflow * 12, cashIn);

  const s = scoreDeal({
    netYield: net,
    monthlyCashflow: cashflow,
    cashOnCash: coc,
    cashflowAtPlus2,
    purchasePrice: price,
    areaMedianSoldPrice: deal.areaMedianSoldPrice,
  });

  return {
    price,
    deposit: Math.round(deposit),
    stampDuty: sdlt,
    cashRequired: Math.round(cashIn),
    monthlyCashflow: Math.round(cashflow),
    cashflowAtPlus2: Math.round(cashflowAtPlus2),
    grossYieldPct: Number(grossYield(annualRent, price).toFixed(2)),
    netYieldPct: Number(net.toFixed(2)),
    cashOnCashPct: Number(coc.toFixed(2)),
    score: s.total,
    band: s.band,
  };
}

/** Which targets a set of metrics fails. Empty means it clears them all. */
function unmet(m: OfferMetrics, t: OfferTargets): (keyof OfferTargets)[] {
  const failed: (keyof OfferTargets)[] = [];
  if (t.minMonthlyCashflow != null && m.monthlyCashflow < t.minMonthlyCashflow) failed.push("minMonthlyCashflow");
  if (t.minCashOnCash != null && m.cashOnCashPct < t.minCashOnCash) failed.push("minCashOnCash");
  if (t.minNetYield != null && m.netYieldPct < t.minNetYield) failed.push("minNetYield");
  if (t.minScore != null && m.score < t.minScore) failed.push("minScore");
  if (t.minCashflowAtPlus2 != null && m.cashflowAtPlus2 < t.minCashflowAtPlus2) failed.push("minCashflowAtPlus2");
  return failed;
}

const meets = (m: OfferMetrics, t: OfferTargets) => unmet(m, t).length === 0;

export function calculateMaximumOffer(deal: OfferDeal, targets: OfferTargets): MaximumOffer {
  const atAsking = metricsAt(deal, deal.askingPrice);

  const noTargets = Object.values(targets).every(v => v == null);
  if (noTargets) {
    return {
      askingPrice: deal.askingPrice, maxOffer: deal.askingPrice, openingOffer: null,
      discount: 0, discountPct: 0, bindingTarget: null, worksAtAsking: true,
      atAsking, atMax: atAsking,
      reason: "No targets given, so there is nothing to solve for. Set at least one.",
    };
  }

  // Already works. Never suggest bidding above asking to "use up" headroom.
  if (meets(atAsking, targets)) {
    return {
      askingPrice: deal.askingPrice, maxOffer: deal.askingPrice,
      openingOffer: roundDown(deal.askingPrice * (1 - OPENING_DISCOUNT)),
      discount: 0, discountPct: 0, bindingTarget: null, worksAtAsking: true,
      atAsking, atMax: atAsking,
    };
  }

  // If it fails even at a nominal price, no offer fixes it — the rent is the
  // problem, not the price, and saying so is more useful than a number.
  const floor = OFFER_STEP;
  if (!meets(metricsAt(deal, floor), targets)) {
    const failing = unmet(metricsAt(deal, floor), targets);
    return {
      askingPrice: deal.askingPrice, maxOffer: null, openingOffer: null,
      discount: 0, discountPct: 0,
      bindingTarget: failing[0] ?? null, worksAtAsking: false,
      atAsking, atMax: null,
      reason: "No price makes this work. At any purchase price the rent does not " +
              "support your targets — the issue is the income, not the price.",
    };
  }

  // Binary search for the highest price that still clears every target.
  //
  // Searched in units of OFFER_STEP rather than pounds. Searching in pounds and
  // rounding afterwards left the answer below the last price actually tested,
  // so "one step above the maximum" could still be a passing price — which made
  // the binding target come back empty and the explanation fall through to a
  // generic sentence. On the grid, maxOffer + OFFER_STEP is by construction the
  // first price that fails.
  let lo = Math.ceil(floor / OFFER_STEP);            // steps: known to meet
  let hi = Math.floor(deal.askingPrice / OFFER_STEP); // steps: known to fail
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (meets(metricsAt(deal, mid * OFFER_STEP), targets)) lo = mid; else hi = mid;
  }

  const maxOffer = lo * OFFER_STEP;
  const atMax = metricsAt(deal, maxOffer);
  // The target that fails first as the price rises is the one to negotiate on.
  const binding = unmet(metricsAt(deal, maxOffer + OFFER_STEP), targets)[0] ?? null;
  const discount = deal.askingPrice - maxOffer;

  return {
    askingPrice: deal.askingPrice,
    maxOffer,
    openingOffer: roundDown(maxOffer * (1 - OPENING_DISCOUNT)),
    discount,
    discountPct: Number(((discount / deal.askingPrice) * 100).toFixed(1)),
    bindingTarget: binding,
    worksAtAsking: false,
    atAsking,
    atMax,
  };
}

function roundDown(n: number): number {
  return Math.max(OFFER_STEP, Math.floor(n / OFFER_STEP) * OFFER_STEP);
}

/** The binding target, as a sentence a person would say. */
export function explainBinding(o: MaximumOffer, targets: OfferTargets): string {
  if (o.maxOffer === null) return o.reason ?? "No offer meets these targets.";
  if (o.worksAtAsking) return "The asking price already meets your targets.";

  const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
  const at = gbp(o.maxOffer);
  switch (o.bindingTarget) {
    case "minMonthlyCashflow":
      return `Above ${at} the deal drops below your ${gbp(targets.minMonthlyCashflow ?? 0)} a month cash flow target.`;
    case "minCashOnCash":
      return `Above ${at} the return falls below your ${targets.minCashOnCash}% cash-on-cash target.`;
    case "minNetYield":
      return `Above ${at} the net yield falls below your ${targets.minNetYield}% target.`;
    case "minScore":
      return `Above ${at} the PropertyVault Score drops below ${targets.minScore}.`;
    case "minCashflowAtPlus2":
      return `Above ${at} the deal no longer clears ${gbp(targets.minCashflowAtPlus2 ?? 0)} a month if rates rise two points.`;
    default:
      return `${at} is the most this deal supports against your targets.`;
  }
}
