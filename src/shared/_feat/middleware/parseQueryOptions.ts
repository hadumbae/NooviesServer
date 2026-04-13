/**
 * @fileoverview Express middleware factory for validating and attaching query options to the request object.
 * Leverages Zod schemas to ensure that incoming URL search parameters conform to
 * expected formats for filtering, sorting, and pagination before reaching controllers.
 */

import {type ZodTypeAny} from "zod";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import InvalidRequestQueryError from "@shared/errors/InvalidRequestQueryError";

/**
 * Configuration for the query parsing middleware.
 */
type ParseParams<TSchema extends ZodTypeAny> = {
    schema: TSchema;
    modelName?: string;
};

/**
 * Creates an Express middleware that intercepts the request to validate URL search parameters.
 */
export function parseQueryOptions<TSchema extends ZodTypeAny>(
    {schema, modelName}: ParseParams<TSchema>
): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        const {data, success, error} = schema.safeParse(req.query);

        if (!success) {
            throw new InvalidRequestQueryError({
                modelName,
                errors: error?.errors,
                message: "Invalid query options."
            });
        }

        req.queryOptions = data;

        next();
    };
}