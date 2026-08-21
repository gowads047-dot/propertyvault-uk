import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { staticRoutes, isIndexable, rankOf } from "@/lib/routes";
import { blogPosts, slugOf } from "@/lib/blog-posts";
import { countries } from "@/lib/hetta-config";
import { DISTRICTS } from "@/app/areas/postcodes/[district]/page";

/**
 * The sitemap, derived rather than maintained.
 *
 * This was a hand-written list of 148 URLs against a build that produces 211
 * public pages — every postcode district page was missing, among others. It
 * now enumerates static routes from the filesystem and dynamic ones from the
 * same data their generateStaticParams uses, so the two cannot disagree.
 *
 * src/lib/routes.test.ts asserts the result against the routes the build
 * actually emits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = new Set(staticRoutes().filter(isIndexable));

  // Dynamic segments, from the same sources their pages generate from.
  for (const post of blogPosts) routes.add(`/blog/${slugOf(post)}`);
  for (const c of countries) routes.add(`/makan/country/${c.code}`);
  for (const d of DISTRICTS) routes.add(`/areas/postcodes/${d.code.toLowerCase()}`);

  return [...routes]
    .sort()
    .map(route => {
      const { priority, changeFrequency } = rankOf(route);
      return {
        url: `${SITE_URL}${route === "/" ? "/" : route + "/"}`,
        lastModified: now,
        changeFrequency,
        priority,
      };
    });
}
