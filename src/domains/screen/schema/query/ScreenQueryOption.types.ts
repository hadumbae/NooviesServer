import { z } from "zod";
import {
    ScreenQueryFiltersSchema,
    ScreenQueryOptionsSchema,
    ScreenQueryParamsSchema,
    ScreenQuerySortsSchema
} from "./ScreenQueryOption.schema.js";

/**
 * Type representing the filters used to match screens.
 *
 * Derived from {@link ScreenQueryFiltersSchema}, this type includes optional
 * and required fields for filtering screens by theatre, capacity, and screen type.
 */
export type ScreenQueryFilters = z.infer<typeof ScreenQueryFiltersSchema>;

/**
 * Type representing additional query parameters for screens.
 *
 * Derived from {@link ScreenQueryParamsSchema}, this type typically includes
 * fields such as the number of showings per screen.
 */
export type ScreenQueryParams = z.infer<typeof ScreenQueryParamsSchema>;

/**
 * Type representing the sort options for screens.
 *
 * Derived from {@link ScreenQuerySortsSchema}, this type allows specifying
 * ascending or descending order on fields like capacity or screen type.
 */
export type ScreenQuerySorts = z.infer<typeof ScreenQuerySortsSchema>;

/**
 * Type representing the complete set of query options for screens,
 * including filters, additional query parameters, and sorting preferences.
 *
 * Derived from {@link ScreenQueryOptionsSchema}, this type is used
 * to validate and type incoming HTTP query parameters for screen endpoints.
 */
export type ScreenQueryOptions = z.infer<typeof ScreenQueryOptionsSchema>;
