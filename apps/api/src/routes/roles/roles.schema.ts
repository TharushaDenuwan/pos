import { roles } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectRoleSchema = createSelectSchema(roles);

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const updateRoleSchema = createInsertSchema(roles)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type Role = z.infer<typeof selectRoleSchema>;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;
