ALTER TABLE "new_arrivals" ADD COLUMN "discount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD COLUMN "images" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD COLUMN "is_featured" boolean DEFAULT false;