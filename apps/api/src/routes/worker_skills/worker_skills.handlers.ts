import { desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { worker_skills } from "@repo/database";

import type {
  CreateWorkerSkillRoute,
  DeleteWorkerSkillRoute,
  GetOneWorkerSkillRoute,
  ListWorkerSkillRoute,
  UpdateWorkerSkillRoute,
} from "./worker_skills.routes";

// List worker skills route handler
export const list: AppRouteHandler<ListWorkerSkillRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions (search on skill)
  const query = db.query.worker_skills.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];
      if (search) {
        conditions.push(ilike(fields.skill, `%${search}%`));
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
    .from(worker_skills)
    .where(search ? ilike(worker_skills.skill, `%${search}%`) : undefined);

  const [skillEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Map and normalize the data to match the expected response type
  const normalizedEntries = skillEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? 0,
    workerId: entry.workerId ?? 0,
    skill: entry.skill ?? "",
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

// Create new worker skill entry route handler
export const create: AppRouteHandler<CreateWorkerSkillRoute> = async (c) => {
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
    .insert(worker_skills)
    .values(insertData)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single worker skill entry route handler
export const getOne: AppRouteHandler<GetOneWorkerSkillRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);

  const skillEntry = await db.query.worker_skills.findFirst({
    where: eq(worker_skills.id, id),
  });

  if (!skillEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const normalizedEntry = {
    ...skillEntry,
    id: skillEntry.id ?? 0,
    workerId: skillEntry.workerId ?? 0,
    skill: skillEntry.skill ?? "",
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update worker skill entry route handler
export const update: AppRouteHandler<UpdateWorkerSkillRoute> = async (c) => {
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

  // Check if worker skill entry exists
  const existingEntry = await db.query.worker_skills.findFirst({
    where: eq(worker_skills.id, id),
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
    .update(worker_skills)
    .set(updateData)
    .where(eq(worker_skills.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete worker skill entry route handler
export const remove: AppRouteHandler<DeleteWorkerSkillRoute> = async (c) => {
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

  // Check if worker skill entry exists
  const existingEntry = await db.query.worker_skills.findFirst({
    where: eq(worker_skills.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the worker skill entry
  await db.delete(worker_skills).where(eq(worker_skills.id, id));

  return c.json(
    { message: "Worker skill deleted successfully" },
    HttpStatusCodes.OK
  );
};
