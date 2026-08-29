import { calcSDLT, calcSection24Credit, calcCGTResidential, personalAllowance } from "./tax";
import { grossYield, netYield, cashOnCash, monthlyInterestOnly } from "./finance";
import { scoreDeal } from "./deal-score";

/**
 * Thirty days of Reels, generated from the calculators.
 *
 * Two constraints shaped this file.
 *
 * The first is the standing rule: no invented numbers. Every figure below is
 * computed by lib/tax.ts, lib/finance.ts and lib/deal-score.ts — the same code
 * behind the public calculators — so any viewer can reproduce it. Nothing here
 * is a market statistic, a prediction or a claim about results, and there are
 * tests that fail the build if a caption drifts into one.
 *
 * The second is variety. Thirty near-identical videos read as a bot and get
 * suppressed, so the calendar rotates six formats and never runs the same one
 * twice in a row. That constraint is enforced by a test rather than by anyone
 * remembering it.
 *
 * The niche is deliberately narrow — UK landlords and the economics of letting
 * — because the recommendation algorithm rewards a single subject and punishes
 * a mixed feed.
 */

export type ReelFormat =
  | "autopsy"      // A headline yield taken apart until the real figure appears
  | "the-bill"     // What a void actually costs, as a running total
  | "the-gap"      // Gross yield versus the yield you keep
  | "the-stress"   // What +2% on the rate does
  | "the-tax"      // Section 24, CGT, stamp duty
  | "the-cash";    // What completing actually requires

/** One beat of the video. The number moves; the words hold still. */
export interface ReelScene {
  /** Small label above the number. */
  kicker: string;
  /** Value counted to, and how it is rendered. */
  from: number;
  to: number;
  render: "gbp" | "pct" | "int" | "gbp-neg";
  /** Seconds this beat holds. */
  seconds: number;
  /** Line under the number. */
  sub: string;
  /** Optional second line. */
  foot?: string;
  /** Bad news is not drawn in the same gold as good news. */
  tone?: "warn" | "bad";
}

export interface ReelSpec {
  /** 1-30. Also the posting order. */
  day: number;
  id: string;
  format: ReelFormat;
  scenes: ReelScene[];
  caption: string;
  hashtags: string[];
}

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

/** Running costs as a share of rent. An assumption, labelled wherever it shows. */
const COST_RATIO = 0.28;
const BUYING_EXTRAS = 2_100;

/**
 * Hashtags are a categorisation signal now rather than a discovery hack, so
 * these are niche and topical rather than mega-tags, and each format gets its
 * own set so the feed does not look like one repeated block.
 */
const BASE_TAGS = ["ukproperty", "buytolet", "uklandlord", "propertyinvestmentuk"];
const FORMAT_TAGS: Record<ReelFormat, string[]> = {
  autopsy: ["dealanalysis", "rentalyield", "propertynumbers", "btlinvesting"],
  "the-bill": ["landlordlife", "voidperiod", "lettingagent", "rentalproperty"],
  "the-gap": ["rentalyield", "netyield", "propertyreturns", "cashflowinvesting"],
  "the-stress": ["mortgagerates", "btlmortgage", "stresstest", "propertyfinance"],
  "the-tax": ["section24", "landlordtax", "stampduty", "capitalgainstax"],
  "the-cash": ["deposit", "firstinvestment", "propertycosts", "stampduty"],
};

const tagsFor = (f: ReelFormat) => [...BASE_TAGS, ...FORMAT_TAGS[f]];

/** A worked example. Round, illustrative, and always labelled as such. */
interface Deal {
  price: number;
  pcm: number;
  ltv: number;
  rate: number;
}

function model(d: Deal) {
  const annualRent = d.pcm * 12;
  const running = d.pcm * COST_RATIO;
  const loan = d.price * d.ltv;
  const interest = monthlyInterestOnly(loan, d.rate);
  const cf = (r: number) => d.pcm - running - monthlyInterestOnly(loan, r);
  const cashIn = d.price * (1 - d.ltv) + calcSDLT(d.price, true) + BUYING_EXTRAS;
  const net = netYield(annualRent, (running + interest) * 12, d.price);
  const score = scoreDeal({
    netYield: net,
    monthlyCashflow: cf(d.rate),
    cashOnCash: cashOnCash(cf(d.rate) * 12, cashIn),
    cashflowAtPlus2: cf(d.rate + 2),
    purchasePrice: d.price,
  });
  return {
    annualRent, running, loan, interest, cashIn, net, score,
    gross: grossYield(annualRent, d.price),
    cashflow: cf(d.rate),
    atPlus2: cf(d.rate + 2),
  };
}

// ── The episodes ───────────────────────────────────────────────────────────
// Different price points on purpose: the same lesson at £95k and £400k is two
// different videos, and between them they cover most of who is watching.

const AUTOPSY_DEALS: Deal[] = [
  { price: 120_000, pcm: 800, ltv: 0.75, rate: 5.5 },
  { price: 180_000, pcm: 950, ltv: 0.75, rate: 5.5 },
  { price: 95_000, pcm: 675, ltv: 0.75, rate: 5.5 },
  { price: 250_000, pcm: 1_250, ltv: 0.75, rate: 5.5 },
  { price: 400_000, pcm: 1_800, ltv: 0.75, rate: 5.5 },
];

const GAP_DEALS: Deal[] = [
  { price: 150_000, pcm: 900, ltv: 0.75, rate: 5.5 },
  { price: 220_000, pcm: 1_100, ltv: 0.75, rate: 5.5 },
  { price: 110_000, pcm: 750, ltv: 0.75, rate: 5.5 },
];

const STRESS_DEALS: Deal[] = [
  { price: 160_000, pcm: 875, ltv: 0.75, rate: 5.5 },
  { price: 200_000, pcm: 1_050, ltv: 0.75, rate: 5.5 },
  { price: 130_000, pcm: 800, ltv: 0.75, rate: 5.5 },
];

const CASH_PRICES = [120_000, 180_000, 250_000, 95_000];

/** Void scenarios: rent lost plus the bills that do not stop. */
const VOID_CASES = [
  { pcm: 850, weeks: 4, councilTax: 150, utilities: 80, clean: 180, findFee: 0 },
  { pcm: 950, weeks: 8, councilTax: 160, utilities: 90, clean: 200, findFee: 950 },
  { pcm: 725, weeks: 6, councilTax: 140, utilities: 75, clean: 150, findFee: 725 },
  { pcm: 1_100, weeks: 12, councilTax: 180, utilities: 100, clean: 250, findFee: 1_100 },
];

const AUTOPSY_HOOKS = [
  "THE ADVERT SAYS",
  "ON PAPER",
  "THE LISTING SAYS",
  "THE HEADLINE NUMBER",
  "WHAT YOU WERE TOLD",
  "LOOKS LIKE A GOOD ONE",
  "THE YIELD ON THE LISTING",
  "THE NUMBER THAT SELLS IT",
];

const GAP_HOOKS = [
  "THE YIELD YOU ARE QUOTED",
  "THE NUMBER ON THE PARTICULARS",
  "WHAT THE AGENT CALLS THE YIELD",
];

const STRESS_HOOKS = [
  "TODAY, THE DEAL CLEARS",
  "RIGHT NOW IT MAKES",
  "AT TODAY'S RATE",
  "THIS MONTH IT CLEARS",
  "WHILE RATES HOLD",
];

const CASH_HOOKS = [
  "THE DEPOSIT",
  "YOU SAVED THE DEPOSIT",
  "THE 25% EVERYONE PLANS FOR",
  "THE NUMBER IN YOUR HEAD",
  "THE DEPOSIT IS READY",
];

const BILL_HOOKS = [
  "YOUR TENANT LEAVES TOMORROW",
  "NOTICE JUST LANDED",
  "THE PROPERTY IS EMPTY",
  "ONE TENANT MOVES OUT",
  "EMPTY FROM FRIDAY",
  "THE KEYS COME BACK",
];

function autopsyReel(d: Deal, n: number): Omit<ReelSpec, "day"> {
  const m = model(d);
  return {
    id: `autopsy-${n}`,
    format: "autopsy",
    scenes: [
      { kicker: AUTOPSY_HOOKS[(n - 1) % AUTOPSY_HOOKS.length], from: 0, to: m.gross, render: "pct", seconds: 3,
        sub: `${gbp(d.price)} property · ${gbp(d.pcm)} a month`, foot: "Gross yield" },
      { kicker: "MINUS RUNNING COSTS", from: 0, to: m.running, render: "gbp-neg", seconds: 2.6,
        sub: "Management, insurance, certificates, maintenance", foot: "Assumed at 28% of rent", tone: "warn" },
      { kicker: "MINUS THE MORTGAGE", from: 0, to: m.interest, render: "gbp-neg", seconds: 2.8,
        sub: `Interest-only at ${d.rate}% on ${gbp(m.loan)}`,
        foot: `That is ${pct((m.interest / d.pcm) * 100)} of the rent`, tone: "warn" },
      { kicker: "WHAT IS ACTUALLY LEFT", from: d.pcm, to: m.cashflow, render: "gbp", seconds: 3,
        sub: "Per month, after everything", foot: `Not ${gbp(d.pcm)}. Not ${pct(m.gross)}.` },
      { kicker: "PROPERTYVAULT SCORE", from: 0, to: m.score.total, render: "int", seconds: 2.6,
        sub: m.score.band, foot: `${pct(m.gross)} gross → ${pct(m.net)} net`,
        tone: m.score.total < 55 ? "bad" : undefined },
    ],
    caption: [
      `${pct(m.gross)} gross yield. ${gbp(m.cashflow)} a month.`,
      "",
      `A ${gbp(d.price)} property letting for ${gbp(d.pcm)} a month advertises as ${pct(m.gross)}. Running costs take ${gbp(m.running)} — assumed at 28% of rent. The mortgage takes ${gbp(m.interest)}, interest-only at ${d.rate}% on ${gbp(m.loan)}.`,
      "",
      `What is left is ${gbp(m.cashflow)}. At +2% on the rate it becomes ${gbp(m.atPlus2)}.`,
      "",
      `PropertyVault Score ${m.score.total}/100 — ${m.score.band}. The score does not rate location or demand: we hold no licensed data for either and will not invent it.`,
      "",
      "Run your own numbers — link in bio.",
    ].join("\n"),
    hashtags: tagsFor("autopsy"),
  };
}

function billReel(c: typeof VOID_CASES[number], n: number): Omit<ReelSpec, "day"> {
  const lostRent = (c.pcm / 4.333) * c.weeks;
  const total = lostRent + c.councilTax + c.utilities + c.clean + c.findFee;
  return {
    id: `bill-${n}`,
    format: "the-bill",
    scenes: [
      { kicker: BILL_HOOKS[(n - 1) % BILL_HOOKS.length], from: 0, to: c.weeks, render: "int", seconds: 2.6,
        sub: "Weeks empty", foot: "What does that actually cost?" },
      { kicker: "LOST RENT", from: 0, to: lostRent, render: "gbp-neg", seconds: 2.8,
        sub: `${gbp(c.pcm)} a month, ${c.weeks} weeks empty`, tone: "warn" },
      { kicker: "THE BILLS THAT DO NOT STOP", from: 0, to: c.councilTax + c.utilities, render: "gbp-neg", seconds: 2.6,
        sub: "Council tax and utilities revert to you", foot: "Empty-property discounts vary by council", tone: "warn" },
      { kicker: "GETTING IT RE-LET", from: 0, to: c.clean + c.findFee, render: "gbp-neg", seconds: 2.6,
        sub: c.findFee > 0 ? "Clean, and the agent's tenant-find fee" : "Clean and prepare", tone: "warn" },
      { kicker: "THE VOID COST", from: 0, to: total, render: "gbp", seconds: 3,
        sub: "One tenant leaving", foot: "This is why some landlords take guaranteed rent", tone: "bad" },
    ],
    caption: [
      `One void. ${gbp(total)}.`,
      "",
      `${c.weeks} weeks empty on a ${gbp(c.pcm)} tenancy is ${gbp(lostRent)} of rent you never see. Then council tax and utilities revert to you, the property needs cleaning${c.findFee > 0 ? ", and the agent charges a tenant-find fee" : ""}.`,
      "",
      `Total: ${gbp(total)}.`,
      "",
      "Council tax on empty property varies by local authority — check yours. Everything else here is arithmetic.",
      "",
      "Guaranteed rent trades some of the headline rent for not carrying voids. Whether that trade suits you depends on your numbers — the ones above are a worked example.",
      "",
      "Details on the site — link in bio.",
    ].join("\n"),
    hashtags: tagsFor("the-bill"),
  };
}

function gapReel(d: Deal, n: number): Omit<ReelSpec, "day"> {
  const m = model(d);
  const beforeFinance = netYield(m.annualRent, m.running * 12, d.price);
  return {
    id: `gap-${n}`,
    format: "the-gap",
    scenes: [
      { kicker: GAP_HOOKS[(n - 1) % GAP_HOOKS.length], from: 0, to: m.gross, render: "pct", seconds: 2.8,
        sub: `${gbp(d.price)} · ${gbp(d.pcm)} a month`, foot: "Rent divided by price. Nothing else." },
      { kicker: "AFTER RUNNING COSTS", from: m.gross, to: beforeFinance, render: "pct", seconds: 2.8,
        sub: "Management, insurance, maintenance, voids", foot: "Assumed at 28% of rent", tone: "warn" },
      { kicker: "AFTER THE MORTGAGE", from: beforeFinance, to: m.net, render: "pct", seconds: 3,
        sub: "The yield you actually keep", tone: "bad" },
      { kicker: "THE GAP", from: 0, to: m.gross - m.net, render: "pct", seconds: 2.6,
        sub: "Percentage points between the advert and reality", foot: "Same property. Same rent." },
    ],
    caption: [
      `${pct(m.gross)} gross. ${pct(m.net)} net.`,
      "",
      "Gross yield is rent divided by price. It ignores management, insurance, safety certificates, maintenance, voids and the mortgage.",
      "",
      `On ${gbp(d.price)} at ${gbp(d.pcm)} a month, with costs assumed at 28% of rent and interest-only at ${d.rate}%, the yield you keep is ${pct(m.net)}.`,
      "",
      "Your own cost figure will differ. Work it out before you offer, not after.",
      "",
      "Rental yield calculator — link in bio.",
    ].join("\n"),
    hashtags: tagsFor("the-gap"),
  };
}

function stressReel(d: Deal, n: number): Omit<ReelSpec, "day"> {
  const m = model(d);
  const swing = m.cashflow - m.atPlus2;
  return {
    id: `stress-${n}`,
    format: "the-stress",
    scenes: [
      { kicker: STRESS_HOOKS[(n - 1) % STRESS_HOOKS.length], from: 0, to: m.cashflow, render: "gbp", seconds: 2.8,
        sub: `Monthly cash flow at ${d.rate}%, after everything`, foot: `${gbp(d.price)} · ${gbp(d.pcm)} a month` },
      { kicker: "THE RATE GOES UP TWO POINTS", from: d.rate, to: d.rate + 2, render: "pct", seconds: 2.4,
        sub: "Nothing else changes", foot: "Same rent. Same costs.", tone: "warn" },
      { kicker: "AFTER THE RISE", from: m.cashflow, to: m.atPlus2, render: "gbp", seconds: 3,
        sub: "Monthly cash flow", tone: m.atPlus2 < 0 ? "bad" : "warn" },
      { kicker: "THE SWING", from: 0, to: swing, render: "gbp-neg", seconds: 2.6,
        sub: "A month, from two percentage points",
        foot: "A deal that only works at today's rate is a bet on the rate", tone: "bad" },
    ],
    caption: [
      `${gbp(m.cashflow)} a month becomes ${gbp(m.atPlus2)}.`,
      "",
      `A ${gbp(d.price)} property letting for ${gbp(d.pcm)}, interest-only on ${gbp(m.loan)}. At ${d.rate}% it clears ${gbp(m.cashflow)} a month. At ${d.rate + 2}% it clears ${gbp(m.atPlus2)}.`,
      "",
      `Two percentage points, ${gbp(swing)} a month. Running costs assumed at 28% of rent.`,
      "",
      "This is the test worth running before you offer on anything.",
      "",
      "Stress test it yourself — link in bio.",
    ].join("\n"),
    hashtags: tagsFor("the-stress"),
  };
}

function cashReel(price: number, n: number): Omit<ReelSpec, "day"> {
  const deposit = price * 0.25;
  const sdlt = calcSDLT(price, true);
  const total = deposit + sdlt + BUYING_EXTRAS;
  return {
    id: `cash-${n}`,
    format: "the-cash",
    scenes: [
      { kicker: CASH_HOOKS[(n - 1) % CASH_HOOKS.length], from: 0, to: deposit, render: "gbp", seconds: 2.6,
        sub: `25% of ${gbp(price)}`, foot: "The number everybody plans for" },
      { kicker: "PLUS STAMP DUTY", from: 0, to: sdlt, render: "gbp-neg", seconds: 2.8,
        sub: "Additional-property rates", foot: "Due within 14 days. You cannot borrow it.", tone: "warn" },
      { kicker: "PLUS LEGALS AND SURVEY", from: 0, to: BUYING_EXTRAS, render: "gbp-neg", seconds: 2.4,
        sub: "Assumed — these vary by firm", tone: "warn" },
      { kicker: "CASH TO COMPLETE", from: deposit, to: total, render: "gbp", seconds: 3,
        sub: `Not ${gbp(deposit)}`, foot: "Refurb, furnishing and early voids sit on top" },
    ],
    caption: [
      `The deposit is ${gbp(deposit)}. The purchase needs ${gbp(total)}.`,
      "",
      `On a ${gbp(price)} buy-to-let: ${gbp(deposit)} deposit, ${gbp(sdlt)} stamp duty at additional-property rates, and roughly ${gbp(BUYING_EXTRAS)} of legals and survey — that last figure is an assumption and varies.`,
      "",
      "Refurbishment, furnishing and the first months of void are on top and not included.",
      "",
      "Stamp duty is due within 14 days of completion and cannot be added to the mortgage.",
      "",
      "Full breakdown on the deal analyser — link in bio.",
    ].join("\n"),
    hashtags: tagsFor("the-cash"),
  };
}

/** The three tax episodes, each a different tax and a different surprise. */
function taxReels(): Omit<ReelSpec, "day">[] {
  const out: Omit<ReelSpec, "day">[] = [];

  // Section 24
  {
    const otherIncome = 55_000, interest = 7_400, profit = 11_400;
    const adjusted = otherIncome + profit;
    const credit = calcSection24Credit(interest, profit, adjusted, personalAllowance(adjusted));
    out.push({
      id: "tax-section-24",
      format: "the-tax",
      scenes: [
        { kicker: "MORTGAGE INTEREST PAID", from: 0, to: interest, render: "gbp", seconds: 2.6,
          sub: "Over the year", foot: "You might expect to deduct this" },
        { kicker: "WHAT YOU CAN DEDUCT", from: interest, to: 0, render: "gbp", seconds: 2.8,
          sub: "Nothing. Section 24 removed it.", tone: "bad" },
        { kicker: "WHAT YOU GET INSTEAD", from: 0, to: credit, render: "gbp", seconds: 2.8,
          sub: "A basic-rate tax credit", foot: "You are taxed on profit before interest" },
        { kicker: "THE COST OF THE DIFFERENCE", from: 0, to: interest * 0.4 - credit, render: "gbp-neg", seconds: 3,
          sub: "For a higher-rate taxpayer", foot: "Relief at basic rate, tax at 40%", tone: "bad" },
      ],
      caption: [
        `${gbp(interest)} of mortgage interest. ${gbp(credit)} of relief.`,
        "",
        "Section 24 means mortgage interest is not deducted from rental profit. You are taxed on the profit before interest, then given a basic-rate credit.",
        "",
        "A higher-rate taxpayer pays 40% on the profit but gets relief at basic rate. That gap is the cost, and it is why some landlords look at a limited company.",
        "",
        "Incorporating carries its own costs and is not automatically better. Model both.",
        "",
        "Section 24 calculator — link in bio.",
      ].join("\n"),
      hashtags: tagsFor("the-tax"),
    });
  }

  // Capital gains
  {
    const gain = 40_000, otherIncome = 55_000;
    const cgt = calcCGTResidential(gain, otherIncome);
    out.push({
      id: "tax-cgt",
      format: "the-tax",
      scenes: [
        { kicker: "YOU SELL AT A GAIN OF", from: 0, to: gain, render: "gbp", seconds: 2.6,
          sub: "On a rental property", foot: "Bought well. Sold well." },
        { kicker: "TAX FREE ALLOWANCE", from: 0, to: 3_000, render: "gbp", seconds: 2.4,
          sub: "The annual exempt amount", foot: "That is all of it" },
        { kicker: "CAPITAL GAINS TAX", from: 0, to: cgt, render: "gbp-neg", seconds: 2.8,
          sub: `On ${gbp(otherIncome)} of other income`, tone: "bad" },
        { kicker: "WHAT YOU KEEP", from: gain, to: gain - cgt, render: "gbp", seconds: 3,
          sub: "After tax", foot: "Purchase costs and improvements reduce the gain — keep every invoice" },
      ],
      caption: [
        `A ${gbp(gain)} gain leaves ${gbp(gain - cgt)}.`,
        "",
        `Capital gains tax on residential property is charged at higher rates than other assets, and the gain is added to your income to decide which rate applies. The annual exempt amount is ${gbp(3_000)}.`,
        "",
        "Purchase costs, legal fees and capital improvements reduce the gain. Keep every invoice from the day you buy — reconstructing them years later is how people overpay.",
        "",
        "Worth modelling before you buy, not after.",
        "",
        "Capital gains calculator — link in bio.",
      ].join("\n"),
      hashtags: tagsFor("the-tax"),
    });
  }

  // Stamp duty — the surcharge
  {
    const price = 200_000;
    const asHome = calcSDLT(price, false);
    const asBTL = calcSDLT(price, true);
    out.push({
      id: "tax-sdlt-surcharge",
      format: "the-tax",
      scenes: [
        { kicker: "A £200,000 HOUSE", from: 0, to: asHome, render: "gbp", seconds: 2.6,
          sub: "Stamp duty, if you live in it", foot: "Standard rates" },
        { kicker: "THE SAME HOUSE", from: asHome, to: asBTL, render: "gbp", seconds: 3,
          sub: "Stamp duty, as a buy-to-let", tone: "bad" },
        { kicker: "THE SURCHARGE", from: 0, to: asBTL - asHome, render: "gbp-neg", seconds: 2.8,
          sub: "Additional-property rates", foot: "Raised from 3% to 5% on 31 October 2024", tone: "warn" },
        { kicker: "PAYABLE WITHIN", from: 0, to: 14, render: "int", seconds: 2.4,
          sub: "Days of completion", foot: "In cash. It cannot go on the mortgage." },
      ],
      caption: [
        `${gbp(asHome)} as a home. ${gbp(asBTL)} as a buy-to-let.`,
        "",
        `The same £200,000 house. The difference — ${gbp(asBTL - asHome)} — is the additional-property surcharge, which rose from 3% to 5% on 31 October 2024.`,
        "",
        "It is due within 14 days of completion, in cash, and cannot be added to the mortgage. It comes out of the same pot as your deposit.",
        "",
        "Non-UK residents pay a further 2% on top.",
        "",
        "Stamp duty calculator — link in bio.",
      ].join("\n"),
      hashtags: tagsFor("the-tax"),
    });
  }

  return out;
}

/**
 * Interleave the formats so the same one never runs on consecutive days.
 *
 * At each step take the format with the most episodes still unplaced, skipping
 * whichever ran yesterday. That is the standard rearrangement and it always
 * succeeds while no single format holds more than half the slots — with the
 * largest pool at 8 of 30 there is a wide margin, and a test asserts the
 * result rather than trusting the argument.
 *
 * A round-robin was the obvious approach and it failed: it clustered the
 * biggest pool at the end and left the last two days on the same format.
 */
function interleave(pools: Omit<ReelSpec, "day">[][]): Omit<ReelSpec, "day">[] {
  // Give every episode a fractional position inside its own pool, then sort
  // everything by that. A pool of 8 lands at 1/16, 3/16, 5/16 … so it is spread
  // across the whole month instead of clustered.
  //
  // Greedy "take from the biggest pool" was tried first and looked fine by the
  // no-repeat test while being wrong in practice: it put five autopsies into
  // the first nine days, which is the first week a new visitor sees.
  const spread = pools
    .filter(p => p.length > 0)
    .flatMap(pool => pool.map((item, i) => ({ item, pos: (i + 0.5) / pool.length })))
    .sort((a, b) => a.pos - b.pos)
    .map(x => x.item);

  // Then break any adjacent pair of the same format by swapping the second one
  // with the nearest following episode of a different format.
  for (let i = 1; i < spread.length; i++) {
    if (spread[i].format !== spread[i - 1].format) continue;
    const j = spread.findIndex(
      (c, k) => k > i && c.format !== spread[i - 1].format &&
        (k + 1 >= spread.length || spread[k + 1].format !== spread[i].format),
    );
    if (j > i) [spread[i], spread[j]] = [spread[j], spread[i]];
  }

  return spread;
}

export function buildCalendar(): ReelSpec[] {
  const autopsies = AUTOPSY_DEALS.map((d, i) => autopsyReel(d, i + 1));
  const bills = VOID_CASES.map((c, i) => billReel(c, i + 1));
  const gaps = GAP_DEALS.map((d, i) => gapReel(d, i + 1));
  const stresses = STRESS_DEALS.map((d, i) => stressReel(d, i + 1));
  const cash = CASH_PRICES.map((p, i) => cashReel(p, i + 1));
  const taxes = taxReels();

  // 5 + 4 + 3 + 3 + 4 + 3 = 22 distinct episodes. The remaining eight days
  // repeat the strongest formats at prices not yet used, rather than padding
  // with weaker ideas.
  const extraAutopsies: Deal[] = [
    { price: 145_000, pcm: 875, ltv: 0.75, rate: 5.5 },
    { price: 210_000, pcm: 1_150, ltv: 0.75, rate: 5.5 },
    { price: 165_000, pcm: 1_400, ltv: 0.75, rate: 5.5 },
  ];
  const extraBills = [
    { pcm: 800, weeks: 3, councilTax: 130, utilities: 70, clean: 140, findFee: 800 },
    { pcm: 1_250, weeks: 10, councilTax: 190, utilities: 110, clean: 260, findFee: 1_250 },
  ];
  const extraStress: Deal[] = [
    { price: 175_000, pcm: 1_000, ltv: 0.75, rate: 5.5 },
    { price: 240_000, pcm: 1_300, ltv: 0.75, rate: 5.5 },
  ];
  const extraCash = [150_000];

  const all = interleave([
    [...autopsies, ...extraAutopsies.map((d, i) => autopsyReel(d, autopsies.length + i + 1))],
    [...bills, ...extraBills.map((c, i) => billReel(c, bills.length + i + 1))],
    gaps,
    [...stresses, ...extraStress.map((d, i) => stressReel(d, stresses.length + i + 1))],
    [...cash, ...extraCash.map((p, i) => cashReel(p, cash.length + i + 1))],
    taxes,
  ]);

  return all.slice(0, 30).map((r, i) => ({ ...r, day: i + 1 }));
}

export const CALENDAR: ReelSpec[] = buildCalendar();

/** The post scheduled for a given day index, 1-based. */
export function reelForDay(day: number): ReelSpec | undefined {
  return CALENDAR.find(r => r.day === day);
}

/** Caption plus hashtags, as it is actually posted. */
export function fullCaption(spec: ReelSpec): string {
  return `${spec.caption}\n\n${spec.hashtags.map(h => `#${h}`).join(" ")}`;
}

/** Total running time of a spec, in seconds. */
export function durationOf(spec: ReelSpec): number {
  return spec.scenes.reduce((s, sc) => s + sc.seconds, 0);
}

/**
 * Day one of the campaign.
 *
 * Kept here rather than in an environment variable because it is a content
 * decision, not a secret — and because a schedule that lives in the repo can
 * be read, reviewed and changed in a commit rather than in a dashboard.
 * REEL_CAMPAIGN_START still overrides it if the schedule needs shifting
 * without a deploy.
 */
export const CAMPAIGN_START = "2026-08-29";

/**
 * The IG account posts go to. A Business account id is public information —
 * it appears in any Graph API response about the account — so it lives here
 * alongside the schedule. INSTAGRAM_USER_ID overrides it.
 *
 * The access token is the only real secret, and is never held in code.
 */
export const INSTAGRAM_USER_ID = "28539365575682132";

/** Which day of the campaign a given moment falls on. Day one is CAMPAIGN_START. */
export function campaignDay(now: Date, start = CAMPAIGN_START): number | null {
  const startMs = Date.parse(`${start}T00:00:00Z`);
  if (Number.isNaN(startMs)) return null;
  return Math.floor((now.getTime() - startMs) / 86_400_000) + 1;
}
