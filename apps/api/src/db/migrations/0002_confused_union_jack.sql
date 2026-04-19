ALTER TABLE "new_arrivals" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "new_arrivals" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "new_arrivals" DROP COLUMN "end_date";