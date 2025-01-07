// customer-servics.ts
import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { db } from "../../db/db";
import { sql, eq } from "drizzle-orm";
import { z } from "zod";
import { CustomerSummarySchema } from "../../../../shared/schemas/customer-schemas";

export const getAllCustomers = async () => {
  console.log("Fetching all customers...");
  return await db.select().from(customers);
};

export const getCustomersWithMetrics = async () => {
  console.log("Fetching customers with metrics...");
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

    const processedResults = rawResults.map((result) => {
      console.log("Raw result before processing:", result);
    
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

  // Validate with Zod
  // const parsedResults = z.array(CustomerSummarySchema).parse(processedResults);
  // console.log("Raw Results:", rawResults);
  console.log("Processed Results:", processedResults);
  // console.log("Raw Results:", parsedResults);
  return processedResults; // HUOM
};

// /customers/:id
// /customers/:id/orders
