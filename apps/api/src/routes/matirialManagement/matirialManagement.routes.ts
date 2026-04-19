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
    insertMaterialManagementSchema,
    selectMaterialManagementSchema,
    updateMaterialManagementSchema,
} from "./matirialManagement.schema";

const tags: string[] = ["MaterialManagement"];

export const list = createRoute({
  tags,
  summary: "List all material management entries",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectMaterialManagementSchema)),
      "The list of material management entries"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get material management entry by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMaterialManagementSchema, "The material management entry"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Material management entry not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create material management entry",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertMaterialManagementSchema, "The material management entry to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectMaterialManagementSchema, "The material management entry created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update material management entry",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateMaterialManagementSchema, "The material management entry updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectMaterialManagementSchema, "The updated material management entry"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Material management entry not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete material management entry",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Material management entry deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Material management entry not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
