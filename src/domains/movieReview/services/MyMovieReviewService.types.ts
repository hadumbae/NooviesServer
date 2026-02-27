/**
 * @file Parameter contracts for current-user MovieReview services.
 * MyMovieReviewService.types.ts
 */

import {Types} from "mongoose";
import type {MovieReviewCreateInputData} from "../schema/MovieReviewCreateInputSchema.js";
import type {RequestOptions} from "../../../shared/types/request-options/RequestOptions.js";
import type {MovieReviewUpdateInputData} from "../schema/MovieReviewUpdateInputSchema.js";
import type {MovieReviewSchemaFields} from "../model/MovieReview.types.js";

/**
 * Input for fetching paginated user-owned MovieReviews.
 */
export type FetchPaginatedUserReviewsParams = {
    userID: Types.ObjectId;
    page: number;
    perPage: number;
    options?: Pick<RequestOptions, "virtuals" | "populate">
}

/**
 * Input for creating a user-owned MovieReview.
 */
export type CreateUserMovieReviewParams = {
    userID: Types.ObjectId;
    data: MovieReviewCreateInputData;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
}

/**
 * Input for updating a user-owned MovieReview.
 */
export type UpdateUserMovieReviewParams = {
    reviewID: Types.ObjectId;
    userID: Types.ObjectId;
    data: MovieReviewUpdateInputData;
    unset?: Partial<MovieReviewSchemaFields>;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
}

/**
 * Input for deleting a user-owned MovieReview.
 */
export type DeleteUserMovieReviewParams = {
    reviewID: Types.ObjectId;
    userID: Types.ObjectId;
}