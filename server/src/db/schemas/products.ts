import { pgTable, uuid, varchar, decimal, integer, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  productId: uuid("product_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  category: varchar("category", { length: 50 }),
  productImage: varchar("product_image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
