import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),

  totalAmount: integer("total_amount").notNull(),
  paymentMethod: text("payment_method").default("COD"), // COD or Online
  status: text("status").default("pending"), // pending, confirmed, shipped, delivered, cancelled

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
