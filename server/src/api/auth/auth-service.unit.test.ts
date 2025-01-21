import { describe, it, expect, vi, afterEach } from "vitest";
import * as authService from "./auth-service";
import { db } from "../../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ValidationError } from "../../utils/errors/app-errors";
import { faker } from "@faker-js/faker";

vi.mock("../../db/db");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");

describe("Auth Service Unit Tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ok
  describe("registerUser", () => {
    it("should register a new user and return user details", async () => {
      const mockUser = {
        userId: faker.string.uuid(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: "user",
        passwordHash: faker.string.alphanumeric(60),
        createdAt: new Date(),
        updatedAt: null,
      };

      vi.spyOn(bcrypt, "hashSync").mockReturnValue(mockUser.passwordHash);

      vi.spyOn(db, "insert").mockImplementation(
        () =>
          ({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([mockUser]),
            }),
          } as any)
      );

      const result = await authService.registerUser({
        username: mockUser.username,
        email: mockUser.email,
        password: faker.internet.password(),
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: faker.helpers.arrayElement(["user", "admin"]),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode("#####"),
        country: faker.location.country(),
      });

      expect(result).toEqual(
        expect.objectContaining({
          userId: mockUser.userId,
          username: mockUser.username,
          email: mockUser.email,
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
      const mockUser = {
        userId: faker.string.uuid(),
        email: faker.internet.email(),
        passwordHash: faker.string.alphanumeric(60),
        role: "user",
      };

      // Mock db.select().from().where()
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockUser]),
        }),
      } as any);

      vi.spyOn(bcrypt, "compare").mockResolvedValue(true);
      vi.spyOn(jwt, "sign").mockReturnValue(faker.string.alphanumeric(30) as never);

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
      const mockUser = {
        userId: faker.string.uuid(),
        email: faker.internet.email(),
        passwordHash: faker.string.alphanumeric(60),
        role: "user",
      };

      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockUser]),
        }),
      } as any);

      vi.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await expect(
        authService.login({
          email: mockUser.email,
          password: "wrongpassword",
        })
      ).rejects.toThrow(ValidationError);

      expect(bcrypt.compare).toHaveBeenCalled();
    });

    it("should throw ValidationError if user not found", async () => {
      vi.spyOn(db, "select").mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      await expect(
        authService.login({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
      ).rejects.toThrow(ValidationError);

      expect(db.select).toHaveBeenCalled();
    });
  });

 
  
});
