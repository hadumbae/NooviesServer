/**
 * @file Parameters for fetching user MovieReviews.
 * MyMovieReviewService.types.ts
 */

import { Types } from "mongoose";

/**
 * Pagination parameters for user MovieReview queries.
 */
export type FetchPaginatedUserReviewsParams = {
    userID: Types.ObjectId;
    page: number;
    perPage: number;
}