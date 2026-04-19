import { tasks } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectTaskSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks, {
  title: (val) => val.min(1).max(500),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateTaskSchema = createInsertSchema(tasks)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Type Definitions
export type Task = z.infer<typeof selectTaskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
