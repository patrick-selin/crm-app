import { describe, it, expect, vi, afterEach } from "vitest";
import * as customerService from "./customer-service";
import { db } from "../../db/db";
import {
  createMockCustomer,
  createMockCustomerWithMetrics,
  mockDbSelect,
  mockDbPaginatedSelect,
  mockDbJoinSelect,
  mockDbInsert,
} from "../../tests/test-helpers";
import { NotFoundError, BadRequestError } from "../../utils/errors/app-errors";
import { faker } from "@faker-js/faker";


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

  describe("getCustomersWithMetrics", () => {
    it("should fetch customers with metrics", async () => {
      const mockCustomers = [
        createMockCustomerWithMetrics(),
        createMockCustomerWithMetrics(),
      ];
      mockDbJoinSelect(mockCustomers);

      const result = await customerService.getCustomersWithMetrics({
        search: "",
        sort: "lastOrderDate:desc",
        page: 1,
        limit: 10,
        filters: {},
      });

      expect(result.data).toEqual(mockCustomers);
      expect(db.select).toHaveBeenCalled();
    });

    it("should handle no customers with metrics found", async () => {
        mockDbJoinSelect([]);

      const result = await customerService.getCustomersWithMetrics({
        search: "",
        sort: "lastOrderDate:desc",
        page: 1,
        limit: 10,
        filters: {},
      });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getCustomerById", () => {
    it("should fetch a customer by ID", async () => {
      const mockCustomer = createMockCustomer();
      mockDbSelect([mockCustomer]);

      const result = await customerService.getCustomerById(
        mockCustomer.customerId
      );

      expect(result).toEqual(mockCustomer);
      expect(db.select).toHaveBeenCalled();
    });

    it("should throw NotFoundError if customer is not found", async () => {
      mockDbSelect([]);

      await expect(
        customerService.getCustomerById(faker.string.uuid())
      ).rejects.toThrow(NotFoundError);

      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("addCustomer", () => {
    it("should create and return a new customer", async () => {
      const mockCustomer = createMockCustomer();
      mockDbInsert([mockCustomer]);

      const result = await customerService.addCustomer(mockCustomer);

      expect(result).toEqual(mockCustomer);
      expect(db.insert).toHaveBeenCalled();
    });

    it("should throw BadRequestError for invalid customer data", async () => {
      const invalidCustomer = { email: "invalidEmail" };

      await expect(customerService.addCustomer(invalidCustomer)).rejects.toThrow(
        BadRequestError
      );
    });
  });

});
