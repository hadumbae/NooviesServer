/**
 * @fileoverview Type definitions for the generic CRUD routing system.
 */

import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {Model} from "mongoose";
import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";
import type {RequestHandler} from "express";
import type {CRUDControllerHandler, DuplicateIndexHandler} from "@/shared/_feat/generic-crud/types";

/** Supported HTTP verbs for the generic CRUD router. */
export type CRUDRouteMethods =
    | "get"
    | "post"
    | "patch"
    | "delete";

/** Definition for a single generic endpoint within a CRUD factory. */
export type CRUDRoute<TModel extends BaseModel = BaseModel> = {
    method: CRUDRouteMethods;
    path: string;
    middleware: RequestHandler[];
    handler: CRUDControllerHandler<TModel>;
};

/** Parameter contract for the buildCRUDRoutes factory function. */
export type BuildCRUDRoutesParams<TModel extends BaseModel, TInput = unknown> = {
    model: Model<TModel>;
    populatePaths?: PopulatePath[];
    onDuplicateIndex?: DuplicateIndexHandler;
    routes: CRUDRoute<TModel>[];
    deriveData?: (data: Partial<TInput>) => Promise<Partial<TModel>> | Partial<TModel>;
};