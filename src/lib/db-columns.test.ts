import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/**
 * Every table and column the code names, checked against production.
 *
 * supabase/columns.snapshot.json is the live catalogue — one query, pasted:
 *
 *   select json_object_agg(table_name, cols) from (
 *     select table_name, json_agg(column_name order by ordinal_position) as cols
 *     from information_schema.columns where table_schema = 'public'
 *     group by table_name) t;
 *
 * Refresh it whenever a migration runs. The reason it exists: the repo's
 * SQL files and the live database had drifted, and four screens were
 * writing or reading columns that are not there — every Rentura document
 * upload failed on `file_name` (the table has `name`), the cancellation
 * cron asked rentura_subscriptions for an `email` it does not have, the
 * landlord chat selected `tenant_phone` off tenant_issues, and the Makan
 * listing page incremented a `view_count` that never existed. supabase-js
 * returns an error object rather than throwing, and none of those errors
 * were read, so all four failed silently for months.
 *
 * The parser follows each `.from("table")` through the method chain that
 * directly follows it (balanced parentheses, so a Promise.all of several
 * queries does not bleed into one another) and collects the columns named
 * in select/eq/order/… and in an insert/update/upsert object literal.
 * Embedded relations in a select (`listing:listings(...)`,
 * `rentura_properties(address)`, `makan_unit!inner(...)`) are skipped.
 */
const snapshot = JSON.parse(readFileSync(join(process.cwd(), "supabase", "columns.snapshot.json"), "utf8")) as {
  tables: Record<string, string[]>;
};
const TABLES = new Map(Object.entries(snapshot.tables).map(([t, cols]) => [t, new Set(cols)]));

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !name.includes(".test.")) out.push(p);
  }
  return out;
}

/** The `.a(...).b(...)` chain immediately after `start`, with balanced parentheses. */
function chainAfter(src: string, start: number): string {
  let i = start;
  for (;;) {
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] !== ".") break;
    let j = i + 1;
    while (j < src.length && /[A-Za-z_$0-9]/.test(src[j])) j++;
    if (src[j] !== "(") break;
    let depth = 0;
    let quote: string | null = null;
    for (; j < src.length; j++) {
      const ch = src[j];
      if (quote) {
        if (ch === "\\") j++;
        else if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "(") depth++;
      else if (ch === ")") { depth--; if (depth === 0) { j++; break; } }
    }
    i = j;
  }
  return src.slice(start, i);
}

type Ref = { file: string; line: number; table: string; column: string };

function referencesIn(src: string, rel: string, unknownTables: Ref[], unknownColumns: Ref[]) {
  const re = /\.from\(\s*"([a-z_]+)"\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const table = m[1];
    const line = src.slice(0, m.index).split("\n").length;
    if (!TABLES.has(table)) { unknownTables.push({ file: rel, line, table, column: "" }); continue; }
    const cols = TABLES.get(table)!;
    const chain = chainAfter(src, m.index + m[0].length);
    const named = new Set<string>();
    const sel = chain.match(/\.select\(\s*"([^"]+)"/);
    if (sel) {
      for (const part of sel[1].replace(/\([^)]*\)/g, "").split(",")) {
        const token = part.trim();
        if (!token || token === "*" || token.includes(":") || token.includes("!") || TABLES.has(token)) continue;
        if (/^[a-z_]+$/.test(token)) named.add(token);
      }
    }
    for (const f of chain.matchAll(/\.(eq|neq|gt|gte|lt|lte|like|ilike|is|in|not|order|contains|overlaps)\(\s*"([a-z_]+)"/g)) named.add(f[2]);
    const lit = chain.match(/\.(insert|update|upsert)\(\s*\{([\s\S]*)/);
    if (lit) {
      // Top-level keys only: comments out, nested objects (metadata: {...}) collapsed.
      const body = lit[2].replace(/\/\/.*$/gm, "").replace(/\{[^{}]*\}/g, "{}");
      for (const k of body.slice(0, body.indexOf("}")).matchAll(/(?:^|[,{])\s*([a-z_]+)\s*:/gm)) named.add(k[1]);
    }
    for (const column of named) if (!cols.has(column)) unknownColumns.push({ file: rel, line, table, column });
  }
}

function references(): { unknownTables: Ref[]; unknownColumns: Ref[] } {
  const unknownTables: Ref[] = [];
  const unknownColumns: Ref[] = [];
  for (const file of walk(join(process.cwd(), "src"))) {
    const rel = file.slice(process.cwd().length + 1).split(sep).join("/");
    referencesIn(readFileSync(file, "utf8"), rel, unknownTables, unknownColumns);
  }
  return { unknownTables, unknownColumns };
}

/**
 * Row types declared next to a select("*"): every field must be a column.
 *
 * select("*") names no columns, so the check above cannot see the type the
 * page then reads the rows through — and Makan's admin table had a "Views"
 * column reading `view_count`, a field the type declared and the table has
 * never had, so it showed 0 for every listing; the Rentura admin's waitlist
 * table had a "Phone" column reading `phone` off rentura_waitlist, which
 * stores `portfolio`. A type's fields are matched
 * to whichever of the file's tables covers most of them; fields that are
 * embedded-relation aliases (`property:rentura_properties(...)`) or table
 * names are left alone.
 */
function phantomFieldsIn(src: string, rel: string): string[] {
  const star = new Set([...src.matchAll(/\.from\("([a-z_]+)"\)\.select\("\*/g)].map((m) => m[1]).filter((t) => TABLES.has(t)));
  if (star.size === 0) return [];
  // Every table the file touches competes for a type; only a select("*")
  // table is reported on, since a named select is checked above already.
  const tables = [...new Set([...src.matchAll(/\.from\("([a-z_]+)"\)/g)].map((m) => m[1]).filter((t) => TABLES.has(t)))];
  const aliases = new Set<string>();
  for (const sel of src.matchAll(/\.select\(\s*"([^"]+)"/g)) {
    for (const a of sel[1].matchAll(/([a-z_]+)\s*:[a-z_]/g)) aliases.add(a[1]);
  }
  const out: string[] = [];
  // A type that is the shape of an API response, not a row, declared in a
  // file that also reads a table with select("*"). Named here rather than
  // loosening the match for everyone.
  const notRows = new Set(["AdminUser"]);
  // One type at a time: a body may nest one level ({ address: string }) but never another declaration.
  for (const tm of src.matchAll(/(?:type|interface) (\w+)\s*=?\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g)) {
    // Nested object types are a relation's shape, not columns of this table.
    const flat = tm[2].replace(/\{[^{}]*\}/g, "{}");
    const fields = [...flat.matchAll(/(?:^|[{;])\s*([a-z][a-z_0-9]*)\??:/gm)].map((m) => m[1]);
    if (fields.length < 4 || notRows.has(tm[1])) continue;
    const best = tables.reduce((a, b) => (fields.filter((f) => TABLES.get(b)!.has(f)).length > fields.filter((f) => TABLES.get(a)!.has(f)).length ? b : a));
    if (!star.has(best)) continue;
    const cols = TABLES.get(best)!;
    if (fields.filter((f) => cols.has(f)).length < fields.length * 0.6) continue;
    for (const f of fields) {
      if (cols.has(f) || aliases.has(f) || TABLES.has(f)) continue;
      out.push(`${rel}: ${tm[1]}.${f} is not a column of ${best}`);
    }
  }
  return out;
}

describe("database references match the production catalogue", () => {
  const refs = references();
  const show = (r: Ref) => `${r.file}:${r.line} ${r.table}${r.column ? "." + r.column : ""}`;

  it("declares no row-type field that the table it reads with select('*') does not have", () => {
    const phantoms: string[] = [];
    for (const file of walk(join(process.cwd(), "src"))) {
      phantoms.push(...phantomFieldsIn(readFileSync(file, "utf8"), file.slice(process.cwd().length + 1).split(sep).join("/")));
    }
    expect(phantoms).toEqual([]);
    expect(phantomFieldsIn(`
      type Listing = { id: string; title: string; price: number; city: string; view_count: number | null; owner: { name: string } };
      const { data } = await supabase.from("listings").select("*, owner:profiles(name)");
    `, "x.tsx")).toEqual(["x.tsx: Listing.view_count is not a column of listings"]);
  });

  it("names only tables that exist", () => {
    expect(refs.unknownTables.map(show)).toEqual([]);
  });

  it("names only columns that exist on the table it queries", () => {
    expect(refs.unknownColumns.map(show)).toEqual([]);
  });

  it("is looking at real code, so the two checks above are not vacuous", () => {
    expect(TABLES.size).toBeGreaterThan(50);
    // The four bugs this test was written for, re-stated, must all be caught.
    const t: Ref[] = [];
    const c: Ref[] = [];
    referencesIn(
      `
      await Promise.all([
        supabase.from("rentura_documents").insert({ user_id: id, file_name: file.name, category: "other" }),
        supabase.from("rentura_subscriptions").select("user_id, email, access_until").eq("status", "cancelled"),
      ]);
      const { data } = await supabase.from("tenant_issues").select("id,title,tenant_phone,property_id");
      supabase.from("listings").update({
        // a comment: with a colon
        view_count: (data.view_count ?? 0) + 1,
        features: { nested: true },
      }).eq("id", data.id);
      supabase.from("no_such_table").select("*");
      `,
      "x.ts", t, c,
    );
    expect(c.map((r) => `${r.table}.${r.column}`)).toEqual([
      "rentura_documents.file_name",
      "rentura_subscriptions.email",
      "tenant_issues.tenant_phone",
      "listings.view_count",
    ]);
    expect(t.map((r) => r.table)).toEqual(["no_such_table"]);
  });
});
