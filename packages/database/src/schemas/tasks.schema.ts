import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const tasks = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  title: text("title").notNull(),
  description: text("description"),

  assignedTo: text("assigned_to").references(() => users.id),

  status: text("status").default("pending"), // pending / in_progress / completed / cancelled
  priority: text("priority").default("medium"), // low / medium / high

  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
