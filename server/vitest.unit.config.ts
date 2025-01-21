// vitest.unit.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./src/tests/setup-tests.ts",
    include: ["src/**/*.test.ts"],
    exclude: ["src/tests/integration/*.test.ts"],
  },
});
