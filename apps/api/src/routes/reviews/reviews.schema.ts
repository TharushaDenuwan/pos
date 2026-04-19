import { reviews } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectReviewSchema = createSelectSchema(reviews);

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const updateReviewSchema = createInsertSchema(reviews)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type Review = z.infer<typeof selectReviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
