import { newArrivals } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectNewArrivalSchema = createSelectSchema(newArrivals);

export const insertNewArrivalSchema = createInsertSchema(newArrivals).omit({
  id: true,
});

export const updateNewArrivalSchema = createInsertSchema(newArrivals)
  .omit({
    id: true,
  })
  .partial();

export type NewArrival = z.infer<typeof selectNewArrivalSchema>;
export type InsertNewArrival = z.infer<typeof insertNewArrivalSchema>;
export type UpdateNewArrival = z.infer<typeof updateNewArrivalSchema>;
