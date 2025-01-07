// customer-controller.ts
import { Request, Response } from "express";
import * as customerService from "./customer-service";

export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    console.log("Controller invoked. all");
    const customers = await customerService.getAllCustomers();
    console.log("Customers to send, all:", customers);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

export const getCustomersWithMetrics = async (_req: Request, res: Response) => {
  try {
    console.log("Controller invoked. all with metrics");
    const customers = await customerService.getCustomersWithMetrics();
    console.log("Customers to send, with metrics:", customers);
    res.status(200).json(customers);
  } catch (error) {
    console.log("Controller ERROR");
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
