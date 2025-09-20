import { z } from "zod";
import { SeatQueryFiltersSchema, SeatQueryOptionsSchema, SeatQuerySortsSchema } from "./SeatQueryOptions.schema.js";

/**
 * Type representing available filters for querying seats.
 *
 * Derived from {@link SeatQueryFiltersSchema}.
 *
 * Supports optional filters for:
 * - `_id` (seat ID)
 * - `row` (row identifier, e.g., "A", "B")
 * - `seatNumber` (seat number within a row)
 * - `seatType` (e.g., Regular, VIP, Recliner)
 * - `isAvailable` (whether the seat is currently available)
 * - `priceMultiplier` (pricing adjustment factor)
 * - `theatre` (associated theatre ID)
 * - `screen` (associated screen ID)
 */
export type SeatQueryFilters = z.infer<typeof SeatQueryFiltersSchema>;

/**
 * Type representing sorting options for querying seats.
 *
 * Derived from {@link SeatQuerySortsSchema}.
 *
 * Each property maps to a seat field and supports MongoDB sort order:
 * - `1` → ascending
 * - `-1` → descending
 *
 * Sortable fields include:
 * - `theatre`
 * - `screen`
 * - `row`
 * - `seatNumber`
 * - `seatType`
 * - `isAvailable`
 * - `priceMultiplier`
 */
export type SeatQuerySorts = z.infer<typeof SeatQuerySortsSchema>;

/**
 * Type representing the full set of query options for seats.
 *
 * Derived from {@link SeatQueryOptionsSchema}.
 *
 * Combines:
 * - {@link SeatQueryFilters} → field-based filtering
 * - {@link SeatQuerySorts} → ordering of results
 */
export type SeatQueryOptions = z.infer<typeof SeatQueryOptionsSchema>;
