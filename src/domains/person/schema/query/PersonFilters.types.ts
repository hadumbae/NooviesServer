import {z} from "zod";
import {PersonQueryFiltersSchema, PersonQueryOptionsSchema, PersonQuerySortsSchema} from "./PersonFilters.schema.js";

/**
 * Type representing the filters that can be applied when querying Person documents.
 *
 * Derived from {@link PersonQueryFiltersSchema}.
 */
export type PersonQueryFilters = z.infer<typeof PersonQueryFiltersSchema>;

/**
 * Type representing the sorting options for querying Person documents.
 *
 * Derived from {@link PersonQuerySortsSchema}.
 */
export type PersonQuerySorts = z.infer<typeof PersonQuerySortsSchema>;

/**
 * Type representing the full set of query options for Person documents,
 * including both filters and sorting options.
 *
 * Derived from {@link PersonQueryOptionsSchema}.
 */
export type PersonQueryOptions = z.infer<typeof PersonQueryOptionsSchema>;