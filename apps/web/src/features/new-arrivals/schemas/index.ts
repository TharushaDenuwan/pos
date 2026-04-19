import { z } from "zod";

export const selectNewArrivalSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
  images: z.array(z.string()).nullable().optional(),
  category: z.string().nullable().optional(),
  isFeatured: z.boolean().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

export const insertNewArrivalSchema = selectNewArrivalSchema.omit({
  id: true,
});

export const updateNewArrivalSchema = insertNewArrivalSchema.partial();

export type NewArrivalOps = z.infer<typeof selectNewArrivalSchema>;
export type InsertNewArrival = z.infer<typeof insertNewArrivalSchema>;
export type UpdateNewArrival = z.infer<typeof updateNewArrivalSchema>;
