import { desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { staffProfiles } from "@repo/database";

import type {
    CreateWorkerRoute,
    DeleteWorkerRoute,
    GetOneWorkerRoute,
    ListWorkerRoute,
    UpdateWorkerRoute,
} from "./worker.routes";

// List staff profiles route handler
export const list: AppRouteHandler<ListWorkerRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const query = db.query.staffProfiles.findMany({
    limit: limitNum,
    offset,
    with: {
      user: true,
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.id;
      }
      return desc(fields.id);
    },
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(staffProfiles);

  const [entries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: entries,
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

// Create new staff profile route handler
export const create: AppRouteHandler<CreateWorkerRoute> = async (c) => {
  const body = c.req.valid("json");
  const [inserted] = await db.insert(staffProfiles).values(body).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single staff profile route handler
export const getOne: AppRouteHandler<GetOneWorkerRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const entry = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.id, id),
    with: {
      user: true,
    }
  });

  if (!entry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(entry, HttpStatusCodes.OK);
};

// Update staff profile route handler
export const update: AppRouteHandler<UpdateWorkerRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [updated] = await db
    .update(staffProfiles)
    .set(body)
    .where(eq(staffProfiles.id, id))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete staff profile route handler
export const remove: AppRouteHandler<DeleteWorkerRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const deleted = await db.delete(staffProfiles).where(eq(staffProfiles.id, id)).returning();

  if (deleted.length === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json({ message: "Staff profile deleted successfully" }, HttpStatusCodes.OK);
};
