CREATE TABLE "hire_management" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pickup_date" timestamp,
	"return_date" timestamp,
	"phone_number" text NOT NULL,
	"customer_name" text NOT NULL,
	"description" text,
	"cost_per_day" integer NOT NULL,
	"total_cost" integer NOT NULL,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
