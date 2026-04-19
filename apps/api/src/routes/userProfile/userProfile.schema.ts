import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { userProfiles } from "@repo/database";

export const userProfile = createSelectSchema(userProfiles);

export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  userId: true,
});

export const userProfileUpdateSchema = createInsertSchema(userProfiles)
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type userProfileUpdateType = z.infer<typeof userProfileUpdateSchema>;
export type userProfile = z.infer<typeof userProfile>;
export type userProfileInsertType = z.infer<typeof userProfileInsertSchema>;
