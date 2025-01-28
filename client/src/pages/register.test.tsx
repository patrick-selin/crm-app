// temp test file to get tests script running
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import Register from "./register";

describe("Register Component", () => {
  // testing for ci to run tests
  it("renders the Register page text", () => {
    render(<Register />);
    expect(screen.getByText("Register page")).toBeInTheDocument();
  });
});
