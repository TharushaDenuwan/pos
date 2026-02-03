import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@api/lib/helpers";
import { productSchema } from "../products/product.zod";
import {
  categorySchema,
  categoryWithSubCategories,
  newCategorySchema,
  newSubcategorySchema,
  subcategorySchema,
  updateCategorySchema
} from "./categories.zod";

const tags: string[] = ["Product Categories"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all Product Categories",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(categoryWithSubCategories)),
      "The list of all product categories (Populated with all Subcategories per each)"
    )
  }
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a Product Category",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      newCategorySchema,
      "The category details to create"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      categorySchema,
      "The created Category"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "User must be authenticated for create new category"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong while creating the category"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    )
  }
});

// Get single product route definition
export const getOne = createRoute({
  tags,
  summary: "Get Product Category",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      categoryWithSubCategories,
      "Requested category with all sub-categories"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid ID format"
    )
  }
});

// Patch route definition
export const patch = createRoute({
  tags,
  summary: "Update a Product Category",
  path: "/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateCategorySchema, "Category update details")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(categorySchema, "The updated category"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Category not updated, something went wrong"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    )
  }
});

// Remove product route definition
export const remove = createRoute({
  tags,
  summary: "Remove a Product Category",
  path: "/{id}",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // just used to send message zod object as response
      "Successfully deleted product category !"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Category not deleted, something went wrong"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Product category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid ID format"
    )
  }
});

export const addSubcategory = createRoute({
  tags,
  summary: "Add a Product Subcategory",
  path: "/{id}/subcategory",
  method: "post",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      newSubcategorySchema,
      "The subcategory details to create"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      subcategorySchema,
      "The created Category with the new Subcategory"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "User must be authenticated for create new subcategory"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something went wrong while creating the subcategory"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    )
  }
});

export const removeSubcategory = createRoute({
  tags,
  summary: "Remove a Product Subcategory",
  path: "/{id}/subcategory/{subcategoryId}",
  method: "delete",
  request: {
    params: stringIdParamSchema.extend({
      subcategoryId: z.string()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // just used to send message zod object as response
      "Successfully deleted product category !"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthenticated requests are forbidden"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Category not deleted, something went wrong"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Product category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid ID format"
    )
  }
});

// Get products by category route definition
export const getProductsByCategory = createRoute({
  tags,
  summary: "Get Products by Category",
  method: "get",
  path: "/{id}/products",
  request: {
    params: stringIdParamSchema,
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(productSchema.omit({ variants: true }))),
      "Requested products by category (without variants)"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid ID format"
    )
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
export type AddSubcategoryRoute = typeof addSubcategory;
export type RemoveSubcategoryRoute = typeof removeSubcategory;

// Products
export type ProductsByCategoryRoute = typeof getProductsByCategory;
