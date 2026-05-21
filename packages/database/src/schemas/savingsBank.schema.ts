import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const savingsBank = pgTable("savings_bank", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  amount: integer("amount").notNull(),
  date: timestamp("date").defaultNow(),
  note: text("note"),
  vehicleType: text("vehicle_type"),

  createdAt: timestamp("created_at").defaultNow(),
});
