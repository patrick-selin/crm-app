import "@testing-library/jest-dom";

// Ensure that the DOM is cleaned up after each test
import { cleanup } from "@testing-library/react";

import { afterEach } from "vitest";

afterEach(() => {
  console.log("setp file 777777");
  cleanup();
});
