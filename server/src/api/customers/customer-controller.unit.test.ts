// src/api/customers/customer-controller.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as customerController from "./customer-controller";
import * as customerService from "./customer-service";
import {
  setupControllerTest,
  createMockCustomer,
} from "../../tests/test-helpers";
import { NotFoundError } from "../../utils/errors/app-errors";
import { Request, Response } from "express";

vi.mock("./customer-service");
const mockCustomerService = vi.mocked(customerService);

describe("Customer Controller Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    ({ req, res, next } = setupControllerTest());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.only("listCustomers", () => {
    it("should return a list of customers", async () => {
      const mockCustomers = [
        createMockCustomer(),
        createMockCustomer(),
        createMockCustomer(),
      ];
      mockCustomerService.getCustomers.mockResolvedValueOnce({
        total: 3,
        page: 1,
        limit: 10,
        data: mockCustomers,
      });

      req.query = { page: "1", limit: "10" };

      await customerController.listCustomers(
        req as Request,
        res as Response,
        next
      );

      expect(mockCustomerService.getCustomers).toHaveBeenCalledWith({
        search: undefined,
        sort: undefined,
        page: 1,
        limit: 10,
        filters: {},
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 3,
        page: 1,
        limit: 10,
        data: mockCustomers,
      });
    });

    it("should pass errors to next", async () => {
      const error = new Error("Service Error");
      req.query = { page: "1", limit: "10" };

      mockCustomerService.getCustomers.mockRejectedValueOnce(error);

      await customerController.listCustomers(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
