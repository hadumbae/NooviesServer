import { z } from "zod";
import { SeatTypeEnum } from "../../../seat/schema/enum/SeatTypeEnum.js";
import { SeatMapStatusEnumSchema } from "../enum/SeatMapStatusEnumSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { ShowingStatusEnumSchema } from "../../../showing/schema/ShowingStatusEnumSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Filter schema for SeatMap fields that exist directly on the SeatMap document.
 *
 * These filters represent 1:1 comparisons on the SeatMap model itself and
 * correspond to common URL parameters for match-based filtering.
 *
 * Supported filters:
 * - `showing`: ObjectID of the related Showing.
 * - `seat`: ObjectID of the related Seat.
 * - `price`: Positive numeric price of the seat.
 * - `status`: Optional SeatMap status.
 */
export const SeatMapMatchFilterSchema = z.object({
    /** Filter by showing ID. */
    showing: URLParamObjectIDSchema,

    /** Filter by seat ID. */
    seat: URLParamObjectIDSchema,

    /** Filter by price, must be a positive number. */
    price: URLParamPositiveNumberSchema,

    /** Optional filter by SeatMap status. */
    status: SeatMapStatusEnumSchema.optional(),
});

/**
 * Filter schema for fields that come from referenced documents
 * (e.g., Movie, Showing, Seat).
 *
 * These filters require joins, population, or reference-based conditions.
 *
 * Supported filters:
 * - `movie`: ObjectID of the related Movie.
 * - `showingStatus`: Optional status of the Showing.
 * - `seatRow`: Row identifier for the seat.
 * - `seatNumber`: Numeric seat number.
 * - `seatType`: Optional type of seat (e.g., VIP, NORMAL).
 */
export const SeatMapReferenceFilterSchema = z.object({
    /** Filter by movie ID. */
    movie: URLParamObjectIDSchema,

    /** Optional filter by showing status. */
    showingStatus: ShowingStatusEnumSchema.optional(),

    /** Filter by seat row (string). */
    seatRow: URLParamStringSchema,

    /** Filter by numeric seat number. */
    seatNumber: URLParamPositiveNumberSchema,

    /** Optional filter by seat type. */
    seatType: SeatTypeEnum.optional(),
});

/**
 * Sorting schema for SeatMap document fields.
 *
 * These sort parameters apply to fields present directly on the SeatMap model.
 *
 * Supported sort keys:
 * - `sortByPrice`: Sort by seat price.
 * - `sortByStatus`: Sort by SeatMap status.
 *
 * Accepts standard mongoose sort orders (`asc`, `desc`, `1`, `-1`).
 */
export const SeatMapMatchSortSchema = z.object({
    /** Sort order for price. */
    sortByPrice: URLParamMongooseSortOrderSchema,

    /** Sort order for SeatMap status. */
    sortByStatus: URLParamMongooseSortOrderSchema,
});

/**
 * Sorting schema for referenced fields (Seat, Showing, etc.).
 *
 * Supported sort keys:
 * - `sortBySeatRow`: Sort by seat row label.
 * - `sortBySeatNumber`: Sort by numeric seat number.
 *
 * Accepts standard mongoose sort orders (`asc`, `desc`, `1`, `-1`).
 */
export const SeatMapReferenceSortSchema = z.object({
    /** Sort order for seat row. */
    sortBySeatRow: URLParamMongooseSortOrderSchema,

    /** Sort order for seat number. */
    sortBySeatNumber: URLParamMongooseSortOrderSchema,
});

/**
 * Combined query schema used for SeatMap listing endpoints.
 *
 * This schema merges:
 * - Direct field filters (`SeatMapMatchFilterSchema`)
 * - Reference-based filters (`SeatMapReferenceFilterSchema`)
 * - Direct field sort options (`SeatMapMatchSortSchema`)
 * - Reference field sort options (`SeatMapReferenceSortSchema`)
 *
 * Useful for validating URL query parameters used to query, filter,
 * and sort SeatMaps in complex listing endpoints.
 *
 * @example
 * ```ts
 * const query = {
 *   showing: "64f7b1c9d2a4b2f3a1c2e789",
 *   seatRow: "B",
 *   seatNumber: 8,
 *   status: "AVAILABLE",
 *   sortByPrice: "asc",
 *   sortBySeatRow: "desc"
 * };
 *
 * const parsed = SeatMapQueryOptionSchema.parse(query);
 * ```
 */
export const SeatMapQueryOptionSchema = SeatMapMatchFilterSchema
    .merge(SeatMapReferenceFilterSchema)
    .merge(SeatMapMatchSortSchema)
    .merge(SeatMapReferenceSortSchema);
