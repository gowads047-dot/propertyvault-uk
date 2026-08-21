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

/** Events used by the signup funnel, named in one place to avoid typos. */
export const events = {
  signupShown: "signup_form_shown",
  signupDismissed: "signup_form_dismissed",
  signupSubmitted: "signup_submitted",
  signupSucceeded: "signup_succeeded",
  signupFailed: "signup_failed",
} as const;
