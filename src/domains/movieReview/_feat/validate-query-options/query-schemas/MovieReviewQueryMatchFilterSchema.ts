/**
 * @fileoverview Defines the schema and types for filtering movie review queries.
 */

import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {URLParamPositiveNumberSchema} from "@shared/schema/url/URLParamPositiveNumberSchema";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {z} from "zod";

/** Zod schema for validating movie review match query filters from URL parameters. */
export const MovieReviewQueryMatchFilterSchema = z.object({
    movieID: URLParamObjectIDSchema,
    rating: URLParamPositiveNumberSchema,
    isRecommended: URLParamBooleanSchema,
});

/** Type definition inferred from MovieReviewMatchQueryFilterSchema. */
export type MovieReviewQueryMatchFilters = z.infer<typeof MovieReviewQueryMatchFilterSchema>;