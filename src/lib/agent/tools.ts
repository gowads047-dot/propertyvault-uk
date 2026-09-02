import { calcSDLT, sdltBreakdown, calcSection24Credit, calcCGTResidential, personalAllowance } from "../tax";
import { grossYield, netYield, cashOnCash, monthlyInterestOnly, monthlyRepayment } from "../finance";
import { scoreDeal } from "../deal-score";
import { calculateMaximumOffer, explainBinding, type OfferTargets } from "../max-offer";
import {
  coordsFor, fetchConstraints, constraintEvidence, notableConstraints,
} from "./constraints";
import type { Evidence } from "../property";
import { calculated, verified, assumed, missing } from "../property";

/**
 * The tools the agent may call.
 *
 * One rule governs this file: the model never does arithmetic. It chooses a
 * tool and reads the result. Every number a user sees comes from lib/finance,
 * lib/tax or lib/deal-score — the same tested code behind the public
 * calculators — so a figure in a conversation can be reproduced on the site.
 *
 * ── Why the tools are coarse ───────────────────────────────────────────────
 *
 * The obvious design is one tool per function: twenty-eight thin tools. It is
 * worse. Chaining them means the model carries a number from one call to the
 * next, and a transcription slip there is exactly the failure this whole
 * architecture exists to prevent. analyse_deal therefore does the entire
 * calculation in one call and returns everything at once. The model picks the
 * tool; it never becomes the glue between two of them.
 *
 * Every handler returns evidence alongside its numbers, so provenance travels
 * with the value rather than being reconstructed later.
 */

export interface ToolDef {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}

export interface ToolResult {
  /** What the model reads. */
  data: Record<string, unknown>;
  /** Where each figure came from. Rendered as the trust chips. */
  evidence: Evidence[];
  /** Which component the UI should draw, if any. */
  render?: "score" | "sdlt" | "area" | "stress" | "tax" | "offer" | "constraints";
}

const num = { type: "number" as const };
const bool = { type: "boolean" as const };

/** Running costs as a share of rent when the user gives no figure. */
export const DEFAULT_COST_RATIO = 0.28;
/** Legals and survey. An assumption, surfaced as one wherever it appears. */
export const BUYING_EXTRAS = 2_100;

// ── analyse_deal ───────────────────────────────────────────────────────────

export interface AnalyseDealArgs {
  purchasePrice: number;
  monthlyRent: number;
  depositPct?: number;
  mortgageRate?: number;
  mortgageType?: "interest" | "repayment";
  mortgageTermYears?: number;
  runningCostsMonthly?: number;
  refurbCost?: number;
  afterRefurbValue?: number;
  isAdditionalProperty?: boolean;
  areaMedianSoldPrice?: number;
}

export function analyseDeal(a: AnalyseDealArgs) {
  const price = a.purchasePrice;
  const pcm = a.monthlyRent;
  const depositPct = a.depositPct ?? 25;
  const rate = a.mortgageRate ?? 5.5;
  const termYears = a.mortgageTermYears ?? 25;

  const loan = price * (1 - depositPct / 100);
  const deposit = price - loan;
  const mortgageMonthly = a.mortgageType === "repayment"
    ? monthlyRepayment(loan, rate, termYears)
    : monthlyInterestOnly(loan, rate);

  const costsGiven = a.runningCostsMonthly != null;
  const running = costsGiven ? a.runningCostsMonthly! : pcm * DEFAULT_COST_RATIO;

  const cashflow = pcm - running - mortgageMonthly;
  const annualRent = pcm * 12;
  const gross = grossYield(annualRent, price);
  const net = netYield(annualRent, (running + mortgageMonthly) * 12, price);

  const sdlt = calcSDLT(price, a.isAdditionalProperty ?? true);
  const cashIn = deposit + sdlt + BUYING_EXTRAS + (a.refurbCost ?? 0);
  const coc = cashOnCash(cashflow * 12, cashIn);

  const at = (r: number) => pcm - running - (a.mortgageType === "repayment"
    ? monthlyRepayment(loan, r, termYears)
    : monthlyInterestOnly(loan, r));

  const equityGain = a.afterRefurbValue != null
    ? a.afterRefurbValue - price - (a.refurbCost ?? 0)
    : undefined;

  const score = scoreDeal({
    netYield: net,
    monthlyCashflow: cashflow,
    cashOnCash: coc,
    cashflowAtPlus2: at(rate + 2),
    purchasePrice: price,
    areaMedianSoldPrice: a.areaMedianSoldPrice,
    equityGain,
  });

  const evidence: Evidence[] = [
    calculated("gross_yield", gross, "lib/finance.ts", "annual rent / price"),
    calculated("net_yield", net, "lib/finance.ts", "after running costs and finance"),
    calculated("monthly_cashflow", cashflow, "lib/finance.ts"),
    calculated("cash_on_cash", coc, "lib/finance.ts", "annual net / cash invested"),
    calculated("stamp_duty", sdlt, "lib/tax.ts", "FA 2003 bands"),
    calculated("cash_required", cashIn, "lib/finance.ts", "deposit + SDLT + costs"),
    calculated("pv_score", score.total, "lib/deal-score.ts", `${score.componentsScored} of 6 components`),
    costsGiven
      ? calculated("running_costs", running, "user figure")
      : assumed("running_costs", running, `${Math.round(DEFAULT_COST_RATIO * 100)}% of rent`),
    a.areaMedianSoldPrice == null
      ? missing("area_median_sold", "no sold comparables looked up for this postcode")
      : calculated("price_vs_area", (price / a.areaMedianSoldPrice - 1) * 100, "lib/deal-score.ts"),
  ];

  return {
    data: {
      purchasePrice: price,
      monthlyRent: pcm,
      deposit: Math.round(deposit),
      loan: Math.round(loan),
      mortgageMonthly: Math.round(mortgageMonthly),
      runningCostsMonthly: Math.round(running),
      runningCostsAssumed: !costsGiven,
      monthlyCashflow: Math.round(cashflow),
      annualCashflow: Math.round(cashflow * 12),
      grossYieldPct: Number(gross.toFixed(2)),
      netYieldPct: Number(net.toFixed(2)),
      cashOnCashPct: Number(coc.toFixed(2)),
      stampDuty: sdlt,
      cashRequired: Math.round(cashIn),
      cashflowAtPlus1: Math.round(at(rate + 1)),
      cashflowAtPlus2: Math.round(at(rate + 2)),
      pvScore: score.total,
      band: score.band,
      scoreComponents: score.components,
      scoreExcluded: score.excluded,
    },
    evidence,
    render: "score" as const,
  };
}

// ── stamp duty ─────────────────────────────────────────────────────────────

export function stampDuty(a: {
  purchasePrice: number; isAdditionalProperty?: boolean;
  isFirstTimeBuyer?: boolean; isNonUKResident?: boolean;
}): ToolResult {
  const { bands, total } = sdltBreakdown(
    a.purchasePrice, a.isAdditionalProperty ?? false, a.isFirstTimeBuyer ?? false, a.isNonUKResident ?? false,
  );
  return {
    data: {
      total,
      asHome: calcSDLT(a.purchasePrice, false),
      bands: bands.map(b => ({
        from: b.from, to: b.to === Infinity ? null : b.to,
        ratePct: Number((b.rate * 100).toFixed(2)), tax: Math.round(b.tax),
      })),
    },
    evidence: [calculated("stamp_duty", total, "lib/tax.ts", "FA 2003 Sch 4ZA / 9A bands")],
    render: "sdlt",
  };
}

// ── stress test ────────────────────────────────────────────────────────────

export function stressTest(a: {
  purchasePrice: number; monthlyRent: number; depositPct?: number;
  mortgageRate?: number; runningCostsMonthly?: number;
}): ToolResult {
  const loan = a.purchasePrice * (1 - (a.depositPct ?? 25) / 100);
  const base = a.mortgageRate ?? 5.5;
  const running = a.runningCostsMonthly ?? a.monthlyRent * DEFAULT_COST_RATIO;
  const at = (r: number) => Math.round(a.monthlyRent - running - monthlyInterestOnly(loan, r));

  const rows = [0, 1, 2, 3].map(d => ({ ratePct: base + d, monthlyCashflow: at(base + d) }));
  const breakEven = rows.find(r => r.monthlyCashflow < 0);

  return {
    data: {
      rows,
      // Only meaningful if it turns negative inside the range we modelled.
      turnsNegativeAtPct: breakEven?.ratePct ?? null,
      survivesPlus2: at(base + 2) >= 0,
    },
    evidence: [calculated("stress_test", at(base + 2), "lib/finance.ts", "interest-only at +2%")],
    render: "stress",
  };
}

// ── tax ────────────────────────────────────────────────────────────────────

export function section24(a: {
  mortgageInterest: number; rentalProfitBeforeInterest: number; otherIncome: number;
}): ToolResult {
  const adjusted = a.otherIncome + a.rentalProfitBeforeInterest;
  const credit = calcSection24Credit(
    a.mortgageInterest, a.rentalProfitBeforeInterest, adjusted, personalAllowance(adjusted),
  );
  return {
    data: {
      mortgageInterest: a.mortgageInterest,
      taxCredit: credit,
      note: "Interest is not deducted from profit; relief is a basic-rate credit.",
    },
    evidence: [calculated("section_24_credit", credit, "lib/tax.ts")],
    render: "tax",
  };
}

export function capitalGains(a: { gain: number; otherIncome: number }): ToolResult {
  const tax = calcCGTResidential(a.gain, a.otherIncome);
  return {
    data: { gain: a.gain, tax, netOfTax: a.gain - tax },
    evidence: [calculated("cgt", tax, "lib/tax.ts", "residential rates, £3,000 exempt amount")],
    render: "tax",
  };
}

// ── area ───────────────────────────────────────────────────────────────────

/** Injected so the loop can be tested without a network. */
export type AreaFetcher = (postcode: string) => Promise<{
  region?: string;
  soldPrices?: { date: string; price: number; propertyType?: string }[];
  crimeLevel?: string;
} | null>;

export async function lookupArea(
  a: { postcode: string },
  fetchArea: AreaFetcher,
): Promise<ToolResult> {
  const area = await fetchArea(a.postcode);
  if (!area) {
    return {
      data: { found: false, postcode: a.postcode },
      evidence: [missing("area_median_sold", `no data returned for ${a.postcode}`)],
      render: "area",
    };
  }

  const prices = (area.soldPrices ?? []).map(s => s.price).filter(n => n > 0).sort((x, y) => x - y);
  const median = prices.length
    ? prices.length % 2 ? prices[(prices.length - 1) / 2]
      : (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : null;

  return {
    data: {
      found: true,
      postcode: a.postcode,
      region: area.region ?? null,
      soldCount: prices.length,
      medianSoldPrice: median,
      recentSales: (area.soldPrices ?? []).slice(0, 8),
      crimeLevel: area.crimeLevel ?? null,
    },
    evidence: median != null
      ? [verified("area_median_sold", median, "HM Land Registry Price Paid", {
          method: `median of ${prices.length} recent sales in ${a.postcode}`,
        })]
      : [missing("area_median_sold", `no sold records for ${a.postcode}`)],
    render: "area",
  };
}

// ── maximum offer ──────────────────────────────────────────────────────────

export function maximumOffer(a: {
  askingPrice: number; monthlyRent: number; depositPct?: number; mortgageRate?: number;
  runningCostsMonthly?: number; areaMedianSoldPrice?: number;
  minMonthlyCashflow?: number; minCashOnCash?: number; minNetYield?: number;
  minScore?: number; minCashflowAtPlus2?: number;
}): ToolResult {
  const targets: OfferTargets = {
    minMonthlyCashflow: a.minMonthlyCashflow,
    minCashOnCash: a.minCashOnCash,
    minNetYield: a.minNetYield,
    minScore: a.minScore,
    minCashflowAtPlus2: a.minCashflowAtPlus2,
  };
  const o = calculateMaximumOffer(a, targets);

  return {
    data: { ...o, explanation: explainBinding(o, targets) },
    evidence: o.maxOffer == null
      ? [missing("maximum_offer", o.reason ?? "no price meets these targets")]
      : [calculated("maximum_offer", o.maxOffer, "lib/max-offer.ts",
          "highest price meeting the buyer’s own targets")],
    render: "offer",
  };
}

// ── planning constraints ─────────────────────────────────────────────

export async function lookupConstraints(a: { postcode: string }): Promise<ToolResult> {
  const coords = await coordsFor(a.postcode);
  if (!coords) {
    return {
      data: { found: false, postcode: a.postcode, reason: "not a recognised UK postcode" },
      evidence: [missing("planning_constraints", "could not resolve " + a.postcode)],
      render: "constraints",
    };
  }

  const results = await fetchConstraints(coords.lat, coords.lon);
  const notable = notableConstraints(results);

  return {
    data: {
      found: true,
      postcode: a.postcode,
      // Named separately from "none found", because the register does not cover
      // every authority and absence is not confirmation.
      constraintsFound: notable.map(r => ({
        label: r.label,
        matters: r.matters,
        entries: r.hits.map(h => ({ name: h.name ?? h.reference, ...h.detail })),
      })),
      checkedWithNoRecord: results.filter(r => !r.unavailable && r.hits.length === 0).map(r => r.label),
      couldNotCheck: results.filter(r => r.unavailable).map(r => r.label),
      coverageNote:
        "planning.data.gov.uk does not cover every local authority. A dataset with no record " +
        "here is not confirmation that nothing applies.",
    },
    evidence: constraintEvidence(results),
    render: "constraints",
  };
}

// ── the definitions the model sees ─────────────────────────────────────────

export const TOOL_DEFS: ToolDef[] = [
  {
    name: "analyse_deal",
    description:
      "Run the full PropertyVault analysis on a residential investment: yields, cash flow, " +
      "cash required, stamp duty, stress test and the PropertyVault Score out of 100. " +
      "Use this whenever the user gives a price and a rent — it does the whole calculation " +
      "in one call. Never work any of these figures out yourself.",
    input_schema: {
      type: "object",
      properties: {
        purchasePrice: { ...num, description: "Asking or offer price in GBP." },
        monthlyRent: { ...num, description: "Expected monthly rent in GBP. Ask the user if unknown — do not guess." },
        depositPct: { ...num, description: "Deposit as a percentage. Defaults to 25." },
        mortgageRate: { ...num, description: "Annual interest rate percent. Defaults to 5.5." },
        mortgageType: { type: "string", enum: ["interest", "repayment"], description: "Defaults to interest-only." },
        mortgageTermYears: num,
        runningCostsMonthly: { ...num, description: "If omitted, 28% of rent is assumed and flagged as an assumption." },
        refurbCost: num,
        afterRefurbValue: { ...num, description: "Only for BRRR or a flip." },
        isAdditionalProperty: { ...bool, description: "True for a buy-to-let. Defaults to true." },
        areaMedianSoldPrice: { ...num, description: "From lookup_area. Enables the Value component of the score." },
      },
      required: ["purchasePrice", "monthlyRent"],
    },
  },
  {
    name: "calculate_stamp_duty",
    description: "Stamp duty land tax for England and Northern Ireland, band by band, including the " +
      "5% additional-property surcharge, first-time buyer relief and the 2% non-resident surcharge.",
    input_schema: {
      type: "object",
      properties: {
        purchasePrice: num,
        isAdditionalProperty: bool,
        isFirstTimeBuyer: bool,
        isNonUKResident: bool,
      },
      required: ["purchasePrice"],
    },
  },
  {
    name: "stress_test",
    description: "Monthly cash flow at the current rate and at +1, +2 and +3 percentage points. " +
      "Use this whenever the user asks what happens if rates rise, or before recommending a purchase.",
    input_schema: {
      type: "object",
      properties: {
        purchasePrice: num, monthlyRent: num, depositPct: num,
        mortgageRate: num, runningCostsMonthly: num,
      },
      required: ["purchasePrice", "monthlyRent"],
    },
  },
  {
    name: "lookup_area",
    description: "Recent sold prices from HM Land Registry for a UK postcode, plus region and crime level. " +
      "Call this before analyse_deal when a postcode is known — the median sold price lets the score " +
      "judge whether the asking price is reasonable.",
    input_schema: {
      type: "object",
      properties: { postcode: { type: "string", description: "A UK postcode, e.g. NG7 1AA." } },
      required: ["postcode"],
    },
  },
  {
    name: "lookup_constraints",
    description:
      "Official planning constraints on a property from planning.data.gov.uk: flood risk zone, " +
      "Article 4 directions, conservation area, listed building, tree preservation and green belt. " +
      "Call this whenever a postcode is known — an Article 4 direction is what stops an HMO " +
      "conversion, and a flood zone changes insurance and lending. A dataset with no record is " +
      "NOT confirmation that nothing applies; say so rather than reporting the property as clear.",
    input_schema: {
      type: "object",
      properties: { postcode: { type: "string", description: "A UK postcode, e.g. NG7 1AA." } },
      required: ["postcode"],
    },
  },
  {
    name: "maximum_offer",
    description:
      "The most the buyer should pay for this property given their own targets — solved backwards " +
      "from what they need rather than forwards from the asking price. Use this whenever someone " +
      "asks what to offer, whether a price is too high, or how far they should negotiate. " +
      "Ask for at least one target first if none is known; do not invent one.",
    input_schema: {
      type: "object",
      properties: {
        askingPrice: num, monthlyRent: num, depositPct: num, mortgageRate: num,
        runningCostsMonthly: num,
        areaMedianSoldPrice: { ...num, description: "From lookup_area." },
        minMonthlyCashflow: { ...num, description: "Pounds per month the buyer needs after everything." },
        minCashOnCash: { ...num, description: "Percent return on cash invested." },
        minNetYield: num,
        minScore: { ...num, description: "PropertyVault Score out of 100." },
        minCashflowAtPlus2: { ...num, description: "Cash flow that must survive a two point rate rise." },
      },
      required: ["askingPrice", "monthlyRent"],
    },
  },
  {
    name: "calculate_section_24",
    description: "The Section 24 basic-rate credit on mortgage interest, and what it costs a higher-rate landlord.",
    input_schema: {
      type: "object",
      properties: { mortgageInterest: num, rentalProfitBeforeInterest: num, otherIncome: num },
      required: ["mortgageInterest", "rentalProfitBeforeInterest", "otherIncome"],
    },
  },
  {
    name: "calculate_capital_gains",
    description: "Capital gains tax on selling a residential rental property.",
    input_schema: {
      type: "object",
      properties: { gain: num, otherIncome: num },
      required: ["gain", "otherIncome"],
    },
  },
];

/** Dispatch. Unknown names are an error rather than a silent no-op. */
export async function runTool(
  name: string,
  input: Record<string, unknown>,
  deps: { fetchArea: AreaFetcher },
): Promise<ToolResult> {
  switch (name) {
    case "analyse_deal": return analyseDeal(input as unknown as AnalyseDealArgs);
    case "calculate_stamp_duty": return stampDuty(input as never);
    case "stress_test": return stressTest(input as never);
    case "lookup_area": return lookupArea(input as never, deps.fetchArea);
    case "lookup_constraints": return lookupConstraints(input as never);
    case "maximum_offer": return maximumOffer(input as never);
    case "calculate_section_24": return section24(input as never);
    case "calculate_capital_gains": return capitalGains(input as never);
    default: throw new Error(`Unknown tool: ${name}`);
  }
}
