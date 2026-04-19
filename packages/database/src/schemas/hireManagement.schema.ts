import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const hireManagement = pgTable("hire_management", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  pickupDate: timestamp("pickup_date"),
  returnDate: timestamp("return_date"),
  phoneNumber: text("phone_number").notNull(),
  customerName: text("customer_name").notNull(),
  vehicleType: text("vehicle_type").notNull().default("KDH"), // KDH, CHR, AQUA
  description: text("description"),

  costPerDay: integer("cost_per_day").notNull(),
  totalCost: integer("total_cost").notNull(),

  status: text("status").default("pending"), // pending, active, returned, cancelled

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
