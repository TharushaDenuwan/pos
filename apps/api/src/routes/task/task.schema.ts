import { task } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for task
export const selectTaskSchema = createSelectSchema(task);

// Insert schema for task
export const insertTaskSchema = createInsertSchema(task, {
  jobId: z.number().int(),
  name: z.string().min(1).max(255),
  sequence: z.number().int(),
  assignedWorker: z.string().optional(),
}).omit({
  id: true,
});

// Update schema for task
export const updateTaskSchema = createInsertSchema(task, {
  jobId: z.number().int().optional(),
  name: z.string().min(1).max(255).optional(),
  sequence: z.number().int().optional(),
  assignedWorker: z.string().optional(),
})
  .omit({
    id: true,
  })
  .partial();

// Type Definitions
export type Task = z.infer<typeof selectTaskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
