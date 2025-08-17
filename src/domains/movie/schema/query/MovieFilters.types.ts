import {z} from "zod";
import {MovieQueryFiltersSchema, MovieQueryOptionsSchema, MovieQuerySortsSchema} from "./MovieFilters.schema.js";

/**
 * Type representing the query filters that can be applied when fetching movies.
 *
 * Corresponds to `MovieQueryFiltersSchema`.
 */
export type MovieQueryFilters = z.infer<typeof MovieQueryFiltersSchema>;

/**
 * Type representing the sorting options for movie queries.
 *
 * Corresponds to `MovieQuerySortsSchema`.
 */
export type MovieQuerySorts = z.infer<typeof MovieQuerySortsSchema>;

/**
 * Type representing the complete set of query options for movies,
 * including both filters and sorting.
 *
 * Corresponds to `MovieQueryOptionsSchema`.
 */
export type MovieQueryOptions = z.infer<typeof MovieQueryOptionsSchema>;