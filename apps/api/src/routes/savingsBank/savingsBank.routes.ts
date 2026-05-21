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
    insertSavingsBankSchema,
    selectSavingsBankSchema,
    updateSavingsBankSchema,
} from "./savingsBank.schema";

const tags: string[] = ["SavingsBank"];

export const list = createRoute({
  tags,
  summary: "List all savings",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectSavingsBankSchema)),
      "The list of savings"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get saving by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectSavingsBankSchema, "The saving item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Saving not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create saving",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertSavingsBankSchema, "The saving to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectSavingsBankSchema, "The saving created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update saving",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateSavingsBankSchema, "The saving updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectSavingsBankSchema, "The updated saving"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Saving not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete saving",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Saving deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Saving not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
