// customer-controller.ts
import { Request, Response, NextFunction } from "express";
import * as customerService from "./customer-service";
import logger from "../../utils/logger";
import { ZodError } from "zod";
import { ValidationError } from "../../utils/errors/app-errors";

export const getAllCustomers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: all");
    const customers = await customerService.getAllCustomers();
    logger.info("Customers to send, all:", customers);
    res.status(200).json(customers);
  } catch (error) {
    logger.error("Controller ERROR");
    next(error);
  }
};

export const getCustomersWithMetrics = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: all with metrics");
    const customers = await customerService.getCustomersWithMetrics();
    logger.info("Customers to send, with metrics:", customers);
    res.status(200).json(customers);
  } catch (error) {
    logger.error("Controller ERROR");
    next(error);
  }
};

export const addCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newCustomer = await customerService.addCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        new ValidationError("Invalid customer data", JSON.stringify(error.issues))
      );
    }

    next(error);
  }
};
