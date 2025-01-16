import { Client } from "pg";
import cron from "node-cron";
import { config } from "../config/config";

if (!config.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const sqlScript = `
-- Step 1: Generate a Customer or Use Existing Customer
DO $$
DECLARE
    new_customer_id UUID;
    first_names TEXT[] := ARRAY['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mona'];
    last_names TEXT[] := ARRAY['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Evans', 'Wilson', 'Harris', 'Martinez', 'Clark', 'Lewis', 'Walker', 'Young', 'King', 'Taylor'];
    cities TEXT[] := ARRAY['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    countries TEXT[] := ARRAY['USA', 'Canada', 'UK', 'Germany', 'Australia', 'Finland', 'India', 'Japan', 'France', 'Italy'];
    use_existing_customer BOOLEAN := RANDOM() < 0.9; -- 50% chance to use an existing customer
BEGIN
    IF use_existing_customer THEN
        -- Select a truly random existing customer
        SELECT c.customer_id INTO new_customer_id FROM customers c OFFSET FLOOR(RANDOM() * (SELECT COUNT(*) FROM customers)) LIMIT 1;
    ELSE
        -- Create a new customer
        new_customer_id := gen_random_uuid();
        INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, postal_code, country, created_at, updated_at)
        VALUES (
            new_customer_id,
            first_names[FLOOR(RANDOM() * ARRAY_LENGTH(first_names, 1) + 1)],
            last_names[FLOOR(RANDOM() * ARRAY_LENGTH(last_names, 1) + 1)],
            CONCAT('customer-', LEFT(gen_random_uuid()::TEXT, 8), '@example.com'),
            CONCAT('555-', FLOOR(RANDOM() * 9000 + 1000)::TEXT),
            CONCAT(FLOOR(RANDOM() * 1000 + 1)::TEXT, ' ', 'Main St'),
            cities[FLOOR(RANDOM() * ARRAY_LENGTH(cities, 1) + 1)],
            LPAD((FLOOR(RANDOM() * 90000 + 10000)::TEXT), 5, '0'),
            countries[FLOOR(RANDOM() * ARRAY_LENGTH(countries, 1) + 1)],
            NOW(),
            NOW()
        );
    END IF;

    -- Save the selected or newly created customer_id for the next step
    PERFORM new_customer_id;
END $$;

-- Step 2: Generate 1 Order for the Customer
DO $$
DECLARE
    product RECORD;
    new_customer RECORD;
    new_order_id UUID := gen_random_uuid(); -- Unique order ID
    total_order_amount NUMERIC(10, 2) := 0; -- Total amount for the order
    num_items INTEGER := FLOOR(RANDOM() * 5) + 1; -- Random number of items (1 to 5)
    quantity INTEGER;
    item_total NUMERIC(10, 2);
    payment_status_options TEXT[] := ARRAY['Completed', 'Pending', 'Overdue']; -- Payment status options
BEGIN
    -- Retrieve the most recent customer_id (whether new or existing)
    SELECT c.customer_id INTO new_customer FROM customers c ORDER BY updated_at DESC LIMIT 1;

    -- Insert a new order linked to the customer
    INSERT INTO orders (order_id, customer_id, total_amount, payment_status, order_date, created_at, updated_at)
    VALUES (
        new_order_id,
        new_customer.customer_id,
        0, -- Total amount will be updated later
        payment_status_options[FLOOR(RANDOM() * ARRAY_LENGTH(payment_status_options, 1) + 1)], -- Random payment status
        NOW(),
        NOW(),
        NOW()
    );

    -- Generate random order items
    FOR i IN 1..num_items LOOP
        -- Select a random product
        SELECT * INTO product FROM products ORDER BY RANDOM() LIMIT 1;

        -- Determine a random quantity (1 to 5)
        quantity := FLOOR(RANDOM() * 5) + 1;

        -- Calculate the total price for this item
        item_total := quantity * product.price;

        -- Insert the item into the order_items table
        INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
        VALUES (gen_random_uuid(), new_order_id, product.product_id, quantity, item_total);

        -- Update the total amount for the order
        total_order_amount := total_order_amount + item_total;
    END LOOP;

    -- Update the total amount in the orders table
    UPDATE orders
    SET total_amount = total_order_amount
    WHERE orders.order_id = new_order_id;
END $$;
`;

cron.schedule("0 * * * *", async () => {
  const client = new Client({
    connectionString: config.DATABASE_URL,
    ssl:
      config.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Optional SSL config
  });

  try {
    await client.connect();
    console.log("Connected to the database.");
    await client.query(sqlScript);
    console.log("SQL job executed successfully.");
  } catch (error) {
    console.error("Error executing SQL job:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
});

console.log("Cron job started. SQL job will run every minute.");
