import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { worker } from "@repo/database";

import type {
  CreateWorkerRoute,
  DeleteWorkerRoute,
  GetOneWorkerRoute,
  ListWorkerRoute,
  UpdateWorkerRoute,
} from "./worker.routes";

// List workers route handler
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

  // Build query conditions (search on name, email, phoneNumber)
  const query = db.query.worker.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.email, `%${search}%`),
            ilike(fields.phoneNumber, `%${search}%`)
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
    .from(worker)
    .where(
      search
        ? or(
            ilike(worker.name, `%${search}%`),
            ilike(worker.email, `%${search}%`),
            ilike(worker.phoneNumber, `%${search}%`)
          )
        : undefined
    );

  const [workerEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Map and normalize the data to match the expected response type
  const normalizedEntries = workerEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? 0,
    name: entry.name ?? "",
    email: entry.email ?? "",
    phoneNumber: entry.phoneNumber ?? "",
    availability: entry.availability ?? "Full Time",
    notes: entry.notes ?? null,
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

// Create new worker entry route handler
export const create: AppRouteHandler<CreateWorkerRoute> = async (c) => {
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

  const [inserted] = await db.insert(worker).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single worker entry route handler
export const getOne: AppRouteHandler<GetOneWorkerRoute> = async (c) => {
  const { id: idParam } = c.req.valid("param");
  const id = Number(idParam);

  const workerEntry = await db.query.worker.findFirst({
    where: eq(worker.id, id),
  });

  if (!workerEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const normalizedEntry = {
    ...workerEntry,
    id: workerEntry.id ?? 0,
    name: workerEntry.name ?? "",
    email: workerEntry.email ?? "",
    phoneNumber: workerEntry.phoneNumber ?? "",
    availability: workerEntry.availability ?? "Full Time",
    notes: workerEntry.notes ?? null,
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update worker entry route handler
export const update: AppRouteHandler<UpdateWorkerRoute> = async (c) => {
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

  // Check if worker entry exists
  const existingEntry = await db.query.worker.findFirst({
    where: eq(worker.id, id),
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
    .update(worker)
    .set(updateData)
    .where(eq(worker.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete worker entry route handler
export const remove: AppRouteHandler<DeleteWorkerRoute> = async (c) => {
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

  // Check if worker entry exists
  const existingEntry = await db.query.worker.findFirst({
    where: eq(worker.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the worker entry
  await db.delete(worker).where(eq(worker.id, id));

  return c.json({ message: "Worker deleted successfully" }, HttpStatusCodes.OK);
};
