/**
 * Publishing a Reel through the Instagram Graph API.
 *
 * Separate from the cron route so the sequence can be tested without a network,
 * and so the awkward parts of Meta's API are documented once rather than
 * rediscovered each time:
 *
 *   - Publishing is two steps. Create a container, then publish it by id.
 *   - Meta fetches video_url itself. It must be a plain HTTPS URL with no
 *     query string and no redirect, which is why the videos are static files
 *     under /reels rather than generated per request.
 *   - A video container is not ready immediately. Publishing too early returns
 *     error 9007, so the status is polled until FINISHED.
 *   - Retrying quickly after a failure trips "too many actions" (code 4 / 9),
 *     so a failed publish is reported rather than hammered — the publisher
 *     waits before its single in-function retry, and only for the errors in
 *     TRANSIENT_CODES.
 *   - A container outlives the function that made it. If the run dies
 *     between media_publish and writing the row, the Reel is live and the row
 *     still says "publishing". containerStatus and recentMedia exist so the
 *     next run can find out which happened, rather than posting it twice.
 */

const GRAPH = "https://graph.instagram.com/v21.0";

export interface PublishInput {
  igUserId: string;
  accessToken: string;
  videoUrl: string;
  caption: string;
}

export interface PublishResult {
  ok: boolean;
  mediaId?: string;
  containerId?: string;
  error?: string;
  /** Meta's error code, when the failure was one Meta described. */
  code?: number;
  /** The HTTP status of the failing call. */
  httpStatus?: number;
  /** How many status polls were needed. Useful when this starts timing out. */
  polls?: number;
}

/** Meta's container states. FINISHED is the only one that can be published. */
export type ContainerStatus = "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED" | "PUBLISHED";

/**
 * Errors worth one more go, minutes later, with a fresh container:
 *   2     temporary API issue
 *   4     application request limit reached
 *   9     user request limit reached
 *   9007  media not ready (published too early)
 * A 190 (bad token) or a permission error is not on the list: retrying those
 * cannot help, and it spends the daily action budget on a certain failure.
 */
export const TRANSIENT_CODES: readonly number[] = [2, 4, 9, 9007];

export function isTransientFailure(r: { code?: number; httpStatus?: number; error?: string }): boolean {
  if (r.code !== undefined) return TRANSIENT_CODES.includes(r.code);
  if (r.httpStatus !== undefined) return r.httpStatus >= 500;
  // No code and no status: the fetch itself failed (DNS, reset, timeout).
  return typeof r.error === "string" && r.error.startsWith("network:");
}

/** Meta's "invalid or expired token" code. */
export const BAD_TOKEN_CODE = 190;

export interface Fetcher {
  (url: string, init?: { method?: string; body?: string; headers?: Record<string, string> }): Promise<{
    ok: boolean;
    status: number;
    json: () => Promise<unknown>;
  }>;
}

function readError(body: unknown, fallback: string): string {
  const e = (body as { error?: { message?: string; code?: number } } | null)?.error;
  if (!e) return fallback;
  return `${e.message ?? fallback}${e.code ? ` (code ${e.code})` : ""}`;
}

function readCode(body: unknown): number | undefined {
  const c = (body as { error?: { code?: unknown } } | null)?.error?.code;
  return typeof c === "number" ? c : undefined;
}

type StepFailure = { error?: string; code?: number; httpStatus?: number };

/** Step one: hand Meta the URL and get a container id back. */
export async function createReelContainer(
  input: PublishInput,
  fetcher: Fetcher,
): Promise<{ id?: string } & StepFailure> {
  const params = new URLSearchParams({
    media_type: "REELS",
    video_url: input.videoUrl,
    caption: input.caption,
    access_token: input.accessToken,
  });
  const res = await fetcher(`${GRAPH}/${input.igUserId}/media`, {
    method: "POST",
    body: params.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    return { error: readError(body, `container creation failed (HTTP ${res.status})`), code: readCode(body), httpStatus: res.status };
  }
  const id = (body as { id?: string } | null)?.id;
  return id ? { id } : { error: "container creation returned no id" };
}

/** Step two, part one: wait for Meta to finish processing the video. */
export async function waitForContainer(
  containerId: string,
  accessToken: string,
  fetcher: Fetcher,
  opts: { maxPolls?: number; sleep?: (ms: number) => Promise<void>; intervalMs?: number } = {},
): Promise<{ ready: boolean; polls: number } & StepFailure> {
  const maxPolls = opts.maxPolls ?? 20;
  const intervalMs = opts.intervalMs ?? 5_000;
  const sleep = opts.sleep ?? ((ms: number) => new Promise(r => setTimeout(r, ms)));

  for (let i = 1; i <= maxPolls; i++) {
    const res = await fetcher(
      `${GRAPH}/${containerId}?fields=status_code&access_token=${encodeURIComponent(accessToken)}`,
    );
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ready: false, polls: i, error: readError(body, `status check failed (HTTP ${res.status})`), code: readCode(body), httpStatus: res.status };
    }

    const status = (body as { status_code?: ContainerStatus } | null)?.status_code;
    if (status === "FINISHED") return { ready: true, polls: i };
    if (status === "ERROR" || status === "EXPIRED") {
      return { ready: false, polls: i, error: `container ${status.toLowerCase()}` };
    }
    if (i < maxPolls) await sleep(intervalMs);
  }
  return { ready: false, polls: maxPolls, error: "container still processing after maximum polls" };
}

/** Step two, part two: publish the finished container. */
export async function publishContainer(
  igUserId: string,
  containerId: string,
  accessToken: string,
  fetcher: Fetcher,
): Promise<{ id?: string } & StepFailure> {
  const params = new URLSearchParams({ creation_id: containerId, access_token: accessToken });
  const res = await fetcher(`${GRAPH}/${igUserId}/media_publish`, {
    method: "POST",
    body: params.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { error: readError(body, `publish failed (HTTP ${res.status})`), code: readCode(body), httpStatus: res.status };
  const id = (body as { id?: string } | null)?.id;
  return id ? { id } : { error: "publish returned no id" };
}

export interface PublishOpts {
  maxPolls?: number;
  sleep?: (ms: number) => Promise<void>;
  intervalMs?: number;
  /**
   * Called with the container id the moment Meta returns it, before any
   * polling. The publisher writes it to the row here, so a run that dies
   * during the wait leaves enough behind for the next run to ask Meta what
   * became of the container instead of making another.
   */
  onContainer?: (containerId: string) => Promise<void>;
}

function networkFailure(e: unknown, containerId?: string): PublishResult {
  return { ok: false, containerId, error: `network: ${e instanceof Error ? e.message : String(e)}` };
}

/**
 * The whole sequence. A fetch that throws — the network, not Meta — comes
 * back as ok:false with a "network:" error rather than propagating, so the
 * caller treats it as one more failed attempt with the same bookkeeping.
 */
export async function publishReel(
  input: PublishInput,
  fetcher: Fetcher,
  opts: PublishOpts = {},
): Promise<PublishResult> {
  let containerId: string | undefined;
  try {
    const created = await createReelContainer(input, fetcher);
    if (!created.id) return { ok: false, error: created.error, code: created.code, httpStatus: created.httpStatus };
    containerId = created.id;
    if (opts.onContainer) await opts.onContainer(created.id);

    const waited = await waitForContainer(created.id, input.accessToken, fetcher, opts);
    if (!waited.ready) {
      return { ok: false, containerId, error: waited.error, code: waited.code, httpStatus: waited.httpStatus, polls: waited.polls };
    }
    return publishFinished(input.igUserId, created.id, input.accessToken, fetcher, waited.polls);
  } catch (e) {
    return networkFailure(e, containerId);
  }
}

/** The last step on its own, for a container a previous run left FINISHED. */
export async function publishFinished(
  igUserId: string,
  containerId: string,
  accessToken: string,
  fetcher: Fetcher,
  polls = 0,
): Promise<PublishResult> {
  try {
    const published = await publishContainer(igUserId, containerId, accessToken, fetcher);
    if (!published.id) {
      return { ok: false, containerId, error: published.error, code: published.code, httpStatus: published.httpStatus, polls };
    }
    return { ok: true, mediaId: published.id, containerId, polls };
  } catch (e) {
    return networkFailure(e, containerId);
  }
}

/**
 * One status read. Null when Meta cannot or will not say — a deleted
 * container, a bad id, a network failure — which the caller treats the same
 * as EXPIRED: make a new one.
 */
export async function containerStatus(
  containerId: string,
  accessToken: string,
  fetcher: Fetcher,
): Promise<ContainerStatus | null> {
  try {
    const res = await fetcher(`${GRAPH}/${containerId}?fields=status_code&access_token=${encodeURIComponent(accessToken)}`);
    const body = (await res.json().catch(() => null)) as { status_code?: unknown } | null;
    const s = body?.status_code;
    return res.ok && typeof s === "string" ? (s as ContainerStatus) : null;
  } catch {
    return null;
  }
}

export interface RecentMedia {
  id: string;
  permalink: string | null;
  /** ISO 8601 as Meta gives it (+0000 offset). */
  timestamp: string | null;
}

/** The account's newest posts, newest first. Empty on any failure. */
export async function recentMedia(
  igUserId: string,
  accessToken: string,
  fetcher: Fetcher,
  limit = 5,
): Promise<RecentMedia[]> {
  try {
    const res = await fetcher(
      `${GRAPH}/${igUserId}/media?fields=id,permalink,timestamp&limit=${limit}&access_token=${encodeURIComponent(accessToken)}`,
    );
    const body = (await res.json().catch(() => null)) as { data?: unknown } | null;
    if (!res.ok || !Array.isArray(body?.data)) return [];
    return (body.data as { id?: unknown; permalink?: unknown; timestamp?: unknown }[])
      .filter(m => typeof m.id === "string")
      .map(m => ({
        id: m.id as string,
        permalink: typeof m.permalink === "string" ? m.permalink : null,
        timestamp: typeof m.timestamp === "string" ? m.timestamp : null,
      }));
  } catch {
    return [];
  }
}
