/**
 * @fileoverview Router factory for generating standardized CRUD endpoints for any Mongoose model.
 */

import type {BaseModel} from "@/shared/types/schema/BaseModel";
import {Router} from "express";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import type {BuildCRUDRoutesParams} from "@/shared/_feat/generic-crud/routes/CRUDRoutesFactory.types";

/**
 * Generates an Express Router by mapping generic CRUD handlers to HTTP methods.
 */
export const buildCRUDRoutes = <TModel extends BaseModel = BaseModel>(
    {model, populatePaths, onDuplicateIndex, routes}: BuildCRUDRoutesParams<TModel>
) => {
    const router = Router();

    for (const {method, path, middleware, handler} of routes) {
        router[method](path, middleware, asyncHandler(handler({model, populatePaths, onDuplicateIndex})));
    }

    return router;
}