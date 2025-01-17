import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  address: text("address"),
  city: varchar("city", { length: 50 }),
  postalCode: varchar("postal_code", { length: 6 }),
  country: varchar("country", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});
