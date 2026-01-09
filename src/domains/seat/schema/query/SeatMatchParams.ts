/**
 * @file SeatMatchParams.ts
 *
 * Zod schemas defining match-level filters and sort options
 * for Seat queries.
 *
 * These fields map directly to properties stored on the
 * Seat document.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamPositiveNumberSchema} from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import {SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {SeatLayoutTypeEnum} from "../enum/SeatLayoutTypeEnum.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {URLParamNonNegativeNumberSchema} from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Match-level filters applied directly to Seat fields.
 */
export const SeatQueryMatchFiltersSchema = z.object({
    /** Seat ObjectId */
    _id: URLParamObjectIDSchema,

    /** Row identifier (e.g. "A", "B") */
    row: URLParamStringSchema,

    /** Seat number within the row */
    seatNumber: URLParamPositiveNumberSchema,

    /** Display label for the seat */
    seatLabel: URLParamStringSchema,

    /** Seat classification */
    seatType: SeatTypeEnum.optional(),

    /** Layout classification */
    layoutType: SeatLayoutTypeEnum.optional(),

    /** Availability flag */
    isAvailable: URLParamBooleanSchema,

    /** Parent theatre ObjectId */
    theatre: URLParamObjectIDSchema,

    /** Parent screen ObjectId */
    screen: URLParamObjectIDSchema,

    /** Price multiplier relative to base ticket price */
    priceMultiplier: URLParamNonNegativeNumberSchema,
});

/**
 * Inferred type for seat match filters.
 */
export type SeatQueryMatchFilters =
    z.infer<typeof SeatQueryMatchFiltersSchema>;

/**
 * Sort options applied to Seat queries.
 *
 * MongoDB semantics:
 * - `1`  → ascending
 * - `-1` → descending
 */
export const SeatQueryMatchSortsSchema = z.object({
    /** Sort by theatre */
    sortByTheatre: URLParamMongooseSortOrderSchema,

    /** Sort by screen */
    sortByScreen: URLParamMongooseSortOrderSchema,

    /** Sort by row */
    sortByRow: URLParamMongooseSortOrderSchema,

    /** Sort by seat number */
    sortBySeatNumber: URLParamMongooseSortOrderSchema,

    /** Sort by seat label */
    sortBySeatLabel: URLParamMongooseSortOrderSchema,

    /** Sort by seat type */
    sortBySeatType: URLParamMongooseSortOrderSchema,

    /** Sort by availability */
    sortByIsAvailable: URLParamMongooseSortOrderSchema,

    /** Sort by price multiplier */
    sortByPriceMultiplier: URLParamMongooseSortOrderSchema,
});

/**
 * Inferred type for seat sort options.
 */
export type SeatQueryMatchSorts =
    z.infer<typeof SeatQueryMatchSortsSchema>;
