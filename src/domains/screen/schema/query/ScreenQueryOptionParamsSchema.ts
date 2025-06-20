import {z} from "zod";
import {URLParamNonNegativeNumberSchema} from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";

/**
 * Zod schema for validating optional query parameters used when fetching screen data.
 *
 * This schema is commonly used for validating query strings such as `?showingsPerScreen=5`.
 * It ensures that the `showingsPerScreen` parameter, if provided, is a non-negative number.
 */
export const ScreenQueryOptionParamsSchema = z.object({
    showingsPerScreen: URLParamNonNegativeNumberSchema,
});

/**
 * Inferred TypeScript type from `ScreenQueryOptionParamsSchema`.
 *
 * Represents the shape of validated optional query parameters for screen data retrieval.
 */
export type ScreenQueryOptionParams = z.infer<typeof ScreenQueryOptionParamsSchema>;