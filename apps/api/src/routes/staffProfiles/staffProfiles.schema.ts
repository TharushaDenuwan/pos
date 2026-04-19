import { staffProfiles } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectStaffProfileSchema = createSelectSchema(staffProfiles);

export const insertStaffProfileSchema = createInsertSchema(staffProfiles).omit({
  id: true,
});

export const updateStaffProfileSchema = createInsertSchema(staffProfiles)
  .omit({
    id: true,
  })
  .partial();

export const registerStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  position: z.string().optional(),
  assignedSection: z.enum(["storage", "orders", "reviews"]).optional(),
});

export const staffProfileWithUserSchema = selectStaffProfileSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    status: z.string().nullable(),
  }).optional(),
});

export type StaffProfile = z.infer<typeof selectStaffProfileSchema>;
export type InsertStaffProfile = z.infer<typeof insertStaffProfileSchema>;
export type UpdateStaffProfile = z.infer<typeof updateStaffProfileSchema>;
export type RegisterStaff = z.infer<typeof registerStaffSchema>;
export type StaffProfileWithUser = z.infer<typeof staffProfileWithUserSchema>;
