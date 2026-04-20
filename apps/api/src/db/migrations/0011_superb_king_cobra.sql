ALTER TABLE "hire_management" ADD COLUMN "hire_type" text DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE "hire_management" ADD COLUMN "distance" integer;--> statement-breakpoint
ALTER TABLE "hire_management" ADD COLUMN "price_per_km" integer;--> statement-breakpoint
ALTER TABLE "hire_management" ADD COLUMN "is_with_driver" text DEFAULT 'no';--> statement-breakpoint
ALTER TABLE "hire_management" ADD COLUMN "maintenance_cost" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "hire_management" ADD COLUMN "fuel_cost" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "material_management" ADD COLUMN "daily_price" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "material_management" ADD COLUMN "distance_price" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "material_management" ADD COLUMN "discuss" text;--> statement-breakpoint
ALTER TABLE "material_management" ADD COLUMN "maintenance" integer DEFAULT 0;