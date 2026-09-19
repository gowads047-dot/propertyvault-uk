import { describe, it, expect } from "vitest";
import { attributionFrom, hasCampaign, pickAttribution } from "./attribution";

const now = new Date("2026-09-19T10:00:00Z");

describe("attributionFrom", () => {
  it("captures utm parameters and click ids with the landing page", () => {
    const a = attributionFrom("?utm_source=instagram&utm_medium=social&utm_campaign=reel-12&fbclid=abc", "/guaranteed-rent/", "", now);
    expect(a).toEqual({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "reel-12",
      fbclid: "abc",
      landing_page: "/guaranteed-rent/",
      captured_at: "2026-09-19T10:00:00.000Z",
    });
    expect(hasCampaign(a!)).toBe(true);
  });

  it("captures an external referral on its own, but not the site's own pages", () => {
    const ext = attributionFrom("", "/blog/", "https://www.google.com/", now);
    expect(ext).toMatchObject({ referrer: "https://www.google.com/", landing_page: "/blog/" });
    expect(hasCampaign(ext!)).toBe(false);
    expect(attributionFrom("", "/blog/", "https://www.propertyvaultuk.co.uk/", now)).toBeNull();
  });

  it("is nothing for a direct visit", () => {
    expect(attributionFrom("", "/", "", now)).toBeNull();
    expect(attributionFrom("?ref=friend", "/", "", now)).toBeNull();
  });

  it("caps each value", () => {
    const a = attributionFrom(`?utm_source=${"x".repeat(500)}`, "/", "", now);
    expect(a!.utm_source).toHaveLength(200);
  });
});

describe("pickAttribution", () => {
  it("takes only attribution keys out of a form body", () => {
    expect(pickAttribution({ name: "A", email: "a@b.com", utm_source: " ig ", gclid: "g1", landing_page: "/", junk: "no" }))
      .toEqual({ utm_source: "ig", gclid: "g1", landing_page: "/" });
    expect(pickAttribution({ name: "A" })).toBeNull();
  });
});
