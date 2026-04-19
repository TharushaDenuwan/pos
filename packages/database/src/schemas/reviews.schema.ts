import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products.schema";

export const reviews = pgTable("reviews", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  productId: text("product_id")
    .references(() => products.id)
    .notNull(),

  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  rating: integer("rating"), // 1–5
  comment: text("comment"),

  isApproved: boolean("is_approved").default(false), // Only approved reviews show on product pages
  createdAt: timestamp("created_at").defaultNow(),
});
