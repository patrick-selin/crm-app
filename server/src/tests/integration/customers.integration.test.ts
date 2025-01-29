// src/tests/integration/customers.integration.test.ts
import request from "supertest";
import app from "../../server";
import { db } from "../../db/db";
import { customers } from "../../db/schemas/customers";
import {
  CustomerSchema,
  CreateCustomerSchema,
} from "../../schemas/customer-schemas";
import { createMockCustomer, createTestUser } from "../test-helpers";

describe.only("Customer API Integration Tests", () => {
  const api = request(app);

  let accessToken: string;
  let testCustomers: any;

  beforeAll(async () => {
    const { accessToken: token } = await createTestUser();
    accessToken = token;
  
    const mockCustomers = [createMockCustomer(), createMockCustomer(), createMockCustomer()];
    mockCustomers.forEach((customer) => CreateCustomerSchema.parse(customer));
  
    const insertedCustomers = await db.insert(customers).values(mockCustomers).returning();
    testCustomers = insertedCustomers;
  });

  afterAll(async () => {
    await db.delete(customers);
  });
  
  describe("GET /api/v1/customers", () => {
    it("should return a list of customers", async () => {
      const response = await api
        .get("/api/v1/customers")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("total");
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);

      if (response.body.data.length > 0) {
        CustomerSchema.parse(response.body.data[0]);
      }
    });
  });

});
