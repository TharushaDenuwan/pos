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
    insertOrderSchema,
    selectOrderSchema,
    updateOrderSchema,
} from "./orders.schema";

const tags: string[] = ["Orders"];

export const list = createRoute({
  tags,
  summary: "List all orders",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectOrderSchema)),
      "The list of orders"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get order by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectOrderSchema, "The order item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Order not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create order",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertOrderSchema, "The order to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectOrderSchema, "The order created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update order",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateOrderSchema, "The order updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectOrderSchema, "The updated order"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Order not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete order",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Order deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Order not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
