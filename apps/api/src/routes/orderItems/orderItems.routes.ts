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
    insertOrderItemSchema,
    selectOrderItemSchema,
    updateOrderItemSchema,
} from "./orderItems.schema";

const tags: string[] = ["OrderItems"];

export const list = createRoute({
  tags,
  summary: "List all order items",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectOrderItemSchema)),
      "The list of order items"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get order item by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectOrderItemSchema, "The order item item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Order item not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create order item",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertOrderItemSchema, "The order item to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectOrderItemSchema, "The order item created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update order item",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateOrderItemSchema, "The order item updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectOrderItemSchema, "The updated order item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Order item not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete order item",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Order item deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Order item not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
