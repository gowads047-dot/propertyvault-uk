#!/usr/bin/env node
/**
 * Crawl every URL in the sitemap and report what a search engine would see.
 *
 * The September 2026 audit found 112 pages with a skipped heading level,
 * 55 rendering their FAQ list twice, 15 linked from nowhere and 3 links to
 * pages that did not exist — none of it visible from any one page, all of
 * it obvious across all of them. This is the crawler that found it, kept so
 * the next person can re-run it in a minute instead of rediscovering it.
 *
 *   npm run seo:audit                       # production
 *   npm run seo:audit -- http://localhost:3001   # a `next start` build
 *
 * Checks, per page: status, title and description present and within the
 * length Google shows, canonical present, robots noindex, exactly one <h1>,
 * no skipped heading level, alt on every <img>, JSON-LD present and valid,
 * og:image present, and the same heading text not appearing twice (the FAQ
 * duplication). Across pages: every sitemap URL is linked from at least one
 * other page, and every internal link resolves 200.
 *
 * Exit code is 1 when a hard check fails — non-200, missing title,
 * description or canonical, wrong <h1> count, a broken link — so it can
 * gate a deploy. Length and heading-level findings are reported, not fatal:
 * they are worth fixing and not worth blocking a release over.
 *
 * Plain node, no dependencies. The HTML is server-rendered and well-formed,
 * so regular expressions are enough; this is not a general HTML parser and
 * would not survive hand-written markup.
 */

const BASE = (process.argv[2] || "https://www.propertyvaultuk.co.uk").replace(/\/+$/, "");
const CONCURRENCY = 8;
const TITLE_MAX = 65;
const DESC_MAX = 200;

const entities = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#x27;": "'", "&nbsp;": " " };
const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (m) => entities[m]);
const text = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
// Attribute values are decoded too: an apostrophe arrives as &#x27;, which
// is six characters to a regex and one to a reader, and the length limits
// are about what the reader sees.
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[2] ?? m[3]) : undefined;
};
const hasAttr = (tag, name) => new RegExp(`\\s${name}(\\s|=|>|/)`, "i").test(tag);

function normalise(href) {
  try {
    const u = new URL(href, BASE);
    if (u.origin !== new URL(BASE).origin) return null;
    u.hash = "";
    u.search = "";
    let p = u.pathname;
    if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
    return u.origin + p;
  } catch {
    return null;
  }
}

function inspect(url, status, html) {
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [, ""])[1];
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (key) => {
    const tag = metas.find((t) => attr(t, "name") === key || attr(t, "property") === key);
    return tag ? attr(tag, "content") : undefined;
  };
  const titleTag = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleTag ? text(titleTag[1]) : undefined;
  const canonical = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((t) => attr(t, "rel") === "canonical")
    .map((t) => attr(t, "href"));

  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: +m[1], text: text(m[2]) }));
  let skips = 0;
  let prev = 0;
  for (const h of headings) {
    if (prev && h.level > prev + 1) skips++;
    prev = h.level;
  }
  const seen = new Set();
  let duplicateHeadings = 0;
  for (const h of headings) {
    const k = `${h.level}:${h.text}`;
    if (seen.has(k)) duplicateHeadings++;
    seen.add(k);
  }

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const imgsWithoutAlt = imgs.filter((t) => !hasAttr(t, "alt")).length;

  const jsonLd = [...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      JSON.parse(m[1]);
      return "ok";
    } catch {
      return "invalid";
    }
  });

  const internal = new Set();
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], "href");
    if (!href || /^(mailto:|tel:|javascript:|#)/.test(href)) continue;
    const n = normalise(href);
    if (n && n !== url) internal.add(n);
  }

  return {
    status,
    title,
    titleLength: title?.length ?? 0,
    description: meta("description"),
    canonical,
    noindex: /noindex/i.test(meta("robots") || ""),
    h1Count: headings.filter((h) => h.level === 1).length,
    firstHeadingLevel: headings[0]?.level,
    headingSkips: skips,
    duplicateHeadings,
    imgsWithoutAlt,
    jsonLd,
    ogImage: meta("og:image"),
    internal: [...internal],
  };
}

async function fetchText(url) {
  const r = await fetch(url, { redirect: "manual", headers: { "user-agent": "propertyvault-seo-audit" } });
  return { status: r.status, xrobots: r.headers.get("x-robots-tag"), html: r.status === 200 ? await r.text() : "" };
}

async function pool(items, fn) {
  let i = 0;
  const out = new Array(items.length);
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => BASE + new URL(m[1]).pathname);
if (urls.length === 0) {
  console.error(`No <loc> entries at ${BASE}/sitemap.xml`);
  process.exit(2);
}
console.log(`Crawling ${urls.length} sitemap URLs at ${BASE}\n`);

const pages = new Map();
const results = await pool(urls, async (url) => {
  try {
    const { status, xrobots, html } = await fetchText(url);
    const p = inspect(url, status, html);
    if (/noindex/i.test(xrobots || "")) p.noindex = true;
    return [url, p];
  } catch (e) {
    return [url, { status: `ERR ${e.message}`, internal: [], canonical: [], jsonLd: [], h1Count: 0 }];
  }
});
for (const [url, p] of results) pages.set(url, p);

// Inbound links, counted only from sitemap pages.
const inbound = new Map(urls.map((u) => [u, 0]));
const linked = new Set();
for (const [, p] of pages) for (const t of p.internal) {
  linked.add(t);
  if (inbound.has(t)) inbound.set(t, inbound.get(t) + 1);
}

// Any internal link target that is not itself in the sitemap gets fetched.
const offSitemap = [...linked].filter((t) => !pages.has(t));
const broken = [];
await pool(offSitemap, async (t) => {
  try {
    const r = await fetch(t, { redirect: "manual", headers: { "user-agent": "propertyvault-seo-audit" } });
    if (r.status !== 200) broken.push({ url: t, status: r.status, location: r.headers.get("location") });
  } catch (e) {
    broken.push({ url: t, status: `ERR ${e.message}` });
  }
});

const rel = (u) => u.replace(BASE, "") || "/";
const section = (label, list, fatal = false) => {
  const tag = fatal && list.length ? "FAIL" : list.length ? "warn" : " ok ";
  console.log(`[${tag}] ${label}: ${list.length}`);
  for (const item of list.slice(0, 40)) console.log(`         ${item}`);
  if (list.length > 40) console.log(`         … and ${list.length - 40} more`);
  return fatal && list.length > 0;
};
const where = (pred) => urls.filter((u) => pred(pages.get(u))).map(rel);

let failed = false;
failed |= section("not 200", where((p) => p.status !== 200), true);
failed |= section("missing <title>", where((p) => p.status === 200 && !p.title), true);
failed |= section("missing meta description", where((p) => p.status === 200 && !p.description), true);
failed |= section("missing canonical", where((p) => p.status === 200 && p.canonical.length === 0), true);
failed |= section("<h1> count is not 1", where((p) => p.status === 200 && p.h1Count !== 1), true);
failed |= section(
  "broken internal links",
  broken.map((b) => `${b.status} ${rel(b.url)}${b.location ? ` -> ${b.location}` : ""}`),
  true,
);
failed |= section("invalid JSON-LD", where((p) => p.jsonLd?.includes("invalid")), true);

section("noindex (in the sitemap, so contradictory)", where((p) => p.noindex));
section(`title over ${TITLE_MAX} chars`, where((p) => p.titleLength > TITLE_MAX).map((u) => `${u} (${pages.get(BASE + (u === "/" ? "/" : u)).titleLength})`));
section(`description over ${DESC_MAX} chars`, where((p) => (p.description?.length ?? 0) > DESC_MAX));
section("first heading is not the <h1>", where((p) => p.status === 200 && p.firstHeadingLevel !== 1));
section("skipped heading level", where((p) => p.headingSkips > 0));
section("same heading text twice (FAQ rendered twice?)", where((p) => p.duplicateHeadings >= 2));
section("<img> without alt", where((p) => p.imgsWithoutAlt > 0));
section("no JSON-LD", where((p) => p.status === 200 && p.jsonLd.length === 0));
section("no og:image", where((p) => p.status === 200 && !p.ogImage));
section("orphans (no inbound link from another sitemap page)", urls.filter((u) => inbound.get(u) === 0).map(rel));

console.log(failed ? "\nHard checks failed." : "\nAll hard checks passed.");
process.exit(failed ? 1 : 0);
