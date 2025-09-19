import { z } from "zod";
import { URLParamObjectIDSchema } from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import { URLParamNonNegativeNumberSchema } from "../../../../shared/schema/url/URLParamNonNegativeNumberSchema.js";
import { URLParamPositiveNumberSchema } from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import { ScreenTypeEnum } from "../enum/ScreenTypeEnum.js";
import { URLParamMongooseSortOrderSchema } from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Zod schema for filtering screens based on optional or required query parameters.
 *
 * Fields:
 * - `theatre`: ID of the theatre (required, must be a valid MongoDB ObjectId)
 * - `capacity`: Minimum screen capacity (optional, must be a positive number)
 * - `screenType`: Type of screen (optional, e.g., IMAX, Standard)
 *
 * Typically used for constructing MongoDB filter queries.
 */
export const ScreenQueryFiltersSchema = z.object({
    theatre: URLParamObjectIDSchema,
    capacity: URLParamPositiveNumberSchema,
    screenType: ScreenTypeEnum.optional(),
});

/**
 * Zod schema for additional query parameters for screens.
 *
 * Fields:
 * - `showingsPerScreen`: Number of showings to retrieve per screen (non-negative number)
 */
export const ScreenQueryParamsSchema = z.object({
    showingsPerScreen: URLParamNonNegativeNumberSchema,
});

/**
 * Zod schema for specifying sorting of screens.
 *
 * Fields:
 * - `sortByCapacity`: Sort order for screen capacity (ascending/descending)
 * - `sortByScreenType`: Sort order for screen type (ascending/descending)
 */
export const ScreenQuerySortsSchema = z.object({
    sortByCapacity: URLParamMongooseSortOrderSchema,
    sortByScreenType: URLParamMongooseSortOrderSchema,
});

/**
 * Combined Zod schema for all screen query options.
 *
 * This merges filters, additional query params, and sort specifications
 * into a single schema for validating incoming HTTP query parameters.
 *
 * Example usage:
 * ```ts
 * const options = ScreenQueryOptionsSchema.parse(req.query);
 * // options: {
 * //   theatre: "64abc123...",
 * //   capacity: 200,
 * //   screenType: "IMAX",
 * //   showingsPerScreen: 5,
 * //   sortByCapacity: 1,
 * //   sortByScreenType: -1
 * // }
 * ```
 */
export const ScreenQueryOptionsSchema = ScreenQueryParamsSchema.merge(
    ScreenQueryFiltersSchema.merge(ScreenQuerySortsSchema)
);
