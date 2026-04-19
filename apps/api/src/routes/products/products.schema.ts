import { products } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectProductSchema = createSelectSchema(products);

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = createInsertSchema(products)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type Product = z.infer<typeof selectProductSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
