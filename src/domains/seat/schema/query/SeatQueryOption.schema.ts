/**
 * @file SeatQueryMatchSchemas.ts
 *
 * @summary
 * Zod schemas for matching, filtering, and sorting Seat documents using query parameters.
 *
 * @description
 * These schemas validate optional query parameters for fetching Seat data.
 * - `SeatQueryMatchFiltersSchema` validates filtering parameters.
 * - `SeatQueryMatchSortsSchema` validates sorting parameters.
 * - `SeatQueryOptionsSchema` merges filters and sorts for a complete query object.
 */

import { z } from "zod";
import { SeatTypeEnum } from "../enum/SeatTypeEnum.js";
import { SeatLayoutTypeEnum } from "../enum/SeatLayoutTypeEnum.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamBooleanSchema } from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";

/**
 * @summary Zod schema for filtering/matching Seat documents.
 *
 * @description
 * All fields are optional when passed as query parameters.
 * Supports filtering by seat ID, row, seat number, label, type, availability,
 * theatre, screen, layout type, and price multiplier.
 *
 * @example
 * ```ts
 * const filters = SeatQueryMatchFiltersSchema.parse({
 *   row: "B",
 *   seatType: "VIP",
 *   isAvailable: true,
 * });
 * ```
 */
export const SeatQueryMatchFiltersSchema = z.object({
    /** Unique identifier for the seat (MongoDB ObjectID). */
    _id: URLParamObjectIDSchema,

    /** Row identifier or label (e.g., "A", "B"). */
    row: URLParamStringSchema,

    /** Positive integer representing the seat number. */
    seatNumber: URLParamPositiveNumberSchema,

    /** Optional label for the seat (e.g., "VIP", "Accessible"). */
    seatLabel: URLParamStringSchema,

    /** Type of seat (enum). Optional. */
    seatType: SeatTypeEnum.optional(),

    /** Seat layout type (e.g., SEAT, NON-SEAT). Optional. */
    layoutType: SeatLayoutTypeEnum.optional(),

    /** Whether the seat is currently available. */
    isAvailable: URLParamBooleanSchema,

    /** Theatre ID that the seat belongs to. */
    theatre: URLParamObjectIDSchema,

    /** Screen ID that the seat belongs to. */
    screen: URLParamObjectIDSchema,

    /** Price multiplier for the seat. Non-negative number. */
    priceMultiplier: URLParamNonNegativeNumberSchema,
});

/**
 * @summary Zod schema for sorting Seat documents.
 *
 * @description
 * Each property corresponds to a field that can be used in a Mongoose `$sort`.
 * Use `1` for ascending and `-1` for descending.
 *
 * @example
 * ```ts
 * const sorts = SeatQueryMatchSortsSchema.parse({
 *   sortByRow: 1,
 *   sortBySeatNumber: -1,
 * });
 * ```
 */
export const SeatQueryMatchSortsSchema = z.object({
    sortByTheatre: URLParamMongooseSortOrderSchema,
    sortByScreen: URLParamMongooseSortOrderSchema,
    sortByRow: URLParamMongooseSortOrderSchema,
    sortBySeatNumber: URLParamMongooseSortOrderSchema,
    sortBySeatLabel: URLParamMongooseSortOrderSchema,
    sortBySeatType: URLParamMongooseSortOrderSchema,
    sortByIsAvailable: URLParamMongooseSortOrderSchema,
    sortByPriceMultiplier: URLParamMongooseSortOrderSchema,
});

/**
 * @summary Combined Zod schema for all Seat query options.
 *
 * @description
 * Merges {@link SeatQueryMatchFiltersSchema} and {@link SeatQueryMatchSortsSchema}
 * into a single schema for validating complete query parameters.
 *
 * @example
 * ```ts
 * // Fetch seats in row "A", sorted by seat number ascending
 * const queryOptions = SeatQueryOptionsSchema.parse({
 *   row: "A",
 *   sortBySeatNumber: 1
 * });
 * ```
 */
export const SeatQueryOptionsSchema = SeatQueryMatchFiltersSchema.merge(SeatQueryMatchSortsSchema);
