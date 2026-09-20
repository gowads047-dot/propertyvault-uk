import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import config from "../../next.config";

/**
 * The Content-Security-Policy in next.config.ts is an allowlist of origins.
 * Its failure mode is silent: a host the code starts using that the policy
 * does not name is simply blocked, in the visitor's browser, with nothing in
 * any log. So the policy is checked here against the code.
 */
type Header = { key: string; value: string };
type Rule = { source: string; headers: Header[] };

async function policies(): Promise<Record<string, string>> {
  const rules = (await config.headers!()) as Rule[];
  return Object.fromEntries(
    rules.map(r => [r.source, r.headers.find(h => h.key === "Content-Security-Policy")?.value ?? ""]),
  );
}

function directive(csp: string, name: string): string[] {
  const d = csp.split(";").map(x => x.trim()).find(x => x.startsWith(name + " "));
  return d ? d.slice(name.length + 1).split(/\s+/) : [];
}

const sourceFiles = readdirSync(join(process.cwd(), "src"), { recursive: true, encoding: "utf8" })
  .filter(p => /\.tsx?$/.test(p) && !p.includes(".test."))
  .map(p => readFileSync(join(process.cwd(), "src", p), "utf8"))
  .join("\n");

describe("Content-Security-Policy", () => {
  it("is set on every route, and frame-ancestors is relaxed only for /embed/", async () => {
    const p = await policies();
    expect(Object.keys(p).sort()).toEqual(["/((?!embed/).*)", "/embed/:path*"]);
    expect(p["/((?!embed/).*)"]).toContain("frame-ancestors 'self'");
    expect(p["/embed/:path*"]).not.toContain("frame-ancestors");
    for (const csp of Object.values(p)) {
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("form-action 'self'");
      expect(csp).toContain("upgrade-insecure-requests");
    }
  });

  it("names the Supabase project the code talks to", async () => {
    const csp = (await policies())["/((?!embed/).*)"];
    const project = "https://ubmxpuukspfponiesasc.supabase.co";
    expect(directive(csp, "connect-src")).toContain(project);
    expect(directive(csp, "connect-src")).toContain(project.replace("https", "wss"));
    expect(directive(csp, "img-src")).toContain(project);
  });

  it("names every image host next.config.ts allows next/image to fetch", async () => {
    const csp = (await policies())["/((?!embed/).*)"];
    const img = directive(csp, "img-src");
    for (const { hostname } of config.images!.remotePatterns as { hostname: string }[]) {
      expect(img, hostname).toContain(`https://${hostname}`);
    }
  });

  it("allows the analytics script the code loads, and no script host the code does not", async () => {
    const csp = (await policies())["/((?!embed/).*)"];
    const script = directive(csp, "script-src");
    expect(sourceFiles).toContain("https://www.googletagmanager.com/gtag/js");
    expect(script).toContain("https://www.googletagmanager.com");
    // Every external script origin the policy allows must be one the code
    // refers to, or a documented placeholder for a service behind a key.
    const documented = new Set([
      "https://challenges.cloudflare.com", // Turnstile, loaded by components/forms/Turnstile.tsx once a key is set
      "https://www.googleadservices.com", // the Ads conversion tag gtag loads for conversion() in lib/analytics.ts
      "https://googleads.g.doubleclick.net", // its beacon host
    ]);
    for (const origin of script.filter(x => x.startsWith("https://"))) {
      expect(sourceFiles.includes(origin) || documented.has(origin), `${origin} allowed but unused`).toBe(true);
    }
  });

  it("does not let the page be a form target for anyone else, or use plugins", async () => {
    const csp = (await policies())["/((?!embed/).*)"];
    expect(directive(csp, "form-action")).toEqual(["'self'"]);
    expect(directive(csp, "object-src")).toEqual(["'none'"]);
  });
});

describe("Google Ads under consent", () => {
  it("allows the hosts gtag reaches once ad consent is granted", async () => {
    // Seen on production the day Accept All began granting ad_storage: GA's
    // audiences pixel at www.google.co.uk was blocked. The conversion tag
    // (#182) reaches the two ad hosts; the pixel reaches google.com and the
    // visitor's country TLD, which for this site is .co.uk. Then, with ad
    // consent stored, GA's linking beacon to stats.g.doubleclick.net was
    // blocked on every page load.
    const csp = (await policies())["/((?!embed/).*)"];
    for (const host of ["https://www.googleadservices.com", "https://googleads.g.doubleclick.net", "https://stats.g.doubleclick.net", "https://www.google.com", "https://www.google.co.uk"]) {
      expect(directive(csp, "img-src"), host).toContain(host);
      expect(directive(csp, "connect-src"), host).toContain(host);
    }
    expect(directive(csp, "frame-src")).toContain("https://td.doubleclick.net");
  });
});

describe("Strict-Transport-Security", () => {
  it("is the preload-list value on every route", async () => {
    const rules = (await config.headers!()) as Rule[];
    for (const r of rules) {
      const hsts = r.headers.find(h => h.key === "Strict-Transport-Security")?.value;
      expect(hsts, r.source).toBe("max-age=63072000; includeSubDomains; preload");
    }
  });
});
