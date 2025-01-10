DROP TABLE "test_items";--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "email" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "city" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "postal_code" SET DATA TYPE varchar(5);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "country" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp DEFAULT now();