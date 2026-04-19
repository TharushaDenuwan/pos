import { sql } from "drizzle-orm";
import { boolean, integer, json, pgTable, text } from "drizzle-orm/pg-core";
import { products } from "./products.schema";

export const newArrivals = pgTable("new_arrivals", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  productId: text("product_id")
    .references(() => products.id),

  name: text("name"),
  description: text("description"),
  price: integer("price"),
  discount: integer("discount").default(0),
  image: text("image"),
  images: json("images").$type<string[]>().default([]),
  category: text("category"),

  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
});
