-- dev database
\c crm_app_db_dev;

INSERT INTO test_items (id, content, important) VALUES
    ('1', 'Test Word 1', true),
    ('2', 'Test Word 2', false),
    ('3', 'Test Word 3', true),
    ('4', 'Test Word 4', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Data for Customers
INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, postal_code, country)
VALUES
    (gen_random_uuid(), 'John', 'Doe', 'john.doe@example.com', '555-1234', '123 Main St', 'New York', '10001', 'USA'),
    (gen_random_uuid(), 'Jane', 'Smith', 'jane.smith@example.com', '555-5678', '456 Oak Ave', 'San Francisco', '94105', 'USA'),
    (gen_random_uuid(), 'Alice', 'Johnson', 'alice.johnson@example.com', '555-2468', '789 Pine Blvd', 'Chicago', '60601', 'USA'),
    (gen_random_uuid(), 'Bob', 'Brown', 'bob.brown@example.com', '555-7890', '321 Elm Rd', 'Houston', '77002', 'USA'),
    (gen_random_uuid(), 'Charlie', 'Davis', 'charlie.davis@example.com', '555-1239', '654 Maple Ln', 'Los Angeles', '90001', 'USA'),
    (gen_random_uuid(), 'Diana', 'Evans', 'diana.evans@example.com', '555-9876', '987 Birch Dr', 'Seattle', '98101', 'USA'),
    (gen_random_uuid(), 'Eve', 'Wilson', 'eve.wilson@example.com', '555-5432', '111 Spruce Ct', 'Miami', '33101', 'USA'),
    (gen_random_uuid(), 'Frank', 'Harris', 'frank.harris@example.com', '555-8765', '222 Cedar Blvd', 'Boston', '02108', 'USA'),
    (gen_random_uuid(), 'Grace', 'Martinez', 'grace.martinez@example.com', '555-3456', '333 Willow Way', 'Dallas', '75201', 'USA'),
    (gen_random_uuid(), 'Henry', 'Clark', 'henry.clark@example.com', '555-5679', '444 Aspen Dr', 'Atlanta', '30301', 'USA'),
    (gen_random_uuid(), 'Ivy', 'Lewis', 'ivy.lewis@example.com', '555-6780', '555 Alder Ct', 'Denver', '80201', 'USA'),
    (gen_random_uuid(), 'Jack', 'Walker', 'jack.walker@example.com', '555-4321', '666 Palm Ave', 'Phoenix', '85001', 'USA'),
    (gen_random_uuid(), 'Karen', 'Young', 'karen.young@example.com', '555-8764', '777 Cypress Ln', 'San Diego', '92101', 'USA'),
    (gen_random_uuid(), 'Leo', 'King', 'leo.king@example.com', '555-0987', '888 Sycamore St', 'Austin', '73301', 'USA'),
    (gen_random_uuid(), 'Mona', 'Taylor', 'mona.taylor@example.com', '555-3458', '999 Poplar Rd', 'Orlando', '32801', 'USA');

-- Insert Mock Data for Products
INSERT INTO products (product_id, name, sku, price, stock, category, product_image)
VALUES
    (gen_random_uuid(), 'Laptop', 'LAP-001', 899.99, 50, 'Electronics', 'https://example.com/images/laptop.jpg'),
    (gen_random_uuid(), 'Phone', 'PHN-002', 499.99, 30, 'Electronics', 'https://example.com/images/phone.jpg'),
    (gen_random_uuid(), 'Tablet', 'TAB-003', 299.99, 20, 'Electronics', 'https://example.com/images/tablet.jpg'),
    (gen_random_uuid(), 'Headphones', 'HDP-004', 99.99, 100, 'Accessories', 'https://example.com/images/headphones.jpg'),
    (gen_random_uuid(), 'Keyboard', 'KBD-005', 49.99, 80, 'Accessories', 'https://example.com/images/keyboard.jpg'),
    (gen_random_uuid(), 'Monitor', 'MON-006', 199.99, 40, 'Electronics', 'https://example.com/images/monitor.jpg'),
    (gen_random_uuid(), 'Mouse', 'MOU-007', 29.99, 90, 'Accessories', 'https://example.com/images/mouse.jpg'),
    (gen_random_uuid(), 'Speaker', 'SPK-008', 79.99, 60, 'Accessories', 'https://example.com/images/speaker.jpg'),
    (gen_random_uuid(), 'Charger', 'CHG-009', 19.99, 120, 'Accessories', 'https://example.com/images/charger.jpg'),
    (gen_random_uuid(), 'Camera', 'CAM-010', 299.99, 15, 'Electronics', 'https://example.com/images/camera.jpg');

-- Insert Mock Data for Orders
INSERT INTO orders (order_id, customer_id, total_amount, payment_status, order_date, created_at)
VALUES
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 120.50, 'Completed', NOW() - interval '10 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 89.99, 'Pending', NOW() - interval '15 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 45.75, 'Completed', NOW() - interval '20 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 220.10, 'Overdue', NOW() - interval '5 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 350.00, 'Completed', NOW() - interval '30 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 78.20, 'Pending', NOW() - interval '18 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 100.00, 'Completed', NOW() - interval '12 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 250.00, 'Overdue', NOW() - interval '25 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 400.00, 'Completed', NOW() - interval '7 days', NOW()),
    (gen_random_uuid(), (SELECT customer_id FROM customers OFFSET floor(random() * (SELECT COUNT(*) FROM customers)) LIMIT 1), 60.00, 'Pending', NOW() - interval '3 days', NOW());

-- Insert Mock Data for Order Items
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
VALUES
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1)),
    (gen_random_uuid(), (SELECT order_id FROM orders OFFSET floor(random() * (SELECT COUNT(*) FROM orders)) LIMIT 1), (SELECT product_id FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1), floor(random() * 5 + 1), (SELECT price FROM products OFFSET floor(random() * (SELECT COUNT(*) FROM products)) LIMIT 1));


-- *****************    
-- test database
\c crm_app_db_test;

INSERT INTO test_items (id, content, important) VALUES
    ('1', 'Test Word 1', true),
    ('2', 'Test Word 2', false),
    ('3', 'Test Word 3', true),
    ('4', 'Test Word 4', false)
ON CONFLICT (id) DO NOTHING;
