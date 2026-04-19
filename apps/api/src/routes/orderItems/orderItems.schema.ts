import { orderItems } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectOrderItemSchema = createSelectSchema(orderItems);

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const updateOrderItemSchema = createInsertSchema(orderItems)
  .omit({
    id: true,
  })
  .partial();

export type OrderItem = z.infer<typeof selectOrderItemSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof updateOrderItemSchema>;
