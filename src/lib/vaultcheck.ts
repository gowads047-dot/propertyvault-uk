import type { EvidenceState } from "./property";

/**
 * What a VaultCheck report covers, and who can actually answer each part.
 *
 * The service was a name on a waitlist page with three lines of marketing under
 * it. That is the weakest possible version: it asks somebody to register
 * interest in a thing nobody has described, and it gives us nothing to build
 * against.
 *
 * This is the description. Sixteen questions a buyer needs answered before
 * offering, each tagged with how it gets answered — from evidence the platform
 * already holds, by a person doing work, or by a professional whose job it
 * legally is. That last category matters: a structural opinion is a surveyor's
 * and a title opinion is a solicitor's, and a report that blurs the line is
 * the thing the brief forbids most plainly.
 *
 * It also makes the pitch honest and specific. Instead of "a written pre-offer
 * report", a customer sees that the free Vault already answers eight of these
 * from their own record, and exactly which six a paid report would add.
 */

/** Who answers a question, which decides what the platform may claim. */
export type Answerer =
  /** Already in the property record, from evidence the platform holds. */
  | "evidence"
  /** A person at PropertyVault does the work. Not automated, not instant. */
  | "analyst"
  /** A regulated professional. PropertyVault introduces, never opines. */
  | "professional";

export const ANSWERER_LABEL: Record<Answerer, string> = {
  evidence: "Free in the Vault",
  analyst: "A VaultCheck adds this",
  professional: "Needs a professional",
};

export const ANSWERER_MEANING: Record<Answerer, string> = {
  evidence: "The free Vault answers this from evidence it can source itself",
  analyst: "Someone works this out by hand — it is not something the free tools do",
  professional: "A surveyor or solicitor answers this. We introduce you; we do not advise",
};

export type Check = {
  id: string;
  /** The question, as the buyer would ask it. */
  question: string;
  answerer: Answerer;
  /**
   * The pv_evidence fields that answer it. Only on `evidence` checks, and
   * required there — a check claiming to be answered has to say from what.
   */
  fields?: string[];
  /** Why it matters, in one line. */
  why: string;
};

export type Section = { id: string; title: string; checks: Check[] };

export const REPORT: Section[] = [
  {
    id: "value",
    title: "What it is worth",
    checks: [
      {
        id: "comparables",
        question: "What did comparable properties nearby actually sell for?",
        answerer: "evidence",
        fields: ["area_median_sold"],
        why: "An asking price is an opinion. A sold price is a record.",
      },
      {
        id: "price-position",
        question: "Is this priced above or below the local market?",
        answerer: "evidence",
        fields: ["price_vs_area"],
        why: "Tells you whether there is room to negotiate before you open your mouth.",
      },
      {
        id: "max-offer",
        question: "What is the most I should offer and still hit my target?",
        answerer: "evidence",
        fields: ["maximum_offer"],
        why: "A walk-away number decided before the conversation, not during it.",
      },
      {
        id: "sale-history",
        question: "Has this exact property sold before, and for how much?",
        answerer: "analyst",
        why: "A recent resale at a much lower figure is worth understanding before you offer.",
      },
    ],
  },
  {
    id: "numbers",
    title: "Whether the numbers work",
    checks: [
      {
        id: "yield",
        question: "What does it yield, gross and net?",
        answerer: "evidence",
        fields: ["gross_yield", "net_yield"],
        why: "Gross flatters every property. Net is the one that pays you.",
      },
      {
        id: "cash",
        question: "How much cash do I need to get in?",
        answerer: "evidence",
        fields: ["cash_required", "stamp_duty"],
        why: "Deposit, stamp duty and fees — the money that actually leaves your account.",
      },
      {
        id: "cashflow",
        question: "Does it put money in my pocket each month?",
        answerer: "evidence",
        fields: ["monthly_cashflow"],
        why: "A property that loses money monthly is a bet on the price, not an income.",
      },
      {
        id: "stress",
        question: "What happens if rates rise?",
        answerer: "evidence",
        fields: ["stress_test"],
        why: "The figure that decides whether a deal survives a fixed rate ending.",
      },
    ],
  },
  {
    id: "property",
    title: "What the property itself carries",
    checks: [
      {
        id: "planning",
        question: "Is it in a conservation area, listed, or otherwise constrained?",
        answerer: "evidence",
        fields: ["planning_constraints"],
        why: "Changes what you can do to it, and what it costs to do anything at all.",
      },
      {
        id: "tenure",
        question: "Freehold or leasehold, and if leasehold, how long is left?",
        answerer: "analyst",
        why: "A short lease can cost tens of thousands to extend and blocks some lenders.",
      },
      {
        id: "flood",
        question: "What is the flood risk here?",
        answerer: "analyst",
        why: "Affects insurance, lending and resale, and does not show in the photographs.",
      },
      {
        id: "epc",
        question: "What is the EPC rating, and what would improving it cost?",
        answerer: "analyst",
        why: "The minimum rating for a new let is a moving target. Budget for it now.",
      },
    ],
  },
  {
    id: "letting",
    title: "Whether you can let it",
    checks: [
      {
        id: "licensing",
        question: "Does this council require a licence for this property?",
        answerer: "analyst",
        why: "Additional and selective schemes vary street by street. Getting it wrong is a fine.",
      },
      {
        id: "rent",
        question: "What rent would it realistically achieve?",
        answerer: "analyst",
        why: "Every number above moves with this one, and asking prices for lettings are optimistic.",
      },
    ],
  },
  {
    id: "professional",
    title: "What we will not tell you",
    checks: [
      {
        id: "structure",
        question: "Is the building structurally sound?",
        answerer: "professional",
        why: "That is a survey. No report written from a desk can answer it, including ours.",
      },
      {
        id: "title",
        question: "Are there covenants, defects or search results that should worry me?",
        answerer: "professional",
        why: "A conveyancing solicitor's job. We will not read a title and tell you it is fine.",
      },
    ],
  },
];

export const ALL_CHECKS: Check[] = REPORT.flatMap(s => s.checks);

/** An evidence row, reduced to what deciding "is this answered" needs. */
export type EvidenceLike = { field: string; state: EvidenceState };

export type CheckResult = Check & {
  /**
   * Whether the record answers it today.
   *
   * Only ever true for an `evidence` check with a matching row in a state that
   * carries information. A row in state "missing" is a recorded absence — the
   * platform looked and found nothing — which is useful and is not an answer.
   */
  answered: boolean;
  /** The states of the rows that answered it, for the trust chips. */
  states: EvidenceState[];
};

/**
 * Planning field names are built from the constraint the register returned,
 * so the check names the family and matching has to allow the prefix.
 */
function matches(fieldSpec: string, actual: string): boolean {
  if (fieldSpec === "planning_constraints") return actual.startsWith("planning_");
  return fieldSpec === actual;
}

export function assess(evidence: EvidenceLike[]): CheckResult[] {
  return ALL_CHECKS.map(check => {
    if (check.answerer !== "evidence" || !check.fields) {
      return { ...check, answered: false, states: [] };
    }
    const rows = evidence.filter(e => check.fields!.some(f => matches(f, e.field)));
    const useful = rows.filter(e => e.state !== "missing");
    return { ...check, answered: useful.length > 0, states: useful.map(e => e.state) };
  });
}

/**
 * How many of the questions the record answers.
 *
 * Deliberately "answers 8 of 16", not a percentage and not a score. The brief
 * is right that a single number invites a reader to treat it as a verdict, and
 * a count of named questions can be checked line by line.
 */
export function coverage(evidence: EvidenceLike[]): {
  answered: number;
  total: number;
  byAnswerer: Record<Answerer, { answered: number; total: number }>;
} {
  const results = assess(evidence);
  const byAnswerer = { evidence: { answered: 0, total: 0 }, analyst: { answered: 0, total: 0 }, professional: { answered: 0, total: 0 } };
  for (const r of results) {
    byAnswerer[r.answerer].total += 1;
    if (r.answered) byAnswerer[r.answerer].answered += 1;
  }
  return {
    answered: results.filter(r => r.answered).length,
    total: results.length,
    byAnswerer,
  };
}
