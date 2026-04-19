CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "housing" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"images" text[] DEFAULT '{}',
	"address" text NOT NULL,
	"city" text,
	"state" text,
	"zip_code" text,
	"price" text NOT NULL,
	"bedrooms" text,
	"bathrooms" text,
	"parking" text,
	"contact_number" text,
	"housing_type" text,
	"square_footage" text,
	"year_built" text,
	"is_furnished" boolean DEFAULT false NOT NULL,
	"link" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_title" text NOT NULL,
	"address" jsonb NOT NULL,
	"contact_details" jsonb NOT NULL,
	"job_number" varchar(50) NOT NULL,
	"due_date" timestamp,
	"description" text,
	"estimated_hours" numeric,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"status" varchar(20) DEFAULT 'Initiated' NOT NULL,
	"priority" varchar(20) DEFAULT 'Medium' NOT NULL,
	CONSTRAINT "jobs_job_number_unique" UNIQUE("job_number")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"type" "media_type" NOT NULL,
	"filename" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "new_arrivals" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"total_amount" integer NOT NULL,
	"payment_method" text DEFAULT 'COD',
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"stock_quantity" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"customer_name" text,
	"rating" integer,
	"comment" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "staff_profiles" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"position" text,
	"assigned_section" text,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"name" text NOT NULL,
	"sequence" integer NOT NULL,
	"assigned_worker" text
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"assigned_to" text,
	"status" text DEFAULT 'pending',
	"priority" text DEFAULT 'medium',
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"password_hash" text NOT NULL,
	"role_id" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "workers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"phone_number" text,
	"availability" varchar(20) DEFAULT 'Full Time' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "worker_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer NOT NULL,
	"category" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "worker_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"worker_id" integer NOT NULL,
	"skill" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "housing" ADD CONSTRAINT "housing_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "new_arrivals" ADD CONSTRAINT "new_arrivals_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_categories" ADD CONSTRAINT "worker_categories_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worker_skills" ADD CONSTRAINT "worker_skills_worker_id_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."workers"("id") ON DELETE cascade ON UPDATE no action;