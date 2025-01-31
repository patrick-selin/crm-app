import { db } from "../db/db";
import { orders } from "../db/schemas/orders";
import { orderItems } from "../db/schemas/order-items";
import { customers } from "../db/schemas/customers";
import { products } from "../db/schemas/products";
import { faker } from "@faker-js/faker";

// RUN SCRIPT (root)
// docker exec -it crm-app-server npx tsx src/db/generate-fake-orders.ts

const fetchExistingCustomers = async () => {
  return await db.select().from(customers);
};

const fetchAllProducts = async () => {
  return await db.select().from(products);
};

const getRandomDateWithinLastYear = () => {
  return faker.date.recent({ days: 365 });
};

const createNewCustomer = () => {
  const createdAt = getRandomDateWithinLastYear();

  return {
    customerId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number().replace(/\D/g, "").slice(0, 10),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.string.numeric(5),
    country: faker.location.country(),
    createdAt,
    updatedAt: createdAt,
  };
};

const generateOrder = (customerId: string) => {
  const orderDate = getRandomDateWithinLastYear();
  return {
    orderId: faker.string.uuid(),
    customerId,
    totalAmount: "0.00",
    paymentStatus: faker.helpers.arrayElement([
      "Completed",
      "Pending",
      "Overdue",
    ]),
    orderDate,
    createdAt: orderDate,
    updatedAt: orderDate,
  };
};

const generateOrderItems = (orderId: string, productsList: any[]) => {
  const numItems = faker.number.int({ min: 1, max: 5 });
  let totalAmount = 0;

  const items = Array.from({ length: numItems }).map(() => {
    const product = faker.helpers.arrayElement(productsList);
    const quantity = faker.number.int({ min: 1, max: 5 });
    const price = parseFloat(product.price) * quantity;

    totalAmount += price;

    return {
      orderItemId: faker.string.uuid(),
      orderId,
      productId: product.productId,
      quantity,
      price: price.toFixed(2),
    };
  });

  return { items, totalAmount: totalAmount.toFixed(2) };
};

const seedOrders = async () => {
  try {
    // await db.delete(customers);
    // await db.delete(orders);
    // await db.delete(orderItems);
    // await db.delete(products);

    const existingCustomers = await fetchExistingCustomers();
    const productsList = await fetchAllProducts();

    if (productsList.length === 0) {
      return;
    }

    const ordersToInsert = [];
    const orderItemsToInsert = [];
    const customersToInsert = [];

    // 1 for cron job, +20 if init seeding manually
    for (let i = 0; i < 1; i++) {
      let customerId;

      // Ratio to create a new customer, 80% use existing
      if (
        faker.number.float({ min: 0, max: 1, fractionDigits: 1 }) < 0.2 ||
        existingCustomers.length === 0
      ) {
        const newCustomer = createNewCustomer();
        customersToInsert.push(newCustomer);
        customerId = newCustomer.customerId;
      } else {
        const existingCustomer = faker.helpers.arrayElement(existingCustomers);
        customerId = existingCustomer.customerId;
      }

      // Generate 0-8 orders for each customer
      const numOrders = faker.number.int({ min: 0, max: 8 });
      for (let j = 0; j < numOrders; j++) {
        const newOrder = generateOrder(customerId);
        const { items, totalAmount } = generateOrderItems(
          newOrder.orderId,
          productsList
        );

        newOrder.totalAmount = totalAmount;

        ordersToInsert.push(newOrder);
        orderItemsToInsert.push(...items);
      }
    }

    if (customersToInsert.length > 0) {
      await db.insert(customers).values(customersToInsert);
      console.log(`Inserted ${customersToInsert.length} new customers`);
    }

    if (ordersToInsert.length > 0) {
      await db.insert(orders).values(ordersToInsert);
      console.log(`Inserted ${ordersToInsert.length} orders`);
    }

    if (orderItemsToInsert.length > 0) {
      await db.insert(orderItems).values(orderItemsToInsert);
      console.log(`Inserted ${orderItemsToInsert.length} order items`);
    }

    console.log("Order seeding complete!");
  } catch (error) {
    console.error("Error seeding orders:", error);
  } finally {
    process.exit();
  }
};

seedOrders();
