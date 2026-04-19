ALTER TABLE "new_arrivals" ALTER COLUMN "product_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image" text;