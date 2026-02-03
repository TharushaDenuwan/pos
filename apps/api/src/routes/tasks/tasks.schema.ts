import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tasks } from "@repo/database";
import { z } from "zod";

export const selectTaskSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks, {
  name: (val) => val.min(1).max(500)
})
  .required({
    done: true
  })
  .omit({
    createdAt: true,
    updatedAt: true
  });

export const updateTaskSchema = createInsertSchema(tasks)
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .partial();

// Type Definitions
export type Task = z.infer<typeof selectTaskSchema>;

export type InsertTask = z.infer<typeof insertTaskSchema>;
