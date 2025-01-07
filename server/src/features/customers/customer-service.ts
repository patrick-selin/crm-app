// customer-servics.ts
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { db } from "../../db/db";
import { sql, eq } from "drizzle-orm";
import { z } from "zod";
import { AddCustomerSchema, CustomerSummarySchema } from "../../../src/schemas/customer-schemas";

export const getAllCustomers = async () => {
  console.log("Fetching all customers...");
  return await db.select().from(customers);
};

export const getCustomersWithMetrics = async () => {
  console.log("Fetching customers with metrics...");

  try {
    const rawResults = await db
      .select({
        customerId: customers.customerId,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        phone: customers.phone,
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

    console.log("Raw Results:", rawResults);

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

      console.log("Processed result:", processed);
      return processed;
    });

    console.log("Processed Results:", processedResults);

    // Validate with Zod
    const parsedResults = z
      .array(CustomerSummarySchema)
      .parse(processedResults);
    console.log("Parsed Results:", parsedResults);

    return parsedResults;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getCustomersWithMetrics:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
    throw error;
  }
};


export const addCustomer = async (customerData: unknown) => {
  const validatedCustomer = AddCustomerSchema.parse(customerData);

  const [newCustomer] = await db
    .insert(customers)
    .values(validatedCustomer)
    .returning();

  return newCustomer;
}
// /customers/:id
// /customers/:id/orders
