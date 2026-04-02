/**
 * @file Utility for validating request query parameters with Zod.
 * @filename fetchRequestQueryBySchema.ts
 */

import type {Request} from "express";
import {z, ZodObject, type ZodRawShape} from "zod";
import InvalidRequestQueryError from "../../errors/InvalidRequestQueryError";

/**
 * Parameters for query validation.
 *
 * @typeParam TRawShape - Zod schema shape.
 */
type SchemaParams<TRawShape extends ZodRawShape> = {
    req: Request;
    schema: ZodObject<TRawShape>;
    modelName?: string;
}

/**
 * Parses and validates `req.query` using the provided schema.
 *
 * Throws {@link InvalidRequestQueryError} on validation failure.
 *
 * @typeParam TRawShape - Zod schema shape.
 * @returns Parsed query object inferred from the schema.
 */
export function fetchRequestQueryBySchema<TRawShape extends ZodRawShape>(
    {req, schema, modelName}: SchemaParams<TRawShape>
): z.infer<ZodObject<TRawShape>> {
    const {data: queryParams, success, error} = schema.safeParse(req.query);

    if (!success) {
        throw new InvalidRequestQueryError({
            modelName,
            errors: error?.errors,
        });
    }

    return queryParams;
}