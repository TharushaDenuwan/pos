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
    insertUserSchema,
    selectUserSchema,
    updateUserSchema,
} from "./users.schema";

const tags: string[] = ["Users"];

export const list = createRoute({
  tags,
  summary: "List all users",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectUserSchema)),
      "The list of users"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get user by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserSchema, "The user item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "User not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create user",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertUserSchema, "The user to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectUserSchema, "The user created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update user",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateUserSchema, "The user updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUserSchema, "The updated user"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "User not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete user",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "User deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "User not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
