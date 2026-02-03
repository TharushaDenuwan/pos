import { worker_categories } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for worker_categories
export const selectWorkerCategorySchema = createSelectSchema(worker_categories);

// Insert schema for worker_categories
export const insertWorkerCategorySchema = createInsertSchema(
  worker_categories,
  {
    workerId: z.number().int(),
    category: z.string().min(1).max(50),
  }
).omit({
  id: true,
});

// Update schema for worker_categories
export const updateWorkerCategorySchema = createInsertSchema(
  worker_categories,
  {
    workerId: z.number().int().optional(),
    category: z.string().min(1).max(50).optional(),
  }
)
  .omit({
    id: true,
  })
  .partial();

// Type Definitions
export type WorkerCategory = z.infer<typeof selectWorkerCategorySchema>;
export type InsertWorkerCategory = z.infer<typeof insertWorkerCategorySchema>;
export type UpdateWorkerCategory = z.infer<typeof updateWorkerCategorySchema>;
