// customer-controller.ts
import { Request, Response } from "express";
import * as customerService from "./customer-service";
import { ZodError } from "zod";

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

export const addCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newCustomer = await customerService.addCustomer(req.body);

    res.status(201).json(newCustomer);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ errors: error.errors });
      return;
    }

    res.status(500).json({ error: "Failed to add customer" });
  }
};
