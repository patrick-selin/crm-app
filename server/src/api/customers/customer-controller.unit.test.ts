// src/api/customers/customer-controller.unit.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as customerService from "./customer-service";
import {
  setupControllerTest,
} from "../../tests/test-helpers";
import { Request, Response } from "express";

vi.mock("./customer-service");
const mockCustomerService = vi.mocked(customerService);

describe("Customer Controller Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    ({ req, res, next } = setupControllerTest());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe.only("listCustomers", () => {
// todo
});
