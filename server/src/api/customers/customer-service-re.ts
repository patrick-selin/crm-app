// // customer-service-re.ts
// import { db } from "../../db/db";
// import { sql, eq, and } from "drizzle-orm";
// import { customers } from "../../db/schemas/customers";
// import { orders } from "../../db/schemas/orders";
// import logger from "../../utils/logger";
// import {
//   parseSort,
//   calculateOffset,
//   createSearchAndFilterConditions,
// } from "../../utils/query-helpers";

// import { z } from "zod";
// import {
//   CustomerSchema,
//   CustomerSummarySchema,
// } from "../../schemas/customer-schemas";

// export const getCustomers = async ({
//   search,
//   sort = "createdAt:desc",
//   page,
//   limit,
//   filters,
// }: {
//   search?: string;
//   sort?: string;
//   page: number;
//   limit: number;
//   filters?: Record<string, string>;
// }) => {
//   logger.info("Service: Fetching all customers...");

//   const sortMapping = {
//     firstName: "first_name",
//     lastName: "last_name",
//     email: "email",
//     city: "city",
//     country: "country",
//     createdAt: "created_at",
//   };

//   const offset = calculateOffset(page, limit);
//   const conditions = createSearchAndFilterConditions(search, filters);

//   const query = db
//     .select()
//     .from(customers)
//     .where(conditions)
//     .offset(offset)
//     .limit(limit);

//   if (sort) {
//     query.orderBy(parseSort(sort, sortMapping));
//   }

//   const results = await query;
//   const totalResult = await db
//     .select({ count: sql<number>`COUNT(*)` })
//     .from(customers)
//     .where(conditions);

//   return {
//     total: totalResult[0]?.count ?? 0,
//     page,
//     limit,
//     data: z.array(CustomerSchema).parse(results),
//   };
// };

// export const getCustomersWithMetrics = async ({
//   search,
//   sort = "lastOrderDate:desc",
//   page,
//   limit,
//   filters,
// }: {
//   search?: string;
//   sort?: string;
//   page: number;
//   limit: number;
//   filters?: Record<string, string>;
// }) => {
//   logger.info("Service: Fetching customers with metrics...");

//   const sortMapping = {
//     firstName: customers.firstName,
//     lastName: customers.lastName,
//     email: customers.email,
//     lastOrderDate: sql`COALESCE(MAX(${orders.orderDate}), NULL)`,
//     numOfOrders: sql`COALESCE(COUNT(${orders.orderId}), 0)`,
//     totalSpent: sql`COALESCE(SUM(${orders.totalAmount}), 0)`,
//   };

//   const offset = calculateOffset(page, limit);
//   const conditions = createSearchAndFilterConditions(search, filters);

//   const query = db
//     .select({
//       customerId: customers.customerId,
//       firstName: customers.firstName,
//       lastName: customers.lastName,
//       email: customers.email,
//       lastOrderDate: sql`COALESCE(MAX(${orders.orderDate}), NULL)`.as(
//         "lastOrderDate"
//       ),
//       numOfOrders: sql`COALESCE(COUNT(${orders.orderId}), 0)`.as("numOfOrders"),
//       totalSpent: sql`COALESCE(SUM(${orders.totalAmount}), 0)`.as("totalSpent"),
//     })
//     .from(customers)
//     .leftJoin(orders, sql`${customers.customerId} = ${orders.customerId}`)
//     .groupBy(customers.customerId)
//     .where(conditions)
//     .offset(offset)
//     .limit(limit);

//   if (sort) {
//     query.orderBy(parseSort(sort, sortMapping));
//   }

//   const results = await query;
//   const totalResult = await db
//     .select({ count: sql<number>`COUNT(*)` })
//     .from(customers)
//     .where(conditions);

//   return {
//     total: totalResult[0]?.count ?? 0,
//     page,
//     limit,
//     data: z.array(CustomerSummarySchema).parse(
//       results.map((item) => ({
//         ...item,
//         totalSpent: Number(item.totalSpent),
//         lastOrderDate: item.lastOrderDate || "No orders",
//       }))
//     ),
//   };
// };
