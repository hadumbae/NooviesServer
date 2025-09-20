import { z } from "zod";
import {
    ScreenQueryFiltersSchema,
    ScreenQueryOptionsSchema,
    ScreenQueryParamsSchema,
    ScreenQuerySortsSchema
} from "./ScreenQueryOption.schema.js";

/**
 * Type representing available filters for querying screens.
 *
 * Derived from {@link ScreenQueryFiltersSchema}.
 *
 * Includes optional filters for:
 * - `_id` (screen ID)
 * - `name` (screen name)
 * - `theatre` (theatre ID)
 * - `capacity` (screen capacity)
 * - `screenType` (e.g., IMAX, 3D, Standard)
 */
export type ScreenQueryFilters = z.infer<typeof ScreenQueryFiltersSchema>;

/**
 * Type representing sorting options for querying screens.
 *
 * Derived from {@link ScreenQuerySortsSchema}.
 *
 * Each property maps to a screen field and supports MongoDB sort order:
 * - `1` → ascending
 * - `-1` → descending
 */
export type ScreenQuerySorts = z.infer<typeof ScreenQuerySortsSchema>;

/**
 * Type representing additional query parameters for screens.
 *
 * Derived from {@link ScreenQueryParamsSchema}.
 *
 * Includes configuration like:
 * - `showingsPerScreen` (number of showings to fetch per screen)
 */
export type ScreenQueryParams = z.infer<typeof ScreenQueryParamsSchema>;

/**
 * Type representing the full set of query options for screens.
 *
 * Derived from {@link ScreenQueryOptionsSchema}.
 *
 * Combines:
 * - {@link ScreenQueryFilters} → field-based filtering
 * - {@link ScreenQuerySorts} → ordering of results
 * - {@link ScreenQueryParams} → extra configuration parameters
 */
export type ScreenQueryOptions = z.infer<typeof ScreenQueryOptionsSchema>;
