// customer-controller.ts
import { Request, Response, NextFunction } from "express";
import * as customerService from "./customer-service";
import { CustomerIdSchema } from "../../schemas/customer-schemas";
import logger from "../../utils/logger";
import { ZodError } from "zod";
import {
  ValidationError,
  // BadRequestError,
  NotFoundError,
} from "../../utils/errors/app-errors";

export const listAllCustomers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: listAllCustomers");
    const customers = await customerService.getAllCustomers();
    logger.info("Customers retrieved:", customers);
    res.status(200).json(customers);
  } catch (error) {
    logger.error("Controller error in listAllCustomers:", { error });
    next(error);
  }
};

export const listCustomersWithMetrics = async (
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

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: getCustomerById");
    const parsed = CustomerIdSchema.parse(req.params);
    const { id } = parsed; 

    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      throw new NotFoundError(
        "Customer not found",
        `No record found for customer ID = ${id}`
      );
    }

    res.status(200).json(customer);
  } catch (error) {
    logger.error("Controller error in getCustomerById:", { error });
    next(error);
  }
};


export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info("Controller invoked: createCustomer");
    const newCustomer = await customerService.addCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(
        new ValidationError(
          "Invalid customer data",
          "createCustomer Zod validation failed",
          error.issues
        )
      );
    }
    logger.error("Controller error in createCustomer:", { error });
    next(error);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: updateCustomer");
    const { id } = req.params;
    const updatedCustomer = await customerService.updateCustomer(id, req.body);

    if (!updatedCustomer) {
      throw new NotFoundError("Customer not found", `ID = ${id}`);
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    logger.error("Controller error in updateCustomer:", { error });
    next(error);
  }
};


export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: deleteCustomer");
    const { id } = req.params;
    const success = await customerService.deleteCustomer(id);

    if (!success) {
      throw new NotFoundError(
        "Customer not found",
        `No record to delete for customer ID = ${id}`
      );
    }
    res.status(204).send();
  } catch (error) {
    logger.error("Controller error in deleteCustomer:", { error });
    next(error);
  }
};
