import { config } from "./src/config/config";
import { defineConfig } from "drizzle-kit";
import fs from "fs";

const databaseUrl =
  config.NODE_ENV === "test" ? config.TEST_DATABASE_URL : config.DATABASE_URL;

console.log(`node enc: ${config.NODE_ENV}`);

if (!databaseUrl) {
  throw new Error("Database URL is not defined");
}

const sslConfig =
  config.NODE_ENV === "production"
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./global-bundle.pem").toString(),
      }
    : undefined;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas",
  out: "./migrations",
  dbCredentials: {
    url: databaseUrl,
    ssl: sslConfig,
  },
  verbose: true,
  strict: true,
});
