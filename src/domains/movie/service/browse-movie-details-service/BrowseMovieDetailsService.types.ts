/**
 * @file Parameter and return types for movie review browse services.
 * BrowseMovieDetailsService.types.ts
 */

import {Types} from "mongoose";
import type {RequestOptions} from "../../../../shared/types/request-options/RequestOptions.js";
import type {PaginationReturns} from "../../../../shared/types/PaginationReturns.js";
import type {MovieReviewSchemaFields} from "../../../movieReview/model/MovieReview.types.js";

/**
 * Parameters for paginated movie review retrieval.
 */
export type BrowseReviewsByMovieParams = {
    movieID: Types.ObjectId;
    page: number;
    perPage: number;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
}

/**
 * Parameters for review retrieval including user context.
 */
export type ReviewDetailsByMovieParams = BrowseReviewsByMovieParams & {
    userID: Types.ObjectId;
}

/**
 * Paginated review data with aggregate rating and user-specific review.
 */
export type ReviewDetailsByMovieReturns = PaginationReturns<MovieReviewSchemaFields> & {
    averageRating: number | null;
    userReview: MovieReviewSchemaFields | null;
}