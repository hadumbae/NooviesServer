/**
 * @file Express middleware factory for validating and attaching query options to the request object.
 * @filename parseQueryOptions.ts
 */

import {type ZodTypeAny} from "zod";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import {parseModelQueryOptions} from "@shared/utility/request/parseModelQueryOptions";

/**
 * Configuration for the query parsing middleware.
 * ---
 */
type ParseParams<TSchema extends ZodTypeAny> = {
    /** The Zod schema used to validate and transform the incoming `req.query`. */
    schema: TSchema;
    /** Optional model name for contextual error messages in {@link InvalidRequestQueryError}. */
    modelName?: string;
}

/**
 * Higher-order middleware that intercepts the request to validate URL search parameters.
 * ---
 * @param params - The schema to validate against and optional model metadata.
 * @returns A standard Express middleware function.
 */
export function parseQueryOptions<TSchema extends ZodTypeAny>(
    {schema, modelName}: ParseParams<TSchema>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        req.queryOptions = parseModelQueryOptions({
            req,
            schema,
            modelName,
        });

        next();
    }
}