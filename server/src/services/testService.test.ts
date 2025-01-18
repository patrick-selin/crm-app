import { describe, it, expect, vi } from "../../$node_modules/vitest/dist/index.js";
import { getAllTestItems } from "./testService";
import { MockDbClient } from "../../types/db";

describe("getAllTestItems", () => {
  it("should return a list of test items", async () => {
    const mockDb: MockDbClient = {
      select: vi.fn().mockReturnThis(),
      from: vi
        .fn()
        .mockResolvedValue([
          { id: "123", content: "Test item", important: true },
        ]),
    };
    // @ts-ignore
    const result = await getAllTestItems(mockDb);
    expect(result).toEqual([
      { id: "123", content: "Test item", important: true },
    ]);
  });
});
