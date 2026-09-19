import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { blogPosts, slugOf, ogImagePath } from "./blog-posts";

/**
 * Every post has a social card generated from the index, and advertises
 * it. Without this, a new post is shared with the site logo and nobody
 * notices, which is how nineteen of thirty were being shared until
 * 18 Sept 2026.
 */
const BLOG = join(process.cwd(), "src", "app", "blog");

describe("blog social cards", () => {
  it("has a card file for every post, driven by its slug", () => {
    for (const post of blogPosts) {
      const slug = slugOf(post);
      const file = join(BLOG, slug, "opengraph-image.tsx");
      expect(existsSync(file), `${slug} has no opengraph-image.tsx`).toBe(true);
      expect(readFileSync(file, "utf8"), `${slug}'s card must come from blogCard("${slug}")`)
        .toContain(`blogCard("${slug}")`);
    }
  });

  it("advertises that card in each post's metadata, not the site card", () => {
    for (const post of blogPosts) {
      const slug = slugOf(post);
      const dir = join(BLOG, slug);
      const sources = ["layout.tsx", "page.tsx"].filter(f => existsSync(join(dir, f)))
        .map(f => readFileSync(join(dir, f), "utf8")).join("\n");
      const expected = `https://www.propertyvaultuk.co.uk${ogImagePath(post)}`;
      const advertised = [...sources.matchAll(/propertyvaultuk\.co\.uk(\/[a-z0-9/-]*opengraph-image\/?)"/g)].map(m => m[1]);
      // A post that only uses ArticleSchema declares nothing here; the
      // component reads ogImagePath itself.
      for (const path of advertised) {
        expect(`https://www.propertyvaultuk.co.uk${path}`, `${slug} advertises ${path}`).toBe(expected);
      }
    }
  });

  it("has no card file for a directory that is not in the index", () => {
    const dirs = readdirSync(BLOG, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    const indexed = new Set(blogPosts.map(slugOf));
    for (const d of dirs) {
      if (existsSync(join(BLOG, d, "opengraph-image.tsx"))) {
        expect(indexed.has(d), `${d} has a card but is not in lib/blog-posts.ts`).toBe(true);
      }
    }
  });
});
