import {
  pgTable,
  uuid,
  decimal,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const orders = pgTable("orders", {
  orderId: uuid("order_id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .references(() => customers.customerId)
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 })
    .default("Pending")
    .notNull(),
  orderDate: timestamp("order_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
