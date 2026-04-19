import { materialManagement } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectMaterialManagementSchema = createSelectSchema(materialManagement);

export const insertMaterialManagementSchema = createInsertSchema(materialManagement).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMaterialManagementSchema = createInsertSchema(materialManagement)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type MaterialManagement = z.infer<typeof selectMaterialManagementSchema>;
export type InsertMaterialManagement = z.infer<typeof insertMaterialManagementSchema>;
export type UpdateMaterialManagement = z.infer<typeof updateMaterialManagementSchema>;
