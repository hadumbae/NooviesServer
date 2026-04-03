/**
 * @file Zod schema for direct genre field matching from URL parameters.
 * @filename GenreQueryMatchFiltersSchema.ts
 */

import {z} from "zod";
import {URLParamStringSchema} from "@shared/schema/url/URLParamStringSchema";

/**
 * Validates the raw filterable fields for Genres.
 * ---
 */
export const GenreQueryMatchFiltersSchema = z.object({
    /** Optional filter by genre name (e.g., "Action", "Sci-Fi"). */
    name: URLParamStringSchema
});

/** Inferred TypeScript type for raw genre filter parameters. */
export type GenreQueryMatchFilters = z.infer<typeof GenreQueryMatchFiltersSchema>;