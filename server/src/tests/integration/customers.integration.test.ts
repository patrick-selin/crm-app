// src/tests/integration/customers.integration.test.ts
import request from "supertest";
import app from "../../server";
import { db } from "../../db/db";
import { customers } from "../../db/schemas/customers";
import {
  CustomerSchema,
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from "../../schemas/customer-schemas";
import { createMockCustomer, createTestUser } from "../test-helpers";
import { eq } from "drizzle-orm";

describe("Customer API Integration Tests", () => {
  const api = request(app);
  let accessToken: string;
  let testCustomer: any;

  beforeAll(async () => {
    const { accessToken: token } = await createTestUser();
    accessToken = token;

    const mockCustomer = createMockCustomer();
    CreateCustomerSchema.parse(mockCustomer);

    const [dbCustomer] = await db
      .insert(customers)
      .values(mockCustomer)
      .returning();
    testCustomer = dbCustomer;
  });

  afterAll(async () => {
    await db
      .delete(customers)
      .where(eq(customers.customerId, testCustomer.customerId));
  });

  describe("GET /api/v1/customers", () => {
    it("should return a list of customers", async () => {
      const response = await api
        .get("/api/v1/customers")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("total");
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      response.body.data.forEach((customer: any) =>
        CustomerSchema.parse(customer)
      );
    });

    it("should return 401 for missing authorization token", async () => {
      const response = await api.get("/api/v1/customers");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "UNAUTHORIZED");
    });
  });

  describe("GET /api/v1/customers/summary", () => {
    it("should return a summary of customers", async () => {
      const response = await api
        .get("/api/v1/customers/summary")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("total");
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it("should return 401 for missing authorization token", async () => {
      const response = await api.get("/api/v1/customers/summary");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "UNAUTHORIZED");
    });
  });

  describe("POST /api/v1/customers", () => {
    it("should create a new customer", async () => {
      const newCustomer = createMockCustomer();
      CreateCustomerSchema.parse(newCustomer);

      const response = await api
        .post("/api/v1/customers")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(newCustomer);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
      });

      CustomerSchema.parse(response.body);
    });

    it("should return 409 ConflictError if email already exists", async () => {
      const response = await api
        .post("/api/v1/customers")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(testCustomer);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error", "CONFLICT");
    });

    it("should return 400 BadRequestError for invalid data", async () => {
      const invalidCustomer = { firstName: "", email: "invalid-email" };
      const response = await api
        .post("/api/v1/customers")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidCustomer);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "VALIDATION_ERROR");
    });
  });
});
