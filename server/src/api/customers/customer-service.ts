// customer-service.ts
import { db } from "../../db/db";
import { sql, eq } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { orderItems } from "../../db/schemas/order-items";
import { products } from "../../db/schemas/products";
import logger from "../../utils/logger";

import { z } from "zod";
import {
  CustomerSchema,
  CustomerSummarySchema,
  CreateCustomerSchema,
  CustomerOrderSchema,
  UpdateCustomerSchema
} from "../../schemas/customer-schemas";
import { ConflictError, BadRequestError } from "../../utils/errors/app-errors";

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

export const getOrdersByCustomerId = async (customerId: string) => {
  logger.info(`Service: Fetching orders for customer ID = ${customerId}`);
  return await db.select().from(orders).where(eq(orders.customerId, customerId));
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
      orderDate:
        typeof order.orderDate === "string"
          ? new Date(order.orderDate).toISOString()
          : order.orderDate,
    };
  });

  const validatedOrders = processedOrders.map((order) =>
    CustomerOrderSchema.parse(order)
  );

  return validatedOrders;
};

//
export const getOrderDetails = async (orderId: string) => {
  logger.info(`Service: Fetching details for order ID = ${orderId}`);

  // Fetch the order
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.orderId, orderId))
    .limit(1);
    logger.info(`LOG____order :: ${JSON.stringify(order)}`);
  if (!order.length) {
    return null;
  }

  const items = await db
    .select({
      orderItemId: orderItems.orderItemId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.productId))
    .where(eq(orderItems.orderId, orderId));

  // Transform the data into the desired structure
  return {
    ...order[0], // Include order-level fields
    items: items.map((item) => ({
      orderItemId: item.orderItemId,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: parseFloat(item.price), // Convert decimal to number
    })),
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
