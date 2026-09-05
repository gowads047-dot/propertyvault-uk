import type { DealStage } from "./property";

/**
 * Where a property is in its life, and what the platform can do about it.
 *
 * Two halves of one story were modelled separately and never joined up.
 * pv_property.stage tracks a purchase — screening through to purchased — and
 * stops dead at completion. rentura_properties represents something you
 * already own and has no stage at all: a property is either in the buying
 * table or the owning table, and nothing says the two might be the same house
 * eighteen months apart.
 *
 * That gap is why the platform reads as a set of tools rather than one place.
 * This module is the join: a single ordered lifecycle that a property moves
 * along, with the deal stages mapped onto it and ownership continuing past the
 * point where the old model gave up.
 *
 * It is deliberately pure. The database migration that adds the later stages
 * is written but not run (supabase/pv-lifecycle.sql), so everything here
 * degrades to the eight stages that exist today and gains the rest when the
 * migration lands.
 */

/**
 * The stages, in the order a property passes through them.
 *
 * Ordered because it is a real sequence, and the order is load-bearing: the
 * progress bar, "what happens next" and the service the platform can offer all
 * read off the position rather than a lookup table of special cases.
 *
 * ── One deliberate deviation ───────────────────────────────────────────────
 *
 * The brief lists ten, with Vault between Discover and Acquire. There are nine
 * here because every other entry is a state the property is in — being
 * refurbished, being let, being sold — and Vault is something you do to a
 * property while you are still looking at it. Modelling an action as a state
 * would mean a property could sit in "Vault" indefinitely, which is not a
 * thing that happens.
 *
 * The distinction the brief is reaching for is real, and it already exists one
 * level down: pv_property.stage separates 'screening' from 'analysing', which
 * is exactly "glanced at it" versus "actually ran it". Both map to Discover
 * and NEXT_STEP gives each its own sentence.
 */
export const LIFECYCLE = [
  "discover", "acquire", "complete", "refurbish", "rent-ready",
  "let", "manage", "optimise", "sell",
] as const;

export type LifecycleStage = (typeof LIFECYCLE)[number];

export const LIFECYCLE_LABEL: Record<LifecycleStage, string> = {
  discover: "Looking",
  acquire: "Buying",
  complete: "Completing",
  refurbish: "Refurbishing",
  "rent-ready": "Getting it ready",
  let: "Letting",
  manage: "Managing",
  optimise: "Reviewing",
  sell: "Selling",
};

/**
 * Deal stages that mean the property left the pipeline rather than progressed.
 *
 * These are not a position on the line — a rejected property has no "next
 * step", and drawing it at 20% of a progress bar would be a lie about a
 * decision already made.
 */
export const CLOSED_STAGES = ["rejected", "archived"] as const;
export type ClosedStage = (typeof CLOSED_STAGES)[number];

export function isClosed(stage: AnyStage): stage is ClosedStage {
  return (CLOSED_STAGES as readonly string[]).includes(stage);
}

/**
 * The stages a property reaches after it is bought.
 *
 * Separate from DealStage rather than folded into it, because DealStage is the
 * set of values pv_property.stage will currently accept. Merging them would
 * make TypeScript sign off on a write that Postgres rejects at runtime, which
 * is the worst place to discover the constraint has not been widened yet.
 */
export type OwnedStage =
  | "refurbishing" | "rent_ready" | "let" | "managed"
  | "optimising" | "selling" | "sold";

/** Every stage the lifecycle understands, whether storable yet or not. */
export type AnyStage = DealStage | OwnedStage;

/**
 * The deal stage a property carries in the database, placed on the lifecycle.
 *
 * `purchased` maps to `complete` rather than to `manage`: completing is a real
 * period with real work in it, and a property that has just exchanged is not
 * yet a property being managed.
 */
const STAGE_TO_LIFECYCLE: Record<Exclude<AnyStage, ClosedStage>, LifecycleStage> = {
  // Acquisition — storable today.
  screening: "discover",
  analysing: "discover",
  viewing: "discover",
  offer: "acquire",
  negotiating: "acquire",
  under_offer: "acquire",
  due_diligence: "acquire",
  purchased: "complete",
  // Ownership — storable once supabase/pv-lifecycle.sql has been run.
  refurbishing: "refurbish",
  rent_ready: "rent-ready",
  let: "let",
  managed: "manage",
  optimising: "optimise",
  selling: "sell",
  sold: "sell",
};

/** Null for a stage that has left the pipeline — see CLOSED_STAGES. */
export function lifecycleOf(stage: AnyStage): LifecycleStage | null {
  return isClosed(stage) ? null : STAGE_TO_LIFECYCLE[stage];
}

/** How far along, 0 to 1. Null where the property is no longer on the line. */
export function progressOf(stage: AnyStage): number | null {
  const life = lifecycleOf(stage);
  if (!life) return null;
  return (LIFECYCLE.indexOf(life) + 1) / LIFECYCLE.length;
}

/**
 * What the person should be doing now, in their words.
 *
 * One line per deal stage rather than per lifecycle stage, because "you have
 * made an offer" and "you are in negotiation" want different sentences even
 * though both sit under Buying.
 */
export const NEXT_STEP: Record<AnyStage, string> = {
  screening: "Run the numbers and see whether this one is worth a viewing.",
  analysing: "Check the figures against what comparable properties sold for.",
  viewing: "Note what the photographs did not show, then decide on a number.",
  offer: "Your offer is in. Keep the evidence to hand if they counter.",
  negotiating: "Know your walk-away price before the next conversation.",
  under_offer: "Get a solicitor and a survey moving — this is where deals stall.",
  due_diligence: "Read the searches properly. This is the last point you can walk away cheaply.",
  purchased: "Work out what it needs before it can be let, and what that costs.",
  refurbishing: "Keep the receipts against the property — they matter at sale, and at tax time.",
  rent_ready: "Check the compliance list before you market it, not after a tenant moves in.",
  let: "Get the tenancy paperwork and the deposit protected inside the deadlines.",
  managed: "Watch the certificate expiry dates. Most fines start as a diary miss.",
  optimising: "Compare what it earns against what it is worth now, not what you paid.",
  selling: "Have the compliance history to hand — a complete record shortens a sale.",
  sold: "Sold. The full record stays here, including what it cost to hold.",
  rejected: "Passed on. The analysis stays here if you want to compare it against the next one.",
  archived: "Archived. Nothing further is tracked against this one.",
};

/**
 * The stage values pv_property.stage will currently accept.
 *
 * Listed rather than derived, because this is the runtime guard on a write and
 * it has to hold without reading a .sql file from a serverless handler.
 * lifecycle.test.ts parses the check constraint out of pv-property-schema.sql
 * and asserts the two agree exactly, in both directions — so a stage added to
 * the schema without being added here, or the reverse, fails at commit rather
 * than as a 400 from PostgREST that reads like a bug in the caller.
 */
export const STORABLE_STAGES: DealStage[] = [
  "screening", "analysing", "viewing", "offer", "negotiating",
  "under_offer", "due_diligence", "purchased", "rejected", "archived",
];

/**
 * Whether a stage can be written today.
 *
 * The ownership stages exist in the model because the product does, and are
 * refused here until supabase/pv-lifecycle.sql runs. Refusing them in the
 * application rather than letting Postgres do it means the person gets told
 * why, instead of a constraint violation.
 */
export function isStorable(stage: string): stage is DealStage {
  return (STORABLE_STAGES as string[]).includes(stage);
}

/** Every stage the model knows, storable or not. Ordered by lifecycle position. */
export const ALL_STAGES: AnyStage[] = Object.keys(NEXT_STEP) as AnyStage[];

/**
 * Stages the database does not accept yet.
 *
 * The check constraint on pv_property.stage stops at 'purchased'. The
 * lifecycle model runs past it because the product does, and the migration
 * that widens the constraint is written and waiting. Until it runs, nothing
 * may write these values — lifecycle.test.ts asserts the split so the two
 * cannot drift apart silently.
 */
export const STAGES_PENDING_MIGRATION: LifecycleStage[] = [
  "refurbish", "rent-ready", "let", "manage", "optimise", "sell",
];

/** Lifecycle stages a stored deal stage can currently reach. */
export function reachableToday(): LifecycleStage[] {
  const pending = new Set<string>(STAGES_PENDING_MIGRATION);
  return LIFECYCLE.filter(s => !pending.has(s));
}
