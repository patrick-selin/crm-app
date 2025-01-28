// customer-controller.ts
import { Request, Response, NextFunction } from "express";
import * as customerService from "./customer-service";
import { CustomerIdSchema } from "../../schemas/customer-schemas";
import logger from "../../utils/logger";
import { ZodError } from "zod";
import {
  ValidationError,
  NotFoundError,
  BadRequestError,
} from "../../utils/errors/app-errors";
import { extractFilters, parsePagination } from "../../utils/request-helpers";

export const listCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("Controller invoked: listCustomers");

  try {
    const { search, sort, page, limit } = req.query as Record<string, string>;
    const filters = extractFilters(req.query);

    const { page: parsedPage, limit: parsedLimit } = parsePagination(
      page,
      limit
    );

    const customers = await customerService.getCustomers({
      search,
      sort,
      page: parsedPage,
      limit: parsedLimit,
      filters,
    });

    logger.info("Customers retrieved successfully", { total: customers.total });
    res.status(200).json(customers);
  } catch (error) {
    logger.error("Error occurred in listCustomers", { error });
    next(error);
  }
};

export const listCustomersWithMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info("Controller invoked: listCustomersWithMetrics");

  try {
    const { search, sort, page, limit } = req.query as Record<string, string>;
    const filters = extractFilters(req.query);

    const { page: parsedPage, limit: parsedLimit } = parsePagination(
      page,
      limit
    );

    const customers = await customerService.getCustomersWithMetrics({
      search,
      sort,
      page: parsedPage,
      limit: parsedLimit,
      filters,
    });

    logger.info("Customers with metrics retrieved successfully", {
      total: customers.total,
    });
    res.status(200).json(customers);
  } catch (error) {
    logger.error("Error occurred in listCustomersWithMetrics", { error });
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

// TEMP-------
// export const listCustomerOrders = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     logger.info("Controller invoked: listCustomerOrders");
//     const { customerId } = req.params;

//     const orders = await customerService.getOrdersByCustomerId(customerId);
//     res.status(200).json(orders);
//   } catch (error) {
//     logger.error("Controller error in listCustomerOrders:", { error });
//     next(error);
//   }
// };
// -------

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
  } catch (error: any) {
    logger.error("Controller error in deleteCustomer:", { error });

    if (error.code === "23503") {
      return next(
        new BadRequestError(
          "Cannot delete customer with existing orders.",
          `The customer ID ${req.params.id} has related orders and cannot be deleted.`
        )
      );
    }

    next(error);
  }
};
