import { describe, it, expect } from "vitest";
import {
  TOPIC_BACKLOG,
  briefPrompt,
  buildPlan,
  categoryCounts,
  daysSinceLastPost,
  isCovered,
  openTopics,
  parsePostDate,
} from "./blog-planner";
import { blogPosts } from "./blog-posts";

describe("parsePostDate", () => {
  it("reads the British format the posts actually use", () => {
    expect(parsePostDate("2 August 2026")).toBe(Date.UTC(2026, 7, 2));
    expect(parsePostDate("22 January 2026")).toBe(Date.UTC(2026, 0, 22));
  });

  it("returns null rather than a wrong date for anything it cannot read", () => {
    for (const bad of ["", "soon", "2026-08-02", "32nd of Smarch 2026"]) {
      expect(parsePostDate(bad), bad).toBeNull();
    }
  });

  // Every post in the index has to parse, or staleness is measured against a
  // subset and silently reports the blog as fresher than it is.
  it("parses every date in the live blog index", () => {
    for (const p of blogPosts) {
      expect(parsePostDate(p.date), `${p.href} — "${p.date}"`).not.toBeNull();
    }
  });
});

describe("daysSinceLastPost", () => {
  it("measures from the newest post, not the last in the array", () => {
    const newest = Math.max(...blogPosts.map(p => parsePostDate(p.date)!));
    const now = new Date(newest + 10 * 86_400_000);
    expect(daysSinceLastPost(now)).toBe(10);
  });

  it("is zero on the day the newest post went out", () => {
    const newest = Math.max(...blogPosts.map(p => parsePostDate(p.date)!));
    expect(daysSinceLastPost(new Date(newest))).toBe(0);
  });
});

describe("the backlog", () => {
  it("gives every topic a reason, a phrase to match and a category", () => {
    for (const t of TOPIC_BACKLOG) {
      expect(t.title.length, t.title).toBeGreaterThan(10);
      expect(t.why.length, t.title).toBeGreaterThan(20);
      expect(t.covers.length, t.title).toBeGreaterThan(0);
      expect(t.category, t.title).toBeTruthy();
    }
  });

  it("has no duplicate titles", () => {
    expect(new Set(TOPIC_BACKLOG.map(t => t.title)).size).toBe(TOPIC_BACKLOG.length);
  });

  it("treats a topic as covered when its phrase is already published", () => {
    const t = TOPIC_BACKLOG[0];
    expect(isCovered(t, `something about ${t.covers[0]} here`)).toBe(true);
    expect(isCovered(t, "nothing relevant")).toBe(false);
  });

  it("matches case-insensitively, because titles are title-cased", () => {
    const t = TOPIC_BACKLOG[0];
    expect(isCovered(t, t.covers[0].toUpperCase())).toBe(true);
  });

  it("returns open topics in priority order, highest first", () => {
    const open = openTopics(TOPIC_BACKLOG.length);
    for (let i = 1; i < open.length; i++) {
      expect(open[i - 1].priority).toBeGreaterThanOrEqual(open[i].priority);
    }
  });

  it("respects the limit", () => {
    expect(openTopics(2).length).toBeLessThanOrEqual(2);
  });

  // The overseas gaps are the reason this exists; if one of them ever gets
  // written, it should drop out on its own rather than be suggested forever.
  it("leads with the non-resident gaps while they are unwritten", () => {
    const open = openTopics(3);
    if (open.length > 0) {
      expect(open[0].priority).toBeGreaterThanOrEqual(80);
    }
  });
});

describe("buildPlan", () => {
  it("reports the real post count", () => {
    expect(buildPlan(new Date()).postCount).toBe(blogPosts.length);
  });

  it("counts categories to the same total as the index", () => {
    const counts = categoryCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(blogPosts.length);
  });
});

describe("briefPrompt", () => {
  // The whole reason this is a brief and not a published post.
  it("forbids invented numbers and gives the escape hatch", () => {
    const p = briefPrompt(TOPIC_BACKLOG[0]).toLowerCase();
    expect(p).toContain("invent no statistics");
    expect(p).toContain("[check:");
  });

  it("asks for a source rather than a stated rule on anything that changes", () => {
    expect(briefPrompt(TOPIC_BACKLOG[0])).toMatch(/HMRC|gov\.uk|legislation/);
  });

  it("rules out the claims this site does not make", () => {
    const p = briefPrompt(TOPIC_BACKLOG[0]).toLowerCase();
    expect(p).toContain("no testimonials");
    expect(p).toContain("no claims about results");
  });

  it("carries the topic and its reason into the prompt", () => {
    const t = TOPIC_BACKLOG[2];
    const p = briefPrompt(t);
    expect(p).toContain(t.title);
    expect(p).toContain(t.why);
  });
});
