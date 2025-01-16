-- Step 1: Generate 1 Customer
DO $$
DECLARE
    customer_id UUID := gen_random_uuid();
    first_names TEXT[] := ARRAY['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mona'];
    last_names TEXT[] := ARRAY['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Evans', 'Wilson', 'Harris', 'Martinez', 'Clark', 'Lewis', 'Walker', 'Young', 'King', 'Taylor'];
    cities TEXT[] := ARRAY['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    countries TEXT[] := ARRAY['USA', 'Canada', 'UK', 'Germany', 'Australia', 'Finland', 'India', 'Japan', 'France', 'Italy'];
BEGIN
    INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, postal_code, country, created_at, updated_at)
    VALUES (
        customer_id,
        first_names[FLOOR(RANDOM() * ARRAY_LENGTH(first_names, 1) + 1)],
        last_names[FLOOR(RANDOM() * ARRAY_LENGTH(last_names, 1) + 1)],
        CONCAT('customer', FLOOR(RANDOM() * 1000)::TEXT, '@example.com'),
        CONCAT('555-', FLOOR(RANDOM() * 9000 + 1000)::TEXT),
        CONCAT(FLOOR(RANDOM() * 1000 + 1)::TEXT, ' ', 'Main St'),
        cities[FLOOR(RANDOM() * ARRAY_LENGTH(cities, 1) + 1)],
        LPAD((FLOOR(RANDOM() * 90000 + 10000)::TEXT), 5, '0'),
        countries[FLOOR(RANDOM() * ARRAY_LENGTH(countries, 1) + 1)],
        NOW(),
        NOW()
    );
END $$;

-- Step 2: Generate 1 Order for the Customer
DO $$
DECLARE
    customer RECORD;
    product RECORD;
    new_order_id UUID := gen_random_uuid(); -- Unique order ID
    total_order_amount NUMERIC(10, 2) := 0; -- Total amount for the order
    num_items INTEGER := FLOOR(RANDOM() * 5) + 1; -- Random number of items (1 to 5)
    quantity INTEGER;
    item_total NUMERIC(10, 2);
BEGIN
    -- Select the customer we just created
    SELECT * INTO customer FROM customers ORDER BY created_at DESC LIMIT 1;

    -- Insert a new order linked to the customer
    INSERT INTO orders (order_id, customer_id, total_amount, payment_status, order_date, created_at, updated_at)
    VALUES (
        new_order_id,
        customer.customer_id,
        0, -- Total amount will be updated later
        'Pending',
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
