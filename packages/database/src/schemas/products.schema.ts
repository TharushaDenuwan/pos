import { sql } from "drizzle-orm";
import { boolean, integer, json, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // stored in cents
  discount: integer("discount").default(0), // stored in cents

  // Single main image for listing, array for gallery
  image: text("image"),
  images: json("images").$type<string[]>().default([]),

  category: text("category").notNull(), // e.g., "menswear", "electronics"
  isFeatured: boolean("is_featured").default(false),

  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),

  stockQuantity: integer("stock_quantity").default(0),
  status: text("status").default("active"), // active / out_of_stock

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
