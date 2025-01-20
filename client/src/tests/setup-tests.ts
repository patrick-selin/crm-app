// Import Jest DOM matchers to extend Vitest's `expect`
// Provides matchers like `toBeInTheDocument`, `toHaveClass`, etc.
import "@testing-library/jest-dom";

// Ensure that the DOM is cleaned up after each test
import { cleanup } from "@testing-library/react";

import { afterEach } from "vitest";

// Clean up after each test to prevent test pollution
afterEach(() => {
  console.log("setp file 777777");
  cleanup();
});
