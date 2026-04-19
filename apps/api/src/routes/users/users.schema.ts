import { users } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createInsertSchema(users)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
