import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest ran on defaults until now, which meant the "@/" path alias from
 * tsconfig was not resolved. Every existing test worked around that with
 * relative imports, and anything importing app code the way the app does
 * ("@/lib/site") failed to collect.
 *
 * Mirroring the tsconfig alias here lets tests import modules by the same
 * specifier the source uses.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    /**
     * Measured, not guessed.
     *
     * makan-schema.test.ts boots a real Postgres in WASM (PGlite) in beforeAll.
     * Cold start on this machine is 1,342ms idle — and 20,072ms with twelve
     * other vitest runs competing for eight cores. Vitest's default hookTimeout
     * is 10,000ms, so on a busy machine that hook is killed halfway through
     * building the schema.
     *
     * That is the intermittent failure that went unexplained for a while: it
     * only ever appeared under load, and never once in roughly sixty-five runs
     * on an idle machine. Raising testTimeout, which I tried first, could not
     * have helped — the budget being exceeded belongs to the hook.
     *
     * 60s is ~3x the worst measured start, which leaves room for a slower
     * machine or a cold filesystem while still failing fast on a real hang.
     */
    hookTimeout: 60_000,

    /**
     * Also measured.
     *
     * Five suites walk the whole source tree and read every .tsx file —
     * api-calls, form-labels, form-submission, internal-links and
     * vetting-claims. Two of those are recent, and together they pushed the
     * suite past the default 5,000ms testTimeout: run on their own the three
     * slowest finish in 3.5s, but with the other suites competing for cores
     * the worst measured run was 9,408ms, and four unrelated tests failed as
     * timeouts while passing individually.
     *
     * A shared read cache would be the better fix, except vitest isolates
     * module state per test file by default, so each suite would still read
     * every file once. Turning isolation off to share one cache trades a real
     * correctness guarantee for I/O, which is the wrong way round.
     *
     * 30s is ~3x the worst measured run, on the same reasoning as the hook
     * timeout above: room for a slower machine or a cold filesystem, while
     * still failing fast on a genuine hang.
     */
    testTimeout: 30_000,
  },
});
