import { describe, it, expect, vi } from "vitest";
import { publishQueued, MAX_ATTEMPTS, type PublishDeps } from "./publisher";
import { memoryStore } from "./memory-store";
import type { Fetcher } from "../instagram";
import type { AssetFetcher } from "./qc";
import type { SocialPost } from "./db";

/**
 * The whole evening, against the in-memory store.
 *
 * Each test seeds a queue, runs the publisher once (or twice), and reads back
 * the rows and the events. The Graph API is a fetcher that answers the three
 * calls the sequence makes; the asset check is a fetcher that says every mp4
 * is healthy unless told otherwise.
 */

// 18:00 UTC on 7 Sep 2026 is 19:00 in London — same day.
const NOW = new Date("2026-09-07T18:00:00Z");
const TODAY = "2026-09-07";
const TAGS = "#ukproperty #buytolet #uklandlord #propertyinvestmentuk #dealanalysis";
const caption = (n: number) => `Post ${n}. Running costs assumed at 28% of rent.\n\n${TAGS}`;

const url = (n: number) => `https://www.propertyvaultuk.co.uk/reels/day-${String(n).padStart(2, "0")}-x.mp4`;
const sha = (n: number) => String(n).padStart(64, "0");

const queued = (n: number, slot: string, extra: Partial<SocialPost> = {}): Partial<SocialPost> => ({
  slot_date: slot, format: "autopsy", asset_url: url(n), asset_sha256: sha(n), caption: caption(n), ...extra,
});

/** A Graph API that publishes everything and knows the permalink. */
function graphOk(): Fetcher & { calls: string[] } {
  const calls: string[] = [];
  const f = (async (u: string, init?: { method?: string }) => {
    calls.push(`${init?.method ?? "GET"} ${u}`);
    const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });
    if (u.includes("/media_publish")) return ok({ id: "m-1" });
    if (init?.method === "POST") return ok({ id: "c-1" });
    if (u.includes("fields=permalink")) return ok({ permalink: "https://www.instagram.com/reel/abc/", media_type: "VIDEO" });
    return ok({ status_code: "FINISHED" });
  }) as Fetcher & { calls: string[] };
  f.calls = calls;
  return f;
}

/** A Graph API that fails at container creation. */
const graphFail: Fetcher = async () => ({
  ok: false, status: 400, json: async () => ({ error: { message: "Media upload has failed", code: 352 } }),
});

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

  // The 18:40 slot.
  it("is a no-op the second time on the same day", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f });
    await publishQueued(d);
    const before = f.calls.length;

    const again = await publishQueued({ ...d, now: new Date("2026-09-07T18:40:00Z") });
    expect(again.outcome).toBe("already-published");
    expect(again.mediaId).toBe("m-1");
    expect(f.calls.length).toBe(before);
    expect(posts(d)).toHaveLength(1);
  });

  it("does nothing, and says so, when nothing is queued for today", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, "2026-09-08")] }) });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("nothing-queued");
    expect(r.reason).toContain(TODAY);
    expect(posts(d)[0].status).toBe("queued");
    expect(events(d)).toEqual(["nothing_queued"]);
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
  it("marks earlier queued rows skipped, with a warning, and does not publish them", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, "2026-09-05"), queued(2, "2026-09-06"), queued(3, TODAY)] }) });
    const r = await publishQueued(d);
    expect(r.skippedMissed).toBe(2);
    expect(r.outcome).toBe("published");
    expect(posts(d).map(p => p.status)).toEqual(["skipped", "skipped", "published"]);
    expect(posts(d)[0].last_error).toContain("2026-09-05");
    expect(events(d).filter(e => e === "missed_day")).toHaveLength(2);
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
    ] }) });
    const r = await publishQueued(d);
    expect(r.skippedMissed).toBe(0);
    expect(posts(d).map(p => p.status)).toEqual(["published", "held", "skipped"]);
  });
});

describe("a post that fails its checks", () => {
  it("holds it, alerts, and publishes the least recently used pool row instead", async () => {
    const sent: { subject: string; text: string }[] = [];
    const d = deps({
      db: memoryStore({ posts: [
        queued(1, TODAY),
        queued(11, null as unknown as string, { evergreen: true, last_used_at: "2026-08-01T00:00:00Z", format: "the-gap" }),
        queued(12, null as unknown as string, { evergreen: true, last_used_at: null, format: "the-bill" }),
      ] }),
      assetFetcher: assetsMissing(url(1)),
      sendAlert: async m => { sent.push(m); return { ok: true }; },
    });
    const r = await publishQueued(d);

    expect(r.outcome).toBe("published");
    expect(r.fallback).toBeTruthy();

    const [original, usedLater, neverUsed, clone] = posts(d);
    expect(original.status).toBe("held");
    expect(original.attempts).toBe(1);
    expect(original.last_error).toContain("asset_reachable");
    expect(original.qc).toMatchObject({ ok: false });

    // Never-used beats used-in-August.
    expect(r.fallback!.poolId).toBe(neverUsed.id);
    expect(neverUsed.last_used_at).toBe(NOW.toISOString());
    expect(usedLater.last_used_at).toBe("2026-08-01T00:00:00Z");

    expect(clone.slot_date).toBe(TODAY);
    expect(clone.evergreen).toBe(false);
    expect(clone.asset_sha256).toBeNull();
    expect(clone.asset_url).toBe(url(12));
    expect(clone.source_refs).toMatchObject({ evergreen_of: neverUsed.id, asset_sha256: sha(12), stood_in_for: original.id });
    expect(clone.status).toBe("published");

    expect(events(d)).toEqual(["qc_failed", "evergreen_fallback", "published", "alert_sent"]);
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toContain("Held");
    expect(sent[0].text).toContain("asset_reachable");
    expect(r.alert).toEqual({ needed: true, sent: true });
  });

  it("holds and alerts, with nothing published, when the pool is empty", async () => {
    const f = graphOk();
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), assetFetcher: assetsMissing(url(1)), fetcher: f });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("held");
    expect(r.reason).toContain("pool is empty");
    expect(f.calls).toEqual([]);
    expect(events(d)).toEqual(["qc_failed", "no_evergreen", "alert_sent"]);
  });

  it("holds the clone too when the pool row is also broken, rather than posting it anyway", async () => {
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY), queued(11, null as unknown as string, { evergreen: true })] }),
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
  it("marks the row failed with the error, and leaves it for the retry slot", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: graphFail });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("failed");
    expect(r.alert.needed).toBe(false);
    const row = posts(d)[0];
    expect(row.status).toBe("failed");
    expect(row.attempts).toBe(1);
    expect(row.last_error).toContain("Media upload has failed");
    expect(events(d)).toEqual(["publish_failed"]);
  });

  it("retries a failed row on the next run", async () => {
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY, { status: "failed", attempts: 1 })] }) });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(posts(d)[0].attempts).toBe(2);
  });

  it("holds after the third failure and alerts", async () => {
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
    expect(sent[0]).toContain(`${MAX_ATTEMPTS} times`);
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
      if (u.includes("/media_publish")) return { ok: false, status: 400, json: async () => ({ error: { message: "too many actions", code: 9 } }) };
      if (init?.method === "POST") return { ok: true, status: 200, json: async () => ({ id: "c-9" }) };
      return { ok: true, status: 200, json: async () => ({ status_code: "FINISHED" }) };
    };
    const d = deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f });
    await publishQueued(d);
    expect(posts(d)[0].ig_container_id).toBe("c-9");
  });

  it("still counts as published when the permalink lookup fails", async () => {
    const f: Fetcher = async (u, init) => {
      const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });
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
  it("stands back from a row another run is publishing right now", async () => {
    const f = graphOk();
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY, { status: "publishing", updated_at: new Date(NOW.getTime() - 60_000).toISOString() })] }),
      fetcher: f,
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("in-progress");
    expect(f.calls).toEqual([]);
  });

  it("treats a row stuck in 'publishing' for an hour as a failed attempt and retries", async () => {
    const d = deps({
      db: memoryStore({ posts: [queued(1, TODAY, { status: "publishing", updated_at: new Date(NOW.getTime() - 3_600_000).toISOString() })] }),
    });
    const r = await publishQueued(d);
    expect(r.outcome).toBe("published");
    expect(posts(d)[0].attempts).toBe(2);
    expect(events(d)).toEqual(["stale_publishing", "published"]);
  });
});

describe("the sequence never sleeps for real in tests", () => {
  it("passes the injected sleep through to the poller", async () => {
    const sleep = vi.fn(async () => {});
    let polls = 0;
    const f: Fetcher = async (u, init) => {
      const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });
      if (u.includes("/media_publish")) return ok({ id: "m-1" });
      if (init?.method === "POST") return ok({ id: "c-1" });
      if (u.includes("fields=permalink")) return ok({ permalink: "p" });
      return ok({ status_code: ++polls < 3 ? "IN_PROGRESS" : "FINISHED" });
    };
    await publishQueued(deps({ db: memoryStore({ posts: [queued(1, TODAY)] }), fetcher: f, sleep }));
    expect(sleep).toHaveBeenCalledTimes(2);
  });
});
