// vitest.unit.config.ts
import { defineConfig } from "vitest/config";

// MUISTA
// npm run test:unit run tama file
// npm run test run vite.config.ts
// lisaa integration testeille oma kun tarve

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: "./src/tests/setup-tests.ts",
    // exclude: ["src/tests/integration/*.test.ts"],
  },
});
