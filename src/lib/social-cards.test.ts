import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { SOCIAL_CARDS, cardBySlug, buildCards } from "./social-cards";
import { calcSDLT } from "./tax";
import { grossYield } from "./finance";

describe("the card catalogue", () => {
  it("has a unique, URL-safe slug for every card", () => {
    const slugs = SOCIAL_CARDS.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) {
      expect(s, s).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("gives every card a headline, a value, workings and a caption", () => {
    for (const c of SOCIAL_CARDS) {
      expect(c.headline.length, c.slug).toBeGreaterThan(10);
      expect(c.value, c.slug).toBeTruthy();
      expect(c.valueLabel, c.slug).toBeTruthy();
      expect(c.rows.length, c.slug).toBeGreaterThan(1);
      expect(c.caption.length, c.slug).toBeGreaterThan(120);
    }
  });

  it("keeps captions inside Instagram's 2,200 character limit", () => {
    for (const c of SOCIAL_CARDS) {
      expect(c.caption.length, c.slug).toBeLessThanOrEqual(2200);
    }
  });

  // A card whose link 404s is worse than no card: the number becomes an
  // assertion the reader cannot check, which is the thing this file exists to
  // prevent. So the link is verified against the filesystem, not a regex.
  it("points every card at a calculator page that actually exists", () => {
    for (const c of SOCIAL_CARDS) {
      expect(c.verifyPath, c.slug).toMatch(/^\/calculators\/[a-z0-9-]+\/$/);
      const page = join(process.cwd(), "src/app", c.verifyPath, "page.tsx");
      expect(existsSync(page), `${c.slug} -> ${c.verifyPath}`).toBe(true);
    }
  });

  it("fits the workings on the card — more than six rows overflows 1080px", () => {
    for (const c of SOCIAL_CARDS) {
      expect(c.rows.length, c.slug).toBeLessThanOrEqual(6);
    }
  });

  it("looks up by slug and returns undefined for anything else", () => {
    expect(cardBySlug(SOCIAL_CARDS[0].slug)?.slug).toBe(SOCIAL_CARDS[0].slug);
    expect(cardBySlug("no-such-card")).toBeUndefined();
  });

  // The whole premise: a post is only publishable if the number on it came
  // from the same code as the calculator it links to.
  it("takes its numbers from the calculators, not from prose", () => {
    const sdlt = cardBySlug("stamp-duty-first-buy-to-let")!;
    expect(sdlt.value).toBe(`£${calcSDLT(200_000, true).toLocaleString("en-GB")}`);

    const yieldCard = cardBySlug("gross-yield-versus-net-yield")!;
    expect(yieldCard.value).toBe(`${grossYield(950 * 12, 180_000).toFixed(1)}%`);
  });

  it("is deterministic — the same slug renders the same numbers every time", () => {
    const a = buildCards();
    const b = buildCards();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  // The standing rule on this site. A caption may state a computed figure or a
  // rule with a date, but never a market statistic or a claim about results.
  it("makes no claims about results, clients or market averages", () => {
    const banned = [
      /\bguarantee[ds]?\b/i,
      /\btestimonial/i,
      /\bclients? (?:have|has)\b/i,
      /\baverage (?:yield|return|rent)\b/i,
      /\bmost landlords\b/i,
      /\bwill (?:rise|fall|grow|increase)\b/i,
    ];
    for (const c of SOCIAL_CARDS) {
      for (const re of banned) {
        expect(re.test(c.caption), `${c.slug} :: ${re}`).toBe(false);
      }
    }
  });

  it("labels every assumed input as an assumption", () => {
    for (const c of SOCIAL_CARDS) {
      const assumed = c.rows.filter(r => /assumed/i.test(r.k));
      for (const r of assumed) {
        expect(r.v, `${c.slug} :: ${r.k}`).toBeTruthy();
      }
      // Any card using the 28% cost ratio must say so on the card itself.
      if (/28%/.test(c.caption)) {
        expect(c.rows.some(r => /28%/.test(r.k)), c.slug).toBe(true);
      }
    }
  });
});
