/**
 * @file Type definition for generic CRUD (Create, Read, Update, Delete) controller factory handlers.
 * @filename CRUDRouteHandler.ts
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";
import type {Model} from "mongoose";

/**
 * Configuration parameters for generating a specific CRUD controller.
 */
export type CRUDRouteHandlerParams<TModel extends BaseModel> = {
    /** The Mongoose model instance used for database operations. */
    model: Model<TModel>;

    /**
     * Optional list of paths to populate on the retrieved documents.
     * Allows the factory to pre-define document relationships for specific routes.
     */
    populatePaths?: PopulatePath[];
}

/**
 * High-level function signature for generating standardized CRUD route handlers.
 * @param params - Configuration object including the model and optional populate logic.
 * @returns An asynchronous Express controller function.
 */
export type CRUDRouteHandler = <TModel extends BaseModel>(params: CRUDRouteHandlerParams<TModel>) => ControllerAsyncFunc;