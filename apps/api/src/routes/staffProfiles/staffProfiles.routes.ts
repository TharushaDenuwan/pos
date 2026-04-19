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
    insertStaffProfileSchema,
    registerStaffSchema,
    selectStaffProfileSchema,
    staffProfileWithUserSchema,
    updateStaffProfileSchema,
} from "./staffProfiles.schema";

const tags: string[] = ["StaffProfiles"];

export const list = createRoute({
  tags,
  summary: "List all staff profiles",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(staffProfileWithUserSchema)),
      "The list of staff profiles"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get staff profile by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectStaffProfileSchema, "The staff profile item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Staff profile not found"),
  },
});

export const create = createRoute({
  tags,
  summary: "Create staff profile",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(insertStaffProfileSchema, "The staff profile to create"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(selectStaffProfileSchema, "The staff profile created"),
  },
});

export const update = createRoute({
  tags,
  summary: "Update staff profile",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateStaffProfileSchema, "The staff profile updates"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectStaffProfileSchema, "The updated staff profile"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Staff profile not found"),
  },
});

export const remove = createRoute({
  tags,
  summary: "Delete staff profile",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Staff profile deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Staff profile not found"),
  },
});

export const register = createRoute({
  tags,
  summary: "Register new staff member",
  method: "post",
  path: "/register",
  request: {
    body: jsonContentRequired(registerStaffSchema, "The staff member to register"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        user: z.any(),
        profile: selectStaffProfileSchema,
      }),
      "The registered staff member"
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(errorMessageSchema, "Email already exists"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type RegisterRoute = typeof register;
