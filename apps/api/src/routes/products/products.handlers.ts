import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { products } from "@repo/database";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type {
    CreateRoute,
    GetByIdRoute,
    ListRoute,
    RemoveRoute,
    UpdateRoute,
} from "./products.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page = "1", limit = "10", category, isFeatured, search, sort } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];

  if (category) {
    // Case-insensitive category match
    // Or exact match if categories are strict enum-like strings
    // Let's assume strict slug or name match for now, but case-insensitive is safer for user input
    conditions.push(eq(products.category, category));
  }

  if (isFeatured) {
    conditions.push(eq(products.isFeatured, isFeatured === "true"));
  }

  if (search) {
    conditions.push(like(products.name, `%${search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy: any;
  // Default Sort
  if (!sort || sort === "newest") {
    orderBy = desc(products.createdAt);
  } else if (sort === "price_asc") {
    orderBy = asc(products.price);
  } else if (sort === "price_desc") {
    orderBy = desc(products.price);
  }

  const data = await db.query.products.findMany({
    limit: limitNum,
    offset,
    where,
    orderBy,
  });

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where);

  const totalCount = Number(totalCountResult?.count ?? 0);
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data,
      meta: {
        totalCount,
        limit: limitNum,
        currentPage: pageNum,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const [inserted] = await db.insert(products).values(body).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const item = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!item) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(item, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [updated] = await db
    .update(products)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
