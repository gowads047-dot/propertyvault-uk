import { calcSDLT } from "./tax";
import { grossYield, netYield, cashOnCash, monthlyInterestOnly } from "./finance";
import { scoreDeal, type DealScore } from "./deal-score";
import type { CardFace } from "./social-cards";

/**
 * Property Autopsy — the carousel format.
 *
 * Open on a headline yield that looks excellent, then take it apart a slide at
 * a time until the real monthly figure appears, and finish on the PropertyVault
 * Score. The point being made is always the same one: a headline yield is not
 * money in your pocket.
 *
 * Every figure is computed here from lib/finance.ts, lib/tax.ts and
 * lib/deal-score.ts — the same code behind the public calculators — so a
 * viewer can reproduce the whole thing on the deal analyser. The properties
 * are illustrative worked examples, not listings, and every card that rests on
 * an assumption says so on the card.
 */

export interface AutopsySubject {
  /** URL segment, and the episode's identity. */
  id: string;
  /** Where it is. Kept generic — these are worked examples, not real listings. */
  location: string;
  purchasePrice: number;
  monthlyRent: number;
  /** Loan as a share of price. */
  ltv: number;
  /** Interest-only rate, in percent. */
  rate: number;
}

export interface Autopsy {
  subject: AutopsySubject;
  slides: CardFace[];
  caption: string;
  verifyPath: string;
  /** The final score, exposed so tests and captions agree with the last slide. */
  score: DealScore;
}

const gbp = (n: number) => {
  const r = Math.round(n);
  return `${r < 0 ? "-" : ""}£${Math.abs(r).toLocaleString("en-GB")}`;
};
const pct = (n: number) => `${n.toFixed(1)}%`;

/**
 * "an 8.0% yield", not "a 8.0% yield". Eight, eleven and eighteen are the
 * numerals that open with a vowel sound when read aloud.
 */
function article(figure: string): string {
  const digits = figure.replace(/[^0-9.]/g, "");
  return /^(8|11|18)(\D|$)/.test(digits) ? "an" : "a";
}

/** Running costs as a share of rent — management, insurance, maintenance, void. */
const COST_RATIO = 0.28;
/** Legals and survey. An assumption, and labelled as one wherever it appears. */
const BUYING_EXTRAS = 2_100;

/**
 * The episodes. Deliberately few and hand-chosen: each one has to make a
 * different point, or it is the same video twice.
 */
export const AUTOPSY_SUBJECTS: AutopsySubject[] = [
  // The classic "8% yield" that a listing would lead with.
  { id: "eight-percent-yield", location: "the Midlands", purchasePrice: 120_000, monthlyRent: 800, ltv: 0.75, rate: 5.5 },
  // The ordinary-looking deal almost everyone posts as a win.
  { id: "the-average-btl", location: "the Midlands", purchasePrice: 180_000, monthlyRent: 950, ltv: 0.75, rate: 5.5 },
];

export function buildAutopsy(subject: AutopsySubject): Autopsy {
  const { purchasePrice: price, monthlyRent: pcm, ltv, rate } = subject;

  const annualRent = pcm * 12;
  const gross = grossYield(annualRent, price);

  const runningMonthly = pcm * COST_RATIO;
  const loan = price * ltv;
  const interestMonthly = monthlyInterestOnly(loan, rate);

  const cashflow = pcm - runningMonthly - interestMonthly;
  const cashflowAtPlus2 = pcm - runningMonthly - monthlyInterestOnly(loan, rate + 2);

  const net = netYield(annualRent, (runningMonthly + interestMonthly) * 12, price);
  const deposit = price * (1 - ltv);
  const sdlt = calcSDLT(price, true);
  const cashIn = deposit + sdlt + BUYING_EXTRAS;
  const coc = cashOnCash(cashflow * 12, cashIn);

  const score = scoreDeal({
    netYield: net,
    monthlyCashflow: cashflow,
    cashOnCash: coc,
    cashflowAtPlus2,
    purchasePrice: price,
  });

  const negative = cashflow < 0;

  const slides: CardFace[] = [
    // 1 — the hook. The number a listing would put in the headline.
    {
      eyebrow: "Property autopsy",
      headline: `This looked like ${article(pct(gross))} ${pct(gross)} yield`,
      value: pct(gross),
      valueLabel: "Gross yield — the number in the advert",
      rows: [
        { k: "Asking price", v: gbp(price) },
        { k: "Monthly rent", v: `${gbp(pcm)}/mo` },
        { k: "Location", v: subject.location },
      ],
    },
    // 2 — everything that comes in. There is only one line.
    {
      eyebrow: "What comes in",
      headline: "The rent, and nothing else",
      value: gbp(annualRent),
      valueLabel: "Total annual income",
      rows: [
        { k: "Rent", v: `${gbp(pcm)}/mo` },
        { k: "Over twelve months", v: gbp(annualRent) },
        { k: "Anything else", v: "Nothing" },
      ],
    },
    // 3 — running costs, before finance.
    {
      eyebrow: "What goes out — part one",
      headline: "Before the mortgage is even paid",
      value: `${gbp(runningMonthly)}/mo`,
      valueLabel: "Running costs (28% of rent, assumed)",
      rows: [
        { k: "Letting and management", v: "assumed" },
        { k: "Insurance and safety certificates", v: "assumed" },
        { k: "Maintenance and repairs", v: "assumed" },
        { k: "Void periods between tenants", v: "assumed" },
        { k: "Annual total", v: gbp(runningMonthly * 12) },
      ],
    },
    // 4 — the mortgage. Usually the largest single line, and the one omitted.
    {
      eyebrow: "What goes out — part two",
      headline: "The line the yield never mentions",
      value: `${gbp(interestMonthly)}/mo`,
      valueLabel: `Interest-only at ${rate}% on ${gbp(loan)}`,
      rows: [
        { k: `Deposit (${Math.round((1 - ltv) * 100)}%)`, v: gbp(deposit) },
        { k: "Borrowed", v: gbp(loan) },
        { k: "Interest per year", v: gbp(interestMonthly * 12) },
        { k: "Share of the rent", v: pct((interestMonthly / pcm) * 100) },
      ],
    },
    // 5 — the reveal.
    {
      eyebrow: "What is actually left",
      headline: negative ? "It does not pay for itself" : "The real monthly figure",
      value: `${gbp(cashflow)}/mo`,
      valueLabel: "Cash flow after everything",
      tone: cashflow < 100 ? "warn" : undefined,
      rows: [
        { k: "Rent", v: `${gbp(pcm)}/mo` },
        { k: "Running costs", v: `-${gbp(runningMonthly)}/mo` },
        { k: "Mortgage interest", v: `-${gbp(interestMonthly)}/mo` },
        { k: "Left over", v: `${gbp(cashflow)}/mo` },
        { k: "At +2% on the rate", v: `${gbp(cashflowAtPlus2)}/mo` },
      ],
    },
    // 6 — the verdict, from the same code as the site.
    {
      eyebrow: "The verdict",
      headline: `${pct(gross)} gross. ${pct(net)} net.`,
      value: `${score.total}`,
      valueLabel: `PropertyVault Score — ${score.band}`,
      tone: score.total < 55 ? "warn" : undefined,
      rows: score.components.map(c => ({
        k: `${c.label} — ${c.reason}`,
        v: `${c.score}/${c.max}`,
      })),
    },
  ];

  const caption = [
    `${pct(gross)} gross yield. ${gbp(cashflow)} a month.`,
    "",
    `A ${gbp(price)} property in ${subject.location} letting for ${gbp(pcm)} a month advertises as ${article(pct(gross))} ${pct(gross)} yield. Here is where that goes.`,
    "",
    `Running costs take ${gbp(runningMonthly)} a month — management, insurance, certificates, maintenance and void, assumed here at 28% of rent. The mortgage takes ${gbp(interestMonthly)}, interest-only at ${rate}% on ${gbp(loan)} borrowed. That is ${pct((interestMonthly / pcm) * 100)} of the rent going straight back out.`,
    "",
    `What is left is ${gbp(cashflow)} a month. At +2% on the rate it becomes ${gbp(cashflowAtPlus2)}.`,
    "",
    `PropertyVault Score: ${score.total}/100 — ${score.band}. The score does not rate location or demand, because we hold no licensed data for either and will not invent it. It scores what can be calculated.`,
    "",
    "Run your own numbers on the deal analyser — link in bio.",
  ].join("\n");

  const verifyPath = "/calculators/deal-analyser/";
  for (const s of slides) s.verifyPath = verifyPath;

  return { subject, slides, caption, verifyPath, score };
}

export const AUTOPSIES: Autopsy[] = AUTOPSY_SUBJECTS.map(buildAutopsy);

/** Slug for one slide, e.g. autopsy-eight-percent-yield-3. */
export function autopsySlideSlug(id: string, index: number): string {
  return `autopsy-${id}-${index + 1}`;
}

/** Every autopsy slide, keyed by the slug its image is served at. */
export function autopsyFaces(): Map<string, CardFace> {
  const out = new Map<string, CardFace>();
  for (const a of AUTOPSIES) {
    a.slides.forEach((face, i) => out.set(autopsySlideSlug(a.subject.id, i), face));
  }
  return out;
}
