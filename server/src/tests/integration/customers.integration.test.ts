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
      const invalidCustomer = {
        firstName: "",
        email: "invalid-email@.testi.fi",
      };
      const response = await api
        .post("/api/v1/customers")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidCustomer);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "VALIDATION_ERROR");
    });
  });

  describe("GET /api/v1/customers/:id", () => {
    it("should return customer details", async () => {
      const response = await api
        .get(`/api/v1/customers/${testCustomer.customerId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        customerId: testCustomer.customerId,
        firstName: testCustomer.firstName,
        lastName: testCustomer.lastName,
        email: testCustomer.email,
      });

      CustomerSchema.parse(response.body);
    });

    it("should return 404 NotFoundError if customer is not found", async () => {
      const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      const response = await api
        .get(`/api/v1/customers/${validIdNotExistent}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "NOT_FOUND");
    });
  });

  describe("PUT /api/v1/customers/:id", () => {
    it("should update an existing customer", async () => {
      const updateData = { firstName: "Updated Name" };
      UpdateCustomerSchema.parse(updateData);

      const response = await api
        .put(`/api/v1/customers/${testCustomer.customerId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe(updateData.firstName);
    });

    it("should return 400 BadRequestError for invalid update data", async () => {
      const response = await api
        .put(`/api/v1/customers/${testCustomer.customerId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "VALIDATION_ERROR");
    });

    it("should return 404 NotFoundError if customer is not found", async () => {
      const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
      const response = await api
        .put(`/api/v1/customers/${validIdNotExistent}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ firstName: "Random" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "NOT_FOUND");
    });
  });

  describe("DELETE /api/v1/customers/:id", () => {
    it("should delete a customer", async () => {
      const newCustomer = createMockCustomer();
      const [dbCustomer] = await db
        .insert(customers)
        .values(newCustomer)
        .returning();

      const response = await api
        .delete(`/api/v1/customers/${dbCustomer.customerId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(204);
    });

    it("should return 404 NotFoundError if customer is not found", async () => {
        const validIdNotExistent = "9c92d8a1-2c13-4f4a-9b3f-14dbac8b4fdc";
        const response = await api
        .delete(`/api/v1/customers/${validIdNotExistent}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "NOT_FOUND");
    });
  });
});
