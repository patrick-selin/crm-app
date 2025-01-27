// src/api/auth/auth-controller.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  registerUser,
  loginUser,
  getAuthDetails,
  refreshToken,
} from "./auth-controller";
import * as authService from "./auth-service";
import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import {
  ValidationError,
  UnauthorizedError,
} from "../../utils/errors/app-errors";
import { setupControllerTest } from "../../tests/test-helpers";

vi.mock("./auth-service");

describe("Auth Controller Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    ({ req, res, next } = setupControllerTest());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser Controller", () => {
    it("should register a user and return 201", async () => {
      const mockUser = {
        userId: faker.string.uuid(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        passwordHash: "hashedpassword",
        role: "user",
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode("#####"),
        country: faker.location.country(),
        createdAt: new Date(),
        updatedAt: null,
      };

      vi.spyOn(authService, "registerUser").mockResolvedValue(mockUser);

      req.body = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await registerUser(req as Request, res as Response, next);

      expect(authService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: {
          id: mockUser.userId,
          username: mockUser.username,
          email: mockUser.email,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("loginUser Controller", () => {
    it("should log in a user and return tokens", async () => {
      const mockLoginResponse = {
        accessToken: faker.string.alphanumeric(30),
        refreshToken: faker.string.alphanumeric(30),
        user: {
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          email: faker.internet.email(),
          role: "user",
        },
      };

      vi.spyOn(authService, "login").mockResolvedValue(mockLoginResponse);

      req.body = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await loginUser(req as Request, res as Response, next);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLoginResponse);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getAuthDetails Controller", () => {
    it("should return authenticated user details", async () => {
      const mockUserDetails = {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        role: "user",
      };

      vi.spyOn(authService, "getAuthDetails").mockResolvedValue(
        mockUserDetails
      );

      req.user = {
        id: mockUserDetails.id,
        role: "user",
      };

      await getAuthDetails(req as Request, res as Response, next);

      expect(authService.getAuthDetails).toHaveBeenCalledWith(
        mockUserDetails.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserDetails);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", async () => {
      req.user = undefined;

      await getAuthDetails(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe("refreshToken Controller", () => {
    it("should refresh tokens for a valid request", async () => {
      const mockRefreshResponse = {
        accessToken: faker.string.alphanumeric(30),
        refreshToken: faker.string.alphanumeric(30),
      };

      vi.spyOn(authService, "refreshToken").mockResolvedValue(
        mockRefreshResponse
      );

      req.body = {
        refreshToken: faker.string.alphanumeric(30),
      };

      await refreshToken(req as Request, res as Response, next);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        req.body.refreshToken
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRefreshResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle refresh token errors", async () => {
      vi.spyOn(authService, "refreshToken").mockRejectedValue(
        new ValidationError("Invalid Refresh Token")
      );

      req.body = {
        refreshToken: faker.string.alphanumeric(30),
      };

      await refreshToken(req as Request, res as Response, next);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        req.body.refreshToken
      );
      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });
});
