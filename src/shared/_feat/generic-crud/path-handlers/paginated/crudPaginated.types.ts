/**
 * @fileoverview Type definitions for the generic "Paginated" CRUD operation.
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/_feat/generic-crud/types";
import type {Expression, FilterQuery} from "mongoose";

/** Specific configuration for the document counting operation. */
export type CountDocumentsParams<TModel extends BaseModel> = Pick<BaseCRUDParams<TModel>, "model"> & {
    filters?: FilterQuery<TModel>;
};

/** Specific configuration for the paginated document fetch operation. */
export type GetPaginatedDocumentsConfig<TModel extends BaseModel> = BaseCRUDParams<TModel> & {
    filters?: FilterQuery<TModel>;
    sorts?: Record<string, 1 | -1 | Expression.Meta>;
};