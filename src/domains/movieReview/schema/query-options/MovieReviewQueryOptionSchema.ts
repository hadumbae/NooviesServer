/**
 * @file Zod schema for MovieReview query options.
 * MovieReviewQueryOptionSchema.ts
 */

import {z} from "zod";
import {MovieReviewMatchQueryFilterSchema, MovieReviewMatchQuerySortSchema} from "./MovieReviewMatchQuerySchemas.js";

/**
 * Combined query parameter schema for filtering and sorting MovieReviews.
 */
export const MovieReviewQueryOptionSchema = MovieReviewMatchQueryFilterSchema.merge(MovieReviewMatchQuerySortSchema);

/**
 * Inferred type for MovieReview query options.
 */
export type MovieReviewQueryOptions = z.infer<typeof MovieReviewQueryOptionSchema>;