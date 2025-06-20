import {z} from "zod";
import {ScreenQueryMatchParamsSchema} from "./ScreenQueryMatchParamsSchema.js";
import {ScreenQueryOptionParamsSchema} from "./ScreenQueryOptionParamsSchema.js";

/**
 * Combined Zod schema for validating both route match parameters and optional query parameters
 * related to screen data fetching.
 *
 * This schema merges:
 * - `ScreenQueryMatchParamsSchema`: typically dynamic segments in the route (e.g., `/screens/:theatre`)
 * - `ScreenQueryOptionParamsSchema`: optional query parameters (e.g., `?showingsPerScreen=5`)
 *
 * Useful when you want to validate the full set of parameters required for a screen query.
 */
export const ScreenQueryParamsSchema = ScreenQueryMatchParamsSchema.merge(ScreenQueryOptionParamsSchema);

/**
 * Inferred TypeScript type for the combined screen query parameters.
 *
 * Represents the complete set of validated parameters for querying screen data,
 * including both required route params and optional query params.
 */
export type ScreenQueryParams = z.infer<typeof ScreenQueryParamsSchema>;