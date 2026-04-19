import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const materialManagement = pgTable("material_management", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  date: timestamp("date").defaultNow(),
  phoneNumber: text("phone_number"),
  description: text("description"),
  location: text("location"),
  dailyPrice: integer("daily_price").default(0),
  distancePrice: integer("distance_price").default(0),
  discuss: text("discuss"),
  maintenance: integer("maintenance").default(0),

  advance: integer("advance").default(0),
  total: integer("total").notNull(),

  status: text("status").default("incomplete"), // incomplete, complete

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
