import { SITE_URL, canonical } from "@/lib/site";

/**
 * schema.org Article markup for a blog post.
 *
 * Sixteen of the twenty-nine posts had this hand-written inline and thirteen
 * had none at all, so search engines could not read a published date, author
 * or section for nearly half the blog. This centralises the shape so new posts
 * get it by adding one line.
 *
 * `datePublished` and `dateModified` must be ISO (YYYY-MM-DD). Only pass a
 * `dateModified` later than `datePublished` when the article's content was
 * genuinely revised — claiming freshness that did not happen is worse than
 * having no date at all.
 */
export function ArticleSchema({
  headline,
  description,
  slug,
  datePublished,
  dateModified,
  section,
  keywords,
  inLanguage = "en-GB",
}: {
  headline: string;
  description: string;
  /** Path without the /blog prefix, e.g. "deal-sourcing-uk-guide". */
  slug: string;
  datePublished: string;
  dateModified?: string;
  section: string;
  keywords?: string[];
  /** Set to "ar" for the Arabic-language posts. */
  inLanguage?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: canonical(`/blog/${slug}/`),
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical(`/blog/${slug}/`) },
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Person", name: "Nass" },
    publisher: {
      "@type": "Organization",
      name: "PropertyVault UK",
      url: SITE_URL,
    },
    image: canonical("/opengraph-image"),
    articleSection: section,
    inLanguage,
    ...(keywords?.length ? { keywords } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
