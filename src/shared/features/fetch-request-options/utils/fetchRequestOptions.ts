/**
 * @file Extraction utility for standardized API request configuration from Express query parameters.
 * @filename fetchRequestOptions.ts
 */

import type {Request} from "express";
import {type RequestOptions, RequestOptionsSchema} from "@shared/features/fetch-request-options/schemas";
import InvalidRequestQueryError from "@shared/errors/InvalidRequestQueryError";

/**
 * Parses and validates incoming request query parameters into a structured configuration object.
 * @param req - The incoming Express Request object containing the raw query string.
 * @returns A validated object conforming to the {@link RequestOptions} interface.
 */
export function fetchRequestOptions(req: Request): RequestOptions {
    const {data, success, error} = RequestOptionsSchema.safeParse(req.query);

    if (!success || !data) {
        throw new InvalidRequestQueryError({
            message: "Invalid request query options.",
            errors: error?.errors,
        });
    }

    return data;
}