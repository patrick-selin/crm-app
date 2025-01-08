import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/server";
import { testItems as testItemsDb } from "../../db/schemas/schema";
import { db } from "../../db/db";

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

describe("POST /api/v1/test", () => {
  it("should create a new test item in the test database", async () => {
    const response = await request(app)
      .post("/api/v1/test")
      .send({ content: "Test item content 44", important: true })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.content).toBe("Test item content 44");
    expect(response.body.important).toBe(true);

    const items = await db.select().from(testItemsDb);
    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: "Test item content 44",
          important: true,
        }),
      ])
    );
  });
});
