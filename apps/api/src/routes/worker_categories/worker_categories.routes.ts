import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@api/lib/constants";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import {
  insertWorkerCategorySchema,
  selectWorkerCategorySchema,
  updateWorkerCategorySchema,
} from "./worker_categories.schema";

const tags: string[] = ["WorkerCategory"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all worker categories",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectWorkerCategorySchema)),
      "The list of worker categories"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the worker categories"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new worker category",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertWorkerCategorySchema,
      "The worker category to create"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectWorkerCategorySchema,
      "The created worker category"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single worker category by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkerCategorySchema,
      "Requested worker category"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Worker category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing worker category",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateWorkerCategorySchema,
      "The worker category to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkerCategorySchema,
      "The updated worker category"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Worker category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
  },
});

// Delete route definition
export const remove = createRoute({
  tags,
  summary: "Delete a worker category",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Worker category deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Worker category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListWorkerCategoryRoute = typeof list;
export type CreateWorkerCategoryRoute = typeof create;
export type GetOneWorkerCategoryRoute = typeof getOne;
export type UpdateWorkerCategoryRoute = typeof update;
export type DeleteWorkerCategoryRoute = typeof remove;
