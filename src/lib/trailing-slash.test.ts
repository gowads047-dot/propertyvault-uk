import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { trailingSlashAction } from "./trailing-slash";

describe("trailingSlashAction", () => {
  it("leaves canonical page URLs and the root alone", () => {
    expect(trailingSlashAction("/")).toBe("pass");
    expect(trailingSlashAction("/blog/")).toBe("pass");
    expect(trailingSlashAction("/api/social/publish/")).toBe("pass");
  });

  it("redirects a bare page path, as the site always has", () => {
    expect(trailingSlashAction("/blog")).toBe("redirect");
    expect(trailingSlashAction("/guaranteed-rent/birmingham")).toBe("redirect");
  });

  it("rewrites a bare API path instead of redirecting it", () => {
    // The cron runner, Stripe's webhook delivery and anything else that
    // calls an API by machine gets served, not bounced.
    expect(trailingSlashAction("/api/social/publish")).toBe("rewrite");
    expect(trailingSlashAction("/api/stripe/webhook")).toBe("rewrite");
    expect(trailingSlashAction("/api/contact")).toBe("rewrite");
  });

  it("does not touch files or Next internals", () => {
    expect(trailingSlashAction("/sitemap.xml")).toBe("pass");
    expect(trailingSlashAction("/feed.xml")).toBe("pass");
    expect(trailingSlashAction("/9b2a4bc11e0801f4f973dc759a0d3dd7.txt")).toBe("pass");
    expect(trailingSlashAction("/_next/static/chunks/main.js")).toBe("pass");
    expect(trailingSlashAction("/opengraph-image")).toBe("redirect");
  });
});

describe("next.config.ts", () => {
  it("hands trailing-slash handling to the proxy", () => {
    // Without this flag Next redirects before the proxy runs, and the
    // rewrite for API paths never gets the chance.
    const cfg = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(cfg).toMatch(/trailingSlash:\s*true/);
    expect(cfg).toMatch(/skipTrailingSlashRedirect:\s*true/);
  });
});
