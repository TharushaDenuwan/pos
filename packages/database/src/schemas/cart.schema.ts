import { relations, sql } from "drizzle-orm";
import { decimal, index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { products, productVariants } from "./products.schema";

export const carts = pgTable(
  "carts",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    ...timestamps
  },
  (table) => [
    index("carts_user_idx").on(table.userId),
    index("carts_created_at_idx").on(table.createdAt)
  ]
);

// Cart items table
export const cartItems = pgTable(
  "cart_items",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    cartId: text("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "cascade"
    }), // null if no variant selected

    quantity: integer("quantity").notNull().default(1),

    // Store price at time of adding to cart for price consistency
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(), // quantity * unitPrice

    ...timestamps
  },
  (table) => [
    index("cart_items_cart_idx").on(table.cartId),
    index("cart_items_product_idx").on(table.productId),
    index("cart_items_variant_idx").on(table.variantId)
  ]
);

// Define relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(user, {
    fields: [carts.userId],
    references: [user.id]
  }),
  items: many(cartItems)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id]
  })
}));
