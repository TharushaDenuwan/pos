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
  insertTaskSchema,
  selectTaskSchema,
  updateTaskSchema,
} from "./task.schema";

const tags: string[] = ["Task"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all tasks",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectTaskSchema)),
      "The list of tasks"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "An error occurred while fetching the tasks"
    ),
  },
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new task",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertTaskSchema, "The task to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectTaskSchema,
      "The created task"
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
  summary: "Get a single task by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTaskSchema, "Requested task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

// Update route definition
export const update = createRoute({
  tags,
  summary: "Update an existing task",
  path: "/{id}",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateTaskSchema, "The task to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTaskSchema, "The updated task"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Task not found"
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
  summary: "Delete a task",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Task deleted successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    ),
  },
});

export type ListTaskRoute = typeof list;
export type CreateTaskRoute = typeof create;
export type GetOneTaskRoute = typeof getOne;
export type UpdateTaskRoute = typeof update;
export type DeleteTaskRoute = typeof remove;
