// db.ts

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas/test-schema";
import { config } from "../config/config";
import { DbClient } from "../../types/db";
import fs from "fs";

const databaseUrl =
  config.NODE_ENV === "test" ? config.TEST_DATABASE_URL : config.DATABASE_URL;

console.log("DB.ts tiedosto ==========");
console.log(`NODE env :: ${config.NODE_ENV}`);
console.log(`databaseUrl on :: ${databaseUrl}`);
console.log("+++++++++");
// const queryClient = postgres(databaseUrl);
const sslConfig =
  config.NODE_ENV === "production"
    ? {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync("/usr/src/app/global-bundle.pem").toString(),
        },
      }
    : {};

const queryClient = postgres(databaseUrl, sslConfig);
console.log(`Connecting to database: ${config.POSTGRES_DB}`);

export const db: DbClient = drizzle(queryClient, { schema, logger: true });
