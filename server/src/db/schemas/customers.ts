import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  customerId: uuid("customer_id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 15 }),
  address: text("address"),
  city: varchar("city", { length: 50 }),
  postalCode: varchar("postal_code", { length: 5 }),
  country: varchar("country", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
