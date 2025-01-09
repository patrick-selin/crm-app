// customer-service.ts
import { db } from "../../db/db";
import { sql, eq } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import logger from "../../utils/logger";

import { z } from "zod";
import {
  CustomerSchema,
  CustomerSummarySchema,
  CreateCustomerSchema,
} from "../../schemas/customer-schemas";
import { ConflictError } from "../../utils/errors/app-errors";

const isPostgresUniqueViolation = (error: any): boolean => {
  return error;
};

export const getAllCustomers = async () => {
  logger.info("Service: Fetching all customers...");
  const results = await db.select().from(customers);
  const validated = z.array(CustomerSchema).parse(results);

  return validated;
};

export const getCustomersWithMetrics = async () => {
  logger.info("Service: Fetching customers with metrics...");
  try {
    const rawResults = await db
      .select({
        customerId: customers.customerId,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        city: customers.city,
        postalCode: customers.postalCode,
        country: customers.country,
        createdAt: customers.createdAt,
        updatedAt: customers.updatedAt,
        lastOrderDate: sql`MAX(${orders.orderDate})`.as("lastOrderDate"),
        numOfOrders: sql`COUNT(${orders.orderId})`.as("numOfOrders"),
        totalSpent: sql`SUM(${orders.totalAmount})`.as("totalSpent"),
      })
      .from(customers)
      .leftJoin(orders, eq(customers.customerId, orders.customerId))
      .groupBy(customers.customerId)
      .orderBy(sql`MAX(${orders.orderDate}) DESC`);

    const processedResults = rawResults.map((result) => {
      const processed = {
        ...result,
        lastOrderDate:
          typeof result.lastOrderDate === "string"
            ? new Date(result.lastOrderDate).toISOString()
            : "N/A",
        numOfOrders:
          typeof result.numOfOrders === "string"
            ? parseInt(result.numOfOrders, 10)
            : 0,
        totalSpent:
          typeof result.totalSpent === "string"
            ? parseFloat(result.totalSpent)
            : 0.0,
      };

      return processed;
    });

    const parsedResults = z
      .array(CustomerSummarySchema)
      .parse(processedResults);

    return parsedResults;
  } catch (error) {
    logger.error("Service error in getCustomersWithMetrics:", { error });
    throw error;
  }
};

export const getCustomerById = async (id: string) => {
  logger.info(`Service: Fetching customer by ID = ${id}`);

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.customerId, id));

  return customer ? CustomerSchema.parse(customer) : null;
};

export const addCustomer = async (customerData: unknown) => {
  try {
    logger.info("Service: Creating a new customer...");
    const validatedCustomer = CreateCustomerSchema.parse(customerData);

    const [newCustomer] = await db
      .insert(customers)
      .values(validatedCustomer)
      .returning();

    logger.info("New customer created:", newCustomer);
    return newCustomer;
  } catch (error) {
    const e = error as Error;
    if (isPostgresUniqueViolation(error)) {
      throw new ConflictError(
        "A customer with this email already exists",
        `Unique constraint violation: ${e.message}`,
        e.stack
      );
    }
    throw error;
  }
};

export const deleteCustomer = async (id: string) => {
  logger.info(`Service: Deleting customer ID = ${id}`);
  const result = await db
    .delete(customers)
    .where(eq(customers.customerId, id))
    .returning();

  return result.length > 0;
};

// /customers/:id
// /customers/:id/orders
