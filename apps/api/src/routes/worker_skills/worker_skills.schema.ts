import { worker_skills } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for worker_skills
export const selectWorkerSkillSchema = createSelectSchema(worker_skills);

// Insert schema for worker_skills
export const insertWorkerSkillSchema = createInsertSchema(worker_skills, {
  workerId: z.number().int(),
  skill: z.string().min(1).max(50),
}).omit({
  id: true,
});

// Update schema for worker_skills
export const updateWorkerSkillSchema = createInsertSchema(worker_skills, {
  workerId: z.number().int().optional(),
  skill: z.string().min(1).max(50).optional(),
})
  .omit({
    id: true,
  })
  .partial();

// Type Definitions
export type WorkerSkill = z.infer<typeof selectWorkerSkillSchema>;
export type InsertWorkerSkill = z.infer<typeof insertWorkerSkillSchema>;
export type UpdateWorkerSkill = z.infer<typeof updateWorkerSkillSchema>;
