import { relations, sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { products, productVariants } from "./products.schema";

// Order Status Enum
export const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

// Payment Status Enum
export const paymentStatuses = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded"
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

// Orders table
export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Order number for customer reference
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),

    // Customer information
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // null if guest checkout
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }),

    // Order totals
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

    // Order status
    orderStatus: varchar("order_status", { length: 50 })
      .notNull()
      .default("pending"),
    paymentStatus: varchar("payment_status", { length: 50 })
      .notNull()
      .default("pending"),

    // Shipping information
    shippingAddress: jsonb("shipping_address")
      .$type<{
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      }>()
      .notNull(),

    // Billing information (optional, can be same as shipping)
    billingAddress: jsonb("billing_address").$type<{
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }>(),

    // Payment information
    paymentMethod: varchar("payment_method", { length: 50 }), // "card", "paypal", "bank_transfer", etc.
    paymentIntentId: varchar("payment_intent_id", { length: 255 }), // Stripe payment intent ID

    // Order notes
    notes: text("notes"),

    // Tracking information
    trackingNumber: varchar("tracking_number", { length: 100 }),
    carrierName: varchar("carrier_name", { length: 100 }),

    // Timestamps
    ...timestamps,

    // Special dates
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
    cancelledAt: timestamp("cancelled_at")
  },
  (table) => [
    index("orders_user_idx").on(table.userId),
    index("orders_email_idx").on(table.customerEmail),
    index("orders_status_idx").on(table.orderStatus),
    index("orders_payment_status_idx").on(table.paymentStatus),
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_order_number_idx").on(table.orderNumber)
  ]
);

// Order items table
export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }), // Don't allow product deletion if in orders

    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "restrict"
    }), // null if no variant selected

    // Product information at time of order (for historical accuracy)
    productName: varchar("product_name", { length: 255 }).notNull(),
    variantName: varchar("variant_name", { length: 255 }),
    productSku: varchar("product_sku", { length: 100 }),

    // Pricing at time of order
    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(), // quantity * unitPrice

    // Product snapshot for historical reference
    productSnapshot: jsonb("product_snapshot"), // Store product data at time of order

    ...timestamps
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_product_idx").on(table.productId),
    index("order_items_variant_idx").on(table.variantId)
  ]
);

// Order status history table (for tracking status changes)
export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    fromStatus: varchar("from_status", { length: 50 }),
    toStatus: varchar("to_status", { length: 50 }).notNull(),

    notes: text("notes"),

    // Who made the change
    changedBy: text("changed_by").references(() => user.id, {
      onDelete: "set null"
    }),

    ...timestamps
  },
  (table) => [
    index("order_status_history_order_idx").on(table.orderId),
    index("order_status_history_created_at_idx").on(table.createdAt)
  ]
);

// Define relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id]
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id]
  })
}));

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id]
    }),
    changedByUser: one(user, {
      fields: [orderStatusHistory.changedBy],
      references: [user.id]
    })
  })
);

// Helper function to generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp.slice(-8)}-${random}`;
}
