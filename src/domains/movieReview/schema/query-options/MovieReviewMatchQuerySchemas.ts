/**
 * @file Zod schemas for MovieReview match query filters and sorting.
 * MovieReviewMatchQuerySchemas.ts
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamPositiveNumberSchema} from "../../../../shared/schema/url/URLParamPositiveNumberSchema.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";

/**
 * Query parameter schema for filtering MovieReviews.
 */
export const MovieReviewMatchQueryFilterSchema = z.object({
    movieID: URLParamObjectIDSchema,
    rating: URLParamPositiveNumberSchema,
    isRecommended: URLParamBooleanSchema,
});

/**
 * Inferred type for MovieReview filter query parameters.
 */
export type MovieReviewMatchQueryFilters = z.infer<typeof MovieReviewMatchQueryFilterSchema>;

/**
 * Query parameter schema for sorting MovieReviews.
 */
export const MovieReviewMatchQuerySortSchema = z.object({
    sortByRating: URLParamMongooseSortOrderSchema,
});

/**
 * Inferred type for MovieReview sort query parameters.
 */
export type MovieReviewMatchQuerySorts = z.infer<typeof MovieReviewMatchQuerySortSchema>;