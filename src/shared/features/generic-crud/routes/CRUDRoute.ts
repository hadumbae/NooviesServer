/**
 * @file Router factory for generating standardized CRUD endpoints for any Mongoose model.
 * @filename CRUDRoute.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import {Router} from "express";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import type {BuildCRUDRoutesParams} from "@shared/features/generic-crud/routes/CRUDRoute.types";

/**
 * Automates the creation of an Express Router by mapping generic CRUD handlers to HTTP methods.
 * @param params - Configuration containing the model instance, population paths, and route definitions.
 * @returns A fully configured Express Router instance.
 */
export const buildCRUDRoutes = <TModel extends BaseModel = BaseModel>(
    {model, populatePaths, routes}: BuildCRUDRoutesParams<TModel>
) => {
    const router = Router();

    for (const {method, path, middleware, handler} of routes) {
        /** Initialize the handler factory with domain context and wrap for async safety. */
        router[method](path, middleware, asyncHandler(handler({model, populatePaths})));
    }

    return router;
}