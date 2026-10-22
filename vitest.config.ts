import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

/**
 * The helper modules under test read `projectId` / `dataset` at import time via
 * `src/sanity/env.ts`, which throws when they are missing. Load the same
 * `.env.local` Next.js uses so the modules import cleanly.
 */
for (const file of [".env.local", ".env"]) {
  const path = resolve(rootDir, file);
  if (existsSync(path)) process.loadEnvFile(path);
}

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(rootDir, "src"),
    },
  },
});