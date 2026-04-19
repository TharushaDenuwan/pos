import { hireManagement } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectHireManagementSchema = createSelectSchema(hireManagement);

export const insertHireManagementSchema = createInsertSchema(hireManagement, {
  pickupDate: z.coerce.date(),
  returnDate: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateHireManagementSchema = createInsertSchema(hireManagement, {
  pickupDate: z.coerce.date(),
  returnDate: z.coerce.date(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type HireManagement = z.infer<typeof selectHireManagementSchema>;
export type InsertHireManagement = z.infer<typeof insertHireManagementSchema>;
export type UpdateHireManagement = z.infer<typeof updateHireManagementSchema>;
