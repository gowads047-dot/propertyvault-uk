import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A form must submit what it appears to collect.
 *
 * form-labels.test.ts asks whether a screen reader can announce a control.
 * This asks a different question about the same controls: if somebody fills
 * this in, does the value go anywhere? A field can have a perfect <label>, a
 * placeholder, an id, and still be discarded on submit.
 *
 * ── Where this came from ───────────────────────────────────────────────────
 *
 * /list-property was a twenty-four control listing form ending in a button
 * marked "Publish Listing". Seven controls had a `name`. All seven were
 * contact details.
 *
 * FormData collects named controls and nothing else, so the address, rent,
 * bedrooms, EPC, description, features and tenant preferences were never sent
 * anywhere. The page looked complete, filled in correctly, validated, and
 * returned "Thanks — we have your listing." What arrived was four contact
 * fields.
 *
 * The same page had four compliance upload boxes and a photo dropzone built
 * from <div>s, with cursor-pointer and a hover state and no <input type="file">
 * anywhere in the file. "Drag photos here or click to upload" did nothing at
 * all, in a way no amount of clicking would reveal, because a div that does
 * nothing looks exactly like a div waiting for a file.
 *
 * Both are invisible in review — the JSX reads as a working form — and both
 * cost a real person their work rather than merely misinforming them. So both
 * are asserted at zero.
 */

const SRC = join(process.cwd(), "src");
const toPosix = (p: string) => p.split("\\").join("/");

/**
 * readdirSync with `recursive` rather than a hand-rolled walk: the obvious
 * version — recurse where entry.isDirectory() — returns nothing on this
 * machine, because Dirent.isDirectory() reports false for every directory
 * under src here. Hence the count assertion below.
 */
const files = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter(p => /\.tsx$/.test(p) && !p.includes(".test."))
  .map(p => toPosix(p));

/**
 * The whole of a JSX tag, from "<input" to the ">" that closes it.
 *
 * Not a regex. `onChange={e => ...}` contains a ">", and any lazy [^>]* stops
 * dead on the arrow — which truncates the tag and hides every attribute
 * written after a handler, `name` among them. form-labels.test.ts learned this
 * the expensive way and the same scanner is used here.
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

/** Controls between <ApiForm and </ApiForm> that carry no `name`. */
function unnamedInApiForms(): { where: string; tag: string }[] {
  const found: { where: string; tag: string }[] = [];

  for (const rel of files) {
    const src = readFileSync(join(SRC, rel), "utf8");
    const open = src.indexOf("<ApiForm");
    const close = src.indexOf("</ApiForm>");
    if (open < 0 || close < 0) continue;

    const body = src.slice(open, close);
    for (const m of body.matchAll(/<(input|textarea|select)\b/g)) {
      const tag = tagAt(body, m.index!);
      if (!tag) continue;
      // A submit or button carries no value to send.
      if (/type="(submit|button)"/.test(tag)) continue;
      if (/\bname=/.test(tag)) continue;

      found.push({
        where: `src/${rel}:${src.slice(0, open + m.index!).split("\n").length}`,
        tag: tag.replace(/\s+/g, " ").slice(0, 80),
      });
    }
  }
  return found;
}

/**
 * Files that promise an upload and contain no file input to do it with.
 *
 * The dropzone phrasing has to name what is being dropped. The first version
 * of this used /drop .{0,24}here/ and flagged /rent-to-rent for the sourcing
 * tip "letter-drop in streets where HMO demand is highest" — "drop in streets
 * w-here". A check that fires on prose is one somebody switches off, so the
 * noun is required.
 */
function uploadsThatCannotUpload(): string[] {
  const thing = String.raw`(?:files?|photos?|images?|documents?|certificates?|them)`;
  const promise = new RegExp(
    String.raw`click to upload|(?:drag|drop)\s+(?:and drop\s+)?(?:your\s+)?${thing}\s+here`,
    "i",
  );
  return files.filter(rel => {
    const src = stripComments(readFileSync(join(SRC, rel), "utf8"));
    return promise.test(src) && !/type="file"/.test(src);
  }).map(rel => `src/${rel}`);
}

/**
 * Comments, blanked out.
 *
 * Needed in both directions. The header comment on /list-property explains
 * that its upload boxes had no <input type="file"> anywhere — and that
 * sentence contains the literal this function searches for, so the page
 * describing the bug read as though it had been fixed. Reintroducing the bug
 * to check the test is what surfaced it.
 */
function stripComments(src: string): string {
  const blank = (m: string) => m.replace(/[^\n]/g, " ");
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])(\/\/[^\n]*)/g, (_m, pre: string, c: string) => pre + blank(c));
}

/**
 * A <form> with neither an onSubmit handler nor an action.
 *
 * Submitting one reloads the page and discards everything typed into it. The
 * /trades waiting list was this, and widening the check found three more —
 * /community, /deal-sourcing and /membership — all collecting an email
 * address that went nowhere. Four "join the waiting list" forms on a site
 * whose entire remaining question is how many people want these services.
 */
function formsThatGoNowhere(): string[] {
  const dead: string[] = [];
  for (const rel of files) {
    const src = stripComments(readFileSync(join(SRC, rel), "utf8"));
    for (const m of src.matchAll(/<form\b/g)) {
      // tagAt, not [^>]*. An inline handler — onSubmit={(e) => ...} — contains
      // a ">" that truncates a lazy match right before the attribute being
      // looked for, so a working form reads as a dead one.
      const tag = tagAt(src, m.index!);
      if (!tag) continue;
      if (/onSubmit|action=/.test(tag)) continue;
      dead.push(`src/${rel}:${src.slice(0, m.index).split("\n").length}`);
    }
  }
  return dead;
}

describe("a form submits what it collects", () => {
  it("reads the whole tree, so a clean result means something", () => {
    expect(files.length).toBeGreaterThan(150);
  });

  it("finds the ApiForms, so the check below is not scanning nothing", () => {
    const withForms = files.filter(rel =>
      readFileSync(join(SRC, rel), "utf8").includes("<ApiForm"),
    );
    expect(withForms.length).toBeGreaterThan(2);
  });

  it("gives every control inside an ApiForm a name", () => {
    const unnamed = unnamedInApiForms();
    const detail = unnamed.map(u => `  ${u.where}\n      ${u.tag}`).join("\n");
    expect(
      unnamed,
      "FormData only collects controls with a name, so these are filled in by " +
        "somebody and then thrown away on submit. The field will look correct " +
        `in every other respect.\n\n${detail}`,
    ).toEqual([]);
  });

  it("has no form that submits nowhere", () => {
    const dead = formsThatGoNowhere();
    expect(
      dead,
      "a <form> with no onSubmit and no action reloads the page and throws away " +
        "everything typed into it. Use ApiForm, or give it a handler:\n\n  " +
        dead.join("\n  "),
    ).toEqual([]);
  });

  it("does not offer an upload with nothing to upload into", () => {
    const fake = uploadsThatCannotUpload();
    expect(
      fake,
      "these say 'click to upload' or 'drag here' and contain no " +
        `<input type="file">, so clicking does nothing:\n\n  ${fake.join("\n  ")}`,
    ).toEqual([]);
  });
});
