import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { SERVICES, servicesByStage, findService, READINESS_LABEL, READINESS_MEANING } from "./services";

const appDir = join(process.cwd(), "src", "app");

describe("the catalogue", () => {
  it("has unique slugs", () => {
    const slugs = SERVICES.map(s => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every readiness state a label and a plain-English meaning", () => {
    for (const s of SERVICES) {
      expect(READINESS_LABEL[s.readiness], s.slug).toBeTruthy();
      expect(READINESS_MEANING[s.readiness], s.slug).toBeTruthy();
    }
  });

  it("finds a service by slug and nothing by a slug that does not exist", () => {
    expect(findService("rentura")?.name).toBe("Rentura");
    expect(findService("not-a-service")).toBeUndefined();
  });

  it("groups by stage without dropping or duplicating anything", () => {
    const grouped = servicesByStage().flatMap(g => g.services);
    expect(grouped).toHaveLength(SERVICES.length);
    expect(new Set(grouped.map(s => s.slug)).size).toBe(SERVICES.length);
  });
});

describe("what the site is allowed to promise", () => {
  /**
   * The bug this exists to prevent, which was live on /manage: nine services
   * listed with firm prices — £15 a tenant for referencing, 1% of rent
   * collected, £10 a report for inventories — none of which the platform can
   * deliver and none of which has a Stripe price behind it. Only two Stripe
   * prices exist in the whole codebase.
   *
   * A price is a promise that something can be bought. Anything not `live`
   * cannot be bought, so it cannot carry one.
   */
  it("puts a price only on a service you can actually buy today", () => {
    for (const s of SERVICES) {
      if (s.readiness !== "live") {
        expect(s.price, `${s.slug} is "${s.readiness}" but shows a price`).toBeUndefined();
      }
    }
  });

  it("never implies a service is running when it is on a waitlist", () => {
    // "Get started", "Book now" and "Order" all say the thing exists. The
    // button has to describe what pressing it really does.
    const impliesAvailable = /\b(get started|book|order|buy|hire|schedule)\b/i;
    for (const s of SERVICES) {
      if (s.readiness === "waitlist") {
        expect(impliesAvailable.test(s.cta), `${s.slug}: "${s.cta}"`).toBe(false);
        expect(s.cta.toLowerCase(), s.slug).toContain("waitlist");
      }
    }
  });

  it("has no service claiming a regulated status the project has not evidenced", () => {
    // Nothing in the repository establishes FCA authorisation, RICS
    // regulation, redress membership or client money protection. Until one of
    // those is confirmed in writing, no service copy may imply it.
    const regulated = /\b(FCA[- ]?(authorised|regulated)|RICS[- ]?(regulated|registered)|redress scheme|client money protection|CMP scheme|regulated by)\b/i;
    for (const s of SERVICES) {
      const copy = `${s.name} ${s.summary}`;
      expect(regulated.test(copy), `${s.slug}: ${copy}`).toBe(false);
    }
  });

  it("does not tell anyone what to buy", () => {
    const advice = /\byou should (buy|purchase|invest in|offer on)\b/i;
    for (const s of SERVICES) {
      expect(advice.test(s.summary), s.slug).toBe(false);
    }
  });
});

describe("links", () => {
  it("points every service at a route that exists", () => {
    // A button that 404s is worse than no button, and the catalogue is the one
    // place a stale href hides from view.
    for (const s of SERVICES) {
      const segments = s.href.replace(/^\//, "").replace(/\/$/, "").split("/");
      const dir = join(appDir, ...segments);
      const dynamicParent = join(appDir, ...segments.slice(0, -1));
      const hasDynamicChild =
        segments.length > 1 &&
        existsSync(dynamicParent) &&
        readdirSync(dynamicParent, { withFileTypes: true })
          .some(e => e.isDirectory() && e.name.startsWith("["));
      expect(
        existsSync(dir) || hasDynamicChild,
        `${s.slug} links to ${s.href}, which has no route`,
      ).toBe(true);
    }
  });
});
