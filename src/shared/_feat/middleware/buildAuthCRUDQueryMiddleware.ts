/**
 * @fileoverview Middleware factory that chains authentication and request query parsing middleware for generic CRUD operations.
 */

import isAuth from "@domains/authentication/middleware/isAuth";
import {parseQueryMatchStage} from "@shared/_feat/middleware/parseQueryMatchStage";
import {parseQuerySortStage} from "@shared/_feat/middleware/parseQuerySortStage";
import type {ZodType, ZodTypeDef} from "zod";
import type {RequestHandler} from "express";
import type {PipelineStage} from "mongoose";

/** Props configuration for the CRUD query middleware factory. */
type MiddlewareConfig = {
    modelName: string;
    matchSchema: ZodType<PipelineStage.Match, ZodTypeDef, unknown>;
    sortSchema: ZodType<PipelineStage.Sort, ZodTypeDef, unknown>;
};

/** Returns an array of request handlers for authentication, query matching, and sorting operations. */
export function buildAuthCRUDQueryMiddleware(
    {modelName, matchSchema, sortSchema}: MiddlewareConfig
): RequestHandler[] {
    return [
        isAuth,
        parseQueryMatchStage({schema: matchSchema, modelName}),
        parseQuerySortStage({schema: sortSchema, modelName}),
    ];
}