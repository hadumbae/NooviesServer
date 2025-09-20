import { z } from "zod";
import {
    ScreenQueryFiltersSchema,
    ScreenQueryOptionsSchema,
    ScreenQueryParamsSchema,
    ScreenQuerySortsSchema
} from "./ScreenQueryOption.schema.js";

/**
 * Type representing the filter fields for querying screens.
 *
 * Derived from `ScreenQueryFiltersSchema`.
 * Includes:
 * - `_id`: Screen ID
 * - `name`: Screen name
 * - `theatre`: Associated theatre ID
 * - `capacity`: Screen capacity
 * - `screenType`: Optional screen type
 */
export type ScreenQueryFilters = z.infer<typeof ScreenQueryFiltersSchema>;

/**
 * Type representing the sort fields for querying screens.
 *
 * Derived from `ScreenQuerySortsSchema`.
 * Each field accepts a MongoDB sort order (`1` for ascending, `-1` for descending).
 */
export type ScreenQuerySorts = z.infer<typeof ScreenQuerySortsSchema>;

/**
 * Type representing additional query parameters for screens.
 *
 * Derived from `ScreenQueryParamsSchema`.
 * Includes:
 * - `showingsPerScreen`: Number of showings to fetch per screen (non-negative)
 */
export type ScreenQueryParams = z.infer<typeof ScreenQueryParamsSchema>;

/**
 * Type representing the full set of query options for screens.
 *
 * Derived from `ScreenQueryOptionsSchema`, which merges:
 * - Filters (`ScreenQueryFilters`)
 * - Sorts (`ScreenQuerySorts`)
 * - Additional parameters (`ScreenQueryParams`)
 */
export type ScreenQueryOptions = z.infer<typeof ScreenQueryOptionsSchema>;
