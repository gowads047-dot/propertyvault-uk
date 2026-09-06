import { describe, it, expect } from "vitest";
import { findMentions, keyOf, TERMS, STATUS_LABEL } from "./legal-review";
import { REGISTER } from "./legal-register";

/**
 * The register and the codebase have to agree.
 *
 * Without this the register is a snapshot that rots: somebody adds a blog post
 * mentioning Section 21, nothing notices, and the list a solicitor was handed
 * is quietly incomplete. The point of writing it down is that it stays true.
 */

const found = findMentions();
const registered = new Map(REGISTER.map(e => [keyOf(e), e]));

describe("the scan works", () => {
  it("finds mentions, so the comparisons below are not vacuous", () => {
    expect(found.length).toBeGreaterThan(20);
  });

  it("looks for every term it claims to", () => {
    for (const term of TERMS) {
      expect(term.why.length, term.id).toBeGreaterThan(25);
      // A pattern that matches nothing anywhere is either wrong or obsolete;
      // either way it should not sit in the list looking like coverage.
      expect(
        found.some(m => m.term === term.id),
        `${term.id} matches nothing — remove it or fix the pattern`,
      ).toBe(true);
    }
  });
});

describe("the register covers the codebase", () => {
  it("has an entry for every mention", () => {
    const missing = found.filter(m => !registered.has(keyOf(m)));
    expect(
      missing.map(m => `${m.file} (${m.term} ×${m.count})`),
      "these mention law the Renters' Rights Act changed and are not on the review list",
    ).toEqual([]);
  });

  it("has no entry for text that is no longer there", () => {
    const live = new Set(found.map(keyOf));
    const stale = REGISTER.filter(e => !live.has(keyOf(e)));
    expect(
      stale.map(e => `${e.file} (${e.term})`),
      "these are on the review list but the text has gone — delete the entries",
    ).toEqual([]);
  });

  it("keeps the counts accurate", () => {
    // A file going from one mention to six is worth noticing, and would
    // otherwise slip through as an already-registered entry.
    const drifted = found
      .filter(m => registered.get(keyOf(m))!.count !== m.count)
      .map(m => `${m.file} (${m.term}): register says ${registered.get(keyOf(m))!.count}, found ${m.count}`);
    expect(drifted).toEqual([]);
  });

  it("has no duplicate entries", () => {
    expect(registered.size).toBe(REGISTER.length);
  });
});

describe("the register is honest about itself", () => {
  it("uses a status the model knows", () => {
    for (const e of REGISTER) {
      expect(STATUS_LABEL[e.status], `${e.file}: ${e.status}`).toBeTruthy();
    }
  });

  it("makes a reviewed entry say who decided what", () => {
    // "correct-as-written" without a reason is indistinguishable from somebody
    // clearing the list to make a test pass.
    for (const e of REGISTER) {
      if (e.status === "not-reviewed") continue;
      expect(e.note, `${e.file} (${e.term}) is "${e.status}" with no note`).toBeTruthy();
      expect(e.note!.length, `${e.file} (${e.term})`).toBeGreaterThan(15);
    }
  });

  it("has not been silently marked off", () => {
    /**
     * Not a rule, an alarm. Every entry starts unreviewed, and they should be
     * cleared by a person working the list — at which point this fails and is
     * deleted along with the comment explaining why it existed.
     *
     * It is here because a register nobody looks at, whose entries drift to
     * "correct-as-written" one convenient commit at a time, is worse than no
     * register: it looks like the review happened.
     */
    const unreviewed = REGISTER.filter(e => e.status === "not-reviewed").length;
    expect(unreviewed, "the review has started — update or remove this assertion")
      .toBe(REGISTER.length);
  });
});
