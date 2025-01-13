// customer-service.ts
import { db } from "../../db/db";
import { sql, eq, and } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { orderItems } from "../../db/schemas/order-items";
import logger from "../../utils/logger";

import { z } from "zod";
import {
  CustomerSchema,
  CustomerSummarySchema,
  CreateCustomerSchema,
  CustomerOrderSchema,
  UpdateCustomerSchema,
} from "../../schemas/customer-schemas";
import { OrderSchema, OrderItemSchema } from "../../schemas/order-schemas";
import { ConflictError, BadRequestError } from "../../utils/errors/app-errors";

const isPostgresUniqueViolation = (error: any): boolean => {
  return error;
};

export const getAllCustomersWithParams = async ({
  search,
  sort,
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

  const offset = (page - 1) * limit;

  const baseConditions = [];

  // Search
  if (search) {
    baseConditions.push(
      sql`${customers.firstName} ILIKE ${`%${search}%`} OR ${
        customers.lastName
      } ILIKE ${`%${search}%`} OR ${
        customers.email
      } ILIKE ${`%${search}%`} OR ${customers.city} ILIKE ${`%${search}%`}`
    );
  }

  // Filters

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      baseConditions.push(sql`${sql.identifier(key)} = ${value}`);
    }
  }

  const conditions = baseConditions.length ? and(...baseConditions) : undefined;

  // Base query
  const query = db
    .select()
    .from(customers)
    .where(conditions)
    .offset(offset)
    .limit(limit);

  // Sorting
  if (sort) {
    const sortMapping: Record<string, string> = {
      firstName: "first_name",
      lastName: "last_name",
      totalSpent: "total_spent",
    };

    const [column, direction] = sort.split(":");
    const dbColumn = sortMapping[column] || column;

    query.orderBy(
      sql`${sql.identifier(dbColumn)} ${sql.raw(direction.toUpperCase())}`
    );
  }

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
  sort,
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

  const offset = (page - 1) * limit;

  const baseConditions = [];

  // Search
  if (search) {
    baseConditions.push(
      sql`${customers.firstName} ILIKE ${`%${search}%`} OR ${
        customers.lastName
      } ILIKE ${`%${search}%`} OR ${customers.email} ILIKE ${`%${search}%`}`
    );
  }

  // Filters
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      baseConditions.push(sql`${sql.identifier(key)} = ${value}`);
    }
  }

  const conditions = baseConditions.length ? and(...baseConditions) : undefined;

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
    .limit(limit);

  // Sorting
  if (sort) {
    const [column, direction] = sort.split(":");

    if (column === "totalSpent") {
      query.orderBy(
        sql`COALESCE(CAST(SUM(${orders.totalAmount}) AS DECIMAL), 0) ${sql.raw(
          direction.toUpperCase()
        )}`
      );
    } else {
      query.orderBy(
        sql`${sql.identifier(column)} ${sql.raw(direction.toUpperCase())}`
      );
    }
  }

  const rawResults = await query;

  // Convert totalSpent to a number
  const processedResults = rawResults.map((result) => ({
    ...result,
    lastOrderDate: result.lastOrderDate ? result.lastOrderDate : "No orders",
    totalSpent: Number(result.totalSpent),
  }));

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
    data: z.array(CustomerSummarySchema).parse(processedResults),
  };
};

// export const getCustomersWithMetrics = async () => {
//   logger.info("Service: Fetching customers with metrics...");
//   try {
//     const rawResults = await db
//       .select({
//         customerId: customers.customerId,
//         firstName: customers.firstName,
//         lastName: customers.lastName,
//         email: customers.email,
//         lastOrderDate: sql`COALESCE(MAX(${orders.orderDate}), NULL)`.as(
//           "lastOrderDate"
//         ),
//         numOfOrders:
//           sql`COALESCE(CAST(COUNT(${orders.orderId}) AS INTEGER), 0)`.as(
//             "numOfOrders"
//           ),
//         totalSpent:
//           sql`COALESCE(CAST(SUM(${orders.totalAmount}) AS DECIMAL), 0)`.as(
//             "totalSpent"
//           ),
//       })
//       .from(customers)
//       .leftJoin(orders, eq(customers.customerId, orders.customerId))
//       .groupBy(customers.customerId)
//       .orderBy(sql`MAX(${orders.orderDate}) DESC`);

//     const processedResults = rawResults.map((result) => {
//       const processed = {
//         ...result,
//         lastOrderDate: result.lastOrderDate
//           ? result.lastOrderDate
//           : "No orders",
//         numOfOrders: result.numOfOrders,
//         totalSpent: Number(result.totalSpent),
//       };
//       return processed;
//     });

//     return z.array(CustomerSummarySchema).parse(processedResults);
//   } catch (error) {
//     logger.error("Service error in getCustomersWithMetrics:", { error });
//     throw error;
//   }
// };

export const getCustomerById = async (id: string) => {
  logger.info(`Service: Fetching customer by ID = ${id}`);

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.customerId, id));

  return customer ? CustomerSchema.parse(customer) : null;
};

export const getOrdersByCustomerId = async (customerId: string) => {
  logger.info(`Service: Fetching orders for customer ID = ${customerId}`);
  return await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customerId));
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
