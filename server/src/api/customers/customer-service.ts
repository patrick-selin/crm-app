// customer-service.ts
import { db } from "../../db/db";
import { sql, eq, and, SQL } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { orderItems } from "../../db/schemas/order-items";
import {
  parseSorting,
  calculateOffset,
  createSearchAndFilterConditions,
} from "../../utils/query-helpers";
import logger from "../../utils/logger";

import { z, ZodError } from "zod";
import {
  CustomerSchema,
  CustomerSummarySchema,
  CreateCustomerSchema,
  CustomerOrderSchema,
  UpdateCustomerSchema,
} from "../../schemas/customer-schemas";
import { OrderSchema, OrderItemSchema } from "../../schemas/order-schemas";
import { ConflictError, BadRequestError, NotFoundError } from "../../utils/errors/app-errors";
import { PgColumn } from "drizzle-orm/pg-core";

const isPostgresUniqueViolation = (error: any): boolean => {
  return error;
};

//
export const getCustomers = async ({
  search,
  sort = "createdAt:desc",
  page,
  limit,
  filters,
}: {
  search?: string;
  sort?: string;
  page: number;
  limit: number;
  filters?: Record<string, string>;
}) => {
  logger.info("Service: Fetching all customers with params...");

  const offset = calculateOffset(page, limit);

  const conditions = createSearchAndFilterConditions(search, filters, [
    customers.firstName,
    customers.lastName,
    customers.email,
    customers.city,
  ]);

  // Sorting
  const sortMapping: Record<string, PgColumn> = {
    firstName: customers.firstName,
    lastName: customers.lastName,
    email: customers.email,
    city: customers.city,
    country: customers.country,
    createdAt: customers.createdAt,
  };

  const orderBy = parseSorting(sort, sortMapping);

  // Base query
  const query = db
    .select()
    .from(customers)
    .where(conditions)
    .offset(offset)
    .limit(limit)
    .orderBy(orderBy);

  const results = await query;

  // Fetch total count
  const totalResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customers)
    .where(conditions);

  const total = totalResult[0]?.count ?? 0;

  return {
    total,
    page,
    limit,
    data: z.array(CustomerSchema).parse(results),
  };
};

export const getCustomersWithMetrics = async ({
  search,
  sort = "lastOrderDate:desc",
  page,
  limit,
  filters,
}: {
  search?: string;
  sort?: string;
  page: number;
  limit: number;
  filters?: Record<string, string>;
}) => {
  logger.info("Service: Fetching customers with metrics and params...");

  const offset = calculateOffset(page, limit);

  const conditions = createSearchAndFilterConditions(search, filters, [
    customers.firstName,
    customers.lastName,
    customers.email,
  ]);

  // Sorting
  const sortMapping: Record<string, PgColumn | SQL<any>> = {
    firstName: customers.firstName,
    lastName: customers.lastName,
    email: customers.email,
    lastOrderDate: sql`COALESCE(MAX(${orders.orderDate}), NULL)`,
    numOfOrders: sql`CAST(COALESCE(COUNT(${orders.orderId}), 0) AS INTEGER)`,
    totalSpent: sql`CAST(COALESCE(SUM(${orders.totalAmount}), 0) AS DECIMAL)`,
  };

  const orderBy = parseSorting(sort, sortMapping);

  // Base query
  const query = db
    .select({
      customerId: customers.customerId,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      lastOrderDate: sql`COALESCE(MAX(${orders.orderDate}), NULL)`.as(
        "lastOrderDate"
      ),
      numOfOrders:
        sql`COALESCE(CAST(COUNT(${orders.orderId}) AS INTEGER), 0)`.as(
          "numOfOrders"
        ),
      totalSpent:
        sql`COALESCE(CAST(SUM(${orders.totalAmount}) AS DECIMAL), 0)`.as(
          "totalSpent"
        ),
    })
    .from(customers)
    .leftJoin(orders, eq(customers.customerId, orders.customerId))
    .groupBy(customers.customerId)
    .where(conditions)
    .offset(offset)
    .limit(limit)
    .orderBy(orderBy);

  const rawResults = await query;

  const processedResults = rawResults.map((result) => ({
    ...result,
    lastOrderDate: result.lastOrderDate ? result.lastOrderDate : "No orders",
    totalSpent: Number(result.totalSpent),
  }));

  const totalResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customers)
    .where(conditions);

  const total = totalResult[0]?.count ?? 0;

  return {
    total,
    page,
    limit,
    data: z.array(CustomerSummarySchema).parse(processedResults),
  };
};

export const getCustomerById = async (id: string) => {
  logger.info(`Service: Fetching customer by ID = ${id}`);

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.customerId, id));

  if (!customer) {
    throw new NotFoundError(`Customer with ID ${id} not found`);
  }

  return customer ? CustomerSchema.parse(customer) : null;
};

export const getCustomerOrders = async (customerId: string) => {
  logger.info(`Service: Fetching orders for customerId = ${customerId}`);
  const rawOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId));

  const processedOrders = rawOrders.map((order) => {
    return {
      orderId: order.orderId,
      totalAmount: parseFloat(order.totalAmount),
      paymentStatus: order.paymentStatus,
      orderDate: order.orderDate,
    };
  });

  const validatedOrders = processedOrders.map((order) =>
    CustomerOrderSchema.parse(order)
  );

  return validatedOrders;
};

export const getCustomerOrderDetails = async (
  customerId: string,
  orderId: string
) => {
  logger.info(
    `Service: Fetching details for order ID = ${orderId}, customer ID = ${customerId}`
  );
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderId, orderId), eq(orders.customerId, customerId)));

    console.log("DEBUG: Retrieved Order:", order); 

  if (!order) {
    return null;
  }

  const processedOrder = {
    ...order,
    totalAmount: parseFloat(order.totalAmount),
    paymentStatus: order.paymentStatus,
    orderDate: order.orderDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };

  const rawItems = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const processedItems = rawItems.map((item) => ({
    ...item,
    price: parseFloat(item.price),
  }));

  return {
    order: OrderSchema.parse(processedOrder),
    items: processedItems.map((item) => OrderItemSchema.parse(item)),
  };
};

// TEMP-------
// export const getOrdersByCustomerId = async (customerId: string) => {
//   logger.info(`Service: Fetching orders for customer ID = ${customerId}`);
//   return await db
//     .select()
//     .from(orders)
//     .where(eq(orders.customerId, customerId));
// };
// -------

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
    if (error instanceof ZodError) {
      throw new BadRequestError(
        "Invalid customer data",
        error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ")
      );
    }

    if (isPostgresUniqueViolation(error)) {
      throw new ConflictError(
        "A customer with this email already exists",
        `Unique constraint violation: ${(error as Error).message}`,
        (error as Error).stack
      );
    }

    throw error; // Rethrow other errors
  }
};

export const updateCustomer = async (id: string, data: unknown) => {
  logger.info(`Service: Updating customer ID = ${id}`);
  const validatedData = UpdateCustomerSchema.partial().parse(data);

  if (Object.keys(validatedData).length === 0) {
    throw new BadRequestError(
      "No update data provided",
      "The request body is empty or contains no valid fields"
    );
  }

  const [updated] = await db
    .update(customers)
    .set({ ...validatedData })
    .where(eq(customers.customerId, id))
    .returning();

  return updated ? CustomerSchema.parse(updated) : null;
};

export const deleteCustomer = async (id: string) => {
  logger.info(`Service: Deleting customer ID = ${id}`);
  const result = await db
    .delete(customers)
    .where(eq(customers.customerId, id))
    .returning();

  return result.length > 0;
};
