/**
 * @file Parameter and return types for movie review browse services.
 * @filename BrowseMovieDetailsService.types.ts
 */

import { Types } from "mongoose";
import type { RequestOptions } from "../../../../shared/types/request-options/RequestOptions.js";
import type { PaginationReturns } from "../../../../shared/types/PaginationReturns.js";
import type { MovieReviewSchemaFields } from "../../../movieReview/model/MovieReview.types.js";

/**
 * Parameters for paginated movie review retrieval.
 */
export type BrowseReviewsByMovieParams = {
    /** Target movie identifier. */
    movieID: Types.ObjectId;

    /** Page number (1-based). */
    page: number;

    /** Number of reviews per page. */
    perPage: number;

    /** Optional query modifiers. */
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};

/**
 * Parameters for retrieving featured reviews for a movie.
 */
export type FeaturedReviewsByMovieParams = {
    /** Target movie identifier. */
    movieID: Types.ObjectId;

    /** Current user identifier. */
    userID: Types.ObjectId;

    /** Optional query modifiers. */
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};

/**
 * Featured review results for a movie.
 */
export type FeaturedReviewsByMovieReturns = {
    /** Review authored by the requesting user, if present. */
    userReview: MovieReviewSchemaFields | null;

    /** Additional featured reviews. */
    reviews: MovieReviewSchemaFields[];
};

/**
 * Parameters for review retrieval including user context.
 */
export type ReviewDetailsByMovieParams = BrowseReviewsByMovieParams & {
    /** Current user identifier. */
    userID: Types.ObjectId;
};

/**
 * Paginated reviews with aggregate rating and user-specific review.
 */
export type ReviewDetailsByMovieReturns =
    PaginationReturns<MovieReviewSchemaFields> & {
    /** Average rating across all reviews. */
    averageRating: number | null;

    /** Review authored by the requesting user, if present. */
    userReview: MovieReviewSchemaFields | null;
};