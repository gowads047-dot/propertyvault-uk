// UK property tax — pure calculation functions
// Update the named constants when Budget rates change; everything derives from them

// ─── Income Tax (England, Wales, Northern Ireland 2024/25) ──────────────────
const PA_FULL = 12_570;
const PA_TAPER_START = 100_000;
const PA_TAPER_END = 125_140;
const BASIC_LIMIT = 50_270;   // top of basic rate band in GROSS terms (with a full PA)
const HIGHER_LIMIT = 125_140; // higher rate limit, measured on TAXABLE income (ITA 2007 s10)
const BASIC_BAND = BASIC_LIMIT - PA_FULL; // £37,700 — basic rate limit on TAXABLE income
const BASIC_RATE = 0.20;
const HIGHER_RATE = 0.40;
const ADDITIONAL_RATE = 0.45;

// ─── Property income rates (from 6 April 2027, England/Wales/NI) ─────────────
// Finance Act 2026 taxes property income 2pp above the main rates. The band
// thresholds are unchanged; property income stacks on top of other income, and
// the personal allowance is set against employment/trading/pension income first.
// Section 24 finance-cost relief moves to the property basic rate at the same time.
// Scotland is not covered — Holyrood may set its own property rates.
const PROPERTY_RATES_START = Date.UTC(2027, 3, 6); // 6 April 2027
const PROPERTY_BASIC_RATE = 0.22;
const PROPERTY_HIGHER_RATE = 0.42;
const PROPERTY_ADDITIONAL_RATE = 0.47;

/** True once the Finance Act 2026 property rates are in force. `on` defaults to today. */
export function propertyRatesApply(on: Date = new Date()): boolean {
  return on.getTime() >= PROPERTY_RATES_START;
}


/** Personal allowance, accounting for £100k–£125,140 taper */
export function personalAllowance(income: number): number {
  if (income <= PA_TAPER_START) return PA_FULL;
  if (income >= PA_TAPER_END) return 0;
  return Math.max(0, PA_FULL - Math.floor((income - PA_TAPER_START) / 2));
}

/** Total income tax on gross employment/self-employment/property income (England/Wales/NI) */
export function calcIncomeTax(grossIncome: number): number {
  if (grossIncome <= 0) return 0;
  // Bands apply to taxable income (gross less PA), not to gross income. Deriving the
  // basic band from BASIC_LIMIT - pa would widen it as the PA tapers away above £100k.
  const taxable = Math.max(0, grossIncome - personalAllowance(grossIncome));
  const inBasic = Math.min(taxable, BASIC_BAND);
  const inHigher = Math.max(0, Math.min(taxable, HIGHER_LIMIT) - BASIC_BAND);
  const inAdditional = Math.max(0, taxable - HIGHER_LIMIT);
  return Math.round(inBasic * BASIC_RATE + inHigher * HIGHER_RATE + inAdditional * ADDITIONAL_RATE);
}

/** Top marginal income tax rate given gross income */
export function marginalRate(grossIncome: number): number {
  if (grossIncome <= PA_FULL) return 0;
  if (grossIncome <= PA_TAPER_START) return grossIncome <= BASIC_LIMIT ? BASIC_RATE : HIGHER_RATE;
  if (grossIncome < PA_TAPER_END) return HIGHER_RATE * 1.5; // 60% effective (taper zone)
  if (grossIncome <= HIGHER_LIMIT) return HIGHER_RATE;
  return ADDITIONAL_RATE;
}

/**
 * Income tax split between other income and property income.
 *
 * Before 6 April 2027 both are taxed at the main rates, so this is just
 * calcIncomeTax() on the combined figure, apportioned.
 *
 * From 6 April 2027 (Finance Act 2026, England/Wales/NI):
 *   - the personal allowance is set against other income first, and only the
 *     unused remainder reduces property income
 *   - property income stacks on top of other income for band purposes
 *   - the property slice is taxed at 22% / 42% / 47%
 *
 * Note on attribution: `propertyTax` is the tax charged on the property slice at
 * its own band rates. Where property income pushes total income into the £100k–
 * £125,140 personal-allowance taper, the extra tax caused by losing the allowance
 * falls on other income and so lands in `otherTax`. For "what does this rental
 * profit actually cost me", use propertyIncomeTaxCost() below, which captures both.
 *
 * otherIncome:    employment, self-employment or pension income
 * propertyIncome: rental profit BEFORE any Section 24 finance-cost credit
 * on:             date to evaluate against; defaults to today
 */
export function calcTaxSplit(
  otherIncome: number,
  propertyIncome: number,
  on: Date = new Date(),
): { otherTax: number; propertyTax: number; total: number } {
  const other = Math.max(0, otherIncome);
  const property = Math.max(0, propertyIncome);
  const pa = personalAllowance(other + property);

  // Allowance is used against other income first; anything left reduces property income.
  const paAgainstOther = Math.min(pa, other);
  const paAgainstProperty = Math.max(0, pa - paAgainstOther);

  const taxableOther = Math.max(0, other - paAgainstOther);
  const taxableProperty = Math.max(0, property - paAgainstProperty);

  const bandRates = propertyRatesApply(on)
    ? [PROPERTY_BASIC_RATE, PROPERTY_HIGHER_RATE, PROPERTY_ADDITIONAL_RATE]
    : [BASIC_RATE, HIGHER_RATE, ADDITIONAL_RATE];

  // Other income fills the bands first.
  const otherInBasic = Math.min(taxableOther, BASIC_BAND);
  const otherInHigher = Math.max(0, Math.min(taxableOther, HIGHER_LIMIT) - BASIC_BAND);
  const otherInAdditional = Math.max(0, taxableOther - HIGHER_LIMIT);
  const otherTax =
    otherInBasic * BASIC_RATE + otherInHigher * HIGHER_RATE + otherInAdditional * ADDITIONAL_RATE;

  // Property income stacks on whatever band room is left.
  const roomInBasic = Math.max(0, BASIC_BAND - taxableOther);
  const roomInHigher = Math.max(0, HIGHER_LIMIT - BASIC_BAND - otherInHigher);
  const propInBasic = Math.min(taxableProperty, roomInBasic);
  const propInHigher = Math.min(Math.max(0, taxableProperty - roomInBasic), roomInHigher);
  const propInAdditional = Math.max(0, taxableProperty - roomInBasic - roomInHigher);
  const propertyTax =
    propInBasic * bandRates[0] + propInHigher * bandRates[1] + propInAdditional * bandRates[2];

  return {
    otherTax: Math.round(otherTax),
    propertyTax: Math.round(propertyTax),
    total: Math.round(otherTax + propertyTax),
  };
}

/**
 * The true marginal cost of a landlord's property income: total tax with it,
 * less total tax without it. This includes any personal-allowance taper the
 * property income triggers, which is what a landlord asking "what does my
 * rental profit cost me?" wants to see.
 *
 * Before 6 April 2027 this equals calcIncomeTax(other + property) - calcIncomeTax(other).
 * From 6 April 2027 the property slice is charged at 22% / 42% / 47%.
 */
export function propertyIncomeTaxCost(
  otherIncome: number,
  propertyIncome: number,
  on: Date = new Date(),
): number {
  const withProperty = calcTaxSplit(otherIncome, propertyIncome, on).total;
  const withoutProperty = calcTaxSplit(otherIncome, 0, on).total;
  return Math.max(0, withProperty - withoutProperty);
}

// ─── Corporation Tax (2024/25) ───────────────────────────────────────────────
const CT_SMALL_RATE = 0.19;
const CT_MAIN_RATE = 0.25;
const CT_SMALL_LIMIT = 50_000;
const CT_LARGE_LIMIT = 250_000;
// Marginal Relief Fraction = 3/200
const CT_MRF = 3 / 200;

/**
 * Corporation tax on property profits.
 * associatedCompanies: number of other associated group companies (0 for a standalone SPV).
 * The £50k/£250k limits are divided equally among the company + associates.
 */
export function calcCorpTax(profit: number, associatedCompanies = 0): number {
  if (profit <= 0) return 0;
  const divisor = 1 + Math.max(0, Math.round(associatedCompanies));
  const smallLimit = CT_SMALL_LIMIT / divisor;
  const largeLimit = CT_LARGE_LIMIT / divisor;

  if (profit <= smallLimit) return Math.round(profit * CT_SMALL_RATE);
  if (profit >= largeLimit) return Math.round(profit * CT_MAIN_RATE);

  // Marginal relief: CT = 25% × P − (3/200) × (U − P)
  // where U is the adjusted upper limit
  const tax = CT_MAIN_RATE * profit - CT_MRF * (largeLimit - profit);
  return Math.round(tax);
}

// ─── Dividend Tax (2024/25) ──────────────────────────────────────────────────
const DIV_ALLOWANCE = 500;
const DIV_BASIC_RATE = 0.0875;
const DIV_HIGHER_RATE = 0.3375;
const DIV_ADDITIONAL_RATE = 0.3935;

/**
 * Dividend tax on dividends extracted from a company.
 * otherIncome: non-dividend taxable income (salary, rental profit etc.) before PA deduction.
 * Dividends sit on top of other income in the tax bands.
 */
export function calcDividendTax(dividends: number, otherIncome: number): number {
  if (dividends <= 0) return 0;
  const totalIncome = otherIncome + dividends;
  const pa = personalAllowance(totalIncome);
  const taxableOther = Math.max(0, otherIncome - pa);

  const basicBandWidth = BASIC_BAND;                    // £37,700
  const higherBandWidth = HIGHER_LIMIT - BASIC_BAND;    // £87,440 (both measured on taxable income)

  const otherInBasic = Math.min(taxableOther, basicBandWidth);
  const otherInHigher = Math.min(Math.max(0, taxableOther - basicBandWidth), higherBandWidth);

  const remainingBasic = basicBandWidth - otherInBasic;
  const remainingHigher = higherBandWidth - otherInHigher;

  // Dividends in each band (including the £500 allowance portion)
  const divInBasic = Math.min(dividends, remainingBasic);
  const divInHigher = Math.min(Math.max(0, dividends - remainingBasic), remainingHigher);
  const divInAdditional = Math.max(0, dividends - remainingBasic - remainingHigher);

  // Allowance fills the lowest band first
  const allowanceInBasic = Math.min(DIV_ALLOWANCE, divInBasic);
  const allowanceInHigher = Math.min(DIV_ALLOWANCE - allowanceInBasic, divInHigher);
  const allowanceInAdditional = DIV_ALLOWANCE - allowanceInBasic - allowanceInHigher;

  const taxableBasic = Math.max(0, divInBasic - allowanceInBasic);
  const taxableHigher = Math.max(0, divInHigher - allowanceInHigher);
  const taxableAdditional = Math.max(0, divInAdditional - allowanceInAdditional);

  return Math.round(
    taxableBasic * DIV_BASIC_RATE +
    taxableHigher * DIV_HIGHER_RATE +
    taxableAdditional * DIV_ADDITIONAL_RATE,
  );
}

// ─── Section 24 Credit ───────────────────────────────────────────────────────

/**
 * Section 24 basic-rate tax credit (s274A ITTOIA 2005).
 * The credit is min(financeCosts, propertyProfit, excessOverPA) at the basic rate —
 * 20% now, and the property basic rate of 22% from 6 April 2027.
 *
 * financeCosts:    qualifying mortgage interest
 * propertyProfit:  net rental income BEFORE deducting mortgage interest
 * adjustedIncome:  total gross income subject to income tax (other income + propertyProfit)
 * paAmount:        personalAllowance(adjustedIncome) — pass result of personalAllowance()
 */
export function calcSection24Credit(
  financeCosts: number,
  propertyProfit: number,
  adjustedIncome: number,
  paAmount: number,
  on: Date = new Date(),
): number {
  if (financeCosts <= 0 || propertyProfit <= 0) return 0;
  const restricted = Math.min(
    financeCosts,
    Math.max(0, propertyProfit),
    Math.max(0, adjustedIncome - paAmount),
  );
  // Relief tracks the property basic rate from 2027-28 (22%), 20% before that.
  const reliefRate = propertyRatesApply(on) ? PROPERTY_BASIC_RATE : BASIC_RATE;
  return Math.round(restricted * reliefRate);
}

// ─── CGT — Residential Property (from October 2024) ─────────────────────────
const CGT_ALLOWANCE = 3_000;
const CGT_BASIC_RATE = 0.18;
const CGT_HIGHER_RATE = 0.24;

/**
 * CGT on residential property disposal.
 * otherIncome: non-gain income (salary, rental etc.) — used to determine remaining basic rate band.
 */
export function calcCGTResidential(gain: number, otherIncome: number): number {
  const taxableGain = Math.max(0, gain - CGT_ALLOWANCE);
  if (taxableGain <= 0) return 0;

  const pa = personalAllowance(otherIncome);
  const taxableOther = Math.max(0, otherIncome - pa);
  const basicBandWidth = BASIC_LIMIT - PA_FULL;
  const remainingBasic = Math.max(0, basicBandWidth - taxableOther);

  const inBasic = Math.min(taxableGain, remainingBasic);
  const inHigher = taxableGain - inBasic;

  return Math.round(inBasic * CGT_BASIC_RATE + inHigher * CGT_HIGHER_RATE);
}

// ─── SDLT — England (April 2025 rates) ──────────────────────────────────────
// Higher rates for additional dwellings apply only where the chargeable
// consideration is £40,000 OR MORE (FA 2003 Sch 4ZA para 3). Below that the
// transaction is not a higher-rates transaction and standard bands apply —
// which come to nothing under £125,000. The same floor gates the non-resident
// surcharge (FA 2003 Sch 9A).
const SDLT_SURCHARGE_FLOOR = 40_000;
const SDLT_NON_RES_SURCHARGE = 0.02;
const FTB_NIL_LIMIT = 300_000;
const FTB_UPPER_LIMIT = 500_000;

// [band_start, rate] — each band runs to the next band's start (or Infinity)
const SDLT_STANDARD: [number, number][] = [
  [0,           0.00],
  [125_000,     0.02],
  [250_000,     0.05],
  [925_000,     0.10],
  [1_500_000,   0.12],
];
const SDLT_ADDITIONAL: [number, number][] = [
  [0,           0.05],
  [125_000,     0.07],
  [250_000,     0.10],
  [925_000,     0.15],
  [1_500_000,   0.17],
];

/** One slice of a purchase price and the SDLT charged on it. */
export type SDLTBand = { from: number; to: number; rate: number; tax: number };

function bandsFor(price: number, bands: [number, number][], extraRate: number): SDLTBand[] {
  const out: SDLTBand[] = [];
  for (let i = 0; i < bands.length; i++) {
    const [from, rate] = bands[i];
    const to = i + 1 < bands.length ? bands[i + 1][0] : Infinity;
    if (price <= from) break;
    const upper = Math.min(price, to);
    const effective = rate + extraRate;
    out.push({ from, to: upper, rate: effective, tax: (upper - from) * effective });
  }
  return out;
}

/**
 * SDLT on a residential purchase in England, broken down band by band.
 * calcSDLT() is the total of this; use this when you need to show the workings.
 *
 * isAdditional:  buying an additional dwelling (5% surcharge from Oct 2024)
 * isFTB:         first-time buyer (0% to £300k, 5% £300k–£500k; relief lost above £500k)
 * isNonResident: non-UK resident (+2% on every band)
 */
export function sdltBreakdown(
  price: number,
  isAdditional = false,
  isFTB = false,
  isNonResident = false,
): { bands: SDLTBand[]; total: number } {
  if (price <= 0) return { bands: [], total: 0 };

  // Under £40k this is not a higher-rates transaction, so neither surcharge bites
  // and the standard bands apply (nil below £125k).
  const surcharged = price >= SDLT_SURCHARGE_FLOOR;
  const higherRates = isAdditional && surcharged;
  const extraRate = isNonResident && surcharged ? SDLT_NON_RES_SURCHARGE : 0;

  const bands =
    isFTB && !higherRates && price <= FTB_UPPER_LIMIT
      ? bandsFor(price, [[0, 0], [FTB_NIL_LIMIT, 0.05]], extraRate)
      : bandsFor(price, higherRates ? SDLT_ADDITIONAL : SDLT_STANDARD, extraRate);

  return { bands, total: Math.round(bands.reduce((sum, b) => sum + b.tax, 0)) };
}

/** Total SDLT on a residential purchase (England). See sdltBreakdown for the workings. */
export function calcSDLT(
  price: number,
  isAdditional = false,
  isFTB = false,
  isNonResident = false,
): number {
  return sdltBreakdown(price, isAdditional, isFTB, isNonResident).total;
}
