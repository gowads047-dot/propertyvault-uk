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
 *     so a failed publish is reported rather than hammered.
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
  /** How many status polls were needed. Useful when this starts timing out. */
  polls?: number;
}

/** Meta's container states. FINISHED is the only one that can be published. */
type ContainerStatus = "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED" | "PUBLISHED";

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

/** Step one: hand Meta the URL and get a container id back. */
export async function createReelContainer(
  input: PublishInput,
  fetcher: Fetcher,
): Promise<{ id?: string; error?: string }> {
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
  if (!res.ok) return { error: readError(body, `container creation failed (HTTP ${res.status})`) };
  const id = (body as { id?: string } | null)?.id;
  return id ? { id } : { error: "container creation returned no id" };
}

/** Step two, part one: wait for Meta to finish processing the video. */
export async function waitForContainer(
  containerId: string,
  accessToken: string,
  fetcher: Fetcher,
  opts: { maxPolls?: number; sleep?: (ms: number) => Promise<void>; intervalMs?: number } = {},
): Promise<{ ready: boolean; polls: number; error?: string }> {
  const maxPolls = opts.maxPolls ?? 20;
  const intervalMs = opts.intervalMs ?? 5_000;
  const sleep = opts.sleep ?? ((ms: number) => new Promise(r => setTimeout(r, ms)));

  for (let i = 1; i <= maxPolls; i++) {
    const res = await fetcher(
      `${GRAPH}/${containerId}?fields=status_code&access_token=${encodeURIComponent(accessToken)}`,
    );
    const body = await res.json().catch(() => null);
    if (!res.ok) return { ready: false, polls: i, error: readError(body, `status check failed (HTTP ${res.status})`) };

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
): Promise<{ id?: string; error?: string }> {
  const params = new URLSearchParams({ creation_id: containerId, access_token: accessToken });
  const res = await fetcher(`${GRAPH}/${igUserId}/media_publish`, {
    method: "POST",
    body: params.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { error: readError(body, `publish failed (HTTP ${res.status})`) };
  const id = (body as { id?: string } | null)?.id;
  return id ? { id } : { error: "publish returned no id" };
}

/** The whole sequence. */
export async function publishReel(
  input: PublishInput,
  fetcher: Fetcher,
  opts: { maxPolls?: number; sleep?: (ms: number) => Promise<void>; intervalMs?: number } = {},
): Promise<PublishResult> {
  const created = await createReelContainer(input, fetcher);
  if (!created.id) return { ok: false, error: created.error };

  const waited = await waitForContainer(created.id, input.accessToken, fetcher, opts);
  if (!waited.ready) {
    return { ok: false, containerId: created.id, error: waited.error, polls: waited.polls };
  }

  const published = await publishContainer(input.igUserId, created.id, input.accessToken, fetcher);
  if (!published.id) {
    return { ok: false, containerId: created.id, error: published.error, polls: waited.polls };
  }

  return { ok: true, mediaId: published.id, containerId: created.id, polls: waited.polls };
}
