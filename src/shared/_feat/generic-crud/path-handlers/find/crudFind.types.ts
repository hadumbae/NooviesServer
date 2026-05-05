/**
 * @fileoverview Type definitions for the generic "Find" CRUD operation.
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/_feat/generic-crud/types";
import type {Expression, FilterQuery} from "mongoose";

/** Specific configuration for the "Find" database operation. */
export type FindDocumentsConfig<TModel extends BaseModel> = BaseCRUDParams<TModel> & {
    filters?: FilterQuery<TModel>;
    sorts?: Record<string, 1 | -1 | Expression.Meta>;
};