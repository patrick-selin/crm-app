// vitest.integretion.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: "./src/tests/setup-tests.ts",
    include: ["src/**/*.integration.test.ts"],
  },
});
