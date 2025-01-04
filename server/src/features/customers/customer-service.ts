import { customers } from "../../db/schemas/customers";
import { orders } from "../../db/schemas/orders";
import { db } from "../../db/db";
import { sql,eq } from "drizzle-orm";
// import zod schema

export const getAllCustomers = async () => {
  return await db
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
    .leftJoin(orders, eq(customers.customerId,orders.customerId))
    .groupBy(customers.customerId)
    .orderBy(sql`MAX(${orders.orderDate}) DESC`);
};