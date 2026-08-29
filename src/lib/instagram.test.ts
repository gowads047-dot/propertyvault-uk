import { describe, it, expect, vi } from "vitest";
import { publishReel, createReelContainer, waitForContainer, type Fetcher } from "./instagram";

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
const fail = (status: number, body: unknown) => ({ ok: false, status, json: async () => body });

const INPUT = {
  igUserId: "123",
  accessToken: "tok",
  videoUrl: "https://www.propertyvaultuk.co.uk/reels/day-01-autopsy-1.mp4",
  caption: "hello",
};

/** Never actually waits — a real sleep would make these tests take a minute. */
const noSleep = async () => {};

describe("creating the container", () => {
  it("posts the video url and caption, and returns the id", async () => {
    const calls: string[] = [];
    const f: Fetcher = async (url, init) => {
      calls.push(`${init?.method ?? "GET"} ${url}`);
      expect(init?.body).toContain("media_type=REELS");
      expect(init?.body).toContain(encodeURIComponent(INPUT.videoUrl));
      return ok({ id: "c1" });
    };
    expect((await createReelContainer(INPUT, f)).id).toBe("c1");
    expect(calls[0]).toContain("POST");
    expect(calls[0]).toContain("/123/media");
  });

  it("surfaces Meta's own error message rather than a bare status", async () => {
    const f: Fetcher = async () => fail(400, { error: { message: "Unsupported post request", code: 100 } });
    const r = await createReelContainer(INPUT, f);
    expect(r.id).toBeUndefined();
    expect(r.error).toContain("Unsupported post request");
    expect(r.error).toContain("code 100");
  });

  it("treats a 200 with no id as a failure", async () => {
    const f: Fetcher = async () => ok({});
    expect((await createReelContainer(INPUT, f)).error).toContain("no id");
  });
});

describe("waiting for the container", () => {
  // Publishing before FINISHED is error 9007, which is the single most common
  // way a video post fails.
  it("polls until FINISHED", async () => {
    const statuses = ["IN_PROGRESS", "IN_PROGRESS", "FINISHED"];
    let i = 0;
    const f: Fetcher = async () => ok({ status_code: statuses[i++] });
    const r = await waitForContainer("c1", "tok", f, { sleep: noSleep });
    expect(r.ready).toBe(true);
    expect(r.polls).toBe(3);
  });

  it("gives up on ERROR rather than polling to the limit", async () => {
    const f: Fetcher = async () => ok({ status_code: "ERROR" });
    const r = await waitForContainer("c1", "tok", f, { sleep: noSleep });
    expect(r.ready).toBe(false);
    expect(r.polls).toBe(1);
    expect(r.error).toContain("error");
  });

  it("gives up on EXPIRED", async () => {
    const f: Fetcher = async () => ok({ status_code: "EXPIRED" });
    expect((await waitForContainer("c1", "tok", f, { sleep: noSleep })).error).toContain("expired");
  });

  it("stops after the maximum polls rather than hanging the cron", async () => {
    const f: Fetcher = async () => ok({ status_code: "IN_PROGRESS" });
    const r = await waitForContainer("c1", "tok", f, { sleep: noSleep, maxPolls: 4 });
    expect(r.ready).toBe(false);
    expect(r.polls).toBe(4);
    expect(r.error).toContain("still processing");
  });

  it("waits between polls rather than hammering the API", async () => {
    const sleep = vi.fn(async () => {});
    const statuses = ["IN_PROGRESS", "FINISHED"];
    let i = 0;
    const f: Fetcher = async () => ok({ status_code: statuses[i++] });
    await waitForContainer("c1", "tok", f, { sleep, intervalMs: 5_000 });
    expect(sleep).toHaveBeenCalledWith(5_000);
  });
});

describe("the whole sequence", () => {
  it("creates, waits, publishes, and returns the media id", async () => {
    const seen: string[] = [];
    const f: Fetcher = async (url, init) => {
      if (init?.method === "POST" && url.includes("/media_publish")) {
        seen.push("publish");
        expect(init.body).toContain("creation_id=c1");
        return ok({ id: "m1" });
      }
      if (init?.method === "POST") { seen.push("create"); return ok({ id: "c1" }); }
      seen.push("status");
      return ok({ status_code: "FINISHED" });
    };
    const r = await publishReel(INPUT, f, { sleep: noSleep });
    expect(r.ok).toBe(true);
    expect(r.mediaId).toBe("m1");
    expect(seen).toEqual(["create", "status", "publish"]);
  });

  // Publishing a container that never finished is how you get 9007.
  it("never publishes when the container did not finish", async () => {
    let published = false;
    const f: Fetcher = async (url, init) => {
      if (url.includes("/media_publish")) { published = true; return ok({ id: "m1" }); }
      if (init?.method === "POST") return ok({ id: "c1" });
      return ok({ status_code: "ERROR" });
    };
    const r = await publishReel(INPUT, f, { sleep: noSleep });
    expect(r.ok).toBe(false);
    expect(published).toBe(false);
    expect(r.containerId).toBe("c1");
  });

  it("stops at creation failure without polling or publishing", async () => {
    let calls = 0;
    const f: Fetcher = async () => { calls++; return fail(400, { error: { message: "bad url" } }); };
    const r = await publishReel(INPUT, f, { sleep: noSleep });
    expect(r.ok).toBe(false);
    expect(calls).toBe(1);
    expect(r.error).toContain("bad url");
  });

  it("reports a publish failure with the container id, so it can be retried by hand", async () => {
    const f: Fetcher = async (url, init) => {
      if (url.includes("/media_publish")) return fail(400, { error: { message: "too many actions", code: 9 } });
      if (init?.method === "POST") return ok({ id: "c1" });
      return ok({ status_code: "FINISHED" });
    };
    const r = await publishReel(INPUT, f, { sleep: noSleep });
    expect(r.ok).toBe(false);
    expect(r.containerId).toBe("c1");
    expect(r.error).toContain("too many actions");
  });
});
