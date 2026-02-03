import { jobs } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema for jobs
export const selectJobSchema = createSelectSchema(jobs);

// Insert schema for jobs
export const insertJobSchema = createInsertSchema(jobs, {
  jobTitle: z.string().min(1).max(500),
  address: z.object({
    formattedAddress: z.string().min(1),
    latitude: z.number(),
    longitude: z.number(),
  }),
  contactDetails: z.object({
    phoneNumber: z.string().min(1),
    email: z.string().email().optional(),
    workPhoneNumber: z.string().min(1).optional(),
  }),
  jobNumber: z.string().min(1).max(50),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional(),
  estimatedHours: z.coerce.number().optional().nullable(),
  photos: z.array(z.string()).optional().default([]),
  status: z
    .enum([
      "Initiated",
      "Quotation",
      "Approved",
      "In Progress",
      "Completed",
      "Invoiced",
    ])
    .optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
}).omit({
  id: true,
});

// Update schema for jobs
export const updateJobSchema = createInsertSchema(jobs, {
  jobTitle: z.string().min(1).max(500).optional(),
  address: z
    .object({
      formattedAddress: z.string().min(1),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  contactDetails: z
    .object({
      phoneNumber: z.string().min(1),
      email: z.string().email(),
      workPhoneNumber: z.string().min(1),
    })
    .optional(),
  jobNumber: z.string().min(1).max(50).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  description: z.string().optional(),
  estimatedHours: z.coerce.number().optional().nullable(),
  photos: z.array(z.string()).optional(),
  status: z
    .enum([
      "Initiated",
      "Quotation",
      "Approved",
      "In Progress",
      "Completed",
      "Invoiced",
    ])
    .optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
})
  .omit({
    id: true,
  })
  .partial();

// Type Definitions
export type Job = z.infer<typeof selectJobSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
