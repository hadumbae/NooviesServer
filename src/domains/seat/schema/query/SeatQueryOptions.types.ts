import {z} from "zod";
import {SeatMatchFilterSchema, SeatQueryOptionsSchema, SeatSortSchema} from "./SeatQueryOptions.schema.js";

/**
 * Type representing URL-based filter parameters for querying seats.
 * Derived from {@link SeatMatchFilterSchema}.
 */
export type SeatQueryMatchFilters = z.infer<typeof SeatMatchFilterSchema>;

/**
 * Type representing sort options for querying seats.
 * Derived from {@link SeatSortSchema}.
 */
export type SeatQuerySorts = z.infer<typeof SeatSortSchema>;

/**
 * Type representing the full set of query options for seats,
 * including both filters and sorting.
 * Derived from {@link SeatQueryOptionsSchema}.
 */
export type SeatQueryOptions = z.infer<typeof SeatQueryOptionsSchema>;