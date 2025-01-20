import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@heroicons/react"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup-tests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        format: "es",
      },
    },
    sourcemap: true,
  },
});
