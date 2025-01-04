import { Request, Response } from "express";
import * as customerService from "./customer-service";

export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
