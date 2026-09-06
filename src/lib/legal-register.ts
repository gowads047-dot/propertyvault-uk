import type { ReviewStatus, TermId } from "./legal-review";

/**
 * The legal review worklist.
 *
 * One entry per file and flagged term, every one starting at "not-reviewed".
 * legal-review.test.ts asserts this matches what is actually in src/app, in
 * both directions — so a new mention of Section 21 cannot be added without
 * appearing here, and an entry cannot outlive the text it describes.
 *
 * ── How to work this list ──────────────────────────────────────────────────
 *
 * Run `npm run legal:review` for the same list with a line of context around
 * each mention, which is the form worth handing to a solicitor.
 *
 * Then set a status per entry:
 *
 *   correct-as-written  the page explains that the law changed, and is right
 *   needs-change        the page instructs as though the old rule still holds
 *   resolved            it was wrong, has been rewritten, and signed off
 *
 * Nothing here was pre-classified. Deciding which mentions of Section 21 are
 * explanatory and which are instructions is legal judgement, and guessing at
 * it would defeat the point of writing the list down.
 */

export type RegisterEntry = {
  file: string;
  term: TermId;
  /** Occurrences in that file, so a changed count shows up as drift. */
  count: number;
  status: ReviewStatus;
  /** Filled in by whoever reviewed it. */
  note?: string;
};

export const REGISTER: RegisterEntry[] = [
  { file: "src/app/academy/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/guaranteed-rent-explained/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/hmo-investing-uk/page.tsx", term: "ast", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/hquq-almustajir-uk/page.tsx", term: "section-21", count: 9, status: "not-reviewed" },
  { file: "src/app/blog/istihtmar-aqari-uk-min-kharij/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/rent-to-rent-explained/page.tsx", term: "ast", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/renters-reform-act-landlord-checklist/page.tsx", term: "section-21", count: 15, status: "not-reviewed" },
  { file: "src/app/blog/renters-reform-act-landlord-checklist/page.tsx", term: "ast", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/renters-reform-act-landlord-checklist/page.tsx", term: "fixed-term", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/renters-reform-act-landlord-checklist/page.tsx", term: "no-fault", count: 2, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/layout.tsx", term: "section-21", count: 3, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/layout.tsx", term: "fixed-term", count: 2, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/layout.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/page.tsx", term: "section-21", count: 14, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/page.tsx", term: "ast", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/page.tsx", term: "fixed-term", count: 5, status: "not-reviewed" },
  { file: "src/app/blog/renters-rights-act/page.tsx", term: "no-fault", count: 5, status: "not-reviewed" },
  { file: "src/app/blog/uk-property-market-2026/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/blog/uk-property-market-2026/page.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/calculators/rent-vs-buy/page.tsx", term: "section-21", count: 2, status: "not-reviewed" },
  { file: "src/app/glossary/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/glossary/page.tsx", term: "ast", count: 1, status: "not-reviewed" },
  { file: "src/app/glossary/page.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/hmo-hub/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/landlords/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/landlords/page.tsx", term: "ast", count: 2, status: "not-reviewed" },
  { file: "src/app/makan/company-lets/page.tsx", term: "ast", count: 2, status: "not-reviewed" },
  { file: "src/app/makan/compliance/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/makan/compliance/page.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/property-law/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/property-news/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/property-news/page.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/renters-rights-act/page.tsx", term: "section-21", count: 14, status: "not-reviewed" },
  { file: "src/app/renters-rights-act/page.tsx", term: "fixed-term", count: 11, status: "not-reviewed" },
  { file: "src/app/renters-rights-act/page.tsx", term: "no-fault", count: 2, status: "not-reviewed" },
  { file: "src/app/rentura/properties/[id]/page.tsx", term: "section-21", count: 5, status: "not-reviewed" },
  { file: "src/app/rentura/properties/[id]/passport/page.tsx", term: "section-21", count: 3, status: "not-reviewed" },
  { file: "src/app/rentura/properties/[id]/passport/page.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/rentura/rrb/page.tsx", term: "section-21", count: 6, status: "not-reviewed" },
  { file: "src/app/rentura/rrb/page.tsx", term: "no-fault", count: 2, status: "not-reviewed" },
  { file: "src/app/templates/ast/layout.tsx", term: "section-21", count: 2, status: "not-reviewed" },
  { file: "src/app/templates/ast/layout.tsx", term: "ast", count: 6, status: "not-reviewed" },
  { file: "src/app/templates/ast/layout.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/templates/ast/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/templates/ast/page.tsx", term: "ast", count: 5, status: "not-reviewed" },
  { file: "src/app/templates/landlord-compliance/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/templates/page.tsx", term: "ast", count: 1, status: "not-reviewed" },
  { file: "src/app/templates/renters-rights-notice/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
  { file: "src/app/templates/renters-rights-notice/page.tsx", term: "no-fault", count: 1, status: "not-reviewed" },
  { file: "src/app/templates/section-8-notice/page.tsx", term: "section-21", count: 1, status: "not-reviewed" },
];
