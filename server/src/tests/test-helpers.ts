// Helper functions
import { db } from "../db/db";
import { JwtPayload } from "../schemas/user-and-auth-schemas";
import { faker } from "@faker-js/faker";

/**
 * Test Helpers for Mocking and Test Data
 *
 * - `createMockUser(overrides)`: Creates a mock user object with default values.
 * - `createMockRegisterUser(overrides)`: Creates a mock registration user object.
 * - `createMockPayload(overrides)`: Creates a mock JWT payload with defaults.
 * - `mockDbSelect(mockResponse)`: Mocks Drizzle ORM `db.select().from().where()` for database reads.
 * - `mockDbInsert(mockResponse)`: Mocks Drizzle ORM `db.insert().values().returning()` for writes.
 */

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
