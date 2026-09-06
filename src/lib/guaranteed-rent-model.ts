/**
 * The one set of numbers behind every guaranteed-rent comparison.
 *
 * /guaranteed-rent and the GRQuoteWidget each carried their own copy of the
 * same illustration, and they disagreed in six ways:
 *
 *   - The table row said "Void periods (3 weeks)" and the assumption below it
 *     said "industry average 2.7 weeks/year". Both pointed at £692, which is
 *     three weeks of £12,000 a year, so the row was right and the note wrong.
 *   - The column was headed "Self-Managing" and deducted "Letting agent fees
 *     (10%) −£1,200". Self-managing is the case where you do not pay those.
 *   - The tenant-find fee was described as "one-time £500 amortised over
 *     typical 1.5yr tenancy" and then deducted at the full £500 every year.
 *   - The widget computed void loss as (monthlyRent / 4) * weeks, treating a
 *     month as exactly four weeks. That overstates a three-week void by 8.3%
 *     — £750 against the correct £692 — so the widget and the page printed
 *     different answers for the same property.
 *   - £600 maintenance was attributed to "RICS estimate". Nothing in this
 *     repo evidences that, and putting a professional body's name on a
 *     number invites the reader to trust it more than they should.
 *   - The compliance line read "gas/EICON/EPC/EICR" — EICON is not a thing,
 *     and EICR was listed twice.
 *
 * ── These are assumptions, not market data ─────────────────────────────────
 *
 * Every figure below is an illustration chosen to show the shape of the
 * arithmetic. None of it is surveyed, sourced or averaged from anything, and
 * the copy must not describe it as an industry average. A landlord's real
 * voids, maintenance and compliance costs vary enormously, which is the
 * argument for showing the working rather than a single headline.
 *
 * NEEDS CONFIRMATION FROM THE BUSINESS: offerPct, maintenance, compliance,
 * tenantFindFee and tenancyYears all move the conclusion, and only somebody
 * who has actually run these leases can say whether they are right.
 */

export type GuaranteedRentAssumptions = {
  /** Monthly open-market rent for the illustrated property. */
  monthlyMarketRent: number;
  /** Guaranteed rent as a share of market rent. */
  offerPct: number;
  /** Weeks a year the property sits empty when you let it yourself. */
  voidWeeks: number;
  /** Annual repairs and maintenance. */
  maintenance: number;
  /** Annual gas safety, EICR and EPC, spread across their renewal cycles. */
  compliance: number;
  /** One-off cost of finding a tenant. */
  tenantFindFee: number;
  /** Typical tenancy length, over which the tenant-find fee is spread. */
  tenancyYears: number;
  /** Letting agent management fee, as a share of rent collected. */
  agentPct: number;
};

export const DEFAULT_ASSUMPTIONS: GuaranteedRentAssumptions = {
  monthlyMarketRent: 1000,
  offerPct: 0.85,
  voidWeeks: 3,
  maintenance: 600,
  compliance: 300,
  tenantFindFee: 500,
  tenancyYears: 1.5,
  agentPct: 0.10,
};

export type Comparison = {
  annualMarketRent: number;
  annualGuaranteedRent: number;
  /** Lost rent while empty. A year is 52 weeks, not twelve four-week months. */
  voidCost: number;
  maintenance: number;
  compliance: number;
  /** The one-off fee spread over the tenancy, not charged again every year. */
  tenantFindPerYear: number;
  /** Only paid in the agent-managed case. */
  agentFees: number;
  /** Net if you let and manage it yourself: no agent fee, but your own time. */
  selfManagingNet: number;
  /** Net with an agent doing the letting and management. */
  lettingAgentNet: number;
  /** Guaranteed rent minus each alternative. Negative means you earn less. */
  vsSelfManaging: number;
  vsLettingAgent: number;
};

/**
 * Work the comparison. Nothing is rounded here — the caller rounds for
 * display, so the columns always add up to the totals shown beside them.
 */
export function compare(a: GuaranteedRentAssumptions = DEFAULT_ASSUMPTIONS): Comparison {
  const annualMarketRent = a.monthlyMarketRent * 12;
  const annualGuaranteedRent = a.monthlyMarketRent * a.offerPct * 12;

  const voidCost = (annualMarketRent / 52) * a.voidWeeks;
  const tenantFindPerYear = a.tenantFindFee / a.tenancyYears;
  const agentFees = annualMarketRent * a.agentPct;

  const shared = voidCost + a.maintenance + a.compliance + tenantFindPerYear;
  const selfManagingNet = annualMarketRent - shared;
  const lettingAgentNet = selfManagingNet - agentFees;

  return {
    annualMarketRent,
    annualGuaranteedRent,
    voidCost,
    maintenance: a.maintenance,
    compliance: a.compliance,
    tenantFindPerYear,
    agentFees,
    selfManagingNet,
    lettingAgentNet,
    vsSelfManaging: annualGuaranteedRent - selfManagingNet,
    vsLettingAgent: annualGuaranteedRent - lettingAgentNet,
  };
}

/** "£1,234". Whole pounds — pennies in an illustration imply precision. */
export function money(n: number): string {
  const rounded = Math.round(Math.abs(n));
  return (n < 0 ? "−£" : "£") + rounded.toLocaleString("en-GB");
}

/**
 * Cities where the widget can show an instant estimate.
 *
 * Deliberately a different list from `guaranteedRentCities` in site.ts, which
 * is where the service operates. The widget holds indicative market rents for
 * three of the six, and the honest response for the other three is to say so
 * and take the enquiry — not to interpolate a number for a city nobody has
 * priced. Any city missing here still gets a quote, just not instantly.
 */
export const ESTIMATOR_CITIES = ["birmingham", "nottingham", "derby"] as const;
