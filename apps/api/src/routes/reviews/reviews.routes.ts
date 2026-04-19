import {
    errorMessageSchema,
    getPaginatedSchema,
    queryParamsSchema,
    stringIdParamSchema,
} from "@api/lib/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
    insertReviewSchema,
    selectReviewSchema,
    updateReviewSchema,
} from "./reviews.schema";

const tags: string[] = ["Reviews"];

export const list = createRoute({
  tags,
  summary: "List all reviews",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectReviewSchema)),
      "The list of reviews"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get review by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectReviewSchema, "The review item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Review not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create review",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertReviewSchema, "The review to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectReviewSchema, "The review created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update review",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateReviewSchema, "The review updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectReviewSchema, "The updated review"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Review not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete review",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Review deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Review not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
