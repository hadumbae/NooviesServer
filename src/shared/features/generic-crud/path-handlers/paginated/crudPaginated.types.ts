/**
 * @file Type definitions for the generic "Paginated" CRUD operation.
 * @filename crudPaginated.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";
import type {FilterQuery} from "mongoose";

/**
 * Specific configuration for the document counting operation.
 * ---
 */
export type CountDocumentsParams<TModel extends BaseModel> = Pick<BaseCRUDParams<TModel>, "model"> & {
    /** Criteria used to narrow down the document count. */
    filters?: FilterQuery<TModel>;
};

/**
 * Specific configuration for the paginated document fetch operation.
 * ---
 */
export type GetPaginatedDocumentsConfig<TModel extends BaseModel> = BaseCRUDParams<TModel> & {
    /** Criteria used to filter the documents before applying pagination offsets. */
    filters?: FilterQuery<TModel>;
};