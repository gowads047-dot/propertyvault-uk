/**
 * Every environment variable this application reads, and what goes wrong
 * without it.
 *
 * Written after a day in which three separate features turned out to be dead
 * or unverifiable because of a missing variable, with nothing anywhere saying
 * which variable enabled what:
 *
 *   CRON_SECRET            unset, every scheduled job is refused — and before
 *                          it failed closed, an unset value authorised anyone
 *                          sending "Bearer undefined"
 *   ADMIN_EMAIL            unset, the admin gate denies everyone, including
 *                          the owner, with no message
 *   NEXT_PUBLIC_SITE_URL   unset, Stripe redirect URLs became
 *                          "undefined/academy/dashboard" and checkout failed
 *
 * The point is not that these should have fallbacks — several deliberately
 * must not. It is that a missing one should be findable in seconds instead of
 * inferred from a feature quietly not working.
 *
 * A test walks the source for `process.env.X` and fails if anything here is
 * missing or stale, so this cannot drift from what the code actually reads.
 */

export interface EnvVar {
  /** True when the application is broken for everyone without it. */
  required: boolean;
  /** What it turns on. */
  enables: string;
  /** What actually happens when it is absent. */
  withoutIt: string;
}

export const ENV_MANIFEST: Record<string, EnvVar> = {
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    enables: "Every database read and write, and the rate limiter's store.",
    withoutIt: "Nothing that touches data works. Metered routes fail closed with 503.",
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    enables: "Sign-in, and every client-side query subject to row level security.",
    withoutIt: "Nobody can sign in, so every page behind an account is unreachable.",
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    enables: "Server-side writes that bypass RLS, and the rate limiter.",
    withoutIt: "Every rate-limited route fails closed with 503 — including the contact form.",
  },

  ANTHROPIC_API_KEY: {
    required: false,
    enables: "The agent, the deal verdict, both chats and the document extractors.",
    withoutIt: "Those routes answer 500 with a configuration message. The rest of the site is unaffected.",
  },
  RESEND_API_KEY: {
    required: false,
    enables: "Every outbound email: enquiries, invites, reminders, the starter pack.",
    withoutIt: "Sends are skipped. The enquiry is still recorded, and the caller is told.",
  },

  CRON_SECRET: {
    required: false,
    enables: "All six scheduled jobs. Must be at least 16 characters.",
    withoutIt: "Every cron is refused with 401, and the function log says which case it is.",
  },
  ADMIN_EMAIL: {
    required: false,
    enables: "Naming a different admin than the address the site publishes.",
    withoutIt: "Falls back to CONTACT_EMAIL, so the owner can sign in as that address and get through.",
  },

  STRIPE_SECRET_KEY: {
    required: false,
    enables: "Checkout and the billing portal.",
    withoutIt: "Nobody can subscribe or manage a subscription.",
  },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    enables: "Verifying that a webhook really came from Stripe.",
    withoutIt: "Payments complete but no subscription is recorded against the user.",
  },
  STRIPE_PRICE_ID: {
    required: false,
    enables: "The Academy subscription price.",
    withoutIt: "Academy checkout fails at session creation.",
  },
  RENTURA_STRIPE_PRICE_ID: {
    required: false,
    enables: "The Rentura subscription price.",
    withoutIt: "Rentura checkout fails at session creation.",
  },

  INSTAGRAM_ACCESS_TOKEN: {
    required: false,
    enables: "Publishing the daily Reel.",
    withoutIt: "The evening cron fails loudly. The campaign is date-driven, so the day's video is skipped permanently.",
  },
  INSTAGRAM_USER_ID: {
    required: false,
    enables: "Which Instagram account the Reel is published to.",
    withoutIt: "Publishing fails, same as above.",
  },
  REEL_CAMPAIGN_START: {
    required: false,
    enables: "Overriding the campaign's first day.",
    withoutIt: "The schedule uses its built-in start date. Only needed to shift the run.",
  },

  NEXT_PUBLIC_SITE_URL: {
    required: false,
    enables: "Pointing redirects and email links at a specific deployment.",
    withoutIt: "Falls back to the canonical site URL, which is correct for production.",
  },
};

/** Names the application cannot start usefully without. */
export function requiredVars(): string[] {
  return Object.entries(ENV_MANIFEST).filter(([, v]) => v.required).map(([k]) => k);
}

/**
 * Which manifest variables are absent from the given environment.
 *
 * Takes the environment as an argument so it can be tested, and returns names
 * only — a report that printed values would be a report nobody could paste.
 */
export function missingFrom(env: Record<string, string | undefined>): {
  missingRequired: string[];
  missingOptional: string[];
} {
  const absent = (k: string) => !env[k] || env[k]!.trim() === "";
  return {
    missingRequired: requiredVars().filter(absent),
    missingOptional: Object.keys(ENV_MANIFEST).filter(k => !ENV_MANIFEST[k].required && absent(k)),
  };
}
