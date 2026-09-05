import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MIGRATIONS, probePath, interpret } from "./db-manifest";

const supabaseDir = join(process.cwd(), "supabase");
const onDisk = readdirSync(supabaseDir).filter(f => f.endsWith(".sql")).sort();

describe("the manifest covers what is on disk", () => {
  it("finds the schema files, so nothing below passes vacuously", () => {
    expect(onDisk.length).toBeGreaterThan(10);
  });

  it("lists every .sql file in supabase/", () => {
    // A migration nobody listed is one check:db silently ignores, which is the
    // same blind spot the script exists to remove.
    const listed = new Set(MIGRATIONS.map(m => m.file));
    for (const file of onDisk) {
      expect(listed, `supabase/${file} is not in the manifest`).toContain(file);
    }
  });

  it("lists nothing that is not on disk", () => {
    for (const m of MIGRATIONS) {
      expect(onDisk, `the manifest lists ${m.file}, which does not exist`).toContain(m.file);
    }
  });

  it("says what each one is for", () => {
    for (const m of MIGRATIONS) {
      expect(m.purpose.length, m.file).toBeGreaterThan(25);
    }
  });
});

describe("markers point at something the file really creates", () => {
  /**
   * A marker naming a table the file never creates would report "applied" off
   * the back of a different migration entirely — the worst outcome here, since
   * it is indistinguishable from success and hides a migration that never ran.
   */
  const sourceOf = (file: string) => readFileSync(join(supabaseDir, file), "utf8");

  it("names a table the file creates", () => {
    for (const m of MIGRATIONS) {
      if (m.marker.kind !== "table") continue;
      const src = sourceOf(m.file);
      expect(
        new RegExp(`create table (if not exists )?(public\\.)?${m.marker.table}\\b`, "i").test(src),
        `${m.file} does not create ${m.marker.table}`,
      ).toBe(true);
    }
  });

  it("names a column the file adds", () => {
    for (const m of MIGRATIONS) {
      if (m.marker.kind !== "column") continue;
      const src = sourceOf(m.file);
      expect(
        new RegExp(`add column (if not exists )?${m.marker.column}\\b`, "i").test(src),
        `${m.file} does not add ${m.marker.column}`,
      ).toBe(true);
      expect(
        new RegExp(`alter table (if exists )?(public\\.)?${m.marker.table}\\b`, "i").test(src),
        `${m.file} does not alter ${m.marker.table}`,
      ).toBe(true);
    }
  });

  it("explains itself when it cannot be verified", () => {
    for (const m of MIGRATIONS) {
      if (m.marker.kind !== "unverifiable") continue;
      expect(m.marker.because.length, m.file).toBeGreaterThan(25);
    }
  });
});

describe("probing", () => {
  it("builds a read-only path for each checkable marker", () => {
    // limit=0 asks for no rows at all. A check that reads customer data to
    // answer a schema question is the wrong shape.
    for (const m of MIGRATIONS) {
      const path = probePath(m.marker);
      if (m.marker.kind === "unverifiable") {
        expect(path, m.file).toBeNull();
        continue;
      }
      expect(path, m.file).toContain("limit=0");
    }
  });

  it("reads a 200 as applied", () => {
    expect(interpret(200, "[]")).toBe("applied");
  });

  it("reads the two absence codes as not run", () => {
    expect(interpret(404, '{"code":"42P01","message":"relation does not exist"}')).toBe("missing");
    expect(interpret(400, '{"code":"42703","message":"column x does not exist"}')).toBe("missing");
  });

  it("refuses to call anything else an answer", () => {
    // A bad key or an outage must never read as "not applied": acting on that
    // means running a migration for the second time.
    expect(interpret(401, '{"message":"Invalid API key"}')).toBe("error");
    expect(interpret(500, "upstream exploded")).toBe("error");
    expect(interpret(403, '{"code":"42501","message":"permission denied"}')).toBe("error");
  });
});
