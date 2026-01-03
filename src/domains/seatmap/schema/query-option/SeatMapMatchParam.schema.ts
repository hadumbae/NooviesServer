/**
 * @file SeatMapMatchParam.schema.ts
 *
 * @summary
 * Zod schemas and inferred types for seat map match filtering and sorting.
 *
 * @description
 * Defines query-compatible schemas used to:
 * - Filter seat map entries by showing, seat, price, and status
 * - Sort seat map results by price and/or status
 *
 * These schemas are intended for URL/query parameter validation and
 * MongoDB aggregation match/sort stages.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamPositiveNumberSchema} from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import {SeatMapStatusEnumSchema} from "../enum/SeatMapStatusEnumSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Seat map match filter schema.
 *
 * @description
 * Filters seat map documents based on showing, seat, price,
 * and optionally seat status.
 */
export const SeatMapMatchFilterSchema = z.object({
    showing: URLParamObjectIDSchema,
    seat: URLParamObjectIDSchema,
    price: URLParamPositiveNumberSchema,
    status: SeatMapStatusEnumSchema.optional(),
});

/**
 * Inferred TypeScript type for seat map match filters.
 */
export type SeatMapMatchFilters = z.infer<typeof SeatMapMatchFilterSchema>;

/**
 * Seat map match sort schema.
 *
 * @description
 * Defines supported sort keys and MongoDB-compatible sort order
 * for seat map query results.
 */
export const SeatMapMatchSortSchema = z.object({
    sortByPrice: URLParamMongooseSortOrderSchema,
    sortByStatus: URLParamMongooseSortOrderSchema,
});

/**
 * Inferred TypeScript type for seat map match sorts.
 */
export type SeatMapMatchSorts = z.infer<typeof SeatMapMatchSortSchema>;
