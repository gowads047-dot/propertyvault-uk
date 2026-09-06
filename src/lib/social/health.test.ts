import { describe, it, expect } from "vitest";
import { queueHealth } from "./health";
import { memoryStore } from "./memory-store";

const NOW = new Date("2026-09-07T07:00:00Z");

describe("queue health", () => {
  it("counts what is queued in the next fourteen days and names the gaps", async () => {
    const db = memoryStore({ posts: [
      { slot_date: "2026-09-07", status: "queued", format: "autopsy" },
      { slot_date: "2026-09-08", status: "queued", format: "the-bill" },
      { slot_date: "2026-09-10", status: "published" },      // covered, not queued
      { slot_date: "2026-09-21", status: "queued" },         // outside the window
      { slot_date: "2026-09-06", status: "queued" },         // yesterday
    ] });
    const h = await queueHealth({ db, now: NOW });

    expect(h.today).toBe("2026-09-07");
    expect(h.queuedNext14.map(q => q.slot_date)).toEqual(["2026-09-07", "2026-09-08"]);
    expect(h.gapsNext14).toHaveLength(11);
    expect(h.gapsNext14[0]).toBe("2026-09-09");
    expect(h.gapsNext14).not.toContain("2026-09-10");
    expect(h.gapsNext14).toContain("2026-09-20");
    expect(h.gapsNext14).not.toContain("2026-09-21");
  });

  it("treats a held row as a gap — nothing will go out that day on its own", async () => {
    const db = memoryStore({ posts: [{ slot_date: "2026-09-07", status: "held", last_error: "qc" }] });
    const h = await queueHealth({ db, now: NOW });
    expect(h.gapsNext14).toContain("2026-09-07");
    expect(h.holds).toEqual([{ id: expect.any(String), slot_date: "2026-09-07", last_error: "qc" }]);
  });

  it("reports the most recent publish, not the first", async () => {
    const db = memoryStore({ posts: [
      { slot_date: "2026-09-01", status: "published", published_at: "2026-09-01T18:00:00Z", permalink: "a" },
      { slot_date: "2026-09-05", status: "published", published_at: "2026-09-05T18:00:00Z", permalink: "b" },
      { slot_date: "2026-09-03", status: "published", published_at: "2026-09-03T18:00:00Z", permalink: "c" },
    ] });
    const h = await queueHealth({ db, now: NOW });
    expect(h.lastPublished?.permalink).toBe("b");
  });

  it("reads the pause flag, the cap and this month's spend", async () => {
    const db = memoryStore({
      settings: { paused: true, monthly_cap_gbp: 50 },
      spend: [
        { ts: "2026-09-02T10:00:00Z", gbp: 12.5 },
        { ts: "2026-08-30T10:00:00Z", gbp: 99 },   // last month
      ],
    });
    const h = await queueHealth({ db, now: NOW });
    expect(h.paused).toBe(true);
    expect(h.monthlyCapGbp).toBe(50);
    expect(h.spendMonthToDateGbp).toBe(12.5);
  });

  // Zero, not undefined: "no spend approved" is a number the summary prints.
  it("defaults the cap to zero when the setting is missing or malformed", async () => {
    expect((await queueHealth({ db: memoryStore(), now: NOW })).monthlyCapGbp).toBe(0);
    expect((await queueHealth({ db: memoryStore({ settings: { monthly_cap_gbp: "50" } }), now: NOW })).monthlyCapGbp).toBe(0);
  });

  it("counts the evergreen pool", async () => {
    const db = memoryStore({ posts: [{ evergreen: true }, { evergreen: true }, { slot_date: "2026-09-07" }] });
    expect((await queueHealth({ db, now: NOW })).evergreenPool).toBe(2);
  });
});
