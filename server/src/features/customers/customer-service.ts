// customer-servics.ts
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { db } from "../../db/db";
import { sql, eq } from "drizzle-orm";
// import { z } from "zod";
// import { CustomerSummarySchema } from "../../../../shared/schemas/customer-schemas";

export const getAllCustomers = async () => {
  return await db.select().from(customers);
};

export const getCustomersWithMetrics = async () => {
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
      lastOrderDate: sql`MAX(${orders.orderDate})`.as("lastOrderDate"),
      numOfOrders: sql`COUNT(${orders.orderId})`.as("numOfOrders"),
      totalSpent: sql`SUM(${orders.totalAmount})`.as("totalSpent"),
    })
    .from(customers)
    .leftJoin(orders, eq(customers.customerId, orders.customerId))
    .groupBy(customers.customerId)
    .orderBy(sql`MAX(${orders.orderDate}) DESC`);

    // const processedResults = rawResults.map((result) => ({
    //   ...result,
    //   lastOrderDate: result.lastOrderDate ? new Date(result.lastOrderDate) : null, // Convert to Date
    //   numOfOrders: Number(result.numOfOrders), // Convert to Number
    //   totalSpent: parseFloat(result.totalSpent), // Convert to Float
    // }));

  // // Validate with Zod
  // const parsedResults = z.array(CustomerSummarySchema).parse(processedResults);

  return rawResults;
};

// /customers/:id
// /customers/:id/orders
