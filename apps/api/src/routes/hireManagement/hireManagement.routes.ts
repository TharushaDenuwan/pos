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
    insertHireManagementSchema,
    selectHireManagementSchema,
    updateHireManagementSchema,
} from "./hireManagement.schema";

const tags: string[] = ["HireManagement"];

export const list = createRoute({
  tags,
  summary: "List all hire management entries",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectHireManagementSchema)),
      "The list of hire management entries"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get hire management entry by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectHireManagementSchema, "The hire management entry"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Hire management entry not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create hire management entry",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertHireManagementSchema, "The hire management entry to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectHireManagementSchema, "The hire management entry created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update hire management entry",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateHireManagementSchema, "The hire management entry updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectHireManagementSchema, "The updated hire management entry"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Hire management entry not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete hire management entry",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Hire management entry deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Hire management entry not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
