import { expect, test } from "vitest";
import { sum } from "./sumTwoNumbers";

test("sums 5 and 8 to equal 13", () => {
  expect(sum(5, 8)).toBe(13);
});
