import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { task } from "@repo/database";

import type {
  CreateTaskRoute,
  DeleteTaskRoute,
  GetOneTaskRoute,
  ListTaskRoute,
  UpdateTaskRoute,
} from "./task.routes";

// List tasks route handler
export const list: AppRouteHandler<ListTaskRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions (search on name, assignedWorker)
  const query = db.query.task.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.assignedWorker, `%${search}%`)
          )
        );
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
    .from(task)
    .where(
      search
        ? or(
            ilike(task.name, `%${search}%`),
            ilike(task.assignedWorker, `%${search}%`)
          )
        : undefined
    );

  const [taskEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Map and normalize the data to match the expected response type
  const normalizedEntries = taskEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? 0,
    jobId: entry.jobId ?? 0,
    name: entry.name ?? "",
    sequence: entry.sequence ?? 0,
    assignedWorker: entry.assignedWorker ?? null,
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

// Create new task entry route handler
export const create: AppRouteHandler<CreateTaskRoute> = async (c) => {
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

  const [inserted] = await db.insert(task).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single task entry route handler
export const getOne: AppRouteHandler<GetOneTaskRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);

  const taskEntry = await db.query.task.findFirst({
    where: eq(task.id, id),
  });

  if (!taskEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const normalizedEntry = {
    ...taskEntry,
    id: taskEntry.id ?? 0,
    jobId: taskEntry.jobId ?? 0,
    name: taskEntry.name ?? "",
    sequence: taskEntry.sequence ?? 0,
    assignedWorker: taskEntry.assignedWorker ?? null,
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update task entry route handler
export const update: AppRouteHandler<UpdateTaskRoute> = async (c) => {
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

  // Check if task entry exists
  const existingEntry = await db.query.task.findFirst({
    where: eq(task.id, id),
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
    .update(task)
    .set(updateData)
    .where(eq(task.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete task entry route handler
export const remove: AppRouteHandler<DeleteTaskRoute> = async (c) => {
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

  // Check if task entry exists
  const existingEntry = await db.query.task.findFirst({
    where: eq(task.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the task entry
  await db.delete(task).where(eq(task.id, id));

  return c.json({ message: "Task deleted successfully" }, HttpStatusCodes.OK);
};
