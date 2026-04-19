import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(), // admin, staff
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(require("./users.schema").users), // Careful with circular imports, but drizzle-orm handles this usually via lazy evaluation if defined properly
}));
