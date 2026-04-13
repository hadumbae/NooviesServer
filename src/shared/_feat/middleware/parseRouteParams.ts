/**
 * @fileoverview Middleware for validating and parsing Express route parameters.
 * Leverages Zod schemas to ensure that incoming URL parameters (req.params)
 * conform to the expected types and structures before reaching the controller.
 */

import {type ZodTypeAny} from "zod";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import {InvalidRouteParamError} from "@shared/errors/InvalidRouteParamError";

type ParseParams<TSchema extends ZodTypeAny> = {
    /** The Zod schema used to validate and transform the route parameters. */
    schema: TSchema;
};

/**
 * Creates an Express RequestHandler that validates `req.params`.
 */
export function parseRouteParams<TSchema extends ZodTypeAny>(
    {schema}: ParseParams<TSchema>
): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        const {data, success, error} = schema.safeParse(req.params);

        if (!success) {
            throw new InvalidRouteParamError({
                message: "Invalid route parameters detected.",
                raw: req.params,
                errors: error?.errors,
            });
        }

        req.parsedParams = data;

        next();
    };
}