import { z } from "zod";
import {
    SeatQueryMatchFiltersSchema,
    SeatQueryOptionsSchema,
    SeatQueryMatchSortsSchema
} from "./SeatQueryOption.schema.js";

/**
 * Type representing the available filters for querying seats.
 *
 * Derived from {@link SeatQueryMatchFiltersSchema}.
 *
 * @remarks
 * Filters can include seat ID, row, seat number, label, type, availability, theatre, screen, and price multiplier.
 * All fields are optional when used in query parameters.
 */
export type SeatQueryMatchFilters = z.infer<typeof SeatQueryMatchFiltersSchema>;

/**
 * Type representing the sortable fields for querying seats.
 *
 * Derived from {@link SeatQueryMatchSortsSchema}.
 *
 * @remarks
 * Each field corresponds to a column that can be used in a Mongoose `$sort`.
 * Use `1` for ascending and `-1` for descending order.
 */
export type SeatQueryMatchSorts = z.infer<typeof SeatQueryMatchSortsSchema>;

/**
 * Type representing the complete set of seat query options.
 *
 * Derived from {@link SeatQueryOptionsSchema}.
 *
 * @remarks
 * Combines {@link SeatQueryMatchFilters} and {@link SeatQueryMatchSorts} into a single type.
 * Can be passed to query option services to generate Mongoose filters, sorts, and additional query parameters.
 */
export type SeatQueryOptions = z.infer<typeof SeatQueryOptionsSchema>;
