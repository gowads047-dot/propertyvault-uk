import { describe, it, expect, vi } from "vitest";
import { publishQueued, MAX_ATTEMPTS, RETRY_WAIT_MS, RETRY_DEADLINE_MS, STALE_PUBLISHING_MS, type PublishDeps } from "./publisher";
import { memoryStore } from "./memory-store";
import type { Fetcher } from "../instagram";
import type { AssetFetcher } from "./qc";
import type { SocialPost } from "./db";

/**
 * The whole evening, against the in-memory store.
 *
 * Each test seeds a queue, runs the publisher once (or twice, or twice at
 * once), and reads back the rows and the events. The Graph API is a fetcher
 * that answers the calls the sequence makes; the asset check is a fetcher
 * that says every mp4 is healthy unless told otherwise.
 */

// 18:00 UTC on 7 Sep 2026 is 19:00 in London — same day.
const NOW = new Date("2026-09-07T18:00:00Z");
const TODAY = "2026-09-07";
const TAGS = "#ukproperty #buytolet #uklandlord #propertyinvestmentuk #dealanalysis";
const caption = (n: number) => `Post ${n}. Running costs assumed at 28% of rent.\n\n${TAGS}`;

const url = (n: number) => `https://www.propertyvaultuk.co.uk/reels/day-${String(n).padStart(2, "0")}-x.mp4`;
const sha = (n: number) => String(n).padStart(64, "0");
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

const queued = (n: number, slot: string | null, extra: Partial<SocialPost> = {}): Partial<SocialPost> => ({
  slot_date: slot, format: "autopsy", asset_url: url(n), asset_sha256: sha(n), caption: caption(n), ...extra,
});

const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });
const metaError = async (message: string, code?: number, status = 400) =>
  ({ ok: false, status, json: async () => ({ error: { message, ...(code ? { code } : {}) } }) });

/** A Graph API that publishes everything and knows the permalink. */
function graphOk(): Fetcher & { calls: string[] } {
  const calls: string[] = [];
  const f = (async (u: string, init?: { method?: string }) => {
    calls.push(`${init?.method ?? "GET"} ${u}`);
    if (u.includes("/media_publish")) return ok({ id: "m-1" });
    if (init?.method === "POST") return ok({ id: "c-1" });
    if (u.includes("fields=permalink")) return ok({ permalink: "https://www.instagram.com/reel/abc/", media_type: "VIDEO" });
    return ok({ status_code: "FINISHED" });
  }) as Fetcher & { calls: string[] };
  f.calls = calls;
  return f;
}

/** A Graph API that fails at container creation with a code that is not worth retrying. */
const graphFail: Fetcher = async () => metaError("Media upload has failed", 352);

/** Fails the first n container creations with the given answer, then behaves. */
function graphFlaky(n: number, answer: () => ReturnType<Fetcher>): Fetcher & { calls: string[]; posts: string[] } {
  const inner = graphOk();
  const posts: string[] = [];
  const f = (async (u: string, init?: { method?: string; body?: string }) => {
    if (init?.method === "POST" && !u.includes("/media_publish")) {
      posts.push(init.body ?? "");
      if (posts.length <= n) { inner.calls.push(`POST ${u}`); return answer(); }
    }
    return inner(u, init);
  }) as Fetcher & { calls: string[]; posts: string[] };
  f.calls = inner.calls;
  f.posts = posts;
  return f;
}

const assetsOk: AssetFetcher = async () => ({
  status: 200,
  headers: { get: (k: string) => (k === "content-type" ? "video/mp4" : k === "content-length" ? "400000" : null) },
});

/** Everything healthy except the named URL, which 404s. */
const assetsMissing = (bad: string): AssetFetcher => async u =>
  u === bad ? { status: 404, headers: { get: () => null } } : assetsOk(u, { method: "HEAD", redirect: "manual" });

function deps(over: Partial<PublishDeps> = {}): PublishDeps {
  return {
    db: memoryStore(),
    fetcher: graphOk(),
    assetFetcher: assetsOk,
    now: NOW,
    token: "tok",
    igUserId: "123",
    sendAlert: async () => ({ ok: true }),
    sleep: async () => {},
    ...over,
  };
}

const events = (d: PublishDeps) => (d.db as ReturnType<typeof memoryStore>).events.map(e => e.event);
const posts = (d: PublishDeps) => (d.db as ReturnType<typeof memoryStore>).posts;

describe("the ordinary evening", () => {
  it("publishes today's row, records the media id and permalink, and logs it", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }) });
    const r = await publishQueued(d);

    expect(r.outcome).toBe("published");
    expect(r.mediaId).toBe("m-1");
    expect(r.permalink).toBe("https://www.instagram.com/reel/abc/");
    expect(r.attempts).toBe(1);
    expect(r.alert.needed).toBe(false);

    const row = posts(d)[0];
    expect(row.status).toBe("published");
    expect(row.ig_media_id).toBe("m-1");
    expect(row.ig_container_id).toBe("c-1");
    expect(row.published_at).toBe(NOW.toISOString());
    expect(row.attempts).toBe(1);
    expect(row.qc).toMatchObject({ ok: true });
    expect(events(d)).toEqual(["published"]);
  });

  it("sends exactly what lib/instagram.ts needs: the row's URL and caption to the account", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f });
    await publishQueued(d);
    expect(f.calls[0]).toBe("POST https://graph.instagram.com/v21.0/123/media");
    expect(f.calls.some(c => c.includes("/media_publish"))).toBe(true);
  });

  // The container id is on the row before the first status poll, so a run
  // that dies during the wait leaves the next run something to ask about.
  it("writes the container id to the row before polling", async () => {
    const db = memoryStore({ posts: [queued(1, TODAY)] });
    let seenAtFirstPoll: string | null | undefined;
    const inner = graphOk();
    const f: Fetcher = async (u, init) => {
      if (u.includes("fields=status_code") && seenAtFirstPoll === undefined) seenAtFirstPoll = db.posts[0].ig_container_id;
      return inner(u, init);
    };
    await publishQueued(deps({ db, fetcher: f }));
    expect(seenAtFirstPoll).toBe("c-1");
  });

  it("is a no-op the second time on the same day", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f });
    await publishQueued(d);
    const before = f.calls.length;

    const again = await publishQueued({ ...d, now: new Date("2026-09-07T18:50:00Z") });
    expect(again.outcome).toBe("already-published");
    expect(again.mediaId).toBe("m-1");
    expect(f.calls.length).toBe(before);
    expect(posts(d)).toHaveLength(1);

    // A no-op is still a run, and it leaves a row saying so. Without this,
    // four nights of publishing by a process outside this codebase left no
    // way to tell whether the cron had fired at all.
    expect(events(d).filter(e => e === "already_published")).toHaveLength(1);
    const store = d.db as ReturnType<typeof memoryStore>;
    const row = store.events.find(e => e.event === "already_published")!;
    expect(row.post_id).toBe(posts(d)[0].id);
    expect(row.detail).toMatchObject({ date: TODAY });
  });

  it("uses the London date, so a summer evening run finds the right row", async () => {
    // 23:30 UTC on 7 Sep is 00:30 on 8 Sep in London.
    const d = deps({
      db: memoryStore({ posts: [queued(1, "2026-09-08")] }),
      now: new Date("2026-09-07T23:30:00Z"),
    });
    expect((await publishQueued(d)).outcome).toBe("published");
  });
});

describe("two runs in the same evening", () => {
  // The Hobby plan places a cron anywhere in its hour and does not promise
  // one invocation. Both runs read the row as queued; the claim decides.
  it("lets exactly one of two overlapping runs publish", async () => {
    const db = memoryStore({ posts: [queued(1, TODAY)] });
    const f1 = graphOk();
    const f2 = graphOk();
    const [a, b] = await Promise.all([
      publishQueued(deps({ db, fetcher: f1 })),
      publishQueued(deps({ db, fetcher: f2 })),
    ]);

    const outcomes = [a.outcome, b.outcome].sort();
    expect(outcomes).toEqual(["in-progress", "published"]);
    const publishes = [...f1.calls, ...f2.calls].filter(c => c.includes("/media_publish"));
    expect(publishes).toHaveLength(1);
    expect(db.posts).toHaveLength(1);
    expect(db.posts[0].status).toBe("published");
    expect(db.posts[0].attempts).toBe(1);
    expect(db.events.map(e => e.event)).toEqual(["published"]);
  });
});

describe("nothing queued", () => {
  it("does nothing, says so, and alerts", async () => {
    const sent: { subject: string }[] = [];
    const d = deps({
      db: memoryStore({ posts: [queued(1, "2026-09-08")] }),
      sendAlert: async m => { sent.push(m); return { ok: true }; },
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("nothing-queued");
    expect(r.reason).toContain(TODAY);
    expect(posts(d)[0].status).toBe("queued");
    expect(r.alert).toEqual({ needed: true, sent: true });
    expect(sent[0].subject).toContain(TODAY);
    expect(events(d)).toEqual(["nothing_queued", "alert_sent", "nothing_queued_alerted"]);
  });

  // The runs can overlap; the day is the unit.
  it("alerts once per day, however many runs there are", async () => {
    const sent: unknown[] = [];
    const d = deps({ db: memoryStore(), sendAlert: async m => { sent.push(m); return { ok: true }; } });
    await publishQueued(d);
    const again = await publishQueued({ ...d, now: new Date("2026-09-07T18:45:00Z") });
    expect(again.alert.needed).toBe(false);
    expect(sent).toHaveLength(1);

    const tomorrow = await publishQueued({ ...d, now: new Date("2026-09-08T18:00:00Z") });
    expect(tomorrow.alert).toEqual({ needed: true, sent: true });
    expect(sent).toHaveLength(2);
  });

  it("does not count an alert that could not be sent as sent", async () => {
    const d = deps({ db: memoryStore(), sendAlert: null });
    const r = await publishQueued(d);
    expect(r.alert.sent).toBe(false);
    expect(events(d)).not.toContain("nothing_queued_alerted");
    const again = await publishQueued({ ...d, sendAlert: async () => ({ ok: true }) });
    expect(again.alert).toEqual({ needed: true, sent: true });
  });
});

describe("paused", () => {
  it("reads nothing and posts nothing", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)], settings: { paused: true } }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("paused");
    expect(f.calls).toEqual([]);
    expect(posts(d)[0].status).toBe("queued");
    expect(events(d)).toEqual(["skipped_paused"]);
  });

  it("only pauses on a literal true", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)], settings: { paused: "true" } }) });
    expect((await publishQueued(d)).outcome).toBe("published");
  });
});

describe("missed days", () => {
  // The calendar philosophy: a missed Monday does not push everything back.
  it("marks earlier queued rows skipped, alerts, and does not publish them", async () => {
    const sent: { subject: string; text: string }[] = [];
    const d = deps({
      db: memoryStore({ posts: [queued(1, "2026-09-05"), queued(2, "2026-09-06"), queued(3, TODAY)] }),
      sendAlert: async m => { sent.push(m); return { ok: true }; },
    });
    const r = await publishQueued(d);
    expect(r.skippedMissed).toBe(2);
    expect(r.outcome).toBe("published");
    expect(posts(d).map(p => p.status)).toEqual(["skipped", "skipped", "published"]);
    expect(posts(d)[0].last_error).toContain("2026-09-05");
    expect(events(d).filter(e => e === "missed_day")).toHaveLength(2);
    expect(r.alert).toEqual({ needed: true, sent: true });
    expect(sent[0].subject).toContain("2 days");
    expect(sent[0].text).toContain("2026-09-06");
  });

  it("also skips an earlier failed row rather than retrying it a day late", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, "2026-09-06", { status: "failed", attempts: 1 })] }) });
    await publishQueued(d);
    expect(posts(d)[0].status).toBe("skipped");
  });

  it("leaves published, held and skipped rows from earlier days alone", async () => {
    const d = deps({ db: memoryStore({ posts: [
      queued(1, "2026-09-04", { status: "published" }),
      queued(2, "2026-09-05", { status: "held" }),
      queued(3, "2026-09-06", { status: "skipped" }),
      queued(4, TODAY),
    ] }) });
    const r = await publishQueued(d);
    expect(r.skippedMissed).toBe(0);
    expect(r.alert.needed).toBe(false);
    expect(posts(d).map(p => p.status)).toEqual(["published", "held", "skipped", "published"]);
  });

  // A row a crashed run left in 'publishing' yesterday may have gone out.
  it("records a yesterday's 'publishing' row as published when its container says so", async () => {
    const f: Fetcher = async u => {
      if (u.includes("c-old?fields=status_code")) return ok({ status_code: "PUBLISHED" });
      if (u.includes("/media?fields=id,permalink,timestamp")) {
        return ok({ data: [{ id: "m-rec", permalink: "https://www.instagram.com/reel/rec/", timestamp: "2026-09-06T18:03:00+0000" }] });
      }
      throw new Error(`unexpected ${u}`);
    };
    const d = deps({
      db: memoryStore({ posts: [queued(1, "2026-09-06", {
        status: "publishing", attempts: 1, ig_container_id: "c-old", updated_at: "2026-09-06T18:01:00Z",
      })] }),
      fetcher: f,
    });
    const r = await publishQueued(d);
    expect(r.skippedMissed).toBe(0);
    expect(r.outcome).toBe("nothing-queued");
    const row = posts(d)[0];
    expect(row.status).toBe("published");
    expect(row.ig_media_id).toBe("m-rec");
    expect(row.permalink).toContain("/rec/");
    expect(row.published_at).toBe("2026-09-06T18:03:00.000Z");
    expect(events(d)).toContain("recovered_published");
    expect(events(d)).not.toContain("missed_day");
  });

  it("skips a yesterday's 'publishing' row whose container only finished — not a day late", async () => {
    const f: Fetcher = async () => ok({ status_code: "FINISHED" });
    const d = deps({
      db: memoryStore({ posts: [queued(1, "2026-09-06", { status: "publishing", attempts: 1, ig_container_id: "c-old", updated_at: "2026-09-06T18:01:00Z" })] }),
      fetcher: f,
    });
    const r = await publishQueued(d);
    expect(r.skippedMissed).toBe(1);
    expect(posts(d)[0].status).toBe("skipped");
    expect(posts(d)[0].last_error).toContain("FINISHED");
  });
});

describe("a post that fails its checks", () => {
  it("holds it, alerts, and publishes the least recently used pool row instead", async () => {
    const sent: { subject: string; text: string }[] = [];
    const d = deps({
      db: memoryStore({ posts: [
        queued(1, TODAY),
        queued(11, null, { evergreen: true, last_used_at: "2026-08-01T00:00:00Z", format: "the-gap" }),
        queued(12, null, { evergreen: true, last_used_at: null, format: "the-bill" }),
      ] }),
      assetFetcher: assetsMissing(url(1)),
      sendAlert: async m => { sent.push(m); return { ok: true }; },
    });
    const r = await publishQueued(d);

    expect(r.outcome).toBe("published");
    expect(r.fallback).toBeTruthy();

    const [original, usedLater, neverUsed, clone] = posts(d);
    expect(original.status).toBe("held");
    // Attempts count containers; a check failure made none.
    expect(original.attempts).toBe(0);
    expect(original.last_error).toContain("asset_reachable");
    expect(original.qc).toMatchObject({ ok: false });

    // Never-used beats used-in-August.
    expect(r.fallback!.poolId).toBe(neverUsed.id);
    expect(neverUsed.last_used_at).toBe(NOW.toISOString());
    expect(usedLater.last_used_at).toBe("2026-08-01T00:00:00Z");

    expect(clone.slot_date).toBe(TODAY);
    expect(clone.evergreen).toBe(false);
    expect(clone.is_clone).toBe(true);
    // The pool row's digest, kept, so the repeat is visible to later checks.
    expect(clone.asset_sha256).toBe(sha(12));
    expect(clone.asset_url).toBe(url(12));
    expect(clone.source_refs).toMatchObject({ evergreen_of: neverUsed.id, stood_in_for: original.id });
    expect(clone.status).toBe("published");

    expect(events(d)).toEqual(["qc_failed", "evergreen_fallback", "published", "alert_sent"]);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toContain("Held");
    expect(sent[0].text).toContain("asset_reachable");
    expect(r.alert).toEqual({ needed: true, sent: true });
  });

  it("tells the person to re-queue on a new date as a new row, not to flip the status back", async () => {
    const sent: { text: string }[] = [];
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY)] }),
      assetFetcher: assetsMissing(url(1)),
      sendAlert: async m => { sent.push(m); return { ok: true }; },
    });
    await publishQueued(d);
    expect(sent[0].text).toMatch(/NEW date as a NEW row/);
    expect(sent[0].text).toContain("npm run social:seed");
    expect(sent[0].text).toContain("Do not set this row's status back to 'queued'");
  });

  it("holds and alerts, with nothing published, when the pool is empty", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), assetFetcher: assetsMissing(url(1)), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(r.reason).toContain("no evergreen row is eligible");
    expect(f.calls).toEqual([]);
    expect(events(d)).toEqual(["qc_failed", "no_evergreen", "alert_sent"]);
  });

  // A stand-in that is the same video as the broken post is not a stand-in.
  it("will not stand in with the same asset as the held post", async () => {
    const d = deps({
      db: memoryStore({ posts: [
        queued(1, TODAY),
        queued(1, null, { evergreen: true, last_used_at: null }),
        queued(12, null, { evergreen: true, last_used_at: "2026-08-01T00:00:00Z" }),
      ] }),
      assetFetcher: assetsMissing(url(1)),
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(r.fallback!.poolId).toBe(posts(d)[2].id);
  });

  it("will not stand in with an asset that went out in the last fortnight, as itself or as a clone", async () => {
    const d = deps({
      db: memoryStore({ posts: [
        queued(1, TODAY),
        // Went out as a clone three days ago.
        queued(12, "2026-09-04", { status: "published", published_at: ago(3 * 86_400_000), is_clone: true }),
        queued(12, null, { evergreen: true, last_used_at: null }),
        // Went out twenty days ago: eligible.
        queued(13, "2026-08-18", { status: "published", published_at: ago(20 * 86_400_000) }),
        queued(13, null, { evergreen: true, last_used_at: "2026-08-18T00:00:00Z" }),
      ] }),
      assetFetcher: assetsMissing(url(1)),
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(r.fallback!.poolId).toBe(posts(d)[4].id);

    const only = deps({
      db: memoryStore({ posts: [
        queued(1, TODAY),
        queued(12, "2026-09-04", { status: "published", published_at: ago(3 * 86_400_000), is_clone: true }),
        queued(12, null, { evergreen: true }),
      ] }),
      assetFetcher: assetsMissing(url(1)),
    });
    const r2 = await publishQueued(only);
    expect(r2.outcome).toBe("held");
    const ev = (only.db as ReturnType<typeof memoryStore>).events.find(e => e.event === "no_evergreen")!;
    expect(JSON.stringify(ev.detail)).toContain("published in the last 14 days");
  });

  it("holds the clone too when the pool row is also broken, rather than posting it anyway", async () => {
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY), queued(11, null, { evergreen: true })] }),
      assetFetcher: async () => ({ status: 404, headers: { get: () => null } }),
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(posts(d).map(p => p.status)).toEqual(["held", "queued", "held"]);
  });

  it("catches a banned claim in a caption somebody typed into the queue", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY, { caption: `Guaranteed 10% returns ${TAGS}` })] }) });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(posts(d)[0].last_error).toContain("claims");
  });

  it("refuses to publish an asset that has already gone out", async () => {
    const d = deps({ db: memoryStore({ posts: [
      queued(1, "2026-09-01", { status: "published" }),
      queued(2, TODAY, { asset_sha256: sha(1) }),
    ] }) });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(posts(d)[1].last_error).toContain("already been published");
  });

  // A pool asset that stood in for a day has gone out, and the check must know.
  it("counts a clone's publish against the asset", async () => {
    const d = deps({ db: memoryStore({ posts: [
      queued(12, "2026-09-01", { status: "published", is_clone: true, source_refs: { evergreen_of: "pool" } }),
      queued(12, TODAY),
    ] }) });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(posts(d)[1].last_error).toContain("already been published");
  });

  // A hold nobody hears about is the same as no hold.
  it("reports the hold as unalerted when email is not configured", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), assetFetcher: assetsMissing(url(1)), sendAlert: null });
    const r = await publishQueued(d);
    expect(r.alert.needed).toBe(true);
    expect(r.alert.sent).toBe(false);
    expect(r.alert.error).toContain("RESEND_API_KEY");
    expect(events(d)).toContain("alert_not_sent");
  });

  it("reports a failed alert send rather than swallowing it", async () => {
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY)] }),
      assetFetcher: assetsMissing(url(1)),
      sendAlert: async () => ({ ok: false, error: "Resend 422" }),
    });
    const r = await publishQueued(d);
    expect(r.alert).toEqual({ needed: true, sent: false, error: "Resend 422" });
  });
});

describe("a publish that fails at Meta", () => {
  it("holds the row at once, with the error, when the failure is not the passing kind", async () => {
    const sleep = vi.fn(async () => {});
    const sent: { subject: string }[] = [];
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: graphFail, sleep,
      sendAlert: async m => { sent.push(m); return { ok: true }; },
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(r.attempts).toBe(1);
    const row = posts(d)[0];
    expect(row.status).toBe("held");
    expect(row.attempts).toBe(1);
    expect(row.last_error).toContain("Media upload has failed");
    expect(sleep).not.toHaveBeenCalled();
    expect(events(d)).toEqual(["publish_failed", "held_after_failures", "alert_sent"]);
    expect(sent[0].subject).toContain("failed to publish");
  });

  it("tries once more, after the wait and with a fresh container, on a rate-limit code", async () => {
    const sleep = vi.fn(async () => {});
    const f = graphFlaky(1, () => metaError("Application request limit reached", 4));
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(r.attempts).toBe(2);
    expect(sleep).toHaveBeenCalledWith(RETRY_WAIT_MS);
    expect(f.posts).toHaveLength(2);
    expect(posts(d)[0].status).toBe("published");
    expect(events(d)).toEqual(["publish_failed", "publish_retry_wait", "published"]);
  });

  it("retries a 5xx and a network failure the same way", async () => {
    const answers: (() => ReturnType<Fetcher>)[] = [
      () => metaError("upstream", undefined, 503),
      async () => { throw new Error("ECONNRESET"); },
    ];
    for (const answer of answers) {
      const sleep = vi.fn(async () => {});
      const f = graphFlaky(1, answer);
      const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep });
      const r = await publishQueued(d);
      expect(r.outcome).toBe("published");
      expect(sleep).toHaveBeenCalledTimes(1);
    }
  });

  it("retries only once: a second passing failure holds the row", async () => {
    const sleep = vi.fn(async () => {});
    const f = graphFlaky(2, () => metaError("User request limit reached", 9));
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(r.attempts).toBe(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(posts(d)[0].status).toBe("held");
    expect(events(d)).toEqual(["publish_failed", "publish_retry_wait", "publish_failed", "held_after_failures", "alert_sent"]);
  });

  it("does not start a retry when the run is already too old to fit one", async () => {
    const sleep = vi.fn(async () => {});
    let t = 0;
    const clock = () => { t += RETRY_DEADLINE_MS; return t; };
    const f = graphFlaky(1, () => metaError("Application request limit reached", 4));
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep, clock });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(sleep).not.toHaveBeenCalled();
  });

  it("never retries a bad token, and holds without an environment token to fall back to", async () => {
    const sleep = vi.fn(async () => {});
    const f = graphFlaky(9, () => metaError("Error validating access token", 190));
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep, tokenSource: "settings" });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(r.attempts).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
    expect(events(d)).not.toContain("token_fallback_env");
  });

  it("falls back to the environment token for the run when the stored one is refused, and records it", async () => {
    const sleep = vi.fn(async () => {});
    const f = graphFlaky(1, () => metaError("Error validating access token", 190));
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep,
      token: "stored-secret", tokenSource: "settings", fallbackToken: "env-secret",
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(r.attempts).toBe(2);
    expect(sleep).not.toHaveBeenCalled();
    expect(f.posts[0]).toContain("access_token=stored-secret");
    expect(f.posts[1]).toContain("access_token=env-secret");
    expect(events(d)).toEqual(["publish_failed", "token_fallback_env", "published"]);
    // The fact of the swap is logged; neither value is.
    const logged = JSON.stringify((d.db as ReturnType<typeof memoryStore>).events);
    expect(logged).not.toContain("env-secret");
    expect(logged).not.toContain("stored-secret");
  });

  it("does not fall back when the run already started on the environment token", async () => {
    const f = graphFlaky(9, () => metaError("Error validating access token", 190));
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, token: "env", tokenSource: "env", fallbackToken: "env" });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(f.posts).toHaveLength(1);
  });

  it("picks up a failed row on the next run", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY, { status: "failed", attempts: 1 })] }) });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(posts(d)[0].attempts).toBe(2);
  });

  it("holds at the attempt ceiling and says how many attempts it took", async () => {
    const sent: string[] = [];
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY, { status: "failed", attempts: MAX_ATTEMPTS - 1 })] }),
      fetcher: graphFail,
      sendAlert: async m => { sent.push(m.subject); return { ok: true }; },
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(posts(d)[0].status).toBe("held");
    expect(posts(d)[0].attempts).toBe(MAX_ATTEMPTS);
    expect(sent[0]).toContain(`${MAX_ATTEMPTS} attempts`);
  });

  it("does not touch a row that has used all its attempts", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY, { status: "failed", attempts: MAX_ATTEMPTS })] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("failed");
    expect(r.reason).toContain("attempts");
    expect(f.calls).toEqual([]);
  });

  it("keeps the container id from a publish that got that far", async () => {
    const f: Fetcher = async (u, init) => {
      if (u.includes("/media_publish")) return metaError("too many actions", 9);
      if (init?.method === "POST") return ok({ id: "c-9" });
      return ok({ status_code: "FINISHED" });
    };
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(posts(d)[0].ig_container_id).toBe("c-9");
    expect(posts(d)[0].attempts).toBe(2);
  });

  it("still counts as published when the permalink lookup fails", async () => {
    const f: Fetcher = async (u, init) => {
      if (u.includes("/media_publish")) return ok({ id: "m-1" });
      if (init?.method === "POST") return ok({ id: "c-1" });
      if (u.includes("fields=permalink")) return { ok: false, status: 400, json: async () => ({}) };
      return ok({ status_code: "FINISHED" });
    };
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(r.permalink).toBeNull();
    expect(events(d)).toEqual(["permalink_unavailable", "published"]);
  });
});

describe("a run that was interrupted", () => {
  const stale = (extra: Partial<SocialPost> = {}) =>
    queued(1, TODAY, { status: "publishing", attempts: 1, updated_at: ago(STALE_PUBLISHING_MS + 60_000), ...extra });

  it("stands back from a row another run is publishing right now", async () => {
    const f = graphOk();
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY, { status: "publishing", updated_at: ago(STALE_PUBLISHING_MS - 60_000) })] }),
      fetcher: f,
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("in-progress");
    expect(f.calls).toEqual([]);
  });

  it("counts a row stuck in 'publishing' with no container as a failed attempt and retries", async () => {
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY, { status: "publishing", updated_at: ago(3_600_000) })] }),
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(posts(d)[0].attempts).toBe(2);
    expect(events(d)).toEqual(["stale_publishing", "published"]);
  });

  it("records the row as published when its container was published, recovering the media id", async () => {
    const calls: string[] = [];
    const f: Fetcher = async (u, init) => {
      calls.push(`${init?.method ?? "GET"} ${u}`);
      if (u.includes("c-old?fields=status_code")) return ok({ status_code: "PUBLISHED" });
      if (u.includes("/123/media?fields=id,permalink,timestamp")) {
        return ok({ data: [
          { id: "m-rec", permalink: "https://www.instagram.com/reel/rec/", timestamp: "2026-09-07T17:52:00+0000" },
          { id: "m-older", permalink: "https://www.instagram.com/reel/old/", timestamp: "2026-09-06T18:00:00+0000" },
        ] });
      }
      throw new Error(`unexpected ${u}`);
    };
    const d = deps({ db: memoryStore({ posts: [stale({ ig_container_id: "c-old" })] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("already-published");
    expect(r.mediaId).toBe("m-rec");
    expect(r.attempts).toBe(1);
    const row = posts(d)[0];
    expect(row.status).toBe("published");
    expect(row.ig_media_id).toBe("m-rec");
    expect(row.permalink).toContain("/rec/");
    expect(row.published_at).toBe("2026-09-07T17:52:00.000Z");
    expect(calls.filter(c => c.startsWith("POST"))).toEqual([]);
    expect(events(d)).toEqual(["recovered_published"]);
  });

  it("still marks it published, and says the media id is unknown, when no recent post is new enough", async () => {
    const f: Fetcher = async u => {
      if (u.includes("fields=status_code")) return ok({ status_code: "PUBLISHED" });
      return ok({ data: [{ id: "m-old", permalink: "p", timestamp: "2026-09-01T18:00:00+0000" }] });
    };
    const d = deps({ db: memoryStore({ posts: [stale({ ig_container_id: "c-old" })] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("already-published");
    expect(r.mediaId).toBeUndefined();
    expect(posts(d)[0].status).toBe("published");
    expect(posts(d)[0].ig_media_id).toBeNull();
    expect(events(d)).toEqual(["recovered_published_unmatched"]);
  });

  it("publishes a container that finished but was never published, without making another", async () => {
    const calls: string[] = [];
    const f: Fetcher = async (u, init) => {
      calls.push(`${init?.method ?? "GET"} ${u}${init?.body ? ` ${init.body}` : ""}`);
      if (u.includes("c-old?fields=status_code")) return ok({ status_code: "FINISHED" });
      if (u.includes("/media_publish")) return ok({ id: "m-late" });
      if (u.includes("fields=permalink")) return ok({ permalink: "https://www.instagram.com/reel/late/" });
      throw new Error(`unexpected ${u}`);
    };
    const d = deps({ db: memoryStore({ posts: [stale({ ig_container_id: "c-old" })] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(r.mediaId).toBe("m-late");
    expect(r.attempts).toBe(1);
    expect(calls.filter(c => c.startsWith("POST"))).toEqual([
      "POST https://graph.instagram.com/v21.0/123/media_publish creation_id=c-old&access_token=tok",
    ]);
    expect(posts(d)[0].ig_container_id).toBe("c-old");
    expect(events(d)).toEqual(["recovered_finished", "published"]);
  });

  it("makes a new container when the old one errored, without counting the old one twice", async () => {
    const inner = graphOk();
    const f: Fetcher = async (u, init) => {
      if (u.includes("c-old?fields=status_code")) return ok({ status_code: "ERROR" });
      return inner(u, init);
    };
    const d = deps({ db: memoryStore({ posts: [stale({ ig_container_id: "c-old" })] }), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(posts(d)[0].attempts).toBe(2);
    expect(posts(d)[0].ig_container_id).toBe("c-1");
    expect(events(d)).toEqual(["stale_publishing", "published"]);
  });
});

describe("the sequence never sleeps for real in tests", () => {
  it("passes the injected sleep through to the poller", async () => {
    const sleep = vi.fn(async () => {});
    let polls = 0;
    const f: Fetcher = async (u, init) => {
      if (u.includes("/media_publish")) return ok({ id: "m-1" });
      if (init?.method === "POST") return ok({ id: "c-1" });
      if (u.includes("fields=permalink")) return ok({ permalink: "p" });
      return ok({ status_code: ++polls < 3 ? "IN_PROGRESS" : "FINISHED" });
    };
    await publishQueued(deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep }));
    expect(sleep).toHaveBeenCalledTimes(2);
  });
});
