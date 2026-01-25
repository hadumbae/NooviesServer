/**
 * @file validateRequestParameters.ts
 *
 * Utility for validating request parameters and query strings
 * using Zod schemas.
 */

import {z, type ZodTypeAny} from "zod";
import type {Request} from "express";
import {BadRequestError} from "../../errors/BadRequestError.js";

/**
 * Parameters for request validation.
 */
type ValidationParams<TSchema extends ZodTypeAny> = {
    /** Express request object */
    req: Request;

    /** Zod schema used to validate params and query */
    schema: TSchema;

    /** Optional custom error message */
    errorMessage?: string;
};

/**
 * Validates request parameters and query strings against a Zod schema.
 *
 * - Merges `req.params` and `req.query`
 * - Throws {@link BadRequestError} on validation failure
 *
 * @param params - Request, schema, and optional error message
 * @returns Parsed and validated data
 * @throws BadRequestError
 */
export function validateRequestParameters<
    TSchema extends ZodTypeAny = ZodTypeAny
>(
    {req, schema, errorMessage}: ValidationParams<TSchema>,
): z.infer<TSchema> {
    const raw = {...req.params, ...req.query};

    const {data, error, success} = schema.safeParse(raw);

    if (!success) {
        throw new BadRequestError({
            message: errorMessage,
            errors: error?.errors ?? [],
        });
    }

    return data;
}
