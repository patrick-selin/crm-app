import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Mock } from "vitest";
import * as schema from "../src/api/test-route/test-schema";

export type DbClient = PostgresJsDatabase<typeof schema>;

export type MockDbClient = {
  select: Mock;
  from: Mock;
  insert?: Mock;
  update?: Mock;
};
