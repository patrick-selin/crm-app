// healt integration

import request from "supertest";
import app from "../../server";

describe("Health API Integration", () => {
  it("should return HTML for root /api/v1/health", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Health Check: OK");
  });

  it("should return JSON for /api/v1/health/json", async () => {
    const res = await request(app).get("/api/v1/health/json");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "OK" });
  });
});
