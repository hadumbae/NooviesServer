/**
 * @file Extraction utility for standardized pagination configuration from Express query parameters.
 * @filename fetchRequestPaginationOptions.ts
 */

import type {Request} from "express";
import {
    type RequestPaginationOptions,
    RequestPaginationOptionsSchema
} from "@shared/_feat/fetch-request-options/schemas/RequestPaginationOptionsSchema";
import InvalidRequestQueryError from "@shared/errors/InvalidRequestQueryError";

/**
 * Parses and validates incoming request query parameters into a structured pagination object.
 * ---
 * @param req - The incoming Express Request object containing the raw query string.
 * @returns A validated object conforming to the {@link RequestPaginationOptions} interface.
 * @throws {InvalidRequestQueryError} if the query parameters are missing or malformed.
 */
export function fetchRequestPaginationOptions(req: Request): RequestPaginationOptions {
    const {data, success, error} = RequestPaginationOptionsSchema.safeParse(req.query);

    if (!success || !data) {
        throw new InvalidRequestQueryError({
            message: "Invalid request pagination query options.",
            errors: error?.errors,
        });
    }

    return data;
}