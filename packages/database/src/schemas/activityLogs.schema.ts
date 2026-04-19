import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const activityLogs = pgTable("activity_logs", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  action: text("action").notNull(), // e.g., "Updated Order Status", "Approved Review"
  targetType: text("target_type").notNull(), // e.g., "Order", "Review", "User"
  targetId: text("target_id").notNull(), // ID of the modified entity
  details: jsonb("details"), // Store previous/new values or other metadata

  createdAt: timestamp("created_at").defaultNow(),
});
