import { describe, it, expect } from "vitest";
import { qualityCheck, type AssetFetcher, type QcInput } from "./qc";

const TAGS = "#ukproperty #buytolet #uklandlord #propertyinvestmentuk #dealanalysis";

const good: QcInput = {
  asset_url: "https://www.propertyvaultuk.co.uk/reels/day-01-autopsy-1.mp4",
  asset_sha256: "a".repeat(64),
  caption: `6.7% gross. £120 a month. Running costs assumed at 28% of rent.\n\n${TAGS}`,
  channel: "instagram",
};

/** A fetcher that answers from a table, defaulting to a healthy mp4. */
function serving(table: Record<string, { status: number; headers?: Record<string, string> }> = {}): AssetFetcher {
  return async (url, init) => {
    expect(init.redirect).toBe("manual");
    const r = table[`${init.method} ${url}`] ?? table[url] ?? {
      status: 200, headers: { "content-type": "video/mp4", "content-length": "412000" },
    };
    return { status: r.status, headers: { get: (k: string) => r.headers?.[k.toLowerCase()] ?? null } };
  };
}

const never = { alreadyPublished: async () => false };
const failing = (r: Awaited<ReturnType<typeof qualityCheck>>) => r.checks.filter(c => !c.ok).map(c => c.name);

describe("a healthy post", () => {
  it("passes every check, and lists them all", async () => {
    const r = await qualityCheck(good, serving(), never);
    expect(r.ok).toBe(true);
    expect(r.checks.map(c => c.name)).toEqual([
      "asset_url", "asset_reachable", "asset_content_type", "asset_size",
      "caption_length", "hashtags", "claims", "duplicate",
    ]);
  });
});

describe("the asset", () => {
  it("must be plain https with no query string — Meta fetches it itself", async () => {
    expect(failing(await qualityCheck({ ...good, asset_url: "http://x/a.mp4" }, serving(), never))).toContain("asset_url");
    expect(failing(await qualityCheck({ ...good, asset_url: "https://x/a.mp4?v=2" }, serving(), never))).toContain("asset_url");
    expect(failing(await qualityCheck({ ...good, asset_url: "not a url" }, serving(), never))).toContain("asset_url");
  });

  it("does not fetch a URL that already failed the shape check", async () => {
    let fetched = false;
    const f: AssetFetcher = async () => { fetched = true; return { status: 200, headers: { get: () => null } }; };
    await qualityCheck({ ...good, asset_url: "http://x/a.mp4" }, f, never);
    expect(fetched).toBe(false);
  });

  // The apex domain 308s to www. A row seeded with the apex would fail at
  // Meta with a generic error; here it fails with the word "redirects".
  it("fails a redirect rather than following it", async () => {
    const r = await qualityCheck(good, serving({ [good.asset_url]: { status: 308, headers: { location: "https://www.x/" } } }), never);
    const c = r.checks.find(x => x.name === "asset_reachable")!;
    expect(c.ok).toBe(false);
    expect(c.detail).toContain("redirects");
  });

  it("fails a 404", async () => {
    const r = await qualityCheck(good, serving({ [good.asset_url]: { status: 404 } }), never);
    expect(failing(r)).toContain("asset_reachable");
  });

  it("fails the wrong content type", async () => {
    const r = await qualityCheck(good, serving({
      [good.asset_url]: { status: 200, headers: { "content-type": "text/html", "content-length": "500000" } },
    }), never);
    expect(failing(r)).toEqual(["asset_content_type"]);
  });

  it("fails a file too small to be a rendered Reel", async () => {
    const r = await qualityCheck(good, serving({
      [good.asset_url]: { status: 200, headers: { "content-type": "video/mp4", "content-length": "1024" } },
    }), never);
    expect(failing(r)).toEqual(["asset_size"]);
  });

  it("fails a missing content-length rather than assuming", async () => {
    const r = await qualityCheck(good, serving({
      [good.asset_url]: { status: 200, headers: { "content-type": "video/mp4" } },
    }), never);
    expect(failing(r)).toEqual(["asset_size"]);
  });

  it("falls back to GET when HEAD is refused", async () => {
    const r = await qualityCheck(good, serving({
      [`HEAD ${good.asset_url}`]: { status: 405 },
      [`GET ${good.asset_url}`]: { status: 200, headers: { "content-type": "video/mp4", "content-length": "300000" } },
    }), never);
    expect(r.ok).toBe(true);
  });

  it("reports a network error as unreachable rather than throwing", async () => {
    const f: AssetFetcher = async () => { throw new Error("ECONNRESET"); };
    const r = await qualityCheck(good, f, never);
    const c = r.checks.find(x => x.name === "asset_reachable")!;
    expect(c.ok).toBe(false);
    expect(c.detail).toContain("ECONNRESET");
  });
});

describe("the caption", () => {
  it("fails over 2,200 characters", async () => {
    const r = await qualityCheck({ ...good, caption: `${"x".repeat(2_200)} ${TAGS}` }, serving(), never);
    expect(failing(r)).toEqual(["caption_length"]);
  });

  it("needs between five and thirty hashtags", async () => {
    expect(failing(await qualityCheck({ ...good, caption: "no tags at all" }, serving(), never))).toEqual(["hashtags"]);
    expect(failing(await qualityCheck({ ...good, caption: "#a #b #c #d" }, serving(), never))).toEqual(["hashtags"]);
    const many = Array.from({ length: 31 }, (_, i) => `#t${i}`).join(" ");
    expect(failing(await qualityCheck({ ...good, caption: many }, serving(), never))).toEqual(["hashtags"]);
    const thirty = Array.from({ length: 30 }, (_, i) => `#t${i}`).join(" ");
    expect(failing(await qualityCheck({ ...good, caption: thirty }, serving(), never))).toEqual([]);
  });

  // The same list the calendar test uses, applied to whatever is in the queue.
  it("fails a banned claim and names the pattern", async () => {
    const r = await qualityCheck({ ...good, caption: `Guaranteed 8% returns. ${TAGS}` }, serving(), never);
    const c = r.checks.find(x => x.name === "claims")!;
    expect(c.ok).toBe(false);
    expect(c.detail).toContain("guaranteed");
  });
});

describe("duplicates", () => {
  it("fails an asset that has already been published", async () => {
    const r = await qualityCheck(good, serving(), { alreadyPublished: async (ch, sha) => ch === "instagram" && sha === good.asset_sha256 });
    expect(failing(r)).toEqual(["duplicate"]);
  });

  it("fails a row with no digest, because it cannot be checked", async () => {
    const r = await qualityCheck({ ...good, asset_sha256: null }, serving(), never);
    expect(failing(r)).toEqual(["duplicate"]);
  });

  // The fallback is a repeat by design. It has to pass, or there is no fallback.
  it("passes an evergreen clone without a digest", async () => {
    const r = await qualityCheck(
      { ...good, asset_sha256: null, source_refs: { evergreen_of: "pool-row-id" } },
      serving(),
      { alreadyPublished: async () => { throw new Error("should not be asked"); } },
    );
    expect(r.ok).toBe(true);
  });
});
