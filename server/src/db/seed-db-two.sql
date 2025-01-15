-- Deletes existing data in the products, customers, orders, and order_items tables.
-- Generates 15 products.
-- Generates 30 customers.
-- Creates random orders (1–8 per customer).
--  Populates order items for those orders, ensuring they match the products.


-- Step 1: Clean up existing data
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE products CASCADE;

-- Step 2: Generate 15 products
DO $$
DECLARE
    product_id UUID;
    product_names TEXT[] := ARRAY['Laptop', 'Phone', 'Tablet', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Speaker', 'Camera', 
                                  'Charger', 'Smartwatch', 'Printer', 'Router', 'Projector', 'Webcam'];
    categories TEXT[] := ARRAY['Electronics', 'Accessories', 'Office Equipment'];
    i INTEGER;
BEGIN
    FOR i IN 1..15 LOOP
        product_id := gen_random_uuid();
        INSERT INTO products (product_id, name, sku, price, stock, category, product_image, created_at)
        VALUES (
            product_id,
            product_names[i],
            CONCAT(UPPER(SUBSTRING(product_names[i], 1, 3)), '-', LPAD(i::TEXT, 3, '0')),
            ROUND((RANDOM() * 500 + 20)::NUMERIC, 2), -- Random price between 20 and 520
            FLOOR(RANDOM() * 100 + 10), -- Random stock between 10 and 110
            categories[FLOOR(RANDOM() * ARRAY_LENGTH(categories, 1) + 1)],
            CONCAT('https://example.com/images/', LOWER(REPLACE(product_names[i], ' ', '_')), '.jpg'),
            NOW()
        );
    END LOOP;
END $$;

-- Step 3: Generate 30 customers
DO $$
DECLARE
    customer_id UUID;
    first_names TEXT[] := ARRAY['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mona'];
    last_names TEXT[] := ARRAY['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Evans', 'Wilson', 'Harris', 'Martinez', 'Clark', 'Lewis', 'Walker', 'Young', 'King', 'Taylor'];
    i INTEGER;
BEGIN
    FOR i IN 1..30 LOOP
        customer_id := gen_random_uuid();
        INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, postal_code, country, created_at, updated_at)
        VALUES (
            customer_id,
            first_names[FLOOR(RANDOM() * ARRAY_LENGTH(first_names, 1) + 1)],
            last_names[FLOOR(RANDOM() * ARRAY_LENGTH(last_names, 1) + 1)],
            CONCAT('customer', i, '@example.com'),
            CONCAT('555-', FLOOR(RANDOM() * 9000 + 1000)::TEXT),
            CONCAT(FLOOR(RANDOM() * 1000 + 1)::TEXT, ' Random St'),
            'City ' || FLOOR(RANDOM() * 10 + 1)::TEXT,
            LPAD((FLOOR(RANDOM() * 90000 + 10000)::TEXT), 5, '0'),
            'USA',
            NOW(),
            NOW()
        );
    END LOOP;
END $$;

-- Step 4: Generate orders and order items
DO $$
DECLARE
    customer RECORD;
    product RECORD;
    new_order_id UUID; -- Unique order ID for each order
    total_order_amount NUMERIC(10, 2);
    num_orders INTEGER; -- Random number of orders per customer
    num_items INTEGER;
    quantity INTEGER;
    item_total NUMERIC(10, 2);
BEGIN
    -- Iterate through all customers
    FOR customer IN SELECT * FROM customers LOOP
        -- Determine a random number of orders for the customer (1 to 8 orders)
        num_orders := FLOOR(RANDOM() * 8 + 1);

        -- Generate a random number of orders for this customer
        FOR i IN 1..num_orders LOOP
            -- Generate a new order ID
            new_order_id := gen_random_uuid();
            total_order_amount := 0;

            -- Insert a new order linked to the current customer
            INSERT INTO orders (order_id, customer_id, total_amount, payment_status, order_date, created_at)
            VALUES (new_order_id, customer.customer_id, 0, 'Pending', NOW(), NOW());

            -- Randomly determine how many items will be in the order (1 to 5)
            num_items := FLOOR(RANDOM() * 5) + 1;

            -- Loop to create order items for this order
            FOR j IN 1..num_items LOOP
                -- Select a random product
                SELECT * INTO product FROM products ORDER BY RANDOM() LIMIT 1;

                -- Determine a random quantity (1 to 5)
                quantity := FLOOR(RANDOM() * 5) + 1;

                -- Calculate the total price for this item
                item_total := quantity * product.price;

                -- Insert the item into the order_items table, linked to the current order_id
                INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
                VALUES (gen_random_uuid(), new_order_id, product.product_id, quantity, item_total);

                -- Update the total amount for the order
                total_order_amount := total_order_amount + item_total;
            END LOOP;

            -- Update the total amount in the orders table
            UPDATE orders
            SET total_amount = total_order_amount
            WHERE orders.order_id = new_order_id;
        END LOOP;
    END LOOP;
END $$;
