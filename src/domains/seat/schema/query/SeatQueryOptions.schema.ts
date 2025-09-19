import { z } from "zod";

import { SeatTypeEnum } from "../enum/SeatTypeEnum.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamBooleanSchema } from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import { MongooseSortOrderSchema } from "../../../../shared/schema/mongoose/MongooseSortOrderSchema.js";

/**
 * Zod schema for filtering seat queries via URL parameters.
 *
 * Each field corresponds to an optional query parameter that can be
 * used to narrow down seat results in the database.
 *
 * Example query: `/api/seats?row=A&seatType=VIP&isAvailable=true`
 */
export const SeatQueryFiltersSchema = z.object({
    /** Filter by seat row label (e.g., "A", "B"). */
    row: URLParamStringSchema,

    /** Filter by seat number within the row. */
    seatNumber: URLParamNonNegativeNumberSchema,

    /** Filter by optional seat label (e.g., "A5", "VIP-3"). */
    seatLabel: URLParamStringSchema,

    /** Filter by seat type (optional, e.g., VIP, Regular). */
    seatType: SeatTypeEnum.optional(),

    /** Filter by availability status (`true` = available, `false` = occupied). */
    isAvailable: URLParamBooleanSchema,

    /** Filter by theatre ID (MongoDB ObjectId). */
    theatre: URLParamObjectIDSchema,

    /** Filter by screen ID (MongoDB ObjectId). */
    screen: URLParamObjectIDSchema,
});

/**
 * Zod schema for sorting seat query results via URL parameters.
 *
 * All fields are optional. Values must conform to Mongoose sort orders:
 * - `1` = ascending
 * - `-1` = descending
 *
 * Example query: `/api/seats?sortByRow=asc&sortBySeatNumber=desc`
 */
export const SeatQuerySortsSchema = z.object({
    /** Sort by seat row label (optional). */
    sortByRow: MongooseSortOrderSchema.optional(),

    /** Sort by seat number within the row (optional). */
    sortBySeatNumber: MongooseSortOrderSchema.optional(),

    /** Sort by seat label (optional). */
    sortBySeatLabel: MongooseSortOrderSchema.optional(),

    /** Sort by seat type (optional). */
    sortBySeatType: MongooseSortOrderSchema.optional(),
});

/**
 * Combined Zod schema for validating both filters and sorting options for seat queries.
 *
 * This schema merges {@link SeatQueryFiltersSchema} and {@link SeatQuerySortsSchema},
 * allowing a single validation object to handle all query parameters for seat searches.
 *
 * Example full query:
 * `/api/seats?row=A&seatType=VIP&isAvailable=true&sortBySeatNumber=asc`
 */
export const SeatQueryOptionsSchema = SeatQueryFiltersSchema.merge(SeatQuerySortsSchema);
