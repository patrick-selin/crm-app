import { db } from "../../db/db";
import { sql, eq, and } from "drizzle-orm";
import { orders } from "../../db/schemas/orders";
import { orderItems } from "../../db/schemas/order-items";
import { products } from "../../db/schemas/products";
import { customers } from "../../db/schemas/customers";
import { OrderSchema, OrderItemSchema } from "../../schemas/order-schemas";
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
      customerId: customers.customerId,
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

export const getOrderDetails = async (orderId: string) => {
  logger.info(`Service: Fetching details for order ID = ${orderId}`);

  const [order] = await db
    .select({
      orderId: orders.orderId,
      totalAmount: orders.totalAmount,
      orderStatus: orders.orderStatus,
      orderDate: orders.orderDate,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customerId: customers.customerId,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
      customerEmail: customers.email,
    })
    .from(orders)
    .leftJoin(customers, eq(orders.customerId, customers.customerId))
    .where(eq(orders.orderId, orderId));

  if (!order) {
    return null;
  }

  logger.info(`DEBUG: Retrieved Order:`, order);

  // Normalize order object
  const processedOrder = {
    ...order,
    totalAmount: parseFloat(order.totalAmount),
  };

  const rawItems = await db
    .select({
      orderItemId: orderItems.orderItemId,
      orderId: orderItems.orderId,
      productId: products.productId,
      name: products.name,
      category: products.category,
      sku: products.sku,
      price: products.price,
      productImage: sql`COALESCE(products.product_images->>0, '')`.as(
        "productImage"
      ),
      quantity: orderItems.quantity,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.productId))
    .where(eq(orderItems.orderId, orderId));

  logger.info(`DEBUG: Retrieved ${rawItems.length} order items`);

  const processedItems = rawItems.map((item) => ({
    orderItemId: item.orderItemId,
    orderId: item.orderId,
    productId: item.productId,
    name: item.name,
    category: item.category,
    sku: item.sku,
    price: parseFloat(item.price ?? "0"),
    productImage: item.productImage ?? "",
    quantity: item.quantity,
  }));

  return {
    order: OrderSchema.parse(processedOrder),
    items: processedItems.map((item) => OrderItemSchema.parse(item)),
  };
};
