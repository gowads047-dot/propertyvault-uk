import { blogPosts, postDateISO } from "@/lib/blog-posts";
import { SITE_URL } from "@/lib/site";

/**
 * RSS 2.0 for the blog, at /feed.xml.
 *
 * Thirty posts and no feed meant no reader, aggregator or Bing could be
 * told when a new one appeared. This is the whole blog index in date order,
 * newest first, built from the same data as the index page and the Article
 * schema — so a date that is wrong here is wrong everywhere, and fixed once.
 *
 * Static: it is regenerated on deploy, which is the only time a post can
 * change.
 */

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RFC 822, which is what RSS wants: "Sun, 06 Sep 2026 00:00:00 GMT". */
const rfc822 = (iso: string) => new Date(`${iso}T00:00:00Z`).toUTCString();

export function GET() {
  const posts = [...blogPosts].sort((a, b) => postDateISO(b.date).localeCompare(postDateISO(a.date)));
  const newest = posts[0] ? rfc822(postDateISO(posts[0].date)) : new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}${p.href.replace(/\/?$/, "/")}`;
      return [
        "    <item>",
        `      <title>${escape(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(postDateISO(p.date))}</pubDate>`,
        `      <category>${escape(p.category)}</category>`,
        `      <description>${escape(p.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>PropertyVault UK Blog</title>",
    `    <link>${SITE_URL}/blog/</link>`,
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    "    <description>UK property investing, landlord law and guaranteed rent — with the workings shown.</description>",
    "    <language>en-GB</language>",
    `    <lastBuildDate>${newest}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
