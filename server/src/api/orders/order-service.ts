import { db } from "../../db/db";
import { orders } from "../../db/schemas/orders";
import { sql, eq } from "drizzle-orm";
import { customers } from "../../db/schemas/customers";
import logger from "../../utils/logger";
// import { NotFoundError, BadRequestError } from "../../utils/errors/app-errors";
import { parseSorting, calculateOffset, createSearchAndFilterConditions } from "../../utils/query-helpers";

export const getOrders = async ({ search, sort, page, limit, filters }: any) => {
    logger.info("Service: Fetching orders with filters and pagination");
  
    const offset = calculateOffset(page, limit);
  
    const conditions = createSearchAndFilterConditions(search, filters, [
      customers.firstName,
      customers.lastName,
      orders.orderStatus,
      orders.totalAmount,
    ]);
  
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
      customer: sql`${customers.firstName} || ' ' || ${customers.lastName}`.as("customer"),
      totalAmount: orders.totalAmount,
      orderDate: orders.orderDate,
      orderStatus: orders.orderStatus,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.customerId))
    .where(conditions)
    .orderBy(orderBy)
    .offset(offset)
    .limit(limit);

  const results = await query;

  const totalCountQuery = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(conditions);

  const totalOrders = totalCountQuery[0]?.count ?? 0;

  return {
    total: totalOrders,
    page,
    limit,
    data: results,
  };
};
