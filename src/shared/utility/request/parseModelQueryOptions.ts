/**
 * @file Extraction utility for validating domain-specific query parameters using Zod schemas.
 * @filename parseModelQueryOptions.ts
 */

import {z, type ZodTypeAny} from "zod";
import type {Request} from "express";
import InvalidRequestQueryError from "@shared/errors/InvalidRequestQueryError";

/**
 * Configuration parameters for the query parsing operation.
 * ---
 */
type ParseParams<TSchema extends ZodTypeAny> = {
    /** The incoming Express Request object containing the raw `req.query`. */
    req: Request;
    /** The Zod schema (typically with transformations/effects) used for validation. */
    schema: TSchema;
    /** Optional identifier for the model, used to improve error reporting context. */
    modelName?: string;
}

/**
 * Parses and validates `req.query` against a provided Zod schema with built-in error handling.
 * ---
 * @param params - The request object, the validation schema, and optional model metadata.
 * @returns The validated and transformed query parameter object.
 */
export function parseModelQueryOptions<TSchema extends ZodTypeAny>(
    {req, schema, modelName}: ParseParams<TSchema>
): z.output<TSchema> {
    const {data: queryParams, success, error} = schema.safeParse(req.query);

    if (!success) {
        throw new InvalidRequestQueryError({
            modelName,
            errors: error?.errors,
        });
    }

    return queryParams;
}