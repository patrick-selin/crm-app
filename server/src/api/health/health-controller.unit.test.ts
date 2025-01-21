import {
  getHealthHTML,
  getHealthJSON,
} from "../../api/health/health-controller";
import { Request, Response } from "express";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Health Controller Unit Tests", () => {
  const next = vi.fn();

  it("should return HTML response", async () => {
    const req = {} as Request;
    const res = {
      send: vi.fn(),
    } as unknown as Response;

    await getHealthHTML(req, res, next);

    expect(res.send).toHaveBeenCalledWith(
      expect.stringContaining("<h1>Health Check: OK</h1>")
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors in HTML response", async () => {
    const req = {} as Request;
    const res = {
      send: vi.fn().mockImplementation(() => {
        throw new Error("Unexpected Error");
      }),
    } as unknown as Response;

    await getHealthHTML(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should return JSON response", async () => {
    const req = {} as Request;
    const res = {
      json: vi.fn(),
    } as unknown as Response;

    await getHealthJSON(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors in JSON response", async () => {
    const req = {} as Request;
    const res = {
      json: vi.fn().mockImplementation(() => {
        throw new Error("Unexpected Error");
      }),
    } as unknown as Response;

    await getHealthJSON(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
