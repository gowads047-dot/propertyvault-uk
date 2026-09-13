import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every cron in vercel.json must name a path the deployed app answers
 * directly — no redirect in between.
 *
 * next.config.ts sets trailingSlash: true, so /api/social/publish answers
 * with a 308 to /api/social/publish/. Vercel's cron runner requested the
 * bare path, got the redirect, and the handler never saw an authorised
 * request. For as long as the site had crons — seven of them — not one ran:
 * social_events had no row from the publisher on any night, on nights when
 * every branch of it logs. The compliance and rent-reminder emails and the
 * weekly token exchange were in the same state.
 *
 * This asserts the slash and that a route handler exists at the path, so
 * the next cron added without one fails here instead of silently never
 * running.
 */

type Cron = { path: string; schedule: string };

const config = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8")) as { crons: Cron[] };
const nextConfig = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");

describe("vercel.json crons", () => {
  it("has crons to check", () => {
    expect(config.crons.length).toBeGreaterThan(0);
  });

  it("uses trailing slashes, because the site redirects everything to them", () => {
    expect(nextConfig).toMatch(/trailingSlash:\s*true/);
    const bare = config.crons.filter((c) => !c.path.endsWith("/")).map((c) => c.path);
    expect(bare, "cron paths that would 308 before reaching the handler").toEqual([]);
  });

  it("points every cron at an existing route handler", () => {
    const missing = config.crons
      .map((c) => c.path)
      .filter((p) => !existsSync(join(process.cwd(), "src", "app", p, "route.ts")));
    expect(missing).toEqual([]);
  });

  it("runs each cron at most once a day, which is all the Hobby plan allows", () => {
    // A more frequent expression fails the deployment outright.
    for (const c of config.crons) {
      const [minute, hour] = c.schedule.split(" ");
      expect(minute, c.path).toMatch(/^\d+$/);
      expect(hour, c.path).toMatch(/^\d+$/);
    }
  });
});
