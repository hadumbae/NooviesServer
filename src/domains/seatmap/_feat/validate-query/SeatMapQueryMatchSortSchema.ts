/**
 * @fileoverview Validation schema for sorting SeatMap entities in database queries.
 * Normalizes user-facing sort parameters for seat availability and pricing lookups.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for SeatMap queries.
 */
export const SeatMapQueryMatchSortSchema = z.object({
    sortByPrice: URLParamSortOrderSchema,
    sortByStatus: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from SeatMapQueryMatchSortSchema.
 * Provides type safety when constructing the `$sort` stage for seating chart aggregations.
 */
export type SeatMapQueryMatchSorts = z.infer<typeof SeatMapQueryMatchSortSchema>;