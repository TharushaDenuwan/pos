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
    insertNewArrivalSchema,
    selectNewArrivalSchema,
    updateNewArrivalSchema,
} from "./newArrivals.schema";

const tags: string[] = ["NewArrivals"];

export const list = createRoute({
  tags,
  summary: "List all new arrivals",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectNewArrivalSchema)),
      "The list of new arrivals"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get new arrival by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectNewArrivalSchema, "The new arrival item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "New arrival not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create new arrival",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertNewArrivalSchema, "The new arrival to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectNewArrivalSchema, "The new arrival created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update new arrival",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateNewArrivalSchema, "The new arrival updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectNewArrivalSchema, "The updated new arrival"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "New arrival not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete new arrival",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "New arrival deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "New arrival not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
