/**
 * @fileoverview Validation schema for sorting Showing entities in database queries.
 * Normalizes user-facing sort parameters for showtime scheduling and chronological ordering.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for Showing queries.
 */
export const ShowingQueryMatchSortSchema = z.object({
    sortByStartTime: URLParamSortOrderSchema,
    sortByEndTime: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from ShowingQueryMatchSortSchema.
 */
export type ShowingQueryMatchSorts = z.infer<typeof ShowingQueryMatchSortSchema>;