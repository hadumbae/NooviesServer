import { z } from "zod";

import { SeatTypeEnum } from "../enum/SeatTypeEnum.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamBooleanSchema } from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";

/**
 * Zod schema for matching/filtering Seat documents.
 *
 * @remarks
 * All properties are optional when passed as query parameters.
 * Supports filtering by seat ID, row, seat number, label, type, availability, theatre, screen, and price multiplier.
 */
export const SeatQueryMatchFiltersSchema = z.object({
    /** Unique identifier for the seat. */
    _id: URLParamObjectIDSchema,

    /** Row identifier or label (e.g., "A", "B"). */
    row: URLParamStringSchema,

    /** Positive integer representing the seat number. */
    seatNumber: URLParamPositiveNumberSchema,

    /** Optional label for the seat (e.g., "VIP", "Accessible"). */
    seatLabel: URLParamStringSchema,

    /** Type of seat (enum). Optional. */
    seatType: SeatTypeEnum.optional(),

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
 * Zod schema for sorting Seat documents.
 *
 * Each property corresponds to a field that can be used in Mongoose `$sort`.
 * Use `1` for ascending and `-1` for descending.
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
 * Combined Zod schema for all Seat query options.
 *
 * Merges match filters and sorting into a single schema.
 *
 * @example
 * // Example: Fetch seats in row "A", sorted by seat number ascending
 * const query = {
 *   row: "A",
 *   sortBySeatNumber: 1
 * };
 */
export const SeatQueryOptionsSchema = SeatQueryMatchFiltersSchema.merge(SeatQueryMatchSortsSchema);
