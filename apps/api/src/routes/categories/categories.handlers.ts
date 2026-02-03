import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { categories, products, subcategories } from "@repo/database/schemas";

import { toKebabCase } from "../../lib/helpers";
import type {
  AddSubcategoryRoute,
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  ProductsByCategoryRoute,
  RemoveRoute,
  RemoveSubcategoryRoute
} from "./categories.routes";

// List products route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.categories.findMany({
    with: { subcategories: true },
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    }
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(search ? ilike(categories.name, `%${search}%`) : undefined);

  const [categoryEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: categoryEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

// Create product route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  // Validate Authentication
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Handle Product Category Creation
  const body = c.req.valid("json");
  const slug = toKebabCase(body.name);

  const [inserted] = await db
    .insert(categories)
    .values({ ...body, slug })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Category creation failed"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get product category by ID route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const categoryWithSubCategories = await db.query.categories.findFirst({
    with: { subcategories: true },
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!categoryWithSubCategories) {
    return c.json(
      {
        message: "Category not found"
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(categoryWithSubCategories, HttpStatusCodes.OK);
};

// Update product category by ID route handler
export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const existingCategory = await db.query.categories.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingCategory) {
    return c.json(
      {
        message: "Category not found"
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [updated] = await db
    .update(categories)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();

  if (!updated) {
    return c.json(
      {
        message: "Category update failed"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete product category by ID route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const { id } = c.req.valid("param");

  const existingCategory = await db.query.categories.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingCategory) {
    return c.json(
      {
        message: "Category not found"
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  if (!deleted) {
    return c.json(
      {
        message: "Category deletion failed"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(
    {
      message: "Category deleted successfully"
    },
    HttpStatusCodes.OK
  );
};

// Add subcategory route handler
export const addSubcategory: AppRouteHandler<AddSubcategoryRoute> = async (
  c
) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const slug = toKebabCase(body.name);

  const existingCategory = await db.query.categories.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingCategory) {
    return c.json(
      {
        message: "Category not found"
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [inserted] = await db
    .insert(subcategories)
    .values({ ...body, slug, parentCategoryId: id })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Subcategory creation failed"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Remove subcategory route handler
export const removeSubcategory: AppRouteHandler<
  RemoveSubcategoryRoute
> = async (c) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const { id, subcategoryId } = c.req.valid("param");

  const existingCategory = await db.query.categories.findFirst({
    where: (fields, { eq }) => eq(fields.id, id)
  });

  if (!existingCategory) {
    return c.json(
      {
        message: "Category not found"
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [deleted] = await db
    .delete(subcategories)
    .where(eq(subcategories.id, subcategoryId))
    .returning();

  if (!deleted) {
    return c.json(
      {
        message: "Subcategory deletion failed"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(
    {
      message: "Subcategory deleted successfully"
    },
    HttpStatusCodes.OK
  );
};

export const productsByCategory: AppRouteHandler<
  ProductsByCategoryRoute
> = async (c) => {
  const { id: categoryId } = c.req.valid("param");
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.products.findMany({
    with: { images: true, variants: true },
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [];

      // Get category ID from request parameters
      conditions.push(eq(fields.categoryId, categoryId));

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }

      return desc(fields.createdAt);
    }
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(
      search
        ? and(
            ilike(products.name, `%${search}%`),
            eq(products.categoryId, categoryId)
          )
        : undefined
    );

  const [productsEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  // Remove variants from products
  const preparedProductsEntries = productsEntries.map((product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variants, ...productWithoutVariants } = product;
    return productWithoutVariants;
  });

  return c.json(
    {
      data: preparedProductsEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};
