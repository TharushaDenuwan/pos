import { savingsBank } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectSavingsBankSchema = createSelectSchema(savingsBank);

export const insertSavingsBankSchema = createInsertSchema(savingsBank, {
  date: z.coerce.date().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const updateSavingsBankSchema = createInsertSchema(savingsBank)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

export type SavingsBank = z.infer<typeof selectSavingsBankSchema>;
export type InsertSavingsBank = z.infer<typeof insertSavingsBankSchema>;
export type UpdateSavingsBank = z.infer<typeof updateSavingsBankSchema>;
