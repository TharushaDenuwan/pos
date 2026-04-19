import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { orders } from "./orders.schema";
import { products } from "./products.schema";

export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  orderId: text("order_id")
    .references(() => orders.id)
    .notNull(),

  productId: text("product_id")
    .references(() => products.id)
    .notNull(),

  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});
