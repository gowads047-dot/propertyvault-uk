import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every form control needs a name a screen reader can announce.
 *
 * The site publishes an accessibility statement committing to WCAG 2.2 Level
 * AA. A control with no accessible name fails 1.3.1 and 3.3.2, which are Level
 * A — the tier below the one being claimed. There were 389 of them across 78
 * files: the shape almost everywhere was a <label> with no htmlFor sitting
 * next to an input with no id, so the two were never associated and the field
 * was announced as "edit text, blank".
 *
 * ── Why this is a ceiling rather than a rule ───────────────────────────────
 *
 * 219 were fixed mechanically, because label-then-input is a shape a script
 * can tie together safely. The rest are not: a checkbox inside a map, a search
 * box with a placeholder and no label, a filter with only an icon. Each needs
 * a name written for it, which is a judgement per control and not a codemod.
 *
 * So this asserts the number does not grow. A new unlabelled control fails the
 * build; fixing a batch means lowering the ceiling in the same commit. The
 * alternative — asserting zero — would have to be skipped today, and a skipped
 * test is one nobody ever comes back to.
 */

const CEILING = 170;

const root = process.cwd();
const toPosix = (p: string) => p.split("\\").join("/");

const files = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
  .filter(p => p.endsWith(".tsx") && !p.includes(".test."))
  .map(p => join(root, "src", p));

type Unnamed = { where: string; tag: string };

/**
 * Controls with no accessible name.
 *
 * Label depth is tracked across the whole file rather than by looking a couple
 * of lines back. The first version of this used a three-line window and
 * reported all 37 controls in the deal analyser as broken — they are wrapped
 * in a <label> that spans five lines, which is valid and needs no id at all.
 * A check that cries wolf on a correct file is a check somebody switches off.
 */
function findUnnamed(): { unnamed: Unnamed[]; explicit: number; wrapped: number } {
  const unnamed: Unnamed[] = [];
  let explicit = 0;
  let wrapped = 0;

  for (const file of files) {
    const rel = toPosix(file.slice(root.length + 1));
    let depth = 0;

    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      // Tokenised in order, so an open and a close on the same line net out
      // correctly around any control between them.
      for (const t of line.matchAll(/<label\b|<\/label>|<(?:input|textarea|select)\b[^>]*/g)) {
        const tok = t[0];
        if (tok === "<label") { depth += 1; continue; }
        if (tok === "</label>") { depth = Math.max(0, depth - 1); continue; }

        // Nothing to announce, or announced by its own value.
        if (/type="(hidden|submit|button)"/.test(tok)) continue;
        if (/aria-hidden="true"/.test(tok)) continue;

        if (/\b(id=|aria-label=|aria-labelledby=)/.test(tok)) { explicit += 1; continue; }
        if (depth > 0) { wrapped += 1; continue; }

        unnamed.push({ where: `${rel}:${i + 1}`, tag: tok.slice(0, 70) });
      }
    });
  }
  return { unnamed, explicit, wrapped };
}

const { unnamed, explicit, wrapped } = findUnnamed();

describe("form controls have a name", () => {
  it("finds controls at all, so the ceiling below means something", () => {
    expect(explicit + wrapped + unnamed.length).toBeGreaterThan(300);
  });

  it("counts a wrapped label as a name, because it is one", () => {
    // The deal analyser wraps every input in a multi-line <label>. If this
    // regresses, the count jumps by nearly forty and the ceiling looks
    // breached by work that never happened.
    expect(wrapped).toBeGreaterThan(30);
  });

  it("does not grow past the ceiling", () => {
    const byFile = new Map<string, number>();
    for (const u of unnamed) {
      const f = u.where.split(":")[0];
      byFile.set(f, (byFile.get(f) ?? 0) + 1);
    }
    const worst = [...byFile.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([f, n]) => `  ${String(n).padStart(3)}  ${f}`)
      .join("\n");

    expect(
      unnamed.length,
      `unnamed form controls went up. Give the new ones a label, or lower the ` +
      `ceiling in the same commit if you fixed some.\n\nworst files:\n${worst}`,
    ).toBeLessThanOrEqual(CEILING);
  });

  it("has a ceiling that matches reality, so it cannot drift up unnoticed", () => {
    // A ceiling well above the real count silently permits regressions.
    expect(CEILING - unnamed.length).toBeLessThanOrEqual(10);
  });
});
