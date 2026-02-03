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
  insertJobSchema,
  selectJobSchema,
  updateJobSchema,
} from "./job.schema";

const tags: string[] = ["Job"];

// List all jobs (no status filter)
export const list = createRoute({
  tags,
  summary: "List all jobs",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectJobSchema)),
      "The list of jobs"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the jobs"
    ),
  },
});

// List jobs by status
export const listByStatus = createRoute({
  tags,
  summary: "List jobs by status",
  path: "/by-status",
  method: "get",
  request: {
    query: queryParamsSchema.extend({
      status: z.string().optional().describe("Job status to filter by"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectJobSchema)),
      "The list of jobs filtered by status"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the jobs"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new job",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertJobSchema, "The job to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectJobSchema, "The created job"),
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

export const route = createRoute({
  tags,
  summary: "Get jobs by custom route logic",
  path: "/route",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectJobSchema)),
      "Jobs returned by custom route logic"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching jobs"
    ),
  },
});

export const getOne = createRoute({
  tags,
  summary: "Get a single job by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectJobSchema, "Requested job"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Job not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing job",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateJobSchema, "The job to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectJobSchema, "The updated job"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Job not found"
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
  summary: "Delete a job",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Job deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Job not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListRoute = typeof list;
export type ListByStatusRoute = typeof listByStatus;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteRoute = typeof remove;
