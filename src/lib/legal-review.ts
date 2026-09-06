import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Where the site talks about law the Renters' Rights Act has changed.
 *
 * The audit found Section 21 mentioned across two dozen pages and assured
 * shorthold tenancies across thirty, and recommended flagging them for review
 * rather than rewriting the law from memory. This is the flagging.
 *
 * ── What this deliberately does not do ─────────────────────────────────────
 *
 * It does not decide whether any given mention is wrong. Most of them are
 * fine: /renters-rights-act and the blog posts about it mention Section 21
 * precisely to explain that it has gone, and a page that says "Section 21 was
 * abolished" is correct in a way no pattern match can tell apart from "serve a
 * Section 21 notice". Sorting those is legal judgement, which is the one thing
 * this codebase must not do from memory.
 *
 * What it does is turn "Section 21 appears somewhere on 24 pages" into a list
 * with a line of context each and a status against every entry, so a solicitor
 * has a worklist rather than a search result — and so nothing new joins the
 * pile unnoticed.
 *
 * ── The status field ───────────────────────────────────────────────────────
 *
 * Every entry starts at "not-reviewed", including the ones that are obviously
 * fine. Marking the obvious ones myself would be exactly the shortcut this
 * exists to prevent: the judgement of what is obvious about tenancy law is the
 * judgement being deferred.
 */

export type ReviewStatus =
  /** Nobody qualified has looked at it yet. The default, and the honest one. */
  | "not-reviewed"
  /** Reviewed and correct — usually a page explaining that the law changed. */
  | "correct-as-written"
  /** Reviewed and wrong. Needs new wording from whoever reviewed it. */
  | "needs-change"
  /** Was wrong, has been rewritten, and the new wording was signed off. */
  | "resolved";

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  "not-reviewed": "Not reviewed",
  "correct-as-written": "Correct as written",
  "needs-change": "Needs change",
  resolved: "Resolved",
};

/**
 * The terms worth flagging.
 *
 * Chosen because the Act changed what each one means, not because the word is
 * forbidden. `id` is stable and used as the register key, so renaming one is a
 * deliberate act that shows up in a diff.
 */
export const TERMS = [
  { id: "section-21", pattern: /\bsection\s*21\b/gi, why: "No-fault possession under Section 21 was removed for new tenancies." },
  { id: "ast", pattern: /\bassured shorthold tenanc\w*/gi, why: "Assured shorthold tenancies cannot be granted for new lets." },
  { id: "fixed-term", pattern: /\bfixed[- ]term tenanc\w*/gi, why: "New tenancies are periodic; a fixed term cannot be imposed." },
  { id: "no-fault", pattern: /\bno[- ]fault eviction\w*/gi, why: "The route this describes no longer exists." },
] as const;

export type TermId = (typeof TERMS)[number]["id"];

export type Mention = {
  /** Path relative to the repository root, with forward slashes. */
  file: string;
  term: TermId;
  count: number;
};

const APP = join(process.cwd(), "src", "app");

/**
 * Every mention of a flagged term under src/app.
 *
 * Reads the filesystem rather than a committed list, so the register can be
 * checked against reality instead of against itself.
 */
export function findMentions(): Mention[] {
  const out: Mention[] = [];
  const files = readdirSync(APP, { recursive: true, encoding: "utf8" })
    .filter(p => p.endsWith(".tsx") && !p.includes(".test."));

  for (const p of files.sort()) {
    const src = readFileSync(join(APP, p), "utf8");
    for (const term of TERMS) {
      const n = (src.match(term.pattern) ?? []).length;
      if (n > 0) out.push({ file: `src/app/${p.split("\\").join("/")}`, term: term.id, count: n });
    }
  }
  return out;
}

/** The key an entry is registered under. */
export function keyOf(m: { file: string; term: TermId }): string {
  return `${m.file}#${m.term}`;
}
