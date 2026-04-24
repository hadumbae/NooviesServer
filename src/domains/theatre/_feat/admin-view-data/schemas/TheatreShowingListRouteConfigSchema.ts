/**
 * @fileoverview Zod schema and type definitions for theatre showing list route parameters.
 */

import {z} from "zod";
import {SlugStringSchema} from "@shared/schema/strings/SlugStringSchema";
import {URLParamNonNegativeNumberSchema} from "@shared/schema/url/URLParamNonNegativeNumberSchema";

/**
 * Schema for validating route configuration and pagination parameters for theatre showings.
 */
export const TheatreShowingListRouteConfigSchema = z.object({
    slug: SlugStringSchema,
    page: URLParamNonNegativeNumberSchema,
    perPage: URLParamNonNegativeNumberSchema,
});

/** Configuration for the theatre showing list route. */
export type TheatreShowingListRouteConfig = z.infer<typeof TheatreShowingListRouteConfigSchema>;