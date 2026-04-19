import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const staffProfiles = pgTable("staff_profiles", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: text("user_id")
    .references(() => users.id)
    .notNull(),

  position: text("position"),
  assignedSection: text("assigned_section"), // storage / orders / reviews

  joinedAt: timestamp("joined_at").defaultNow(),
});

export const staffProfilesRelations = relations(staffProfiles, ({ one }) => ({
  user: one(users, {
    fields: [staffProfiles.userId],
    references: [users.id],
  }),
}));
