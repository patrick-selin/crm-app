import { db } from "../db/db";
import { products } from "../db/schemas/products";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";

// RUN SCRIPT (root)
// docker exec -it crm-app-server npx tsx src/db/generate-fake-products.ts

const CATEGORIES = ["Laptops", "Monitors", "Phones", "Tablets", "Headphones", "Accessories"];

const generateImageUrl = (category: string) => {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `https://loremflickr.com/400/300/${category.replace(/\s+/g, '-')}?random=${randomNumber}`;
};

// Generate test products
const generateProducts = (count: number) => {
  return Array.from({ length: count }, () => {
    const category = faker.helpers.arrayElement(CATEGORIES);
    return {
      productId: faker.string.uuid(),
      name: faker.commerce.productName(),
      sku: `${faker.string.alpha(3).toUpperCase()}-${faker.number.int(99999)}`,
      price: faker.commerce.price({ min: 50, max: 2500 }).toString(),
      stock: faker.number.int({ min: 5, max: 100 }),
      category,
      description: faker.commerce.productDescription(),
      brand: faker.company.name(),
      tags: JSON.stringify([
        faker.commerce.productMaterial(),
        faker.commerce.productAdjective(),
      ]),
      dimensions: JSON.stringify({
        width: faker.number.float({ min: 10, max: 60, fractionDigits: 1 }),
        height: faker.number.float({ min: 10, max: 50, fractionDigits: 1 }),
        depth: faker.number.float({ min: 5, max: 30, fractionDigits: 1 }),
      }),
      warrantyInfo: "2-year limited warranty",
      shippingInfo: "Ships within 3-5 business days",
      availabilityStatus: faker.helpers.arrayElement([
        "In Stock",
        "Out of Stock",
        "Limited Stock",
      ]),
      rating: faker.number
        .float({ min: 1, max: 5, fractionDigits: 1 })
        .toString(),
      reviews: [
        {
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          date: faker.date.past().toISOString(),
        },
        {
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          date: faker.date.past().toISOString(),
        },
      ],
      returnPolicy: "30-day return policy",
      productImages: JSON.stringify([generateImageUrl(category), generateImageUrl(category)]),
      barcode: faker.string.numeric(13),
      createdAt: sql`NOW()`,
      updatedAt: sql`NOW()`,
    };
  });
};

// Seed function
const seedProducts = async () => {
  try {
    console.log("Seeding products...");

    await db.delete(products);

    // Num of Products
    const newProducts = generateProducts(20);
    await db.insert(products).values(newProducts);

    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    process.exit();
  }
};

seedProducts();
