import { describe, it, expect, vi, afterEach } from "vitest";
import * as authService from "./auth-service";
import { db } from "../../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ValidationError } from "../../utils/errors/app-errors";
import { faker } from "@faker-js/faker";
import { JwtPayload } from "../../schemas/user-and-auth-schemas";

vi.mock("../../db/db");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");

// Helper functions

const createMockUser = (overrides = {}) => ({
  userId: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  passwordHash: faker.string.alphanumeric(60),
  role: "user",
  ...overrides,
});

const createMockRegisterUser = (overrides = {}) => ({
  userId: faker.string.uuid(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: "user",
  passwordHash: faker.string.alphanumeric(60),
  createdAt: new Date(),
  updatedAt: null,
  ...overrides,
});


const createMockPayload = (overrides = {}): JwtPayload => ({
  id: faker.string.uuid(),
  role: "user",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15-min
  ...overrides,
});

const mockDbSelect = (mockResponse: any[]) => {
  vi.spyOn(db, "select").mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(mockResponse),
    }),
  } as any);
};

const mockDbInsert = (mockResponse: any[]) => {
  vi.spyOn(db, "insert").mockImplementation(
    () =>
      ({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue(mockResponse),
        }),
      } as any)
  );
};

describe("Auth Service Unit Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user and return user details", async () => {
      const mockRegisterUser = createMockRegisterUser();
      vi.spyOn(bcrypt, "hashSync").mockReturnValue(mockRegisterUser.passwordHash);

      mockDbInsert([mockRegisterUser]);

      const result = await authService.registerUser({
        username: mockRegisterUser.username,
        email: mockRegisterUser.email,
        password: faker.internet.password(),
        firstName: mockRegisterUser.firstName,
        lastName: mockRegisterUser.lastName,
        role: faker.helpers.arrayElement(["user", "admin"]),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode("#####"),
        country: faker.location.country(),
      });

      expect(result).toEqual(
        expect.objectContaining({
          userId: mockRegisterUser.userId,
          username: mockRegisterUser.username,
          email: mockRegisterUser.email,
        })
      );

      expect(bcrypt.hashSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number)
      );
      expect(db.insert).toHaveBeenCalled();
    });

    it("should throw ValidationError if email or username already exists", async () => {
      vi.spyOn(db, "insert").mockImplementation(() => {
        throw new Error("duplicate key value violates unique constraint");
      });

      await expect(
        authService.registerUser({
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: "user",
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode("#####"),
          country: faker.location.country(),
        })
      ).rejects.toThrowError(
        new ValidationError(
          "An account with this email address or username already exists",
          "Duplicate email or username"
        )
      );
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
