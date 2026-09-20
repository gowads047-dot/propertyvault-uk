import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, sep } from "node:path";

/**
 * Every internal path the code links to is a route that exists.
 *
 * The signed-in hub had "Sourcing" pointing at /sourcing and "Portfolio
 * builder" at /portfolio — neither has ever been a page; both were 404s
 * for as long as the hub existed. The orphan check in the launch gate walks
 * the sitemap outward and never sees a link *to* a page that is not there.
 * This one reads the source: every literal path in an href, router.push,
 * redirect or absolute site URL must match a page, a route handler or a
 * file in public/.
 */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const ROOT = process.cwd();
const rel = (f: string) => f.slice(ROOT.length + 1).split(sep).join("/");
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function routePatterns(): RegExp[] {
  const out: RegExp[] = [];
  for (const f of walk(join(ROOT, "src", "app"))) {
    const b = basename(f);
    if (b !== "page.tsx" && b !== "route.ts") continue;
    const segs = rel(dirname(f)).split("/").slice(2).filter((s) => s && !/^\(.*\)$/.test(s));
    const re = segs
      .map((s) => (s.startsWith("[...") ? ".+" : s.startsWith("[") ? "[^/]+" : escape(s)))
      .join("/");
    out.push(new RegExp(`^/${re}/?$`));
  }
  return out;
}

describe("internal links", () => {
  it("point at routes that exist", () => {
    const routes = routePatterns();
    const pub = new Set(walk(join(ROOT, "public")).map((f) => "/" + rel(f).split("/").slice(1).join("/")));
    const known = (p: string) => routes.some((r) => r.test(p)) || pub.has(p) || pub.has(p.replace(/\/$/, ""));
    const re = /(?:href=\{?["'`]|href:\s*["'`]|router\.push\(["'`]|redirect\(["'`]|window\.location\.href\s*=\s*["'`]|https:\/\/www\.propertyvaultuk\.co\.uk)(\/[A-Za-z0-9_\-/.]*)/g;
    const dead: string[] = [];
    let checked = 0;
    for (const f of walk(join(ROOT, "src"))) {
      if (!/\.tsx?$/.test(f) || f.includes(".test.")) continue;
      const src = readFileSync(f, "utf8");
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        const after = src[m.index + m[0].length];
        // A prefix that a template fills in (`/makan/listing/${id}`) is not a path.
        if (after === "$") continue;
        const p = m[1].replace(/[#?].*$/, "");
        // Metadata images are special files, not pages.
        if (/\/(opengraph-image|twitter-image|icon)\/?$/.test(p)) continue;
        checked++;
        if (!known(p)) dead.push(`${p} in ${rel(f)}:${src.slice(0, m.index).split("\n").length}`);
      }
    }
    expect(dead).toEqual([]);
    expect(checked).toBeGreaterThan(500);
  });
});
