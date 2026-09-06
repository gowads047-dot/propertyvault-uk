import { describe, it, expect } from "vitest";
import { londonDate, addDays, isYmd } from "./dates";

describe("today, in London", () => {
  // 18:00 UTC in British Summer Time is 19:00 — same day. But 23:30 UTC in
  // summer is 00:30 tomorrow, and that is the case a UTC date would get wrong.
  it("rolls to the next day at midnight London time, not midnight UTC", () => {
    expect(londonDate(new Date("2026-07-01T23:30:00Z"))).toBe("2026-07-02");
    expect(londonDate(new Date("2026-07-01T22:30:00Z"))).toBe("2026-07-01");
  });

  it("matches UTC in winter", () => {
    expect(londonDate(new Date("2026-01-15T23:30:00Z"))).toBe("2026-01-15");
    expect(londonDate(new Date("2026-01-16T00:10:00Z"))).toBe("2026-01-16");
  });

  it("gives the same day for both cron slots", () => {
    expect(londonDate(new Date("2026-09-07T18:00:00Z"))).toBe(londonDate(new Date("2026-09-07T18:40:00Z")));
  });
});

describe("date arithmetic", () => {
  it("adds and subtracts whole days across a month boundary", () => {
    expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-09-07", 0)).toBe("2026-09-07");
  });

  it("refuses a date it cannot read rather than producing NaN", () => {
    expect(() => addDays("tomorrow", 1)).toThrow(/YYYY-MM-DD/);
  });

  it("recognises a YYYY-MM-DD", () => {
    expect(isYmd("2026-09-07")).toBe(true);
    expect(isYmd("2026-13-07")).toBe(false);
    expect(isYmd("7 Sep 2026")).toBe(false);
  });
});
