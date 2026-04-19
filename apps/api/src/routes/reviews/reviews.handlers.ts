import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { reviews } from "@repo/database";
import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type {
    CreateRoute,
    GetByIdRoute,
    ListRoute,
    RemoveRoute,
    UpdateRoute,
} from "./reviews.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page = "1", limit = "10" } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const data = await db.query.reviews.findMany({
    limit: limitNum,
    offset,
  });

  const [totalCountResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews);

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
  const [inserted] = await db.insert(reviews).values(body).returning();
  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const item = await db.query.reviews.findFirst({
    where: eq(reviews.id, id),
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
    .update(reviews)
    .set(updates)
    .where(eq(reviews.id, id))
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
  const [deleted] = await db.delete(reviews).where(eq(reviews.id, id)).returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
