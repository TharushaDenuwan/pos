import { staffProfiles } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for staff profile
export const selectWorkerSchema = createSelectSchema(staffProfiles);

// Insert schema for staff profile
export const insertWorkerSchema = createInsertSchema(staffProfiles)
  .omit({
    id: true,
  });

// Update schema for staff profile
export const updateWorkerSchema = createInsertSchema(staffProfiles)
  .omit({
    id: true,
  })
  .partial();

// Type Definitions
export type Worker = z.infer<typeof selectWorkerSchema>;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type UpdateWorker = z.infer<typeof updateWorkerSchema>;
