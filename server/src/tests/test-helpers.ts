// Helper functions
import { db } from "../db/db";
import { JwtPayload } from "../schemas/user-and-auth-schemas";
import { faker } from "@faker-js/faker";
import { Request, Response, NextFunction } from "express";

/**
 * Test Helpers for Mocking and Test Data
 *
 * - `createMockUser(overrides)`: Creates a mock user object with default values.
 * - `createMockRegisterUser(overrides)`: Creates a mock registration user object.
 * - `createMockPayload(overrides)`: Creates a mock JWT payload with defaults.
 * - `mockDbSelect(mockResponse)`: Mocks Drizzle ORM `db.select().from().where()` for database reads.
 * - `mockDbInsert(mockResponse)`: Mocks Drizzle ORM `db.insert().values().returning()` for writes.
 * - `etupControllerTest`: Mocks Express request, response, and next objects for testing controllers.
 */

export const setupControllerTest = () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    send: vi.fn(),
  };
  const next: ReturnType<typeof vi.fn> = vi.fn();

  return { req, res, next };
};

export const createMockUser = (overrides = {}) => ({
  userId: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  passwordHash: faker.string.alphanumeric(60),
  role: "user",
  ...overrides,
});

export const createMockRegisterUser = (overrides = {}) => ({
  //   userId: faker.string.uuid(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: faker.helpers.arrayElement(["admin", "user"]),
  password: faker.internet.password(),
  //   passwordHash: faker.string.alphanumeric(60),
  phone: `040${faker.string.numeric(7)}`,
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  postalCode: faker.location.zipCode("#####"),
  country: faker.location.country(),
  //   createdAt: new Date(),
  //   updatedAt: null,
  ...overrides,
});

export const createMockCustomer = (overrides = {}) => ({
  customerId: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: `040${faker.string.numeric(7)}`,
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  postalCode: faker.location.zipCode("#####"),
  country: faker.location.country(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const createMockCustomerWithMetrics = (overrides = {}) => ({
  customerId: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  lastOrderDate: faker.helpers.arrayElement([
    faker.date.recent(),
  ]),
  numOfOrders: faker.helpers.arrayElement([0, faker.number.int({ min: 1, max: 10 })]),
  totalSpent: faker.helpers.arrayElement([0, faker.number.float({ min: 10, max: 5000 })]),
  ...overrides,
})

export const createMockPayload = (overrides = {}): JwtPayload => ({
  id: faker.string.uuid(),
  role: "user",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15-min
  ...overrides,
});

export const mockDbSelect = (mockResponse: any[]) => {
  vi.spyOn(db, "select").mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(mockResponse),
    }),
  } as any);
};

export const mockDbInsert = (mockResponse: any[]) => {
  vi.spyOn(db, "insert").mockImplementation(
    () =>
      ({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue(mockResponse),
        }),
      } as any)
  );
};
