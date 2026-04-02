/**
 * @file Type definitions for the generic "Paginated" CRUD operation.
 * @filename crudPaginated.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";

/**
 * Specific configuration for the document counting operation.
 * ---
 */
export type CountDocumentsParams<TModel extends BaseModel> = Pick<BaseCRUDParams<TModel>, "model">;

/**
 * Specific configuration for the paginated document fetch operation.
 */
export type GetPaginatedDocumentsParams<TModel extends BaseModel> = BaseCRUDParams<TModel>;