/**
 * @fileoverview Validation schema for sorting Seat entities in database queries.
 * Integrates flexible sort order parsing for UI-driven data tables.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for Seat queries.
 */
export const SeatQueryMatchSortsSchema = z.object({
    sortByTheatre: URLParamSortOrderSchema,
    sortByScreen: URLParamSortOrderSchema,
    sortByRow: URLParamSortOrderSchema,
    sortBySeatNumber: URLParamSortOrderSchema,
    sortBySeatLabel: URLParamSortOrderSchema,
    sortBySeatType: URLParamSortOrderSchema,
    sortByIsAvailable: URLParamSortOrderSchema,
    sortByPriceMultiplier: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from SeatQueryMatchSortsSchema.
 */
export type SeatQueryMatchSorts = z.infer<typeof SeatQueryMatchSortsSchema>;