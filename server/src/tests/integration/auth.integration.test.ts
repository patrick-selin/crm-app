// src/tests/integration/auth-controller.integration.test.ts
import request from "supertest";
import app from "../../server";
import { db } from "../../db/db";
import { users } from "../../db/schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";

import {
  UserSchema,
  RegisterSchema,
  LoginSchema,
  JwtPayloadSchema,
  RefreshTokenSchema,
  AuthUserScema,
} from "../../schemas/user-and-auth-schemas";
import { createMockRegisterUser } from "../test-helpers";

describe("Auth API Integration Tests", () => {
  const api = request(app);

  const mockRegisterUser = createMockRegisterUser();
  let accessToken: string;
  let refreshToken: string;

  const JWT_SECRET = config.JWT_SECRET!;
  const REFRESH_SECRET = config.REFRESH_SECRET!;

  beforeAll(async () => {
    RegisterSchema.parse(mockRegisterUser);

    await db.delete(users);
    await db.insert(users).values({
      ...mockRegisterUser,
      passwordHash: await bcrypt.hash(mockRegisterUser.password, 10),
    });

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, mockRegisterUser.email));

    if (!dbUser) throw new Error("Failed to fetch test user from database");

    const payload = {
      id: dbUser.userId,
      role: dbUser.role,
    };
    accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "14d" });
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, mockRegisterUser.email));
  });

  describe("POST /api/v1/auth/register", () => {
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

      const response = await api
        .post("/api/v1/auth/register")
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "VALIDATION_ERROR");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should log in successfully and return tokens", async () => {
      const validLoginData = {
        email: mockRegisterUser.email,
        password: mockRegisterUser.password,
      };
      LoginSchema.parse(validLoginData);

      const response = await api
        .post("/api/v1/auth/login")
        .send(validLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;

      const decodedPayload = JwtPayloadSchema.parse(
        jwt.verify(accessToken, JWT_SECRET!)
      );
      expect(decodedPayload).toMatchObject({
        id: decodedPayload.id,
        role: decodedPayload.role,
      });
    });

    it("should return 400 for invalid credentials", async () => {
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

  describe("GET /api/v1/auth/me", () => {
    it("should return authenticated user details", async () => {
      const response = await api
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);

      const validatedUser = AuthUserScema.parse(response.body);

      expect(validatedUser).toMatchObject({
        id: expect.any(String),
        firstName: mockRegisterUser.firstName,
        email: mockRegisterUser.email,
        role: mockRegisterUser.role,
      });
    });

    it("should return 401 for missing or invalid token", async () => {
      const noTokenResponse = await api.get("/api/v1/auth/me");

      expect(noTokenResponse.status).toBe(401);
      expect(noTokenResponse.body).toMatchObject({
        error: "UNAUTHORIZED",
        message: "Missing Authorization Header",
      });

      // Test invalid token
      const invalidTokenResponse = await api
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalidtoken");

      expect(invalidTokenResponse.status).toBe(401);
      expect(invalidTokenResponse.body).toMatchObject({
        error: "UNAUTHORIZED",
        message: "Invalid Token",
      });
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should return a new access token with a valid refresh token", async () => {
      const response = await api
        .post("/api/v1/auth/refresh")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ refreshToken });

      console.log("**** !!!!!!! ****");
      console.log(accessToken);

      console.log("**** !!!!!!! ****");
      console.log(response.status);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      const decodedPayload = JwtPayloadSchema.parse(
        jwt.verify(response.body.accessToken, JWT_SECRET!)
      );
      expect(decodedPayload).toMatchObject({
        id: decodedPayload.id,
        role: decodedPayload.role,
      });
    });

    it("should return 400 for invalid refresh token", async () => {
        RefreshTokenSchema.parse({ refreshToken });
      const response = await api
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "invalid" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "VALIDATION_ERROR",
        message: "Invalid Refresh Token",
      });
    });
  });
});
