/**
 * @fileoverview Defines the combined schema for filtering and sorting movie review queries.
 */

import {z} from "zod";
import {MovieReviewQueryMatchSortSchema} from "@/domains/movieReview/_feat/validate-query-options/query-schemas/MovieReviewQueryMatchSortSchema";
import {
    MovieReviewQueryMatchFilterSchema
} from "@/domains/movieReview/_feat/validate-query-options/query-schemas/MovieReviewQueryMatchFilterSchema";

/** Zod schema merging movie review filter and sort options. */
export const MovieReviewQueryOptionSchema = MovieReviewQueryMatchFilterSchema.merge(MovieReviewQueryMatchSortSchema);

/** Type definition for movie review query options inferred from the schema. */
export type MovieReviewQueryOptions = z.infer<typeof MovieReviewQueryOptionSchema>;