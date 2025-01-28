// src/api/customers/customer-controller.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as customerController from "./customer-controller";
import * as customerService from "./customer-service";
import {
  setupControllerTest,
  createMockCustomer,
  createMockCustomerWithMetrics,
} from "../../tests/test-helpers";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../../utils/errors/app-errors";
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

  describe("listCustomers", () => {
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

  describe("listCustomersWithMetrics", () => {
    it("should return a list of customers with metrics", async () => {
      const mockCustomers = [
        createMockCustomerWithMetrics(),
        createMockCustomerWithMetrics(),
      ];
      const mockResponse = {
        total: 2,
        page: 1,
        limit: 10,
        data: mockCustomers,
      };

      mockCustomerService.getCustomersWithMetrics.mockResolvedValueOnce(
        mockResponse
      );

      req.query = { page: "1", limit: "10" };

      await customerController.listCustomersWithMetrics(
        req as Request,
        res as Response,
        next
      );

      expect(mockCustomerService.getCustomersWithMetrics).toHaveBeenCalledWith({
        search: undefined,
        sort: undefined,
        page: 1,
        limit: 10,
        filters: {},
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it("should pass errors to next when the service throws an error", async () => {
      const serviceError = new Error("Service Error");

      mockCustomerService.getCustomersWithMetrics.mockRejectedValueOnce(
        serviceError
      );

      req.query = { page: "1", limit: "10" };

      await customerController.listCustomersWithMetrics(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(serviceError);
    });

    it("should pass errors to next when request query parsing fails", async () => {
      req.query = undefined;

      await customerController.listCustomersWithMetrics(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expect.any(TypeError));
    });
  });

  describe("getCustomerById", () => {
    it("should return a customer by ID", async () => {
      const mockCustomer = createMockCustomer();
      mockCustomerService.getCustomerById.mockResolvedValueOnce(mockCustomer);

      req.params = { id: mockCustomer.customerId };

      await customerController.getCustomerById(
        req as Request,
        res as Response,
        next
      );

      expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(
        mockCustomer.customerId
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });

    it("should handle NotFoundError and pass it to next", async () => {
      const error = new NotFoundError("Customer not found");
      const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      mockCustomerService.getCustomerById.mockRejectedValueOnce(error);

      req.params = { id: validIdNotExistent };

      await customerController.getCustomerById(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createCustomer", () => {
    it("should create a new customer", async () => {
      const mockCustomer = createMockCustomer();
      mockCustomerService.addCustomer.mockResolvedValueOnce(mockCustomer);

      req.body = mockCustomer;

      await customerController.createCustomer(
        req as Request,
        res as Response,
        next
      );

      expect(mockCustomerService.addCustomer).toHaveBeenCalledWith(
        mockCustomer
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });

    it("should handle validation errors and pass them to next", async () => {
      const error = new ValidationError("Invalid customer data");
      mockCustomerService.addCustomer.mockRejectedValueOnce(error);

      req.body = {};

      await customerController.createCustomer(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteCustomer", () => {
    it("should delete a customer and return 204", async () => {
      const mockCustomerId = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      mockCustomerService.deleteCustomer.mockResolvedValueOnce(true);

      req.params = { id: mockCustomerId };

      await customerController.deleteCustomer(
        req as Request,
        res as Response,
        next
      );

      expect(mockCustomerService.deleteCustomer).toHaveBeenCalledWith(
        mockCustomerId
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should handle NotFoundError", async () => {
      const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      const error = new NotFoundError(
        "Customer not found",
        `No record to delete for customer ID = ${validIdNotExistent}`
      );

      mockCustomerService.deleteCustomer.mockResolvedValueOnce(false);

      req.params = { id: validIdNotExistent };

      await customerController.deleteCustomer(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle BadRequestError for related orders", async () => {
      const error = new BadRequestError("Cannot delete customer with orders");
      mockCustomerService.deleteCustomer.mockRejectedValueOnce(error);

      req.params = { id: "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc" };

      await customerController.deleteCustomer(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
