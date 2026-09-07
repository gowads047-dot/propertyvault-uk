import { describe, it, expect } from "vitest";
import { calendarRows, evergreenRows, parseDays, fileNameFor, fileNameFromUrl, digestUpdates } from "./seed";
import { CALENDAR, fullCaption } from "../reel-calendar";

const sha = (f: string) => `sha-of-${f}`;

describe("calendar rows", () => {
  const rows = calendarRows({ startDate: "2026-09-08", sha256Of: sha });

  it("makes one queued row per calendar day, dated consecutively from the start", () => {
    expect(rows).toHaveLength(CALENDAR.length);
    expect(rows[0].slot_date).toBe("2026-09-08");
    expect(rows[1].slot_date).toBe("2026-09-09");
    expect(rows[29].slot_date).toBe("2026-10-07");
    expect(rows.every(r => r.status === "queued" && r.evergreen === false)).toBe(true);
  });

  it("points at the canonical www host, which is the one that answers 200", () => {
    for (const r of rows) {
      expect(r.asset_url).toMatch(/^https:\/\/www\.propertyvaultuk\.co\.uk\/reels\/day-\d\d-[a-z0-9-]+\.mp4$/);
      expect(r.asset_url).not.toContain("?");
    }
  });

  it("carries the posted caption, the format and the digest of the file", () => {
    const spec = CALENDAR[0];
    expect(rows[0].caption).toBe(fullCaption(spec));
    expect(rows[0].format).toBe(spec.format);
    expect(rows[0].asset_sha256).toBe(sha(fileNameFor(spec)));
  });

  it("records where the content came from", () => {
    expect(rows[0].source_refs).toEqual({
      calendarId: CALENDAR[0].id, day: 1, calculators: ["tax.ts", "finance.ts", "deal-score.ts"],
    });
  });

  it("refuses a start date it cannot read", () => {
    expect(() => calendarRows({ startDate: "next monday", sha256Of: sha })).toThrow(/YYYY-MM-DD/);
  });
});

describe("evergreen rows", () => {
  it("copies the chosen days into the pool with no date", () => {
    const rows = evergreenRows({ days: [1, 5], sha256Of: sha });
    expect(rows).toHaveLength(2);
    expect(rows.every(r => r.evergreen === true && r.slot_date === null)).toBe(true);
    expect(rows[1].caption).toBe(fullCaption(CALENDAR[4]));
    expect(rows[1].asset_sha256).toBe(sha(fileNameFor(CALENDAR[4])));
  });

  it("refuses a day the calendar does not have", () => {
    expect(() => evergreenRows({ days: [31], sha256Of: sha })).toThrow(/1-30/);
  });
});

describe("refreshing digests after a re-render", () => {
  const row = (id: string, file: string, sha: string | null, status = "queued") => ({
    id, asset_url: `https://www.propertyvaultuk.co.uk/reels/${file}`, asset_sha256: sha, status,
  });
  const onDisk: Record<string, string | null> = { "day-01-a.mp4": "new-1", "day-02-b.mp4": "same-2", "day-03-c.mp4": null };
  const sha = (f: string) => onDisk[f] ?? null;

  it("reads the file name off a queue row's URL", () => {
    expect(fileNameFromUrl("https://www.propertyvaultuk.co.uk/reels/day-07-autopsy-2.mp4")).toBe("day-07-autopsy-2.mp4");
    expect(fileNameFromUrl("https://elsewhere.example/video.mp4")).toBeNull();
  });

  it("lists queued rows whose file now has a different digest, and nothing else", () => {
    const updates = digestUpdates([
      row("changed", "day-01-a.mp4", "old-1"),
      row("unchanged", "day-02-b.mp4", "same-2"),
      row("missing-on-disk", "day-03-c.mp4", "old-3"),
      row("published", "day-01-a.mp4", "old-1", "published"),
      row("held", "day-01-a.mp4", "old-1", "held"),
      row("no-digest-yet", "day-01-a.mp4", null),
    ], sha);
    expect(updates).toEqual([
      { id: "changed", file: "day-01-a.mp4", from: "old-1", to: "new-1" },
      { id: "no-digest-yet", file: "day-01-a.mp4", from: null, to: "new-1" },
    ]);
  });
});

describe("the --evergreen argument", () => {
  it("parses a comma list", () => {
    expect(parseDays("1, 5,12")).toEqual([1, 5, 12]);
  });
  it("refuses anything that is not a day number", () => {
    expect(() => parseDays("1,two")).toThrow(/two/);
    expect(() => parseDays("0")).toThrow();
  });
});
