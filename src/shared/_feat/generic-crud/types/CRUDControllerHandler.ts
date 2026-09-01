/**
 * @fileoverview Type definitions for generic CRUD controller factory handlers.
 */

import type {ControllerAsyncFunc} from "@/shared/_types/controllers/ControllerTypes";
import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";
import type {Model} from "mongoose";
import type {DuplicateIndexHandler} from "@/shared/_feat/generic-crud/types/DuplicateIndexHandler";

/** Configuration parameters for generating a specific CRUD controller. */
export type CRUDControllerHandlerConfig<TModel extends BaseModel, TInput = unknown> = {
    model: Model<TModel>;
    populatePaths?: PopulatePath[];
    onDuplicateIndex?: DuplicateIndexHandler;
    deriveData?: (data: Partial<TInput>) => Promise<Partial<TModel>> | Partial<TModel>;
}

/** Function signature for generating standardized CRUD route handlers. */
export type CRUDControllerHandler<TModel extends BaseModel> = (
    params: CRUDControllerHandlerConfig<TModel>
) => ControllerAsyncFunc;