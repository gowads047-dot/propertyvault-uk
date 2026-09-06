/**
 * The service catalogue — one source of truth for what PropertyVault offers
 * and, just as importantly, what it does not offer yet.
 *
 * This module exists because the site had drifted into advertising things it
 * cannot deliver. /manage listed nine services with firm prices — tenant
 * referencing "From £15/tenant, results in 24-48 hours", rent collection at
 * "1% of rent collected", inventories "From £10/report" — and there is no
 * referencing, collection or inventory integration anywhere in the codebase,
 * nor a Stripe price for any of them. Two Stripe prices exist in total. A
 * visitor reading that page would have formed an entirely false idea of what
 * they could buy.
 *
 * So readiness is a required field. A service cannot be listed without saying
 * what actually happens when someone clicks, and services.test.ts refuses a
 * price on anything that is not live.
 */

import { guaranteedRentCities } from "./site";

/**
 * What happens when someone acts on this service, stated plainly.
 *
 * The distinction that matters is not how finished the software is, it is what
 * the customer gets. `request` and `waitlist` look similar on screen and are
 * completely different promises: one is answered, the other is recorded.
 */
export type Readiness =
  /** Buy or use it now, unaided. A price exists and is charged. */
  | "live"
  /** Send a request and a human answers. No automated fulfilment. */
  | "request"
  /** Not operating. Registering interest is all that happens. */
  | "waitlist";
//
// There was a fourth state, "partner", meaning "we introduce you to a vetted
// professional who does the work". Nothing was ever in it after /find-agent
// stopped claiming to have vetted anybody, and its description was the exact
// promise that page was removed for making. A readiness nothing carries is a
// claim waiting for the next service to reach for it, so it is gone. Bring it
// back the day a verification standard exists and somebody is applying it.

export const READINESS_LABEL: Record<Readiness, string> = {
  live: "Available now",
  request: "By request",
  waitlist: "Coming soon",
};

/** What the customer should expect. Shown wherever the label is shown. */
export const READINESS_MEANING: Record<Readiness, string> = {
  live: "Start straight away — no waiting on us",
  request: "Tell us about the property and we reply with a quote",
  waitlist: "Not running yet. Join the list and we will tell you when it is",
};

/** The stage of ownership a service belongs to. */
export type Stage =
  | "discover" | "acquire" | "complete" | "refurbish"
  | "rent-ready" | "let" | "manage" | "optimise" | "sell";

export const STAGE_LABEL: Record<Stage, string> = {
  discover: "Finding a property",
  acquire: "Buying it",
  complete: "Completing",
  refurbish: "Refurbishing",
  "rent-ready": "Getting it rent ready",
  let: "Letting it",
  manage: "Managing it",
  optimise: "Improving returns",
  sell: "Selling",
};

export type Service = {
  slug: string;
  name: string;
  /** One line: what the customer gets, in their words not ours. */
  summary: string;
  stage: Stage;
  readiness: Readiness;
  /**
   * Only ever set on a `live` service, and only when a Stripe price or a
   * published rate genuinely backs it. Enforced by services.test.ts.
   */
  price?: string;
  /** Where the button goes. A waitlist service points at the waitlist. */
  href: string;
  /** What the button says. Must describe what actually happens. */
  cta: string;
};

export const SERVICES: Service[] = [
  {
    slug: "vault",
    name: "Vault a Property",
    summary: "Score a property against sold evidence and get the most you should offer, with every figure sourced.",
    stage: "discover",
    readiness: "live",
    href: "/vault",
    cta: "Vault a property",
  },
  {
    slug: "ask",
    name: "Ask PropertyVault",
    summary: "Describe a property in plain English. The agent looks up what it can and shows its working.",
    stage: "discover",
    readiness: "live",
    href: "/ask",
    cta: "Ask a question",
  },
  {
    slug: "vaultcheck-pro",
    name: "VaultCheck Pro",
    summary: "A written pre-offer report on one property — sold comparables, planning, tenure and the risks worth a second look.",
    stage: "acquire",
    readiness: "waitlist",
    href: "/services/vaultcheck-pro",
    cta: "Join the waitlist",
  },
  {
    slug: "professionals",
    name: "Find a Professional",
    summary: "Which regulator covers a broker, a conveyancer, a surveyor or a letting agent, where their public register is, and what to check before you instruct anybody.",
    stage: "complete",
    // Was "partner", which claims we introduce you to somebody vetted. We do
    // not: there is no panel and no verification standard. The page tells you
    // how to check a professional yourself, which works today and unaided.
    readiness: "live",
    // Points at the existing directory rather than a new URL. Rebuilding the
    // network as a vetted panel is later work, and moving the page before that
    // exists would spend its search ranking for nothing.
    href: "/find-agent",
    cta: "How to check a professional",
  },
  {
    slug: "refurb-planning",
    name: "Refurb Planning",
    summary: "A costed scope of works before you commit, so the budget is a plan rather than a hope.",
    stage: "refurbish",
    readiness: "waitlist",
    href: "/services/refurb-planning",
    cta: "Join the waitlist",
  },
  {
    slug: "rent-ready",
    name: "Rent Ready",
    summary: "Work out what a property needs before it can be let, and what is legally required versus merely sensible.",
    stage: "rent-ready",
    readiness: "waitlist",
    href: "/services/rent-ready",
    cta: "Join the waitlist",
  },
  {
    slug: "tenant-find",
    name: "Tenant Find",
    summary: "Marketing, viewings and referencing, handed over with the tenancy ready to start.",
    stage: "let",
    readiness: "waitlist",
    href: "/services/tenant-find",
    cta: "Join the waitlist",
  },
  {
    slug: "guaranteed-rent",
    name: "Guaranteed Rent",
    summary: `A fixed rent every month on a 3–5 year lease, paid whether the property is occupied or not. Currently ${guaranteedRentCities.length} cities.`,
    stage: "let",
    readiness: "request",
    href: "/guaranteed-rent",
    cta: "Get a rent estimate",
  },
  {
    slug: "rentura",
    name: "Rentura",
    summary: "The landlord dashboard — properties, tenancies, compliance dates, maintenance and documents in one place.",
    stage: "manage",
    readiness: "live",
    price: "£9.99/month",
    href: "/rentura",
    cta: "Start free for 30 days",
  },
  {
    slug: "compliance-care",
    name: "Compliance Care",
    summary: "We track the certificates and dates for you and book the renewals before they lapse.",
    stage: "manage",
    readiness: "waitlist",
    href: "/services/compliance-care",
    cta: "Join the waitlist",
  },
  {
    slug: "portfolio-review",
    name: "Portfolio Review",
    summary: "A look across everything you own — where the yield actually is, and what is quietly costing you.",
    stage: "optimise",
    readiness: "waitlist",
    href: "/services/portfolio-review",
    cta: "Join the waitlist",
  },
];

/** The catalogue in lifecycle order, which is the order a customer meets it. */
export const STAGE_ORDER: Stage[] = [
  "discover", "acquire", "complete", "refurbish",
  "rent-ready", "let", "manage", "optimise", "sell",
];

export function servicesByStage(): { stage: Stage; label: string; services: Service[] }[] {
  return STAGE_ORDER
    .map(stage => ({
      stage,
      label: STAGE_LABEL[stage],
      services: SERVICES.filter(s => s.stage === stage),
    }))
    .filter(group => group.services.length > 0);
}

export function findService(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug);
}
