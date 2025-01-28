import { describe, it, expect, vi, afterEach } from "vitest";
import * as authService from "./auth-service";
import { db } from "../../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ValidationError } from "../../utils/errors/app-errors";
import { faker } from "@faker-js/faker";

import {
  createMockUser,
  createMockRegisterUser,
  createMockPayload,
  mockDbSelect,
  mockDbInsert,
} from "../../tests/test-helpers";
import { RegisterSchema } from "../../schemas/user-and-auth-schemas";

vi.mock("../../db/db");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");

/**
 * Test Helpers for Mocking and Test Data
 *
 * - `createMockUser(overrides)`: Creates a mock user object with default values.
 * - `createMockRegisterUser(overrides)`: Creates a mock registration user object.
 * - `createMockPayload(overrides)`: Creates a mock JWT payload with defaults.
 * - `mockDbSelect(mockResponse)`: Mocks Drizzle ORM `db.select().from().where()` for database reads.
 * - `mockDbInsert(mockResponse)`: Mocks Drizzle ORM `db.insert().values().returning()` for writes.
 */

describe("Auth Service Unit Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user and return user details", async () => {
      const mockRegisterUser = createMockRegisterUser();
      vi.spyOn(bcrypt, "hashSync").mockReturnValue("mockedPasswordHash");

      const mockUser = {
        ...mockRegisterUser,
        userId: faker.string.uuid(),
        passwordHash: "mockedPasswordHash",
      };
      mockDbInsert([mockUser]);

      const result = await authService.registerUser(mockRegisterUser);

      const validatedResult = RegisterSchema.omit({ password: true }).parse({
        username: result.username,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
        phone: result.phone,
        address: result.address,
        city: result.city,
        postalCode: result.postalCode,
        country: result.country,
      });

      expect(validatedResult).toEqual({
        username: mockRegisterUser.username,
        email: mockRegisterUser.email,
        firstName: mockRegisterUser.firstName,
        lastName: mockRegisterUser.lastName,
        role: mockRegisterUser.role,
        phone: mockRegisterUser.phone,
        address: mockRegisterUser.address,
        city: mockRegisterUser.city,
        postalCode: mockRegisterUser.postalCode,
        country: mockRegisterUser.country,
      });

      expect(bcrypt.hashSync).toHaveBeenCalledWith(
        mockRegisterUser.password,
        expect.any(Number)
      );
      expect(db.insert).toHaveBeenCalled();
    });

    it("should throw an error if no password is provided", async () => {
      await expect(
        authService.registerUser({
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: "",
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: "user",
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode("#####"),
          country: faker.location.country(),
        })
      ).rejects.toThrowError("Password is required");
    });
  });

  describe("login", () => {
    it("should log in a user and return tokens", async () => {
      const mockUser = createMockUser();

      mockDbSelect([mockUser]);
      vi.spyOn(bcrypt, "compare").mockImplementation(async () => true);
      vi.spyOn(jwt, "sign").mockReturnValue(
        faker.string.alphanumeric(30) as never
      );

      const result = await authService.login({
        email: mockUser.email,
        password: faker.internet.password(),
      });

      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          id: mockUser.userId,
          email: mockUser.email,
          firstName: mockUser.firstName,
          role: mockUser.role,
        },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        expect.any(String),
        mockUser.passwordHash
      );
      expect(jwt.sign).toHaveBeenCalledTimes(2);
    });

    it("should throw ValidationError for incorrect password", async () => {
      const mockUser = createMockUser();

      mockDbSelect([mockUser]);
      vi.spyOn(bcrypt, "compare").mockImplementation(async () => false);

      await expect(
        authService.login({
          email: mockUser.email,
          password: "wrongpassword",
        })
      ).rejects.toThrow(ValidationError);

      expect(bcrypt.compare).toHaveBeenCalled();
    });

    it("should throw ValidationError if user not found", async () => {
      mockDbSelect([]);

      await expect(
        authService.login({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
      ).rejects.toThrow(ValidationError);

      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("getAuthDetails", () => {
    it("should return user details for a valid user ID", async () => {
      const mockUser = createMockUser();

      mockDbSelect([mockUser]);

      const result = await authService.getAuthDetails(mockUser.userId);

      expect(result).toEqual({
        id: mockUser.userId,
        firstName: mockUser.firstName,
        email: mockUser.email,
        role: mockUser.role,
      });

      expect(db.select).toHaveBeenCalled();
    });

    it("should throw ValidationError if user is not found", async () => {
      mockDbSelect([]);

      await expect(
        authService.getAuthDetails("nonexistent-id")
      ).rejects.toThrow(ValidationError);

      expect(db.select).toHaveBeenCalled();
    });
  });
});

describe("refreshToken", () => {
  it("should return a new access token for a valid refresh token", async () => {
    const mockPayload = createMockPayload();
    const mockUser = createMockUser({ userId: mockPayload.id });

    vi.spyOn(jwt, "verify").mockImplementation(() => mockPayload);
    mockDbSelect([mockUser]);

    const mockAccessToken = faker.string.alphanumeric(30);
    vi.spyOn(jwt, "sign").mockImplementation(() => mockAccessToken);

    const result = await authService.refreshToken(
      faker.string.alphanumeric(30)
    );

    expect(result).toEqual({ accessToken: mockAccessToken });
    expect(jwt.verify).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );

    expect(db.select).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.userId,
        firstName: mockUser.firstName,
        role: mockUser.role,
      },
      expect.any(String),
      { expiresIn: "15m" }
    );
  });

  it("should throw ValidationError for an invalid refresh token", async () => {
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      throw new jwt.JsonWebTokenError("JWT verification failed");
    });

    await expect(authService.refreshToken("invalid-token")).rejects.toThrow(
      new ValidationError("Invalid Refresh Token", "JWT verification failed")
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });

  it("should throw ValidationError if user is not found", async () => {
    const mockPayload = createMockPayload();

    vi.spyOn(jwt, "verify").mockImplementation(() => mockPayload);

    mockDbSelect([]);

    await expect(
      authService.refreshToken(faker.string.alphanumeric(30))
    ).rejects.toThrow(
      new ValidationError("User Not Found", "No user exists with the given ID")
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
    expect(db.select).toHaveBeenCalled();
  });
});
