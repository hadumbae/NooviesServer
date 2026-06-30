/**
 * @fileoverview Defines the Zod schema for sorting movie review match queries.
 */

import {z} from "zod";
import {URLParamSortOrderSchema} from "@/shared/_feat/parse-query-string";

/** Zod schema for validating movie review sort parameters. */
export const MovieReviewQueryMatchSortSchema = z.object({
    sortByRating: URLParamSortOrderSchema,
});

/** Type definition for movie review match query sort options. */
export type MovieReviewQueryMatchSorts = z.infer<typeof MovieReviewQueryMatchSortSchema>;