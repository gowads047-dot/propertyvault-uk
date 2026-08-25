import { describe, it, expect } from "vitest";
import {
  WANTED_KINDS,
  KIND_LABEL,
  defaultChannel,
  isLive,
  daysUntilExpiry,
  expiryLabel,
  postedLabel,
  validate,
  matches,
  findMatches,
  matchSummary,
  toPosts,
  sortPosts,
  type WantedPost,
  type MatchableSpace,
  type WantedQueryRow,
} from "./makan-wanted";

const NOW = new Date("2026-08-24T12:00:00Z");
const inDays = (n: number) => new Date(NOW.getTime() + n * 86_400_000).toISOString();
const agoDays = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

function post(over: Partial<WantedPost> = {}): WantedPost {
  return {
    id: "w1",
    kind: "room",
    areaText: "Selly Oak, Birmingham",
    budgetMaxPcm: 700,
    neededFrom: null,
    detail: null,
    channel: "public",
    status: "open",
    expiresAt: inDays(60),
    createdAt: agoDays(1),
    isMine: false,
    ...over,
  };
}

function space(over: Partial<MatchableSpace> = {}): MatchableSpace {
  return {
    spaceId: "s1",
    label: "Room 1",
    rentPcm: 650,
    city: "Birmingham",
    postcode: "B29 6AA",
    areaLabel: "Selly Oak",
    ...over,
  };
}

describe("kinds", () => {
  it("labels every kind", () => {
    for (const k of WANTED_KINDS) expect(KIND_LABEL[k], k).toBeTruthy();
  });

  // A provider saying they need to place someone is saying something about a
  // vulnerable person. That is never public, and it is not left to whoever
  // fills the form to remember.
  it("keeps supported placement off the public board by default", () => {
    expect(defaultChannel("supported_placement")).toBe("landlords_only");
    expect(defaultChannel("room")).toBe("public");
    expect(defaultChannel("whole_property")).toBe("public");
  });
});

describe("liveness and expiry", () => {
  it("is live only while open and unexpired", () => {
    expect(isLive(post(), NOW)).toBe(true);
    expect(isLive(post({ status: "closed" }), NOW)).toBe(false);
    expect(isLive(post({ status: "fulfilled" }), NOW)).toBe(false);
    expect(isLive(post({ expiresAt: agoDays(1) }), NOW)).toBe(false);
  });

  it("counts days remaining", () => {
    expect(daysUntilExpiry(post({ expiresAt: inDays(10) }), NOW)).toBe(10);
    expect(daysUntilExpiry(post({ expiresAt: agoDays(2) }), NOW)).toBe(-2);
  });

  it.each([
    [post({ expiresAt: agoDays(1) }), "Expired"],
    [post({ expiresAt: inDays(1) }), "Expires tomorrow"],
    [post({ expiresAt: inDays(9) }), "Expires in 9 days"],
    [post({ expiresAt: inDays(60) }), "Expires in 9 weeks"],
    [post({ status: "fulfilled" }), "Fulfilled"],
    [post({ status: "closed" }), "Closed"],
  ])("describes expiry as %#", (p, expected) => {
    expect(expiryLabel(p, NOW)).toBe(expected);
  });
});

describe("postedLabel", () => {
  it.each([
    [new Date(NOW.getTime() - 30_000).toISOString(), "just now"],
    [new Date(NOW.getTime() - 20 * 60_000).toISOString(), "20 minutes ago"],
    [new Date(NOW.getTime() - 3 * 3_600_000).toISOString(), "3 hours ago"],
    [agoDays(1), "1 day ago"],
    [agoDays(12), "12 days ago"],
    [agoDays(75), "2 months ago"],
  ])("renders %s as %s", (createdAt, expected) => {
    expect(postedLabel({ createdAt }, NOW)).toBe(expected);
  });
});

describe("validate", () => {
  it("accepts a minimal post", () => {
    expect(validate({ kind: "room", areaText: "Sandwell", budgetMaxPcm: "" })).toEqual({ ok: true });
  });

  it("requires a real kind", () => {
    const r = validate({ kind: "castle", areaText: "Sandwell", budgetMaxPcm: null });
    expect(r).toMatchObject({ ok: false, field: "kind" });
  });

  it("requires an area, however rough", () => {
    expect(validate({ kind: "room", areaText: "   ", budgetMaxPcm: null })).toMatchObject({
      ok: false,
      field: "areaText",
    });
  });

  it("accepts a blank budget but not a nonsense one", () => {
    expect(validate({ kind: "room", areaText: "B29", budgetMaxPcm: null })).toEqual({ ok: true });
    expect(validate({ kind: "room", areaText: "B29", budgetMaxPcm: "-5" })).toMatchObject({ ok: false, field: "budgetMaxPcm" });
    expect(validate({ kind: "room", areaText: "B29", budgetMaxPcm: "lots" })).toMatchObject({ ok: false, field: "budgetMaxPcm" });
  });
});

describe("matching", () => {
  it("matches on a shared place word", () => {
    expect(matches(post(), space())).toBe(true);
  });

  it("matches a postcode district typed instead of a name", () => {
    expect(matches(post({ areaText: "B29" }), space())).toBe(true);
  });

  // Being shown rooms you cannot afford is worse than being shown none.
  it("excludes anything over budget", () => {
    expect(matches(post({ budgetMaxPcm: 600 }), space({ rentPcm: 650 }))).toBe(false);
    expect(matches(post({ budgetMaxPcm: 650 }), space({ rentPcm: 650 }))).toBe(true);
  });

  it("ignores budget when the poster did not give one", () => {
    expect(matches(post({ budgetMaxPcm: null }), space({ rentPcm: 5000 }))).toBe(true);
  });

  it("ignores budget when the room has no rent set", () => {
    expect(matches(post({ budgetMaxPcm: 400 }), space({ rentPcm: null }))).toBe(true);
  });

  it("does not match an unrelated place", () => {
    expect(matches(post({ areaText: "Aberdeen" }), space())).toBe(false);
  });

  it("filters a list", () => {
    const spaces = [space({ spaceId: "a" }), space({ spaceId: "b", city: "Leeds", postcode: "LS1 1AA", areaLabel: "City centre" })];
    expect(findMatches(post(), spaces).map(s => s.spaceId)).toEqual(["a"]);
  });
});

describe("matchSummary", () => {
  // The tempting copy is "we'll alert landlords in your area". Nothing alerts
  // anyone yet, so this must not say so.
  it("never promises a notification that does not exist", () => {
    for (const n of [0, 1, 7]) {
      for (const ch of ["public", "landlords_only"] as const) {
        const s = matchSummary(n, ch);
        expect(s, s).not.toMatch(/notif|alert|will be told|we'll let/i);
      }
    }
  });

  it("is honest about finding nothing", () => {
    expect(matchSummary(0, "public")).toBe("No rooms on Makan match this yet. It is on the public board now.");
  });

  it("says who can see a private post", () => {
    expect(matchSummary(0, "landlords_only")).toContain("Landlords and providers on Makan can see it.");
  });

  it("counts in the singular", () => {
    expect(matchSummary(1, "public")).toContain("1 room on Makan already matches");
    expect(matchSummary(3, "public")).toContain("3 rooms on Makan already match");
  });
});

describe("toPosts", () => {
  const row: WantedQueryRow = {
    id: "w1",
    kind: "room",
    area_text: "Selly Oak",
    budget_max_pcm: 700,
    needed_from: null,
    detail: null,
    channel: "public",
    status: "open",
    expires_at: inDays(60),
    created_at: agoDays(1),
    created_by: "u1",
  };

  it("marks the caller's own posts", () => {
    expect(toPosts([row], "u1")[0].isMine).toBe(true);
    expect(toPosts([row], "u2")[0].isMine).toBe(false);
    expect(toPosts([row], null)[0].isMine).toBe(false);
  });
});

describe("sortPosts", () => {
  it("puts live posts first, newest first", () => {
    const sorted = sortPosts(
      [
        post({ id: "old-live", createdAt: agoDays(10) }),
        post({ id: "closed", status: "closed", createdAt: agoDays(1) }),
        post({ id: "new-live", createdAt: agoDays(1) }),
      ],
      NOW
    );
    expect(sorted.map(p => p.id)).toEqual(["new-live", "old-live", "closed"]);
  });

  it("does not mutate the input", () => {
    const posts = [post({ id: "1", status: "closed" }), post({ id: "2" })];
    sortPosts(posts, NOW);
    expect(posts.map(p => p.id)).toEqual(["1", "2"]);
  });
});
