/**
 * @fileoverview Parameter and return types for movie review browse services.
 */

import {Types} from "mongoose";
import type {RequestOptions} from "@/shared/_feat/fetch-request-options/schemas";
import type {MovieReviewSchemaFields} from "@/domains/movieReview/model/model/MovieReview.types";
import type {PaginationReturns} from "@/shared/types/PaginationReturns";

/** Parameters for paginated movie review retrieval. */
export type BrowseReviewsByMovieConfig = {
    movieID: Types.ObjectId;
    page: number;
    perPage: number;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};

/** Parameters for retrieving featured reviews for a movie. */
export type FeaturedReviewsByMovieConfig = {
    movieID: Types.ObjectId;
    userID: Types.ObjectId;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};

/** Featured review results for a movie. */
export type FeaturedReviewsByMovieReturns = {
    userReview: MovieReviewSchemaFields | null;
    reviews: MovieReviewSchemaFields[];
};

/** Parameters for review retrieval including user context. */
export type ReviewDetailsByMovieConfig = BrowseReviewsByMovieConfig & {
    userID: Types.ObjectId;
};

/** Paginated reviews with aggregate rating and user-specific review. */
export type ReviewDetailsByMovieReturns = PaginationReturns<MovieReviewSchemaFields> & {
    averageRating: number | null;
    userReview: MovieReviewSchemaFields | null;
};