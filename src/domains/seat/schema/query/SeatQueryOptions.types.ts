import { z } from "zod";
import { SeatQueryFiltersSchema, SeatQueryOptionsSchema, SeatQuerySortsSchema } from "./SeatQueryOptions.schema.js";

/**
 * Type representing URL query parameters used to filter seat results.
 *
 * Derived from {@link SeatQueryFiltersSchema}, this type includes optional fields
 * such as row, seat number, seat type, availability, theatre ID, and screen ID.
 *
 * Example:
 * ```ts
 * const filters: SeatQueryFilters = {
 *   row: "A",
 *   seatType: "VIP",
 *   isAvailable: true
 * };
 * ```
 */
export type SeatQueryFilters = z.infer<typeof SeatQueryFiltersSchema>;

/**
 * Type representing sort options for querying seats.
 *
 * Derived from {@link SeatQuerySortsSchema}, this type allows specifying sort order
 * (ascending or descending) for seat fields like row, seat number, seat label, and seat type.
 *
 * Example:
 * ```ts
 * const sorts: SeatQuerySorts = {
 *   sortByRow: 1,
 *   sortBySeatNumber: -1
 * };
 * ```
 */
export type SeatQuerySorts = z.infer<typeof SeatQuerySortsSchema>;

/**
 * Type representing the full set of query options for seats,
 * including both filter and sort parameters.
 *
 * Derived from {@link SeatQueryOptionsSchema}, this type merges
 * {@link SeatQueryFilters} and {@link SeatQuerySorts}.
 *
 * Example:
 * ```ts
 * const options: SeatQueryOptions = {
 *   row: "A",
 *   seatType: "VIP",
 *   isAvailable: true,
 *   sortBySeatNumber: 1
 * };
 * ```
 */
export type SeatQueryOptions = z.infer<typeof SeatQueryOptionsSchema>;
