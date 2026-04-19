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
    insertProductSchema,
    selectProductSchema,
    updateProductSchema,
} from "./products.schema";

const tags: string[] = ["Products"];

const productQuerySchema = queryParamsSchema.extend({
  category: z.string().optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
});

export const list = createRoute({
  tags,
  summary: "List all products",
  path: "/",
  method: "get",
  request: {
    query: productQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectProductSchema)),
      "The list of products"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get product by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The product item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Product not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create product",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertProductSchema, "The product to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectProductSchema, "The product created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update product",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateProductSchema, "The product updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectProductSchema, "The updated product"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Product not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete product",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Product deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Product not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
