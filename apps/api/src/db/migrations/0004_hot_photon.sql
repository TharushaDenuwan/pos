ALTER TABLE "orders" ADD COLUMN "customer_email" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "customer_address" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "customer_email" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "is_approved" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "status";