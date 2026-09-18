import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { trailingSlashAction, withTrailingSlash } from "./trailing-slash";

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

describe("withTrailingSlash", () => {
  it("adds the slash to a bare page path, keeping query and hash", () => {
    expect(withTrailingSlash("/blog")).toBe("/blog/");
    expect(withTrailingSlash("/guaranteed-rent/birmingham")).toBe("/guaranteed-rent/birmingham/");
    expect(withTrailingSlash("/makan?type=flat")).toBe("/makan/?type=flat");
    expect(withTrailingSlash("/landlords#faq")).toBe("/landlords/#faq");
    expect(withTrailingSlash("/makan?type=flat#top")).toBe("/makan/?type=flat#top");
  });

  it("leaves what is already right, and what is not a page, alone", () => {
    expect(withTrailingSlash("/")).toBe("/");
    expect(withTrailingSlash("/blog/")).toBe("/blog/");
    expect(withTrailingSlash("/blog/?page=2")).toBe("/blog/?page=2");
    expect(withTrailingSlash("/sitemap.xml")).toBe("/sitemap.xml");
    expect(withTrailingSlash("/deal-report.pdf")).toBe("/deal-report.pdf");
    expect(withTrailingSlash("https://example.com/x")).toBe("https://example.com/x");
    expect(withTrailingSlash("mailto:info@propertyvaultuk.co.uk")).toBe("mailto:info@propertyvaultuk.co.uk");
    expect(withTrailingSlash("#top")).toBe("#top");
    expect(withTrailingSlash("//cdn.example.com/x")).toBe("//cdn.example.com/x");
  });

  it("gives API paths the slash too, matching how the crons call them", () => {
    expect(withTrailingSlash("/api/contact")).toBe("/api/contact/");
  });
});
