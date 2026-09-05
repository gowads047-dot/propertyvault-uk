import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { AREA_CITIES, areaSlug, cityName } from "./areas";

/** The directories that actually serve a city guide. */
const dirs = readdirSync(join(process.cwd(), "src", "app", "areas"), { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith("[") && e.name !== "postcodes")
  .map(e => e.name);

describe("names and slugs round-trip", () => {
  /**
   * The bug this catches, found the hard way: a title-caser that capitalises
   * every hyphen-separated part turns stoke-on-trent into "Stoke-On-Trent".
   * Wrong in a way people notice, because it is their home town, and invisible
   * in code review because the function looks obviously correct.
   */
  it("gets back the display name it started from", () => {
    for (const city of AREA_CITIES) {
      expect(cityName(areaSlug(city)), city).toBe(city);
    }
  });

  it("produces a slug that matches a real directory", () => {
    // The footer links every city from every page. A slug with no directory
    // behind it is a 404 in the footer of all 225 pages.
    for (const city of AREA_CITIES) {
      expect(dirs, city).toContain(areaSlug(city));
    }
  });

  it("lists every city guide the filesystem serves", () => {
    // The other direction: a guide that exists but is not in the list gets no
    // footer link, which is how a page ends up reachable only from the hub.
    const listed = new Set(AREA_CITIES.map(areaSlug));
    for (const dir of dirs) {
      expect(listed, `/areas/${dir} exists but is not in AREA_CITIES`).toContain(dir);
    }
  });
});

describe("cityName", () => {
  it("capitalises a single-word slug", () => {
    expect(cityName("birmingham")).toBe("Birmingham");
  });

  it("keeps UK connecting words lowercase", () => {
    expect(cityName("stoke-on-trent")).toBe("Stoke-on-Trent");
    expect(cityName("newcastle-under-lyme")).toBe("Newcastle-under-Lyme");
    expect(cityName("ashby-de-la-zouch")).toBe("Ashby-de-la-Zouch");
  });

  it("capitalises a connecting word when it comes first", () => {
    // "le Havre" would be wrong; the rule is about position, not the word.
    expect(cityName("le-havre")).toBe("Le-Havre");
  });
});
