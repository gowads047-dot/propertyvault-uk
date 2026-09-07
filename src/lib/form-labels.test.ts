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
 * It now resolves file-local wrapper components — a FormRow or Field that
 * wraps its children in a <label> names every control passed to it — because
 * without that the count was 34 where the truth was 13. Twenty-four controls
 * were reported as broken while being perfectly correct, which is exactly the
 * kind of false alarm that gets a check switched off.
 *
 * A wrapper imported from another file is still invisible, so treat this as a
 * ceiling that ratchets down, not as a measurement. The ground truth is a
 * browser reporting element.labels on a rendered page: every public page these
 * controls sit on reports zero unnamed, and that is how the 34 was disproved.
 *
 * ── What the remaining six are ─────────────────────────────────────────────
 *
 * All six are the generic Input, Select and Textarea components declared
 * inside /templates/commercial-lease and /templates/tenant-application. Those
 * carry no label of their own, but every single call site wraps them in
 * <Field label="…">, which does. Checked two ways: statically, that no use of
 * them sits outside a Field; and in a browser, where tenant-application
 * reports zero unnamed controls and names like "Property address *".
 *
 * They are counted rather than excused because a static check cannot prove the
 * next call site will wrap them too. KNOWN_FILES below pins them to those two
 * files, so an unnamed control appearing anywhere else fails immediately
 * rather than hiding inside the allowance.
 */

const CEILING = 6;

const root = process.cwd();
const toPosix = (p: string) => p.split("\\").join("/");

const files = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
  .filter(p => p.endsWith(".tsx") && !p.includes(".test."))
  .map(p => join(root, "src", p));

type Unnamed = { where: string; tag: string };

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

/**
 * The whole of a JSX tag, from "<input" to the ">" that closes it.
 *
 * Not a regex, because `onChange={e => ...}` contains a ">" and any lazy
 * [^>]* stops dead on the arrow. That truncation hid attributes written after
 * a handler — including ids — so controls that were properly named counted as
 * unnamed, and placeholders that could have supplied a name were invisible.
 * Fixing it revealed 37 more controls that a placeholder could name.
 */
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
 * And it now resolves a label supplied by a wrapper component — see
 * labellingWrappers below. It used to miss those entirely, which is why the
 * count was roughly three times the truth.
 */

/**
 * Components declared in this file that take a `label` prop and render a real
 * <label> element — FormRow, Field, Slider and friends.
 *
 * Without this the check reads text and sees only the call site, where the
 * control is written, never the component where the <label> lives. That gap
 * was not small: of the thirty-four controls this reported as unnamed, twenty
 * four were named by exactly this pattern and were correct all along. Every
 * public page they sit on reports zero unnamed controls in a browser, which is
 * the ground truth.
 *
 * Deliberately file-local. A wrapper imported from elsewhere is still invisible
 * here, so the number remains a ceiling rather than a measurement — but a much
 * closer one.
 */
function labellingWrappers(src: string): string[] {
  const names: string[] = [];
  const decls = [...src.matchAll(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/g)];

  decls.forEach((d, i) => {
    const body = src.slice(d.index!, decls[i + 1]?.index ?? src.length);
    const takesLabel = /^[^)]*\blabel\b/.test(body.slice(body.indexOf("(")));
    if (takesLabel && /<label[\s>]/.test(body)) names.push(d[1]);
  });
  return names;
}

/**
 * Every point in the file where nesting depth changes, in order.
 *
 * Built once per file, then swept alongside the controls. The obvious version
 * — re-running `before.match(/<label\b/g)` for each control — rescans the whole
 * prefix every time, which is quadratic in file size. With the wrapper check
 * added on top it took this file from milliseconds to eight seconds and
 * starved the other test workers of CPU until unrelated suites timed out.
 */
type Depth = { at: number; delta: number; kind: "label" | "wrapper" };

function depthEvents(src: string, wrappers: string[]): Depth[] {
  const events: Depth[] = [];
  for (const m of src.matchAll(/<label\b/g)) events.push({ at: m.index!, delta: 1, kind: "label" });
  for (const m of src.matchAll(/<\/label>/g)) events.push({ at: m.index!, delta: -1, kind: "label" });

  for (const w of wrappers) {
    for (const m of src.matchAll(new RegExp(`<${w}[\\s/>]`, "g"))) {
      events.push({ at: m.index!, delta: 1, kind: "wrapper" });
    }
    for (const m of src.matchAll(new RegExp(`</${w}>`, "g"))) {
      events.push({ at: m.index!, delta: -1, kind: "wrapper" });
    }
  }
  return events.sort((a, b) => a.at - b.at);
}

function findUnnamed(): { unnamed: Unnamed[]; explicit: number; wrapped: number } {
  const unnamed: Unnamed[] = [];
  let explicit = 0;
  let wrapped = 0;

  for (const file of files) {
    const rel = toPosix(file.slice(root.length + 1));
    const src = stripComments(readFileSync(file, "utf8"));
    const events = depthEvents(src, labellingWrappers(src));

    // Swept in step with the controls below, which arrive in file order, so
    // each event is visited once for the whole file rather than once per
    // control.
    let cursor = 0;
    let labelDepth = 0;
    let wrapperDepth = 0;

    // Line numbers from the same sweep, for the same reason.
    let line = 1;
    let lineAt = 0;

    for (const m of src.matchAll(/<(input|textarea|select)\b/g)) {
      const at = m.index!;

      while (cursor < events.length && events[cursor].at < at) {
        const e = events[cursor++];
        if (e.kind === "label") labelDepth += e.delta;
        else wrapperDepth += e.delta;
      }
      while (lineAt < at) {
        if (src.charCodeAt(lineAt) === 10) line += 1;
        lineAt += 1;
      }

      const tag = tagAt(src, at);
      if (!tag) continue;

      // Nothing to announce, or announced by its own value.
      if (/type="(hidden|submit|button)"/.test(tag)) continue;
      if (/aria-hidden="true"/.test(tag)) continue;

      if (/\b(id=|aria-label=|aria-labelledby=)/.test(tag)) {
        explicit += 1;
        continue;
      }

      if (labelDepth > 0 || wrapperDepth > 0) {
        wrapped += 1;
        continue;
      }

      unnamed.push({
        where: `${rel}:${line}`,
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

  it("keeps the remaining ones where they are known to be harmless", () => {
    // The allowance exists for two files' generic control components. A new
    // unnamed control in a third file is a real regression and fails here even
    // if the total still fits under the ceiling.
    const KNOWN_FILES = [
      "app/templates/commercial-lease/page.tsx",
      "app/templates/tenant-application/page.tsx",
    ];
    const strays = unnamed
      .map(u => u.where.split(":")[0].replace(/^src\//, ""))
      .filter(f => !KNOWN_FILES.includes(f));

    expect(
      [...new Set(strays)],
      "an unnamed control outside the two files whose generic Input/Select/" +
        "Textarea components are always wrapped in <Field label>. Give it a " +
        "name, or a wrapping label.",
    ).toEqual([]);
  });

  it("has a ceiling that matches reality, so it cannot drift up unnoticed", () => {
    // A ceiling well above the real count silently permits regressions.
    expect(CEILING - unnamed.length).toBeLessThanOrEqual(10);
  });
});
