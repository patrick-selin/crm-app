import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, decimal, integer, timestamp, jsonb,  } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  productId: uuid("product_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 50 }).notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  category: varchar("category", { length: 50 }),
  description: varchar("description", { length: 500 }).default(""),
  brand: varchar("brand", { length: 50 }).default(""),
  tags: jsonb("tags").default([]),
  dimensions: jsonb("dimensions").default({ width: 0, height: 0, depth: 0 }),
  warrantyInfo: varchar("warranty_info", { length: 255 }).default("No warranty"),
  shippingInfo: varchar("shipping_info", { length: 255 }).default("Ships in 5 days"),
  availabilityStatus: varchar("availability_status", { length: 50 }).default("In Stock"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default(sql`0.0`),
  reviews: jsonb("reviews").default([]),
  returnPolicy: varchar("return_policy", { length: 255 }).default("30-day return policy"),
  productImages: jsonb("product_images").default([]),
  barcode: varchar("barcode", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});