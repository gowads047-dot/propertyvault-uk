import Link from "next/link";
import { relatedPosts, slugOf } from "@/lib/blog-posts";

/**
 * "Keep reading" links at the foot of a blog post.
 *
 * Derived from the shared blog index by category, so a new post joins the
 * rotation automatically rather than needing a hand-written list per article.
 * The point is to give a reader somewhere to go: eighteen of the twenty-nine
 * posts previously ended in nothing.
 */
export function RelatedArticles({
  slug,
  limit = 3,
  heading = "Keep reading",
  dir,
}: {
  /** This post's slug, so it can exclude itself. */
  slug: string;
  limit?: number;
  heading?: string;
  /** Pass "rtl" on the Arabic posts. */
  dir?: "ltr" | "rtl";
}) {
  const posts = relatedPosts(slug, limit);
  if (!posts.length) return null;

  return (
    <section className="section-padding bg-navy-50/40" dir={dir}>
      <div className="container-max max-w-4xl px-4">
        <h2
          className="text-2xl font-bold text-navy-800 mb-6"
          style={{ fontFamily: "var(--font-family-heading)" }}
        >
          {heading}
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {posts.map(p => (
            <Link
              key={p.href}
              href={p.href}
              className="block bg-white border border-navy-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold-600 mb-2">
                {p.category}
              </span>
              <span className="block font-bold text-navy-800 text-sm leading-snug mb-2">
                {p.title}
              </span>
              <span className="block text-navy-400 text-xs">
                {p.readTime} read · {p.date}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Re-exported so pages can derive their own slug without a second import. */
export { slugOf };
