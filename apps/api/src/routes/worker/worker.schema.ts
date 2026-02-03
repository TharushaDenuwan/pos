import { worker } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for worker
export const selectWorkerSchema = createSelectSchema(worker);

// Insert schema for worker
export const insertWorkerSchema = createInsertSchema(worker, {
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  availability: z.enum(["Full Time", "Part Time", "On Call"]).optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
});

// Update schema for worker
export const updateWorkerSchema = createInsertSchema(worker, {
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  availability: z.enum(["Full Time", "Part Time", "On Call"]).optional(),
  notes: z.string().optional(),
})
  .omit({
    id: true,
  })
  .partial();

// Type Definitions
export type Worker = z.infer<typeof selectWorkerSchema>;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type UpdateWorker = z.infer<typeof updateWorkerSchema>;
