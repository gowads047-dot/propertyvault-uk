import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { ENV_MANIFEST, requiredVars, missingFrom } from "./env-manifest";

/**
 * The manifest has to describe the code, not a memory of it.
 *
 * A list of environment variables is only useful while it is complete, and the
 * way it stops being complete is somebody adding a variable and not writing it
 * down. So this reads the source rather than trusting the list.
 */

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Every process.env.X the application actually reads. */
function referencedVars(): Set<string> {
  const found = new Set<string>();
  for (const file of sourceFiles(SRC)) {
    // env-manifest.ts names them all in prose; reading it would be circular.
    if (file.endsWith("env-manifest.ts")) continue;
    for (const m of readFileSync(file, "utf8").matchAll(/process\.env\.([A-Z_][A-Z0-9_]*)/g)) {
      found.add(m[1]);
    }
  }
  return found;
}

describe("the environment manifest", () => {
  const referenced = referencedVars();

  it("finds the variables at all, so a broken walk cannot pass silently", () => {
    expect(referenced.size).toBeGreaterThanOrEqual(10);
  });

  it("documents every variable the code reads", () => {
    const undocumented = [...referenced].filter(v => !(v in ENV_MANIFEST) && v !== "NODE_ENV").sort();
    expect(undocumented, `read by the code but not in the manifest: ${undocumented.join(", ")}`).toEqual([]);
  });

  it("has no entries for variables nothing reads any more", () => {
    const stale = Object.keys(ENV_MANIFEST).filter(v => !referenced.has(v)).sort();
    expect(stale, `in the manifest but read nowhere: ${stale.join(", ")}`).toEqual([]);
  });

  // Long enough to be a sentence rather than a placeholder. The threshold is
  // arbitrary; the point is that neither field can be left as "TODO".
  it("says what each one enables and what breaks without it", () => {
    for (const [name, v] of Object.entries(ENV_MANIFEST)) {
      expect(v.enables.length, `${name}.enables`).toBeGreaterThan(15);
      expect(v.withoutIt.length, `${name}.withoutIt`).toBeGreaterThan(15);
      expect(v.withoutIt.toLowerCase(), name).not.toContain("todo");
    }
  });

  // A key or a secret is never required to render the site — those gate a
  // feature. Marking one required would say the whole app is down when a
  // single integration is unconfigured.
  it("marks only the data layer as required", () => {
    expect(requiredVars().sort()).toEqual([
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  });
});

describe("reporting what is missing", () => {
  it("separates a broken app from an unconfigured feature", () => {
    const { missingRequired, missingOptional } = missingFrom({
      NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      SUPABASE_SERVICE_ROLE_KEY: "service",
      ANTHROPIC_API_KEY: "sk-x",
    });
    expect(missingRequired).toEqual([]);
    expect(missingOptional).toContain("CRON_SECRET");
    expect(missingOptional).not.toContain("ANTHROPIC_API_KEY");
  });

  it("treats an empty or blank value as missing", () => {
    const { missingRequired } = missingFrom({
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "   ",
      SUPABASE_SERVICE_ROLE_KEY: undefined,
    });
    expect(missingRequired.sort()).toEqual([
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  });

  it("reports names, never values", () => {
    const { missingOptional } = missingFrom({ CRON_SECRET: "" });
    expect(JSON.stringify(missingOptional)).not.toContain("=");
    expect(missingOptional).toContain("CRON_SECRET");
  });
});
