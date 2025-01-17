// src/config.ts
import dotenv from "dotenv";
import path from "path";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${ENV}`),
});

interface Config {
  NODE_ENV: string;
  SERVER_PORT: number;
  SERVER_HOST: string;
  DATABASE_URL: string;
  TEST_DATABASE_URL: string;
  POSTGRES_DB: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_USER: string;
  POSTGRES_HOST: string;
  JWT_SECRET: string;
  REFRESH_SECRET: string;
}

const server_port = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3334;

const server_host = process.env.SERVER_HOST
  ? process.env.SERVER_HOST
  : "127.0.0.1";

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  SERVER_PORT: server_port,
  SERVER_HOST: server_host,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  JWT_SECRET: process.env.JWT_SECRET || "default-jwt-secret",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "default-refresh-secret",
};
