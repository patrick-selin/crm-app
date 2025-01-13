// customer-controller.ts
import { Request, Response, NextFunction } from "express";
import * as customerService from "./customer-service";
import { CustomerIdSchema } from "../../schemas/customer-schemas";
import logger from "../../utils/logger";
import { ZodError } from "zod";
import { ValidationError, NotFoundError } from "../../utils/errors/app-errors";

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

export const listAllCustomersWithParams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: listAllCustomers");
    logger.info("Query Parameters:", req.query);

    const { search, sort, page, limit, ...queryFilters } = req.query as any;

    const filters = Object.keys(queryFilters).reduce((acc, key) => {
      acc[key] = queryFilters[key] as string;
      return acc;
    }, {} as Record<string, string>);

    const customers = await customerService.getAllCustomersWithParams({
      search: search as string,
      sort: sort as string,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 10,
      filters,
    });

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

export const getCustomerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: getCustomerOrders");
    const { id } = req.params;
    logger.info(`controller ID`);

    const orders = await customerService.getCustomerOrders(id);
    res.status(200).json(orders);
  } catch (error) {
    logger.error("Controller error in getCustomerOrders:", { error });
    next(error);
  }
};

export const getCustomerOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: getCustomerOrderDetails");
    const { id: customerId, orderId } = req.params;

    const orderDetails = await customerService.getCustomerOrderDetails(
      customerId,
      orderId
    );

    if (!orderDetails) {
      throw new NotFoundError(
        "Order not found",
        `No record found for order ID = ${orderId} under customer ID = ${customerId}`
      );
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    logger.error("Controller error in getCustomerOrderDetails:", { error });
    next(error);
  }
};

export const listCustomerOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("Controller invoked: listCustomerOrders");
    const { customerId } = req.params;

    const orders = await customerService.getOrdersByCustomerId(customerId);
    res.status(200).json(orders);
  } catch (error) {
    logger.error("Controller error in listCustomerOrders:", { error });
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
