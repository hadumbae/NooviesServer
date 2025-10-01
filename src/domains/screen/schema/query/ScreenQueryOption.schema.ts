import { z } from "zod";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import { ScreenTypeEnum } from "../enum/ScreenTypeEnum.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";

/**
 * Filters that can be applied to Screen documents.
 *
 * @remarks
 * All fields are optional in queries; if a value is provided, it will be used
 * to filter results. Supports filtering by theatre, name, capacity, type, and _id.
 */
export const ScreenQueryMatchFilterSchema = z.object({
    /** Unique identifier of the screen. */
    _id: URLParamObjectIDSchema,

    /** Name of the screen. */
    name: URLParamStringSchema,

    /** Associated theatre ID. */
    theatre: URLParamObjectIDSchema,

    /** Seating capacity of the screen. Must be a positive number. */
    capacity: URLParamPositiveNumberSchema,

    /** Type of the screen (e.g., IMAX, Standard). Optional. */
    screenType: ScreenTypeEnum.optional(),
});

/**
 * Sorting options for Screen queries.
 *
 * Each field corresponds to a property in the Screen model and can be sorted
 * ascending (1) or descending (-1).
 */
export const ScreenQueryMatchSortSchema = z.object({
    /** Sort by screen name. */
    sortByName: URLParamMongooseSortOrderSchema,

    /** Sort by seating capacity. */
    sortByCapacity: URLParamMongooseSortOrderSchema,

    /** Sort by screen type. */
    sortByScreenType: URLParamMongooseSortOrderSchema,

    /** Sort by creation date. */
    sortByCreatedAt: URLParamMongooseSortOrderSchema,
});

/**
 * Additional parameters for Screen queries.
 *
 * Example: the number of showings per screen to return in aggregated queries.
 */
export const ScreenQueryParamSchema = z.object({
    /** Optional limit on showings per screen. Must be non-negative. */
    showingsPerScreen: URLParamNonNegativeNumberSchema,
});

/**
 * Complete Zod schema for all Screen query options.
 *
 * Combines:
 * - Filter criteria from {@link ScreenQueryMatchFilterSchema}
 * - Sorting options from {@link ScreenQueryMatchSortSchema}
 * - Extra parameters from {@link ScreenQueryParamSchema}
 *
 * @example
 * // GET /screens?theatre=123&sortByCapacity=1&showingsPerScreen=5
 * const query = ScreenQueryOptionsSchema.parse(req.query);
 */
export const ScreenQueryOptionsSchema = ScreenQueryParamSchema.merge(
    ScreenQueryMatchFilterSchema.merge(ScreenQueryMatchSortSchema)
);
