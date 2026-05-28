/**
 * @file Parameter contracts for current-user MovieReview services.
 * MyMovieReviewService.types.ts
 */

import {Types} from "mongoose";
import type {RequestOptions} from "@shared/types/request-options/RequestOptions.js";
import type {MovieReviewSchemaFields} from "@domains/movieReview/model/model/MovieReview.types";
import type {
    MovieReviewCreateInputData,
    MovieReviewUpdateInputData
} from "@domains/movieReview/_feat/validate-submit/schemas";

/**
 * Input for fetching paginated user-owned MovieReviews.
 */
export type FetchPaginatedUserReviewsConfig = {
    userID: Types.ObjectId;
    page: number;
    perPage: number;
    options?: Pick<RequestOptions, "virtuals" | "populate">
}

/**
 * Input for creating a user-owned MovieReview.
 */
export type CreateUserMovieReviewConfig = {
    userID: Types.ObjectId;
    data: MovieReviewCreateInputData;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
}

/**
 * Input for updating a user-owned MovieReview.
 */
export type UpdateUserMovieReviewConfig = {
    reviewID: Types.ObjectId;
    userID: Types.ObjectId;
    data: MovieReviewUpdateInputData;
    unset?: Partial<MovieReviewSchemaFields>;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
}

/**
 * Input for deleting a user-owned MovieReview.
 */
export type DeleteUserMovieReviewConfig = {
    reviewID: Types.ObjectId;
    userID: Types.ObjectId;
}