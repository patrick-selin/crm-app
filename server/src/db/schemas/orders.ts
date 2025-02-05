import {
  pgTable,
  pgEnum,
  uuid,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const orderStatusEnum = pgEnum("order_status", [
  "Pending",
  "Processing",
  "Completed",
  "Canceled",
]);

export const orders = pgTable("orders", {
  orderId: uuid("order_id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .references(() => customers.customerId, { onDelete: "cascade" })
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  orderStatus: orderStatusEnum("order_status").default("Pending").notNull(),
  orderDate: timestamp("order_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()),
});

