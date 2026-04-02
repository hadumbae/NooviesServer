/**
 * @file Base parameter contract for generic CRUD operations and repository methods.
 * @filename BaseCRUDParams.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Model} from "mongoose";
import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";
import type {RequestOptions} from "@shared/features/fetch-request-options/schemas";

/**
 * Standardized configuration object for executing database queries within a CRUD factory.
 */
export type BaseCRUDParams<TModel extends BaseModel> = {
    /** The Mongoose model instance used for performing database operations. */
    model: Model<TModel>;

    /**
     * Optional paths to populate on the retrieved documents.
     * Used for defining document relationships during query execution.
     */
    populatePaths?: PopulatePath[];

    /**
     * Optional request-level modifiers.
     * @see {@link RequestOptions} for pagination, limit, and virtuals configuration.
     */
    options?: RequestOptions;
}