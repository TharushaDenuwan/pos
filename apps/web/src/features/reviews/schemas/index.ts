import { z } from "zod";

export const selectReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerName: z.string().nullable().optional(),
  customerEmail: z.string().nullable().optional(),
  rating: z.number().nullable().optional(),
  comment: z.string().nullable().optional(),
  isApproved: z.boolean().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const insertReviewSchema = selectReviewSchema.omit({ id: true, createdAt: true });

export type SelectReview = z.infer<typeof selectReviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
