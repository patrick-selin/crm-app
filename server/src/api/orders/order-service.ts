import { db } from "../../db/db";
import { orders } from "../../db/schemas/orders";
import { sql, eq, and } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import logger from "../../utils/logger";
import {
  parseSorting,
  calculateOffset,
  createSearchAndFilterConditions,
  buildDateConditions,
} from "../../utils/query-helpers";

export const getOrders = async ({
  search,
  sort,
  page,
  limit,
  filters,
  startDate,
  endDate,
}: any) => {
  logger.info("Service: Fetching orders with filters and pagination");

  const offset = calculateOffset(page, limit);

  const baseConditions = createSearchAndFilterConditions(search, filters, [
    customers.firstName,
    customers.lastName,
    sql`${orders.orderStatus}::TEXT`,
    sql`CAST(${orders.totalAmount} AS TEXT)`,
  ]);

  const dateConditions = buildDateConditions(startDate, endDate);

  const combinedConditions =
    baseConditions && dateConditions
      ? and(baseConditions, dateConditions)
      : baseConditions || dateConditions || sql`TRUE`;

  const sortMapping = {
    orderId: orders.orderId,
    customer: sql`${customers.firstName} || ' ' || ${customers.lastName}`,
    totalAmount: orders.totalAmount,
    orderDate: orders.orderDate,
    orderStatus: orders.orderStatus,
  };

  const orderBy = parseSorting(sort || "orderDate:desc", sortMapping);

  const query = db
    .select({
      orderId: orders.orderId,
      customer: sql`${customers.firstName} || ' ' || ${customers.lastName}`.as(
        "customer"
      ),
      totalAmount: orders.totalAmount,
      orderDate: orders.orderDate,
      orderStatus: orders.orderStatus,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.customerId))
    .where(combinedConditions)
    .orderBy(orderBy)
    .offset(offset)
    .limit(limit);

  // Log the generated SQL query for debugging.
  logger.info("Generated SQL Query:", query.toSQL().sql);

  const results = await query;

  const totalCountQuery = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.customerId))
    .where(combinedConditions);

  const totalOrders = totalCountQuery[0]?.count ?? 0;

  return {
    total: totalOrders,
    page,
    limit,
    data: results,
  };
};
