/**
 * @fileoverview Type definitions for generic CRUD controller factory handlers.
 */

import type {ControllerAsyncFunc} from "@/shared/types/ControllerTypes";
import type {BaseModel} from "@/shared/types/schema/BaseModel";
import type {PopulatePath} from "@/shared/types/mongoose/PopulatePath";
import type {Model} from "mongoose";
import type {DuplicateIndexHandler} from "@/shared/_feat/generic-crud/types/DuplicateIndexHandler";

/** Configuration parameters for generating a specific CRUD controller. */
export type CRUDControllerHandlerConfig<TModel extends BaseModel> = {
    model: Model<TModel>;
    populatePaths?: PopulatePath[];
    onDuplicateIndex?: DuplicateIndexHandler;
}

/** Function signature for generating standardized CRUD route handlers. */
export type CRUDControllerHandler<TModel extends BaseModel> = (
    params: CRUDControllerHandlerConfig<TModel>
) => ControllerAsyncFunc;