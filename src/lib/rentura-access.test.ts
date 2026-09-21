import { describe, it, expect } from "vitest";
import { hasRenturaAccess, renturaPathNeedsAccess } from "./rentura-access";

const NOW = new Date("2026-09-20T12:00:00Z");
const later = "2026-10-01T00:00:00Z";
const earlier = "2026-09-01T00:00:00Z";

describe("hasRenturaAccess", () => {
  it("lets a trial, a paying member and a card being retried in", () => {
    expect(hasRenturaAccess({ status: "trialing", access_until: null }, NOW)).toBe(true);
    expect(hasRenturaAccess({ status: "active", access_until: null }, NOW)).toBe(true);
    expect(hasRenturaAccess({ status: "past_due", access_until: null }, NOW)).toBe(true);
  });

  it("keeps a cancelled member until access_until, and not a day after", () => {
    expect(hasRenturaAccess({ status: "cancelled", access_until: later }, NOW)).toBe(true);
    expect(hasRenturaAccess({ status: "cancelled", access_until: earlier }, NOW)).toBe(false);
    expect(hasRenturaAccess({ status: "cancelled", access_until: null }, NOW)).toBe(false);
    expect(hasRenturaAccess({ status: "canceled", access_until: later }, NOW)).toBe(true); // Stripe's spelling
  });

  it("refuses the row join creates before Stripe, the Stripe failure states, and no row at all", () => {
    expect(hasRenturaAccess({ status: "pending", access_until: null }, NOW)).toBe(false);
    expect(hasRenturaAccess({ status: "incomplete", access_until: null }, NOW)).toBe(false);
    expect(hasRenturaAccess({ status: "unpaid", access_until: null }, NOW)).toBe(false);
    expect(hasRenturaAccess({ status: null, access_until: later }, NOW)).toBe(false);
    expect(hasRenturaAccess(null, NOW)).toBe(false);
    expect(hasRenturaAccess(undefined, NOW)).toBe(false);
  });
});

describe("renturaPathNeedsAccess", () => {
  it("gates the app and leaves the landing page, sign-in, join, subscribe, settings and admin open", () => {
    for (const open of ["/rentura", "/rentura/", "/rentura/auth", "/rentura/auth/", "/rentura/join/", "/rentura/subscribe/", "/rentura/settings/", "/rentura/admin/", "/rentura/admin/errors/"]) {
      expect(renturaPathNeedsAccess(open), open).toBe(false);
    }
    for (const app of ["/rentura/dashboard", "/rentura/dashboard/", "/rentura/properties/abc/", "/rentura/tenants/", "/rentura/tax/", "/rentura/rrb/", "/rentura/documents/"]) {
      expect(renturaPathNeedsAccess(app), app).toBe(true);
    }
    expect(renturaPathNeedsAccess("/makan/rooms/")).toBe(false);
    expect(renturaPathNeedsAccess("/")).toBe(false);
  });
});
