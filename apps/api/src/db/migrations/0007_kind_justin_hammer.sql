CREATE TABLE "material_management" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp DEFAULT now(),
	"phone_number" text NOT NULL,
	"description" text,
	"location" text,
	"advance" integer DEFAULT 0,
	"total" integer NOT NULL,
	"status" text DEFAULT 'incomplete',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
