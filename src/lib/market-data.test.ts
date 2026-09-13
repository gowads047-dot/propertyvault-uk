import { describe, it, expect } from "vitest";
import { parseUkhpi, parseBankRate, monthsAgo, monthLabel, bankRateUrl, UKHPI_REGIONS, AREA_UKHPI } from "./market-data";
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Trimmed from the live response for east-midlands/2026-06 on 13 Sep 2026.
const ukhpiJune = {
  format: "linked-data-api",
  result: {
    primaryTopic: {
      averagePrice: 240457,
      percentageAnnualChange: 2.4,
      percentageChange: -0.7,
      refMonth: "2026-06",
      refRegion: { _about: "http://landregistry.data.gov.uk/id/region/east-midlands" },
    },
  },
};

// What the endpoint returns for a month that is not published yet: the
// envelope is there, the figures are not.
const ukhpiUnpublished = { format: "linked-data-api", result: { primaryTopic: { refMonth: "2026-08" } } };

const boeCsv = "DATE,IUMABEDR\r\n30 Jun 2026,3.75\r\n31 Jul 2026,3.75\r\n31 Aug 2026,3.75\r\n";

describe("parseUkhpi", () => {
  it("reads price and both changes for a published month", () => {
    expect(parseUkhpi(ukhpiJune, "east-midlands", "East Midlands")).toEqual({
      slug: "east-midlands",
      name: "East Midlands",
      averagePrice: 240457,
      annualChange: 2.4,
      monthlyChange: -0.7,
    });
  });

  it("returns null for an unpublished month rather than a partial row", () => {
    // The page walks back a month on null. A row with a price and no change
    // would render "£240,457 undefined%".
    expect(parseUkhpi(ukhpiUnpublished, "east-midlands", "East Midlands")).toBeNull();
  });

  it("returns null on anything that is not the expected envelope", () => {
    expect(parseUkhpi(null, "x", "X")).toBeNull();
    expect(parseUkhpi({ result: {} }, "x", "X")).toBeNull();
    expect(parseUkhpi("<html>", "x", "X")).toBeNull();
  });
});

describe("parseBankRate", () => {
  it("takes the last observation and its date", () => {
    expect(parseBankRate(boeCsv)).toEqual({ rate: 3.75, asOf: "31 Aug 2026" });
  });

  it("returns null when there are no data rows", () => {
    expect(parseBankRate("DATE,IUMABEDR\n")).toBeNull();
    expect(parseBankRate("")).toBeNull();
    // An error page is HTML, not CSV.
    expect(parseBankRate("<html><body>Service unavailable</body></html>")).toBeNull();
  });
});

describe("month helpers", () => {
  const sep2026 = new Date(Date.UTC(2026, 8, 13));

  it("counts back across a year boundary", () => {
    expect(monthsAgo(0, sep2026)).toBe("2026-09");
    expect(monthsAgo(2, sep2026)).toBe("2026-07");
    expect(monthsAgo(9, sep2026)).toBe("2025-12");
  });

  it("labels a month for display", () => {
    expect(monthLabel("2026-06")).toBe("June 2026");
  });
});

describe("bankRateUrl", () => {
  it("starts thirteen months back on the first, in the Bank's DD/Mon/YYYY form", () => {
    // From 2020 the endpoint returned 500; a year's window returns 200.
    const url = bankRateUrl(new Date(Date.UTC(2026, 8, 13)));
    expect(url).toContain("Datefrom=01/Aug/2025");
    expect(url).toContain("SeriesCodes=IUMABEDR");
  });
});

describe("regions", () => {
  it("lists the twelve UKHPI regions once each, slugs the endpoint accepts", () => {
    const slugs = UKHPI_REGIONS.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(12);
    for (const s of slugs) expect(s).toMatch(/^[a-z-]+$/);
  });
});

describe("AREA_UKHPI", () => {
  it("covers every city guide under /areas, and nothing else", () => {
    // A new city page without a slug here would silently show no price;
    // a stale entry would fetch for a page that does not exist.
    const dirs = readdirSync(join(process.cwd(), "src", "app", "areas"), { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name !== "postcodes")
      .map((e) => e.name)
      .sort();
    expect(Object.keys(AREA_UKHPI).sort()).toEqual(dirs);
  });
});
