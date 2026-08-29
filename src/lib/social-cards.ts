import { calcSDLT, calcSection24Credit, calcCGTResidential, personalAllowance } from "./tax";
import { grossYield, netYield, monthlyInterestOnly } from "./finance";

/**
 * Instagram content, generated from the calculators.
 *
 * The reason this exists rather than a model writing captions: a model writing
 * about UK property invents a yield figure or a tax threshold, and this site
 * has a standing rule against unverifiable claims. Every number below is
 * computed by lib/tax.ts and lib/finance.ts — the same tested code behind the
 * public calculators — so each post is checkable by the reader on the page it
 * links to.
 *
 * Nothing here is a market statistic, a prediction, or a claim about results.
 * The worked examples use round illustrative inputs, which is why every card
 * carries the assumptions it was built from and labels them as assumptions.
 */

export interface CardRow {
  k: string;
  v: string;
}

export interface SocialCard {
  /** URL segment. Stable — it is the public image path. */
  slug: string;
  /** Small label above the headline. */
  eyebrow: string;
  /** The question the card answers. */
  headline: string;
  /** The single number the card exists to show. */
  value: string;
  valueLabel: string;
  /**
   * Whether the number is bad news. A negative cash flow rendered in the same
   * gold as a healthy yield reads as a win, which is the opposite of the point.
   */
  tone?: "warn";
  /** The workings, so the number is never merely asserted. */
  rows: CardRow[];
  /** Instagram caption. */
  caption: string;
  /** Page on the site where the reader can reproduce the number. */
  verifyPath: string;
}

/** Sterling, with the sign outside the symbol — "-£160", never "£-160". */
const gbp = (n: number) => {
  const r = Math.round(n);
  return `${r < 0 ? "-" : ""}£${Math.abs(r).toLocaleString("en-GB")}`;
};
const pct = (n: number) => `${n.toFixed(1)}%`;

/** Costs a purchase carries beyond the deposit. Assumptions, labelled as such. */
const LEGAL_FEES = 1_500;
const SURVEY = 600;
/** Running costs as a share of rent — management, insurance, maintenance, void. */
const COST_RATIO = 0.28;

export function buildCards(): SocialCard[] {
  const cards: SocialCard[] = [];

  // ── 1. What a first buy-to-let actually costs in stamp duty ──────────────
  {
    const price = 200_000;
    const sdlt = calcSDLT(price, true);
    const asHome = calcSDLT(price, false);
    cards.push({
      slug: "stamp-duty-first-buy-to-let",
      eyebrow: "Stamp duty",
      headline: "Buying a £200,000 buy-to-let",
      value: gbp(sdlt),
      valueLabel: "Stamp duty due",
      rows: [
        { k: "Purchase price", v: gbp(price) },
        { k: "Same price, as your home", v: gbp(asHome) },
        { k: "The additional-property surcharge", v: gbp(sdlt - asHome) },
      ],
      caption: [
        `A £200,000 buy-to-let carries ${gbp(sdlt)} in stamp duty.`,
        "",
        `The same house as your own home would cost ${gbp(asHome)}. The difference — ${gbp(sdlt - asHome)} — is the additional-property surcharge, which rose from 3% to 5% on 31 October 2024.`,
        "",
        "It is payable within 14 days of completion, and you cannot borrow it. It comes out of your cash on top of the deposit.",
        "",
        "Run your own number on the stamp duty calculator — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/stamp-duty/",
    });
  }

  // ── 2. The cash actually needed, which is never just the deposit ─────────
  {
    const price = 180_000;
    const deposit = price * 0.25;
    const sdlt = calcSDLT(price, true);
    const total = deposit + sdlt + LEGAL_FEES + SURVEY;
    cards.push({
      slug: "cash-needed-first-buy-to-let",
      eyebrow: "Cash required",
      headline: "A £180,000 buy-to-let at 75% LTV",
      value: gbp(total),
      valueLabel: "Cash needed to complete",
      rows: [
        { k: "Deposit (25%)", v: gbp(deposit) },
        { k: "Stamp duty", v: gbp(sdlt) },
        { k: "Legal fees (assumed)", v: gbp(LEGAL_FEES) },
        { k: "Survey (assumed)", v: gbp(SURVEY) },
      ],
      caption: [
        `The deposit is ${gbp(deposit)}. The purchase needs ${gbp(total)}.`,
        "",
        `The gap is stamp duty at ${gbp(sdlt)}, plus legals and a survey. Refurbishment, furnishing and the first months of void sit on top of this and are not included here.`,
        "",
        "Legal and survey costs are assumptions and vary by firm and property. Everything else is calculated.",
        "",
        "Full breakdown on the deal analyser — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/deal-analyser/",
    });
  }

  // ── 3. Gross yield is the number people quote; net is the one they get ───
  {
    const price = 180_000;
    const pcm = 950;
    const annualRent = pcm * 12;
    const costs = annualRent * COST_RATIO;
    const g = grossYield(annualRent, price);
    const n = netYield(annualRent, costs, price);
    cards.push({
      slug: "gross-yield-versus-net-yield",
      eyebrow: "Yield",
      headline: "£180,000 property, £950 a month",
      value: pct(g),
      valueLabel: "Gross yield",
      rows: [
        { k: "Annual rent", v: gbp(annualRent) },
        { k: "Running costs (28% assumed)", v: gbp(costs) },
        { k: "Net yield", v: pct(n) },
        { k: "The gap", v: `${(g - n).toFixed(1)} points` },
      ],
      caption: [
        `${pct(g)} gross. ${pct(n)} net.`,
        "",
        "Gross yield is rent divided by price. It ignores management, insurance, maintenance, safety certificates and void periods. Here those are assumed at 28% of rent — your own figure will differ, and it is worth working out before you offer.",
        "",
        "Neither number includes the mortgage. That comes off the net.",
        "",
        "Rental yield calculator — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/rental-yield/",
    });
  }

  // ── 4. The stress test, which is where most first deals fall over ────────
  {
    const loan = 135_000;
    const pcm = 950;
    const atFive = monthlyInterestOnly(loan, 5.5);
    const atSeven = monthlyInterestOnly(loan, 7.5);
    const costs = pcm * COST_RATIO;
    cards.push({
      slug: "what-two-percent-does-to-cash-flow",
      eyebrow: "Stress test",
      headline: "What +2% on the rate does",
      value: `${gbp(pcm - costs - atSeven)}/mo`,
      valueLabel: "Cash flow at 7.5%",
      tone: pcm - costs - atSeven < 0 ? "warn" : undefined,
      rows: [
        { k: "Rent", v: `${gbp(pcm)}/mo` },
        { k: "Running costs (28% assumed)", v: `${gbp(costs)}/mo` },
        { k: "Interest at 5.5%", v: `${gbp(atFive)}/mo` },
        { k: "Cash flow at 5.5%", v: `${gbp(pcm - costs - atFive)}/mo` },
        { k: "Interest at 7.5%", v: `${gbp(atSeven)}/mo` },
      ],
      caption: [
        `A £135,000 interest-only loan costs ${gbp(atFive)} a month at 5.5%, and ${gbp(atSeven)} at 7.5%.`,
        "",
        `On £950 rent with costs assumed at 28%, that moves monthly cash flow from ${gbp(pcm - costs - atFive)} to ${gbp(pcm - costs - atSeven)}.`,
        "",
        "This is the one test worth running before you offer on anything. A deal that only works at today's rate is not a deal, it is a bet on the rate.",
        "",
        "Mortgage stress test — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/btl-mortgage/",
    });
  }

  // ── 5. Section 24, which catches almost every new higher-rate landlord ───
  {
    const otherIncome = 55_000;
    const interest = 7_400;
    const profitBeforeInterest = 11_400;
    const adjusted = otherIncome + profitBeforeInterest;
    const credit = calcSection24Credit(
      interest,
      profitBeforeInterest,
      adjusted,
      personalAllowance(adjusted),
    );
    cards.push({
      slug: "section-24-mortgage-interest",
      eyebrow: "Tax",
      headline: "Mortgage interest is not a deduction",
      value: gbp(credit),
      valueLabel: `Tax credit on ${gbp(interest)} of interest`,
      rows: [
        { k: "Mortgage interest paid", v: gbp(interest) },
        { k: "Rental profit before interest", v: gbp(profitBeforeInterest) },
        { k: "Other income (assumed)", v: gbp(otherIncome) },
        { k: "Relief, given as a credit", v: gbp(credit) },
      ],
      caption: [
        "Since Section 24 finished phasing in, mortgage interest is not deducted from rental profit. You are taxed on the profit before interest, then given a basic-rate credit.",
        "",
        `On ${gbp(interest)} of interest that credit is ${gbp(credit)}. A higher-rate taxpayer pays 40% on the profit but gets relief at basic rate — that gap is the cost, and it is why some landlords look at a limited company.`,
        "",
        "Incorporating carries its own costs and is not automatically better. Check both before you decide.",
        "",
        "Section 24 calculator — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/section-24/",
    });
  }

  // ── 6. First-time buyer relief, and what it is actually worth ────────────
  {
    const price = 300_000;
    const ftb = calcSDLT(price, false, true);
    const standard = calcSDLT(price, false);
    const additional = calcSDLT(price, true);
    cards.push({
      slug: "first-time-buyer-stamp-duty-relief",
      eyebrow: "Stamp duty",
      headline: "The same £300,000 house, three ways",
      value: gbp(standard - ftb),
      valueLabel: "What first-time buyer relief saves",
      rows: [
        { k: "As a first-time buyer", v: gbp(ftb) },
        { k: "As a mover", v: gbp(standard) },
        { k: "As an additional property", v: gbp(additional) },
      ],
      caption: [
        "One house at £300,000, three different stamp duty bills.",
        "",
        `First-time buyer: ${gbp(ftb)}. Moving home: ${gbp(standard)}. Buying it as a second property or buy-to-let: ${gbp(additional)}.`,
        "",
        `First-time buyer relief is worth ${gbp(standard - ftb)} here. It disappears entirely above £500,000, and you lose it the moment you have owned any property anywhere in the world.`,
        "",
        "Stamp duty calculator — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/stamp-duty/",
    });
  }

  // ── 7. What selling costs — nobody models this at the buying stage ───────
  {
    const gain = 40_000;
    const otherIncome = 55_000;
    const cgt = calcCGTResidential(gain, otherIncome);
    cards.push({
      slug: "capital-gains-on-selling-a-rental",
      eyebrow: "Tax",
      headline: "Selling a rental at a £40,000 gain",
      value: gbp(cgt),
      valueLabel: "Capital gains tax due",
      rows: [
        { k: "Gain on disposal", v: gbp(gain) },
        { k: "Annual exempt amount", v: gbp(3_000) },
        { k: "Other income (assumed)", v: gbp(otherIncome) },
        { k: "Left after tax", v: gbp(gain - cgt) },
      ],
      caption: [
        `A £40,000 gain on a rental, for someone earning ${gbp(otherIncome)}, leaves ${gbp(gain - cgt)} after capital gains tax.`,
        "",
        "The annual exempt amount is £3,000. Residential property is taxed at higher rates than other assets, and the gain is added to your income to decide which rate applies.",
        "",
        "Worth modelling before you buy, not after. Purchase costs and improvement spending reduce the gain — keep every invoice.",
        "",
        "Capital gains calculator — link in bio.",
      ].join("\n"),
      verifyPath: "/calculators/capital-gains-tax/",
    });
  }

  return cards;
}

export const SOCIAL_CARDS = buildCards();

export function cardBySlug(slug: string): SocialCard | undefined {
  return SOCIAL_CARDS.find(c => c.slug === slug);
}
