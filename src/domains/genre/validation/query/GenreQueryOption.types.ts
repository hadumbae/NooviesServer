import { z } from "zod";
import {
    type GenreQueryMatchFiltersSchema,
    GenreQueryOptionsSchema,
    GenreQueryMatchSortsSchema
} from "./GenreQueryOption.schema.js";

/**
 * Type representing filters that can be applied when querying genres.
 * Inferred from `GenreQueryMatchFiltersSchema`.
 */
export type GenreQueryMatchFilters = z.infer<typeof GenreQueryMatchFiltersSchema>;

/**
 * Type representing sorting options when querying genres.
 * Inferred from `GenreQueryMatchSortsSchema`.
 */
export type GenreQueryMatchSorts = z.infer<typeof GenreQueryMatchSortsSchema>;

/**
 * Type representing the complete set of query options for genres,
 * including both filters and sorting options.
 * Inferred from `GenreQueryOptionsSchema`.
 */
export type GenreQueryOptions = z.infer<typeof GenreQueryOptionsSchema>;
