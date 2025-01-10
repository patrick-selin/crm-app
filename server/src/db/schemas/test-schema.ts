import { pgTable, varchar, boolean } from "drizzle-orm/pg-core";

export const testItems = pgTable("test_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  content: varchar("content", { length: 255 }),
  important: boolean("important"),
});
