ALTER TABLE "products" ADD COLUMN "discount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "images" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "rating" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "review_count" integer DEFAULT 0;