#!/usr/bin/env node
/**
 * What is configured here, and what that costs.
 *
 * Prints names and status only — never a value — so the output can be pasted
 * into a message without leaking a key.
 *
 * Reads the manifest by parsing it rather than importing it, so this runs with
 * plain node and needs no build step.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

// The manifest is a plain object literal; pull out each entry's fields.
const src = readFileSync(join(root, "src", "lib", "env-manifest.ts"), "utf8");
const body = src.slice(src.indexOf("ENV_MANIFEST"));

const manifest = [];
const entry = /^\s{2}([A-Z_][A-Z0-9_]*):\s*\{([\s\S]*?)^\s{2}\},/gm;
for (const m of body.matchAll(entry)) {
  const fields = m[2];
  manifest.push({
    name: m[1],
    required: /required:\s*true/.test(fields),
    withoutIt: (fields.match(/withoutIt:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "").replace(/\\"/g, '"'),
  });
}

if (manifest.length === 0) {
  console.error("Could not read the manifest. Has src/lib/env-manifest.ts changed shape?");
  process.exit(2);
}

// .env.local counts as configured for a local check, without printing values.
const envFile = join(root, ".env.local");
const fileVars = new Set();
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const name = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*\S/.exec(line)?.[1];
    if (name) fileVars.add(name);
  }
}

const isSet = n => Boolean(process.env[n]?.trim()) || fileVars.has(n);

const width = Math.max(...manifest.map(v => v.name.length));
const missing = [];

console.log(`\nEnvironment check — ${existsSync(envFile) ? ".env.local + process env" : "process env only"}\n`);

for (const group of ["required", "optional"]) {
  const rows = manifest.filter(v => (group === "required" ? v.required : !v.required));
  console.log(group === "required" ? "REQUIRED" : "\nFEATURES");
  for (const v of rows) {
    const ok = isSet(v.name);
    if (!ok) missing.push(v);
    console.log(`  ${ok ? "set    " : "MISSING"}  ${v.name.padEnd(width)}${ok ? "" : `  — ${v.withoutIt}`}`);
  }
}

const brokenApp = missing.filter(v => v.required);
console.log("");
if (brokenApp.length > 0) {
  console.log(`${brokenApp.length} required variable(s) missing — the application will not work.`);
  process.exit(1);
}
console.log(
  missing.length === 0
    ? "Everything in the manifest is configured."
    : `All required variables are set. ${missing.length} feature(s) are switched off, listed above.`,
);
