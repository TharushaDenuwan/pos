import { desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { worker_categories } from "@repo/database";

import type {
  CreateWorkerCategoryRoute,
  DeleteWorkerCategoryRoute,
  GetOneWorkerCategoryRoute,
  ListWorkerCategoryRoute,
  UpdateWorkerCategoryRoute,
} from "./worker_categories.routes";

// List worker categories route handler
export const list: AppRouteHandler<ListWorkerCategoryRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions (search on category)
  const query = db.query.worker_categories.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];
      if (search) {
        conditions.push(ilike(fields.category, `%${search}%`));
      }
      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.id;
      }
      return desc(fields.id);
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(worker_categories)
    .where(
      search ? ilike(worker_categories.category, `%${search}%`) : undefined
    );

  const [categoryEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Map and normalize the data to match the expected response type
  const normalizedEntries = categoryEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? 0,
    workerId: entry.workerId ?? 0,
    category: entry.category ?? "",
  }));

  return c.json(
    {
      data: normalizedEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new worker category entry route handler
export const create: AppRouteHandler<CreateWorkerCategoryRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const insertData = {
    ...body,
  };

  const [inserted] = await db
    .insert(worker_categories)
    .values(insertData)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single worker category entry route handler
export const getOne: AppRouteHandler<GetOneWorkerCategoryRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);

  const categoryEntry = await db.query.worker_categories.findFirst({
    where: eq(worker_categories.id, id),
  });

  if (!categoryEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const normalizedEntry = {
    ...categoryEntry,
    id: categoryEntry.id ?? 0,
    workerId: categoryEntry.workerId ?? 0,
    category: categoryEntry.category ?? "",
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update worker category entry route handler
export const update: AppRouteHandler<UpdateWorkerCategoryRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if worker category entry exists
  const existingEntry = await db.query.worker_categories.findFirst({
    where: eq(worker_categories.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updateData = {
    ...body,
  };

  const [updated] = await db
    .update(worker_categories)
    .set(updateData)
    .where(eq(worker_categories.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete worker category entry route handler
export const remove: AppRouteHandler<DeleteWorkerCategoryRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if worker category entry exists
  const existingEntry = await db.query.worker_categories.findFirst({
    where: eq(worker_categories.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the worker category entry
  await db.delete(worker_categories).where(eq(worker_categories.id, id));

  return c.json(
    { message: "Worker category deleted successfully" },
    HttpStatusCodes.OK
  );
};
