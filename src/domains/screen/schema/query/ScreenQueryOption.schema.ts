import { z } from "zod";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import { ScreenTypeEnum } from "../enum/ScreenTypeEnum.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import { URLParamStringSchema } from "../../../../shared/schema/url/URLParamStringSchema.js";

/**
 * Zod schema for filtering screens in queries.
 *
 * Supports filtering by screen ID, name, associated theatre, capacity, and screen type.
 */
export const ScreenQueryFiltersSchema = z.object({
    /** Filter by screen ID (MongoDB ObjectID) */
    _id: URLParamObjectIDSchema,

    /** Filter by screen name */
    name: URLParamStringSchema,

    /** Filter by the ID of the associated theatre */
    theatre: URLParamObjectIDSchema,

    /** Filter by screen capacity (must be positive) */
    capacity: URLParamPositiveNumberSchema,

    /** Filter by screen type (optional) */
    screenType: ScreenTypeEnum.optional(),
});

/**
 * Zod schema for sorting screens in queries.
 *
 * Each field accepts a MongoDB sort order (`1` for ascending, `-1` for descending).
 */
export const ScreenQuerySortsSchema = z.object({
    /** Sort by screen capacity */
    sortByName: URLParamMongooseSortOrderSchema,

    sortByCapacity: URLParamMongooseSortOrderSchema,

    /** Sort by screen type */
    sortByScreenType: URLParamMongooseSortOrderSchema,

    sortByCreatedAt: URLParamMongooseSortOrderSchema,
});

/**
 * Zod schema for additional screen query parameters.
 *
 * Currently supports:
 * - `showingsPerScreen`: number of showings to fetch per screen (non-negative)
 */
export const ScreenQueryParamsSchema = z.object({
    /** Number of showings per screen to retrieve (non-negative) */
    showingsPerScreen: URLParamNonNegativeNumberSchema,
});

/**
 * Combined Zod schema for all screen query options.
 *
 * Merges filters, sorting, and additional parameters into a single schema.
 */
export const ScreenQueryOptionsSchema = ScreenQueryParamsSchema.merge(
    ScreenQueryFiltersSchema.merge(ScreenQuerySortsSchema)
);
