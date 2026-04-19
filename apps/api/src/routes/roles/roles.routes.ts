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
    insertRoleSchema,
    selectRoleSchema,
    updateRoleSchema,
} from "./roles.schema";

const tags: string[] = ["Roles"];

export const list = createRoute({
  tags,
  summary: "List all roles",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectRoleSchema)),
      "The list of roles"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get role by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRoleSchema, "The role item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Role not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create role",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertRoleSchema, "The role to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectRoleSchema, "The role created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update role",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateRoleSchema, "The role updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRoleSchema, "The updated role"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Role not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete role",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Role deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Role not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
