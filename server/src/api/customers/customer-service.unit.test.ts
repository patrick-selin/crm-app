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
  mockDbDelete,
  mockDbUpdate,
  createMockOrder,
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
      const mockCustomers = [createMockCustomer(), createMockCustomer()];
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

  describe("getCustomerOrders", () => {
    it("should fetch and return customer orders", async () => {
      const mockOrders = [createMockOrder(), createMockOrder()];
      mockDbSelect(mockOrders);

      const result = await customerService.getCustomerOrders(
        faker.string.uuid()
      );

      expect(result).toEqual(
        mockOrders.map((order) => ({
          orderId: order.orderId,
          totalAmount: parseFloat(order.totalAmount),
          orderStatus: order.orderStatus,
          orderDate: order.orderDate,
        }))
      );
      expect(db.select).toHaveBeenCalled();
    });

    it("should return an empty array if no orders are found", async () => {
      mockDbSelect([]);

      const result = await customerService.getCustomerOrders(
        faker.string.uuid()
      );

      expect(result).toEqual([]);
      expect(db.select).toHaveBeenCalled();
    });
  });

  // remember to debug
  //   describe("getCustomerOrderDetails", () => {
  //     it("should fetch order details with items", async () => {
  //       const mockOrder = createMockOrder();
  //       console.log("MOCK ORDER ::" + JSON.stringify(mockOrder));
  //       const mockOrderItems = [
  //         createMockOrderItem(mockOrder.orderId),
  //         createMockOrderItem(mockOrder.orderId),
  //       ];
  //       console.log("MOCK ORDERITEMS ::" + JSON.stringify(mockOrderItems));

  //       mockDbSelect([mockOrder]);
  //       mockDbSelect(mockOrderItems);
  //       const result = await customerService.getCustomerOrderDetails(
  //         mockOrder.customerId,
  //         mockOrder.orderId
  //       );
  //       console.log("RESULT ::" + result);
  //       console.log("object");

  //       expect(result).toEqual({
  //         order: {
  //           ...mockOrder,
  //           totalAmount: parseFloat(mockOrder.totalAmount.toString()),
  //           paymentStatus: mockOrder.paymentStatus,
  //           orderDate: mockOrder.orderDate,
  //           createdAt: mockOrder.createdAt,
  //           updatedAt: mockOrder.updatedAt,
  //         },
  //         items: mockOrderItems.map((item) => ({
  //           ...item,
  //           price: parseFloat(item.price.toString()),
  //         })),
  //       });

  //       expect(db.select).toHaveBeenCalledTimes(2);
  //     });

  //     it("should return null if order is not found", async () => {
  //       mockDbSelect([]);

  //       const result = await customerService.getCustomerOrderDetails(
  //         faker.string.uuid(),
  //         faker.string.uuid()
  //       );

  //       expect(result).toBeNull();
  //       expect(db.select).toHaveBeenCalledTimes(1);
  //     });

  //     it("should return order details without items if no items exist", async () => {
  //       const mockOrder = createMockOrder();

  //       mockDbSelect([mockOrder]);
  //       mockDbSelect([]);
  //       const result = await customerService.getCustomerOrderDetails(
  //         mockOrder.customerId,
  //         mockOrder.orderId
  //       );

  //       expect(result).toEqual({
  //         order: {
  //           ...mockOrder,
  //           totalAmount: parseFloat(mockOrder.totalAmount.toString()),
  //           paymentStatus: mockOrder.paymentStatus,
  //           orderDate: mockOrder.orderDate,
  //           createdAt: mockOrder.createdAt,
  //           updatedAt: mockOrder.updatedAt,
  //         },
  //         items: [],
  //       });

  //       expect(db.select).toHaveBeenCalledTimes(2);
  //     });
  //   });

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

      await expect(
        customerService.addCustomer(invalidCustomer)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("updateCustomer", () => {
    it("should update and return the customer", async () => {
      const mockCustomer = createMockCustomer();
      mockDbUpdate([mockCustomer]);

      const result = await customerService.updateCustomer(
        mockCustomer.customerId,
        { firstName: "Updated" }
      );

      expect(result).toEqual(mockCustomer);
      expect(db.update).toHaveBeenCalled();
    });

    it("should throw NotFoundError if customer to update does not exist", async () => {
      mockDbUpdate([]);
      const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      await expect(
        customerService.updateCustomer(validIdNotExistent, { firstName: "Updated" })
      ).rejects.toThrow(NotFoundError);
    
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("deleteCustomer", () => {
    it("should delete a customer and return true", async () => {
      mockDbDelete([{ affectedRows: 1 }]);
      const result = await customerService.deleteCustomer(faker.string.uuid());

      expect(result).toBe(true);
      expect(db.delete).toHaveBeenCalled();
    });

    it("should return false if customer does not exist", async () => {
      mockDbDelete([]);
      const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      
      await expect(customerService.deleteCustomer(validIdNotExistent)).rejects.toThrow(NotFoundError);

  expect(db.delete).toHaveBeenCalled();
    });
  });
});
