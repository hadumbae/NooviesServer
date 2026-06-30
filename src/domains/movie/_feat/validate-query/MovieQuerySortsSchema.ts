/**
 * @fileoverview Validation schema for sorting Movie entities in database queries.
 *
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@/shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for Movie queries.
 */
export const MovieQuerySortsSchema = z.object({
    sortByReleaseDate: URLParamSortOrderSchema,
    sortByTitle: URLParamSortOrderSchema,
    sortByOriginalTitle: URLParamSortOrderSchema,
    sortByIsReleased: URLParamSortOrderSchema,
    sortByIsAvailable: URLParamSortOrderSchema,
    sortByCountry: URLParamSortOrderSchema,
});

/**
 * Sort criteria for Movie queries.
 */
export type MovieQuerySorts = z.infer<typeof MovieQuerySortsSchema>;