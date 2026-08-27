import { describe, it, expect } from "vitest";
import {
  ACCEPTED_TYPES,
  MAX_BYTES,
  MAX_PHOTOS,
  checkFile,
  coverOf,
  mediaToken,
  nextSortOrder,
  positionLabel,
  remainingSlots,
  reorder,
  stepIndex,
  storagePath,
  swipeDelta,
  toMedia,
  triage,
  type MediaItem,
} from "./makan-media";

const item = (over: Partial<MediaItem> = {}): MediaItem => ({
  id: "m1", url: "https://x/1.jpg", caption: null, sortOrder: 0, ...over,
});

/** Stands in for a File without needing one. */
const file = (name: string, type: string, size: number) =>
  ({ name, type, size }) as unknown as File;

describe("checkFile", () => {
  it("accepts the formats every browser can render", () => {
    for (const t of ACCEPTED_TYPES) {
      expect(checkFile({ name: "a", type: t, size: 1000 }), t).toEqual({ ok: true });
    }
  });

  // Safari uploads HEIC happily and everything else then refuses to show it,
  // so the listing looks broken to everyone but the landlord who posted it.
  it("rejects HEIC and says how to fix it", () => {
    const r = checkFile({ name: "IMG_1.heic", type: "image/heic", size: 1000 });
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.message).toMatch(/Most Compatible/);
  });

  it("rejects a file over the size limit and names the size", () => {
    const r = checkFile({ name: "big.jpg", type: "image/jpeg", size: MAX_BYTES + 1 });
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.message).toMatch(/10 MB/);
  });

  it("rejects an empty file", () => {
    expect(checkFile({ name: "x.jpg", type: "image/jpeg", size: 0 })).toMatchObject({ ok: false });
  });

  it("names the file in every refusal, so a batch says which one failed", () => {
    for (const f of [
      { name: "one.heic", type: "image/heic", size: 10 },
      { name: "two.jpg", type: "image/jpeg", size: MAX_BYTES + 1 },
      { name: "three.jpg", type: "image/jpeg", size: 0 },
    ]) {
      const r = checkFile(f);
      if (!r.ok) expect(r.message, f.name).toContain(f.name);
    }
  });
});

describe("triage", () => {
  // Eight good photos and one HEIC should upload eight photos.
  it("uploads what it can and explains what it could not", () => {
    const { accepted, rejected } = triage(
      [file("a.jpg", "image/jpeg", 10), file("b.heic", "image/heic", 10), file("c.png", "image/png", 10)],
      0
    );
    expect(accepted.map(f => f.name)).toEqual(["a.jpg", "c.png"]);
    expect(rejected).toHaveLength(1);
  });

  it("stops at the per-listing limit and says so", () => {
    const files = Array.from({ length: 5 }, (_, i) => file(`p${i}.jpg`, "image/jpeg", 10));
    const { accepted, rejected } = triage(files, MAX_PHOTOS - 2);
    expect(accepted).toHaveLength(2);
    expect(rejected).toHaveLength(3);
    expect(rejected[0]).toContain(String(MAX_PHOTOS));
  });

  it("accepts nothing when the listing is already full", () => {
    expect(triage([file("a.jpg", "image/jpeg", 10)], MAX_PHOTOS).accepted).toEqual([]);
  });

  it("counts remaining slots without going negative", () => {
    expect(remainingSlots(0)).toBe(MAX_PHOTOS);
    expect(remainingSlots(MAX_PHOTOS + 5)).toBe(0);
  });
});

describe("storagePath", () => {
  it("keys by space so the storage policy can check ownership from the path", () => {
    expect(storagePath("sp1", "image/jpeg", "abc")).toBe("sp1/abc.jpg");
    expect(storagePath("sp1", "image/png", "abc")).toBe("sp1/abc.png");
    expect(storagePath("sp1", "image/webp", "abc")).toBe("sp1/abc.webp");
  });

  // The original name is attacker-controlled and often carries the landlord's
  // own name.
  it("never uses the uploaded filename", () => {
    expect(storagePath("sp1", "image/jpeg", "abc")).not.toMatch(/IMG|jpeg$/i);
  });

  it("produces a url-safe token of a fixed length", () => {
    let n = 0;
    const t = mediaToken(() => ((n = (n + 7) % 36) / 36));
    expect(t).toHaveLength(16);
    expect(t).toMatch(/^[a-z0-9]+$/);
  });
});

describe("ordering", () => {
  it("appends new photos after the existing ones", () => {
    expect(nextSortOrder([])).toBe(0);
    expect(nextSortOrder([item({ sortOrder: 0 }), item({ sortOrder: 4 })])).toBe(5);
  });

  it("sorts by order, then by id so the result is stable", () => {
    const got = toMedia([
      { id: "b", url: "u", caption: null, sort_order: 1 },
      { id: "a", url: "u", caption: null, sort_order: 1 },
      { id: "c", url: "u", caption: null, sort_order: 0 },
    ]);
    expect(got.map(x => x.id)).toEqual(["c", "a", "b"]);
  });

  // Orders drift apart as photos come and go, and two photos sharing one makes
  // the gallery order depend on whatever Postgres returns first.
  it("renumbers from zero after a move", () => {
    const items = [item({ id: "a", sortOrder: 0 }), item({ id: "b", sortOrder: 7 }), item({ id: "c", sortOrder: 9 })];
    const moved = reorder(items, 2, 0);
    expect(moved.map(x => x.id)).toEqual(["c", "a", "b"]);
    expect(moved.map(x => x.sortOrder)).toEqual([0, 1, 2]);
  });

  it("renumbers even when the move is a no-op or out of range", () => {
    const items = [item({ id: "a", sortOrder: 3 }), item({ id: "b", sortOrder: 8 })];
    for (const [from, to] of [[0, 0], [-1, 1], [0, 9]] as const) {
      const got = reorder(items, from, to);
      expect(got.map(x => x.sortOrder), `${from}->${to}`).toEqual([0, 1]);
      expect(got.map(x => x.id), `${from}->${to}`).toEqual(["a", "b"]);
    }
  });

  it("takes the first photo as the cover", () => {
    expect(coverOf([])).toBeNull();
    expect(coverOf([item({ id: "a" }), item({ id: "b" })])?.id).toBe("a");
  });
});

describe("the swipe gallery", () => {
  it("wraps in both directions rather than stopping dead", () => {
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
    expect(stepIndex(0, 1, 3)).toBe(1);
  });

  it("survives an empty gallery", () => {
    expect(stepIndex(0, 1, 0)).toBe(0);
    expect(positionLabel(0, 0)).toBe("");
  });

  it("says how far through you are", () => {
    expect(positionLabel(2, 12)).toBe("3 of 12");
  });

  // A tap that drifts a few pixels must not change the photo.
  it("ignores a drift and acts on a deliberate swipe", () => {
    expect(swipeDelta(200, 190)).toBe(0);
    expect(swipeDelta(200, 100)).toBe(1);
    expect(swipeDelta(100, 200)).toBe(-1);
  });
});
