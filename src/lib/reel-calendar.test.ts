import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  CALENDAR, CAMPAIGN_START, INSTAGRAM_USER_ID, buildCalendar, campaignDay,
  reelForDay, fullCaption, durationOf,
} from "./reel-calendar";
import { BANNED_CLAIMS } from "./social/claims";

describe("the 30-day calendar", () => {
  it("fills exactly thirty days, numbered one to thirty", () => {
    expect(CALENDAR.length).toBe(30);
    expect(CALENDAR.map(r => r.day)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  it("has a unique id for every post", () => {
    const ids = CALENDAR.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id, id).toMatch(/^[a-z0-9-]+$/);
  });

  // Thirty near-identical videos read as a bot and get suppressed. This is the
  // constraint that stops that happening, enforced rather than remembered.
  it("never runs the same format on consecutive days", () => {
    for (let i = 1; i < CALENDAR.length; i++) {
      expect(
        CALENDAR[i].format,
        `day ${CALENDAR[i].day} repeats day ${CALENDAR[i - 1].day} (${CALENDAR[i].format})`,
      ).not.toBe(CALENDAR[i - 1].format);
    }
  });

  it("uses every format, and leans on none of them too heavily", () => {
    const counts: Record<string, number> = {};
    for (const r of CALENDAR) counts[r.format] = (counts[r.format] ?? 0) + 1;
    expect(Object.keys(counts).length).toBe(6);
    for (const [f, n] of Object.entries(counts)) {
      expect(n, `${f} appears ${n} times`).toBeLessThanOrEqual(9);
      expect(n, `${f} appears ${n} times`).toBeGreaterThanOrEqual(3);
    }
  });

  it("is deterministic", () => {
    expect(JSON.stringify(buildCalendar())).toBe(JSON.stringify(buildCalendar()));
  });

  it("looks up by day", () => {
    expect(reelForDay(1)?.day).toBe(1);
    expect(reelForDay(30)?.day).toBe(30);
    expect(reelForDay(31)).toBeUndefined();
    expect(reelForDay(0)).toBeUndefined();
  });
});

describe("every video", () => {
  // Watch time is the ranking signal that matters most, and a Reel that runs
  // long without earning it gets dropped. 10-20 seconds is the working range.
  it("runs between ten and twenty seconds", () => {
    for (const r of CALENDAR) {
      const d = durationOf(r);
      expect(d, `${r.id} runs ${d}s`).toBeGreaterThanOrEqual(10);
      expect(d, `${r.id} runs ${d}s`).toBeLessThanOrEqual(20);
    }
  });

  it("has four or five beats — enough to move, few enough to follow", () => {
    for (const r of CALENDAR) {
      expect(r.scenes.length, r.id).toBeGreaterThanOrEqual(4);
      expect(r.scenes.length, r.id).toBeLessThanOrEqual(5);
    }
  });

  it("gives every beat a kicker, a subtitle and a real duration", () => {
    for (const r of CALENDAR) {
      for (const [i, s] of r.scenes.entries()) {
        const where = `${r.id} scene ${i + 1}`;
        expect(s.kicker.length, where).toBeGreaterThan(3);
        expect(s.sub.length, where).toBeGreaterThan(3);
        expect(s.seconds, where).toBeGreaterThanOrEqual(2);
        expect(s.seconds, where).toBeLessThanOrEqual(4);
      }
    }
  });

  // The number has to change, or it is a still image with a soundtrack.
  it("moves the number in the opening beat of every video", () => {
    for (const r of CALENDAR) {
      expect(r.scenes[0].from, r.id).not.toBe(r.scenes[0].to);
    }
  });

  it("opens on a hook rather than a brand name", () => {
    for (const r of CALENDAR) {
      expect(r.scenes[0].kicker.toLowerCase(), r.id).not.toContain("propertyvault");
    }
  });
});

describe("captions and hashtags", () => {
  it("stays inside Instagram's 2,200 character limit with hashtags attached", () => {
    for (const r of CALENDAR) {
      expect(fullCaption(r).length, r.id).toBeLessThanOrEqual(2200);
    }
  });

  it("carries between five and fifteen hashtags, all lowercase and tag-safe", () => {
    for (const r of CALENDAR) {
      expect(r.hashtags.length, r.id).toBeGreaterThanOrEqual(5);
      expect(r.hashtags.length, r.id).toBeLessThanOrEqual(15);
      for (const h of r.hashtags) expect(h, `${r.id} :: ${h}`).toMatch(/^[a-z0-9]+$/);
      expect(new Set(r.hashtags).size, r.id).toBe(r.hashtags.length);
    }
  });

  // The standing rule, enforced by the test runner rather than by me. The
  // list itself lives in social/claims.ts, where the publisher's quality
  // check reads the same one — so this test and the live gate cannot drift.
  it("makes no guarantee, testimonial, market average or prediction", () => {
    for (const r of CALENDAR) {
      for (const re of BANNED_CLAIMS) {
        expect(re.test(fullCaption(r)), `${r.id} :: ${re}`).toBe(false);
      }
    }
  });

  // Every worked example rests on an assumed cost figure. Saying so is the
  // difference between a worked example and a claim.
  it("names its assumption wherever one is used", () => {
    for (const r of CALENDAR) {
      const usesCostRatio = r.scenes.some(s => /running costs/i.test(s.kicker));
      if (usesCostRatio) {
        expect(fullCaption(r).toLowerCase(), r.id).toContain("assumed");
      }
    }
  });

  it("does not promise guaranteed rent, only describes it", () => {
    for (const r of CALENDAR) {
      const c = fullCaption(r);
      if (/guaranteed rent/i.test(c)) {
        // Naming the product is fine; promising an outcome is not.
        expect(/guaranteed rent (?:will|means you will)/i.test(c), r.id).toBe(false);
      }
    }
  });
});

describe("variety, which is what stops it reading as a bot", () => {
  // Six formats spread evenly is not enough on its own: eight episodes all
  // opening on the same line is the same problem one level down.
  it("never opens two videos on the same line more than twice", () => {
    const counts: Record<string, number> = {};
    for (const r of CALENDAR) {
      const k = r.scenes[0].kicker;
      counts[k] = (counts[k] ?? 0) + 1;
    }
    for (const [k, n] of Object.entries(counts)) {
      expect(n, `"${k}" opens ${n} videos`).toBeLessThanOrEqual(2);
    }
  });

  // The first week is what a new visitor scrolls through before deciding.
  it("shows every format inside the first week", () => {
    const week = new Set(CALENDAR.slice(0, 7).map(r => r.format));
    expect(week.size).toBe(6);
  });

  it("spreads the busiest format across the month rather than front-loading it", () => {
    const autopsyDays = CALENDAR.filter(r => r.format === "autopsy").map(r => r.day);
    const firstThird = autopsyDays.filter(d => d <= 10).length;
    expect(firstThird, `${firstThird} autopsies in days 1-10`).toBeLessThanOrEqual(3);
  });
});

describe("the campaign schedule", () => {
  it("starts on a real date", () => {
    expect(CAMPAIGN_START).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(`${CAMPAIGN_START}T00:00:00Z`))).toBe(false);
  });

  it("counts day one as the start date itself", () => {
    expect(campaignDay(new Date(`${CAMPAIGN_START}T00:00:00Z`))).toBe(1);
    expect(campaignDay(new Date(`${CAMPAIGN_START}T23:59:59Z`))).toBe(1);
  });

  it("advances one day at a time and covers the whole calendar", () => {
    const start = Date.parse(`${CAMPAIGN_START}T12:00:00Z`);
    for (let d = 1; d <= CALENDAR.length; d++) {
      expect(campaignDay(new Date(start + (d - 1) * 86_400_000))).toBe(d);
    }
  });

  it("runs out after the calendar rather than wrapping round", () => {
    const start = Date.parse(`${CAMPAIGN_START}T12:00:00Z`);
    const past = campaignDay(new Date(start + CALENDAR.length * 86_400_000))!;
    expect(past).toBe(CALENDAR.length + 1);
    expect(reelForDay(past)).toBeUndefined();
  });

  it("returns null for a date it cannot read, rather than day NaN", () => {
    expect(campaignDay(new Date(), "not a date")).toBeNull();
  });

  // Public account ids are not secrets, but a wrong one posts to the wrong feed.
  it("targets the PropertyVault account", () => {
    expect(INSTAGRAM_USER_ID).toBe("28539365575682132");
  });
});

describe("the rendered videos", () => {
  // Meta fetches the URL itself. A missing file is a 404 at container creation
  // and a silently skipped day, so the calendar and public/reels must agree.
  it("has a file on disk for every day in the calendar", () => {
    const dir = join(process.cwd(), "public", "reels");
    for (const r of CALENDAR) {
      const name = `day-${String(r.day).padStart(2, "0")}-${r.id}.mp4`;
      expect(existsSync(join(dir, name)), `missing ${name}`).toBe(true);
    }
  });

  it("has no orphan videos left behind by a renamed episode", () => {
    const dir = join(process.cwd(), "public", "reels");
    const expected = new Set(
      CALENDAR.map(r => `day-${String(r.day).padStart(2, "0")}-${r.id}.mp4`),
    );
    for (const f of readdirSync(dir).filter(f => f.endsWith(".mp4"))) {
      expect(expected.has(f), `${f} is not in the calendar`).toBe(true);
    }
  });

  it("produces files big enough to be real video", () => {
    const dir = join(process.cwd(), "public", "reels");
    for (const r of CALENDAR) {
      const name = `day-${String(r.day).padStart(2, "0")}-${r.id}.mp4`;
      expect(statSync(join(dir, name)).size, name).toBeGreaterThan(50_000);
    }
  });
});
