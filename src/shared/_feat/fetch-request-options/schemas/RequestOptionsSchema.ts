/**
 * @fileoverview Zod schema for standardized API request configuration.
 * Handles the coercion and validation of URL query parameters into strongly-typed
 * options for database operations, including pagination and model hydration toggles.
 */

import {z} from "zod";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {URLParamNumberSchema} from "@shared/schema/url/URLParamNumberSchema";

/**
 * Validates global request modifiers for fetching data.
 */
export const RequestOptionsSchema = z.object({
    populate: URLParamBooleanSchema,
    virtuals: URLParamBooleanSchema,
    limit: URLParamNumberSchema,
    page: URLParamNumberSchema,
    perPage: URLParamNumberSchema,
});

/**
 * TypeScript type inferred from RequestOptionsSchema.
 * Used to ensure type-safety across service and repository layers when
 * configuring fetch operations.
 */
export type RequestOptions = z.infer<typeof RequestOptionsSchema>;