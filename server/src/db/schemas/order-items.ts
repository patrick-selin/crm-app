import { pgTable, uuid, decimal, integer } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable("order_items", {
  orderItemId: uuid("order_item_id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.orderId)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.productId)
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});
