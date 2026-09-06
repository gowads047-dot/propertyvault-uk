import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every internal link goes somewhere that exists.
 *
 * A link into nothing is invisible from the code that writes it: the page
 * compiles, the build passes, and the only symptom is a 404 for whoever
 * clicked. The two this found had been sitting in Makan's inventory empty
 * state — which is the first screen every new operator sees — pointing at
 * /makan/app/inventory/import and /inventory/new, neither of which has ever
 * existed.
 *
 * Nothing else catches this. The nav has its own check and the services
 * catalogue has one, both written after a link in that specific place broke.
 * This is the version that covers the other two hundred.
 */

const root = process.cwd();
const APP = join(root, "src", "app");
const toPosix = (p: string) => p.split("\\").join("/");

const sourceFiles = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
  .filter(p => /\.tsx?$/.test(p) && !p.includes(".test."))
  .map(p => join(root, "src", p));

/** Routes with a page behind them, and the parents of dynamic segments. */
const routes = new Set<string>(["/"]);
const dynamicParents = new Set<string>();
for (const p of readdirSync(APP, { recursive: true, encoding: "utf8" })) {
  if (!p.endsWith("page.tsx")) continue;
  // A route group — (home), (marketing) — adds no path segment.
  const dir = toPosix(p)
    .replace(/page\.tsx$/, "")
    .replace(/\/$/, "")
    .split("/")
    .filter(seg => !(seg.startsWith("(") && seg.endsWith(")")))
    .join("/");
  const route = dir === "" ? "/" : `/${dir}`;
  if (route.includes("[")) dynamicParents.add(route.slice(0, route.lastIndexOf("/")));
  else routes.add(route);
}

/** A redirect source resolves even with no directory behind it. */
const redirects = new Set(
  [...readFileSync(join(root, "next.config.ts"), "utf8").matchAll(/source:\s*"([^"]+)"/g)]
    .map(m => m[1].replace(/\/$/, "")),
);

/** Anything served straight out of public/. */
const publicFiles = new Set(
  readdirSync(join(root, "public"), { recursive: true, encoding: "utf8" })
    .map(p => `/${toPosix(p)}`),
);

type Link = { href: string; from: string };

const links: Link[] = [];
for (const file of sourceFiles) {
  const from = toPosix(file.slice(root.length + 1));
  for (const m of readFileSync(file, "utf8").matchAll(/href="(\/[A-Za-z0-9/_#?=&.-]*)"/g)) {
    const bare = m[1].split("#")[0].split("?")[0];
    if (!bare || bare === "/") continue;
    // API routes have no page and are exercised by their own tests.
    if (bare.startsWith("/api/")) continue;
    links.push({ href: bare.replace(/\/$/, ""), from });
  }
}

function resolves(href: string): boolean {
  if (routes.has(href) || redirects.has(href) || publicFiles.has(href)) return true;
  // A concrete child of a dynamic segment: /blog/foo against /blog/[slug].
  return dynamicParents.has(href.slice(0, href.lastIndexOf("/")));
}

describe("internal links", () => {
  it("finds links and routes, so the check below is not vacuous", () => {
    expect(links.length).toBeGreaterThan(100);
    expect(routes.size).toBeGreaterThan(150);
  });

  it("resolves a route group to its parent path", () => {
    // /makan is served by makan/(home)/page.tsx. Getting this wrong reports
    // twelve perfectly good links as broken, which is how a useful check gets
    // switched off.
    expect(routes.has("/makan")).toBe(true);
  });

  it("goes somewhere that exists", () => {
    const broken = [...new Set(
      links.filter(l => !resolves(l.href)).map(l => `${l.href}  ← ${l.from}`),
    )].sort();
    expect(broken, `links to nowhere:\n${broken.join("\n")}`).toEqual([]);
  });
});
