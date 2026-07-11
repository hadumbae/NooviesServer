/**
 * @fileoverview Middleware for parsing and validating request query parameters using Zod schemas.
 */

import {type ZodType, type ZodTypeDef} from "zod";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import InvalidRequestQueryError from "@/shared/errors/InvalidRequestQueryError";

type ParseConfig<TOutput extends Record<string, unknown>> = {
    schema: ZodType<TOutput, ZodTypeDef, unknown>;
    modelName?: string;
};

/** Creates an Express middleware to validate request query parameters against a Zod schema. */
export function parseQueryFilters<TOutput extends Record<string, unknown>>(
    {schema, modelName}: ParseConfig<TOutput>
): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        const {data, success, error} = schema.safeParse(req.query);

        if (!success) {
            throw new InvalidRequestQueryError({
                modelName,
                errors: error?.errors,
                message: "Invalid query filters."
            });
        }

        req.queryFilters = data;

        next();
    };
}