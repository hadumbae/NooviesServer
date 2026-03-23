import { z } from "zod";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Filters that can be applied when querying genres.
 */
export const GenreQueryMatchFiltersSchema = z.object({
    /** Filter by genre name (string, optional). */
    name: URLParamStringSchema
});

/**
 * Sorting options when querying genres.
 */
export const GenreQueryMatchSortsSchema = z.object({
    /** Sort genres by name in ascending or descending order. */
    sortByName: URLParamMongooseSortOrderSchema,
});

/**
 * Combined schema for genre query options including filters and sorting.
 */
export const GenreQueryOptionsSchema = GenreQueryMatchSortsSchema.merge(GenreQueryMatchFiltersSchema);
