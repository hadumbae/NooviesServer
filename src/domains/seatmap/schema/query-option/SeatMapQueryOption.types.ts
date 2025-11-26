import { z } from "zod";
import {
    type SeatMapMatchFilterSchema,
    SeatMapMatchSortSchema,
    SeatMapQueryOptionSchema,
    SeatMapReferenceFilterSchema,
    SeatMapReferenceSortSchema
} from "./SeatMapQueryOption.schema.js";

/**
 * TypeScript type representing the direct match filters for SeatMaps.
 *
 * Derived from `SeatMapMatchFilterSchema`.
 *
 * @example
 * ```ts
 * const filters: SeatMapMatchFilters = {
 *   showing: "64f7b1c9d2a4b2f3a1c2e789",
 *   seat: "64f7b1c9d2a4b2f3a1c2e456",
 *   price: 150,
 *   status: "AVAILABLE"
 * };
 * ```
 */
export type SeatMapMatchFilters = z.infer<typeof SeatMapMatchFilterSchema>;

/**
 * TypeScript type representing reference-based filters for SeatMaps.
 *
 * Derived from `SeatMapReferenceFilterSchema`.
 *
 * @example
 * ```ts
 * const referenceFilters: SeatMapReferenceFilters = {
 *   movie: "64f7b1c9d2a4b2f3a1c2e111",
 *   showingStatus: "ACTIVE",
 *   seatRow: "A",
 *   seatNumber: 5,
 *   seatType: "VIP"
 * };
 * ```
 */
export type SeatMapReferenceFilters = z.infer<typeof SeatMapReferenceFilterSchema>;

/**
 * TypeScript type representing sortable fields based on direct match criteria.
 *
 * Derived from `SeatMapMatchSortSchema`.
 *
 * @example
 * ```ts
 * const sorts: SeatMapMatchSorts = {
 *   price: "asc",
 *   status: "desc"
 * };
 * ```
 */
export type SeatMapMatchSorts = z.infer<typeof SeatMapMatchSortSchema>;

/**
 * TypeScript type representing sortable fields based on reference criteria.
 *
 * Derived from `SeatMapReferenceSortSchema`.
 *
 * @example
 * ```ts
 * const referenceSorts: SeatMapReferenceSorts = {
 *   seatRow: "asc",
 *   seatNumber: "desc"
 * };
 * ```
 */
export type SeatMapReferenceSorts = z.infer<typeof SeatMapReferenceSortSchema>;

/**
 * TypeScript type representing the complete query options for SeatMaps,
 * including filters and sort orders from both match and reference schemas.
 *
 * Derived from `SeatMapQueryOptionSchema`.
 *
 * @example
 * ```ts
 * const queryOptions: SeatMapQueryOptions = {
 *   showing: "64f7b1c9d2a4b2f3a1c2e789",
 *   seat: "64f7b1c9d2a4b2f3a1c2e456",
 *   price: 150,
 *   status: "AVAILABLE",
 *   movie: "64f7b1c9d2a4b2f3a1c2e111",
 *   showingStatus: "ACTIVE",
 *   seatRow: "A",
 *   seatNumber: 5,
 *   seatType: "VIP",
 *   price: "asc",
 *   status: "desc",
 *   seatRow: "asc",
 *   seatNumber: "desc"
 * };
 * ```
 */
export type SeatMapQueryOptions = z.infer<typeof SeatMapQueryOptionSchema>;
