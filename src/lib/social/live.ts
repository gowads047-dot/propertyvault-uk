import type { Fetcher } from "../instagram";
import { MAIL_FROM, REPLY_TO } from "../site";
import type { AssetFetcher } from "./qc";
import type { AlertSender } from "./publisher";

/**
 * The real adapters the routes hand to the pure functions.
 *
 * Everything under src/lib/social takes its network as an argument. These are
 * the arguments: global fetch narrowed to the shapes lib/instagram.ts and qc.ts
 * ask for, and a Resend sender. Kept in one file so the routes are nothing but
 * auth, configuration checks and a call.
 */

/** Graph API calls, as lib/instagram.ts wants them. */
export const graphFetcher: Fetcher = (url, init) =>
  fetch(url, init).then(r => ({ ok: r.ok, status: r.status, json: () => r.json() }));

/**
 * The asset check. redirect:"manual" is passed straight through — following
 * a redirect here would hide the very thing Meta refuses. The body is never
 * wanted; cancelling it releases the connection instead of downloading a
 * video to look at its headers.
 */
export const assetFetcher: AssetFetcher = async (url, init) => {
  const r = await fetch(url, init);
  await r.body?.cancel().catch(() => {});
  return { status: r.status, headers: r.headers };
};

export interface Mail {
  subject: string;
  text: string;
  html?: string;
}

/**
 * A sender over Resend's HTTP API, matching the other cron routes.
 *
 * Returns ok:false with Resend's own message on a non-2xx rather than
 * throwing, so a caller can record "alert not sent" against the run.
 */
export function resendSender(
  opts: { apiKey: string; to: string; fetcher?: typeof fetch },
): (mail: Mail) => Promise<{ ok: boolean; error?: string }> {
  const f = opts.fetcher ?? fetch;
  return async mail => {
    try {
      const res = await f("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
        body: JSON.stringify({
          from: MAIL_FROM,
          replyTo: REPLY_TO,
          to: opts.to,
          subject: mail.subject,
          text: mail.text,
          ...(mail.html ? { html: mail.html } : {}),
        }),
      });
      if (res.ok) return { ok: true };
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    } catch (e) {
      return { ok: false, error: `Resend unreachable: ${e instanceof Error ? e.message : String(e)}` };
    }
  };
}

/** The alert sender for a run, or null — which the publisher reports loudly. */
export function alertSenderFromEnv(to: string): AlertSender | null {
  const key = process.env.RESEND_API_KEY;
  return key ? resendSender({ apiKey: key, to }) : null;
}
