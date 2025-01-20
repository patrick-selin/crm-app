import { getHealthHTML, getHealthJSON } from "../health/health-controller";
import { Request, Response } from "express";

describe("Health Controller", () => {
  it("should return HTML response", async () => {
    const req = {} as Request;
    const res = {
      send: vi.fn(),
    } as unknown as Response;

    await getHealthHTML(req, res);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("<h1>Health Check: OK</h1>"));
  });

  it("should return JSON response", async () => {
    const req = {} as Request;
    const res = {
      json: vi.fn(),
    } as unknown as Response;

    await getHealthJSON(req, res);
    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
  });
});
