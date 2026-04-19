import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  position: z.string().optional(),
  assignedSection: z.enum(["storage", "orders", "reviews"]).optional(),
});

export type CreateStaff = z.infer<typeof createStaffSchema>;

export const updateStaffSectionSchema = z.object({
  id: z.string(),
  section: z.enum(["storage", "orders", "reviews"]),
});

export type UpdateStaffSection = z.infer<typeof updateStaffSectionSchema>;
