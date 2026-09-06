import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * PropertyVault must not claim to have vetted anybody.
 *
 * /find-agent listed eighteen real named firms — Habito, JMW Solicitors,
 * Allsop LLP, e.surv, OpenRent among them — under the heading "Vetted,
 * regulated professionals", with the line "We verify all professional listings
 * with the relevant regulatory body". There was no verification. The firms
 * were a hardcoded array in the page, there is no provider table, and no
 * process exists anywhere in the codebase.
 *
 * That is the worst class of untrue claim this site has carried, for two
 * reasons. It asserts a relationship with real companies who never agreed to
 * it. And somebody choosing a conveyancer acts on "their credentials were
 * checked" in a way they do not act on marketing copy.
 *
 * It was never confined to one page. Writing this test found two more: /trades
 * offering "vetted plumbers" and "quotes from verified local tradespeople",
 * and /renting-strategies listing "PropertyVault verified social housing
 * partners (see our directory)" — pointing at a directory that has never
 * existed. All three were written independently, which is the argument for a
 * test rather than three fixes.
 *
 * ── Why zero, and not a ceiling ────────────────────────────────────────────
 *
 * form-labels.test.ts asserts a ceiling because naming 389 controls is a long
 * grind and a skipped test is one nobody returns to. This is different: there
 * is no legitimate reason for the site to claim it vetted somebody, so the
 * correct number is zero and it is reachable today. A ceiling here would be
 * permission to add one more.
 *
 * ── What it looks for ──────────────────────────────────────────────────────
 *
 * Narrow patterns, deliberately. A bare search for "vetted" or "verified"
 * matches EPC certificates, verified email addresses, a landlord vetting a
 * tenant, and the disclaimers on the rewritten pages saying we vet nobody —
 * and a check that fires on correct code is one somebody switches off.
 *
 * So it matches only first-person assertions and the adjective-plus-person
 * construction, which is where every real instance lived. It deliberately does
 * NOT match "a vetted panel needs a verification standard and somebody to
 * apply it" on /find-agent: that sentence explains why there is no panel, and
 * "panel" is not a person.
 *
 * Comments are stripped before matching. This file and the two pages above
 * describe the removed claims at length, and a test that counted its own
 * explanation would be unfixable.
 */

const SRC = join(process.cwd(), "src");
const toPosix = (p: string) => p.split("\\").join("/");

/**
 * Every .ts/.tsx under src, excluding tests.
 *
 * readdirSync with `recursive` rather than a hand-rolled walk: the obvious
 * version — recurse where entry.isDirectory() — returns nothing on this
 * machine, because Dirent.isDirectory() reports false for every directory
 * under src here. A walk that finds no files makes this assertion pass by
 * finding nothing, so the count is asserted below.
 */
const files = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter(p => /\.tsx?$/.test(p) && !p.includes(".test."))
  .map(p => toPosix(p));

/**
 * Blank out block and line comments, preserving newlines so a reported line
 * number still points at the right line. Deleting them outright put the first
 * failure thirty lines above the text it quoted.
 *
 * The line-comment rule spares "https://" by requiring the slashes not to
 * follow a colon.
 */
function stripComments(src: string): string {
  const blank = (m: string) => m.replace(/[^\n]/g, " ");
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])(\/\/[^\n]*)/g, (_m, pre: string, c: string) => pre + blank(c));
}

const PEOPLE =
  "trade|trades|tradespeople|tradesperson|professional|professionals|agent|agents|" +
  "solicitor|solicitors|conveyancer|conveyancers|surveyor|surveyors|broker|brokers|" +
  "contractor|contractors|supplier|suppliers|partner|partners|provider|providers|" +
  "plumber|plumbers|electrician|electricians|builder|builders|engineer|engineers|" +
  "accountant|accountants|community";

const PATTERNS: { re: RegExp; why: string }[] = [
  {
    // "We verify all professional listings…", "PropertyVault vets every…"
    re: new RegExp(
      String.raw`\b(?:we|propertyvault)\s+(?:only\s+)?` +
        String.raw`(?:vet|vets|vetted|verify|verifies|verified|approve|approves|approved|` +
        String.raw`accredit|accredits|accredited|pre-?screen|pre-?screens|pre-?screened)\b`,
      "gi",
    ),
    why: "says PropertyVault does the vetting",
  },
  {
    // The collective nouns deliberately left out of PEOPLE — "our vetted
    // directory", "PropertyVault's trusted network" — claims about a group
    // rather than about a person. Kept separate because "a vetted directory"
    // on its own is usually the sentence saying we do not run one.
    re: /\b(?:our|propertyvault(?:['’]s)?)\s+(?:vetted|verified|approved|trusted|accredited|pre-?screened)\b/gi,
    why: "claims a vetted group as ours",
  },
  {
    // A badge nobody can award, because no standard exists.
    re: /\bpropertyvault[-\s]approved\b/gi,
    why: "an accreditation with no standard behind it",
  },
  {
    // "vetted plumbers", "vetted community", "hand-picked professionals"
    re: new RegExp(
      String.raw`\b(?:vetted|pre-?screened|hand-?picked|background-?checked)\s+(?:${PEOPLE})\b`,
      "gi",
    ),
    why: "describes people as vetted",
  },
];

type Hit = { where: string; why: string; text: string };

function findClaims(): Hit[] {
  const hits: Hit[] = [];
  for (const rel of files) {
    const src = stripComments(readFileSync(join(SRC, rel), "utf8"));
    for (const { re, why } of PATTERNS) {
      for (const m of src.matchAll(re)) {
        const line = src.slice(0, m.index).split("\n").length;
        hits.push({
          where: `src/${rel}:${line}`,
          why,
          text: src.slice(Math.max(0, m.index! - 70), m.index! + 70).replace(/\s+/g, " ").trim(),
        });
      }
    }
  }
  return hits;
}

describe("PropertyVault does not claim to have vetted anybody", () => {
  it("reads the whole tree, so a clean result means something", () => {
    // Guards the readdir failure mode described above. Anything near this
    // number means the walk worked; zero would make every check below vacuous.
    expect(files.length).toBeGreaterThan(200);
  });

  it("still recognises the claim it was written for", () => {
    // The original /find-agent line, verbatim. If a refactor breaks the
    // patterns, this fails rather than the suite going quietly green.
    const original = "We verify all professional listings with the relevant regulatory body";
    const matched = PATTERNS.some(p => {
      p.re.lastIndex = 0;
      return p.re.test(original);
    });
    expect(matched, "the detector no longer catches the claim it exists for").toBe(true);
  });

  it("does not fire on the disclaimers that say we vet nobody", () => {
    // These are live on /find-agent and /trades. A check that flags them is
    // one somebody turns off, and then the real claims come back.
    const honest = [
      "We do not run a vetted directory. PropertyVault has no accreditation scheme, checks nobody's credentials",
      "We have not vetted anybody. PropertyVault runs no trades directory",
      "A vetted panel needs a verification standard and somebody to apply it",
    ];
    for (const line of honest) {
      for (const p of PATTERNS) {
        p.re.lastIndex = 0;
        expect(p.re.test(line), `false positive on: ${line}`).toBe(false);
      }
    }
  });

  it("finds none in the site", () => {
    const hits = findClaims();
    const detail = hits.map(h => `  ${h.where}  (${h.why})\n      …${h.text}…`).join("\n");
    expect(
      hits,
      "PropertyVault vets nobody and has no verification standard, so it cannot " +
        "say this. Describe what the reader can check on a public register " +
        `instead — /find-agent and /trades both do.\n\n${detail}`,
    ).toEqual([]);
  });
});
