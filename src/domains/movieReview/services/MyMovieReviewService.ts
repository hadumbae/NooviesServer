/**
 * @file Current user MovieReview query service.
 * MyMovieReviewService.ts
 */

import type { FetchPaginatedUserReviewsParams } from "./MyMovieReviewService.types.js";
import { MovieReviewModel } from "../model/MovieReview.model.js";
import { MovieReviewPopulatePaths } from "../queries/MovieReviewPopulatePaths.js";

/**
 * Fetches paginated MovieReviews for the authenticated user.
 */
export const fetchCurrentUserMovieReviews = (
    { userID, page, perPage }: FetchPaginatedUserReviewsParams
) => {
    return MovieReviewModel
        .find({ user: userID })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .populate(MovieReviewPopulatePaths)
        .lean();
}