import {z} from "zod";
import {MovieQueryMatchFiltersSchema, MovieQueryOptionsSchema, MovieQueryMatchSortsSchema} from "./MovieQueryOption.schema.js";

/**
 * Type representing the query filters that can be applied when fetching movies.
 *
 * Corresponds to `MovieQueryMatchFiltersSchema`.
 */
export type MovieQueryMatchFilters = z.infer<typeof MovieQueryMatchFiltersSchema>;

/**
 * Type representing the sorting options for movie queries.
 *
 * Corresponds to `MovieQueryMatchSortsSchema`.
 */
export type MovieQueryMatchSorts = z.infer<typeof MovieQueryMatchSortsSchema>;

/**
 * Type representing the complete set of query options for movies,
 * including both filters and sorting.
 *
 * Corresponds to `MovieQueryOptionsSchema`.
 */
export type MovieQueryOptions = z.infer<typeof MovieQueryOptionsSchema>;