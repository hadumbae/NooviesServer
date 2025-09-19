import { TheatreQueryFilterSchema, TheatreQueryOptionsSchema, TheatreQuerySortSchema } from "./TheatreQueryOptions.schema.js";
import { z } from "zod";

/**
 * Type representing the filters used to match theatres in database queries.
 *
 * Derived from {@link TheatreQueryFilterSchema}, this type includes optional fields
 * for filtering theatres by:
 * - Name (`name`)
 * - Seat capacity (`seatCapacity`)
 * - Address (`street`, `city`, `state`, `postalCode`, `country`)
 * - Timezone (`timezone`)
 *
 * @example
 * // Filter theatres in Bangkok with at least 200 seats
 * const filters: TheatreQueryFilters = { city: "Bangkok", seatCapacity: 200 };
 */
export type TheatreQueryFilters = z.infer<typeof TheatreQueryFilterSchema>;

/**
 * Type representing sorting options for theatre queries.
 *
 * Derived from {@link TheatreQuerySortSchema}, this type allows specifying sort order
 * (`"asc"` or `"desc"`) on fields such as:
 * - Name (`sortByName`)
 * - Seat capacity (`sortBySeatCapacity`)
 * - City (`sortByCity`)
 * - Country (`sortByCountry`)
 * - Postal code (`sortByPostalCode`)
 * - Timezone (`sortByTimezone`)
 *
 * @example
 * // Sort theatres by seat capacity descending, then city ascending
 * const sorts: TheatreQuerySorts = { sortBySeatCapacity: "desc", sortByCity: "asc" };
 */
export type TheatreQuerySorts = z.infer<typeof TheatreQuerySortSchema>;

/**
 * Type representing the complete set of query options for theatres.
 *
 * Derived from {@link TheatreQueryOptionsSchema}, this type merges
 * {@link TheatreQueryFilters} and {@link TheatreQuerySorts}, allowing
 * filtering and sorting in a single object.
 *
 * @example
 * // Filter by city and seat capacity, sort by seat capacity descending
 * const options: TheatreQueryOptions = {
 *   city: "Bangkok",
 *   seatCapacity: 200,
 *   sortBySeatCapacity: "desc"
 * };
 */
export type TheatreQueryOptions = z.infer<typeof TheatreQueryOptionsSchema>;
