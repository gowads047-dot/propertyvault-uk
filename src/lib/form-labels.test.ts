import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every form control needs a name a screen reader can announce.
 *
 * The site publishes an accessibility statement committing to WCAG 2.2 Level
 * AA. A control with no accessible name fails 1.3.1 and 3.3.2, which are Level
 * A — the tier below the one being claimed. The shape almost everywhere was a
 * <label> with no htmlFor sitting next to an input with no id, so the two were
 * never associated and the field was announced as "edit text, blank".
 *
 * ── Why this is a ceiling rather than a rule ───────────────────────────────
 *
 * The label-then-input shape was fixed mechanically, because a script can tie
 * those two together safely. What remains cannot be: a checkbox inside a map,
 * a search box with a placeholder and no label, a control whose only visual
 * label is a <p> above it. Each needs a name written for it, which is a
 * judgement per control.
 *
 * So this asserts the number does not grow. A new unlabelled control fails the
 * build; fixing a batch means lowering the ceiling in the same commit. The
 * alternative — asserting zero — would have to be skipped today, and a skipped
 * test is one nobody ever comes back to.
 *
 * ── What the number does not count ─────────────────────────────────────────
 *
 * This reads text, so it sees lexical nesting and not what actually renders.
 * A helper like FormRow or Field that wraps its children in a <label> names
 * every control passed to it, and none of that is visible here — the control
 * is written at the call site and the label lives in the component.
 *
 * Three such helpers were fixed and the count did not move at all. So the real
 * figure is better than this one, and the gap grows every time a wrapper is
 * corrected. Treat it as a ceiling that only ratchets down, never as a measure
 * of how accessible the forms are. The ground truth is a browser reporting
 * element.labels on a rendered page, which is how those three were checked.
 */

const CEILING = 34;

const root = process.cwd();
const toPosix = (p: string) => p.split("\\").join("/");

const files = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
  .filter(p => p.endsWith(".tsx") && !p.includes(".test."))
  .map(p => join(root, "src", p));

type Unnamed = { where: string; tag: string };

/**
 * The whole of a JSX tag, from "<input" to the ">" that closes it.
 *
 * Not a regex, because `onChange={e => ...}` contains a ">" and any lazy
 * [^>]* stops dead on the arrow. That truncation hid attributes written after
 * a handler — including ids — so controls that were properly named counted as
 * unnamed, and placeholders that could have supplied a name were invisible.
 * Fixing it revealed 37 more controls that a placeholder could name.
 */
/**
 * Comments, blanked out rather than deleted so line numbers survive.
 *
 * A page whose header comment explains that its upload boxes contained no
 * `<input type="file">` had that sentence counted as an unnamed control, and
 * pushed the total one over the ceiling. Prose about a control is not a
 * control, and a check that cannot tell the difference punishes the comment
 * that explains the fix.
 */
function stripComments(src: string): string {
  const blank = (m: string) => m.replace(/[^\n]/g, " ");
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])(\/\/[^\n]*)/g, (_m, pre: string, c: string) => pre + blank(c));
}

function tagAt(src: string, start: number): string | null {
  let depth = 0;
  let quote: string | null = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === "`") {
      quote = c;
    } else if (c === "{") depth += 1;
    else if (c === "}") depth -= 1;
    else if (c === ">" && depth === 0) return src.slice(start, i + 1);
  }
  return null;
}

/**
 * Controls with no accessible name.
 *
 * Three things this has to get right, all learned by getting them wrong.
 *
 * It reads whole tags, per tagAt above.
 *
 * It counts a wrapping <label> as a name, because it is one. An earlier
 * version looked three lines back for a label and reported all thirty-seven
 * controls in the deal analyser as broken — they sit inside a label spanning
 * five lines, which is valid and needs no id. A check that cries wolf on
 * correct code is one somebody switches off.
 *
 * And it cannot see a label supplied by a wrapper component, because the label
 * lives in the component and the control is written at the call site. Several
 * of those have been fixed and none of it shows here.
 */
function findUnnamed(): { unnamed: Unnamed[]; explicit: number; wrapped: number } {
  const unnamed: Unnamed[] = [];
  let explicit = 0;
  let wrapped = 0;

  for (const file of files) {
    const rel = toPosix(file.slice(root.length + 1));
    const src = stripComments(readFileSync(file, "utf8"));

    for (const m of src.matchAll(/<(input|textarea|select)\b/g)) {
      const at = m.index!;
      const tag = tagAt(src, at);
      if (!tag) continue;

      // Nothing to announce, or announced by its own value.
      if (/type="(hidden|submit|button)"/.test(tag)) continue;
      if (/aria-hidden="true"/.test(tag)) continue;

      if (/\b(id=|aria-label=|aria-labelledby=)/.test(tag)) {
        explicit += 1;
        continue;
      }

      const before = src.slice(0, at);
      const opens = (before.match(/<label\b/g) ?? []).length;
      const closes = (before.match(/<\/label>/g) ?? []).length;
      if (opens > closes) {
        wrapped += 1;
        continue;
      }

      unnamed.push({
        where: `${rel}:${before.split("\n").length}`,
        tag: tag.replace(/\s+/g, " ").slice(0, 70),
      });
    }
  }
  return { unnamed, explicit, wrapped };
}

const { unnamed, explicit, wrapped } = findUnnamed();

describe("form controls have a name", () => {
  it("finds controls at all, so the ceiling below means something", () => {
    expect(explicit + wrapped + unnamed.length).toBeGreaterThan(300);
  });

  it("counts a wrapped label as a name, because it is one", () => {
    // If this regresses the count jumps by nearly forty, and the ceiling looks
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
      "unnamed form controls went up. Give the new ones a label, or lower the " +
        `ceiling in the same commit if you fixed some.\n\nworst files:\n${worst}`,
    ).toBeLessThanOrEqual(CEILING);
  });

  it("has a ceiling that matches reality, so it cannot drift up unnoticed", () => {
    // A ceiling well above the real count silently permits regressions.
    expect(CEILING - unnamed.length).toBeLessThanOrEqual(10);
  });
});
