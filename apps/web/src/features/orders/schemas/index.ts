import { z } from "zod";

export const selectOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerName: z.string().nullable().optional(),
  customerEmail: z.string().nullable().optional(),
  customerPhone: z.string().nullable().optional(),
  customerAddress: z.string().nullable().optional(),
  totalAmount: z.number().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
});

export const insertOrderSchema = selectOrderSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type SelectOrder = z.infer<typeof selectOrderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
