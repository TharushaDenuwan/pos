import { categories, subcategories } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Categories schema definitions and type definitions
export const categorySchema = createSelectSchema(categories);

export type Category = z.infer<typeof categorySchema>;

export const subcategorySchema = createSelectSchema(subcategories);

export type SubCategory = z.infer<typeof subcategorySchema>;

export const categoryWithSubCategories = categorySchema.extend({
  subcategories: z.array(subcategorySchema)
});

export type CategoryWithSubcategories = z.infer<
  typeof categoryWithSubCategories
>;

// ----------------------------------------------

export const newCategorySchema = createInsertSchema(categories).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true
});

export type NewCategoryT = z.infer<typeof newCategorySchema>;

export const newSubcategorySchema = createInsertSchema(subcategories).omit({
  id: true,
  slug: true,
  parentCategoryId: true,
  createdAt: true,
  updatedAt: true
});

export type NewSubcategoryT = z.infer<typeof newSubcategorySchema>;

// ----------------------------------------------

export const updateCategorySchema = createInsertSchema(categories)
  .partial()
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true
  });

export type UpdateCategoryT = z.infer<typeof updateCategorySchema>;
