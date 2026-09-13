import { PREFERRED_SOURCE_URL } from "@/lib/site";

/**
 * "Add as Preferred Source" — Google's own wording for the button.
 *
 * A reader who pins the site sees it favoured in Top Stories and in AI
 * Overviews, which for a site with no search history yet is the only lever
 * that turns a single good visit into repeat placement. It is a plain link:
 * Google does the sign-in and the confirmation on its side, so there is
 * nothing to track here and nothing that can break.
 *
 * `tone` follows where it sits — the article hero is dark navy, the blog
 * index card surfaces are light.
 */
export function PreferredSourceBadge({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";

  return (
    <a
      href={PREFERRED_SOURCE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
      style={
        dark
          ? { background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.22)" }
          : { background: "var(--card-surface)", color: "var(--ink)", border: "1.5px solid var(--hairline)" }
      }
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
      Add as Preferred Source on Google
    </a>
  );
}
