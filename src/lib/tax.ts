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
 * The credit is 20% × min(financeCosts, propertyProfit, excessOverPA).
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
): number {
  if (financeCosts <= 0 || propertyProfit <= 0) return 0;
  const restricted = Math.min(
    financeCosts,
    Math.max(0, propertyProfit),
    Math.max(0, adjustedIncome - paAmount),
  );
  return Math.round(restricted * BASIC_RATE);
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
const SDLT_THRESHOLD = 40_000;
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

function sdltOnBands(price: number, bands: [number, number][]): number {
  let tax = 0;
  for (let i = 0; i < bands.length; i++) {
    const [from, rate] = bands[i];
    const to = i + 1 < bands.length ? bands[i + 1][0] : Infinity;
    if (price <= from) break;
    tax += (Math.min(price, to) - from) * rate;
  }
  return tax;
}

/**
 * SDLT on residential purchase (England).
 * isAdditional: buying an additional dwelling (5% surcharge from Oct 2024).
 * isFTB:        first-time buyer (0% to £300k, 5% £300k–£500k; relief lost above £500k).
 * isNonResident: non-UK resident (+2% surcharge on top of other rates).
 */
export function calcSDLT(
  price: number,
  isAdditional = false,
  isFTB = false,
  isNonResident = false,
): number {
  if (price <= SDLT_THRESHOLD) return 0;

  let tax: number;

  if (isFTB && !isAdditional && price <= FTB_UPPER_LIMIT) {
    tax = price <= FTB_NIL_LIMIT ? 0 : (price - FTB_NIL_LIMIT) * 0.05;
  } else {
    tax = sdltOnBands(price, isAdditional ? SDLT_ADDITIONAL : SDLT_STANDARD);
  }

  if (isNonResident) tax += price * SDLT_NON_RES_SURCHARGE;

  return Math.round(tax);
}
