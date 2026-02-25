/**
 * @file MovieReview ownership check utility.
 * checkMovieReviewOwnership.ts
 */

import {Types} from "mongoose";
import {MovieReview} from "../model/MovieReview.model.js";

/**
 * Parameters for `checkMovieReviewOwnership`
 * */
type OwnershipParams = {
    userID: Types.ObjectId;
    reviewID: Types.ObjectId;
};

/**
 * Verifies whether a MovieReview belongs to the specified user.
 */
export async function checkMovieReviewOwnership(
    {userID, reviewID}: OwnershipParams
): Promise<boolean> {
    const review = await MovieReview.findById(reviewID).orFail();
    return review.user.equals(userID) ?? null;
}