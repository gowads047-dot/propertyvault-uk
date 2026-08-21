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
  },
});
