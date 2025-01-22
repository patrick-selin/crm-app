// src/tests/integration/auth-controller.integration.test.ts
import request from "supertest";
import app from "../../server";
import { db } from "../../db/db";
import { users } from "../../db/schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  UserSchema,
  RegisterSchema,
  LoginSchema,
  JwtPayloadSchema,
  RefreshTokenSchema,
} from "../../schemas/user-and-auth-schemas";
import {
  createMockUser,
  createMockRegisterUser,
  createMockPayload,
} from "../test-helpers";

describe("Auth API Integration Tests", () => {
  const api = request(app);

  const mockRegisterUser = createMockRegisterUser();
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    RegisterSchema.parse(mockRegisterUser);

    await db.delete(users).where(eq(users.role, "user"));
    await db.insert(users).values({
      ...mockRegisterUser,
      passwordHash: await bcrypt.hash(mockRegisterUser.password, 10),
    });
  });

  afterAll(async () => {
    // Clean up the test database
    //   await db.delete(users);
    //   await db.delete(users).where(eq(users.email, mockRegisterUser.email));
  });

  describe.skip("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = createMockRegisterUser();
      RegisterSchema.parse(newUser);

      const response = await api.post("/api/v1/auth/register").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        message: "User registered successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
        },
      });

      expect(response.body.user).toHaveProperty("id");

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, newUser.email));

      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        postalCode: newUser.postalCode,
        country: newUser.country,
      });

      UserSchema.parse(dbUser);

      expect(dbUser.passwordHash).not.toEqual(newUser.password);
      expect(dbUser.passwordHash).toBeDefined();
    });

    it("should return 400 for invalid registration data", async () => {
      const invalidUser = { email: "invalidemail", password: "short" };

      const validationResult = RegisterSchema.safeParse(invalidUser);
      expect(validationResult.success).toBe(false);

      const response = await api
        .post("/api/v1/auth/register")
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "VALIDATION_ERROR");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should log in successfully and return tokens", async () => {
      const response = await api.post("/api/v1/auth/login").send({
        email: mockRegisterUser.email,
        password: mockRegisterUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;

      // Validate JWT payload
      const decodedPayload = JwtPayloadSchema.parse(
        jwt.verify(accessToken, process.env.JWT_SECRET!)
      );
      expect(decodedPayload).toMatchObject({
        id: decodedPayload.id,
        role: decodedPayload.role,
      });
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await api.post("/api/v1/auth/login").send({
        email: mockRegisterUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "VALIDATION_ERROR",
        message: "Invalid Credentials",
      });
    });
  });


});
