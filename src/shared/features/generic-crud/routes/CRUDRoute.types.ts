/**
 * @file Type definitions for the generic CRUD routing system.
 * @filename CRUDRoute.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Model} from "mongoose";
import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";
import type {RequestHandler} from "express";
import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";

/** Supported HTTP verbs for the generic CRUD router. */
export type CRUDRouteMethods =
    | "get"
    | "post"
    | "patch"
    | "delete";

/**
 * Definition for a single generic endpoint within a CRUD factory.
 */
export type CRUDRoute<TModel extends BaseModel = BaseModel> = {
    /** The HTTP method to be used for the route. */
    method: CRUDRouteMethods;

    /** The relative URL path for the endpoint. */
    path: string;

    /** * An array of Express middleware (e.g., Auth, Validation) to execute
     * before the main handler.
     */
    middleware: RequestHandler[];

    /** The higher-order function that generates the actual controller logic. */
    handler: CRUDRouteHandler<TModel>;
};

/**
 * Parameter contract for the {@link buildCRUDRoutes} factory function.
 */
export type BuildCRUDRoutesParams<TModel extends BaseModel> = {
    /** The Mongoose model instance associated with these routes. */
    model: Model<TModel>;

    /** Global population paths applied to all relevant handlers in this router. */
    populatePaths: PopulatePath[];

    /** List of route configurations to be instantiated. */
    routes: CRUDRoute<TModel>[];
}