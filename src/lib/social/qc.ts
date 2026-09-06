import { findBannedClaims } from "./claims";

/**
 * The checks a post has to pass before it is handed to Meta.
 *
 * Each one is a failure that has either happened or is a single typo away:
 *
 *   - Meta fetches the video itself. A URL that redirects, is not https, or
 *     serves the wrong content type fails at container creation with an
 *     error that says nothing about which of those it was. Checking here says.
 *   - A file under 100kB is not a rendered Reel; it is a placeholder, a
 *     truncated write or an error page with a .mp4 name.
 *   - Instagram truncates captions over 2,200 characters and treats a post
 *     with dozens of hashtags as spam.
 *   - The standing rule on claims applies to every row in the queue, not only
 *     the thirty the calendar test can see.
 *   - Publishing the same video twice is the fastest way to be marked as
 *     reused content. The digest catches it, except for an evergreen clone,
 *     which is a repeat on purpose and says so in source_refs.
 */

/** The subset of a post the checks read. */
export interface QcInput {
  asset_url: string;
  asset_sha256: string | null;
  caption: string;
  channel: string;
  source_refs?: Record<string, unknown> | null;
}

/**
 * The fetch the asset checks use. Narrower than global fetch so a test can
 * hand in a table of URLs; redirect is always "manual" because following one
 * would hide exactly the thing Meta rejects.
 */
export interface AssetFetcher {
  (url: string, init: { method: "HEAD" | "GET"; redirect: "manual" }): Promise<{
    status: number;
    headers: { get(name: string): string | null };
  }>;
}

export interface QcCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface QcResult {
  ok: boolean;
  checks: QcCheck[];
}

export const MIN_ASSET_BYTES = 100_000;
export const MAX_CAPTION_CHARS = 2_200;
export const MIN_HASHTAGS = 5;
export const MAX_HASHTAGS = 30;

export async function qualityCheck(
  post: QcInput,
  fetcher: AssetFetcher,
  deps: { alreadyPublished: (channel: string, sha: string) => Promise<boolean> },
): Promise<QcResult> {
  const checks: QcCheck[] = [];
  const add = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail });

  // ── The URL itself ─────────────────────────────────────────────────────
  let url: URL | null = null;
  try { url = new URL(post.asset_url); } catch { url = null; }
  const plainHttps = url !== null && url.protocol === "https:" && url.search === "" && url.hash === "";
  add("asset_url", plainHttps,
    plainHttps ? "https, no query string" : `must be a plain https URL with no query string or fragment: ${post.asset_url}`);

  // ── What the URL serves ────────────────────────────────────────────────
  if (plainHttps) {
    let res: Awaited<ReturnType<AssetFetcher>> | null = null;
    let error: string | null = null;
    try {
      res = await fetcher(post.asset_url, { method: "HEAD", redirect: "manual" });
      // Some hosts refuse HEAD. A GET answers the same questions from its
      // headers; the body is never read.
      if (res.status === 405) res = await fetcher(post.asset_url, { method: "GET", redirect: "manual" });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    if (!res) {
      add("asset_reachable", false, `could not fetch: ${error}`);
    } else {
      const redirected = res.status >= 300 && res.status < 400;
      add("asset_reachable", res.status === 200,
        res.status === 200 ? "HTTP 200" : redirected ? `redirects (HTTP ${res.status}) — Meta will not follow it` : `HTTP ${res.status}`);

      const type = res.headers.get("content-type") ?? "";
      const isMp4 = /^video\/mp4\b/i.test(type);
      add("asset_content_type", isMp4, isMp4 ? type : `content-type is "${type || "missing"}", expected video/mp4`);

      const length = Number(res.headers.get("content-length"));
      const bigEnough = Number.isFinite(length) && length > MIN_ASSET_BYTES;
      add("asset_size", bigEnough,
        bigEnough ? `${length} bytes` : `content-length is ${res.headers.get("content-length") ?? "missing"}, need more than ${MIN_ASSET_BYTES}`);
    }
  }

  // ── The caption ────────────────────────────────────────────────────────
  add("caption_length", post.caption.length <= MAX_CAPTION_CHARS,
    `${post.caption.length} of ${MAX_CAPTION_CHARS} characters`);

  const tags = post.caption.match(/(^|\s)#[a-z0-9_]+/gi)?.length ?? 0;
  add("hashtags", tags >= MIN_HASHTAGS && tags <= MAX_HASHTAGS,
    `${tags} hashtags (allowed ${MIN_HASHTAGS}-${MAX_HASHTAGS})`);

  const claims = findBannedClaims(post.caption);
  add("claims", claims.length === 0,
    claims.length === 0 ? "no banned claim" : `matches banned claim(s): ${claims.join(" ; ")}`);

  // ── Duplicates ─────────────────────────────────────────────────────────
  const isClone = typeof post.source_refs?.evergreen_of === "string";
  if (isClone) {
    add("duplicate", true, `evergreen repeat of ${post.source_refs?.evergreen_of}, on purpose`);
  } else if (!post.asset_sha256) {
    add("duplicate", false, "no asset_sha256 recorded — the seed script computes it; a row without one cannot be checked for repeats");
  } else {
    const dup = await deps.alreadyPublished(post.channel, post.asset_sha256);
    add("duplicate", !dup, dup ? `an asset with digest ${post.asset_sha256.slice(0, 12)}… has already been published` : "not previously published");
  }

  return { ok: checks.every(c => c.ok), checks };
}
