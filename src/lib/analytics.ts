/**
 * Thin wrapper over the Google Analytics gtag call.
 *
 * GA has been loaded site-wide since the start but never called beyond the
 * automatic pageview, so nothing downstream of a page load was measurable.
 * The question "why are there no signups?" could not be answered, because
 * there was no way to tell whether nobody saw the form, saw it and ignored
 * it, or tried it and hit an error.
 *
 * Deliberately no-ops when gtag is absent — ad blockers, consent refusals and
 * server-side rendering all remove it, and a missing analytics call must
 * never break a form submission.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagParams) => void;
  }
}

export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
  } catch {
    // Analytics must never take a form down with it.
  }
}

/**
 * Every event the site emits, named in one place to avoid typos.
 *
 * Until now this held five signup events and nothing else, which meant no
 * question about the funnel could be answered with data — including which of
 * the twenty-three calculators earns its place, and whether anyone who lands
 * on a tool ever reaches a service. Prioritisation was argument, not evidence.
 *
 * The names are snake_case because that is what GA reports on, and they are
 * grouped by the journey stage they measure so a gap in the funnel is visible
 * here rather than only in the reporting.
 */
export const events = {
  // Signup
  signupShown: "signup_form_shown",
  signupDismissed: "signup_form_dismissed",
  signupSubmitted: "signup_submitted",
  signupSucceeded: "signup_succeeded",
  signupFailed: "signup_failed",

  // Discover — someone arrives on a free tool and uses it
  toolUsed: "tool_used",
  calculatorCompleted: "calculator_completed",

  // Vault — the analysis funnel, which is the route into everything else
  vaultStarted: "vault_started",
  vaultCompleted: "vault_completed",
  vaultSaved: "vault_saved",
  vaultClaimed: "vault_claimed",

  // Ask — the agent
  askSubmitted: "ask_submitted",
  askAnswered: "ask_answered",

  // The property record — the page the whole lifecycle hangs off
  propertyViewed: "property_viewed",

  // Services — the commercial funnel
  serviceViewed: "service_viewed",
  serviceEnquiry: "service_enquiry_started",
  serviceEnquirySent: "service_enquiry_sent",
  waitlistJoined: "waitlist_joined",

  // Movement between pages, which is how you see whether the free tools feed
  // anything. `from` and `to` are slugs, not display names.
  ctaClicked: "cta_clicked",

  // Checkout
  checkoutStarted: "checkout_started",
} as const;

export type EventName = (typeof events)[keyof typeof events];

/**
 * Params carried by service and tool events.
 *
 * `service` and `tool` are slugs rather than display names so a copy change on
 * a page does not silently split one metric into two in the GA reports.
 */
export type ServiceParams = { service: string; source?: string };
export type ToolParams = { tool: string; source?: string };
