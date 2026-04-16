/**
 * @fileoverview Express middleware factory for centralized request validation.
 * Merges route parameters and query strings into a single object for unified
 * schema validation using Zod.
 */

import {type ZodType, type ZodTypeDef} from "zod";
import type {NextFunction, Request, Response} from "express";
import {BadRequestError} from "@shared/errors/BadRequestError";

/**
 * Configuration options for the request validation middleware.
 */
type ValidationParams<TData> = {
    schema: ZodType<TData, ZodTypeDef, unknown>;
    errorMessage?: string;
};

/**
 * A middleware factory that validates incoming request parameters and queries.
 */
export function validateRequestConfig<TData = unknown>(params: ValidationParams<TData>) {
    const {schema, errorMessage} = params;

    return (req: Request, res: Response, next: NextFunction) => {
        const raw = {...req.params, ...req.query};

        const {data, error, success} = schema.safeParse(raw);

        if (!success) {
            throw new BadRequestError({
                message: errorMessage ?? "Invalid request parameters or query.",
                errors: error?.errors ?? [],
            });
        }

        req.parsedConfig = data as TData;

        next();
    };
}