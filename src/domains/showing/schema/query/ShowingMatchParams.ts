/**
 * @file ShowingQueryMatchSchema.ts
 *
 * Zod schemas defining match-level filters and sort options
 * for Showing queries.
 *
 * These fields map directly to properties stored on the
 * Showing document itself.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamPositiveNumberSchema} from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {ShowingStatusEnumSchema} from "../ShowingStatusEnumSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Match filters applied directly to Showing fields.
 */
export const ShowingQueryMatchFilterSchema = z.object({
    /** Movie ObjectId */
    movie: URLParamObjectIDSchema,

    /** Theatre ObjectId */
    theatre: URLParamObjectIDSchema,

    /** Screen ObjectId */
    screen: URLParamObjectIDSchema,

    /** Minimum ticket price */
    ticketPrice: URLParamPositiveNumberSchema,

    /** Special event flag */
    isSpecialEvent: URLParamBooleanSchema,

    /** Active flag */
    isActive: URLParamBooleanSchema,

    /** Showing lifecycle status */
    status: ShowingStatusEnumSchema.optional(),
});

/**
 * Inferred type for match-level showing filters.
 */
export type ShowingQueryMatchFilters = z.infer<typeof ShowingQueryMatchFilterSchema>;

/**
 * Sort options applied to Showing queries.
 *
 * MongoDB semantics:
 * - `1`  → ascending
 * - `-1` → descending
 */
export const ShowingQueryMatchSortSchema = z.object({
    /** Sort by start time */
    sortByStartTime: URLParamMongooseSortOrderSchema,

    /** Sort by end time */
    sortByEndTime: URLParamMongooseSortOrderSchema,
});

/**
 * Inferred type for showing sort options.
 */
export type ShowingQueryMatchSorts = z.infer<typeof ShowingQueryMatchSortSchema>;
