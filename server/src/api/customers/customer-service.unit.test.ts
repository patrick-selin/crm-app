import { describe, it, expect, vi, afterEach } from "vitest";
import * as customerService from "./customer-service";
import { db } from "../../db/db";
import {
  createMockCustomer,
  mockDbPaginatedSelect,
} from "../../tests/test-helpers";


vi.mock("../../db/db");

describe("Customer Service Unit Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getCustomers", () => {
    it("should fetch and return customers", async () => {
      const mockCustomers = [
        createMockCustomer(),
        createMockCustomer(),
      ];
      mockDbPaginatedSelect(mockCustomers);

      const result = await customerService.getCustomers({
        search: "",
        sort: "createdAt:desc",
        page: 1,
        limit: 10,
        filters: {},
      });

      expect(result.data).toEqual(mockCustomers);
      expect(db.select).toHaveBeenCalled();
    });

    it("should return an empty list if no customers are found", async () => {
      mockDbPaginatedSelect([]);

      const result = await customerService.getCustomers({
        search: "",
        sort: "createdAt:desc",
        page: 1,
        limit: 10,
        filters: {},
      });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
