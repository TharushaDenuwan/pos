import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { roles } from "./roles.schema";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),

  roleId: text("role_id").references(() => roles.id),

  status: text("status").default("active"), // active / suspended

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));
