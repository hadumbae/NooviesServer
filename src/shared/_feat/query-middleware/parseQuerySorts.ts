/**
 * @fileoverview Middleware for parsing and validating sort parameters from request queries using Zod.
 */

import {type ZodType, type ZodTypeDef} from "zod";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import InvalidRequestQueryError from "@/shared/errors/InvalidRequestQueryError";

type ParseConfig<TOutput extends Record<string, 1 | -1>> = {
    schema: ZodType<TOutput, ZodTypeDef, unknown>;
    modelName?: string;
};

/** Creates an Express middleware that validates and attaches sort options to the request object. */
export function parseQuerySorts<TOutput extends Record<string, 1 | -1>>(
    {schema, modelName}: ParseConfig<TOutput>
): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        const {data, success, error} = schema.safeParse(req.query);

        if (!success) {
            throw new InvalidRequestQueryError({
                modelName,
                errors: error?.errors,
                message: "Invalid query sorts."
            });
        }

        req.querySorts = data;

        next();
    };
}