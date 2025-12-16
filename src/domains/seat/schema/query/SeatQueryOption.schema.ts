/**
 * @file SeatQueryMatchSchemas.ts
 * @summary Zod schemas for validating query parameters used in Seat document filtering, sorting, and reference-based queries.
 *
 * @description
 * Provides standardized Zod schemas for validating optional query parameters when fetching Seat data.
 * - `SeatQueryMatchFiltersSchema` validates filtering parameters for Seat fields.
 * - `SeatQueryReferenceFilterSchema` validates reference-based filters (e.g., filtering by showing).
 * - `SeatQueryMatchSortsSchema` validates sorting parameters for Mongoose `$sort` operations.
 * - `SeatQueryOptionsSchema` merges all filters and sorts into a single schema for complete query validation.
 *
 * These schemas ensure that API query parameters are type-safe, optional, and correctly formatted for use in Mongoose queries.
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
 * Zod schema for validating Seat filtering query parameters.
 *
 * All fields are optional and correspond to filterable Seat properties.
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
    _id: URLParamObjectIDSchema,
    row: URLParamStringSchema,
    seatNumber: URLParamPositiveNumberSchema,
    seatLabel: URLParamStringSchema,
    seatType: SeatTypeEnum.optional(),
    layoutType: SeatLayoutTypeEnum.optional(),
    isAvailable: URLParamBooleanSchema,
    theatre: URLParamObjectIDSchema,
    screen: URLParamObjectIDSchema,
    priceMultiplier: URLParamNonNegativeNumberSchema,
});

/**
 * Zod schema for validating reference-based filters for Seats.
 *
 * Currently supports filtering by associated Showing ID.
 */
export const SeatQueryReferenceFilterSchema = z.object({
    showing: URLParamObjectIDSchema,
});

/**
 * Zod schema for validating Seat sorting query parameters.
 *
 * Each property corresponds to a field that can be sorted in a Mongoose `$sort`.
 * Accepts `1` for ascending and `-1` for descending.
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
 * Combined Zod schema for validating all Seat query options.
 *
 * Merges filter, reference, and sort schemas into a single schema for complete query validation.
 *
 * @example
 * ```ts
 * const queryOptions = SeatQueryOptionsSchema.parse({
 *   row: "A",
 *   sortBySeatNumber: 1,
 *   showing: "64f7a1c3d5a3b4f6e7c8a123",
 * });
 * ```
 */
export const SeatQueryOptionsSchema = SeatQueryMatchFiltersSchema
    .merge(SeatQueryReferenceFilterSchema)
    .merge(SeatQueryMatchSortsSchema);
