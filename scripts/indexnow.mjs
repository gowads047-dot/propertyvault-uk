#!/usr/bin/env node
/**
 * Tell the search engines that use IndexNow (Bing, DuckDuckGo, Yandex,
 * Naver, Seznam — not Google) which URLs changed, so they crawl them today
 * rather than whenever they next visit.
 *
 *   npm run seo:indexnow                 # every URL in the sitemap
 *   npm run seo:indexnow -- /blog/x/ /y/ # just these paths
 *
 * The key is public by design: IndexNow proves ownership by fetching
 * /<key>.txt from the site and checking it contains the key, which is why
 * the file is committed under public/. Rotating it is: new file, new
 * constant, delete the old file.
 *
 * Submitting an unchanged URL is harmless but pointless; the protocol asks
 * that it not be done in bulk repeatedly. Run this after a deploy that
 * changed pages, not on a timer.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const HOST = "www.propertyvaultuk.co.uk";
const KEY = "9b2a4bc11e0801f4f973dc759a0d3dd7";

const keyFile = join(process.cwd(), "public", `${KEY}.txt`);
if (readFileSync(keyFile, "utf8").trim() !== KEY) {
  console.error(`public/${KEY}.txt does not contain the key; IndexNow will reject the submission.`);
  process.exit(2);
}

let urls;
const args = process.argv.slice(2);
if (args.length) {
  urls = args.map((p) => (p.startsWith("http") ? p : `https://${HOST}${p.startsWith("/") ? p : "/" + p}`));
} else {
  const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}
if (!urls.length) {
  console.error("Nothing to submit.");
  process.exit(2);
}

// One POST for up to 10,000 URLs; every engine on the protocol shares it.
const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});

// 200 and 202 both mean accepted. 422 is a key or host mismatch; 429 is
// too many submissions — wait, do not retry in a loop.
console.log(`IndexNow: HTTP ${r.status} for ${urls.length} URL${urls.length === 1 ? "" : "s"}`);
process.exit(r.status === 200 || r.status === 202 ? 0 : 1);
