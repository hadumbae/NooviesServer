/**
 * @fileoverview Validation schema for domain-specific query parameters in the Screen domain.
 */

import {z} from "zod";
import {URLParamNonNegativeNumberSchema} from "@shared/schema/url/URLParamNonNegativeNumberSchema";

/**
 * Zod schema for auxiliary Screen query parameters.
 */
export const ScreenQueryParamSchema = z.object({
    showingsPerScreen: URLParamNonNegativeNumberSchema,
});

/**
 * TypeScript type inferred from ScreenQueryParamSchema.
 */
export type ScreenQueryParams = z.infer<typeof ScreenQueryParamSchema>;