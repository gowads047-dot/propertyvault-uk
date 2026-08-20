import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { blogPosts, slugOf, relatedPosts } from "./blog-posts";
import { siteMetrics } from "./site";

const blogDir = join(process.cwd(), "src", "app", "blog");

const routeSlugs = readdirSync(blogDir, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

describe("blog index matches the routes on disk", () => {
  it("lists every post that exists as a route", () => {
    const indexed = blogPosts.map(slugOf);
    const notIndexed = routeSlugs.filter(s => !indexed.includes(s));
    // A post with no index entry is invisible on /blog and gets no related links.
    expect(notIndexed).toEqual([]);
  });

  it("does not link to a post that has no route", () => {
    const indexed = blogPosts.map(slugOf);
    const orphaned = indexed.filter(s => !routeSlugs.includes(s));
    expect(orphaned).toEqual([]);
  });

  it("agrees with siteMetrics.blogPosts", () => {
    expect(blogPosts.length).toBe(siteMetrics.blogPosts);
  });

  it("has no duplicate slugs", () => {
    const slugs = blogPosts.map(slugOf);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every post a page file", () => {
    for (const slug of blogPosts.map(slugOf)) {
      expect(existsSync(join(blogDir, slug, "page.tsx"))).toBe(true);
    }
  });
});

describe("relatedPosts", () => {
  it("never returns the post itself", () => {
    for (const slug of blogPosts.map(slugOf)) {
      expect(relatedPosts(slug).map(slugOf)).not.toContain(slug);
    }
  });

  it("returns the requested number for every post", () => {
    for (const slug of blogPosts.map(slugOf)) {
      expect(relatedPosts(slug, 3)).toHaveLength(3);
    }
  });

  it("prefers posts in the same category", () => {
    const post = blogPosts.find(p => p.category === "Arabic");
    expect(post).toBeDefined();
    const related = relatedPosts(slugOf(post!), 3);
    // There are four Arabic posts, so all three slots should be same-category.
    expect(related.every(p => p.category === "Arabic")).toBe(true);
  });

  it("returns nothing for an unknown slug", () => {
    expect(relatedPosts("does-not-exist")).toEqual([]);
  });
});

describe("relatedPosts language separation", () => {
  const isAr = (c: string) => c === "Arabic";

  // An English article recommending three Arabic ones is not a useful next
  // step. This happened because the Arabic posts sit at the top of the index
  // and any post whose category had no siblings fell back to array order.
  it("never mixes Arabic and English in one set of recommendations", () => {
    for (const post of blogPosts) {
      const related = relatedPosts(slugOf(post), 3);
      for (const r of related) {
        expect(isAr(r.category)).toBe(isAr(post.category));
      }
    }
  });

  it("still fills all three slots within each language", () => {
    for (const post of blogPosts) {
      expect(relatedPosts(slugOf(post), 3)).toHaveLength(3);
    }
  });
});
