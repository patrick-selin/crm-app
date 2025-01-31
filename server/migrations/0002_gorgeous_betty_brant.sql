ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_orders_order_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_products_product_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_customers_customer_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" varchar(500) DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "brand" varchar(50) DEFAULT '';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "dimensions" jsonb DEFAULT '{"width":0,"height":0,"depth":0}'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "warranty_info" varchar(255) DEFAULT 'No warranty';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shipping_info" varchar(255) DEFAULT 'Ships in 5 days';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "availability_status" varchar(50) DEFAULT 'In Stock';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "rating" numeric(3, 2) DEFAULT 0.0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "reviews" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "return_policy" varchar(255) DEFAULT '30-day return policy';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_images" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "barcode" varchar(50);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("customer_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "product_image";