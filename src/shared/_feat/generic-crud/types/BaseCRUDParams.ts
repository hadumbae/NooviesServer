/**
 * @fileoverview Base parameter contract for generic CRUD operations and repository methods.
 *
 */

import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {Model} from "mongoose";
import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";
import type {RequestOptions} from "@/shared/_feat/fetch-request-options/schemas";
import type {DuplicateIndexHandler} from "@/shared/_feat/generic-crud/types/DuplicateIndexHandler";

/**
 * Configuration object for executing database queries within a CRUD factory. */
export type BaseCRUDParams<TModel extends BaseModel> = {
    model: Model<TModel>;
    populatePaths?: PopulatePath[];
    onDuplicateIndex?: DuplicateIndexHandler;
    options?: RequestOptions;
}