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
  insertWorkerSkillSchema,
  selectWorkerSkillSchema,
  updateWorkerSkillSchema,
} from "./worker_skills.schema";

const tags: string[] = ["WorkerSkill"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all worker skills",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectWorkerSkillSchema)),
      "The list of worker skills"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the worker skills"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new worker skill",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertWorkerSkillSchema,
      "The worker skill to create"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectWorkerSkillSchema,
      "The created worker skill"
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
  summary: "Get a single worker skill by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkerSkillSchema,
      "Requested worker skill"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Worker skill not found"
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
  summary: "Update an existing worker skill",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateWorkerSkillSchema,
      "The worker skill to update"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectWorkerSkillSchema,
      "The updated worker skill"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Worker skill not found"
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
  summary: "Delete a worker skill",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Worker skill deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Worker skill not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListWorkerSkillRoute = typeof list;
export type CreateWorkerSkillRoute = typeof create;
export type GetOneWorkerSkillRoute = typeof getOne;
export type UpdateWorkerSkillRoute = typeof update;
export type DeleteWorkerSkillRoute = typeof remove;
