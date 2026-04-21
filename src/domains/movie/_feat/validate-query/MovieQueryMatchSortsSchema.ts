/**
 * @fileoverview Validation schema for sorting Movie entities in database queries.
 * Normalizes user-facing sort parameters into standard Mongoose-compatible order values.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining sort criteria for Movie queries.
 */
export const MovieQueryMatchSortsSchema = z.object({
    sortByReleaseDate: URLParamSortOrderSchema,
    sortByTitle: URLParamSortOrderSchema,
    sortByOriginalTitle: URLParamSortOrderSchema,
    sortByIsReleased: URLParamSortOrderSchema,
    sortByIsAvailable: URLParamSortOrderSchema,
    sortByCountry: URLParamSortOrderSchema,
});

/**
 * TypeScript type inferred from MovieQueryMatchSortsSchema.
 */
export type MovieQueryMatchSorts = z.infer<typeof MovieQueryMatchSortsSchema>;