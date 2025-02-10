import { db } from "../../db/db";
import { orders } from "../../db/schemas/orders";
import { sql, eq, and } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import logger from "../../utils/logger";
import {
  parseSorting,
  calculateOffset,
  createSearchAndFilterConditions,
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

  let conditions = createSearchAndFilterConditions(search, filters, [
    customers.firstName,
    customers.lastName,
    sql`${orders.orderStatus}::TEXT`,
    sql`CAST(${orders.totalAmount} AS TEXT)`,
  ]);

  if (startDate && endDate) {
    const dateCondition = sql`${orders.orderDate} BETWEEN ${startDate} AND ${endDate}`;
    conditions = conditions ? and(conditions, dateCondition) : dateCondition;
  } else if (startDate) {
    const dateCondition = sql`${orders.orderDate} >= ${startDate}`;
    conditions = conditions ? and(conditions, dateCondition) : dateCondition;
  } else if (endDate) {
    const dateCondition = sql`${orders.orderDate} <= ${endDate}`;
    conditions = conditions ? and(conditions, dateCondition) : dateCondition;
  }

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
    .where(conditions ? conditions : sql`TRUE`)
    .orderBy(orderBy)
    .offset(offset)
    .limit(limit);

  const results = await query;
  //   console.log("DEBUG :: ", query.toSQL().sql);

  const totalCountQuery = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.customerId))
    .where(conditions ? conditions : sql`TRUE`);

  const totalOrders = totalCountQuery[0]?.count ?? 0;

  return {
    total: totalOrders,
    page,
    limit,
    data: results,
  };
};
