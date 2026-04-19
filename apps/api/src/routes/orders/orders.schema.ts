import { orders } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const updateOrderSchema = createInsertSchema(orders)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type Order = z.infer<typeof selectOrderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
