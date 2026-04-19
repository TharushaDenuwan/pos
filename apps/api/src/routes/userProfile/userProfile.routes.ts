import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import {
  userProfile,
  userProfileInsertSchema,
  userProfileUpdateSchema,
} from "./userProfile.schema";

const tags: string[] = ["UserProfile"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all userProfile",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(userProfile)),
      "The list of userProfile"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Get by ID route definition
export const getById = createRoute({
  tags,
  summary: "Get userProfile by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userProfile, "The userProfile item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "UserProfile not found"
    ),
  },
});

// Create UserProfile route definition
export const create = createRoute({
  tags,
  summary: "Create userProfile",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      userProfileInsertSchema,
      "Create uploaded userProfile"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      userProfile,
      "The userProfile created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "UserProfile not created"
    ),
  },
});

// Update userProfile route definition
export const update = createRoute({
  tags,
  summary: "Update UserProfile",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      userProfileUpdateSchema,
      "Update userProfile details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userProfileUpdateSchema,
      "The userProfile item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["UserProfile"],
  summary: "Delete a user profile",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    204: {
      description: "No Content",
      content: {
        "application/json": {
          schema: z.null(),
        },
      },
    },
    401: jsonContent(errorMessageSchema, "Unauthorized"),
    404: jsonContent(errorMessageSchema, "Not Found"),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
