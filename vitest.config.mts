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
  },
});
