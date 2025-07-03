import {z} from "zod";

import {SeatTypeEnum} from "../enum/SeatTypeEnum.js";
import {URLParamNonNegativeNumberSchema} from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {MongooseSortOrderSchema} from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";

/**
 * Zod schema for filtering seat queries via URL parameters.
 * All fields are parsed from URL strings and validated accordingly.
 */
export const SeatMatchFilterSchema = z.object({
    /** Filter by seat row label (e.g., "A", "B"). */
    row: URLParamStringSchema,

    /** Filter by seat number within the row. */
    seatNumber: URLParamNonNegativeNumberSchema,

    /** Filter by optional seat label (e.g., "A5", "VIP-3"). */
    seatLabel: URLParamStringSchema,

    /** Filter by seat type (optional). */
    seatType: SeatTypeEnum.optional(),

    /**
     * Filter by availability status (true/false).
     */
    isAvailable: URLParamBooleanSchema,

    /**
     * Filter by theatre ID (parsed from URL).
     */
    theatre: URLParamObjectIDSchema,

    /**
     * Filter by screen ID (parsed from URL).
     */
    screen: URLParamObjectIDSchema,
});

/**
 * Zod schema for sorting seat queries via URL parameters.
 * All values must be compatible with Mongoose sort orders (1 or -1).
 */
export const SeatSortSchema = z.object({
    /** Sort by seat row label (optional). */
    sortByRow: MongooseSortOrderSchema.optional(),

    /** Sort by seat number (optional). */
    sortBySeatNumber: MongooseSortOrderSchema.optional(),

    /** Sort by seat label (optional). */
    sortBySeatLabel: MongooseSortOrderSchema.optional(),

    /** Sort by seat type (optional). */
    sortBySeatType: MongooseSortOrderSchema.optional(),
});

/**
 * Combined Zod schema for filtering and sorting seats via query parameters.
 * Used to validate and parse incoming seat query requests.
 */
export const SeatQueryOptionsSchema = SeatMatchFilterSchema.merge(SeatSortSchema);