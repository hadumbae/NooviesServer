/**
 * @file Base parameter contract for generic CRUD operations and repository methods.
 * @filename BaseCRUDParams.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Model} from "mongoose";
import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";
import type {RequestOptions} from "@shared/_feat/fetch-request-options/schemas";

/**
 * Standardized configuration object for executing database queries within a CRUD factory.
 */
export type BaseCRUDParams<TModel extends BaseModel> = {
    model: Model<TModel>;
    populatePaths?: PopulatePath[];
    options?: RequestOptions;
}