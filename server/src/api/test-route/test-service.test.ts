import { describe, it, expect, vi } from "vitest";
import { getAllTestItems } from "../../api/test-route/test-service";
import { MockDbClient } from "../../../types/db";

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
